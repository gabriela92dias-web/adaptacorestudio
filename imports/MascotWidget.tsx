/*
 * ═══════════════════════════════════════════════════════════
 * ADAPTA — MascotWidget (Versão Gadget/FAB)
 * ─────────────────────────────────────────────────────────
 * Widget flutuante com mascote animado que abre editor lateral.
 * Ideal para integração em outras aplicações.
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useCallback, useEffect } from "react";
import { MascotSVG, getMascotSvgString } from "./MascotSVG";
import type { MascotConfig } from "./MascotSVG";
import { BODY_SHAPES } from "./body-shapes";
import { EYE_SETS } from "./eye-sets";
import { MOUTH_SETS } from "./mouth-sets";
import { ControlPanel } from "./ControlPanel";
import { Download, Copy, Check, Image, X, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ExportBundle } from "./ExportBundle";
import { useAnimationLoop } from "./AnimationPanel";
import { exportGifDirect } from "./gif-from-canvas-direct";
import { Maximize2, PanelRightOpen } from "lucide-react";
import { getMascotBodyColors } from "../modules/tools/utils/cartilha-cromatica";
import { ANIMATIONS } from "./animations";

// ── helpers ──────────────────────────────────────────────

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

// ── undo / redo hook ─────────────────────────────────────

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

// ── MascotWidget ─────────────────────────────────────────

export type FabPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";
export type ViewMode = "minimized" | "sidebar" | "maximized";

interface MascotWidgetProps {
  /** Posição do FAB na tela (default: "bottom-right") */
  position?: FabPosition;
  /** Tamanho do FAB em pixels (default: 80) */
  size?: number;
  /** Configuração inicial do mascote (opcional) */
  initialConfig?: MascotConfig;
  /** Modo inicial de visualização (default: "minimized") */
  initialViewMode?: ViewMode;
  /** Callback quando a configuração muda */
  onChange?: (config: MascotConfig) => void;
  /** Callback quando o usuário exporta (SVG/PNG) */
  onExport?: (type: "svg" | "png", data: string | Blob) => void;
  /** Callback quando o modo de visualização muda */
  onViewModeChange?: (mode: ViewMode) => void;
  /** Z-index base (default: 50) */
  zIndex?: number;
  /** Desabilitar o widget */
  disabled?: boolean;
  /** Customizar cores do tema (futuro) */
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
  };
}

const POSITION_CLASSES: Record<FabPosition, string> = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "top-right": "top-6 right-6",
  "top-left": "top-6 left-6",
};

