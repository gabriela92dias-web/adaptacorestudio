import { useState, useCallback, useEffect } from "react";
import { Palette, RotateCcw, Download, Upload, X, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useTheme } from "./theme-context";
import { colorPalette, type ColorGroup, type ColorEntry } from "./color-data";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface EditableColorGroup {
  name: string;
  hueRange: string;
  colors: EditableColor[];
}

interface EditableColor {
  hex: string;
  rgb: string;
  hsb: string;
  cmyk: string;
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("").toUpperCase();
}

// Convert hex to RGB string format "R, G, B"
function hexToRgbString(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `${r}, ${g}, ${b}`;
}

// Convert RGB to HSB (simplified - for display only)
function rgbToHsb(r: number, g: number, b: number): string {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / delta + 2) / 6;
    else h = ((r - g) / delta + 4) / 6;
  }
  
  const s = max === 0 ? 0 : delta / max;
  const b_val = max;
  
  return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(b_val * 100)}%`;
}

// Convert RGB to CMYK (simplified - for display only)
function rgbToCmyk(r: number, g: number, b: number): string {
  if (r === 0 && g === 0 && b === 0) return "0, 0, 0, 100";
  
  const c = 1 - (r / 255);
  const m = 1 - (g / 255);
  const y = 1 - (b / 255);
  const k = Math.min(c, m, y);
  
  const c_final = k === 1 ? 0 : ((c - k) / (1 - k));
  const m_final = k === 1 ? 0 : ((m - k) / (1 - k));
  const y_final = k === 1 ? 0 : ((y - k) / (1 - k));
  
  return `${Math.round(c_final * 100)}, ${Math.round(m_final * 100)}, ${Math.round(y_final * 100)}, ${Math.round(k * 100)}`;
}

// Update derived color formats when hex changes
function updateColorFromHex(hex: string): EditableColor {
  const { r, g, b } = hexToRgb(hex);
  return {
    hex: hex.toUpperCase(),
    rgb: hexToRgbString(hex),
    hsb: rgbToHsb(r, g, b),
    cmyk: rgbToCmyk(r, g, b),
  };
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export function ColorPaletteEditor() {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const [palette, setPalette] = useState<EditableColorGroup[]>(() => {
    const saved = localStorage.getItem("adapta-custom-palette");
    if (saved) return JSON.parse(saved);
    return colorPalette.map(g => ({
      name: g.name,
      hueRange: g.hueRange,
      colors: g.colors.map(c => ({ ...c })),
    }));
  });

  // Apply palette changes in real-time
  useEffect(() => {
    localStorage.setItem("adapta-custom-palette", JSON.stringify(palette));
    // Dispatch event so other components can react
    window.dispatchEvent(new CustomEvent("palette-updated", { detail: palette }));
  }, [palette]);

  const updateColor = useCallback((groupIndex: number, colorIndex: number, newHex: string) => {
    setPalette(prev => {
      const newPalette = JSON.parse(JSON.stringify(prev));
      const updated = updateColorFromHex(newHex);
      newPalette[groupIndex].colors[colorIndex] = updated;
      return newPalette;
    });
  }, []);

  const resetToDefault = useCallback(() => {
    if (!confirm("Resetar paleta para as cores padrão da Adapta?")) return;
    
    const defaultPalette = colorPalette.map(g => ({
      name: g.name,
      hueRange: g.hueRange,
      colors: g.colors.map(c => ({ ...c })),
    }));
    
    setPalette(defaultPalette);
    localStorage.removeItem("adapta-custom-palette");
    window.dispatchEvent(new CustomEvent("palette-updated", { detail: defaultPalette }));
  }, []);

  const exportPalette = useCallback(() => {
    const json = JSON.stringify(palette, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `adapta-palette-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [palette]);

  const importPalette = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setPalette(imported);
          alert("Paleta importada com sucesso!");
        } catch (err) {
          alert("Erro ao importar paleta: arquivo inválido");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const totalColors = palette.reduce((sum, g) => sum + g.colors.length, 0);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[146px] right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all"
        style={{
          background: isDark ? "#1a1a1a" : "#ffffff",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
          color: isDark ? "#fafafa" : "#0a0a0a",
        }}
        title="Abrir Editor de Paleta de Cores"
      >
        <Palette className="w-4 h-4" />
        <span className="text-[12px] font-medium">Paleta</span>
      </button>
    );
  }

  const bg = isDark ? "#121212" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  const text = isDark ? "#e8e8e6" : "#1a1a1a";
  const textMuted = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.55)";
  const accent = isDark ? "#fafafa" : "#0a0a0a";

  return (
    <div
      className="fixed bottom-[146px] right-6 z-[100] w-[480px] rounded-2xl shadow-2xl overflow-hidden"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        maxHeight: "75vh",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
          background: isDark ? "rgba(46,204,155,0.05)" : "rgba(1,70,62,0.03)",
        }}
      >
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4" style={{ color: accent }} />
          <h3 className="text-[13px] font-semibold" style={{ color: text }}>
            Editor de Paleta de Cores
          </h3>
          <div
            className="px-2 py-0.5 rounded text-[9px] font-medium"
            style={{
              background: isDark ? "rgba(46,204,155,0.15)" : "rgba(1,70,62,0.1)",
              color: accent,
            }}
          >
            {totalColors} CORES
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          style={{ color: textMuted }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Color groups - scrollable */}
      <div className="overflow-y-auto" style={{ maxHeight: "calc(75vh - 180px)" }}>
        <div className="p-4 space-y-3">
          {palette.map((group, groupIndex) => (
            <ColorGroupSection
              key={groupIndex}
              group={group}
              groupIndex={groupIndex}
              isDark={isDark}
              onColorChange={updateColor}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div
        className="flex gap-2 p-3 border-t"
        style={{
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
          background: isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)",
        }}
      >
        <button
          onClick={resetToDefault}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-colors"
          style={{
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
            color: textMuted,
          }}
          title="Resetar para padrão"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
        <button
          onClick={importPalette}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-colors"
          style={{
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
            color: textMuted,
          }}
          title="Importar paleta"
        >
          <Upload className="w-3 h-3" />
          Import
        </button>
        <button
          onClick={exportPalette}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-colors"
          style={{
            background: isDark ? "rgba(46,204,155,0.15)" : "rgba(1,70,62,0.1)",
            color: accent,
          }}
          title="Exportar paleta"
        >
          <Download className="w-3 h-3" />
          Export
        </button>
      </div>

      {/* Preview banner */}
      <div
        className="px-4 py-2 text-center text-[9px]"
        style={{
          background: `linear-gradient(90deg, ${palette.flatMap(g => g.colors.slice(0, 2).map(c => c.hex)).join(", ")})`,
          color: "#ffffff",
          fontWeight: 600,
          letterSpacing: "0.5px",
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        <Sparkles className="w-3 h-3 inline mr-1" />
        PREVIEW AO VIVO • {palette.length} FAMÍLIAS
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COLOR GROUP SECTION - Collapsible group
// ═══════════════════════════════════════════════════════════════

interface ColorGroupSectionProps {
  group: EditableColorGroup;
  groupIndex: number;
  isDark: boolean;
  onColorChange: (groupIndex: number, colorIndex: number, newHex: string) => void;
}

function ColorGroupSection({ group, groupIndex, isDark, onColorChange }: ColorGroupSectionProps) {
  const [isExpanded, setIsExpanded] = useState(groupIndex === 0); // First group expanded by default

  // Get tier badge based on group name
  const getTierInfo = (name: string) => {
    if (name.includes("Verde")) return { badge: "CORE", color: "#8A9B85" };
    if (name.includes("Roxo") || name.includes("Magenta") || name.includes("Rosa")) 
      return { badge: "PALETA", color: "#9886B3" };
    return { badge: "ESCALA", color: "#FFBA88" };
  };

  const tierInfo = getTierInfo(group.name);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}`,
      }}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          {/* Color preview dots */}
          <div className="flex gap-0.5">
            {group.colors.slice(0, 5).map((c, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full border"
                style={{
                  background: c.hex,
                  borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                }}
              />
            ))}
            {group.colors.length > 5 && (
              <span className="text-[9px] ml-1" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                +{group.colors.length - 5}
              </span>
            )}
          </div>
          
          <span className="text-[11px] font-semibold" style={{ color: isDark ? "#e8e8e6" : "#1a1a1a" }}>
            {group.name}
          </span>
          
          <span
            className="text-[8px] px-1.5 py-0.5 rounded font-bold"
            style={{
              background: isDark ? `${tierInfo.color}20` : `${tierInfo.color}15`,
              color: tierInfo.color,
            }}
          >
            {tierInfo.badge}
          </span>
          
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
          }}>
            {group.colors.length} cores
          </span>
        </div>
        
        {isExpanded ? (
          <ChevronUp className="w-3.5 h-3.5" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }} />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }} />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-2">
            {group.colors.map((color, colorIndex) => (
              <ColorControl
                key={colorIndex}
                color={color}
                onChange={(newHex) => onColorChange(groupIndex, colorIndex, newHex)}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COLOR CONTROL - Individual color picker
// ═══════════════════════════════════════════════════════════════

interface ColorControlProps {
  color: EditableColor;
  onChange: (hex: string) => void;
  isDark: boolean;
}

function ColorControl({ color, onChange, isDark }: ColorControlProps) {
  const [localHex, setLocalHex] = useState(color.hex);

  // Sync with prop changes
  useEffect(() => {
    setLocalHex(color.hex);
  }, [color.hex]);

  const handleChange = (newHex: string) => {
    setLocalHex(newHex);
    onChange(newHex);
  };

  return (
    <div
      className="p-2 rounded-lg border group hover:border-opacity-100 transition-all"
      style={{
        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
      }}
    >
      <div className="flex items-center gap-2">
        {/* Color picker */}
        <div className="relative">
          <input
            type="color"
            value={localHex}
            onChange={(e) => handleChange(e.target.value)}
            className="w-8 h-8 rounded-lg border cursor-pointer"
            style={{
              borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
            }}
            title={`Editar ${color.hex}`}
          />
          {/* Preview overlay */}
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: color.hex,
              opacity: 0.3,
            }}
          />
        </div>

        {/* Color info */}
        <div className="flex-1 min-w-0">
          <div
            className="text-[10px] font-mono font-semibold truncate"
            style={{ color: isDark ? "#e8e8e6" : "#1a1a1a" }}
          >
            {color.hex}
          </div>
          <div
            className="text-[8px] font-mono truncate"
            style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}
          >
            RGB {color.rgb}
          </div>
        </div>
      </div>

      {/* Additional formats (shown on hover) */}
      <div className="mt-1.5 space-y-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <div
          className="text-[8px] font-mono"
          style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}
        >
          HSB {color.hsb}
        </div>
        <div
          className="text-[8px] font-mono"
          style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}
        >
          CMYK {color.cmyk}
        </div>
      </div>
    </div>
  );
}