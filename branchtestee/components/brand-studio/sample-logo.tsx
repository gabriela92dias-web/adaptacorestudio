import React from "react";

interface SampleLogoProps {
  layers: Record<string, { color: string; opacity: number; visible: boolean }>;
  width?: number;
  height?: number;
  className?: string;
}

export function SampleLogo({ layers, width = 280, height = 280, className }: SampleLogoProps) {
  // Proteção contra layers undefined
  const safeLayers = layers || {};
  
  // Extrair cores, opacidades e visibilidade das camadas
  const bgColor = safeLayers.fundo?.color || "#E5E5E5";
  const bgOpacity = safeLayers.fundo?.opacity ?? 1;
  const bgVisible = safeLayers.fundo?.visible ?? true;
  
  const plusColor = safeLayers["+"]?.color || "#FFFFFF";
  const plusOpacity = safeLayers["+"]?.opacity ?? 1;
  const plusVisible = safeLayers["+"]?.visible ?? true;
  
  const adColor = safeLayers.AD?.color || "#777777";
  const adOpacity = safeLayers.AD?.opacity ?? 1;
  const adVisible = safeLayers.AD?.visible ?? true;

  // SVG Paths extraídos dos arquivos originais
  const FUNDO_PATH = "M263.76,74.72v130.91c0,3.33-1.77,6.41-4.65,8.09l-112.39,65.37c-2.91,1.69-6.5,1.69-9.41,0L24.97,213.73c-2.88-1.68-4.65-4.76-4.65-8.09V74.74c0-3.33,1.77-6.41,4.65-8.09L137.36,1.27c2.91-1.69,6.5-1.69,9.41,0l112.33,65.36c2.88,1.68,4.65,4.76,4.65,8.09Z";
  
  const PLUS_POINTS = "92.99 149.38 71.29 149.38 71.28 170.56 53.51 170.56 53.51 149.39 31.81 149.38 31.81 132.67 53.5 132.67 53.51 111.38 71.28 111.38 71.29 132.67 92.99 132.67 92.99 149.38";
  
  const A_PATH = "M155.31,82.59h-18.84l-4.8.22c-2.98.61-5.76,1.7-8.34,3.25-4.25,2.56-7.31,6.35-9.16,11.36l-29.85,81.4-6.95,18.94h28.61l7.21-21.18h48.58l6.9,21.18h29.12l-42.48-115.17ZM120.23,153.85l15.54-45.64c.09-.54.33-.97.71-1.29.38-.34.86-.5,1.41-.5s1,.14,1.38.41c.39.27.69.73.9,1.38l14.56,45.64h-34.5Z";
  
  const D_PATH = "M204.76,197.77c3.83-.97,7.56-2.27,11.16-3.98,11.8-5.47,20.92-15.05,25.65-27.18,2.83-6.82,3.93-13.93,4.52-21.37v-7.89c-.48-7.36-1.75-14.62-4.51-21.59-4.99-12.62-14.57-22.41-27.01-27.82-6.94-3.01-14.2-4.61-21.8-5.34h-37.46l42.48,115.16M220.83,152.29c-2.41,9.51-8.82,17.04-17.82,20.87-4.08,1.74-8.57,3.1-12.98,3.56l-26.31-71.33,22.29.41c5.67.01,11.07,1.06,16.25,3.14,9.33,3.74,15.99,11.4,18.51,21.14,1.89,7.3,1.91,14.9.06,22.21Z";

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 263.76 280.36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Camada 1: Fundo (hexágono) */}
      <g opacity={bgOpacity} visibility={bgVisible ? "visible" : "hidden"}>
        <path d={FUNDO_PATH} fill={bgColor} />
      </g>
      
      {/* Camada 2: Símbolo + */}
      <g opacity={plusOpacity} visibility={plusVisible ? "visible" : "hidden"}>
        <polygon points={PLUS_POINTS} fill={plusColor} />
      </g>
      
      {/* Camada 3: Letras AD (combinadas em um grupo) */}
      <g opacity={adOpacity} visibility={adVisible ? "visible" : "hidden"}>
        {/* Letra A */}
        <path d={A_PATH} fill={adColor} />
        
        {/* Letra D */}
        <path d={D_PATH} fill={adColor} />
      </g>
    </svg>
  );
}