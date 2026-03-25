/*
 * ADAPTA — GIF Export (Canvas Direct Method)
 * ─────────────────────────────────────────────────────────
 * Renderiza React component → DOM → Serializa SVG real → Canvas → Pixels → GIF
 * 
 * CRITICAL: Não usar getMascotSvgString() ou getMascotSvgAnimated()
 * porque eles não aplicam transforms de animação corretamente.
 * 
 * Esta solução renderiza o componente MascotSVG real no DOM,
 * aguarda o browser aplicar todos os transforms CSS,
 * serializa o SVG resultante e converte para GIF.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { flushSync } from "react-dom";
import { MascotSVG } from "./MascotSVG";
import type { MascotConfig } from "./MascotSVG";
import { ANIMATIONS } from "./animations";
import { encodeGIF } from "./gif-encoder"; // ⚠️ USAR ENCODER CUSTOMIZADO (paleta global)
import type { GifFrame } from "./gif-encoder";

export interface ExportOptions {
  size?: number;
  fps?: number;
  transparentBg?: boolean;
}

/**
 * Captura uma única frame renderizando o componente React real no DOM
 * e serializando o SVG resultante após o browser aplicar todos os transforms.
 */
async function captureReactToCanvas(
  config: MascotConfig,
  animId: string,
  frameIndex: number,
  totalFrames: number,
  options: ExportOptions,
): Promise<Uint8ClampedArray> { // ⚠️ Retorna Uint8ClampedArray
  console.log(`📸 [Frame ${frameIndex}/${totalFrames}] Capturing...`);
  
  // 1. Calcular transforms da animação
  const anim = ANIMATIONS.find(a => a.id === animId);
  if (!anim) throw new Error("Animation not found: " + animId);

  const t = frameIndex / totalFrames;
  const transforms = anim.fn(t);

  // 2. Criar container temporário (invisível mas renderizado)
  const container = document.createElement("div");
  container.style.cssText = "position:absolute;left:-9999px;top:-9999px;width:500px;height:500px;";
  document.body.appendChild(container);

  try {
    // 3. Renderizar React component de forma SÍNCRONA
    const root = ReactDOM.createRoot(container);
    
    // Usar flushSync para forçar render síncrono
    flushSync(() => {
      root.render(
        React.createElement(MascotSVG, {
          config: { ...config, noiseAmount: 0 }, // IMPORTANTE: Disable noise para GIF
          anim: transforms, // CRÍTICO: Passa transforms calculados
        }),
      );
    });

    // 4. Aguardar paint com múltiplos RAFs (mais seguro)
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      });
    });

    // 5. Capturar SVG real do DOM
    const svgEl = container.querySelector("svg");
    if (!svgEl) {
      console.error("Container HTML:", container.innerHTML);
      throw new Error("SVG element not found");
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);
    
    console.log(`📸 [Frame ${frameIndex}] SVG captured: ${svgString.length} chars`);

    // 6. Cleanup React
    root.unmount();
    document.body.removeChild(container);

    // 7. Converter SVG → Pixels
    return await svgToPixels(svgString, options.size ?? 240, options.transparentBg ?? false, frameIndex);
  } catch (err) {
    // Cleanup em caso de erro
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    throw err;
  }
}

/**
 * Converte string SVG em array de pixels RGBA
 */
