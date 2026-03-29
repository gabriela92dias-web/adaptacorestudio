/**
 * ═══════════════════════════════════════════════════════════════
 * ADAPTA PLATFORM - Color Wheel
 * ═══════════════════════════════════════════════════════════════
 * 
 * Roda cromática interativa para encontrar harmonias de cores
 * Análise de combinações segundo teoria das cores
 * 
 * Funcionalidades:
 * - Roda de cores visual com paleta Adapta
 * - 5 modos de harmonia (análogas, complementares, tríade, tétrade, split)
 * - Drag & drop para navegar cores
 * - Filtro verde/color
 * - Export de combinações
 */

import { useState, useMemo, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useTheme } from "../utils/theme-context";
import { colorPalette, type ColorGroup, filterForFeature } from "../utils/color-data";

// ═══════════════════════════════════════════════════════════════
//  COLOR MATH
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
//  TONE VALIDATION SYSTEM
// ═══════════════════════════════════════════════════════════════

/**
 * Extrai o tom de luminosidade de uma cor (100, 200, 300, 400, 500)
 * baseado na posição da cor dentro do espectro (índice 0-4)
 */
function extractTone(colorData: ColorData): number {
  // Encontra o índice da cor dentro do seu grupo no colorPalette
  const group = colorPalette.find(g => g.name === colorData.group);
  if (!group) return 300; // Fallback
  
  const colorIndex = group.colors.findIndex(c => c.hex === colorData.hex);
  if (colorIndex === -1) return 300; // Fallback
  
  // Mapeia índice 0-4 para tons 100-500
  const toneMap = [100, 200, 300, 400, 500];
  return toneMap[colorIndex];
}

/**
 * Valida se um tom é compatível com os tons já selecionados
 */
function isValidTone(
  selectedColors: ColorData[],
  candidateTone: number,
  harmonyMode: HarmonyMode
): boolean {
  if (selectedColors.length === 0) return true;
  
  // Conta tons já usados
  const toneCount: Record<number, number> = { 100: 0, 200: 0, 300: 0, 400: 0, 500: 0 };
  const selectedTones = selectedColors.map(c => extractTone(c));
  
  selectedTones.forEach(tone => {
    toneCount[tone]++;
  });
  
  // REGRA 1: Máximo 2 tons iguais por paleta
  if (toneCount[candidateTone] >= 2) {
    return false;
  }
  
  // REGRA 2: Complementares nunca mesmo tom
  if (harmonyMode === "complementary" && selectedTones.includes(candidateTone)) {
    return false;
  }
  
  // REGRA 3: Distância mínima = 2 níveis (não pode adjacente direto)
  for (const selectedTone of selectedTones) {
    const distance = Math.abs(candidateTone - selectedTone);
    if (distance === 100) { // Adjacente direto (ex: 100-200, 200-300)
      return false;
    }
  }
  
  return true;
}

// ═══════════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════════

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
  {
    id: "analogous" as const,
    name: "Análogas",
    icon: "≈",
    angles: [0, 30, -30],
    description: "±30°",
  },
  {
    id: "complementary" as const,
    name: "Complementares",
    icon: "⊕",
    angles: [0, 180],
    description: "≈180°",
  },
  {
    id: "triadic" as const,
    name: "Tríade",
    icon: "△",
    angles: [0, 120, 240],
    description: "120°",
  },
  {
    id: "tetradic" as const,
    name: "Tétrade",
    icon: "◻",
    angles: [0, 90, 180, 270],
    description: "90°",
  },
  {
    id: "split" as const,
    name: "Split-Compl.",
    icon: "⋀",
    angles: [0, 150, 210],
    description: "150°+210°",
  },
];

// ═══════════════════════════════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════════════════════════════

