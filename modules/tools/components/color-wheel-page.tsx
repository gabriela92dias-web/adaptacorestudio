/**
 * ═══════════════════════════════════════════════════════════════
 * COLOR WHEEL PAGE — /tools/color-wheel
 * ═══════════════════════════════════════════════════════════════
 *
 * Wrapper que transforma o componente ColorWheel (originalmente modal)
 * em uma página completa dentro da rota /tools/color-wheel.
 */

import { Helmet } from "react-helmet";
import { useState, useMemo, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { motion } from "motion/react";
import { Copy, Check, Sparkles, Sun, Wine, Leaf, Zap, Palette, Target, type LucideIcon } from "lucide-react";
import { useTheme } from "../../../utils/theme-context";
import { colorPalette, filterForFeature, getCampaignRoles } from "../../../utils/color-data";
import styles from "./color-wheel-page.module.css";

// ─── Re-export das funções internas ──────────────────────────
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / d + 2) / 6; break;
    case b: h = ((r - g) / d + 4) / 6; break;
  }
  return { h: h * 360, s, l };
}

function hueDiff(a: number, b: number): number {
  const d = Math.abs(a - b);
  return d > 180 ? 360 - d : d;
}

function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

// ─── Types ────────────────────────────────────────────────────
interface ColorData {
  hex: string;
  name: string;
  group: string;
  hue: number;
  sat: number;
  lum: number;
  wheelAngle?: number;
}

type HarmonyMode = "analogous" | "complementary" | "triadic" | "split";
type CoreFilter = "verde" | "color" | "both" | "neutrals" | "verde-neutrals" | "all";
type PreviewTab = "produto" | "social";

const HARMONY_MODES = [
  { id: "analogous" as const, name: "Elegante & Sóbrio", icon: "≈", angles: [0, 30, -30], description: "Harmonia Análoga" },
  { id: "complementary" as const, name: "Impacto & Contraste", icon: "⊕", angles: [0, 180], description: "Harmonia Complementar" },
  { id: "triadic" as const, name: "Vibrante & Jovem", icon: "△", angles: [0, 120, 240], description: "Harmonia Tríade" },
  { id: "split" as const, name: "Dinâmico & Equilíbrio", icon: "⋀", angles: [0, 150, 210], description: "Split-Complementar" },
];

const MOODS: { id: string, name: string, desc: string, icon: LucideIcon, targetHue: number, targetLum: number }[] = [
  { id: 'alegre', name: 'Alegre', desc: 'Quente', icon: Sun, targetHue: 35, targetLum: 0.6 },
  { id: 'sobrio', name: 'Sóbrio', desc: 'Frio', icon: Wine, targetHue: 220, targetLum: 0.2 },
  { id: 'natural', name: 'Natural', desc: 'Fresco', icon: Leaf, targetHue: 140, targetLum: 0.4 },
  { id: 'impacto', name: 'Impacto', desc: 'Vibrante', icon: Zap, targetHue: 340, targetLum: 0.5 },
];

