/**
 * ═══════════════════════════════════════════════════════════════
 * ADAPTA PLATFORM - Ada FAB (Floating Action Button)
 * ═══════════════════════════════════════════════════════════════
 * 
 * Botão flutuante para invocar a assistente Ada
 * Usado no Dashboard e módulo Tools
 */

import { useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import { BrandAssistant } from "./brand-assistant";
import { useTheme } from "../utils/theme-context";

interface AdaFabProps {
  /**
   * Posição do FAB
   * @default "bottom-right"
   */
  position?: "bottom-right" | "bottom-left";
  
  /**
   * Z-index do FAB
   * @default 40
   */
  zIndex?: number;
}

export function AdaFab({ position = "bottom-right", zIndex = 40 }: AdaFabProps) {
  const { isDark } = useTheme();
  const [isAdaOpen, setIsAdaOpen] = useState(false);

  const positionClasses = position === "bottom-right" 
    ? "bottom-6 right-6" 
    : "bottom-6 left-6";

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsAdaOpen(true)}
        className={`fixed ${positionClasses} group transition-all duration-300 hover:scale-110 active:scale-95`}
        style={{
          zIndex,
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          background: isDark 
            ? "linear-gradient(135deg, #6A8A7A 0%, #8FA89B 100%)"
            : "linear-gradient(135deg, #445A4F 0%, #6A8A7A 100%)",
          boxShadow: isDark
            ? "0 8px 24px rgba(106, 138, 122, 0.3), 0 2px 8px rgba(0, 0, 0, 0.4)"
            : "0 8px 24px rgba(106, 138, 122, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)",
          border: "none",
          cursor: "pointer"
        }}
        title="Abrir Ada - Assistente de Marca"
        aria-label="Abrir assistente Ada"
      >
        {/* Icon Container */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Bot 
            className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" 
          />
          
          {/* Sparkle Indicator */}
          <div 
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #8FA89B 0%, #6A8A7A 100%)",
              boxShadow: "0 2px 8px rgba(106, 138, 122, 0.4)"
            }}
          >
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>

          {/* Pulse Ring */}
          <div 
            className="absolute inset-0 rounded-[16px] animate-pulse"
            style={{
              background: "transparent",
              border: "2px solid rgba(143, 168, 155, 0.3)",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
            }}
          />
        </div>

        {/* Tooltip */}
        <div 
          className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            backgroundColor: isDark ? "rgba(31, 42, 35, 0.95)" : "rgba(250, 251, 250, 0.95)",
            color: isDark ? "#F0F4F2" : "#1A231D",
            border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
          }}
        >
          Pergunte à Ada
          <div 
            className="absolute top-full right-4 w-0 h-0"
            style={{
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderTop: `4px solid ${isDark ? "rgba(31, 42, 35, 0.95)" : "rgba(250, 251, 250, 0.95)"}`
            }}
          />
        </div>
      </button>

      {/* Brand Assistant Panel */}
      <BrandAssistant isOpen={isAdaOpen} onClose={() => setIsAdaOpen(false)} />
    </>
  );
}