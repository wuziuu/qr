<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    ini_set('memory_limit', '1024M');
    set_time_limit(120);
    header('Content-Type: application/json');

    try {
        $qrData = $_POST['qr_image'] ?? '';
        $coords = [
            ['x' => 389, 'y' => 350], // TL
            ['x' => 681, 'y' => 345], // TR
            ['x' => 626, 'y' => 664], // BR
            ['x' => 312, 'y' => 617]  // BL
        ];

        if (!$qrData) throw new Exception("Please upload a QR code.");
        if (!file_exists('bg.jpg')) throw new Exception("Thiếu ảnh.");
        $bgImage = imagecreatefromjpeg('bg.jpg');
        $parts = explode(',', $qrData);
        $qrBinary = base64_decode(count($parts) > 1 ? $parts[1] : $parts[0]);
        $qrImage = imagecreatefromstring($qrBinary);

        if (!$bgImage || !$qrImage) throw new Exception("Failed to process images.");
        $targetR = 0xEB; $targetG = 0x42; $targetB = 0x5F;
        
        imagealphablending($qrImage, false);
        imagesavealpha($qrImage, true);
        
        $qw = imagesx($qrImage);
        $qh = imagesy($qrImage);
        
        for ($x = 0; $x < $qw; $x++) {
            for ($y = 0; $y < $qh; $y++) {
                $rgba = imagecolorat($qrImage, $x, $y);
                $r = ($rgba >> 16) & 0xFF;
                $g = ($rgba >> 8) & 0xFF;
                $b = $rgba & 0xFF;
                $a = ($rgba & 0x7F000000) >> 24;

                if ($r < 100 && $g < 100 && $b < 100) {
                    $newCol = imagecolorallocatealpha($qrImage, $targetR, $targetG, $targetB, $a);
                    imagesetpixel($qrImage, $x, $y, $newCol);
                }
            }
        }

        $warper = new PerspectiveWarper();
        $finalImage = $warper->warp($qrImage, $bgImage, $coords);

        ob_start();
        imagejpeg($finalImage, null, 90);
        $imageData = ob_get_clean();
        
        echo json_encode(['success' => true, 'image' => 'data:image/jpeg;base64,' . base64_encode($imageData)]);
        exit;

    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        exit;
    }
}

class PerspectiveWarper {
    public function warp($srcImg, $dstImg, $coords) {
        $sw = imagesx($srcImg); $sh = imagesy($srcImg);
        $x0 = $coords[0]['x']; $y0 = $coords[0]['y'];
        $x1 = $coords[1]['x']; $y1 = $coords[1]['y'];
        $x2 = $coords[2]['x']; $y2 = $coords[2]['y'];
        $x3 = $coords[3]['x']; $y3 = $coords[3]['y'];

        $minX = floor(min($x0, $x1, $x2, $x3)); $maxX = ceil(max($x0, $x1, $x2, $x3));
        $minY = floor(min($y0, $y1, $y2, $y3)); $maxY = ceil(max($y0, $y1, $y2, $y3));
        
        $H_inv = $this->getHomographyMatrix([$x0,$y0],[$x1,$y1],[$x2,$y2],[$x3,$y3], [0,0],[$sw,0],[$sw,$sh],[0,$sh]);

        for ($y = $minY; $y <= $maxY; $y++) {
            for ($x = $minX; $x <= $maxX; $x++) {
                $w_val = $H_inv[6]*$x + $H_inv[7]*$y + $H_inv[8];
                if ($w_val == 0) continue;
                $srcX = ($H_inv[0]*$x + $H_inv[1]*$y + $H_inv[2]) / $w_val;
                $srcY = ($H_inv[3]*$x + $H_inv[4]*$y + $H_inv[5]) / $w_val;

                if ($srcX >= 0 && $srcX < $sw && $srcY >= 0 && $srcY < $sh) {
                    $color = imagecolorat($srcImg, (int)$srcX, (int)$srcY);
                    imagesetpixel($dstImg, $x, $y, $color);
                }
            }
        }
        return $dstImg;
    }

