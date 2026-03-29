/**
 * ═══════════════════════════════════════════════════════════════
 * ADAPTA PLATFORM - FAB Menu (Speed Dial)
 * ═══════════════════════════════════════════════════════════════
 * 
 * Menu flutuante principal que expande para mostrar ferramentas:
 * - Ada Assistant (IA de marca)
 * - Mascote Builder
 * - Outras ferramentas futuras
 */

import { useState, useRef, useEffect } from "react";
import { Bot, Sparkles, Zap, X, Palette, Eye, Globe } from "lucide-react";
import { BrandAssistant } from "./brand-assistant";
import { GraphicAnalyzer } from "./graphic-analyzer";
import { ColorPaletteEditor } from "./color-palette-editor";
import { ColorWheel } from "./color-wheel";
import { MascotWidget } from "../../imports/MascotWidget";
import { useTheme } from "../utils/theme-context";
import { useLanguage } from "../contexts/language-context";

interface FabMenuProps {
  /**
   * Posição do menu
   * @default "bottom-right"
   */
  position?: "bottom-right" | "bottom-left";
  
  /**
   * Z-index do menu
   * @default 50
   */
  zIndex?: number;
}

interface FabOption {
  id: string;
  label: { pt: string; en: string };
  icon: React.ReactNode;
  color: string;
  gradientLight: string;
  gradientDark: string;
  onClick: () => void;
}

