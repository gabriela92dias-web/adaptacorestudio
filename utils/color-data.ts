/**
 * ═══════════════════════════════════════════════════════════════
 * ADAPTA COLOR DATA - Paleta Institucional ColdFlora
 * ═══════════════════════════════════════════════════════════════
 *
 * Extraída diretamente do design system (base.css) do CoreStudio.
 * Cada grupo tem 5 tons (100→500), do mais claro ao mais escuro.
 */

export interface ColorEntry {
  hex: string;
  name: string;
}

export type ColorRole = "ui" | "campaign";

export interface ColorGroup {
  id: string;
  name: string;
  description: string;
  roles: ColorRole[]; // Define se a cor é para interface (ColdFlora restrito) e/ou campanhas livrres
  colors: ColorEntry[]; // máx. 5 itens: índice 0=tom100, 4=tom500
}

// ── Funções Utilitárias Avançadas (Contraste WCAG) ─────────────

// Formula para luminance relativa do sRGB
function getLuminance(hex: string): number {
  const rgb = hex.replace("#", "");
  const r = parseInt(rgb.substring(0, 2), 16) / 255;
  const g = parseInt(rgb.substring(2, 4), 16) / 255;
  const b = parseInt(rgb.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/** Calcula a taxa de contraste (1 até 21) entre dois códigos HEX */
export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (lightest + 0.05) / (darkest + 0.05);
}

// ── IDs dos grupos por categoria ──────────────────────────────

const VERDE_GROUP_IDS: string[] = ["verde-core", "verde-meio"];
const COLOR_GROUP_IDS: string[] = ["success", "error", "warning", "info"];
const NEUTRAL_GROUP_IDS: string[] = ["neutrals-light", "neutrals-dark"];

// ── Paleta oficial ColdFlora ──────────────────────────────────

export const colorPalette: ColorGroup[] = [
  // ── Verde Core (escala principal da marca) ────────────────
  {
    id: "verde-core",
    name: "Verde Core",
    description: "Escala principal da identidade Adapta",
    roles: ["campaign", "ui"], // Pode ser ui se usado com cuidado
    colors: [
      { hex: "#DCE4D6", name: "Verde 100" },
      { hex: "#B4C5AD", name: "Verde 200" },
      { hex: "#889B84", name: "Verde 300" },
      { hex: "#566958", name: "Verde 400" },
      { hex: "#22382E", name: "Verde 500" },
    ],
  },

  // ── Verde Surface (fundos e containers) ───────────────────
  {
    id: "verde-meio",
    name: "Verde Surface",
    description: "Tons de superfície e fundo do sistema",
    roles: ["ui"], // Super exclusivo de UI
    colors: [
      { hex: "#F7F9F2", name: "Surface 100" },
      { hex: "#EBEFE8", name: "Surface 200" },
      { hex: "#C8D5C2", name: "Surface 300" },
      { hex: "#9FB499", name: "Surface 400" },
      { hex: "#6F826D", name: "Surface 500" },
    ],
  },

  // ── Success (verde semântico) ──────────────────────────────
  {
    id: "success",
    name: "Success",
    description: "Cor de sucesso e confirmação",
    roles: ["ui", "campaign"],
    colors: [
      { hex: "#D1E8B5", name: "Success 100" },
      { hex: "#ADCC71", name: "Success 200" },
      { hex: "#8DB84D", name: "Success 300" },
      { hex: "#5A8A2E", name: "Success 400" },
      { hex: "#2A4F1A", name: "Success 500" },
    ],
  },

  // ── Error (ter semântico) ──────────────────────────────────
  {
    id: "error",
    name: "Error",
    description: "Cor de erro e alerta crítico",
    roles: ["ui", "campaign"],
    colors: [
      { hex: "#FFB7AB", name: "Error 100" },
      { hex: "#F48E72", name: "Error 200" },
      { hex: "#E06445", name: "Error 300" },
      { hex: "#B84020", name: "Error 400" },
      { hex: "#6B2A14", name: "Error 500" },
    ],
  },

  // ── Warning (amarelo semântico) ────────────────────────────
  {
    id: "warning",
    name: "Warning",
    description: "Cor de atenção e alerta moderado",
    roles: ["ui", "campaign"],
    colors: [
      { hex: "#FFE1AB", name: "Warning 100" },
      { hex: "#F2C370", name: "Warning 200" },
      { hex: "#D9A040", name: "Warning 300" },
      { hex: "#A87A1E", name: "Warning 400" },
      { hex: "#614210", name: "Warning 500" },
    ],
  },

  // ── Info (azul lilás semântico) ───────────────────────────
  {
    id: "info",
    name: "Info",
    description: "Cor informativa e de destaque suave",
    roles: ["ui", "campaign"],
    colors: [
      { hex: "#CDD0F9", name: "Info 100" },
      { hex: "#B5B7F2", name: "Info 200" },
      { hex: "#9EA0ED", name: "Info 300" },
      { hex: "#8385D8", name: "Info 400" },
      { hex: "#2B2D6B", name: "Info 500" },
    ],
  },

  // ── Neutrals Light ────────────────────────────────────────
  {
    id: "neutrals-light",
    name: "Neutros Claros",
    description: "Escala neutra para modo claro",
    roles: ["ui", "campaign"],
    colors: [
      { hex: "#F7F9F2", name: "Neutro 100" },
      { hex: "#EBEFE8", name: "Neutro 200" },
      { hex: "#DCE4D6", name: "Neutro 300" },
      { hex: "#C8D5C2", name: "Neutro 400" },
      { hex: "#B4C5AD", name: "Neutro 500" },
    ],
  },

  // ── Neutrals Dark ─────────────────────────────────────────
  {
    id: "neutrals-dark",
    name: "Neutros Escuros",
    description: "Escala neutra para modo escuro",
    roles: ["ui", "campaign"],
    colors: [
      { hex: "#2a4237", name: "Dark 100" },
      { hex: "#1B2C24", name: "Dark 200" },
      { hex: "#121B17", name: "Dark 300" },
      { hex: "#0E1612", name: "Dark 400" },
      { hex: "#0A100D", name: "Dark 500" },
    ],
  },
];

// ── Filtros ───────────────────────────────────────────────────

export function getColorsByRole(role: ColorRole): ColorGroup[] {
  return colorPalette.filter((g) => g.roles.includes(role));
}

export function filterForFeature(feature: string): ColorGroup[] {
  switch (feature) {
    case "verde":
      return colorPalette.filter((g) => VERDE_GROUP_IDS.includes(g.id));
    case "color":
      return colorPalette.filter((g) => COLOR_GROUP_IDS.includes(g.id));
    case "both":
      return colorPalette.filter(
        (g) => VERDE_GROUP_IDS.includes(g.id) || COLOR_GROUP_IDS.includes(g.id)
      );
    case "neutrals":
      return colorPalette.filter((g) => NEUTRAL_GROUP_IDS.includes(g.id));
    case "verde-neutrals":
      return colorPalette.filter(
        (g) => VERDE_GROUP_IDS.includes(g.id) || NEUTRAL_GROUP_IDS.includes(g.id)
      );
    case "ui-only":
      return getColorsByRole("ui");
    case "all":
    default:
      return colorPalette;
  }
}

// ── O Cérebro do Diretor Criativo (Inteligência da Roda V8) ────

// Flattened array com todas as cores para busca fácil do Anti-Erro
export const allColorsFlat: ColorEntry[] = colorPalette.flatMap(g => g.colors);

/**
 * Motor Auto-Fix: Tenta encontrar a cor mais acessível (WCAG >= 4.5:1) 
 * dentro da própria família da cor alvo. Caso não exista um tom seguro, 
 * faz fallback inteligente para tons neutros extremos baseados no fundo.
 */
export function findClosestAccessibleColor(baseHex: string, targetHex: string): string {
  // 1. Se já está seguro, mantém. (O Toque Invisível)
  if (getContrastRatio(baseHex, targetHex) >= 4.5) {
    return targetHex; 
  }

  // 2. Tentar encontrar uma variante segura dentro do mesmo grupo de cor (Ex: Era Verde 200, cai pro Verde 500)
  const group = colorPalette.find(g => g.colors.some(c => c.hex.toLowerCase() === targetHex.toLowerCase()));
  
  if (group) {
     // Buscamos a cor que passa no teste, priorizando a que tiver o melhor contraste possível
     let bestColor = targetHex;
     let bestContrast = getContrastRatio(baseHex, targetHex);
     
     for (const c of group.colors) {
        const ratio = getContrastRatio(baseHex, c.hex);
        if (ratio >= 4.5 && ratio > bestContrast) {
           bestContrast = ratio;
           bestColor = c.hex;
        }
     }
     if (bestContrast >= 4.5) return bestColor;
  }
  
  // 3. Fallback de Segurança (Se tentou usar Rosa Ciano num Fundo Amarelo, recua pra Neutros)
  const baseLuminance = getLuminance(baseHex);
  // Se o fundo for claro (luminância alta), precisamos de texto bem escuro
  if (baseLuminance > 0.5) {
    return "#0A100D"; // Dark 500 (Neutro Escuro)
  } else {
    // Se o fundo for escuro, precisamos de texto muito claro
    return "#F7F9F2"; // Surface 100 (Neutro Claro)
  }
}

/**
 * Atribui 'Roles' (Funções) semânticas de campanha para um arranjo de cores.
 * Recebe o array de cores geradas pela roda (Base, Harmonia 1, Harmonia 2) e devolve um esquema de design.
 */
export function getCampaignRoles(selectedColors: string[]): { background: string, accent: string, text: string } {
   // A cor que o usuário clicou na roda se torna a âncora/fundo principal da campanha
   const background = selectedColors[0] || "#F7F9F2";
   
   // A segunda cor da roda se torna o detalhe vibrante/Call-to-Action
   const accent = selectedColors[1] || background; 
   
   // A terceira cor (ou a segunda, caso seja complementares duplas) deveria ser texto/apoio
   // Damos fallback pro accent caso só tenha 2 cores selecionadas.
   const rawText = selectedColors[2] || accent;
   
   // Aqui mora a inteligência: O texto PRECISA ser legível no Background.
   const text = findClosestAccessibleColor(background, rawText);
   
   // Garantia extra: Se o Accent (botão) não tiver nada de destaque no fundo, podemos ajustar também?
   // Normalmente o Destaque não precisa ter WCAG 4.5 contra o fundo caso seja elemento gráfico, mas é bom alertar (faremos isso na UI).
   
   return { background, accent, text };
}
