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
import { Copy, Check } from "lucide-react";
import { useTheme } from "../../../utils/theme-context";
import { colorPalette, filterForFeature, getContrastRatio, ColorRole } from "../../../utils/color-data";
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

function extractTone(colorData: ColorData): number {
  const group = colorPalette.find(g => g.name === colorData.group);
  if (!group) return 300;
  const colorIndex = group.colors.findIndex(c => c.hex === colorData.hex);
  if (colorIndex === -1) return 300;
  return [100, 200, 300, 400, 500][colorIndex];
}

function isValidTone(
  selectedColors: ColorData[],
  candidateTone: number,
  harmonyMode: HarmonyMode
): boolean {
  if (selectedColors.length === 0) return true;
  const toneCount: Record<number, number> = { 100: 0, 200: 0, 300: 0, 400: 0, 500: 0 };
  const selectedTones = selectedColors.map(c => extractTone(c));
  selectedTones.forEach(tone => { toneCount[tone]++; });
  if (toneCount[candidateTone] >= 2) return false;
  if (harmonyMode === "complementary" && selectedTones.includes(candidateTone)) return false;
  for (const selectedTone of selectedTones) {
    if (Math.abs(candidateTone - selectedTone) === 100) return false;
  }
  return true;
}

// ─── Types ────────────────────────────────────────────────────
interface ColorData {
  hex: string;
  name: string;
  group: string;
  roles: ColorRole[];
  hue: number;
  sat: number;
  lum: number;
  wheelAngle?: number;
  originalHue?: number;
}

type DesignContext = "ui" | "campaign";
type HarmonyMode = "text-bg" | "ui-accent" | "analogous" | "complementary" | "triadic" | "split";
type CoreFilter = "verde" | "color" | "both" | "neutrals" | "verde-neutrals" | "all";

const UI_MODES = [
  { id: "text-bg" as const, name: "Fundo & Texto", icon: "◧", description: "WCAG >= 4.5" },
  { id: "ui-accent" as const, name: "Acentos", icon: "✦", description: "Destaques seguros" },
];

const CAMPAIGN_MODES = [
  { id: "analogous" as const, name: "Análogas", icon: "≈", angles: [0, 30, -30], description: "±30°" },
  { id: "complementary" as const, name: "Complementares", icon: "⊕", angles: [0, 180], description: "≈180°" },
  { id: "triadic" as const, name: "Tríade", icon: "△", angles: [0, 120, 240], description: "120°" },
  { id: "split" as const, name: "Split-Compl.", icon: "⋀", angles: [0, 150, 210], description: "150°+210°" },
];

