import { parseSvgElements } from "./svg-parser";
import type { SvgElement } from "./svg-parser";
import { transformPath, calculateTransform } from "./svg-flatten";
import type { PathTransform } from "./svg-flatten";
import { BODY_SHAPES } from "./body-shapes";
import type { BodyId } from "./body-shapes";
import { EYE_SETS } from "./eye-sets";
import type { EyeId } from "./eye-sets";
import { MOUTH_SETS } from "./mouth-sets";
import type { MouthId } from "./mouth-sets";
import { getBaseTransforms } from "./animations";
import type { AnimTransforms } from "./animations";

/*
 * ADAPTA — Compositor de mascotes v6
 *
 * Abordagem: ZERO <g transform> para posicionamento.
 * Body, olhos e boca usam nested <svg> com x/y/width/height/viewBox.
 * Elimina qualquer bug de composição de transforms.
 * Animação usa UM ÚNICO <g transform> wrapper (whole-body).
 */

export interface MascotConfig {
  bodyId: BodyId;
  eyeId: EyeId;
  mouthId: MouthId;
  faceOffsetY: number;
  noiseAmount: number;
  bodyColor?: string;
  eyeColor?: string;
  mouthColor?: string;
}

export type { BodyId, EyeId, MouthId };

// ── Constants ────────────────────────────────────────────

const VIEW = 500;
const BODY_FIT = 320;
const FACE_REF = 120;

// ── Pre-parse all SVG elements at module load ────────────

const PARSED_EYES: Record<string, SvgElement[]> = {};
for (const e of EYE_SETS) PARSED_EYES[e.id] = parseSvgElements(e.svg);

const PARSED_MOUTHS: Record<string, SvgElement[]> = {};
for (const m of MOUTH_SETS) PARSED_MOUTHS[m.id] = parseSvgElements(m.svg);

// ── Render parsed elements ───────────────────────────────

function RenderElements({ elements, overrideColor }: { elements: SvgElement[]; overrideColor?: string }) {
  return (
    <>
      {elements.map((el, i) => {
        if (el.type === "path") {
          return <path key={i} d={el.d} fill={overrideColor ?? el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth} />;
        }
        if (el.type === "circle") {
          return <circle key={i} cx={el.cx} cy={el.cy} r={el.r} fill={overrideColor ?? el.fill} />;
        }
        return null;
      })}
    </>
  );
}

function elementsToStr(elements: SvgElement[]): string {
  return elements
    .map((el) => {
      if (el.type === "path") {
        const attrs = [`d="${el.d}"`, `fill="${el.fill}"`];
        if (el.stroke) attrs.push(`stroke="${el.stroke}"`);
        if (el.strokeWidth) attrs.push(`stroke-width="${el.strokeWidth}"`);
        return `<path ${attrs.join(" ")} />`;
      }
      if (el.type === "circle") {
        return `<circle cx="${el.cx}" cy="${el.cy}" r="${el.r}" fill="${el.fill}" />`;
      }
      return "";
    })
    .join("");
}

// ── Layout ───────────────────────────────────────────────

export interface Layout {
  body: (typeof BODY_SHAPES)[0];
  eyes: (typeof EYE_SETS)[0];
  mouth: (typeof MOUTH_SETS)[0];
  bodyScale: number;
  bodyW: number;
  bodyH: number;
  bodyX: number;
  bodyY: number;
  faceScale: number;
  cx: number;
  bodyCY: number;
  eyeX: number;
  eyeY: number;
  eyeW: number;
  eyeH: number;
  mouthX: number;
  mouthY: number;
  mouthW: number;
  mouthH: number;
}

