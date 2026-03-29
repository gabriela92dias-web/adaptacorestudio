import React, { useState, useEffect } from "react";
import { useBrandStudio } from "../../contexts/brand-context";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { getAllDesignColors, neutralColors } from "../../modules/tools/utils/cartilha-cromatica";

export function ColorControls() {
  const { layers, updateLayersWithHistory } = useBrandStudio();
  const [expandedLayer, setExpandedLayer] = useState<string | null>("fundo");
  const [activePalette, setActivePalette] = useState<"verdeCore" | "colorCore" | "neutrals">("verdeCore");

  // 🛡️ Proteção contra layers undefined
  const safeLayers = layers || {};

  // 🎨 CARTILHA CROMÁTICA ADAPTA - Paleta completa organizada
  const ALL_COLORS = React.useMemo(() => getAllDesignColors(), []);

  // Paletas oficiais da Cartilha Cromática ADAPTA v2026.1
  const PALETTE_TABS = React.useMemo(() => ({
    verdeCore: {
      name: "Verde Core",
      colors: ALL_COLORS.filter(c => c.category === "Verde Core").map(c => ({
        hex: c.value,
        name: c.name,
        category: c.category,
      })),
    },
    colorCore: {
      name: "Color Core",
      colors: ALL_COLORS.filter(c => c.category === "Color Core").map(c => ({
        hex: c.value,
        name: c.name,
        category: c.category,
      })),
    },
    neutrals: {
      name: "Neutrals",
      colors: neutralColors.map(c => ({
        hex: c.value,
        name: c.name,
        category: "Neutrals",
      })),
    },
  }), [ALL_COLORS]);

  const layerNames = {
    fundo: "Hexágono",
    "+": "Símbolo +",
    AD: "Letras AD",
  };

  const handleColorChange = (layerId: string, color: string) => {
    const newLayers = {
      ...safeLayers,
      [layerId]: { ...safeLayers[layerId], color },
    };
    updateLayersWithHistory(newLayers);
  };

  const handleOpacityChange = (layerId: string, opacity: number) => {
    const newLayers = {
      ...safeLayers,
      [layerId]: { ...safeLayers[layerId], opacity },
    };
    updateLayersWithHistory(newLayers);
  };

  const handleVisibilityToggle = (layerId: string) => {
    const newLayers = {
      ...safeLayers,
      [layerId]: { ...safeLayers[layerId], visible: !safeLayers[layerId].visible },
    };
    updateLayersWithHistory(newLayers);
  };

  return (
    <div className="space-y-2">
      {/* Controles por Camada - Accordion */}
      <div className="space-y-2">
        {Object.entries(safeLayers).map(([layerId, state]) => {
          const isExpanded = expandedLayer === layerId;
          
          return (
            <div 
              key={layerId} 
              className={`rounded-lg border-2 transition-all ${
                state.visible 
                  ? "border-border bg-background" 
                  : "border-border/50 bg-muted/30 opacity-60"
              }`}
            >
              {/* Header da Camada - Sempre visível */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVisibilityToggle(layerId);
                    }}
                    className="h-7 w-7 p-0"
                    title={state.visible ? "Ocultar camada" : "Mostrar camada"}
                  >
                    {state.visible ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </Button>
                  <button
                    onClick={() => setExpandedLayer(isExpanded ? null : layerId)}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Label className="text-sm font-medium cursor-pointer">
                      {layerNames[layerId as keyof typeof layerNames] || layerId}
                    </Label>
                    <code className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                      {state.color.toUpperCase()}
                    </code>
                  </button>
                </div>
                <button
                  onClick={() => setExpandedLayer(isExpanded ? null : layerId)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <ChevronDown 
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
              
              {/* Conteúdo expansível */}
              {isExpanded && (
                <div className="px-3 pb-3 space-y-3 border-t border-border/50 pt-3">
                  {/* Abas de Paletas */}
                  <div className="flex gap-1 p-1 bg-muted rounded-lg">
                    {(Object.keys(PALETTE_TABS) as Array<keyof typeof PALETTE_TABS>).map((paletteKey) => (
                      <button
                        key={paletteKey}
                        onClick={() => setActivePalette(paletteKey)}
                        className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-all ${
                          activePalette === paletteKey
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {PALETTE_TABS[paletteKey].name}
                      </button>
                    ))}
                  </div>
                  
                  {/* Paleta específica para esta camada */}
                  <div className="grid grid-cols-8 gap-1">
                    {PALETTE_TABS[activePalette].colors.map((colorOption) => (
                      <button
                        key={colorOption.hex}
                        onClick={() => handleColorChange(layerId, colorOption.hex)}
                        disabled={!state.visible}
                        className={`aspect-square rounded border-2 transition-all ${
                          state.color === colorOption.hex
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-primary/50"
                        } ${!state.visible ? "opacity-40 cursor-not-allowed" : ""}`}
                        style={{ 
                          backgroundColor: colorOption.hex === "transparent" 
                            ? "transparent" 
                            : colorOption.hex,
                          backgroundImage: colorOption.hex === "transparent"
                            ? "repeating-conic-gradient(#e5e5e5 0% 25%, white 0% 50%)"
                            : "none",
                          backgroundSize: colorOption.hex === "transparent" ? "6px 6px" : "auto",
                        }}
                        title={colorOption.name}
                      >
                        <span className="sr-only">{colorOption.name}</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Seletor de cor customizado + Opacidade */}
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={state.color === "transparent" ? "#FFFFFF" : state.color}
                      onChange={(e) => handleColorChange(layerId, e.target.value)}
                      disabled={!state.visible}
                      className="w-9 h-9 rounded border-2 border-border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Escolher cor personalizada"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>Opacidade</span>
                        <span className="font-medium">{Math.round(state.opacity * 100)}%</span>
                      </div>
                      <Slider
                        value={[state.opacity]}
                        onValueChange={([value]) => handleOpacityChange(layerId, value)}
                        disabled={!state.visible}
                        min={0}
                        max={1}
                        step={0.01}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
