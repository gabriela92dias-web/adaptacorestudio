🚀 PROMPT COMPLETO - COPIAR E COLAR
MIGRAÇÃO: Versão bugada → v5d (stable)

📊 DIAGNÓSTICO:
• Bug: Distorção visual no GIF export
• Causa: Tentativas de otimização de paleta falharam
• Solução: Rollback para v5d (paleta local, comprovadamente estável)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 PASSO 1: SUBSTITUIR GIF-EXPORT-V5.TS

SOBRESCREVA completamente o arquivo:
/src/app/components/gif-export-v5.ts

Com este código (versão v5d stable):

```typescript
/*
 * ⚠️ GIF Export v5 — gifenc SIMPLIFICADO
 * ═══════════════════════════════════════════════════
 * Usando gifenc com quantização de cores apropriada
 * ═══════════════════════════════════════════════════
 */

import { MascotConfig } from "./types";
import { ANIMATIONS } from "./animations";
import { calcLayout } from "./MascotSVG";
import { EYE_SETS } from "./eye-sets";
import { MOUTH_SETS } from "./mouth-sets";
import { parseSvgElements } from "./svg-parser";
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
  const hasNoise = config.noiseAmount > 0;
  const A = transforms;
  
  const eyesData = EYE_SETS.find((e: any) => e.id === (A.eyeIdOverride || config.eyeId));
  const mouthData = MOUTH_SETS.find((m: any) => m.id === config.mouthId);
  
  if (!eyesData || !mouthData) {
    throw new Error("Eyes or mouth data not found");
  }
  
  const eyeElements = parseSvgElements(eyesData.svg);
  const mouthElements = parseSvgElements(mouthData.svg);
  
  const elementsToStr = (elements: any[]) => {
    return elements.map((el: any) => {
      if (el.type === "path") {
        let s = `<path d="${el.d}" fill="${el.fill}"`;
        if (el.stroke) s += ` stroke="${el.stroke}"`;
        if (el.strokeWidth) s += ` stroke-width="${el.strokeWidth}"`;
        return s + "/>";
      }
      if (el.type === "circle") {
        return `<circle cx="${el.cx}" cy="${el.cy}" r="${el.r}" fill="${el.fill}"/>`;
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
  
  if (hasNoise) {
    const noiseId = "noise-gif";
    svg += `<defs><filter id="${noiseId}" x="-20%" y="-20%" width="140%" height="140%">\n`;
    svg += `<feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="2" seed="42" result="turb"/>\n`;
    svg += `<feColorMatrix type="saturate" values="0" in="turb" result="gray"/>\n`;
    svg += `<feComponentTransfer in="SourceAlpha" result="gradient"><feFuncA type="table" tableValues="0.3 0.5 0.7 1.0"/></feComponentTransfer>\n`;
    svg += `<feComposite in="gray" in2="gradient" operator="in" result="shadedNoise"/>\n`;
    svg += `<feComponentTransfer in="shadedNoise" result="noiseAlpha"><feFuncA type="linear" slope="${config.noiseAmount * 0.8}" intercept="0"/>\n`;
    svg += `<feBlend in="SourceGraphic" in2="noiseAlpha" mode="multiply" result="blended"/>\n`;
    svg += `<feComposite in="blended" in2="SourceGraphic" operator="in"/>\n`;
    svg += `</filter></defs>\n`;
  }
  
  const bgColor = transparentBg ? "none" : "#FFFFFF";
  if (!transparentBg) {
    svg += `<rect width="${VIEW}" height="${VIEW}" fill="${bgColor}"/>\n`;
  }
  
  svg += `<ellipse cx="${L.cx}" cy="${totalBodyY + L.bodyH + 10}" rx="${L.bodyW * 0.28 * A.shadowScaleX}" ry="5" fill="rgba(0,0,0,${A.shadowOpacity})"/>\n`;
  
  svg += `<g transform="translate(${VIEW / 2}, ${VIEW / 2}) scale(${A.bodyScaleX}, ${A.bodyScaleY}) translate(${-VIEW / 2}, ${-VIEW / 2})">\n`;
  
  svg += `<g transform="${bodyTransform}">\n`;
  svg += `<g transform="translate(${L.bodyX}, ${totalBodyY}) scale(${L.bodyW / L.body.vw}, ${L.bodyH / L.body.vh})">\n`;
  svg += `<path d="${L.body.path}" fill="${L.body.color}"${hasNoise ? ` filter="url(#noise-gif)"` : ``}/>\n`;
  svg += `</g></g>\n`;
  
  if (faceTransform) {
    svg += `<g transform="${faceTransform}">\n`;
  } else {
    svg += `<g>\n`;
  }
  
  if (faceVisible) {
    svg += `<g transform="translate(${eyeXAdj}, ${eyeYAdj}) scale(${eyeW / actualEyes.vw}, ${eyeH / actualEyes.vh})">\n`;
    svg += elementsToStr(eyeElements);
    svg += `</g>\n`;
  }
  
  if (faceVisible) {
    svg += `<g transform="translate(${mouthXAdj}, ${mouthYAdj}) scale(${mouthW / mouthData.vw}, ${mouthH / mouthData.vh})">\n`;
    svg += elementsToStr(mouthElements);
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
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    
    const img = new window.Image();
    img.onload = async () => {
      try {
        await img.decode();
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(img.src);
        resolve(canvas);
      } catch (err) {
        console.error("[GIFENC-V5] SVG decode error:", err);
        URL.revokeObjectURL(img.src);
        reject(err);
      }
    };
    img.onerror = () => {
      console.error("[GIFENC-V5] Failed to load SVG");
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load SVG"));
    };
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    img.src = URL.createObjectURL(blob);
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
  const totalFrames = 12;
  const delayMs = 80; // 80ms = ~12fps

  console.log(`[GIF] 🎬 Gerando ${totalFrames} frames...`);

  // Criar encoder
  const gif = GIFEncoder();

  // Processar frame por frame (método SIMPLES que funciona)
  for (let i = 0; i < totalFrames; i++) {
    const t = i / totalFrames;
    const transforms = anim.fn(t);
    
    console.log(`[GIF] Frame ${i}/${totalFrames}`);
    
    const svgString = createSvgString(config, transforms, options.transparentBg ?? false);
    const canvas = await renderSvgToCanvas(svgString, size);
    
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
      delay: delayMs / 10,
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
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 PASSO 2: VERIFICAR DEPENDÊNCIA

Confirme que gifenc está instalado: Ler: /package.json

Se não tiver "gifenc", instale: install_package: gifenc

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ PASSO 3: TESTAR

Gere um GIF com qualquer animação (ex: "bounce").

RESULTADO ESPERADO: ✅ Zero distorção visual ✅ Formas corretas ✅ Cores consistentes ⚠️ Leve flickering (normal da v5d)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ IMPORTANTE: • Esta é a versão v5d ESTÁVEL • Usa paleta LOCAL (140-150 cores por frame) • Tem leve flickering mas ZERO distorção • NÃO tente "otimizar" sem consultar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Execute agora substituindo o arquivo gif-export-v5.ts