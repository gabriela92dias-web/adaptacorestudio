import React from "react";
import { BODY_SHAPES } from "./body-shapes";
import { EYE_SETS } from "./eye-sets";
import { MOUTH_SETS } from "./mouth-sets";
import { parseSvgElements } from "./svg-parser";
import type { SvgElement } from "./svg-parser";

// Pre-parse once at module load
const PARSED_EYES: Record<string, SvgElement[]> = {};
for (const e of EYE_SETS) PARSED_EYES[e.id] = parseSvgElements(e.svg);

const PARSED_MOUTHS: Record<string, SvgElement[]> = {};
for (const m of MOUTH_SETS) PARSED_MOUTHS[m.id] = parseSvgElements(m.svg);

function RenderEls({ elements }: { elements: SvgElement[] }) {
  return (
    <>
      {elements.map((el, i) => {
        if (el.type === "path") return <path key={i} d={el.d} fill={el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth} />;
        if (el.type === "circle") return <circle key={i} cx={el.cx} cy={el.cy} r={el.r} fill={el.fill} />;
        return null;
      })}
    </>
  );
}

export function BodyMini({ bodyId, color, size = 44 }: { bodyId: string; color: string; size?: number }) {
  const body = BODY_SHAPES.find((b) => b.id === bodyId) ?? BODY_SHAPES[0];
  const pad = 3;
  const fit = size - pad * 2;
  const s = Math.min(fit / body.vw, fit / body.vh);
  const w = body.vw * s;
  const h = body.vh * s;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <g transform={`translate(${(size - w) / 2}, ${(size - h) / 2}) scale(${s})`}>
        <path d={body.path} fill={color} />
        <path
          d={body.path}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={1.5 / s}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function EyeMini({ eyeId, color = "#0e0d10", size = 44 }: { eyeId: string; color?: string; size?: number }) {
  const eyes = EYE_SETS.find((e) => e.id === eyeId) ?? EYE_SETS[0];
  const pad = 5;
  const s = Math.min((size - pad * 2) / eyes.vw, (size - pad * 2) / eyes.vh);
  const w = eyes.vw * s;
  const h = eyes.vh * s;
  
  // Substituir cores no SVG
  const coloredSvg = eyes.svg.replace(/#0e0d10/g, color);
  
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <g
        transform={`translate(${(size - w) / 2}, ${(size - h) / 2}) scale(${s})`}
        dangerouslySetInnerHTML={{ __html: coloredSvg }}
      />
    </svg>
  );
}

export function MouthMini({ mouthId, color = "#0e0d10", size = 44 }: { mouthId: string; color?: string; size?: number }) {
  const mouth = MOUTH_SETS.find((m) => m.id === mouthId) ?? MOUTH_SETS[0];
  const pad = 6;
  const s = Math.min((size - pad * 2) / mouth.vw, (size - pad * 2) / mouth.vh);
  const w = mouth.vw * s;
  const h = mouth.vh * s;
  
  // Substituir cores no SVG
  const coloredSvg = mouth.svg.replace(/#0e0d10/g, color);
  
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <g
        transform={`translate(${(size - w) / 2}, ${(size - h) / 2}) scale(${s})`}
        dangerouslySetInnerHTML={{ __html: coloredSvg }}
      />
    </svg>
  );
}