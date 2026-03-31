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
import { Button } from "../../../components/ui/button";
import { useTheme } from "../../../utils/theme-context";
import { colorPalette, filterForFeature } from "../../../utils/color-data";

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
  hue: number;
  sat: number;
  lum: number;
  wheelAngle?: number;
  originalHue?: number;
}

type HarmonyMode = "analogous" | "complementary" | "triadic" | "tetradic" | "split";
type CoreFilter = "verde" | "color" | "both" | "neutrals" | "verde-neutrals" | "all";

const HARMONY_MODES = [
  { id: "analogous" as const, name: "Análogas", icon: "≈", angles: [0, 30, -30], description: "±30°" },
  { id: "complementary" as const, name: "Complementares", icon: "⊕", angles: [0, 180], description: "≈180°" },
  { id: "triadic" as const, name: "Tríade", icon: "△", angles: [0, 120, 240], description: "120°" },
  { id: "tetradic" as const, name: "Tétrade", icon: "◻", angles: [0, 90, 180, 270], description: "90°" },
  { id: "split" as const, name: "Split-Compl.", icon: "⋀", angles: [0, 150, 210], description: "150°+210°" },
];

// ─── Componente Principal ─────────────────────────────────────
export function ColorWheelPage() {
  const { isDark } = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const wheelContainerRef = useRef<HTMLDivElement>(null);

  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>("analogous");
  const [coreFilter, setCoreFilter] = useState<CoreFilter>("both");
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
        colors.push({ hex: c.hex, name: c.name || c.hex, group: group.name, hue: h, sat: s, lum: l });
      });
    });
    const anglePerColor = colors.length > 0 ? 360 / colors.length : 0;
    return colors.map((color, index) => ({
      ...color,
      wheelAngle: index * anglePerColor,
      originalHue: color.hue,
    }));
  }, [coreFilter]);

  const currentHarmony = HARMONY_MODES.find((m) => m.id === harmonyMode)!;

  const harmonyLookup = useMemo(() => {
    const lookup = new Map<string, ColorData[]>();
    adaptaColors.forEach((baseColor) => {
      HARMONY_MODES.forEach((mode) => {
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
    if (isDragging && dragAngle !== null) {
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

  const validatedColors = useMemo(() => {
    if (!baseColorHex || harmonyColors.length === 0) return adaptaColors;
    const validColors = adaptaColors.filter((c) =>
      isValidTone(harmonyColors, extractTone(c), harmonyMode)
    );
    const anglePerColor = validColors.length > 0 ? 360 / validColors.length : 0;
    return validColors.map((color, index) => ({ ...color, wheelAngle: index * anglePerColor }));
  }, [adaptaColors, harmonyColors, harmonyMode, baseColorHex]);

  const CENTER = wheelSize / 2;
  const WHEEL_R = wheelSize * 0.38;
  const PIN_R = wheelSize * 0.022;

  const positionedColors = useMemo(() =>
    validatedColors.map((c) => {
      const angle = ((c.wheelAngle! - 90) * Math.PI) / 180;
      return { ...c, x: CENTER + WHEEL_R * Math.cos(angle), y: CENTER + WHEEL_R * Math.sin(angle) };
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
    if (c) setBaseColorHex(c.hex);
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

  return (
    <>
      <Helmet><title>CoreStudio | Roda Cromática</title></Helmet>

      <div className="flex flex-col h-full min-h-0 p-6 gap-6 max-w-[1400px] mx-auto">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Roda Cromática</h1>
          <p className="text-muted-foreground mt-1">
            Encontre harmonias de cores da paleta institucional Adapta
          </p>
        </div>

        {/* Empty state */}
        {emptyState && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3 max-w-sm">
              <div className="text-5xl">🎨</div>
              <h2 className="text-lg font-semibold">Paleta ainda não configurada</h2>
              <p className="text-sm text-muted-foreground">
                Adicione as cores da identidade visual Adapta em{" "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                  utils/color-data.ts
                </code>{" "}
                para ativar a roda cromática.
              </p>
            </div>
          </div>
        )}

        {/* Main layout */}
        {!emptyState && (
          <div className="flex gap-6 flex-1 min-h-0 overflow-hidden">

            {/* Sidebar */}
            <aside className="w-60 shrink-0 flex flex-col gap-5 overflow-y-auto">

              {/* Filtro de paleta */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Paleta
                </label>
                <select
                  value={coreFilter}
                  onChange={(e) => setCoreFilter(e.target.value as CoreFilter)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="both">Verde + Color</option>
                  <option value="verde">Verde Core</option>
                  <option value="color">Color Core</option>
                  <option value="neutrals">Neutrals</option>
                  <option value="verde-neutrals">Verde + Neutrals</option>
                  <option value="all">Todas</option>
                </select>
              </div>

              {/* Modos de harmonia */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Modo de Harmonia
                </label>
                <div className="space-y-1.5">
                  {HARMONY_MODES.map((mode) => {
                    const isActive = harmonyMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setHarmonyMode(mode.id)}
                        className={`w-full p-2.5 rounded-lg transition-all flex items-center gap-2.5 text-left text-sm ${
                          isActive
                            ? "bg-foreground/10 ring-1 ring-foreground/20 font-semibold"
                            : "bg-muted/50 hover:bg-muted border border-border"
                        }`}
                      >
                        <span className={`w-6 h-6 flex items-center justify-center rounded text-base ${
                          isActive ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                        }`}>
                          {mode.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium">{mode.name}</div>
                          <div className="text-[10px] text-muted-foreground">{mode.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cores selecionadas */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Cores Selecionadas ({harmonyColors.length})
                </label>
                {harmonyColors.length === 0 ? (
                  <p className="text-xs text-center py-4 text-muted-foreground">
                    Clique na roda para selecionar
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {harmonyColors.map((color, i) => (
                      <motion.div
                        key={`${color.hex}-${i}`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                      >
                        <div
                          className="w-7 h-7 rounded shrink-0"
                          style={{
                            background: color.hex,
                            border: color.hex === baseColorHex
                              ? `2px solid ${isDark ? "#fff" : "#0a0a0a"}`
                              : `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] font-mono font-bold">
                              {color.hex.toUpperCase()}
                            </span>
                            {color.hex === baseColorHex && (
                              <span className="text-[9px] px-1 py-0.5 rounded bg-foreground text-background font-bold">
                                BASE
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">{color.name}</div>
                        </div>
                        <button
                          onClick={() => handleCopy(color.hex)}
                          className="px-1.5 py-1 rounded hover:bg-muted transition-colors"
                        >
                          {copiedHex === color.hex
                            ? <Check className="w-3 h-3 text-green-500" />
                            : <Copy className="w-3 h-3" />
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
              className="flex-1 flex items-center justify-center overflow-hidden"
            >
              <div className="relative" style={{ width: wheelSize, height: wheelSize }}>

                {/* Dicas flutuantes */}
                <div className="absolute top-2 left-2 text-[9px] leading-tight opacity-35 font-mono max-w-[100px]"
                  style={{ color: isDark ? "rgba(232,240,237,0.7)" : "rgba(0,0,0,0.5)" }}>
                  <div className="font-bold mb-0.5 text-[10px]">// CONTROLES</div>
                  <div>→ Clique: seleciona</div>
                  <div>→ Drag: navega</div>
                </div>
                <div className="absolute top-2 right-2 text-[9px] leading-tight opacity-35 font-mono max-w-[110px] text-right"
                  style={{ color: isDark ? "rgba(232,240,237,0.7)" : "rgba(0,0,0,0.5)" }}>
                  <div className="font-bold mb-0.5 text-[10px]">// TONS</div>
                  <div>✓ Max 2 iguais</div>
                  <div>✓ Sem adjacentes</div>
                </div>

                <svg
                  ref={svgRef}
                  width={wheelSize}
                  height={wheelSize}
                  viewBox={`0 0 ${wheelSize} ${wheelSize}`}
                  onMouseMove={handleSvgMouseMove}
                  onMouseUp={() => setIsDragging(false)}
                  onClick={handleSvgClick}
                  className="relative z-10"
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
                    const baseColor = positionedColors.find(pc => pc.hex === baseColorHex);
                    const harmonyColor = positionedColors.find(pc => pc.hex === color.hex);
                    if (!baseColor || !harmonyColor) return null;
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
                    const isHarmony = harmonyColors.some(hc => hc.hex === c.hex);
                    const isHovered = c.hex === hoveredColor;
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
                        onMouseDown={() => { setBaseColorHex(c.hex); setIsDragging(true); }}
                        style={{ cursor: "grab", transition: "r 0.1s ease" }}
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
          </div>
        )}
      </div>
    </>
  );
}