export function calcLayout(config: MascotConfig): Layout {
  const body = BODY_SHAPES.find(b => b.id === config.bodyId) ?? BODY_SHAPES[0];
  const eyes = EYE_SETS.find(e => e.id === config.eyeId) ?? EYE_SETS[0];
  const mouth = MOUTH_SETS.find(m => m.id === config.mouthId) ?? MOUTH_SETS[0];

  const bodyScale = Math.min(BODY_FIT / body.vw, BODY_FIT / body.vh);
  const bodyW = body.vw * bodyScale;
  const bodyH = body.vh * bodyScale;
  const bodyX = (VIEW - bodyW) / 2;
  const bodyY = (VIEW - bodyH) / 2 + 8;

  // ── Aplica ajuste de escala personalizado por corpo ──
  const faceScaleBase = bodyW / FACE_REF;
  const faceScale = faceScaleBase * (body.faceScaleAdjust ?? 1.0);
  
  const eyeW = eyes.vw * faceScale;
  const eyeH = eyes.vh * faceScale;
  const mouthW = mouth.vw * faceScale;
  const mouthH = mouth.vh * faceScale;

  const cx = VIEW / 2;
  const bodyCY = bodyY + bodyH / 2;
  const faceCenterY = bodyY + bodyH * body.faceCY + config.faceOffsetY;
  const gap = 12 * faceScale; // Distância mínima razoável entre olhos e boca (antes: 5)
  const totalFaceH = eyeH + gap + mouthH;
  const eyeTopY = faceCenterY - totalFaceH / 2 + (body.eyeOffsetY ?? 0);
  const mouthTopY = eyeTopY + eyeH + gap + (body.mouthOffsetY ?? 0);

  return {
    body, eyes, mouth,
    bodyScale, bodyW, bodyH, bodyX, bodyY,
    faceScale, cx, bodyCY,
    eyeW, eyeH, eyeX: cx - eyeW / 2, eyeY: eyeTopY,
    mouthW, mouthH, mouthX: cx - mouthW / 2, mouthY: mouthTopY,
  };
}

// ── Noise filter ─────────────────────────────────────────

function NoiseFilter({ id, amount }: { id: string; amount: number }) {
  if (amount <= 0) return null;
  return (
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves={2} seed={42} result="turb" />
      <feColorMatrix type="saturate" values="0" in="turb" result="gray" />
      
      {/* Gradiente vertical: mais escuro embaixo */}
      <feComponentTransfer in="SourceAlpha" result="gradient">
        <feFuncA type="table" tableValues="0.3 0.5 0.7 1.0" />
      </feComponentTransfer>
      
      {/* Combina ruído com gradiente */}
      <feComposite in="gray" in2="gradient" operator="in" result="shadedNoise" />
      
      <feComponentTransfer in="shadedNoise" result="noiseAlpha">
        <feFuncA type="linear" slope={amount * 0.8} intercept={0} />
      </feComponentTransfer>
      <feBlend in="SourceGraphic" in2="noiseAlpha" mode="multiply" result="blended" />
      <feComposite in="blended" in2="SourceGraphic" operator="in" />
    </filter>
  );
}

function noiseFilterStr(id: string, amount: number): string {
  if (amount <= 0) return "";
  return `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="2" seed="42" result="turb"/>
    <feColorMatrix type="saturate" values="0" in="turb" result="gray"/>
    <feComponentTransfer in="SourceAlpha" result="gradient">
      <feFuncA type="table" tableValues="0.3 0.5 0.7 1.0"/>
    </feComponentTransfer>
    <feComposite in="gray" in2="gradient" operator="in" result="shadedNoise"/>
    <feComponentTransfer in="shadedNoise" result="noiseAlpha"><feFuncA type="linear" slope="${amount * 0.8}" intercept="0"/></feComponentTransfer>
    <feBlend in="SourceGraphic" in2="noiseAlpha" mode="multiply" result="blended"/>
    <feComposite in="blended" in2="SourceGraphic" operator="in"/>
  </filter>`;
}

// ── React component ──────────────────────────────────────

interface MascotSVGProps {
  config: MascotConfig;
  anim?: AnimTransforms;
}

