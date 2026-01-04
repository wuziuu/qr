import { NextRequest, NextResponse } from 'next/server';
import { characters } from '@/config/characters';
import fs from 'fs';
import path from 'path';

// Dynamic import để tránh bundle native module
let canvas: any;
let loadImage: any;
let createCanvas: any;

async function getCanvas() {
  if (!canvas) {
    canvas = await import('@napi-rs/canvas');
    createCanvas = canvas.createCanvas;
    loadImage = canvas.loadImage;
  }
  return { createCanvas, loadImage };
}

export async function POST(request: NextRequest) {
  try {
    // Load canvas module dynamically
    const { createCanvas: createCanvasFn, loadImage: loadImageFn } = await getCanvas();

    const formData = await request.formData();
    const qrImageData = formData.get('qr_image') as File;
    const characterId = formData.get('character_id') as string;

    if (!qrImageData || !characterId) {
      return NextResponse.json(
        { success: false, error: 'Missing required data' },
        { status: 400 }
      );
    }

    const character = characters.find((c) => c.id === characterId);
    if (!character) {
      return NextResponse.json(
        { success: false, error: 'Character not found' },
        { status: 404 }
      );
    }

    // Load background image
    const bgPath = path.join(process.cwd(), 'public', character.bgImage);
    if (!fs.existsSync(bgPath)) {
      return NextResponse.json(
        { success: false, error: 'Background image not found' },
        { status: 404 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await qrImageData.arrayBuffer();
    const qrBuffer = Buffer.from(arrayBuffer);

    // Load images
    const bgImage = await loadImageFn(fs.readFileSync(bgPath));
    const qrImage = await loadImageFn(qrBuffer);

    // Create canvas with background
    const canvas = createCanvasFn(bgImage.width, bgImage.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bgImage, 0, 0);

    // Process QR code - recolor dark pixels
    const qrCanvas = createCanvasFn(qrImage.width, qrImage.height);
    const qrCtx = qrCanvas.getContext('2d');
    qrCtx.drawImage(qrImage, 0, 0);

    const qrImageData_processed = qrCtx.getImageData(0, 0, qrCanvas.width, qrCanvas.height);
    const data = qrImageData_processed.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // If pixel is dark (black), recolor it
      if (r < 110 && g < 110 && b < 110) {
        data[i] = character.color.r;
        data[i + 1] = character.color.g;
        data[i + 2] = character.color.b;
        // Keep alpha channel
      }
    }

    qrCtx.putImageData(qrImageData_processed, 0, 0);

    // Perform perspective warping
    const warpedQR = await warpImage(
      qrCanvas,
      canvas.width,
      canvas.height,
      character.coords
    );

    // Draw warped QR onto background
    ctx.drawImage(warpedQR, 0, 0);

    // Convert to JPEG buffer
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });

    // Return as base64
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    return NextResponse.json({
      success: true,
      image: dataUrl,
    });
  } catch (error: any) {
    console.error('Error processing QR:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process image' },
      { status: 500 }
    );
  }
}

async function warpImage(
  srcCanvas: any,
  dstWidth: number,
  dstHeight: number,
  coords: Array<{ x: number; y: number }>
): Promise<any> {
  const { createCanvas: createCanvasFn } = await getCanvas();
  const srcWidth = srcCanvas.width;
  const srcHeight = srcCanvas.height;

  // Destination corners
  const x0 = coords[0].x;
  const y0 = coords[0].y;
  const x1 = coords[1].x;
  const y1 = coords[1].y;
  const x2 = coords[2].x;
  const y2 = coords[2].y;
  const x3 = coords[3].x;
  const y3 = coords[3].y;

  // Source corners (full image)
  const srcCorners = [
    [0, 0],
    [srcWidth, 0],
    [srcWidth, srcHeight],
    [0, srcHeight],
  ];

  // Calculate homography matrix
  const H = getHomographyMatrix(
    [x0, y0],
    [x1, y1],
    [x2, y2],
    [x3, y3],
    srcCorners[0],
    srcCorners[1],
    srcCorners[2],
    srcCorners[3]
  );

  // Create destination canvas
  const dstCanvas = createCanvasFn(dstWidth, dstHeight);
  const dstCtx = dstCanvas.getContext('2d');
  const srcCtx = srcCanvas.getContext('2d');

  // Get source image data
  const srcImageData = srcCtx.getImageData(0, 0, srcWidth, srcHeight);
  const srcData = srcImageData.data;

  // Create destination image data
  const dstImageData = dstCtx.createImageData(dstWidth, dstHeight);
  const dstData = dstImageData.data;

  // Calculate bounds
  const minX = Math.floor(Math.min(x0, x1, x2, x3));
  const maxX = Math.ceil(Math.max(x0, x1, x2, x3));
  const minY = Math.floor(Math.min(y0, y1, y2, y3));
  const maxY = Math.ceil(Math.max(y0, y1, y2, y3));

  // Warp pixels
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (x < 0 || x >= dstWidth || y < 0 || y >= dstHeight) continue;

      // Apply inverse homography
      const w = H[6] * x + H[7] * y + H[8];
      if (Math.abs(w) < 1e-6) continue;

      const srcX = (H[0] * x + H[1] * y + H[2]) / w;
      const srcY = (H[3] * x + H[4] * y + H[5]) / w;

      if (srcX >= 0 && srcX < srcWidth && srcY >= 0 && srcY < srcHeight) {
        const srcIdx = (Math.floor(srcY) * srcWidth + Math.floor(srcX)) * 4;
        const dstIdx = (y * dstWidth + x) * 4;

        // Copy pixel with bilinear interpolation (simplified - using nearest neighbor)
        dstData[dstIdx] = srcData[srcIdx];
        dstData[dstIdx + 1] = srcData[srcIdx + 1];
        dstData[dstIdx + 2] = srcData[srcIdx + 2];
        dstData[dstIdx + 3] = srcData[srcIdx + 3];
      }
    }
  }

  dstCtx.putImageData(dstImageData, 0, 0);
  return dstCanvas;
}

function getHomographyMatrix(
  p0: number[],
  p1: number[],
  p2: number[],
  p3: number[],
  q0: number[],
  q1: number[],
  q2: number[],
  q3: number[]
): number[] {
  const matrix: number[][] = [];
  const rhs: number[] = [];
  const pts = [p0, p1, p2, p3];
  const tgs = [q0, q1, q2, q3];

  for (let i = 0; i < 4; i++) {
    const x = pts[i][0];
    const y = pts[i][1];
    const u = tgs[i][0];
    const v = tgs[i][1];

    matrix.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    rhs.push(u);
    matrix.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    rhs.push(v);
  }

  const h = solve(matrix, rhs);
  h.push(1.0);
  return h;
}

function solve(A: number[][], B: number[]): number[] {
  const n = B.length;
  const M = A.map((row) => [...row]);

  // Gaussian elimination
  for (let i = 0; i < n; i++) {
    const pivot = M[i][i] || 1e-6;
    for (let j = i + 1; j < n; j++) {
      const f = M[j][i] / pivot;
      B[j] -= f * B[i];
      for (let k = i; k < n; k++) {
        M[j][k] -= f * M[i][k];
      }
    }
  }

  // Back substitution
  const X = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += M[i][j] * X[j];
    }
    X[i] = (B[i] - sum) / (M[i][i] || 1e-6);
  }

  return X;
}

