/**
 * ═══════════════════════════════════════════════════════════════
 * ADAPTA PLATFORM - Theme Context (Compatibility Layer)
 * ═══════════════════════════════════════════════════════════════
 * 
 * Hook compatível com componentes importados que usam tema
 * Integra com o ThemeProvider existente da plataforma
 */

import { useThemeMode } from "../helpers/themeMode";

/**
 * Interface de tokens de tema
 * Fornece cores dinâmicas baseadas no tema atual (dark/light)
 */
export interface ThemeTokens {
  // Textos
  text: string;           // Texto principal
  textMuted: string;      // Texto secundário
  textFaint: string;      // Texto muito claro/sutil
  
  // Backgrounds
  bg: string;             // Background principal
  bgCard: string;         // Background de cards
  
  // Glass morphism
  glass: string;          // Background translúcido
  glassBorder: string;    // Borda glass
  
  // Divisores e linhas
  line: string;           // Linhas divisórias
  border: string;         // Bordas padrão
}

/**
 * Hook customizado de tema
 * Compatível com componentes importados
 */
export function useTheme() {
  const { mode: theme } = useThemeMode();
  const isDark = theme === "dark" || (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Tokens dinâmicos baseados no modo dark/light
  const t: ThemeTokens = isDark ? {
    // DARK MODE - Verde petróleo escuro
    text: "#F0F4F2",                      // neutral-900 - QUASE BRANCO petróleo
    textMuted: "#C8D1CD",                 // neutral-500 - MUITO CLARO petróleo
    textFaint: "rgba(232, 240, 237, 0.35)", // neutral-900 com opacity
    
    bg: "#141A17",                        // neutral-950 - Verde petróleo BEM ESCURO
    bgCard: "#141A17",                    // neutral-950 - Verde petróleo BEM ESCURO
    
    glass: "rgba(255, 255, 255, 0.03)",   // Vidro translúcido
    glassBorder: "rgba(255, 255, 255, 0.08)", // Borda vidro
    
    line: "rgba(255, 255, 255, 0.12)",    // Linhas divisórias
    border: "#657168"                     // neutral-300 - Médio petróleo
  } : {
    // LIGHT MODE - Tons claros
    text: "#1A231D",                      // neutral-900 - Escuro
    textMuted: "#6A8A7A",                 // neutral-500 - Médio
    textFaint: "rgba(26, 35, 29, 0.35)",  // neutral-900 com opacity
    
    bg: "#F7F9F8",                        // neutral-050 - Off-white
    bgCard: "#FAFBFA",                    // neutral-000 - Branco
    
    glass: "rgba(0, 0, 0, 0.02)",         // Vidro translúcido
    glassBorder: "rgba(0, 0, 0, 0.08)",   // Borda vidro
    
    line: "rgba(0, 0, 0, 0.12)",          // Linhas divisórias
    border: "#B5C5BC"                     // neutral-300 - Bordas
  };

  return {
    theme,
    isDark,
    t
  };
}
