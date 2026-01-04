<?php
$targetHex = "#4B7D62";
$config = [
    'r' => hexdec(substr($targetHex, 1, 2)),
    'g' => hexdec(substr($targetHex, 3, 2)),
    'b' => hexdec(substr($targetHex, 5, 2)),
    'coords' => [
        ['x' => 180, 'y' => 266],
        ['x' => 423, 'y' => 243],
        ['x' => 415, 'y' => 476],
        ['x' => 192, 'y' => 504]
    ]
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    ini_set('memory_limit', '1024M');
    set_time_limit(120);
    header('Content-Type: application/json');

    try {
        $qrData = $_POST['qr_image'] ?? '';
        if (!$qrData) throw new Exception("No QR provided.");
        if (!file_exists('bg.jpg')) throw new Exception("bg.jpg missing.");

        $bgImage = imagecreatefromjpeg('bg.jpg');
        $parts = explode(',', $qrData);
        $qrBinary = base64_decode(count($parts) > 1 ? $parts[1] : $parts[0]);
        $qrImage = imagecreatefromstring($qrBinary);

        if (!$bgImage || !$qrImage) throw new Exception("Process failed.");

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

                if ($r < 110 && $g < 110 && $b < 110) {
                    $newCol = imagecolorallocatealpha($qrImage, $config['r'], $config['g'], $config['b'], $a);
                    imagesetpixel($qrImage, $x, $y, $newCol);
                }
            }
        }

        $warper = new Warper();
        $finalImage = $warper->warp($qrImage, $bgImage, $config['coords']);

        ob_start();
        imagejpeg($finalImage, null, 95);
        $imageData = ob_get_clean();
        
        echo json_encode(['success' => true, 'image' => 'data:image/jpeg;base64,' . base64_encode($imageData)]);
        exit;
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        exit;
    }
}

class Warper {
    public function warp($src, $dst, $c) {
        $sw = imagesx($src); $sh = imagesy($src);
        $x0 = $c[0]['x']; $y0 = $c[0]['y'];
        $x1 = $c[1]['x']; $y1 = $c[1]['y'];
        $x2 = $c[2]['x']; $y2 = $c[2]['y'];
        $x3 = $c[3]['x']; $y3 = $c[3]['y'];

        $minX = floor(min($x0, $x1, $x2, $x3)); $maxX = ceil(max($x0, $x1, $x2, $x3));
        $minY = floor(min($y0, $y1, $y2, $y3)); $maxY = ceil(max($y0, $y1, $y2, $y3));
        
        $H = $this->getH([$x0,$y0],[$x1,$y1],[$x2,$y2],[$x3,$y3], [0,0],[$sw,0],[$sw,$sh],[0,$sh]);

        for ($y = $minY; $y <= $maxY; $y++) {
            for ($x = $minX; $x <= $maxX; $x++) {
                $w = $H[6]*$x + $H[7]*$y + $H[8];
                if ($w == 0) continue;
                $sx = ($H[0]*$x + $H[1]*$y + $H[2]) / $w;
                $sy = ($H[3]*$x + $H[4]*$y + $H[5]) / $w;

                if ($sx >= 0 && $sx < $sw && $sy >= 0 && $sy < $sh) {
                    imagesetpixel($dst, $x, $y, imagecolorat($src, (int)$sx, (int)$sy));
                }
            }
        }
        return $dst;
    }

    private function getH($p0,$p1,$p2,$p3, $q0,$q1,$q2,$q3) {
        $m = []; $r = [];
        $pts = [$p0, $p1, $p2, $p3]; $tgs = [$q0, $q1, $q2, $q3];
        for($i=0; $i<4; $i++) {
            $x = $pts[$i][0]; $y = $pts[$i][1]; $u = $tgs[$i][0]; $v = $tgs[$i][1];
            $m[] = [$x, $y, 1, 0, 0, 0, -$u*$x, -$u*$y]; $r[] = $u;
            $m[] = [0, 0, 0, $x, $y, 1, -$v*$x, -$v*$y]; $r[] = $v;
        }
        $res = $this->solve($m, $r); $res[] = 1.0;
        return $res;
    }

    private function solve($A, $B) {
        $n = count($B);
        for ($i=0; $i<$n; $i++) {
            $p = $A[$i][$i] ?: 1e-6;
            for ($j=$i+1; $j<$n; $j++) {
                $f = $A[$j][$i] / $p;
                $B[$j] -= $f * $B[$i];
                for ($k=$i; $k<$n; $k++) $A[$j][$k] -= $f * $A[$i][$k];
            }
        }
        $X = array_fill(0, $n, 0);
        for ($i=$n-1; $i>=0; $i--) {
            $s = 0;
            for ($j=$i+1; $j<$n; $j++) $s += $A[$i][$j] * $X[$j];
            $X[$i] = ($B[$i] - $s) / ($A[$i][$i] ?: 1e-6);
        }
        return $X;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR Theme Generator</title>
    <style>
        body { font-family: sans-serif; background: #f4f7f6; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: center; width: 90%; max-width: 400px; border-top: 5px solid <?php echo $targetHex; ?>; }
        h2 { color: <?php echo $targetHex; ?>; margin-bottom: 1.5rem; }
        .upload-area { border: 2px dashed <?php echo $targetHex; ?>; padding: 2rem; border-radius: 8px; cursor: pointer; margin-bottom: 1rem; color: <?php echo $targetHex; ?>; }
        #preview { max-width: 100%; margin-top: 1rem; border-radius: 8px; display: none; }
        .btn { background: <?php echo $targetHex; ?>; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; width: 100%; font-weight: bold; }
        #loading { display: none; margin: 10px 0; font-weight: bold; color: <?php echo $targetHex; ?>; }
    </style>
</head>
<body>
<div class="card">
    <h2>QR Generator</h2>
    <div class="upload-area" onclick="document.getElementById('fileInp').click()">
        <span>Upload QR Code</span>
        <input type="file" id="fileInp" accept="image/*" hidden>
    </div>
    <div id="loading">Processing...</div>
    <img id="preview" src="">
    <button class="btn" id="dlBtn" style="display:none; margin-top:10px;">Download Image</button>
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
                        link.download = 'themed_qr.jpg';
                        link.click();
                    };
                } else {
                    alert(data.error);
                }
            } catch (err) {
                alert("Error connecting to server.");
            } finally {
                loading.style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    };
</script>
</body>
</html>