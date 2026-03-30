import React, { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
// @ts-expect-error flubber doesn't ship types
import { interpolate as flubberInterp } from "flubber";

export interface AnimatedLogoProps {
  layers: Record<string, { color: string; opacity: number; visible: boolean }>;
  width?: number;
  height?: number;
  className?: string;
  animationType?: "A01" | "A02" | "A03" | "A04";
  frameOverride?: number;
}

// ─── EASINGS UX (MATERIAL M3 & APPLE HIG) ─────────────────────────────────────
const EASE_EMPHASIZED = Easing.bezier(0.05, 0.7, 0.1, 1.0);

// ─── SVG PATHS ────────────────────────────────────────────────────────────────
const PATH_PLUS =
  "M 57.01 111.38 L 67.79 111.38 C 70.29 111.38 71.29 111.88 71.29 114.38 L 71.29 129.67 C 71.29 132.17 71.79 132.67 74.29 132.67 L 88.49 132.67 C 90.99 132.67 92.99 133.67 92.99 136.17 L 92.99 145.88 C 92.99 148.38 90.99 149.38 88.49 149.38 L 74.29 149.38 C 71.79 149.38 71.29 149.88 71.29 152.38 L 71.29 167.56 C 71.29 170.06 70.29 170.56 67.79 170.56 L 57.01 170.56 C 54.51 170.56 53.51 170.06 53.51 167.56 L 53.51 152.38 C 53.51 149.88 53.01 149.38 50.51 149.38 L 35.31 149.38 C 32.81 149.38 31.81 148.38 31.81 145.88 L 31.81 136.17 C 31.81 133.67 32.81 132.67 35.31 132.67 L 50.51 132.67 C 53.01 132.67 53.51 132.17 53.51 129.67 L 53.51 114.88 C 53.51 112.38 54.51 111.38 57.01 111.38 Z";

const PATH_GOTA =
  "M61.9 113.1C61.8 113.2 61.7 113.3 61.7 113.2 61.9 113.1 61.9 113 61.8 113 61.6 113 59.1 115.7 56.6 118.7 47.4 129.4 41.9 138.6 40.9 144.7 40.7 146.1 40.7 148.1 41 149.8 41.8 156.4 45.3 162.1 50.6 165.7 54.1 168 58.1 169.2 62.2 169.2 66.7 169.2 71 167.8 74.7 165.1 78.2 162.5 81.1 158.5 82.5 154.2 83.6 150.9 84 147.3 83.5 144.7 82.8 141.4 81.2 137.6 78.3 133 77.5 131.6 75.3 128.4 74.8 127.7L74.7 127.6 74.8 127.6C74.9 127.6 74.9 127.6 74.9 127.6 74.9 127.5 73.8 126 73 125 71.6 123.2 70.4 121.7 69 120 66.5 117 63 113.1 62.8 113.1 62.7 113.1 62.7 113.1 62.6 113 62.5 113 62.6 113.1 62.7 113.2 62.8 113.3 62.7 113.2 62.5 113.1L62.2 112.8 61.9 113.1Z";

const PATH_CORACAO =
  "M 78.8 111.5 C 88 111.5 94 122 92 134 C 90 146 80 157 62.4 172 C 44.8 157 34.8 146 32.8 134 C 30.8 122 36.8 111.5 46 111.5 C 52 111.5 58 126 62.4 128 C 66.8 126 72.8 111.5 78.8 111.5 Z";

const PATH_FOLHA =
  "M93.3 144.8C91 143.1 88.1 141.4 83.4 140.6 87.9 137.2 91.7 132.4 92.8 125.1 92.9 123.7 91.8 122.5 90.5 122.7 84.7 123.3 79.1 125.1 74.4 127.8 74.6 118.8 70.8 110.2 66.3 105.1 65.5 104.2 63.9 104.2 63.1 105.1 58.7 110.2 54.8 118.8 55 127.8 50.4 125.1 44.7 123.3 39 122.7 37.6 122.5 36.5 123.7 36.7 125.1 37.7 132.4 41.5 137.2 46.1 140.6 41.4 141.4 38.5 143.1 36.1 144.8 34.9 145.7 35 147.5 36.2 148.3 40.5 151 46.1 152.6 51.5 152.8 50.8 154.5 50.6 156.4 50.7 158.6 50.8 159.7 51.6 160.5 52.7 160.6 57.9 160.8 61.4 158.6 64.7 156.4 67.9 158.5 71.2 160.6 76 160.6 77.9 160.6 78.7 159.8 78.7 158.6 78.9 156.4 78.6 154.5 78 152.8 83.3 152.6 88.9 151 93.2 148.3 94.4 147.5 94.5 145.7 93.3 144.8Z";

const FUNDO_PATH = "M263.76,74.72v130.91c0,3.33-1.77,6.41-4.65,8.09l-112.39,65.37c-2.91,1.69-6.5,1.69-9.41,0L24.97,213.73c-2.88-1.68-4.65-4.76-4.65-8.09V74.74c0-3.33,1.77-6.41,4.65-8.09L137.36,1.27c2.91-1.69,6.5-1.69,9.41,0l112.33,65.36c2.88,1.68,4.65,4.76,4.65,8.09Z";
const A_PATH = "M155.31,82.59h-18.84l-4.8.22c-2.98.61-5.76,1.7-8.34,3.25-4.25,2.56-7.31,6.35-9.16,11.36l-29.85,81.4-6.95,18.94h28.61l7.21-21.18h48.58l6.9,21.18h29.12l-42.48-115.17ZM120.23,153.85l15.54-45.64c.09-.54.33-.97.71-1.29.38-.34.86-.5,1.41-.5s1,.14,1.38.41c.39.27.69.73.9,1.38l14.56,45.64h-34.5Z";
const D_PATH = "M204.76,197.77c3.83-.97,7.56-2.27,11.16-3.98,11.8-5.47,20.92-15.05,25.65-27.18,2.83-6.82,3.93-13.93,4.52-21.37v-7.89c-.48-7.36-1.75-14.62-4.51-21.59-4.99-12.62-14.57-22.41-27.01-27.82-6.94-3.01-14.2-4.61-21.8-5.34h-37.46l42.48,115.16M220.83,152.29c-2.41,9.51-8.82,17.04-17.82,20.87-4.08,1.74-8.57,3.1-12.98,3.56l-26.31-71.33,22.29.41c5.67.01,11.07,1.06,16.25,3.14,9.33,3.74,15.99,11.4,18.51,21.14,1.89,7.3,1.91,14.9.06,22.21Z";

// ─── TIMELINE ENGINE ────────────────────────────────────────────────────────
const FLUBBER_OPTS = { maxSegmentLength: 2 };

const morphCache = new Map<string, { plusToFinal: (t: number) => string, finalToPlus: (t: number) => string }>();

function getFlubberMorphs(pathFinal: string) {
  if (!morphCache.has(pathFinal)) {
    morphCache.set(pathFinal, {
      plusToFinal: flubberInterp(PATH_PLUS, pathFinal, FLUBBER_OPTS),
      finalToPlus: flubberInterp(pathFinal, PATH_PLUS, FLUBBER_OPTS)
    });
  }
  return morphCache.get(pathFinal)!;
}

function getSafeMorphPath(
  frame: number,
  { plusToFinal, finalToPlus }: { plusToFinal: (t: number) => string, finalToPlus: (t: number) => string },
  pathFinal: string,
  shorterPresence: boolean = false
): string {
  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  const fInStart = 20;
  const fInEnd = 40;
  const fOutStart = shorterPresence ? 100 : 120;
  const fOutEnd = shorterPresence ? 120 : 140;

  const tIda   = clamp(interpolate(frame, [fInStart, fInEnd],  [0, 1], { easing: EASE_EMPHASIZED, extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const tVolta = clamp(interpolate(frame, [fOutStart, fOutEnd],[0, 1], { easing: EASE_EMPHASIZED, extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  if (frame < fInEnd)  return plusToFinal(tIda);
  if (frame < fOutStart) return pathFinal;       
  return finalToPlus(tVolta);
}

// ─── MOTORES FÍSICOS ────────────────────────────────────────────────────────
function getIsolatedFloatY(frame: number): number {
  if (frame < 20 || frame > 80) return 0;
  const upToTop = interpolate(frame, [20, 30], [0, -8], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hangToBottom = interpolate(frame, [30, 65], [-8, 8], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const backToCenter = interpolate(frame, [65, 80], [8, 0], { easing: Easing.in(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < 30) return upToTop;
  if (frame < 65) return hangToBottom;
  return backToCenter;
}

function getIsolatedHeartDynamics(frame: number) {
  if (frame < 20 || frame > 80) return { scale: 1.0, rotate: 0 };
  let progresso = 0;
  if (frame < 28) progresso = interpolate(frame, [20, 28], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" });
  else if (frame < 32) progresso = interpolate(frame, [28, 32], [1, 0], { easing: Easing.in(Easing.cubic), extrapolateRight: "clamp" });
  else if (frame < 40) progresso = interpolate(frame, [32, 40], [0, 0.7], { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" });
  else progresso = interpolate(frame, [40, 80], [0.7, 0], { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" });
  return { scale: 1.0 + (progresso * 0.08), rotate: progresso * 5 };
}

function getIsolatedRotation(frame: number): number {
  if (frame < 40 || frame > 120) return 0;
  const viraEsq = interpolate(frame, [40, 60], [0, 4], { easing: Easing.out(Easing.quad), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const balanco = interpolate(frame, [60, 100], [4, -4], { easing: Easing.inOut(Easing.quad), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const voltaAoCentro = interpolate(frame, [100, 120], [-4, 0], { easing: Easing.in(Easing.quad), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < 60) return viraEsq;
  if (frame < 100) return balanco;
  return voltaAoCentro;
}

// ─── COMPONENTE FINAL ───────────────────────────────────────────────────────
export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  layers, width = 280, height = 280, className, animationType = "A03", frameOverride
}) => {
  let defaultFrame = 0;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    defaultFrame = useCurrentFrame();
  } catch (e) {
    // Ignore error if not running inside Remotion Player
  }
  const frame = frameOverride !== undefined ? frameOverride : defaultFrame;
  
  const safeLayers = layers || {};
  const bgColor = safeLayers.fundo?.color || "#E5E5E5";
  const bgOpacity = safeLayers.fundo?.opacity ?? 1;
  const bgVisible = safeLayers.fundo?.visible ?? true;
  
  const plusColor = safeLayers["+"]?.color || "#FFFFFF";
  const plusOpacity = safeLayers["+"]?.opacity ?? 1;
  const plusVisible = safeLayers["+"]?.visible ?? true;
  
  const adColor = safeLayers.AD?.color || "#777777";
  const adOpacity = safeLayers.AD?.opacity ?? 1;
  const adVisible = safeLayers.AD?.visible ?? true;

  const morphGota = getFlubberMorphs(PATH_GOTA);
  const morphCoracao = getFlubberMorphs(PATH_CORACAO);
  const morphFolha = getFlubberMorphs(PATH_FOLHA);

  let pathD = PATH_PLUS;
  let transformPlus = "";

  if (animationType === "A01") {
     let scale = 1.0;
     if (frame >= 20 && frame <= 80) {
       const dyn = getIsolatedHeartDynamics(frame);
       scale = 1.0 + (dyn.scale - 1.0) * 0.4;
     }
     transformPlus = `scale(${scale})`;
  } else if (animationType === "A02") {
     pathD = getSafeMorphPath(frame, morphGota, PATH_GOTA, true);
     const floatY = getIsolatedFloatY(frame);
     transformPlus = `translateY(${floatY}px)`;
  } else if (animationType === "A03") {
     pathD = getSafeMorphPath(frame, morphCoracao, PATH_CORACAO, true);
     const dyn = getIsolatedHeartDynamics(frame);
     transformPlus = `scale(${dyn.scale}) rotate(${dyn.rotate}deg)`;
  } else if (animationType === "A04") {
     pathD = getSafeMorphPath(frame, morphFolha, PATH_FOLHA, false);
     const rotateDeg = getIsolatedRotation(frame);
     transformPlus = `rotate(${rotateDeg}deg)`;
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 263.76 280.36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: "visible" }}
    >
      <g opacity={bgOpacity} visibility={bgVisible ? "visible" : "hidden"}>
        <path d={FUNDO_PATH} fill={bgColor} />
      </g>
      
      <g opacity={plusOpacity} visibility={plusVisible ? "visible" : "hidden"} style={{ transformBox: "fill-box", transformOrigin: "center", transform: transformPlus }}>
        <path d={pathD} fill={plusColor} />
      </g>
      
      <g opacity={adOpacity} visibility={adVisible ? "visible" : "hidden"}>
        <path d={A_PATH} fill={adColor} />
        <path d={D_PATH} fill={adColor} />
      </g>
    </svg>
  );
};