    private function getHomographyMatrix($p0,$p1,$p2,$p3, $q0,$q1,$q2,$q3) {
        $matrix = []; $rhs = [];
        $pts = [$p0, $p1, $p2, $p3]; $tgs = [$q0, $q1, $q2, $q3];
        for($i=0; $i<4; $i++) {
            $x = $pts[$i][0]; $y = $pts[$i][1]; $u = $tgs[$i][0]; $v = $tgs[$i][1];
            $matrix[] = [$x, $y, 1, 0, 0, 0, -$u*$x, -$u*$y]; $rhs[] = $u;
            $matrix[] = [0, 0, 0, $x, $y, 1, -$v*$x, -$v*$y]; $rhs[] = $v;
        }
        $h = $this->solve($matrix, $rhs); $h[] = 1.0;
        return $h;
    }

    private function solve($A, $B) {
        $n = count($B);
        for ($i=0; $i<$n; $i++) {
            $pivot = $A[$i][$i] ?: 0.000001;
            for ($j=$i+1; $j<$n; $j++) {
                $f = $A[$j][$i] / $pivot;
                $B[$j] -= $f * $B[$i];
                for ($k=$i; $k<$n; $k++) $A[$j][$k] -= $f * $A[$i][$k];
            }
        }
        $X = array_fill(0, $n, 0);
        for ($i=$n-1; $i>=0; $i--) {
            $sum = 0;
            for ($j=$i+1; $j<$n; $j++) $sum += $A[$i][$j] * $X[$j];
            $X[$i] = ($B[$i] - $sum) / ($A[$i][$i] ?: 0.000001);
        }
        return $X;
    }
}

// generate for me a simple html code to generate qr based on my code
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bank QR Generator</title>
    <style>
        body { font-family: sans-serif; background: #f4f4f9; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: center; width: 100%; max-width: 400px; }
        h2 { color: #EB425F; margin-bottom: 1.5rem; }
        .upload-area { border: 2px dashed #ccc; padding: 2rem; border-radius: 8px; cursor: pointer; transition: 0.3s; margin-bottom: 1rem; }
        .upload-area:hover { border-color: #EB425F; background: #fff5f6; }
        #preview { max-width: 100%; margin-top: 1rem; border-radius: 8px; display: none; }
        .btn { background: #EB425F; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; width: 100%; font-weight: bold; }
        .btn:disabled { background: #ccc; }
        #loading { display: none; margin: 10px 0; font-weight: bold; color: #666; }
    </style>
</head>
<body>

<div class="card">
    <h2>Bank QR Generator</h2>
    <p>Upload your QR code to generate the final image.</p>
    
    <div class="upload-area" onclick="document.getElementById('fileInp').click()">
        <span>Click or Drag QR here</span>
        <input type="file" id="fileInp" accept="image/*" hidden>
    </div>

    <div id="loading">Processing... Please wait</div>
    <img id="preview" src="" alt="Result">
    
    <button class="btn" id="dlBtn" style="display:none; margin-top:10px;">Download Final Image</button>
</div>

<script>
    const fileInp = document.getElementById('fileInp');
    const preview = document.getElementById('preview');
    const dlBtn = document.getElementById('dlBtn');
    const loading = document.getElementById('loading');

    fileInp.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async event => {
            loading.style.display = 'block';
            preview.style.display = 'none';
            dlBtn.style.display = 'none';

            const formData = new FormData();
            formData.append('qr_image', event.target.result);

            try {
                const res = await fetch('', { method: 'POST', body: formData });
                const data = await res.json();
                if (data.success) {
                    preview.src = data.image;
                    preview.style.display = 'block';
                    dlBtn.style.display = 'block';
                    dlBtn.onclick = () => {
                        const link = document.createElement('a');
                        link.href = data.image;
                        link.download = 'bank_transfer.jpg';
                        link.click();
                    };
                } else {
                    alert(data.error);
                }
            } catch (err) {
                alert("Server error occurred.");
            } finally {
                loading.style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    };
</script>

</body>
</html>