/*
 * ⚠️ GIF Export v5 — gifenc SIMPLIFICADO
 * ═══════════════════════════════════════════════════
 * Usando gifenc com quantização de cores apropriada
 * ═══════════════════════════════════════════════════
 */

import { MascotConfig } from "./MascotSVG";
import { ANIMATIONS } from "./animations";
import { calcLayout } from "./MascotSVG";
import { EYE_SETS } from "./eye-sets";
import { MOUTH_SETS } from "./mouth-sets";
import { parseSvgElements } from "./svg-parser";
import type { SvgElement } from "./svg-parser";
import { GIFEncoder, quantize, applyPalette } from "gifenc";

interface ExportOptions {
  size?: number;
  fps?: number;
  transparentBg?: boolean;
}

function createSvgString(
  config: MascotConfig,
  transforms: any,
  transparentBg: boolean,
): string {
  const L = calcLayout(config);
  
  const VIEW = 500;
  // ⚠️ DESABILITAR NOISE para GIF (causa problemas de renderização)
  const hasNoise = false;
  const A = transforms;
  
  const eyesData = EYE_SETS.find((e: any) => e.id === (A.eyeIdOverride || config.eyeId));
  const mouthData = MOUTH_SETS.find((m: any) => m.id === config.mouthId);
  
  if (!eyesData || !mouthData) {
    throw new Error("Eyes or mouth data not found");
  }
  
  // Cores padrão caso não estejam definidas
  const bodyColor = config.bodyColor || L.body.color;
  const eyeColor = config.eyeColor || "#0e0d10";
  const mouthColor = config.mouthColor || "#0e0d10";
  
  const eyeElements = parseSvgElements(eyesData.svg);
  const mouthElements = parseSvgElements(mouthData.svg);
  
  const elementsToStr = (elements: SvgElement[], color: string) => {
    return elements.map(el => {
      if (el.type === "path") {
        // ⚠️ APENAS substituir #0e0d10 (preto) - preservar white, none, transparent e outras cores
        const shouldOverride = el.fill === "#0e0d10" || el.fill === "rgb(14, 13, 16)";
        const fillColor = shouldOverride ? color : el.fill;
        // Escapar aspas no path
        const safePath = (el.d || "").replace(/"/g, "&quot;");
        let s = `<path d="${safePath}" fill="${fillColor}"`;
        if (el.stroke) s += ` stroke="${el.stroke}"`;
        if (el.strokeWidth) s += ` stroke-width="${el.strokeWidth}"`;
        return s + "/>";
      }
      if (el.type === "circle") {
        // ⚠️ APENAS substituir #0e0d10 (preto) - preservar white, none, transparent e outras cores
        const shouldOverride = el.fill === "#0e0d10" || el.fill === "rgb(14, 13, 16)";
        const fillColor = shouldOverride ? color : el.fill;
        return `<circle cx="${el.cx}" cy="${el.cy}" r="${el.r}" fill="${fillColor}"/>`;
      }
      return "";
    }).join("");
  };
  
  const totalBodyY = L.bodyY + A.bodyY;
  const bodyCenterX = L.bodyX + L.bodyW / 2;
  const bodyCenterY = totalBodyY + L.bodyH / 2;
  const bodyTransform = `translate(${bodyCenterX}, ${bodyCenterY}) rotate(${A.bodyRotate}) scale(${A.bodyScaleX}, ${A.bodyScaleY}) translate(${-bodyCenterX}, ${-bodyCenterY})`;
  
  const actualEyes = eyesData;
  const eyeW = actualEyes.vw * L.faceScale * A.eyeScaleX;
  const eyeH = actualEyes.vh * L.faceScale * A.eyeScaleY;
  const eyeXAdj = L.eyeX + A.eyeOffsetX;
  const eyeYAdj = L.eyeY + A.bodyY + A.eyeOffsetY + A.faceY;
  
  const mouthW = L.mouthW;
  const mouthH = L.mouthH * A.mouthScaleY;
  const mouthYAdj = L.mouthY + A.bodyY + A.mouthOffsetY + A.faceY;
  const mouthXAdj = L.mouthX + A.mouthOffsetX;
  
  const faceCenterX = VIEW / 2;
  const faceCenterY = (eyeYAdj + mouthYAdj + mouthH) / 2;
  const faceTransform = A.faceRotate !== 0 ? `rotate(${A.faceRotate}, ${faceCenterX}, ${faceCenterY})` : "";
  const faceVisible = Math.abs(A.eyeScaleX) > 0.05;
  
  let svg = `<svg viewBox="0 0 ${VIEW} ${VIEW}" width="${VIEW}" height="${VIEW}" xmlns="http://www.w3.org/2000/svg">\n`;
  
  const bgColor = transparentBg ? "none" : "#FFFFFF";
  if (!transparentBg) {
    svg += `<rect width="${VIEW}" height="${VIEW}" fill="${bgColor}"/>\n`;
  }
  
  svg += `<ellipse cx="${L.cx}" cy="${totalBodyY + L.bodyH + 10}" rx="${L.bodyW * 0.28 * A.shadowScaleX}" ry="5" fill="rgba(0,0,0,${A.shadowOpacity})"/>\n`;
  
  svg += `<g transform="translate(${VIEW / 2}, ${VIEW / 2}) scale(${A.bodyScaleX}, ${A.bodyScaleY}) translate(${-VIEW / 2}, ${-VIEW / 2})">\n`;
  
  svg += `<g transform="${bodyTransform}">\n`;
  svg += `<g transform="translate(${L.bodyX}, ${totalBodyY}) scale(${L.bodyW / L.body.vw}, ${L.bodyH / L.body.vh})">\n`;
  // Escapar aspas no path do body
  const safeBodyPath = L.body.path.replace(/"/g, "&quot;");
  svg += `<path d="${safeBodyPath}" fill="${bodyColor}"/>\n`;
  svg += `</g></g>\n`;
  
  if (faceTransform) {
    svg += `<g transform="${faceTransform}">\n`;
  } else {
    svg += `<g>\n`;
  }
  
  if (faceVisible) {
    svg += `<g transform="translate(${eyeXAdj}, ${eyeYAdj}) scale(${eyeW / actualEyes.vw}, ${eyeH / actualEyes.vh})">\n`;
    svg += elementsToStr(eyeElements, eyeColor);
    svg += `</g>\n`;
  }
  
  if (faceVisible) {
    svg += `<g transform="translate(${mouthXAdj}, ${mouthYAdj}) scale(${mouthW / mouthData.vw}, ${mouthH / mouthData.vh})">\n`;
    svg += elementsToStr(mouthElements, mouthColor);
    svg += `</g>\n`;
  }
  
  svg += `</g></g>\n`;
  
  if (A.showZzz) {
    const zzzOpacity = A.zzzOpacity ?? 1;
    const zzzY = A.zzzY ?? 0;
    svg += `<g opacity="${zzzOpacity}" transform="translate(${L.cx + L.bodyW * 0.35}, ${L.bodyY + 20 + zzzY})">\n`;
    svg += `<text x="0" y="0" font-size="28" font-weight="bold" fill="#888" font-family="Arial, sans-serif">z</text>\n`;
    svg += `<text x="12" y="-8" font-size="36" font-weight="bold" fill="#666" font-family="Arial, sans-serif">z</text>\n`;
    svg += `<text x="28" y="-18" font-size="44" font-weight="bold" fill="#444" font-family="Arial, sans-serif">z</text>\n`;
    svg += `</g>\n`;
  }
  
  svg += `</svg>`;
  
  return svg;
}

async function renderSvgToCanvas(
  svgString: string,
  size: number,
  transparentBg: boolean,
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    
    // ⚠️ APENAS preencher com branco se NÃO for transparente
    if (!transparentBg) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);
    }
    
    // Timeout de 5 segundos
    const timeout = setTimeout(() => {
      console.error("[GIFENC-V5] SVG load timeout");
      reject(new Error("SVG load timeout"));
    }, 5000);
    
    const img = new window.Image();
    img.onload = () => {
      try {
        clearTimeout(timeout);
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(img.src);
        resolve(canvas);
      } catch (err) {
        clearTimeout(timeout);
        console.error("[GIFENC-V5] SVG draw error:", err);
        URL.revokeObjectURL(img.src);
        reject(err);
      }
    };
    img.onerror = (e) => {
      clearTimeout(timeout);
      console.error("[GIFENC-V5] Failed to load SVG:", e);
      console.error("[GIFENC-V5] SVG string length:", svgString.length);
      console.error("[GIFENC-V5] SVG preview:", svgString.substring(0, 500));
      reject(new Error("Failed to load SVG"));
    };
    
    try {
      // Validar e limpar SVG antes de criar blob
      const cleanSvg = svgString
        .replace(/NaN/g, "0")
        .replace(/Infinity/g, "1000")
        .replace(/-Infinity/g, "-1000");
      
      const blob = new Blob([cleanSvg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      img.src = url;
    } catch (err) {
      clearTimeout(timeout);
      console.error("[GIFENC-V5] Failed to create blob:", err);
      reject(err);
    }
  });
}

