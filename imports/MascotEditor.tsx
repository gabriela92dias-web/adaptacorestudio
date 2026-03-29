/*
 * ═══════════════════════════════════════════════════════════
 * ADAPTA — MascotEditor (Versão Página Completa)
 * ─────────────────────────────────────────────────────────
 * Editor de mascotes para uso em páginas completas.
 * Não usa position:fixed, integra-se ao layout da plataforma.
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { 
  Download,
  FileImage,
  FileType,
  Undo,
  Redo,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";
import { MascotSVG, MascotConfig } from "./MascotSVG";
import { ControlPanel } from "./ControlPanel";
import { getMascotSvgString } from "./MascotSVG";
import { BODY_IDS } from "./body-shapes";
import { EYE_IDS } from "./eye-sets";
import { MOUTH_IDS } from "./mouth-sets";
import { toast } from "sonner";
import { ExportBundle } from "./ExportBundle";
import { useAnimationLoop } from "./AnimationPanel";
import { getMascotBodyColors } from "../modules/tools/utils/cartilha-cromatica";
import { ANIMATIONS } from "./animations";
import { useTranslations } from "../i18n/use-translations";
import { exportGifDirect } from "./gif-from-canvas-direct";

// ── helpers ──────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── useHistory hook ──────────────────────────────────────

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

const DEFAULT_CONFIG: MascotConfig = {
  bodyId: "blob",
  eyeId: "redondo2",
  mouthId: "sorriso",
  faceOffsetY: 0,
  noiseAmount: 0,
};

// ── MascotEditor ─────────────────────────────────────────

interface MascotEditorProps {
  /** Configuração inicial do mascote (opcional) */
  initialConfig?: MascotConfig;
  /** Callback quando a configuração muda */
  onChange?: (config: MascotConfig) => void;
  /** Callback quando o usuário exporta (SVG/PNG) */
  onExport?: (type: "svg" | "png", data: string | Blob) => void;
}