export function MascotSVG({ config, anim }: MascotSVGProps) {
  const L = calcLayout(config);
  const A = anim ?? getBaseTransforms();
  const noiseId = `noise-${config.bodyId}`;
  const hasNoise = config.noiseAmount > 0;

  // ── Use override eyes if animation specifies ──
  const actualEyes = A.eyeIdOverride
    ? (EYE_SETS.find(e => e.id === A.eyeIdOverride) ?? L.eyes)
    : L.eyes;

  // ── ANIMAÇÃO: aplicar transforms ──
  const totalBodyY = L.bodyY + A.bodyY;
  
  // Body transform (scale + rotate)
  const bodyCenterX = L.bodyX + L.bodyW / 2;
  const bodyCenterY = totalBodyY + L.bodyH / 2;
  const bodyTransform = `translate(${bodyCenterX}, ${bodyCenterY}) rotate(${A.bodyRotate}) scale(${A.bodyScaleX}, ${A.bodyScaleY}) translate(${-bodyCenterX}, ${-bodyCenterY})`;
  
  // Olhos com ajustes de animação
  const eyeW = actualEyes.vw * L.faceScale * A.eyeScaleX;
  const eyeH = actualEyes.vh * L.faceScale * A.eyeScaleY;
  const eyeXAdj = L.eyeX + A.eyeOffsetX;
  const eyeYAdj = L.eyeY + A.bodyY + A.eyeOffsetY + A.faceY;
  
  // Eye rotation transform (rotaciona ao redor do centro dos olhos)
  const eyeCenterX = eyeXAdj + eyeW / 2;
  const eyeCenterY = eyeYAdj + eyeH / 2;
  const eyeTransform = A.eyeRotate !== 0
    ? `rotate(${A.eyeRotate}, ${eyeCenterX}, ${eyeCenterY})`
    : undefined;

  // Boca com ajustes de animação
  const mouthW = L.mouthW;
  const mouthH = L.mouthH * A.mouthScaleY;
  const mouthYAdj = L.mouthY + A.bodyY + A.mouthOffsetY + A.faceY;
  const mouthXAdj = L.mouthX + A.mouthOffsetX;
  
  // Face group transform (rotate)
  const faceCenterX = VIEW / 2;
  const faceCenterY = (eyeYAdj + mouthYAdj + mouthH) / 2;
  const faceTransform = A.faceRotate !== 0 
    ? `rotate(${A.faceRotate}, ${faceCenterX}, ${faceCenterY})`
    : undefined;
  
  // Visibilidade: esconde quando scaleX muito pequeno
  const faceVisible = Math.abs(A.eyeScaleX) > 0.05;

  return (
    <svg
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      {hasNoise && (
        <defs>
          <NoiseFilter id={noiseId} amount={config.noiseAmount} />
        </defs>
      )}

      {/* Clip-path circular que simula a borda da esfera */}
      <defs>
        <clipPath id={`sphere-clip-${noiseId}`}>
          <circle cx={L.cx} cy={L.bodyY + L.bodyH / 2} r={L.bodyW * 0.48} />
        </clipPath>
      </defs>
      
      {/* Sombra */}
      <ellipse
        cx={L.cx}
        cy={totalBodyY + L.bodyH + 10}
        rx={L.bodyW * 0.28 * A.shadowScaleX}
        ry={5}
        fill={`rgba(0,0,0,${A.shadowOpacity})`}
      />

      {/* Grupo principal com transformação 3D */}
      <g transform={`translate(${VIEW / 2}, ${VIEW / 2}) scale(${A.bodyScaleX}, ${A.bodyScaleY}) translate(${-VIEW / 2}, ${-VIEW / 2})`}>
        {/* Corpo com rotação independente */}
        <g transform={bodyTransform}>
          <svg
            x={L.bodyX} y={totalBodyY}
            width={L.bodyW} height={L.bodyH}
            viewBox={`0 0 ${L.body.vw} ${L.body.vh}`}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d={L.body.path}
              fill={config.bodyColor ?? L.body.color}
              filter={hasNoise ? `url(#${noiseId})` : undefined}
            />
          </svg>
        </g>

        {/* Rosto com rotação independente */}
        <g transform={faceTransform}>
          {/* Boca - RENDERIZADA PRIMEIRO (fica por baixo) */}
          {faceVisible && (
            <svg
              x={mouthXAdj} y={mouthYAdj}
              width={mouthW} height={mouthH}
              viewBox={`0 0 ${L.mouth.vw} ${L.mouth.vh}`}
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
            >
              <RenderElements elements={PARSED_MOUTHS[config.mouthId] ?? []} />
            </svg>
          )}

          {/* Olhos - RENDERIZADOS DEPOIS (ficam por cima) */}
          {faceVisible && (
            <svg
              x={eyeXAdj} y={eyeYAdj}
              width={eyeW} height={eyeH}
              viewBox={`0 0 ${actualEyes.vw} ${actualEyes.vh}`}
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
              transform={eyeTransform}
            >
              <RenderElements elements={PARSED_EYES[actualEyes.id] ?? []} />
            </svg>
          )}
        </g>
      </g>

      {/* Zzz (sleep effect) */}
      {A.showZzz && (
        <g opacity={A.zzzOpacity ?? 1} transform={`translate(${L.cx + L.bodyW * 0.35}, ${L.bodyY + 20 + (A.zzzY ?? 0)})`}>
          <text
            x="0" y="0"
            fontSize="28"
            fontWeight="bold"
            fill="#888"
            fontFamily="Arial, sans-serif"
          >z</text>
          <text
            x="12" y="-8"
            fontSize="36"
            fontWeight="bold"
            fill="#666"
            fontFamily="Arial, sans-serif"
          >z</text>
          <text
            x="28" y="-18"
            fontSize="44"
            fontWeight="bold"
            fill="#444"
            fontFamily="Arial, sans-serif"
          >z</text>
        </g>
      )}
    </svg>
  );
}