interface ColorWheelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ColorWheel({ isOpen, onClose }: ColorWheelProps) {
  const { isDark } = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const wheelContainerRef = useRef<HTMLDivElement>(null);
  
  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>("analogous");
  const [coreFilter, setCoreFilter] = useState<CoreFilter>("both");
  const [baseColorHex, setBaseColorHex] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragAngle, setDragAngle] = useState<number | null>(null); // Ângulo livre durante drag
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [wheelSize, setWheelSize] = useState(420);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Responsive wheel sizing
  useEffect(() => {
    if (!wheelContainerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const size = Math.min(width, height - 20);
      setWheelSize(Math.max(320, Math.min(size, 500)));
    });
    
    observer.observe(wheelContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Filter visible colors - DISTRIBUIÇÃO UNIFORME EM FATIAS IGUAIS
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
          hue: h, // Mantém HUE real para referência
          sat: s,
          lum: l,
        });
      });
    });
    
    // DISTRIBUI UNIFORMEMENTE: cada cor ocupa uma fatia igual da roda
    // Exemplo: 15 cores = 360°/15 = 24° por cor
    const anglePerColor = 360 / colors.length;
    
    return colors.map((color, index) => ({
      ...color,
      wheelAngle: index * anglePerColor, // Ângulo uniforme na roda
      originalHue: color.hue, // Preserva HUE real para informação
    }));
  }, [coreFilter]);

  const currentHarmony = HARMONY_MODES.find((m) => m.id === harmonyMode)!;

  // Pre-calculate all harmonies (MOVIDO PARA ANTES DO FILTRO DE TONS)
  const harmonyLookup = useMemo(() => {
    const lookup = new Map<string, ColorData[]>();
    
    adaptaColors.forEach((baseColor) => {
      HARMONY_MODES.forEach((mode) => {
        const result: ColorData[] = [];
        
        mode.angles.forEach((angleOffset) => {
          const targetHue = normalizeAngle(baseColor.hue + angleOffset);
          
          let closest = adaptaColors[0];
          let minDiff = hueDiff(targetHue, adaptaColors[0].hue);
          
          adaptaColors.forEach((c) => {
            const diff = hueDiff(targetHue, c.hue);
            if (diff < minDiff) {
              minDiff = diff;
              closest = c;
            }
          });
          
          result.push(closest);
        });
        
        // Remove duplicates - REMOVIDO! Queremos TODAS as cores mesmo que sejam iguais
        // Isso garante que o número de fatias = número de ângulos do modo
        // const unique = result.filter((c, i, arr) => arr.findIndex((x) => x.hex === c.hex) === i);
        
        // Store in lookup: "baseHex-modeId" -> [colors]
        const key = `${baseColor.hex}-${mode.id}`;
        lookup.set(key, result); // Usa 'result' direto ao invés de 'unique'
      });
    });
    
    return lookup;
  }, [adaptaColors]);

  const harmonyColors = useMemo(() => {
    if (!baseColorHex) return [];
    
    // Durante drag: usa ângulo livre
    // Fora do drag: usa ângulo fixo da cor base
    if (isDragging && dragAngle !== null) {
      const result: ColorData[] = [];
      
      currentHarmony.angles.forEach((angleOffset) => {
        const targetAngle = normalizeAngle(dragAngle + angleOffset);
        
        // Encontra cor mais próxima do targetAngle
        let closest = adaptaColors[0];
        let minDiff = hueDiff(targetAngle, adaptaColors[0].wheelAngle!);
        
        adaptaColors.forEach((c) => {
          const diff = hueDiff(targetAngle, c.wheelAngle!);
          if (diff < minDiff) {
            minDiff = diff;
            closest = c;
          }
        });
        
        result.push(closest);
      });
      
      return result;
    }
    
    // Modo normal: usa lookup pré-calculado
    const key = `${baseColorHex}-${harmonyMode}`;
    return harmonyLookup.get(key) || [];
  }, [baseColorHex, harmonyMode, harmonyLookup, isDragging, dragAngle, currentHarmony, adaptaColors]);

  // ═══════════════════════════════════════════════════════════════
  //  TONE FILTERING: Remove cores inválidas baseado nas regras
  // ═══════════════════════════════════════════════════════════════
  
  const validatedColors = useMemo(() => {
    // Se não há harmonia ativa, mostra todas as cores
    if (!baseColorHex || harmonyColors.length === 0) {
      return adaptaColors;
    }
    
    // Filtra apenas cores válidas segundo regras de tons
    const validColors = adaptaColors.filter((candidateColor) => {
      const candidateTone = extractTone(candidateColor);
      return isValidTone(harmonyColors, candidateTone, harmonyMode);
    });
    
    // Recalcula distribuição uniforme apenas com cores válidas
    const anglePerColor = validColors.length > 0 ? 360 / validColors.length : 0;
    
    return validColors.map((color, index) => ({
      ...color,
      wheelAngle: index * anglePerColor,
    }));
  }, [adaptaColors, harmonyColors, harmonyMode, baseColorHex]);

  const CENTER = wheelSize / 2;
  const WHEEL_R = wheelSize * 0.38;
  const DOT_R = wheelSize * 0.011;
  const PIN_R = wheelSize * 0.022;

  const positionedColors = useMemo(() => {
    // USA cores validadas (apenas cores permitidas aparecem na roda)
    return validatedColors.map((c) => {
      // USA wheelAngle (distribuição uniforme) ao invés de hue real
      const angle = ((c.wheelAngle! - 90) * Math.PI) / 180;
      return {
        ...c,
        x: CENTER + WHEEL_R * Math.cos(angle),
        y: CENTER + WHEEL_R * Math.sin(angle),
      };
    });
  }, [validatedColors, CENTER, WHEEL_R]);

  const handleMouseDown = (hex: string) => {
    setBaseColorHex(hex);
    setIsDragging(true);
  };

  const findClosestColor = (svgX: number, svgY: number): ColorData | null => {
    const CLICK_THRESHOLD = wheelSize * 0.08;
    
    let closestColor: ColorData | null = null;
    let minDistance = CLICK_THRESHOLD;
    
    positionedColors.forEach((color) => {
      const dx = svgX - color.x;
      const dy = svgY - color.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    });
    
    return closestColor;
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (isDragging) return;
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const scaleX = wheelSize / rect.width;
    const scaleY = wheelSize / rect.height;
    const svgX = x * scaleX;
    const svgY = y * scaleY;
    
    const closestColor = findClosestColor(svgX, svgY);
    
    if (closestColor) {
      setBaseColorHex(closestColor.hex);
    }
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (!svgRef.current) return;
    
    if (isDragging) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const scaleX = wheelSize / rect.width;
      const scaleY = wheelSize / rect.height;
      const svgX = x * scaleX;
      const svgY = y * scaleY;
      
      const dx = svgX - CENTER;
      const dy = svgY - CENTER;
      
      const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
      const MIN_DRAG_RADIUS = wheelSize * 0.1;
      
      if (distanceFromCenter < MIN_DRAG_RADIUS) {
        return;
      }
      
      const angleRad = Math.atan2(dy, dx);
      const angleDeg = normalizeAngle((angleRad * 180) / Math.PI + 90);

      // Encontra a cor mais próxima usando wheelAngle ao invés de hue real
      let closest = adaptaColors[0];
      let minDiff = hueDiff(angleDeg, adaptaColors[0].wheelAngle!);
      
      adaptaColors.forEach((c) => {
        const diff = hueDiff(angleDeg, c.wheelAngle!);
        if (diff < minDiff) {
          minDiff = diff;
          closest = c;
        }
      });

      flushSync(() => {
        setBaseColorHex(closest.hex);
      });
      setDragAngle(angleDeg);
      return;
    }
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const scaleX = wheelSize / rect.width;
    const scaleY = wheelSize / rect.height;
    const svgX = x * scaleX;
    const svgY = y * scaleY;
    
    const closestColor = findClosestColor(svgX, svgY);
    setHoveredColor(closestColor ? closestColor.hex : null);
  };

  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        setDragAngle(null); // Limpa ângulo ao soltar
      };
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!svgRef.current || adaptaColors.length === 0) return;
        
        const rect = svgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const scaleX = wheelSize / rect.width;
        const scaleY = wheelSize / rect.height;
        const svgX = x * scaleX;
        const svgY = y * scaleY;
        
        const dx = svgX - CENTER;
        const dy = svgY - CENTER;
        
        const angleRad = Math.atan2(dy, dx);
        const angleDeg = normalizeAngle((angleRad * 180) / Math.PI + 90);

        // Atualiza dragAngle para rotação livre
        setDragAngle(angleDeg);

        // Encontra a cor mais próxima usando wheelAngle ao invés de hue real
        let closest = adaptaColors[0];
        let minDiff = hueDiff(angleDeg, adaptaColors[0].wheelAngle!);
        
        adaptaColors.forEach((c) => {
          const diff = hueDiff(angleDeg, c.wheelAngle!);
          if (diff < minDiff) {
            minDiff = diff;
            closest = c;
          }
        });

        flushSync(() => {
          setBaseColorHex(closest.hex);
        });
      };
      
      window.addEventListener("mouseup", handleGlobalMouseUp);
      window.addEventListener("mousemove", handleGlobalMouseMove);
      return () => {
        window.removeEventListener("mouseup", handleGlobalMouseUp);
        window.removeEventListener("mousemove", handleGlobalMouseMove);
      };
    }
  }, [isDragging, adaptaColors, wheelSize, CENTER]);

  useEffect(() => {
    if (adaptaColors.length > 0) {
      const currentStillValid = adaptaColors.find(c => c.hex === baseColorHex);
      if (!currentStillValid) {
        setBaseColorHex(adaptaColors[0].hex);
      }
    }
  }, [adaptaColors, baseColorHex]);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex.toUpperCase());
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ 
              background: isDark 
                ? "linear-gradient(135deg, #6A8A7A 0%, #8FA89B 100%)"
                : "linear-gradient(135deg, #445A4F 0%, #6A8A7A 100%)"
            }}
          >
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">Roda Cromática</h2>
            <p className="text-xs text-muted-foreground">
              Encontre harmonias de cores da paleta Adapta
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="flex gap-4 h-full p-6" style={{ userSelect: "none" }}>
            {/* Sidebar */}
            <div className="w-56 shrink-0 space-y-4 overflow-y-auto">
              {/* Filter */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Paleta
                </label>
                <select
                  value={coreFilter}
                  onChange={(e) => setCoreFilter(e.target.value as CoreFilter)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-neutral-600"
                >
                  <option value="both">Verde + Color (30 cores)</option>
                  <option value="verde">Verde Core (15 cores)</option>
                  <option value="color">Color Core (15 cores)</option>
                  <option value="neutrals">Neutrals (15 cores)</option>
                  <option value="verde-neutrals">Verde + Neutrals (30 cores)</option>
                  <option value="all">Todas (45 cores)</option>
                </select>
              </div>

              {/* Harmony Modes */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Modo de Harmonia
                </label>
                <div className="space-y-2">
                  {HARMONY_MODES.map((mode) => {
                    const isActive = harmonyMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setHarmonyMode(mode.id)}
                        className={`w-full p-3 rounded-lg transition-all flex items-center gap-3 text-left ${
                          isActive ? "bg-neutral-800/30 ring-2 ring-neutral-700" : "bg-muted/50 hover:bg-muted border border-border"
                        }`}
                      >
                        <div className={`text-lg w-7 h-7 flex items-center justify-center rounded ${
                          isActive ? "bg-neutral-700 text-white" : "bg-muted text-muted-foreground"
                        }`}>
                          {mode.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold">{mode.name}</div>
                          <div className="text-[10px] text-muted-foreground">{mode.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Colors */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Cores Selecionadas ({harmonyColors.length})
                </label>

                {harmonyColors.length === 0 ? (
                  <p className="text-xs text-center py-6 text-muted-foreground">
                    Clique na roda para selecionar
                  </p>
                ) : (
                  <div className="space-y-2">
                    {harmonyColors.map((color, i) => (
                      <motion.div
                        key={`${color.hex}-${i}`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                      >
                        <div
                          className="w-8 h-8 rounded shrink-0"
                          style={{
                            background: color.hex,
                            border: color.hex === baseColorHex
                              ? `2px solid ${isDark ? "#fff" : "#0a0a0a"}`
                              : `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono font-bold">
                              {color.hex.toUpperCase()}
                            </span>
                            {color.hex === baseColorHex && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-700 text-white font-bold">
                                BASE
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {color.name}
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(color.hex)}
                          className="px-2 py-1 rounded text-[10px] font-medium transition-all bg-muted hover:bg-muted/80"
                        >
                          {copiedHex === color.hex ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Wheel */}
            <div ref={wheelContainerRef} className="flex-1 flex items-center justify-center overflow-hidden">
              <div className="relative" style={{ width: wheelSize, height: wheelSize }}>
                
                {/* CONTROLES - Canto Superior Esquerdo */}
                <div 
                  className="absolute top-2 left-2 text-[9px] leading-tight opacity-40 max-w-[110px]"
                  style={{ 
                    fontFamily: 'monospace',
                    color: isDark ? 'rgba(232,240,237,0.6)' : 'rgba(0,0,0,0.5)',
                  }}
                >
                  <div className="font-bold mb-1 text-[10px]">// CONTROLES</div>
                  <div>→ Clique: seleciona</div>
                  <div>→ Drag: navega</div>
                  <div>→ Modo: harmonia</div>
                </div>

                {/* VALIDAÇÃO - Canto Superior Direito */}
                <div 
                  className="absolute top-2 right-2 text-[9px] leading-tight opacity-40 max-w-[120px] text-right"
                  style={{ 
                    fontFamily: 'monospace',
                    color: isDark ? 'rgba(232,240,237,0.6)' : 'rgba(0,0,0,0.5)',
                  }}
                >
                  <div className="font-bold mb-1 text-[10px]">// VALIDAÇÃO</div>
                  <div>✓ Max 2 tons iguais</div>
                  <div>✓ Sem adjacentes</div>
                  <div>✓ Compl: tons ≠</div>
                </div>

                {/* TONS - Canto Inferior Esquerdo */}
                <div 
                  className="absolute bottom-2 left-2 text-[9px] leading-tight opacity-40 max-w-[100px]"
                  style={{ 
                    fontFamily: 'monospace',
                    color: isDark ? 'rgba(232,240,237,0.6)' : 'rgba(0,0,0,0.5)',
                  }}
                >
                  <div className="font-bold mb-1 text-[10px]">// TONS</div>
                  <div>100 claro</div>
                  <div>300 médio</div>
                  <div>500 escuro</div>
                </div>

                {/* SISTEMA - Canto Inferior Direito */}
                <div 
                  className="absolute bottom-2 right-2 text-[9px] leading-tight opacity-40 max-w-[120px] text-right"
                  style={{ 
                    fontFamily: 'monospace',
                    color: isDark ? 'rgba(232,240,237,0.6)' : 'rgba(0,0,0,0.5)',
                  }}
                >
                  <div className="font-bold mb-1 text-[10px]">// SISTEMA</div>
                  <div>Distribuição uniforme</div>
                  <div>Filtro invisível ativo</div>
                  <div className="opacity-60 text-[8px] mt-0.5">v2026.1</div>
                </div>

                <svg
                  ref={svgRef}
                  width={wheelSize}
                  height={wheelSize}
                  viewBox={`0 0 ${wheelSize} ${wheelSize}`}
                  onMouseMove={handleSvgMouseMove}
                  onMouseUp={handleMouseUp}
                  onClick={handleSvgClick}
                  className="relative z-10"
                  style={{ 
                    cursor: isDragging ? "grabbing" : hoveredColor ? "pointer" : "crosshair",
                    pointerEvents: "all",
                    userSelect: "none",
                  }}
                >
                  <defs>
                    {harmonyColors.map((color, i) => (
                      <radialGradient 
                        key={`sliceGradient-${color.hex}-${i}`}
                        id={`sliceGradient-${i}`}
                        cx="50%" 
                        cy="50%" 
                        r="50%"
                      >
                        <stop offset="0%" stopColor={color.hex} stopOpacity="1.0"/>
                        <stop offset="85%" stopColor={color.hex} stopOpacity="1.0"/>
                        <stop offset="100%" stopColor={color.hex} stopOpacity="0.75"/>
                      </radialGradient>
                    ))}
                    
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Background circle */}
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={WHEEL_R + wheelSize * 0.04}
                    fill={isDark ? "rgba(20, 26, 23, 0.3)" : "rgba(255,255,255,0.5)"}
                    stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}
                    strokeWidth={1}
                  />

                  {/* Color slices */}
                  {harmonyColors.length >= 2 && harmonyColors.map((color, i) => {
                    // Distribuir fatias UNIFORMEMENTE pelo círculo
                    // Cada fatia ocupa 360° / número de cores
                    const sliceAngle = (Math.PI * 2) / harmonyColors.length;
                    
                    // CALCULAR ângulo baseado no ÍNDICE, não no hue da cor!
                    // Isso garante que sempre teremos N fatias visíveis, mesmo que cores sejam iguais
                    const baseAngle = (i * (360 / harmonyColors.length) - 90) * Math.PI / 180;
                    const angleStart = baseAngle - sliceAngle / 2;
                    const angleEnd = baseAngle + sliceAngle / 2;
                    
                    const outerRadius = WHEEL_R * 0.6;
                    
                    const x1 = CENTER + outerRadius * Math.cos(angleStart);
                    const y1 = CENTER + outerRadius * Math.sin(angleStart);
                    const x2 = CENTER + outerRadius * Math.cos(angleEnd);
                    const y2 = CENTER + outerRadius * Math.sin(angleEnd);
                    
                    const largeArc = sliceAngle > Math.PI ? 1 : 0;
                    
                    const pathData = `
                      M ${CENTER} ${CENTER}
                      L ${x1} ${y1}
                      A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}
                      Z
                    `;
                    
                    return (
                      <motion.path
                        key={`slice-${color.hex}-${i}`}
                        d={pathData}
                        fill={`url(#sliceGradient-${i})`}
                        stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}
                        strokeWidth={0.5}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          delay: i * 0.08, 
                          type: "spring", 
                          stiffness: 200,
                          damping: 20
                        }}
                        style={{ pointerEvents: "none" }}
                      />
                    );
                  })}

                  {/* Degree markers */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
                    const angle = ((deg - 90) * Math.PI) / 180;
                    const isCardinal = deg % 90 === 0;
                    const r1 = WHEEL_R + wheelSize * 0.044;
                    const r2 = WHEEL_R + (isCardinal ? wheelSize * 0.068 : wheelSize * 0.056);
                    
                    return (
                      <g key={deg}>
                        <line
                          x1={CENTER + r1 * Math.cos(angle)}
                          y1={CENTER + r1 * Math.sin(angle)}
                          x2={CENTER + r2 * Math.cos(angle)}
                          y2={CENTER + r2 * Math.sin(angle)}
                          stroke={isDark ? "rgba(232,240,237,0.2)" : "rgba(0,0,0,0.15)"}
                          strokeWidth={isCardinal ? 1.5 : 1}
                        />
                        {isCardinal && (
                          <text
                            x={CENTER + (WHEEL_R + wheelSize * 0.09) * Math.cos(angle)}
                            y={CENTER + (WHEEL_R + wheelSize * 0.09) * Math.sin(angle)}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill={isDark ? "rgba(232,240,237,0.35)" : "rgba(0,0,0,0.3)"}
                            fontSize={wheelSize * 0.02}
                            fontWeight={600}
                          >
                            {deg}°
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Connection lines */}
                  {harmonyColors.map((c, idx) => {
                    // Usa wheelAngle para posicionamento consistente
                    const angle = ((c.wheelAngle! - 90) * Math.PI) / 180;
                    const x = CENTER + WHEEL_R * Math.cos(angle);
                    const y = CENTER + WHEEL_R * Math.sin(angle);
                    
                    return (
                      <motion.line
                        key={`line-${harmonyMode}-${c.hex}-${idx}`}
                        x1={CENTER}
                        y1={CENTER}
                        x2={x}
                        y2={y}
                        stroke={isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"}
                        strokeWidth={2}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: idx * 0.08, duration: 0.6, ease: "easeOut" }}
                      />
                    );
                  })}

                  {/* Center info */}
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={wheelSize * 0.09}
                    fill={isDark ? "rgba(20, 26, 23, 0.95)" : "rgba(255,255,255,0.95)"}
                    stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}
                    strokeWidth={3}
                  />
                  
                  <text
                    x={CENTER}
                    y={CENTER - wheelSize * 0.016}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isDark ? "rgba(232,240,237,0.5)" : "rgba(0,0,0,0.45)"}
                    fontSize={wheelSize * 0.064}
                    fontWeight={700}
                  >
                    {currentHarmony.icon}
                  </text>
                  
                  <text
                    x={CENTER}
                    y={CENTER + wheelSize * 0.038}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isDark ? "rgba(232,240,237,0.45)" : "rgba(0,0,0,0.35)"}
                    fontSize={wheelSize * 0.018}
                    letterSpacing={1}
                    fontWeight={600}
                  >
                    {harmonyColors.length} CORES
                  </text>

                  {/* Color dots */}
                  {positionedColors.map((color) => {
                    const isInHarmony = harmonyColors.some((c) => c.hex === color.hex);
                    const isHovered = hoveredColor === color.hex;
                    const opacity = baseColorHex ? (isInHarmony ? 1 : 0.2) : 1;
                    
                    return (
                      <circle
                        key={color.hex}
                        cx={color.x}
                        cy={color.y}
                        r={isHovered ? DOT_R + 2 : DOT_R}
                        fill={color.hex}
                        stroke={isDark ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.9)"}
                        strokeWidth={isHovered ? 2 : 1.5}
                        opacity={opacity}
                        style={{ 
                          pointerEvents: "none",
                          transition: "all 0.15s ease-out"
                        }}
                      />
                    );
                  })}

                  {/* Harmony pins */}
                  {harmonyColors.map((color, i) => {
                    // Usa wheelAngle para posicionamento consistente
                    const angle = ((color.wheelAngle! - 90) * Math.PI) / 180;
                    const x = CENTER + WHEEL_R * Math.cos(angle);
                    const y = CENTER + WHEEL_R * Math.sin(angle);
                    const isBase = color.hex === baseColorHex;
                    const isHovered = hoveredPin === color.hex;
                    
                    return (
                      <motion.g
                        key={`pin-${color.hex}-${i}`}
                        initial={{ scale: 0 }}
                        animate={{ 
                          scale: 1,
                          x: x,
                          y: y
                        }}
                        transition={{ 
                          scale: { delay: i * 0.04, type: "spring", stiffness: 300 },
                          x: { type: "spring", stiffness: 300, damping: 25 },
                          y: { type: "spring", stiffness: 300, damping: 25 }
                        }}
                        style={{ transformOrigin: `${x}px ${y}px` }}
                      >
                        <circle
                          cx={0}
                          cy={0}
                          r={PIN_R * 4}
                          fill="transparent"
                          style={{ cursor: isDragging ? "grabbing" : (isBase ? "grab" : "pointer") }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            handleMouseDown(color.hex);
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isBase) setBaseColorHex(color.hex);
                          }}
                          onMouseEnter={() => setHoveredPin(color.hex)}
                          onMouseLeave={() => setHoveredPin(null)}
                        />

                        {isHovered && !isDragging && (
                          <circle
                            cx={0}
                            cy={0}
                            r={PIN_R * 2.5}
                            fill="none"
                            stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)"}
                            strokeWidth={1.5}
                            strokeOpacity={0.3}
                            strokeDasharray="3 3"
                          />
                        )}

                        <circle
                          cx={0}
                          cy={0}
                          r={PIN_R}
                          fill={color.hex}
                          stroke="#ffffff"
                          strokeWidth={isBase ? 3 : 2}
                          filter="url(#glow)"
                          style={{ pointerEvents: "none" }}
                        />
                      </motion.g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}