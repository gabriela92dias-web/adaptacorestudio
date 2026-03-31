/**
 * Utilitário para exportação de logos em diferentes formatos
 */

import { toPng } from 'html-to-image';
import { PDFDocument } from 'pdf-lib';

export interface ExportOptions {
  format: 'png' | 'svg' | 'jpg';
  quality?: number; // 0-1 para jpg
  scale?: number; // multiplicador de tamanho
}

/**
 * Converte um elemento SVG para Data URL
 */
export function svgToDataURL(svgElement: SVGElement): string {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  return `data:image/svg+xml;base64,${btoa(svgString)}`;
}

/**
 * Exporta logo como SVG vetorial
 */
export async function downloadLogoSVG(svgElement: SVGElement): Promise<void> {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.download = 'adapta-logo.svg';
  link.href = url;
  link.click();
  
  URL.revokeObjectURL(url);
}

/**
 * Exporta logo como PNG 1000x1000px
 */
export async function downloadLogoPNG(svgElement: SVGElement): Promise<void> {
  const dataUrl = await toPng(svgElement, {
    width: 1000,
    height: 1000,
    pixelRatio: 2,
  });
  
  const link = document.createElement('a');
  link.download = 'adapta-logo.png';
  link.href = dataUrl;
  link.click();
}

/**
 * Exporta logo como PDF vetorial
 */
export async function downloadLogoPDFVector(svgElement: SVGElement): Promise<void> {
  // Criar PDF com pdf-lib
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([1000, 1000]);
  
  // Converter SVG para PNG e embedar no PDF
  const pngDataUrl = await toPng(svgElement, {
    width: 1000,
    height: 1000,
    pixelRatio: 2,
  });
  
  const pngImageBytes = await fetch(pngDataUrl).then(res => res.arrayBuffer());
  const pngImage = await pdfDoc.embedPng(pngImageBytes);
  
  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: 1000,
    height: 1000,
  });
  
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.download = 'adapta-logo.pdf';
  link.href = url;
  link.click();
  
  URL.revokeObjectURL(url);
}

/**
 * Renderiza um SVG frame by frame e exporta como GIF
 */
import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import React from 'react';
import { AnimatedLogo } from '../components/brand-studio/animated-logo';
export async function downloadLogoGIF(
  layers: Record<string, { color: string; opacity: number; visible: boolean }>,
  animationType: "A01" | "A02" | "A03" | "A04",
  transparentBg: boolean = false
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { renderToStaticMarkup } = await import('react-dom/server');

  const size = 1080; // Resolução recomendada telão
  const totalFrames = 150;
  const skipFrames = 2; // Rende a 15fps para ser mais leve e rápido de exportar (150/2 = 75 frames)
  const delayMs = Math.round((1000 / 30) * skipFrames); // Delay original é 30fps

  const gif = GIFEncoder();

  // Helper para renderizar SVG na string
  const renderSvgString = (frame: number) => {
    return renderToStaticMarkup(
      React.createElement(AnimatedLogo, {
        layers,
        animationType,
        width: size,
        height: size,
        frameOverride: frame
      })
    );
  };

  // Helper para desenhar SVG no Canvas
  const renderSvgToCanvas = async (svgString: string): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      
      const img = new window.Image();
      img.onload = async () => {
        try {
          // Para GIFs transparentes, não preenchemos o fundo
          if (!transparentBg) {
             ctx.fillStyle = "#E5E5E5"; // Ou a cor de fundo escolhida
             ctx.fillRect(0, 0, size, size);
          } else {
             ctx.clearRect(0, 0, size, size);
          }
          ctx.drawImage(img, 0, 0, size, size);
          URL.revokeObjectURL(img.src);
          resolve(canvas);
        } catch (err) {
          URL.revokeObjectURL(img.src);
          reject(err);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error("Failed to load SVG"));
      };
      
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      img.src = URL.createObjectURL(blob);
    });
  };

  for (let i = 0; i < totalFrames; i += skipFrames) {
    const svgString = renderSvgString(i);
    const canvas = await renderSvgToCanvas(svgString);
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const imageData = ctx.getImageData(0, 0, size, size);
    
    const format = transparentBg ? "rgba4444" : "rgb565";
    const palette = quantize(imageData.data, 256, { format });
    const index = applyPalette(imageData.data, palette, format);
    
    gif.writeFrame(index, size, size, {
      palette,
      delay: delayMs,
      transparent: transparentBg,
      transparentIndex: 0,
      dispose: 2
    });
  }

  gif.finish();
  const buffer = gif.bytes();
  const blob = new Blob([buffer], { type: "image/gif" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.download = `adapta-animated-${animationType}.gif`;
  link.href = url;
  link.click();
  
  URL.revokeObjectURL(url);
}
