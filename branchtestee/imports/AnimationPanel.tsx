/*
 * ADAPTA — AnimationPanel
 * Seletor de animação + preview ao vivo + exportação GIF de alta qualidade.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { MascotConfig } from "./MascotSVG";
import { ANIMATIONS, getBaseTransforms } from "./animations";
import type { AnimTransforms } from "./animations";
import { exportGifDirect } from "./gif-export-v5"; // ⚠️ V5D STABLE - gifenc simplificado
import { Film, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

// ── Animation preview hook ──────────────────────────────

export function useAnimationLoop(animId: string | null): AnimTransforms {
  const [transforms, setTransforms] = useState<AnimTransforms>(getBaseTransforms());
  const rafRef = useRef<number>(0);
  const startRef = useRef(0);

  useEffect(() => {
    if (!animId) {
      setTransforms(getBaseTransforms());
      return;
    }
    const anim = ANIMATIONS.find(a => a.id === animId);
    if (!anim) return;

    startRef.current = performance.now();

    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      const t = (elapsed % anim.durationMs) / anim.durationMs;
      setTransforms(anim.fn(t));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [animId]);

  return transforms;
}

// ── AnimationPanel UI ────────────────────────────────────

interface AnimationPanelProps {
  config: MascotConfig;
  selectedAnim: string | null;
  onSelectAnim: (id: string | null) => void;
}

export function AnimationPanel({ config, selectedAnim, onSelectAnim }: AnimationPanelProps) {
  const [exportingDirect, setExportingDirect] = useState(false);
  const [progressDirect, setProgressDirect] = useState(0);
  const [gifSize, setGifSize] = useState<"sm" | "md" | "lg" | "xl" | "xxl">("md");
  const [transparentBg, setTransparentBg] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const sizes = { sm: 240, md: 360, lg: 480, xl: 1080, xxl: 1920 };
  const sizeLabels = { sm: "240", md: "360", lg: "480", xl: "1080", xxl: "1920" };

  // ── VALIDAÇÃO: Proibir "Piscadinha" com olhos cerrados ──
  const INCOMPATIBLE_EYES_WITH_WINK = ['fechado1', 'semi1'];
  const hasIncompatibleEyes = INCOMPATIBLE_EYES_WITH_WINK.includes(config.eyeId);

  const handleExportDirect = useCallback(async () => {
    if (!selectedAnim) { toast.error("Selecione uma animação primeiro"); return; }
    setExportingDirect(true);
    setProgressDirect(0);
    setPreviewUrl(null);
    try {
      const blob = await exportGifDirect(config, selectedAnim, {
        size: sizes[gifSize],
        fps: 30, // Aumentado para 30fps para match com preview suave
        transparentBg: transparentBg,
      }, setProgressDirect);

      // Show preview
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);

      // Download
      const a = document.createElement("a");
      a.href = url;
      a.download = `adapta-${config.bodyId}-${selectedAnim}.gif`;
      a.click();

      const sizeKb = Math.round(blob.size / 1024);
      toast.success(`GIF exportado! (${sizeKb} KB)`);
    } catch (e) {
      console.error(e);
      toast.error("Erro ao exportar GIF");
    } finally {
      setExportingDirect(false);
    }
  }, [config, selectedAnim, gifSize, transparentBg]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Animation grid */}
      <div className="grid grid-cols-3 gap-1">
        {ANIMATIONS.map((a) => {
          // Desabilitar "Piscadinha" (blink) se olhos cerrados estiverem selecionados
          const isIncompatible = a.id === 'blink' && hasIncompatibleEyes;
          
          return (
            <button
              key={a.id}
              onClick={() => {
                if (isIncompatible) {
                  toast.error('Piscadinha não combina com olhos cerrados');
                  return;
                }
                onSelectAnim(selectedAnim === a.id ? null : a.id);
                setPreviewUrl(null);
              }}
              disabled={isIncompatible}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all ${isIncompatible ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
              style={{
                backgroundColor: selectedAnim === a.id ? '#F7F9F8' : '#EDF1EF',
                boxShadow: selectedAnim === a.id ? '0 0 0 2px #2D3632' : 'none',
              }}
            >
              <span className="text-[16px] leading-none">{a.emoji}</span>
              <span 
                className="text-[8px] tracking-tight leading-none"
                style={{ color: selectedAnim === a.id ? '#141A17' : '#67736D', fontWeight: selectedAnim === a.id ? 500 : 400 }}
              >
                {a.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Export controls */}
      <AnimatePresence>
        {selectedAnim && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1.5 pt-1.5" style={{ borderTop: '1px solid #E0E6E2' }}>
              {/* Size selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] w-[40px] shrink-0" style={{ color: '#67736D' }}>Tam</span>
                <div className="flex gap-0.5 flex-1">
                  {(["sm", "md", "lg", "xl", "xxl"] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setGifSize(s)}
                      className="flex-1 py-0.5 rounded text-[8px] transition-all cursor-pointer"
                      style={{
                        backgroundColor: gifSize === s ? '#2D3632' : '#EDF1EF',
                        color: gifSize === s ? '#FAFBFA' : '#67736D'
                      }}
                    >
                      {sizeLabels[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options row */}
              <div className="flex items-center gap-2">
                {/* Transparent toggle */}
                <label className="flex items-center gap-1 cursor-pointer select-none">
                  <button
                    onClick={() => setTransparentBg(!transparentBg)}
                    className="w-7 h-[16px] rounded-full transition-colors relative cursor-pointer"
                    style={{ backgroundColor: transparentBg ? '#2D3632' : '#E0E6E2' }}
                  >
                    <div 
                      className="absolute top-[2px] w-[12px] h-[12px] rounded-full shadow-sm transition-transform"
                      style={{ 
                        backgroundColor: '#FAFBFA',
                        transform: transparentBg ? 'translateX(13px)' : 'translateX(2px)'
                      }}
                    />
                  </button>
                  <span className="text-[9px]" style={{ color: '#67736D' }}>Transparente</span>
                </label>
              </div>

              {/* GIF Preview */}
              <AnimatePresence>
                {previewUrl && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex items-center justify-center py-1.5"
                  >
                    <div className="relative rounded-lg overflow-hidden shadow-sm" style={{ border: '1px solid #E0E6E2' }}>
                      {/* Checkerboard bg for transparent preview */}
                      {transparentBg && (
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: "linear-gradient(45deg, #E0E6E2 25%, transparent 25%), linear-gradient(-45deg, #E0E6E2 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #E0E6E2 75%), linear-gradient(-45deg, transparent 75%, #E0E6E2 75%)",
                            backgroundSize: "12px 12px",
                            backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0px",
                          }}
                        />
                      )}
                      <img
                        src={previewUrl}
                        alt="GIF preview"
                        className="relative w-[80px] h-[80px] object-contain"
                      />
                    </div>
                    <div className="ml-2 flex flex-col gap-0.5">
                      <div className="flex items-center gap-0.5 text-[9px]" style={{ color: '#2D3632' }}>
                        <Check size={9} /> OK
                      </div>
                      <span className="text-[8px]" style={{ color: '#67736D' }}>{sizes[gifSize]}px</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Export button */}
              <button
                onClick={handleExportDirect}
                disabled={exportingDirect}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg active:scale-[0.98] transition-all cursor-pointer text-[10px] shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: '#2D3632',
                  color: '#FAFBFA'
                }}
              >
                {exportingDirect ? (
                  <>
                    <Loader2 size={11} className="animate-spin" />
                    {Math.round(progressDirect * 100)}%
                  </>
                ) : (
                  <>
                    <Film size={11} />
                    {previewUrl ? "Exportar +" : "Exportar GIF"}
                  </>
                )}
              </button>

              {/* Progress bar */}
              {exportingDirect && (
                <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#EDF1EF' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#2D3632' }}
                    animate={{ width: `${progressDirect * 100}%` }}
                    transition={{ duration: 0.15 }}
                  />
                </div>
              )}

              <p className="text-[7px] text-center" style={{ color: '#A1ABA6' }}>
                30 FPS · Median-cut
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}