// ─── Componente Principal ─────────────────────────────────────
export function ColorWheelPage() {
  const { isDark } = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const wheelContainerRef = useRef<HTMLDivElement>(null);

  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>("analogous");
  const [previewTab, setPreviewTab] = useState<PreviewTab>("produto");
  const [coreFilter, setCoreFilter] = useState<CoreFilter>("all");
  const [baseColorHex, setBaseColorHex] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragAngle, setDragAngle] = useState<number | null>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [wheelSize, setWheelSize] = useState(480);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [capsuleGenerated, setCapsuleGenerated] = useState(false);

  useEffect(() => {
    if (!wheelContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const size = Math.min(width, height - 20);
      setWheelSize(Math.max(320, Math.min(size, 560)));
    });
    observer.observe(wheelContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const adaptaColors = useMemo(() => {
    const filtered = filterForFeature(coreFilter);
    const colors: ColorData[] = [];
    filtered.forEach((group) => {
      group.colors.forEach((c) => {
        const { h, s, l } = hexToHSL(c.hex);
        colors.push({
          hex: c.hex,
          name: c.name || c.hex,
          group: group.name,
          hue: h,
          sat: s,
          lum: l
        });
      });
    });
    const anglePerColor = colors.length > 0 ? 360 / colors.length : 0;
    return colors.map((color, index) => ({
      ...color,
      wheelAngle: index * anglePerColor,
      originalHue: color.hue,
    }));
  }, [coreFilter]);

  const applyMood = (moodId: string) => {
    const mood = MOODS.find(m => m.id === moodId);
    if (!mood || adaptaColors.length === 0) return;
    
    let closest = adaptaColors[0];
    let minDiff = 9999;
    adaptaColors.forEach(c => {
       const hDiff = Math.min(Math.abs(c.hue - mood.targetHue), 360 - Math.abs(c.hue - mood.targetHue)) / 180;
       const lDiff = Math.abs(c.lum - mood.targetLum);
       const diff = (hDiff * 0.7) + (lDiff * 0.3);
       if (diff < minDiff) { minDiff = diff; closest = c; }
    });
    flushSync(() => setBaseColorHex(closest.hex));
    setCapsuleGenerated(false);
  };

  const currentHarmony = HARMONY_MODES.find((m) => m.id === harmonyMode);

  const harmonyLookup = useMemo(() => {
    const lookup = new Map<string, ColorData[]>();
    adaptaColors.forEach((baseColor) => {
      HARMONY_MODES.forEach((mode) => {
        if (!mode.angles) return;
        const result: ColorData[] = [];
        mode.angles.forEach((angleOffset) => {
          const targetAngle = normalizeAngle(baseColor.wheelAngle! + angleOffset);
          let closest = adaptaColors[0];
          let minDiff = adaptaColors.length > 0 ? hueDiff(targetAngle, adaptaColors[0].wheelAngle!) : 0;
          adaptaColors.forEach((c) => {
            const diff = hueDiff(targetAngle, c.wheelAngle!);
            if (diff < minDiff) { minDiff = diff; closest = c; }
          });
          result.push(closest);
        });
        lookup.set(`${baseColor.hex}-${mode.id}`, result);
      });
    });
    return lookup;
  }, [adaptaColors]);

  const rawHarmonyGeometricColors = useMemo(() => {
    if (!baseColorHex || adaptaColors.length === 0) return [];
    
    if (isDragging && dragAngle !== null && currentHarmony?.angles) {
      const result: ColorData[] = [];
      currentHarmony.angles.forEach((angleOffset) => {
        const targetAngle = normalizeAngle(dragAngle + angleOffset);
        let closest = adaptaColors[0];
        let minDiff = hueDiff(targetAngle, adaptaColors[0].wheelAngle!);
        adaptaColors.forEach((c) => {
          const diff = hueDiff(targetAngle, c.wheelAngle!);
          if (diff < minDiff) { minDiff = diff; closest = c; }
        });
        result.push(closest);
      });
      return result;
    }
    return harmonyLookup.get(`${baseColorHex}-${harmonyMode}`) || [];
  }, [baseColorHex, harmonyMode, harmonyLookup, isDragging, dragAngle, currentHarmony, adaptaColors]);

  // A Mágica do Diretor Criativo V8:
  const campaignPalette = useMemo(() => {
    if (!baseColorHex) return null;
    const rawColors = rawHarmonyGeometricColors.map(c => c.hex);
    // getCampaignRoles aplica o auto-fix de acessibilidade e designa as funções
    const roles = getCampaignRoles([baseColorHex, ...rawColors]);
    
    // Buscar os nomes das cores na paleta para renderizar bonitinho
    const findName = (hex: string) => colorPalette.flatMap(g => g.colors).find(c => c.hex === hex)?.name || hex;
    
    return {
       background: { hex: roles.background, name: findName(roles.background) },
       accent: { hex: roles.accent, name: findName(roles.accent) },
       text: { hex: roles.text, name: findName(roles.text) },
       rawNodes: rawColors // Apenas para a roda geométrica acender as bolinhas originais
    };
  }, [baseColorHex, rawHarmonyGeometricColors]);

  const inferredMood = useMemo(() => {
    if (!campaignPalette || adaptaColors.length === 0) return null;
    const bgNode = adaptaColors.find(c => c.hex === campaignPalette.background.hex);
    if (!bgNode) return MOODS[0];
    
    let closest = MOODS[0];
    let minDiff = 9999;
    MOODS.forEach(m => {
       const hDiff = Math.min(Math.abs(bgNode.hue - m.targetHue), 360 - Math.abs(bgNode.hue - m.targetHue)) / 180;
       const lDiff = Math.abs(bgNode.lum - m.targetLum);
       const diff = (hDiff * 0.7) + (lDiff * 0.3);
       if (diff < minDiff) { minDiff = diff; closest = m; }
    });
    return closest;
  }, [campaignPalette, adaptaColors]);

  const validatedColors = useMemo(() => {
    // Retirado o filtro rígido de tons no validatedColors para permitir UI Mode ver tudo
    const anglePerColor = adaptaColors.length > 0 ? 360 / adaptaColors.length : 0;
    return adaptaColors.map((color, index) => ({ ...color, wheelAngle: index * anglePerColor }));
  }, [adaptaColors]);

  const CENTER = wheelSize / 2;
  const WHEEL_R = wheelSize * 0.38;
  const PIN_R = wheelSize * 0.022;

  const positionedColors = useMemo(() =>
    validatedColors.map((c) => {
      const angle = ((c.wheelAngle! - 90) * Math.PI) / 180;
      return { 
        ...c, 
        x: CENTER + WHEEL_R * Math.cos(angle), 
        y: CENTER + WHEEL_R * Math.sin(angle),
        isLocked: false // A Roda Criativa não trava, o motor corrige na Role.
      };
    }),
  [validatedColors, CENTER, WHEEL_R]);

  const findClosestColor = (svgX: number, svgY: number): ColorData | null => {
    const THRESHOLD = wheelSize * 0.08;
    let closest: ColorData | null = null;
    let minDist = THRESHOLD;
    positionedColors.forEach((c) => {
      const dist = Math.sqrt((svgX - c.x) ** 2 + (svgY - c.y) ** 2);
      if (dist < minDist) { minDist = dist; closest = c; }
    });
    return closest;
  };

  const getSvgCoords = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (wheelSize / rect.width),
      y: (e.clientY - rect.top) * (wheelSize / rect.height),
    };
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) return;
    const coords = getSvgCoords(e);
    if (!coords) return;
    const c = findClosestColor(coords.x, coords.y);
    if (c && !c.isLocked) setBaseColorHex(c.hex);
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const coords = getSvgCoords(e);
    if (!coords) return;
    if (isDragging) {
      const dx = coords.x - CENTER, dy = coords.y - CENTER;
      if (Math.sqrt(dx ** 2 + dy ** 2) < wheelSize * 0.1) return;
      const angleDeg = normalizeAngle((Math.atan2(dy, dx) * 180) / Math.PI + 90);
      let closest = adaptaColors[0];
      let minDiff = adaptaColors.length > 0 ? hueDiff(angleDeg, adaptaColors[0].wheelAngle!) : 0;
      adaptaColors.forEach((c) => {
        const diff = hueDiff(angleDeg, c.wheelAngle!);
        if (diff < minDiff) { minDiff = diff; closest = c; }
      });
      flushSync(() => setBaseColorHex(closest.hex));
      setDragAngle(angleDeg);
    } else {
      setHoveredColor(findClosestColor(coords.x, coords.y)?.hex ?? null);
    }
  };

  useEffect(() => {
    if (!isDragging) return;
    const up = () => { setIsDragging(false); setDragAngle(null); };
    const move = (e: MouseEvent) => {
      if (!svgRef.current || adaptaColors.length === 0) return;
      const rect = svgRef.current.getBoundingClientRect();
      const svgX = (e.clientX - rect.left) * (wheelSize / rect.width);
      const svgY = (e.clientY - rect.top) * (wheelSize / rect.height);
      const dx = svgX - CENTER, dy = svgY - CENTER;
      const angleDeg = normalizeAngle((Math.atan2(dy, dx) * 180) / Math.PI + 90);
      setDragAngle(angleDeg);
      let closest = adaptaColors[0];
      let minDiff = hueDiff(angleDeg, adaptaColors[0].wheelAngle!);
      adaptaColors.forEach((c) => {
        if (c.isLocked) return;
        const diff = hueDiff(angleDeg, c.wheelAngle!);
        if (diff < minDiff) { minDiff = diff; closest = c; }
      });
      flushSync(() => setBaseColorHex(closest.hex));
    };
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", move);
    return () => { window.removeEventListener("mouseup", up); window.removeEventListener("mousemove", move); };
  }, [isDragging, adaptaColors, wheelSize, CENTER]);

  useEffect(() => {
    if (adaptaColors.length > 0 && !adaptaColors.find(c => c.hex === baseColorHex)) {
      setBaseColorHex(adaptaColors[0].hex);
    }
  }, [adaptaColors, baseColorHex]);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex.toUpperCase());
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const emptyState = adaptaColors.length === 0;
  const tipColor = isDark ? "rgba(232,240,237,0.7)" : "rgba(0,0,0,0.5)";

  return (
    <>
      <Helmet><title>CoreStudio | Roda Cromática</title></Helmet>

      <div className={styles.pageContainer}>

        {/* Header */}
        <div className={styles.header}>
          <h1>Roda Cromática</h1>
          <p>Encontre harmonias de cores da paleta institucional Adapta</p>
        </div>

        {/* Empty state */}
        {emptyState && (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateInner}>
              <div className={styles.emptyEmoji} style={{ display: 'flex', justifyContent: 'center' }}><Palette className="w-12 h-12" style={{ color: "var(--primary)" }} /></div>
              <h2 className={styles.emptyTitle}>Paleta ainda não configurada</h2>
              <p className={styles.emptyText}>
                Adicione as cores da identidade visual Adapta em{" "}
                <code className={styles.emptyCode}>utils/color-data.ts</code>{" "}
                para ativar a roda cromática.
              </p>
            </div>
          </div>
        )}

        {/* Main layout */}
        {!emptyState && (
          <div className={styles.mainLayout}>

            {/* Sidebar de controles */}
            <aside className={styles.controlsSidebar}>

              {/* Modos de harmonia (Com nomes táticos) */}
              <div className={styles.sidebarSection}>
                <label className={styles.sidebarLabel}>Vibe da Campanha</label>
                <div className={styles.harmonyList}>
                  {HARMONY_MODES.map((mode) => {
                    const isActive = harmonyMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setHarmonyMode(mode.id as HarmonyMode)}
                        className={`${styles.harmonyBtn} ${isActive ? styles.harmonyBtnActive : ""}`}
                      >
                        <span className={styles.harmonyIcon}>{mode.icon}</span>
                        <div className={styles.harmonyInfo}>
                          <span className={styles.harmonyName}>{mode.name}</span>
                          <span className={styles.harmonyDesc}>{mode.description}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Roles Atribuidas pela Inteligência */}
              <div className={styles.sidebarSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className={styles.sidebarLabel} style={{ marginBottom: 0 }}>
                    Cápsula Gerada
                  </label>
                  {inferredMood && campaignPalette && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                       <inferredMood.icon size={10} />
                       <span style={{ fontWeight: 600 }}>{inferredMood.name} / {inferredMood.desc}</span>
                    </div>
                  )}
                </div>
                {!campaignPalette ? (
                  <p className={styles.emptyMsg}>Clique na roda para focar uma cor âncora.</p>
                ) : (
                  <div className={styles.selectedColors}>
                    
                    {/* Background */}
                    <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 }} className={styles.colorCard}>
                      <div className={styles.colorSwatch} style={{ background: campaignPalette.background.hex }} />
                      <div className={styles.colorInfo}>
                        <div className={styles.colorHexRow}>
                          <span className={styles.colorHex}>{campaignPalette.background.hex.toUpperCase()}</span>
                          <span className={styles.baseBadge}>FUNDO</span>
                        </div>
                        <span className={styles.colorName}>{campaignPalette.background.name}</span>
                      </div>
                      <button onClick={() => handleCopy(campaignPalette.background.hex)} className={styles.copyBtn}>
                        {copiedHex === campaignPalette.background.hex ? <Check size={12} color="var(--color-success, #22c55e)" /> : <Copy size={12} />}
                      </button>
                    </motion.div>

                    {/* Accent */}
                    <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 }} className={styles.colorCard}>
                      <div className={styles.colorSwatch} style={{ background: campaignPalette.accent.hex }} />
                      <div className={styles.colorInfo}>
                        <div className={styles.colorHexRow}>
                          <span className={styles.colorHex}>{campaignPalette.accent.hex.toUpperCase()}</span>
                          <span className={styles.baseBadge} style={{background: 'var(--color-warning)'}}>DESTAQUE</span>
                        </div>
                        <span className={styles.colorName}>{campaignPalette.accent.name}</span>
                      </div>
                      <button onClick={() => handleCopy(campaignPalette.accent.hex)} className={styles.copyBtn}>
                        {copiedHex === campaignPalette.accent.hex ? <Check size={12} color="var(--color-success, #22c55e)" /> : <Copy size={12} />}
                      </button>
                    </motion.div>

                    {/* Text / Support (Auto-Fixed) */}
                    <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.09 }} className={styles.colorCard}>
                      <div className={styles.colorSwatch} style={{ background: campaignPalette.text.hex }} />
                      <div className={styles.colorInfo}>
                        <div className={styles.colorHexRow}>
                          <span className={styles.colorHex}>{campaignPalette.text.hex.toUpperCase()}</span>
                          <span className={styles.baseBadge} style={{background: 'var(--color-info)'}}>TEXTO/APOIO</span>
                        </div>
                        <span className={styles.colorName}>{campaignPalette.text.name}</span>
                      </div>
                      <button onClick={() => handleCopy(campaignPalette.text.hex)} className={styles.copyBtn}>
                        {copiedHex === campaignPalette.text.hex ? <Check size={12} color="var(--color-success, #22c55e)" /> : <Copy size={12} />}
                      </button>
                    </motion.div>

                    <button 
                      className={styles.generateCapsuleBtn}
                      onClick={() => {
                        const fakePayload = JSON.stringify(campaignPalette, null, 2);
                        navigator.clipboard.writeText(fakePayload);
                        setCapsuleGenerated(true);
                        setTimeout(() => setCapsuleGenerated(false), 3000);
                      }}
                    >
                      {capsuleGenerated ? (
                        <>
                          <Check size={16} /> 
                          Cápsula Copiada!
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} /> 
                          Engarrafar Cápsula
                        </>
                      )}
                    </button>

                  </div>
                )}
              </div>
            </aside>

            {/* Área da roda */}
            <div
              ref={wheelContainerRef}
              className={styles.wheelArea}
            >
              <div className={styles.wheelWrapper} style={{ width: wheelSize, height: wheelSize }}>

                {/* Dicas flutuantes (Atualizadas) */}
                <div className={styles.tipCenter} style={{ color: tipColor, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                  <span style={{fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem'}}><Target size={16} /> Motor Inteligente:</span> <span>O contraste do Texto/Apoio é auto-ajustado em tempo real.</span>
                </div>

                <svg
                  ref={svgRef}
                  width={wheelSize}
                  height={wheelSize}
                  viewBox={`0 0 ${wheelSize} ${wheelSize}`}
                  onMouseMove={handleSvgMouseMove}
                  onMouseUp={() => setIsDragging(false)}
                  onClick={handleSvgClick}
                  className={styles.wheelSvg}
                  style={{
                    cursor: isDragging ? "grabbing" : hoveredColor ? "pointer" : "crosshair",
                    userSelect: "none",
                  }}
                >
                  <defs>
                    <filter id="glow-cw-strong">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Círculo de fundo */}
                  <circle
                    cx={CENTER} cy={CENTER}
                    r={WHEEL_R + wheelSize * 0.05}
                    fill={isDark ? "rgba(20, 26, 23, 0.3)" : "rgba(255,255,255,0.7)"}
                    stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}
                    strokeWidth={1}
                  />

                  {/* Fatias de harmonia */}
                  {campaignPalette && campaignPalette.rawNodes.map((hex, i) => {
                    const harmonyNode = positionedColors.find(pc => pc.hex === hex);
                    if (!harmonyNode) return null;
                    return (
                      <line
                        key={`line-${i}`}
                        x1={CENTER} y1={CENTER}
                        x2={harmonyNode.x} y2={harmonyNode.y}
                        stroke={hex}
                        strokeWidth={2}
                        strokeOpacity={0.6}
                      />
                    );
                  })}

                  {/* Pontos de cor */}
                  {positionedColors.map((c) => {
                    const isBase = c.hex === baseColorHex;
                    const isHarmony = campaignPalette && campaignPalette.rawNodes.includes(c.hex);
                    
                    const r = isBase ? PIN_R * 1.8 : isHarmony ? PIN_R * 1.4 : PIN_R;

                    return (
                      <circle
                        key={c.hex}
                        cx={c.x} cy={c.y}
                        r={r}
                        fill={c.hex}
                        stroke={isBase || isHarmony
                          ? (isDark ? "#fff" : "#000")
                          : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)")}
                        strokeWidth={isBase || isHarmony ? 2 : 0.5}
                        filter={isBase || isHarmony ? "url(#glow-cw-strong)" : undefined}
                        opacity={isBase || isHarmony ? 1 : 0.4}
                        onMouseDown={() => { setBaseColorHex(c.hex); setIsDragging(true); }}
                        style={{ cursor: "pointer", transition: "r 0.2s ease, opacity 0.3s ease" }}
                      />
                    );
                  })}

                  {/* Centro da Roda: Feedback Dinâmico ao invés de código solto */}
                  {campaignPalette && (
                    <g transform={`translate(${CENTER}, ${CENTER})`}>
                      <circle cx="0" cy="0" r={WHEEL_R * 0.25} fill={campaignPalette.background.hex} filter="url(#glow-cw-strong)" />
                      <circle cx="0" cy="0" r={WHEEL_R * 0.25} fill="none" stroke={campaignPalette.text.hex} strokeOpacity="0.2" strokeWidth="2" />
                      <text
                        x="0" y="5"
                        textAnchor="middle"
                        fontSize={wheelSize * 0.04}
                        fontWeight="800"
                        letterSpacing="2"
                        fill={campaignPalette.text.hex}
                      >
                        VIBE
                      </text>
                    </g>
                  )}
                </svg>
              </div>
            </div>

            {/* Sidebar de Preview (Lado Direito) */}
            <aside className={styles.previewSidebar}>
              <div className={styles.sidebarSection}>
                <h3 className={styles.previewTitle}>Visualização de Campanha</h3>
                <p className={styles.previewDesc}>
                  Veja como as Funções da Campanha se comportam na prática. A acessibilidade do texto é auto-corrigida.
                </p>

                <div className={styles.contextTabs} style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                  <button 
                    onClick={() => setPreviewTab("produto")}
                    className={`${styles.contextTab} ${previewTab === "produto" ? styles.contextTabActive : ""}`}
                  >
                    Produto (Kit Essencial)
                  </button>
                  <button 
                    onClick={() => setPreviewTab("social")}
                    className={`${styles.contextTab} ${previewTab === "social" ? styles.contextTabActive : ""}`}
                  >
                    Mídia (Poster Editorial)
                  </button>
                </div>

                {/* Live Mockups Dinâmicos */}
                {(() => {
                  const bg = campaignPalette?.background.hex || (isDark ? '#141a17' : '#F7F9F2');
                  const text = campaignPalette?.text.hex || (isDark ? '#ffffff' : '#000000');
                  const acc = campaignPalette?.accent.hex || text;

                  if (previewTab === "produto") {
                    return (
                      <div className={styles.mockupContainer} style={{ background: isDark ? '#0a0a0a' : '#f0f0f0' }}>
                        {/* Frasco Minimalista SVG */}
                        <svg width="100%" viewBox="0 0 200 250" style={{ maxWidth: '200px' }}>
                          <defs>
                            <linearGradient id="flaskShine" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#fff" stopOpacity="0.1" />
                              <stop offset="20%" stopColor="#fff" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#000" stopOpacity="0.1" />
                            </linearGradient>
                          </defs>
                          {/* Tampa principal (Usa Texto/Neutral para pesar) */}
                          <rect x="80" y="20" width="40" height="30" rx="4" fill={text} opacity={0.9} />
                          {/* Argola (Destaque do rótulo) */}
                          <rect x="75" y="50" width="50" height="8" rx="2" fill={acc} />
                          {/* Corpo do Frasco (Cor Âncora) */}
                          <rect x="50" y="58" width="100" height="150" rx="16" fill={bg} />
                          {/* Cópia do corpo para o brilho glassmorphism */}
                          <rect x="50" y="58" width="100" height="150" rx="16" fill="url(#flaskShine)" />
                          {/* Etiqueta Minimalista (Apoio) */}
                          <rect x="65" y="100" width="70" height="80" rx="4" fill={text} opacity={0.95} />
                          {/* Tipografia na Etiqueta (Usa o BG original para contrastar com o texto) */}
                          <text x="100" y="125" textAnchor="middle" fontSize="10" fontWeight="800" fill={bg} letterSpacing="1">ADAPTA</text>
                          <circle cx="100" cy="150" r="14" fill={acc} />
                          <circle cx="100" cy="150" r="7" fill={text} />
                        </svg>
                      </div>
                    );
                  }

                  return (
                    // Social Poster Mockup
                    <div className={styles.mockupContainer} style={{ background: bg, overflow: 'hidden' }}>
                      {/* Barras de enfeite editorial */}
                      <div style={{ position: 'absolute', top: 24, left: 24, display: 'flex', gap: 8 }}>
                          <div style={{ width: 40, height: 4, background: text, opacity: 0.3 }} />
                          <div style={{ width: 16, height: 4, background: text, opacity: 0.3 }} />
                      </div>
                      
                      <div style={{ padding: '0 2rem', width: '100%', position: 'relative', zIndex: 10 }}>
                         <h2 style={{ fontSize: '3.2rem', fontWeight: 900, color: text, margin: 0, lineHeight: 0.9, textTransform: 'uppercase', letterSpacing: '-1px' }}>
                            New<br/>Era
                         </h2>
                         <p style={{ color: text, opacity: 0.85, fontSize: '0.85rem', marginTop: '1.5rem', maxWidth: '85%' }}>
                            Cápsula de cores gerada pelo Diretor Criativo V8.
                         </p>
                      </div>

                      {/* Botão Call to Action Abstrato no canto */}
                      <div style={{ position: 'absolute', bottom: 24, left: 32, background: acc, color: bg, padding: '0.6rem 1.8rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                         Discover
                      </div>
                      
                      {/* Graphics (Círculo cortado enorme) */}
                      <svg width="250" height="250" style={{ position: 'absolute', bottom: -50, right: -50, opacity: 0.15, pointerEvents: 'none' }}>
                        <circle cx="125" cy="125" r="125" fill={text} />
                      </svg>
                    </div>
                  );
                })()}
              </div>
            </aside>

          </div>
        )}
      </div>
    </>
  );
}