// ─── Componente Principal ─────────────────────────────────────
export function ColorWheelPage() {
  const { isDark } = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const wheelContainerRef = useRef<HTMLDivElement>(null);

  const [designContext, setDesignContext] = useState<DesignContext>("ui");
  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>("text-bg");
  const [coreFilter, setCoreFilter] = useState<CoreFilter>("all");
  const [baseColorHex, setBaseColorHex] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragAngle, setDragAngle] = useState<number | null>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [wheelSize, setWheelSize] = useState(480);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

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
          roles: group.roles,
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

  const activeModesList = designContext === "ui" ? UI_MODES : CAMPAIGN_MODES;
  const currentHarmony = activeModesList.find((m) => m.id === harmonyMode);

  const harmonyLookup = useMemo(() => {
    const lookup = new Map<string, ColorData[]>();
    adaptaColors.forEach((baseColor) => {
      CAMPAIGN_MODES.forEach((mode) => {
        if (!mode.angles) return;
        const result: ColorData[] = [];
        mode.angles.forEach((angleOffset) => {
          const targetHue = normalizeAngle(baseColor.hue + angleOffset);
          let closest = adaptaColors[0];
          let minDiff = adaptaColors.length > 0 ? hueDiff(targetHue, adaptaColors[0].hue) : 0;
          adaptaColors.forEach((c) => {
            const diff = hueDiff(targetHue, c.hue);
            if (diff < minDiff) { minDiff = diff; closest = c; }
          });
          result.push(closest);
        });
        lookup.set(`${baseColor.hex}-${mode.id}`, result);
      });
    });
    return lookup;
  }, [adaptaColors]);

  const harmonyColors = useMemo(() => {
    if (!baseColorHex || adaptaColors.length === 0) return [];
    
    // UI specific modes
    if (designContext === "ui") {
      if (harmonyMode === "text-bg") {
        // Encontrar as melhores cores de contraste da paleta que dão >= 4.5
        const validContrastColors = adaptaColors.filter(c => getContrastRatio(baseColorHex, c.hex) >= 4.5);
        // Sugerir top 3 contrastes seguros e de áreas diferentes (ex. neutro, surface)
        return validContrastColors.slice(0, 4);
      }
      if (harmonyMode === "ui-accent") {
        // Sugerir cor semântica baseada na cor de entrada
        const validAccents = adaptaColors.filter(c => c.roles.includes("ui") && c.group !== "Verde Surface" && c.group !== "Neutros Claros" && c.group !== "Neutros Escuros" && getContrastRatio(baseColorHex, c.hex) >= 3.0);
        return validAccents.slice(0, 3);
      }
    }

    // Campaign Modes
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
  }, [baseColorHex, harmonyMode, designContext, harmonyLookup, isDragging, dragAngle, currentHarmony, adaptaColors]);

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
      
      let isLocked = false;
      if (designContext === 'ui' && !c.roles.includes('ui')) {
         isLocked = true;
      } else if (designContext === 'ui' && harmonyMode === 'text-bg' && baseColorHex) {
         if (getContrastRatio(baseColorHex, c.hex) < 4.5 && c.hex !== baseColorHex) {
             isLocked = true;
         }
      }

      return { 
        ...c, 
        x: CENTER + WHEEL_R * Math.cos(angle), 
        y: CENTER + WHEEL_R * Math.sin(angle),
        isLocked
      };
    }),
  [validatedColors, CENTER, WHEEL_R, designContext, harmonyMode, baseColorHex]);

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
              <div className={styles.emptyEmoji}>🎨</div>
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

              {/* Contexto de Design */}
              <div className={styles.sidebarSection}>
                <label className={styles.sidebarLabel}>Contexto de Design</label>
                <div className={styles.contextTabs}>
                  <button 
                    onClick={() => { setDesignContext("ui"); setHarmonyMode("text-bg"); }}
                    className={`${styles.contextTab} ${designContext === "ui" ? styles.contextTabActive : ""}`}
                  >
                    Interface (Seguro)
                  </button>
                  <button 
                    onClick={() => { setDesignContext("campaign"); setHarmonyMode("analogous"); }}
                    className={`${styles.contextTab} ${designContext === "campaign" ? styles.contextTabActive : ""}`}
                  >
                    Campanha (Livre)
                  </button>
                </div>
              </div>

              {/* Filtro de paleta */}
              <div className={styles.sidebarSection}>
                <label className={styles.sidebarLabel}>Paleta</label>
                <select
                  value={coreFilter}
                  onChange={(e) => setCoreFilter(e.target.value as CoreFilter)}
                  className={styles.paletteSelect}
                >
                  <option value="all">Todas as Cores</option>
                  <option value="both">Verde + Color</option>
                  <option value="verde">Verde Core</option>
                  <option value="color">Semânticas (Color)</option>
                  <option value="neutrals">Neutros</option>
                  <option value="verde-neutrals">Verde + Neutros</option>
                </select>
              </div>

              {/* Modos de harmonia */}
              <div className={styles.sidebarSection}>
                <label className={styles.sidebarLabel}>Objetivo / Harmonia</label>
                <div className={styles.harmonyList}>
                  {activeModesList.map((mode) => {
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

              {/* Cores selecionadas */}
              <div className={styles.sidebarSection}>
                <label className={styles.sidebarLabel}>
                  Cores Selecionadas ({harmonyColors.length})
                </label>
                {harmonyColors.length === 0 ? (
                  <p className={styles.emptyMsg}>Clique na roda para selecionar</p>
                ) : (
                  <div className={styles.selectedColors}>
                    {harmonyColors.map((color, i) => (
                      <motion.div
                        key={`${color.hex}-${i}`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={styles.colorCard}
                      >
                        <div
                          className={styles.colorSwatch}
                          style={{
                            background: color.hex,
                            border: color.hex === baseColorHex
                              ? `2px solid ${isDark ? "#fff" : "#0a0a0a"}`
                              : `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                          }}
                        />
                        <div className={styles.colorInfo}>
                          <div className={styles.colorHexRow}>
                            <span className={styles.colorHex}>
                              {color.hex.toUpperCase()}
                            </span>
                            {color.hex === baseColorHex && (
                              <span className={styles.baseBadge}>BASE</span>
                            )}
                          </div>
                          <span className={styles.colorName}>{color.name}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(color.hex)}
                          className={styles.copyBtn}
                        >
                          {copiedHex === color.hex
                            ? <Check size={12} color="var(--color-success, #22c55e)" />
                            : <Copy size={12} />
                          }
                        </button>
                      </motion.div>
                    ))}
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

                {/* Dicas flutuantes */}
                <div className={styles.tipLeft} style={{ color: tipColor }}>
                  <span className={styles.tipTitle}>// CONTROLES</span>
                  <div>→ Clique: seleciona base</div>
                  <div>→ Lock: cores não seguras estão travadas</div>
                </div>
                <div className={styles.tipRight} style={{ color: tipColor }}>
                  <span className={styles.tipTitle}>// VALIDAÇÃO WCAG</span>
                  <div>✓ {designContext === 'ui' ? 'Contraste Mín 4.5:1 exigido' : 'Mistura Livre Cuidado com Contraste'}</div>
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
                    <filter id="glow-cw">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Círculo de fundo */}
                  <circle
                    cx={CENTER} cy={CENTER}
                    r={WHEEL_R + wheelSize * 0.04}
                    fill={isDark ? "rgba(20, 26, 23, 0.3)" : "rgba(255,255,255,0.5)"}
                    stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}
                    strokeWidth={1}
                  />

                  {/* Fatias de harmonia */}
                  {harmonyColors.length >= 2 && harmonyColors.map((color, i) => {
                    const harmonyColor = positionedColors.find(pc => pc.hex === color.hex);
                    if (!harmonyColor) return null;
                    return (
                      <line
                        key={`line-${i}`}
                        x1={CENTER} y1={CENTER}
                        x2={harmonyColor.x} y2={harmonyColor.y}
                        stroke={color.hex}
                        strokeWidth={1.5}
                        strokeOpacity={0.35}
                      />
                    );
                  })}

                  {/* Pontos de cor */}
                  {positionedColors.map((c) => {
                    const isBase = c.hex === baseColorHex;
                    const isHarmony = !c.isLocked && harmonyColors.some(hc => hc.hex === c.hex);
                    // Diminui o tamanho e opacidade se estiver travado (inseguro/sem contraste)
                    const isLocked = c.isLocked;
                    
                    const r = isBase ? PIN_R * 1.6 : isHarmony ? PIN_R * 1.3 : PIN_R;

                    return (
                      <circle
                        key={c.hex}
                        cx={c.x} cy={c.y}
                        r={r}
                        fill={c.hex}
                        stroke={isBase
                          ? (isDark ? "#fff" : "#000")
                          : isHarmony
                          ? (isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.4)")
                          : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)")}
                        strokeWidth={isBase ? 2.5 : isHarmony ? 1.5 : 0.5}
                        filter={isBase || isHarmony ? "url(#glow-cw)" : undefined}
                        opacity={isLocked ? 0.15 : 1}
                        onMouseDown={() => { if (!isLocked) { setBaseColorHex(c.hex); setIsDragging(true); } }}
                        style={{ cursor: isLocked ? "not-allowed" : "pointer", transition: "r 0.2s ease, opacity 0.3s ease" }}
                      />
                    );
                  })}

                  {/* Label da cor base */}
                  {baseColorHex && (() => {
                    const base = positionedColors.find(c => c.hex === baseColorHex);
                    if (!base) return null;
                    return (
                      <text
                        x={CENTER} y={CENTER + 5}
                        textAnchor="middle"
                        fontSize={wheelSize * 0.028}
                        fill={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"}
                        fontFamily="monospace"
                      >
                        {baseColorHex.toUpperCase()}
                      </text>
                    );
                  })()}
                </svg>
              </div>
            </div>

            {/* Sidebar de Preview (Lado Direito) */}
            <aside className={styles.previewSidebar}>
              <div className={styles.sidebarSection}>
                <h3 className={styles.previewTitle}>Preview em Tempo Real</h3>
                <p className={styles.previewDesc}>
                  {designContext === 'ui' 
                    ? "Veja como as cores se comportam em um componente de interface com validação de acessibilidade."
                    : "Visualize a vibração e o contraste para peças gráficas e campanhas de marketing."}
                </p>

                {/* Dynamic Card */}
                {(() => {
                  const isUI = designContext === 'ui';
                  const primary = baseColorHex || (isDark ? '#141a17' : '#F7F9F2');
                  const secondary = harmonyColors[0]?.hex || (isDark ? '#ffffff' : '#000000');
                  const tertiary = harmonyColors[1]?.hex || secondary;

                  if (isUI) {
                    return (
                      <div 
                        className={styles.previewCard}
                        style={{ background: primary, color: secondary }}
                      >
                        <div className={styles.previewHeader} style={{ borderBottomColor: tertiary + '40' }}>
                          <span>Configurações</span>
                          <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>WCAG {getContrastRatio(primary, secondary).toFixed(1)}</span>
                        </div>
                        <div className={styles.previewBody}>
                          <div className={styles.previewField} style={{ background: tertiary + '15', borderColor: tertiary + '30' }}></div>
                          <div className={styles.previewField} style={{ background: tertiary + '15', borderColor: tertiary + '30' }}></div>
                          <button 
                            className={styles.previewButton}
                            style={{ background: secondary, color: primary }}
                          >
                            Salvar Alterações
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div 
                      className={styles.previewCard}
                      style={{ background: primary, color: secondary, justifyContent: 'center' }}
                    >
                      <div className={styles.previewBody} style={{ alignItems: 'center', textAlign: 'center', flex: 'none' }}>
                        <div className={styles.previewCampaignText}>
                          O FUTURO<br/>É ADAPTA
                        </div>
                        <div className={styles.previewCampaignSub} style={{ color: tertiary }}>
                          Lançamento Oficial
                        </div>
                        <button 
                          className={styles.previewButton}
                          style={{ background: secondary, color: primary, marginTop: '2rem', alignSelf: 'center' }}
                        >
                          Saiba Mais
                        </button>
                      </div>
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
