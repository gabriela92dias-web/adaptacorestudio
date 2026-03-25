/*
 * ADAPTA — GIF Encoder Implementation
 * Pure TypeScript GIF89a encoder with median-cut quantization and LZW compression
 */

export interface GifFrame {
  data: Uint8ClampedArray;
  width: number;
  height: number;
  delay: number;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

// Median-cut color quantization
function medianCut(pixels: RGB[], depth: number): RGB[] {
  if (depth === 0 || pixels.length === 0) {
    const avg = pixels.reduce(
      (acc, p) => ({ r: acc.r + p.r, g: acc.g + p.g, b: acc.b + p.b }),
      { r: 0, g: 0, b: 0 }
    );
    return [{ r: avg.r / pixels.length, g: avg.g / pixels.length, b: avg.b / pixels.length }];
  }

  // Find the channel with the greatest range
  let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0;
  for (const p of pixels) {
    if (p.r < rMin) rMin = p.r;
    if (p.r > rMax) rMax = p.r;
    if (p.g < gMin) gMin = p.g;
    if (p.g > gMax) gMax = p.g;
    if (p.b < bMin) bMin = p.b;
    if (p.b > bMax) bMax = p.b;
  }

  const rRange = rMax - rMin;
  const gRange = gMax - gMin;
  const bRange = bMax - bMin;

  // Sort by the channel with greatest range
  if (rRange >= gRange && rRange >= bRange) {
    pixels.sort((a, b) => a.r - b.r);
  } else if (gRange >= bRange) {
    pixels.sort((a, b) => a.g - b.g);
  } else {
    pixels.sort((a, b) => a.b - b.b);
  }

  // Split and recurse
  const mid = Math.floor(pixels.length / 2);
  return [
    ...medianCut(pixels.slice(0, mid), depth - 1),
    ...medianCut(pixels.slice(mid), depth - 1),
  ];
}

function buildPalette(frame: Uint8ClampedArray, maxColors: number): Uint8Array {
  const pixels: RGB[] = [];
  for (let i = 0; i < frame.length; i += 4) {
    pixels.push({ r: frame[i], g: frame[i + 1], b: frame[i + 2] });
  }

  const depth = Math.ceil(Math.log2(maxColors));
  const colors = medianCut(pixels, depth);

  // Pad to power of 2
  const paletteSize = Math.pow(2, Math.ceil(Math.log2(colors.length)));
  const palette = new Uint8Array(paletteSize * 3);

  for (let i = 0; i < colors.length; i++) {
    palette[i * 3] = Math.round(colors[i].r);
    palette[i * 3 + 1] = Math.round(colors[i].g);
    palette[i * 3 + 2] = Math.round(colors[i].b);
  }

  return palette;
}

// Build global palette from ALL frames (not just first)
function buildGlobalPalette(frames: GifFrame[], maxColors: number): Uint8Array {
  const allPixels: RGB[] = [];
  
  // Sample pixels from all frames
  for (const frame of frames) {
    // Sample every 4th pixel to keep reasonable size
    for (let i = 0; i < frame.data.length; i += 16) {
      allPixels.push({
        r: frame.data[i],
        g: frame.data[i + 1],
        b: frame.data[i + 2]
      });
    }
  }

  console.log(`[GIF Encoder] Building palette from ${allPixels.length} sampled pixels across ${frames.length} frames`);

  const depth = Math.ceil(Math.log2(maxColors));
  const colors = medianCut(allPixels, depth);

  console.log(`[GIF Encoder] Median-cut produced ${colors.length} colors`);

  // Pad to power of 2
  const paletteSize = Math.pow(2, Math.ceil(Math.log2(colors.length)));
  const palette = new Uint8Array(paletteSize * 3);

  for (let i = 0; i < colors.length; i++) {
    palette[i * 3] = Math.round(colors[i].r);
    palette[i * 3 + 1] = Math.round(colors[i].g);
    palette[i * 3 + 2] = Math.round(colors[i].b);
  }

  console.log(`[GIF Encoder] Final palette size: ${paletteSize} colors (${palette.length} bytes)`);

  return palette;
}

function findClosestColor(r: number, g: number, b: number, palette: Uint8Array): number {
  let minDist = Infinity;
  let index = 0;

  for (let i = 0; i < palette.length; i += 3) {
    const dr = r - palette[i];
    const dg = g - palette[i + 1];
    const db = b - palette[i + 2];
    const dist = dr * dr + dg * dg + db * db;

    if (dist < minDist) {
      minDist = dist;
      index = i / 3;
    }
  }

  return index;
}

// Floyd-Steinberg dithering
function applyDithering(
  frame: Uint8ClampedArray,
  palette: Uint8Array,
  width: number,
  height: number,
  transparent: boolean
): Uint8Array {
  const indexed = new Uint8Array(width * height);
  const errors = new Float32Array(frame.length); // Store error diffusion

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const j = y * width + x;

      // ⚠️ CRITICAL: Check transparency FIRST before processing errors
      const a = frame[i + 3];
      
      if (transparent && a < 128) {
        indexed[j] = palette.length / 3 - 1;
        continue; // Skip error diffusion for transparent pixels
      }

      // Get pixel with accumulated error (only for opaque pixels)
      let r = Math.max(0, Math.min(255, frame[i] + errors[i]));
      let g = Math.max(0, Math.min(255, frame[i + 1] + errors[i + 1]));
      let b = Math.max(0, Math.min(255, frame[i + 2] + errors[i + 2]));

      // Find closest color
      const colorIndex = findClosestColor(r, g, b, palette);
      indexed[j] = colorIndex;

      // Calculate quantization error
      const pr = palette[colorIndex * 3];
      const pg = palette[colorIndex * 3 + 1];
      const pb = palette[colorIndex * 3 + 2];

      const er = r - pr;
      const eg = g - pg;
      const eb = b - pb;

      // Distribute error to neighboring pixels (Floyd-Steinberg)
      if (x + 1 < width) {
        const ri = i + 4;
        errors[ri] += er * 7 / 16;
        errors[ri + 1] += eg * 7 / 16;
        errors[ri + 2] += eb * 7 / 16;
      }
      if (y + 1 < height) {
        if (x > 0) {
          const li = ((y + 1) * width + (x - 1)) * 4;
          errors[li] += er * 3 / 16;
          errors[li + 1] += eg * 3 / 16;
          errors[li + 2] += eb * 3 / 16;
        }
        const di = ((y + 1) * width + x) * 4;
        errors[di] += er * 5 / 16;
        errors[di + 1] += eg * 5 / 16;
        errors[di + 2] += eb * 5 / 16;

        if (x + 1 < width) {
          const rdi = ((y + 1) * width + (x + 1)) * 4;
          errors[rdi] += er * 1 / 16;
          errors[rdi + 1] += eg * 1 / 16;
          errors[rdi + 2] += eb * 1 / 16;
        }
      }
    }
  }

  return indexed;
}

