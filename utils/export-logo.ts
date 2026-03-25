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