export function MascotEditor({ initialConfig, onChange, onExport }: MascotEditorProps) {
  const { tGroup, language } = useTranslations();
  const tools = useMemo(() => tGroup('tools'), [tGroup, language]);
  const actions = useMemo(() => tGroup('actions'), [tGroup, language]);
  
  const history = useHistory<MascotConfig>(initialConfig || DEFAULT_CONFIG);
  const config = history.state;
  const [animKey, setAnimKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedAnim, setSelectedAnim] = useState<string | null>(null);
  const [isExportingGif, setIsExportingGif] = useState(false);
  const animTransforms = useAnimationLoop(selectedAnim);

  const setConfig = useCallback((c: MascotConfig) => {
    history.set(c);
    setAnimKey(k => k + 1);
    if (onChange) onChange(c);
  }, [history, onChange]);

  const randomize = useCallback(() => {
    // 🎨 Obter cores da Cartilha Cromática ADAPTA
    const allColors = getMascotBodyColors();
    const colorValues = allColors.map(c => c.value);
    
    // 🎬 Randomizar animação (sempre animado)
    const randomAnim = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)].id;
    setSelectedAnim(randomAnim);
    
    setConfig({
      bodyId: pick(BODY_IDS),
      eyeId: pick(EYE_IDS),
      mouthId: pick(MOUTH_IDS),
      faceOffsetY: (Math.random() - 0.5) * 20,
      noiseAmount: Math.random() * 0.6,
      bodyFill: pick(colorValues),
      outlineColor: pick(colorValues),
    });
  }, [setConfig]);

  const resetConfig = useCallback(() => {
    history.reset(DEFAULT_CONFIG);
    setAnimKey(k => k + 1);
    setSelectedAnim(null);
  }, [history]);

  const downloadSvg = useCallback(() => {
    const blob = new Blob([getMascotSvgString(config)], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `adapta-${config.bodyId}.svg`;
    a.click();
    toast.success(tools.svgExported);
    if (onExport) onExport("svg", getMascotSvgString(config));
  }, [config, onExport, tools]);

  const downloadPng = useCallback(async () => {
    try {
      const svg = getMascotSvgString(config);
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const img = new window.Image();
      img.onload = () => {
        try {
          const c = document.createElement("canvas");
          c.width = 1000; c.height = 1000;
          const ctx = c.getContext("2d");
          if (!ctx) { toast.error(tools.canvasNotAvailable); return; }
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          c.toBlob((b) => {
            if (!b) { toast.error(tools.errorGeneratingPng); return; }
            const a = document.createElement("a");
            a.href = URL.createObjectURL(b);
            a.download = `adapta-${config.bodyId}.png`;
            a.click();
            toast.success(tools.pngExported);
            if (onExport) onExport("png", b);
          }, "image/png");
        } catch (err) {
          console.error("PNG rasterization error:", err);
          toast.error(tools.errorExportingPng);
          URL.revokeObjectURL(url);
        }
      };
      img.onerror = (e) => {
        console.error("Image load error:", e);
        toast.error(tools.errorLoadingImage);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (e) {
      console.error(e);
      toast.error(tools.errorExportingPng);
    }
  }, [config, onExport, tools]);

  const downloadGif = useCallback(async () => {
    if (!selectedAnim) {
      toast.warning("Selecione uma animação primeiro! Vá nos controles e escolha uma animação para exportar um GIF.");
      return;
    }
    try {
      setIsExportingGif(true);
      const toastId = toast.loading("Renderizando frames do GIF (pode demorar alguns segundos)...");
      
      const blob = await exportGifDirect(config, selectedAnim, { size: 300, fps: 20, transparentBg: false });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; 
      a.download = `adapta-${config.bodyId}-${selectedAnim}.gif`; 
      a.click();
      URL.revokeObjectURL(url);
      
      toast.dismiss(toastId);
      toast.success("GIF exportado com sucesso!");
    } catch (e) {
      console.error("GIF export error:", e);
      toast.dismiss();
      toast.error("Houve um problema ao exportar o GIF.");
    } finally {
      setIsExportingGif(false);
    }
  }, [config, selectedAnim]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getMascotSvgString(config));
      setCopied(true); toast.success(tools.svgCopied);
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error(tools.errorCopying); }
  }, [config, tools]);

  // Keyboard shortcuts
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
    <div className="h-full w-full flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="border-b px-6 py-4 flex items-center justify-between shrink-0" style={{ 
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)'
      }}>
        <div className="flex items-center gap-3">
          <h2 className="tracking-tight text-xl font-medium" style={{ color: 'var(--foreground)' }}>ADAPTA</h2>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{tools.mascotGenerator}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer text-sm"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--muted-foreground)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--foreground)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)'; }}>
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? actions.copied : actions.copy}
          </button>
          <button onClick={downloadSvg}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer text-sm"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}>
            <Download size={14} /> SVG
          </button>
          <button onClick={downloadPng}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer text-sm"
            style={{
              backgroundColor: 'var(--secondary)',
              color: 'var(--secondary-foreground)',
            }}>
            <FileImage size={14} /> PNG
          </button>
          <button onClick={downloadGif} disabled={isExportingGif}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer text-sm"
            style={{
              backgroundColor: '#bfa15f',
              color: '#fff',
              opacity: isExportingGif ? 0.5 : 1
            }}>
            <Download size={14} /> {isExportingGif ? "Gerando..." : "GIF Animado"}
          </button>
          <ExportBundle />
        </div>
      </header>

      {/* Content - Layout horizontal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Preview - 60% */}
        <div className="flex-1 flex items-center justify-center relative bg-neutral-50 dark:bg-neutral-950">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
            backgroundImage: `
              linear-gradient(var(--border) 1px, transparent 1px),
              linear-gradient(90deg, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }} />
          
          <motion.div
            key={animKey}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="w-[400px] h-[400px] relative z-10"
          >
            <MascotSVG config={config} anim={selectedAnim ? animTransforms : undefined} />
          </motion.div>
        </div>

        {/* Controls - 40% */}
        <div className="w-[40%] min-w-[400px] overflow-y-auto border-l" style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)'
        }}>
          <div className="p-6">
            <ControlPanel
              config={config}
              setConfig={setConfig}
              onRandomize={randomize}
              onReset={resetConfig}
              canUndo={history.canUndo}
              canRedo={history.canRedo}
              onUndo={() => { history.undo(); setAnimKey(k => k + 1); }}
              onRedo={() => { history.redo(); setAnimKey(k => k + 1); }}
              selectedAnim={selectedAnim}
              onSelectAnim={setSelectedAnim}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