export function FabMenu({ position = "bottom-right", zIndex = 50 }: FabMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdaOpen, setIsAdaOpen] = useState(false);
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);
  const [isMascotOpen, setIsMascotOpen] = useState(false);
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const [isColorWheelOpen, setIsColorWheelOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isDark = theme === "dark";

  // Click outside to close
  useEffect(() => {
    if (!isExpanded) return;
    
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    }
    
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const positionClasses = position === "bottom-right" 
    ? "bottom-6 right-6" 
    : "bottom-6 left-6";

  const options: FabOption[] = [
    {
      id: "ada",
      label: { pt: "Ada Assistant", en: "Ada Assistant" },
      icon: <Bot className="w-5 h-5" />,
      color: "neutral-400",
      gradientLight: "linear-gradient(135deg, var(--neutral-600) 0%, var(--neutral-400) 100%)",
      gradientDark: "linear-gradient(135deg, var(--neutral-400) 0%, var(--neutral-300) 100%)",
      onClick: () => {
        setIsAdaOpen(true);
        setIsExpanded(false);
      }
    },
    {
      id: "analyzer",
      label: { pt: "Análise Gráfica", en: "Graphic Analysis" },
      icon: <Eye className="w-5 h-5" />,
      color: "neutral-400",
      gradientLight: "linear-gradient(135deg, var(--neutral-600) 0%, var(--neutral-400) 100%)",
      gradientDark: "linear-gradient(135deg, var(--neutral-400) 0%, var(--neutral-300) 100%)",
      onClick: () => {
        setIsAnalyzerOpen(true);
        setIsExpanded(false);
      }
    },
    {
      id: "mascot",
      label: { pt: "Mascote Builder", en: "Mascot Builder" },
      icon: <Palette className="w-5 h-5" />,
      color: "neutral-400",
      gradientLight: "linear-gradient(135deg, var(--neutral-600) 0%, var(--neutral-400) 100%)",
      gradientDark: "linear-gradient(135deg, var(--neutral-400) 0%, var(--neutral-300) 100%)",
      onClick: () => {
        setIsMascotOpen(true);
        setIsExpanded(false);
      }
    },
    {
      id: "color-palette",
      label: { pt: "Editor de Paleta de Cores", en: "Color Palette Editor" },
      icon: <Palette className="w-5 h-5" />,
      color: "neutral-400",
      gradientLight: "linear-gradient(135deg, var(--neutral-600) 0%, var(--neutral-400) 100%)",
      gradientDark: "linear-gradient(135deg, var(--neutral-400) 0%, var(--neutral-300) 100%)",
      onClick: () => {
        setIsColorPaletteOpen(true);
        setIsExpanded(false);
      }
    },
    {
      id: "color-wheel",
      label: { pt: "Roda de Cores", en: "Color Wheel" },
      icon: <Globe className="w-5 h-5" />,
      color: "neutral-400",
      gradientLight: "linear-gradient(135deg, var(--neutral-600) 0%, var(--neutral-400) 100%)",
      gradientDark: "linear-gradient(135deg, var(--neutral-400) 0%, var(--neutral-300) 100%)",
      onClick: () => {
        setIsColorWheelOpen(true);
        setIsExpanded(false);
      }
    },
  ];

  return (
    <>
      {/* FAB Menu Container */}
      <div 
        ref={menuRef}
        className={`fixed ${positionClasses} flex flex-col-reverse items-end gap-3`}
        style={{ zIndex }}
      >
        {/* Expanded Options */}
        {isExpanded && (
          <div className="flex flex-col-reverse items-end gap-3 mb-2">
            {options.map((option, index) => (
              <div
                key={option.id}
                className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationDuration: "200ms",
                  animationFillMode: "both"
                }}
              >
                {/* Label */}
                <div
                  className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg bg-card/95 text-foreground border border-border backdrop-blur-md"
                >
                  {language === "pt" ? option.label.pt : option.label.en}
                </div>

                {/* Option Button */}
                <button
                  onClick={option.onClick}
                  className="group transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center shrink-0 text-white"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: isDark ? option.gradientDark : option.gradientLight,
                    boxShadow: `0 4px 16px hsl(var(--${option.color}) / 0.3)`,
                    border: "none",
                    cursor: "pointer"
                  }}
                  title={language === "pt" ? option.label.pt : option.label.en}
                  aria-label={language === "pt" ? option.label.pt : option.label.en}
                >
                  {option.icon}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main FAB Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group transition-all duration-300 hover:scale-110 active:scale-95 border-2 text-white shadow-lg"
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "18px",
            background: isDark 
              ? "linear-gradient(135deg, var(--neutral-700) 0%, var(--neutral-600) 100%)"
              : "linear-gradient(135deg, var(--neutral-500) 0%, var(--neutral-400) 100%)",
            borderColor: isDark ? "hsl(var(--border) / 0.1)" : "hsl(var(--background) / 0.3)",
            cursor: "pointer"
          }}
          title="Ferramentas Rápidas"
          aria-label="Menu de ferramentas"
          aria-expanded={isExpanded}
        >
          {/* Icon Container with rotation */}
          <div 
            className="relative w-full h-full flex items-center justify-center transition-transform duration-300 text-foreground"
            style={{
              transform: isExpanded ? "rotate(45deg)" : "rotate(0deg)"
            }}
          >
            {isExpanded ? (
              <X className="w-7 h-7" />
            ) : (
              <Zap className="w-7 h-7" />
            )}
          </div>

          {/* Badge Indicator - Shows number of tools */}
          {!isExpanded && (
            <div 
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-background"
              style={{
                background: "linear-gradient(135deg, var(--neutral-500) 0%, var(--neutral-400) 100%)"
              }}
            >
              {options.length}
            </div>
          )}

          {/* Pulse Ring when collapsed */}
          {!isExpanded && (
            <div 
              className="absolute inset-0 rounded-[18px] animate-pulse border-2 border-foreground/10"
              style={{
                background: "transparent",
                animation: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite"
              }}
            />
          )}
        </button>

        {/* Backdrop overlay when expanded */}
        {isExpanded && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] animate-in fade-in"
            style={{ zIndex: -1 }}
            onClick={() => setIsExpanded(false)}
          />
        )}
      </div>

      {/* Modals/Panels */}
      <BrandAssistant isOpen={isAdaOpen} onClose={() => setIsAdaOpen(false)} />
      
      <GraphicAnalyzer isOpen={isAnalyzerOpen} onClose={() => setIsAnalyzerOpen(false)} />
      
      <ColorPaletteEditor isOpen={isColorPaletteOpen} onClose={() => setIsColorPaletteOpen(false)} />
      
      <ColorWheel isOpen={isColorWheelOpen} onClose={() => setIsColorWheelOpen(false)} />
      
      {/* Mascot Widget - Rendered when opened */}
      {isMascotOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="pointer-events-auto">
            <MascotWidget 
              position={position}
              size={80}
              initialViewMode="sidebar"
              zIndex={60}
            />
          </div>
          {/* Close overlay */}
          <div 
            className="fixed inset-0 pointer-events-auto"
            onClick={() => setIsMascotOpen(false)}
            style={{ zIndex: 55 }}
          />
        </div>
      )}
    </>
  );
}

// Helper function to convert hex to RGB values
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "0, 0, 0";
}