function indexFrame(frame: Uint8ClampedArray, palette: Uint8Array, transparent: boolean): Uint8Array {
  const indexed = new Uint8Array(frame.length / 4);

  for (let i = 0, j = 0; i < frame.length; i += 4, j++) {
    const a = frame[i + 3];
    if (transparent && a < 128) {
      indexed[j] = palette.length / 3 - 1; // Use last color as transparent
    } else {
      indexed[j] = findClosestColor(frame[i], frame[i + 1], frame[i + 2], palette);
    }
  }

  return indexed;
}

// LZW compression (optimized for performance)
function lzwEncode(data: Uint8Array, minCodeSize: number): Uint8Array {
  const output: number[] = [];
  let codeSize = minCodeSize + 1;
  const clearCode = 1 << minCodeSize;
  const endCode = clearCode + 1;
  let nextCode = endCode + 1;
  let maxCode = (1 << codeSize) - 1;

  // Use number-based dictionary for better performance
  const dict = new Map<number, number>();
  let code = -1;
  let bits = 0;
  let bitBuffer = 0;

  const writeBits = (value: number, size: number) => {
    bitBuffer |= value << bits;
    bits += size;
    while (bits >= 8) {
      output.push(bitBuffer & 0xff);
      bitBuffer >>= 8;
      bits -= 8;
    }
  };

  writeBits(clearCode, codeSize);

  for (let i = 0; i < data.length; i++) {
    const k = data[i];
    const key = code < 0 ? k : (code << 8) | k;

    if (dict.has(key)) {
      code = dict.get(key)!;
    } else {
      if (code >= 0) {
        writeBits(code, codeSize);
      } else {
        writeBits(k, codeSize);
      }

      if (nextCode <= 4095) {
        dict.set(key, nextCode++);
        if (nextCode > maxCode && codeSize < 12) {
          codeSize++;
          maxCode = (1 << codeSize) - 1;
        }
      } else {
        writeBits(clearCode, codeSize);
        dict.clear();
        codeSize = minCodeSize + 1;
        nextCode = endCode + 1;
        maxCode = (1 << codeSize) - 1;
      }

      code = k;
    }
  }

  if (code >= 0) {
    writeBits(code, codeSize);
  }

  writeBits(endCode, codeSize);

  if (bits > 0) {
    output.push(bitBuffer & 0xff);
  }

  return new Uint8Array(output);
}