export async function exportGifDirect(
  config: MascotConfig,
  animId: string,
  options: ExportOptions = {},
  onProgress?: (pct: number) => void,
): Promise<Blob> {
  console.log('[GIF] ✅ V5 ATIVA - gifenc SIMPLIFICADO');
  
  const anim = ANIMATIONS.find((a) => a.id === animId);
  if (!anim) throw new Error("Animation not found: " + animId);

  const size = options.size ?? 240;
  
  // ⚠️ CRÍTICO: Usar FPS ALTO para match perfeito com preview (que roda a 60fps via RAF)
  // GIFs suportam até ~50fps sem problemas de compatibilidade
  const targetFps = 30; // 30fps = bom balanço entre fluidez e tamanho de arquivo
  const fps = options.fps ?? targetFps;
  const delayMs = 1000 / fps; // 30fps = 33.33ms por frame
  const delayCentiseconds = Math.max(2, Math.round(delayMs / 10)); // Mínimo 2cs (20ms) para fluidez
  
  // ⚠️ FRAMES baseado na DURAÇÃO exata (não no delay)
  // Exemplo: 400ms a 30fps = 12 frames (muito mais fluido que 8)
  const totalFrames = Math.max(12, Math.round((anim.durationMs / 1000) * fps));

  console.log(`[GIF] 🎬 Gerando ${totalFrames} frames a ${fps}fps (delay=${delayCentiseconds}cs = ${delayCentiseconds * 10}ms cada = ~${totalFrames * delayCentiseconds * 10}ms total, original: ${anim.durationMs}ms)...`);

  // Criar encoder
  const gif = GIFEncoder();

  // Processar frame por frame (método SIMPLES que funciona)
  for (let i = 0; i < totalFrames; i++) {
    const t = i / totalFrames;
    const transforms = anim.fn(t);
    
    console.log(`[GIF] Frame ${i}/${totalFrames}`);
    
    const svgString = createSvgString(config, transforms, options.transparentBg ?? false);
    const canvas = await renderSvgToCanvas(svgString, size, options.transparentBg ?? false);
    
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const imageData = ctx.getImageData(0, 0, size, size);
    
    // ⚠️ FORMATO: rgb565 = SEM transparência | rgba4444 = COM transparência
    const useTransparency = options.transparentBg ?? false;
    const format = useTransparency ? "rgba4444" : "rgb565";
    
    // Quantizar cores DESTE frame (máximo 256)
    const palette = quantize(imageData.data, 256, { format });
    
    console.log(`[GIF] Frame ${i}: ${palette.length / (useTransparency ? 4 : 3)} cores, formato=${format}`);
    
    // Aplicar paleta
    const index = applyPalette(imageData.data, palette, format);
    
    // Escrever frame
    gif.writeFrame(index, size, size, {
      palette,
      delay: delayCentiseconds,
      transparent: useTransparency,
      transparentIndex: 0,
      dispose: 2
    });
    
    if (onProgress) onProgress((i + 1) / totalFrames);
  }

  gif.finish();

  console.log('[GIF] ✅ GIF gerado!');
  
  const buffer = gif.bytes();
  return new Blob([buffer], { type: "image/gif" });
}