// ── Static SVG string (export) ───────────────────────────
// ZERO transforms. Nested <svg> com posição absoluta.
// width/height explícitos no root para rasterização correta.

export function getMascotSvgString(config: MascotConfig): string {
  const L = calcLayout(config);
  const hasNoise = config.noiseAmount > 0;
  const nf = noiseFilterStr("noise", config.noiseAmount);
  const eyeStr = elementsToStr(PARSED_EYES[config.eyeId] ?? []);
  const mouthStr = elementsToStr(PARSED_MOUTHS[config.mouthId] ?? []);

  return `<svg viewBox="0 0 ${VIEW} ${VIEW}" width="${VIEW}" height="${VIEW}" xmlns="http://www.w3.org/2000/svg">
${hasNoise ? `<defs>${nf}</defs>` : ""}
<ellipse cx="${L.cx}" cy="${L.bodyY + L.bodyH + 10}" rx="${L.bodyW * 0.28}" ry="5" fill="rgba(0,0,0,0.06)"/>
<svg x="${L.bodyX}" y="${L.bodyY}" width="${L.bodyW}" height="${L.bodyH}" viewBox="0 0 ${L.body.vw} ${L.body.vh}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  <path d="${L.body.path}" fill="${config.bodyColor ?? L.body.color}"${hasNoise ? ' filter="url(#noise)"' : ""}/>
</svg>
<svg x="${L.eyeX}" y="${L.eyeY}" width="${L.eyeW}" height="${L.eyeH}" viewBox="0 0 ${L.eyes.vw} ${L.eyes.vh}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  ${eyeStr}
</svg>
<svg x="${L.mouthX}" y="${L.mouthY}" width="${L.mouthW}" height="${L.mouthH}" viewBox="0 0 ${L.mouth.vw} ${L.mouth.vh}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  ${mouthStr}
</svg>
</svg>`;
}

// ── REMOVED getMascotSvgAnimated ──
// Esta função usava serialização manual de string que causava bugs.
// Use exportGifDirect() de gif-from-canvas-direct.ts para exportação GIF.