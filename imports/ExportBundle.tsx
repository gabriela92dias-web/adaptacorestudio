/*
 * ADAPTA — ExportBundle
 * Botao que gera um bundle completo de todos os arquivos
 * do MascotBuilder, pronto pra colar no chat de outro agente.
 */

import { useState } from "react";
import { BODY_SHAPES, type BodyId } from './body-shapes';
import { EYE_SETS, EYE_SETS_SELECTABLE, type EyeId } from './eye-sets';
import { MOUTH_SETS, type MouthId } from './mouth-sets';
import { Package, Copy, Check, Download, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

// ── File generators ──────────────────────────────────────
// Build file contents at runtime from the actual imported data,
// so they're always in sync with the running app.

function generateBodyShapesTS(): string {
  const items = BODY_SHAPES.map(b => {
    return `  {
    id: ${JSON.stringify(b.id)}, label: ${JSON.stringify(b.label)},
    vw: ${b.vw}, vh: ${b.vh}, color: ${JSON.stringify(b.color)}, faceCY: ${b.faceCY},
    path: ${JSON.stringify(b.path)},
  }`;
  }).join(",\n");

  return `/*
 * ADAPTA — 13 formas de corpo (SVGs do Figma)
 * Cada body tem cor original + posicao do rosto.
 */

export interface BodyShape {
  id: string;
  label: string;
  path: string;
  vw: number;
  vh: number;
  color: string;
  faceCY: number;
}

export const BODY_SHAPES: BodyShape[] = [
${items},
];

export const BODY_IDS = BODY_SHAPES.map(b => b.id);
export type BodyId = typeof BODY_IDS[number];
`;
}

function generateEyeSetsTS(): string {
  const items = EYE_SETS.map(e => {
    const svgEscaped = JSON.stringify(e.svg);
    return `  {
    id: ${JSON.stringify(e.id)},
    label: ${JSON.stringify(e.label)},
    vw: ${e.vw}, vh: ${e.vh},
    svg: ${svgEscaped},
  }`;
  }).join(",\n");

  return `/*
 * ADAPTA — Conjuntos de olhos (SVG paths do Figma)
 * fill #0e0d10 = preto, #fff = branco.
 */

export interface EyeSet {
  id: string;
  label: string;
  svg: string;
  vw: number;
  vh: number;
}

export const EYE_SETS: EyeSet[] = [
${items},
];

export const EYE_IDS = EYE_SETS.map(e => e.id);
export type EyeId = typeof EYE_IDS[number];

export const EYE_SETS_SELECTABLE: EyeSet[] = [
${EYE_SETS_SELECTABLE.map(e => {
  const svgEscaped = JSON.stringify(e.svg);
  return `  {
    id: ${JSON.stringify(e.id)},
    label: ${JSON.stringify(e.label)},
    vw: ${e.vw}, vh: ${e.vh},
    svg: ${svgEscaped},
  }`;
}).join(",\n")},
];
`;
}

function generateMouthSetsTS(): string {
  const items = MOUTH_SETS.map(m => {
    const svgEscaped = JSON.stringify(m.svg);
    return `  {
    id: ${JSON.stringify(m.id)},
    label: ${JSON.stringify(m.label)},
    vw: ${m.vw}, vh: ${m.vh},
    svg: ${svgEscaped},
  }`;
  }).join(",\n");

  return `/*
 * ADAPTA — 9 bocas (SVG paths do Figma)
 */

export interface MouthSet {
  id: string;
  label: string;
  svg: string;
  vw: number;
  vh: number;
}

export const MOUTH_SETS: MouthSet[] = [
${items},
];

export const MOUTH_IDS = MOUTH_SETS.map(m => m.id);
export type MouthId = typeof MOUTH_IDS[number];
`;
}

// Static component files (no backtick SVG data, so safe to embed)
const MASCOT_SVG_TSX = `import React from "react";
import { BODY_SHAPES } from "./body-shapes";
import type { BodyId } from "./body-shapes";
import { EYE_SETS } from "./eye-sets";
import type { EyeId } from "./eye-sets";
import { MOUTH_SETS } from "./mouth-sets";
import type { MouthId } from "./mouth-sets";

export interface MascotConfig {
  bodyId: BodyId;
  eyeId: EyeId;
  mouthId: MouthId;
  faceOffsetY: number;
  noiseAmount: number;
}

export type { BodyId, EyeId, MouthId };

const VIEW = 300;
const BODY_FIT = 190;
const FACE_REFERENCE = 120;

function calcLayout(config: MascotConfig) {
  const body = BODY_SHAPES.find(b => b.id === config.bodyId) ?? BODY_SHAPES[0];
  const eyes = EYE_SETS.find(e => e.id === config.eyeId) ?? EYE_SETS[0];
  const mouth = MOUTH_SETS.find(m => m.id === config.mouthId) ?? MOUTH_SETS[0];

  const bodyScale = Math.min(BODY_FIT / body.vw, BODY_FIT / body.vh);
  const bodyW = body.vw * bodyScale;
  const bodyH = body.vh * bodyScale;
  const bodyX = (VIEW - bodyW) / 2;
  const bodyY = (VIEW - bodyH) / 2 + 4;

  const faceScale = bodyW / FACE_REFERENCE;
  const eyeW = eyes.vw * faceScale;
  const eyeH = eyes.vh * faceScale;
  const mouthW = mouth.vw * faceScale;
  const mouthH = mouth.vh * faceScale;

  const cx = VIEW / 2;
  const faceCenterY = bodyY + bodyH * body.faceCY + config.faceOffsetY;
  const gap = 12 * faceScale; // Distância mínima razoável entre olhos e boca (antes: 3)
  const totalFaceH = eyeH + gap + mouthH;
  const eyeTopY = faceCenterY - totalFaceH / 2;
  const mouthTopY = eyeTopY + eyeH + gap;

  return {
    body, eyes, mouth,
    bodyScale, bodyW, bodyH, bodyX, bodyY,
    faceScale, cx,
    eyeW, eyeH, eyeX: cx - eyeW / 2, eyeY: eyeTopY,
    mouthW, mouthH, mouthX: cx - mouthW / 2, mouthY: mouthTopY,
  };
}

export function MascotSVG({ config }: { config: MascotConfig }) {
  const L = calcLayout(config);
  const clipId = "clip-" + config.bodyId;
  const noiseId = "noise-" + config.bodyId;

  return (
    <svg viewBox={"0 0 " + VIEW + " " + VIEW} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={clipId}>
          <path d={L.body.path} transform={"translate(" + L.bodyX + ", " + L.bodyY + ") scale(" + L.bodyScale + ")"} />
        </clipPath>
        {config.noiseAmount > 0 && (
          <filter id={noiseId} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves={4} seed={42} result="n" />
            <feColorMatrix type="saturate" values="0" in="n" result="gn" />
            <feComponentTransfer in="gn" result="an">
              <feFuncA type="linear" slope={config.noiseAmount * 0.4} intercept={0} />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="an" mode="multiply" />
          </filter>
        )}
      </defs>
      <ellipse cx={VIEW / 2} cy={L.bodyY + L.bodyH + 6} rx={L.bodyW * 0.28} ry={3.5} fill="rgba(0,0,0,0.06)" />
      <g transform={"translate(" + L.bodyX + ", " + L.bodyY + ") scale(" + L.bodyScale + ")"}>
        <path d={L.body.path} fill={L.body.color} />
      </g>
      {config.noiseAmount > 0 && (
        <g clipPath={"url(#" + clipId + ")"}>
          <rect x={0} y={0} width={VIEW} height={VIEW} fill="transparent" filter={"url(#" + noiseId + ")"} opacity={config.noiseAmount * 0.3} />
        </g>
      )}
      <g transform={"translate(" + L.eyeX + ", " + L.eyeY + ") scale(" + L.faceScale + ")"} dangerouslySetInnerHTML={{ __html: L.eyes.svg }} />
      <g transform={"translate(" + L.mouthX + ", " + L.mouthY + ") scale(" + L.faceScale + ")"} dangerouslySetInnerHTML={{ __html: L.mouth.svg }} />
    </svg>
  );
}

export function getMascotSvgString(config: MascotConfig): string {
  const L = calcLayout(config);
  let defs = "";
  let noiseOverlay = "";
  if (config.noiseAmount > 0) {
    defs = '<defs><clipPath id="bodyClip"><path d="' + L.body.path + '" transform="translate(' + L.bodyX + ", " + L.bodyY + ") scale(" + L.bodyScale + ')"/></clipPath><filter id="noise" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" seed="42" result="n"/><feColorMatrix type="saturate" values="0" in="n" result="gn"/><feComponentTransfer in="gn" result="an"><feFuncA type="linear" slope="' + (config.noiseAmount * 0.4) + '" intercept="0"/></feComponentTransfer><feBlend in="SourceGraphic" in2="an" mode="multiply"/></filter></defs>';
    noiseOverlay = '<g clip-path="url(#bodyClip)"><rect x="0" y="0" width="' + VIEW + '" height="' + VIEW + '" fill="transparent" filter="url(#noise)" opacity="' + (config.noiseAmount * 0.3) + '"/></g>';
  }
  return '<svg viewBox="0 0 ' + VIEW + " " + VIEW + '" xmlns="http://www.w3.org/2000/svg">' + defs + '<ellipse cx="' + (VIEW / 2) + '" cy="' + (L.bodyY + L.bodyH + 6) + '" rx="' + (L.bodyW * 0.28) + '" ry="3.5" fill="rgba(0,0,0,0.06)"/><g transform="translate(' + L.bodyX + ", " + L.bodyY + ") scale(" + L.bodyScale + ')"><path d="' + L.body.path + '" fill="' + L.body.color + '"/></g>' + noiseOverlay + '<g transform="translate(' + L.eyeX + ", " + L.eyeY + ") scale(" + L.faceScale + ')">' + L.eyes.svg + '</g><g transform="translate(' + L.mouthX + ", " + L.mouthY + ") scale(" + L.faceScale + ')">' + L.mouth.svg + "</g></svg>";
}
`;

const MINI_PREVIEW_TSX = `import React from "react";
import { BODY_SHAPES } from "./body-shapes";
import { EYE_SETS } from "./eye-sets";
import { MOUTH_SETS } from "./mouth-sets";

export function BodyMini({ bodyId, size = 44 }: { bodyId: string; size?: number }) {
  const body = BODY_SHAPES.find(b => b.id === bodyId) ?? BODY_SHAPES[0];
  const pad = 3;
  const fit = size - pad * 2;
  const s = Math.min(fit / body.vw, fit / body.vh);
  const w = body.vw * s;
  const h = body.vh * s;
  return (
    <svg viewBox={"0 0 " + size + " " + size} width={size} height={size}>
      <g transform={"translate(" + ((size - w) / 2) + ", " + ((size - h) / 2) + ") scale(" + s + ")"}>
        <path d={body.path} fill={body.color} />
        <path d={body.path} fill="none" stroke="#1a1a1a" strokeWidth={1.5 / s} strokeLinejoin="round" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function EyeMini({ eyeId, size = 44 }: { eyeId: string; size?: number }) {
  const eyes = EYE_SETS.find(e => e.id === eyeId) ?? EYE_SETS[0];
  const pad = 5;
  const s = Math.min((size - pad * 2) / eyes.vw, (size - pad * 2) / eyes.vh);
  const w = eyes.vw * s;
  const h = eyes.vh * s;
  return (
    <svg viewBox={"0 0 " + size + " " + size} width={size} height={size}>
      <g transform={"translate(" + ((size - w) / 2) + ", " + ((size - h) / 2) + ") scale(" + s + ")"}
        dangerouslySetInnerHTML={{ __html: eyes.svg }} />
    </svg>
  );
}

export function MouthMini({ mouthId, size = 44 }: { mouthId: string; size?: number }) {
  const mouth = MOUTH_SETS.find(m => m.id === mouthId) ?? MOUTH_SETS[0];
  const pad = 6;
  const s = Math.min((size - pad * 2) / mouth.vw, (size - pad * 2) / mouth.vh);
  const w = mouth.vw * s;
  const h = mouth.vh * s;
  return (
    <svg viewBox={"0 0 " + size + " " + size} width={size} height={size}>
      <g transform={"translate(" + ((size - w) / 2) + ", " + ((size - h) / 2) + ") scale(" + s + ")"}
        dangerouslySetInnerHTML={{ __html: mouth.svg }} />
    </svg>
  );
}
`;

const CONTROL_PANEL_TSX = `import React, { useState } from "react";
import type { MascotConfig } from "./MascotSVG";
import { BODY_SHAPES } from "./body-shapes";
import { EYE_SETS } from "./eye-sets";
import { MOUTH_SETS } from "./mouth-sets";
import { BodyMini, EyeMini, MouthMini } from "./MiniPreview";
import {
  ChevronDown, Sparkles, RotateCcw,
  Eye, Smile, Shapes, SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function Section({ title, icon, children, defaultOpen = true, badge }: {
  title: string; icon?: React.ReactNode; children: React.ReactNode;
  defaultOpen?: boolean; badge?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-black/5 pb-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center w-full text-left py-2 cursor-pointer gap-2 group"
      >
        {icon && <span className="text-[#bbb] group-hover:text-[#888] transition-colors">{icon}</span>}
        <span className="text-[13px] tracking-tight text-[#444] flex-1">{title}</span>
        {badge && (
          <span className="text-[9px] bg-[#f0f0f0] text-[#999] px-1.5 py-0.5 rounded-full truncate max-w-[80px]">{badge}</span>
        )}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={12} className="text-[#ccc]" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-0.5 pb-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-[#999] w-[56px] shrink-0 text-right">{label}</span>
      <div className="flex-1 relative h-5 flex items-center">
        <div className="absolute inset-x-0 h-[3px] rounded-full bg-[#f0f0f0]" />
        <div className="absolute left-0 h-[3px] rounded-full bg-[#333] transition-all" style={{ width: pct + "%" }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute w-3.5 h-3.5 rounded-full bg-white border-2 border-[#333] shadow-sm transition-all pointer-events-none"
          style={{ left: "calc(" + pct + "% - 7px)" }}
        />
      </div>
      <span className="text-[10px] text-[#bbb] w-8 tabular-nums text-right shrink-0">
        {step < 1 ? value.toFixed(2) : value}
      </span>
    </div>
  );
}

interface Props {
  config: MascotConfig;
  setConfig: (c: MascotConfig) => void;
  onRandomize: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export function ControlPanel({
  config, setConfig, onRandomize, onReset,
  canUndo, canRedo, onUndo, onRedo,
}: Props) {
  const set = <K extends keyof MascotConfig>(key: K, val: MascotConfig[K]) =>
    setConfig({ ...config, [key]: val });

  return (
    <div className="flex flex-col gap-0 w-full">
      <div className="flex items-center gap-1.5 pb-3 border-b border-black/5 mb-0.5">
        <button onClick={onUndo} disabled={!canUndo}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-black/6 text-[10px] text-[#aaa] hover:text-[#555] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Ctrl+Z">
          <RotateCcw size={10} /> Desfazer
        </button>
        <button onClick={onRedo} disabled={!canRedo}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-black/6 text-[10px] text-[#aaa] hover:text-[#555] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Ctrl+Shift+Z">
          <RotateCcw size={10} className="scale-x-[-1]" /> Refazer
        </button>
        <div className="flex-1" />
        <button onClick={onReset}
          className="px-2 py-1.5 rounded-lg border border-black/6 text-[10px] text-[#aaa] hover:text-[#555] transition-all cursor-pointer">
          Resetar
        </button>
      </div>

      <Section title="Corpo" icon={<Shapes size={13} />} badge={
        BODY_SHAPES.find(b => b.id === config.bodyId)?.label
      }>
        <div className="grid grid-cols-5 gap-1">
          {BODY_SHAPES.map((b) => (
            <button key={b.id} onClick={() => set("bodyId", b.id)}
              className={"flex flex-col items-center gap-0.5 p-1 rounded-xl border-2 transition-all cursor-pointer " +
                (config.bodyId === b.id
                  ? "border-[#333] bg-white shadow-sm"
                  : "border-transparent bg-[#fafafa] hover:border-[#ddd]")}>
              <BodyMini bodyId={b.id} size={38} />
              <span className={"text-[8px] tracking-tight leading-none " +
                (config.bodyId === b.id ? "text-[#333]" : "text-[#ccc]")}>
                {b.label}
              </span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Olhos" icon={<Eye size={13} />} badge={
        EYE_SETS_SELECTABLE.find(e => e.id === config.eyeId)?.label
      }>
        <div className="grid grid-cols-5 gap-1">
          {EYE_SETS_SELECTABLE.map((e) => (
            <button key={e.id} onClick={() => set("eyeId", e.id)}
              className={"flex flex-col items-center gap-0.5 p-1 rounded-xl border-2 transition-all cursor-pointer " +
                (config.eyeId === e.id
                  ? "border-[#333] bg-white shadow-sm"
                  : "border-transparent bg-[#fafafa] hover:border-[#ddd]")}>
              <EyeMini eyeId={e.id} size={38} />
              <span className={"text-[7px] tracking-tight leading-none truncate w-full text-center " +
                (config.eyeId === e.id ? "text-[#333]" : "text-[#ccc]")}>
                {e.label}
              </span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Boca" icon={<Smile size={13} />} badge={
        MOUTH_SETS.find(m => m.id === config.mouthId)?.label
      }>
        <div className="grid grid-cols-5 gap-1">
          {MOUTH_SETS.map((m) => (
            <button key={m.id} onClick={() => set("mouthId", m.id)}
              className={"flex flex-col items-center gap-0.5 p-1 rounded-xl border-2 transition-all cursor-pointer " +
                (config.mouthId === m.id
                  ? "border-[#333] bg-white shadow-sm"
                  : "border-transparent bg-[#fafafa] hover:border-[#ddd]")}>
              <MouthMini mouthId={m.id} size={38} />
              <span className={"text-[8px] tracking-tight leading-none " +
                (config.mouthId === m.id ? "text-[#333]" : "text-[#ccc]")}>
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Ajustes" icon={<SlidersHorizontal size={13} />} defaultOpen={false}>
        <div className="flex flex-col gap-3 py-1">
          <Slider label="Ruido" value={config.noiseAmount} min={0} max={1} step={0.05} onChange={(v) => set("noiseAmount", v)} />
          <Slider label="Face Y" value={config.faceOffsetY} min={-25} max={25} step={1} onChange={(v) => set("faceOffsetY", v)} />
        </div>
      </Section>

      <div className="pt-3">
        <button
          onClick={onRandomize}
          className="w-full flex items-center justify-center gap-2 bg-[#333] text-white px-4 py-2.5 rounded-xl hover:bg-[#444] active:scale-[0.98] transition-all cursor-pointer text-[12px] shadow-sm"
        >
          <Sparkles size={13} /> Surpresa!
        </button>
        <p className="text-[9px] text-[#ccc] text-center mt-1.5">
          Espaco = surpresa / Ctrl+Z = desfazer
        </p>
      </div>
    </div>
  );
}
`;

const MASCOT_BUILDER_TSX = `import { useState, useCallback, useEffect } from "react";
import { MascotSVG, getMascotSvgString } from "./MascotSVG";
import type { MascotConfig } from "./MascotSVG";
import { BODY_SHAPES } from "./body-shapes";
import { EYE_SETS } from "./eye-sets";
import { MOUTH_SETS } from "./mouth-sets";
import { ControlPanel } from "./ControlPanel";
import { Download, Copy, Check, Image } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const BODY_IDS = BODY_SHAPES.map(b => b.id);
const EYE_IDS = EYE_SETS.map(e => e.id);
const MOUTH_IDS = MOUTH_SETS.map(m => m.id);

const DEFAULT_CONFIG: MascotConfig = {
  bodyId: "blob",
  eyeId: "redondo2",
  mouthId: "sorriso",
  faceOffsetY: 0,
  noiseAmount: 0,
};

function useHistory<T>(initial: T) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initial);
  const [future, setFuture] = useState<T[]>([]);

  const push = useCallback((next: T) => {
    setPast(p => [...p.slice(-30), present]);
    setPresent(next);
    setFuture([]);
  }, [present]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    setFuture(f => [present, ...f]);
    setPresent(past[past.length - 1]);
    setPast(p => p.slice(0, -1));
  }, [past, present]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    setPast(p => [...p, present]);
    setPresent(future[0]);
    setFuture(f => f.slice(1));
  }, [future, present]);

  const reset = useCallback((val: T) => {
    setPast(p => [...p.slice(-30), present]);
    setPresent(val);
    setFuture([]);
  }, [present]);

  return {
    state: present, set: push, undo, redo, reset,
    canUndo: past.length > 0, canRedo: future.length > 0,
  };
}

interface MascotBuilderProps {
  showHeader?: boolean;
  className?: string;
}

export function MascotBuilder({ showHeader = true, className = "" }: MascotBuilderProps) {
  const history = useHistory<MascotConfig>(DEFAULT_CONFIG);
  const config = history.state;
  const [animKey, setAnimKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const setConfig = useCallback((c: MascotConfig) => {
    history.set(c);
    setAnimKey(k => k + 1);
  }, [history]);

  const randomize = useCallback(() => {
    history.set({
      bodyId: pick(BODY_IDS),
      eyeId: pick(EYE_IDS),
      mouthId: pick(MOUTH_IDS),
      faceOffsetY: 0,
      noiseAmount: Math.random() > 0.7 ? Math.round(Math.random() * 5) / 10 : 0,
    });
    setAnimKey(k => k + 1);
  }, [history]);

  const resetConfig = useCallback(() => {
    history.reset(DEFAULT_CONFIG);
    setAnimKey(k => k + 1);
  }, [history]);

  const downloadSvg = useCallback(() => {
    const blob = new Blob([getMascotSvgString(config)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "adapta-" + config.bodyId + ".svg"; a.click();
    URL.revokeObjectURL(url);
    toast.success("SVG exportado!");
  }, [config]);

  const downloadPng = useCallback(() => {
    const svgString = getMascotSvgString(config);
    
    const size = 600;
    const canvas = document.createElement("canvas");
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Preencher com fundo branco antes de desenhar
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    
    const img = document.createElement('img');
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "adapta-" + config.bodyId + ".png"; a.click();
        URL.revokeObjectURL(url);
        toast.success("PNG exportado!");
      });
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString)));
  }, [config]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getMascotSvgString(config));
      setCopied(true); toast.success("SVG copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error("Erro ao copiar"); }
  }, [config]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === "Space") { e.preventDefault(); randomize(); }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault(); history.undo(); setAnimKey(k => k + 1);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault(); history.redo(); setAnimKey(k => k + 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [randomize, history]);

  return (
    <div className={"flex flex-col bg-[#FBF5F0] overflow-hidden " + className}>
      {showHeader && (
        <header className="border-b border-black/5 px-4 py-2.5 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-sm z-20">
          <div className="flex items-center gap-3">
            <h2 className="tracking-tight text-[#333] text-[15px]">ADAPTA</h2>
            <span className="text-[#d0d0d0] text-[10px] hidden sm:block">gerador de mascotes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={copyToClipboard}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-black/8 text-[#aaa] hover:text-[#666] transition-colors cursor-pointer text-[11px]">
              {copied ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
              <span className="hidden sm:inline">{copied ? "Copiado" : "Copiar"}</span>
            </button>
            <button onClick={downloadSvg}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#333] text-white hover:bg-[#444] transition-colors cursor-pointer text-[11px]">
              <Download size={11} /> SVG
            </button>
            <button onClick={downloadPng}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#555] text-white hover:bg-[#666] transition-colors cursor-pointer text-[11px]">
              <Image size={11} /> PNG
            </button>
          </div>
        </header>
      )}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        <div className="shrink-0 h-[44vh] lg:h-auto lg:flex-1 flex items-center justify-center relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: "radial-gradient(circle, #333 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />
          <motion.div
            key={animKey}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[340px] lg:h-[340px] relative z-10"
          >
            <MascotSVG config={config} />
          </motion.div>
        </div>
        <div className="flex-1 lg:flex-none lg:w-[340px] xl:w-[370px] border-t lg:border-t-0 lg:border-l border-black/5 bg-white overflow-y-auto min-h-0">
          <div className="p-4 pb-20">
            <ControlPanel
              config={config}
              setConfig={setConfig}
              onRandomize={randomize}
              onReset={resetConfig}
              canUndo={history.canUndo}
              canRedo={history.canRedo}
              onUndo={() => { history.undo(); setAnimKey(k => k + 1); }}
              onRedo={() => { history.redo(); setAnimKey(k => k + 1); }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
`;

// ── Bundle assembly ──────────────────────────────────────

interface FileEntry {
  path: string;
  description: string;
  getContent: () => string;
}

function getFiles(): FileEntry[] {
  return [
    {
      path: "/src/components/body-shapes.ts",
      description: "13 corpos SVG com cores e faceCY",
      getContent: generateBodyShapesTS,
    },
    {
      path: "/src/components/eye-sets.ts",
      description: "23 conjuntos de olhos SVG",
      getContent: generateEyeSetsTS,
    },
    {
      path: "/src/components/mouth-sets.ts",
      description: "9 bocas SVG",
      getContent: generateMouthSetsTS,
    },
    {
      path: "/src/components/MascotSVG.tsx",
      description: "Compositor SVG (escala uniforme, sem overlap)",
      getContent: () => MASCOT_SVG_TSX,
    },
    {
      path: "/src/components/MiniPreview.tsx",
      description: "Thumbnails para seletores",
      getContent: () => MINI_PREVIEW_TSX,
    },
    {
      path: "/src/components/ControlPanel.tsx",
      description: "Painel de selecao (corpo/olhos/boca/ajustes)",
      getContent: () => CONTROL_PANEL_TSX,
    },
    {
      path: "/src/components/MascotBuilder.tsx",
      description: "Componente principal encapsulado",
      getContent: () => MASCOT_BUILDER_TSX,
    },
  ];
}

function buildFullBundle(): string {
  const files = getFiles();
  const header = `# ADAPTA - Gerador de Mascotes (Bundle Completo)

## Instrucoes para o agente

Crie cada arquivo abaixo em /src/components/.
Depois, no seu App.tsx (ou na rota desejada), use:

\`\`\`tsx
import { MascotBuilder } from "./components/MascotBuilder";
import { Toaster } from "sonner";

// Tela inteira:
<Toaster position="bottom-center" />
<MascotBuilder className="h-screen" />

// Ou embutido sem header:
<MascotBuilder showHeader={false} className="h-[600px]" />
\`\`\`

Pacotes npm necessarios: motion, sonner, lucide-react

---
`;

  const fileBlocks = files.map(f => {
    return `## ${f.path}
${f.description}

\`\`\`tsx
${f.getContent()}
\`\`\`
`;
  }).join("\n---\n\n");

  return header + fileBlocks;
}

// ── FileCard component ───────────────────────────────────

function FileCard({ file, isOpen, onToggle }: {
  file: FileEntry;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyFile = async () => {
    try {
      await navigator.clipboard.writeText(file.getContent());
      setCopied(true);
      toast.success(`${file.path.split("/").pop()} copiado!`);
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error("Erro ao copiar"); }
  };

  return (
    <div className="border border-black/8 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center gap-2 px-3 py-2">
        <button onClick={onToggle} className="flex-1 flex items-center gap-2 text-left cursor-pointer">
          <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.15 }}>
            <ChevronDown size={11} className="text-[#aaa]" />
          </motion.span>
          <code className="text-[11px] text-[#555]">{file.path.split("/").pop()}</code>
          <span className="text-[9px] text-[#bbb] truncate">{file.description}</span>
        </button>
        <button
          onClick={copyFile}
          className="flex items-center gap-1 px-2 py-1 rounded-lg border border-black/6 text-[10px] text-[#aaa] hover:text-[#555] transition-colors cursor-pointer shrink-0"
        >
          {copied ? <Check size={9} className="text-green-500" /> : <Copy size={9} />}
          {copied ? "OK" : "Copiar"}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <pre className="px-3 pb-3 text-[9px] leading-[1.5] text-[#666] bg-[#fafafa] border-t border-black/5 overflow-x-auto max-h-[200px] overflow-y-auto">
              {file.getContent().slice(0, 2000)}
              {file.getContent().length > 2000 && "\n\n... (truncado na preview, conteudo completo ao copiar)"}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── ExportBundle (main component) ────────────────────────

export function ExportBundle() {
  const [open, setOpen] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [openFiles, setOpenFiles] = useState<Set<number>>(new Set());
  const files = getFiles();

  const toggleFile = (i: number) => {
    setOpenFiles(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(buildFullBundle());
      setCopiedAll(true);
      toast.success("Bundle completo copiado! Cole no chat do outro agente.");
      setTimeout(() => setCopiedAll(false), 3000);
    } catch { toast.error("Erro ao copiar"); }
  };

  const downloadBundle = () => {
    const blob = new Blob([buildFullBundle()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "adapta-bundle.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Bundle baixado!");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dashed border-[#ccc] text-[#999] hover:text-[#555] hover:border-[#999] transition-all cursor-pointer text-[11px]"
      >
        <Package size={11} />
        <span className="hidden sm:inline">Exportar App</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-[#FBF5F0] rounded-2xl shadow-2xl w-full max-w-[520px] max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 bg-white/80">
                <div>
                  <h3 className="text-[14px] text-[#333] tracking-tight">Exportar ADAPTA</h3>
                  <p className="text-[10px] text-[#aaa] mt-0.5">7 arquivos &middot; cole no chat do outro agente</p>
                </div>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
                  <X size={14} className="text-[#aaa]" />
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 px-5 py-3 border-b border-black/5 bg-white/60">
                <button
                  onClick={copyAll}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#333] text-white px-4 py-2.5 rounded-xl hover:bg-[#444] active:scale-[0.98] transition-all cursor-pointer text-[12px] shadow-sm"
                >
                  {copiedAll ? <Check size={13} className="text-green-300" /> : <Copy size={13} />}
                  {copiedAll ? "Copiado!" : "Copiar tudo"}
                </button>
                <button
                  onClick={downloadBundle}
                  className="flex items-center justify-center gap-2 bg-white border border-black/10 text-[#555] px-4 py-2.5 rounded-xl hover:bg-[#f5f5f5] active:scale-[0.98] transition-all cursor-pointer text-[12px]"
                >
                  <Download size={13} /> .txt
                </button>
              </div>

              {/* File list */}
              <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-2">
                {files.map((f, i) => (
                  <FileCard
                    key={f.path}
                    file={f}
                    isOpen={openFiles.has(i)}
                    onToggle={() => toggleFile(i)}
                  />
                ))}
              </div>

              {/* Footer hint */}
              <div className="px-5 py-3 border-t border-black/5 bg-white/60">
                <p className="text-[9px] text-[#bbb] text-center leading-relaxed">
                  npm: <code className="bg-[#f0f0f0] px-1 rounded">motion</code> <code className="bg-[#f0f0f0] px-1 rounded">sonner</code> <code className="bg-[#f0f0f0] px-1 rounded">lucide-react</code>
                  &nbsp;&middot;&nbsp;
                  Use <code className="bg-[#f0f0f0] px-1 rounded">&lt;MascotBuilder /&gt;</code> no App.tsx
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