async function svgToPixels(
  svgString: string,
  size: number,
  transparent: boolean,
  frameIndex: number,
): Promise<Uint8ClampedArray> { // ⚠️ Retorna Uint8ClampedArray
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
      alpha: transparent, // IMPORTANTE: Controla transparência
    });
    if (!ctx) {
      reject(new Error("Failed to get canvas context"));
      return;
    }

    const img = new Image();
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    img.src = URL.createObjectURL(blob);

    img.onload = async () => {
      try {
        console.log(`🖼️ [svgToPixels] Image loaded, decoding... (naturalWidth=${img.naturalWidth}, naturalHeight=${img.naturalHeight})`);
        
        // CRÍTICO: Aguarda decode completo
        await img.decode();

        console.log(`🎨 [svgToPixels] Drawing to canvas ${size}x${size}, transparent=${transparent}`);

        // Background (só se não for transparente)
        if (!transparent) {
          ctx.fillStyle = "#FBF5F0"; // Cor de fundo do ADAPTA
          ctx.fillRect(0, 0, size, size);
        }

        // Desenha SVG
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(img.src); // IMPORTANTE: Limpa memória

        // Extrai pixels
        const imageData = ctx.getImageData(0, 0, size, size);
        
        // 🔍 DEBUG: Contar cores únicas (diagnóstico de quantização)
        const uniqueColors = new Set();
        for (let i = 0; i < imageData.data.length; i += 4) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          const a = imageData.data[i + 3];
          uniqueColors.add(`${r},${g},${b},${a}`);
        }
        console.log(`🎨 [Frame ${frameIndex}] Cores únicas: ${uniqueColors.size} ${uniqueColors.size > 256 ? '⚠️ EXCEDE 256!' : '✅'}`);
        
        // 🔍 DEBUG: Log first 20 pixels of frame 0
        if (frameIndex === 0) {
          const firstPixels = [];
          for (let i = 0; i < 80; i += 4) {
            firstPixels.push({
              r: imageData.data[i],
              g: imageData.data[i + 1],
              b: imageData.data[i + 2],
              a: imageData.data[i + 3],
            });
          }
          console.log('🔍 [DEBUG] Frame 0 - First 20 pixels:', firstPixels);
          
          // Count opaque vs transparent pixels
          let opaqueCount = 0;
          let transparentCount = 0;
          for (let i = 0; i < imageData.data.length; i += 4) {
            if (imageData.data[i + 3] >= 128) opaqueCount++;
            else transparentCount++;
          }
          console.log(`🔍 [DEBUG] Frame 0 - Opaque: ${opaqueCount}, Transparent: ${transparentCount} (total ${opaqueCount + transparentCount})`);
        }

        console.log(`✅ [svgToPixels] Pixels extracted: ${imageData.data.length} bytes`);
        
        resolve(new Uint8ClampedArray(imageData.data)); // ⚠️ Uint8ClampedArray direto
      } catch (err) {
        console.error("❌ [svgToPixels] Error:", err);
        URL.revokeObjectURL(img.src);
        reject(err);
      }
    };

    img.onerror = (e) => {
      console.error("❌ [svgToPixels] Image load failed:", e);
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load SVG image"));
    };
  });
}

/**
 * Exporta GIF animado usando o método direto (React → DOM → Canvas)
 * 
 * @param config - Configuração do mascote
 * @param animId - ID da animação (ex: "bounce", "dance", "sleeping")
 * @param options - Opções de exportação (size, fps, transparentBg)
 * @param onProgress - Callback de progresso (0 a 1)
 * @returns Promise<Blob> - Blob do GIF animado
 */
export async function exportGifDirect(
  config: MascotConfig,
  animId: string,
  options: ExportOptions = {},
  onProgress?: (progress: number) => void,
): Promise<Blob> {
  console.log("🎬 [EXPORT START] exportGifDirect called!", { animId, options });
  
  const anim = ANIMATIONS.find(a => a.id === animId);
  if (!anim) throw new Error("Animation not found: " + animId);

  const size = options.size ?? 240;
  const fps = options.fps ?? 20;
  const totalFrames = Math.max(8, Math.ceil((anim.durationMs / 1000) * fps));
  const delayCentiseconds = Math.round(100 / fps); // ⚠️ GIF usa centésimos de segundo, não ms!

  // Capturar todas as frames
  const frames: GifFrame[] = [];
  const colorStats: number[] = []; // 🔍 Coletar estatísticas de cores

  for (let i = 0; i < totalFrames; i++) {
    const data = await captureReactToCanvas(config, animId, i, totalFrames, options);
    frames.push({ 
      data,
      width: size,
      height: size,
      delay: delayCentiseconds // ⚠️ Delay em 1/100s
    });
    if (onProgress) {
      onProgress((i + 1) / (totalFrames + 2) * 0.7); // 70% para captura
    }
  }

  console.log(`🎞️ [EXPORT] All frames captured! Total: ${frames.length}, calling encodeGIF...`);
  console.log(`🎞️ [EXPORT] Frame[0] sample:`, {
    width: frames[0].width,
    height: frames[0].height,
    delay: frames[0].delay,
    dataLength: frames[0].data.length,
    firstPixels: Array.from(frames[0].data.slice(0, 20))
  });

  // Codificar GIF com encoder customizado (paleta global + dithering)
  const gifBytes = encodeGIF(frames, {
    transparent: options.transparentBg ?? false,
    dithering: true,
    bgColor: [251, 245, 240], // ADAPTA background
    onProgress: (p) => {
      if (onProgress) onProgress(0.7 + p * 0.3); // 30% para encoding
    },
  });

  console.log(`✅ [EXPORT] GIF encoded! Size: ${gifBytes.length} bytes`);

  if (onProgress) onProgress(1);

  return new Blob([gifBytes], { type: "image/gif" });
}