export function MascotWidget({ position = "bottom-right", size = 80, initialConfig, initialViewMode = "minimized", onChange, onExport, onViewModeChange, zIndex = 50, disabled = false, theme }: MascotWidgetProps) {
  const history = useHistory<MascotConfig>(initialConfig || DEFAULT_CONFIG);
  const config = history.state;
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [animKey, setAnimKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedAnim, setSelectedAnim] = useState<string | null>(null);
  const [isExportingGif, setIsExportingGif] = useState(false);
  const animTransforms = useAnimationLoop(selectedAnim);

  // Wrapper para notificar mudança de view mode
  const changeViewMode = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    if (onViewModeChange) onViewModeChange(mode);
  }, [onViewModeChange]);

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
    
    history.set({
      bodyId: pick(BODY_IDS),
      eyeId: pick(EYE_IDS),
      mouthId: pick(MOUTH_IDS),
      bodyColor: pick(colorValues),
      faceOffsetY: 0,
      noiseAmount: Math.random() > 0.7 ? Math.round(Math.random() * 5) / 10 : 0,
    });
    setAnimKey(k => k + 1);
  }, [history]);

  const resetConfig = useCallback(() => {
    history.reset(DEFAULT_CONFIG);
    setAnimKey(k => k + 1);
  }, [history]);

  // ── exports ──

  const downloadSvg = useCallback(() => {
    const blob = new Blob([getMascotSvgString(config)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `adapta-${config.bodyId}.svg`; a.click();
    URL.revokeObjectURL(url);
    toast.success("SVG exportado!");
    if (onExport) onExport("svg", blob);
  }, [config, onExport]);

  const downloadPng = useCallback(async () => {
    try {
      const svgStr = getMascotSvgString(config);
      
      const blob = new Blob([svgStr], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const img = document.createElement('img');
      img.onload = async () => {
        try {
          await img.decode();
          const canvas = document.createElement("canvas");
          canvas.width = canvas.height = 1024;
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("No canvas context");
          
          // Preencher com fundo branco antes de desenhar
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, 1024, 1024);
          
          ctx.drawImage(img, 0, 0, 1024, 1024);
          URL.revokeObjectURL(url);
          canvas.toBlob((b) => {
            if (!b) { toast.error("Erro ao gerar PNG"); return; }
            const a = document.createElement("a");
            a.href = URL.createObjectURL(b);
            a.download = `adapta-${config.bodyId}.png`;
            a.click();
            toast.success("PNG exportado!");
            if (onExport) onExport("png", b);
          }, "image/png");
        } catch (err) {
          console.error("PNG rasterization error:", err);
          toast.error("Erro ao rasterizar PNG");
          URL.revokeObjectURL(url);
        }
      };
      img.onerror = (e) => {
        console.error("Image load error:", e);
        toast.error("Erro ao carregar imagem");
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (e) {
      console.error(e);
      toast.error("Erro ao exportar PNG");
    }
  }, [config, onExport]);

  const downloadGif = useCallback(async () => {
    if (!selectedAnim) {
      toast.warning("Selecione uma animação primeiro! Vá nos controles e escolha uma animação para exportar um GIF.");
      return;
    }
    try {
      setIsExportingGif(true);
      const toastId = toast.loading("Renderizando frames do GIF (isso pode demorar alguns segundos)...");
      
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
      setCopied(true); toast.success("SVG copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error("Erro ao copiar"); }
  }, [config]);

  // Keyboard shortcuts
  useEffect(() => {
    if (viewMode === "minimized") return;
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === "Space") { e.preventDefault(); randomize(); }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault(); history.undo(); setAnimKey(k => k + 1);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault(); history.redo(); setAnimKey(k => k + 1);
      }
      if (e.key === "Escape") {
        e.preventDefault(); setViewMode("minimized");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [viewMode, randomize, history]);

  return (
    <>
      {/* FAB Button - sempre visível quando minimizado */}
      <AnimatePresence>
        {viewMode === "minimized" && (
          <motion.button
            onClick={() => setViewMode("sidebar")}
            className={`fixed ${POSITION_CLASSES[position]} z-50 rounded-full bg-white shadow-2xl border overflow-hidden hover:scale-105 active:scale-95 transition-transform cursor-pointer`}
            style={{ width: size, height: size, borderColor: 'rgba(224,230,226,0.1)' }}
            whileHover={{ boxShadow: "0 20px 40px rgba(20,26,23,0.15)" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="w-full h-full p-2">
              <MascotSVG config={config} />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar Mode */}
      <AnimatePresence>
        {viewMode === "sidebar" && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewMode("minimized")}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-[90vw] sm:max-w-[600px] bg-white shadow-2xl z-[101] flex flex-col"
            >
              {/* Header */}
              <header className="border-b border-black/5 px-4 py-3 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <h2 className="tracking-tight text-[#333] text-[15px] font-medium">ADAPTA</h2>
                </div>
                <div className="flex items-center gap-1.5">
                  {/* View Mode Controls */}
                  <div className="flex items-center gap-1 mr-2 px-1 py-1 bg-black/5 rounded-lg">
                    <button
                      onClick={() => setViewMode("minimized")}
                      className="p-1.5 rounded hover:bg-white transition-colors cursor-pointer text-[#666] hover:text-[#333]"
                      title="Recolher (minimizar)"
                    >
                      <Minimize2 size={13} />
                    </button>
                    <button
                      onClick={() => setViewMode("sidebar")}
                      className="p-1.5 rounded bg-white transition-colors cursor-pointer text-[#333]"
                      title="Modo painel lateral"
                    >
                      <PanelRightOpen size={13} />
                    </button>
                    <button
                      onClick={() => setViewMode("maximized")}
                      className="p-1.5 rounded hover:bg-white transition-colors cursor-pointer text-[#666] hover:text-[#333]"
                      title="Maximizar"
                    >
                      <Maximize2 size={13} />
                    </button>
                  </div>

                  <button onClick={copyToClipboard}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-[#999] hover:text-[#333] transition-all cursor-pointer text-[11px]">
                    {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                    <span className="hidden sm:inline">{copied ? "Copiado" : "Copiar"}</span>
                  </button>
                  <button onClick={downloadSvg}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#2E3D34] text-white hover:bg-[#3d5045] transition-all cursor-pointer text-[11px]">
                    <Download size={12} /> SVG
                  </button>
                  <button onClick={downloadPng}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#495f51] text-white hover:bg-[#5a7063] transition-all cursor-pointer text-[11px]">
                    <Image size={12} /> PNG
                  </button>
                  <button onClick={downloadGif} disabled={isExportingGif}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#bfa15f] text-white hover:bg-[#a68c53] disabled:opacity-50 transition-all cursor-pointer text-[11px]">
                    <Download size={12} /> {isExportingGif ? "Gerando..." : "GIF"}
                  </button>
                </div>
              </header>

              {/* Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Preview */}
                <div className="shrink-0 h-[280px] flex items-center justify-center relative bg-[#FBF5F0] border-b border-black/5">
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                    backgroundImage: "radial-gradient(circle, #333 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }} />
                  
                  <motion.div
                    key={animKey}
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="w-[240px] h-[240px] relative z-10"
                  >
                    <MascotSVG config={config} anim={selectedAnim ? animTransforms : undefined} />
                  </motion.div>
                </div>

                {/* Controls */}
                <div className="flex-1 overflow-y-auto bg-white">
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
                      selectedAnim={selectedAnim}
                      onSelectAnim={setSelectedAnim}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Maximized Mode */}
      <AnimatePresence>
        {viewMode === "maximized" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[100] flex flex-col"
          >
            {/* Header */}
            <header className="border-b border-black/5 px-6 py-4 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <h2 className="tracking-tight text-[#333] text-xl font-medium">ADAPTA</h2>
                <span className="text-[#d0d0d0] text-xs">gerador de mascotes</span>
              </div>
              <div className="flex items-center gap-2">
                {/* View Mode Controls */}
                <div className="flex items-center gap-1 mr-3 px-1.5 py-1.5 bg-black/5 rounded-lg">
                  <button
                    onClick={() => setViewMode("minimized")}
                    className="p-2 rounded hover:bg-white transition-colors cursor-pointer text-[#666] hover:text-[#333]"
                    title="Recolher (minimizar)"
                  >
                    <Minimize2 size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode("sidebar")}
                    className="p-2 rounded hover:bg-white transition-colors cursor-pointer text-[#666] hover:text-[#333]"
                    title="Modo painel lateral"
                  >
                    <PanelRightOpen size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode("maximized")}
                    className="p-2 rounded bg-white transition-colors cursor-pointer text-[#333]"
                    title="Maximizado"
                  >
                    <Maximize2 size={15} />
                  </button>
                </div>

                <button onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-black/8 text-[#aaa] hover:text-[#666] transition-colors cursor-pointer text-sm">
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
                <button onClick={downloadSvg}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#333] text-white hover:bg-[#444] transition-colors cursor-pointer text-sm">
                  <Download size={14} /> SVG
                </button>
                <button onClick={downloadPng}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#555] text-white hover:bg-[#666] transition-colors cursor-pointer text-sm">
                  <Image size={14} /> PNG
                </button>
                <button onClick={downloadGif} disabled={isExportingGif}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#bfa15f] text-white hover:bg-[#a68c53] disabled:opacity-50 transition-colors cursor-pointer text-sm">
                  <Download size={14} /> {isExportingGif ? "Gerando..." : "GIF Animado"}
                </button>
                <ExportBundle />
              </div>
            </header>

            {/* Content - Layout horizontal */}
            <div className="flex-1 flex overflow-hidden">
              {/* Preview - 60% */}
              <div className="flex-1 flex items-center justify-center relative bg-[#FBF5F0]">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                  backgroundImage: "radial-gradient(circle, #333 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }} />
                
                <motion.div
                  key={animKey}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="w-[60vh] h-[60vh] max-w-[600px] max-h-[600px] relative z-10"
                >
                  <MascotSVG config={config} anim={selectedAnim ? animTransforms : undefined} />
                </motion.div>
              </div>

              {/* Controls - 40% */}
              <div className="w-[500px] border-l border-black/5 overflow-y-auto bg-white">
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