export function encodeGIF(
  frames: GifFrame[],
  options: {
    transparent?: boolean;
    dithering?: boolean;
    bgColor?: [number, number, number];
    onProgress?: (progress: number) => void;
  } = {}
): Uint8Array {
  const { transparent = false, dithering = false, bgColor = [251, 245, 240], onProgress } = options;

  console.log(`🎨 [GIF ENCODER ${Date.now()}] Starting encode:`, {
    frames: frames.length,
    dithering,
    transparent,
    firstFrameSize: frames[0]?.data.length
  });

  if (frames.length === 0) {
    throw new Error("No frames to encode");
  }

  const { width, height } = frames[0];
  const output: number[] = [];

  // Helper to write bytes
  const write = (...bytes: number[]) => output.push(...bytes);
  const writeString = (str: string) => {
    for (let i = 0; i < str.length; i++) {
      write(str.charCodeAt(i));
    }
  };

  // Header
  writeString("GIF89a");

  // Logical Screen Descriptor
  write(width & 0xff, width >> 8);
  write(height & 0xff, height >> 8);
  write(0xf7); // Global color table: 256 colors
  write(0); // Background color index
  write(0); // Pixel aspect ratio

  // Global Color Table (build from all frames)
  const globalPalette = buildGlobalPalette(frames, 256);
  for (let i = 0; i < 256 * 3; i++) {
    write(globalPalette[i] || 0);
  }

  // Netscape Extension for looping
  write(0x21, 0xff, 0x0b);
  writeString("NETSCAPE2.0");
  write(0x03, 0x01);
  write(0, 0); // Loop count (0 = infinite)
  write(0);

  // Encode each frame
  for (let frameIndex = 0; frameIndex < frames.length; frameIndex++) {
    const frame = frames[frameIndex];

    // Graphics Control Extension
    write(0x21, 0xf9, 0x04);
    write(transparent ? 0x09 : 0x08); // Disposal + transparent flag
    write(frame.delay & 0xff, frame.delay >> 8); // Delay time (centiseconds)
    write(transparent ? 255 : 0); // Transparent color index
    write(0);

    // Image Descriptor
    write(0x2c);
    write(0, 0, 0, 0); // Position (0, 0)
    write(width & 0xff, width >> 8);
    write(height & 0xff, height >> 8);
    write(0); // No local color table

    // Image Data
    const indexed = options.dithering
      ? applyDithering(frame.data, globalPalette, width, height, transparent)
      : indexFrame(frame.data, globalPalette, transparent);
    
    if (frameIndex === 0) {
      console.log(`[GIF Encoder] Frame 0: Using ${options.dithering ? 'DITHERING' : 'direct indexing'}, palette=${globalPalette.length} bytes`);
    }
    
    const minCodeSize = 8;
    write(minCodeSize);

    const compressed = lzwEncode(indexed, minCodeSize);

    console.log(`[GIF Encoder] Frame ${frameIndex}: Compressed ${indexed.length} bytes → ${compressed.length} bytes`);

    // Write in sub-blocks
    for (let i = 0; i < compressed.length; i += 255) {
      const blockSize = Math.min(255, compressed.length - i);
      write(blockSize);
      for (let j = 0; j < blockSize; j++) {
        write(compressed[i + j]);
      }
    }
    write(0); // Block terminator

    if (onProgress) {
      onProgress((frameIndex + 1) / frames.length);
    }
  }

  // Trailer
  write(0x3b);

  return new Uint8Array(output);
}