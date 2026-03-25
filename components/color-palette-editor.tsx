/**
 * ═══════════════════════════════════════════════════════════════
 * ADAPTA PLATFORM - Color Palette Editor
 * ═══════════════════════════════════════════════════════════════
 * 
 * Editor de paleta de cores com funcionalidades:
 * - Edição de cores HEX com conversão automática RGB/HSB/CMYK
 * - Grupos colapsáveis de cores
 * - Import/Export de paletas JSON
 * - Preview ao vivo
 * - Persistência em localStorage
 */

import { useState, useCallback, useEffect } from "react";
import { Palette, RotateCcw, Download, Upload, X, ChevronDown, ChevronUp } from "lucide-react";
import { colorPalette, type ColorGroup, type ColorEntry } from "../utils/color-data";
import { Button } from "./ui/button";
import { toast } from "sonner";

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

interface ColorPaletteEditorProps {
  isOpen: boolean;
  onClose: () => void;
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

function hexToRgbString(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `${r}, ${g}, ${b}`;
}

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

export function ColorPaletteEditor({ isOpen, onClose }: ColorPaletteEditorProps) {
  const [palette, setPalette] = useState<EditableColorGroup[]>(() => {
    const saved = localStorage.getItem("adapta-custom-palette");
    if (saved) return JSON.parse(saved);
    return colorPalette.map(g => ({
      name: g.name,
      hueRange: g.hueRange,
      colors: g.colors.map(c => ({ ...c })),
    }));
  });

  useEffect(() => {
    localStorage.setItem("adapta-custom-palette", JSON.stringify(palette));
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
    const defaultPalette = colorPalette.map(g => ({
      name: g.name,
      hueRange: g.hueRange,
      colors: g.colors.map(c => ({ ...c })),
    }));
    
    setPalette(defaultPalette);
    localStorage.removeItem("adapta-custom-palette");
    window.dispatchEvent(new CustomEvent("palette-updated", { detail: defaultPalette }));
    toast.success("Paleta resetada para o padrão");
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
    toast.success("Paleta exportada com sucesso");
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
          toast.success("Paleta importada com sucesso");
        } catch (err) {
          toast.error("Erro ao importar paleta: arquivo inválido");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const totalColors = palette.reduce((sum, g) => sum + g.colors.length, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-[520px] max-h-[85vh] rounded-xl border border-border bg-background shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-neutral-900/50 rounded-t-xl shrink-0">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-semibold">Editor de Paleta de Cores</h3>
            <div className="px-2 py-0.5 rounded text-[9px] font-medium bg-neutral-800 text-neutral-400 border border-neutral-700">
              {totalColors} CORES
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Color groups - scrollable */}
        <div className="overflow-y-auto flex-1 p-3 space-y-2">
          {palette.map((group, groupIndex) => (
            <ColorGroupSection
              key={groupIndex}
              group={group}
              groupIndex={groupIndex}
              onColorChange={updateColor}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-3 border-t border-border bg-neutral-900/30 rounded-b-xl shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
            className="flex-1 h-8 text-xs gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={importPalette}
            className="flex-1 h-8 text-xs gap-1.5"
          >
            <Upload className="w-3 h-3" />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportPalette}
            className="flex-1 h-8 text-xs gap-1.5"
          >
            <Download className="w-3 h-3" />
            Export
          </Button>
        </div>

        {/* Preview banner */}
        <div
          className="px-3 py-1.5 text-center text-[9px] font-semibold text-white"
          style={{
            background: `linear-gradient(90deg, ${palette.flatMap(g => g.colors.slice(0, 2).map(c => c.hex)).join(", ")})`,
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          PREVIEW AO VIVO • {palette.length} FAMÍLIAS
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// COLOR GROUP SECTION
// ═══════════════════════════════════════════════════════════════

interface ColorGroupSectionProps {
  group: EditableColorGroup;
  groupIndex: number;
  onColorChange: (groupIndex: number, colorIndex: number, newHex: string) => void;
}

function ColorGroupSection({ group, groupIndex, onColorChange }: ColorGroupSectionProps) {
  const [isExpanded, setIsExpanded] = useState(groupIndex === 0);

  const getTierBadge = (name: string) => {
    // Verde Core
    if (["Candy", "Lemon", "Ventura"].includes(name)) return "VERDE";
    // Color Core
    if (["Energia", "Alegria", "Segurança"].includes(name)) return "COLOR";
    // Neutrals
    if (["Luz", "Alma", "Firmeza"].includes(name)) return "NEUTRO";
    return "OUTRO";
  };

  const tierBadge = getTierBadge(group.name);

  return (
    <div className="rounded-lg border border-border bg-neutral-900/30 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-neutral-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {/* Color preview dots */}
          <div className="flex gap-0.5">
            {group.colors.slice(0, 5).map((c, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full border border-neutral-700"
                style={{ background: c.hex }}
              />
            ))}
            {group.colors.length > 5 && (
              <span className="text-[9px] ml-1 text-neutral-500">
                +{group.colors.length - 5}
              </span>
            )}
          </div>
          
          <span className="text-[11px] font-semibold">{group.name}</span>
          
          <span className="text-[8px] px-1.5 py-0.5 rounded font-bold bg-neutral-800 text-neutral-400 border border-neutral-700">
            {tierBadge}
          </span>
          
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800/50 text-neutral-500">
            {group.colors.length} cores
          </span>
        </div>
        
        {isExpanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-neutral-500" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
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
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COLOR CONTROL
// ═══════════════════════════════════════════════════════════════

interface ColorControlProps {
  color: EditableColor;
  onChange: (hex: string) => void;
}

function ColorControl({ color, onChange }: ColorControlProps) {
  const [localHex, setLocalHex] = useState(color.hex);

  useEffect(() => {
    setLocalHex(color.hex);
  }, [color.hex]);

  const handleChange = (newHex: string) => {
    setLocalHex(newHex);
    onChange(newHex);
  };

  return (
    <div className="p-2 rounded border border-neutral-700 bg-neutral-800/30 group hover:border-neutral-600 transition-all">
      <div className="flex items-center gap-2">
        {/* Color picker */}
        <div className="relative">
          <input
            type="color"
            value={localHex}
            onChange={(e) => handleChange(e.target.value)}
            className="w-7 h-7 rounded border border-neutral-700 cursor-pointer"
            title={`Editar ${color.hex}`}
          />
        </div>

        {/* Color info */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono font-semibold truncate">
            {color.hex}
          </div>
          <div className="text-[8px] font-mono truncate text-neutral-500">
            RGB {color.rgb}
          </div>
        </div>
      </div>

      {/* Additional formats (shown on hover) */}
      <div className="mt-1.5 space-y-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="text-[8px] font-mono text-neutral-600">
          HSB {color.hsb}
        </div>
        <div className="text-[8px] font-mono text-neutral-600">
          CMYK {color.cmyk}
        </div>
      </div>
    </div>
  );
}