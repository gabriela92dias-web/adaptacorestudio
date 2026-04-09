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

export interface ColorGroup {
  id: string;
  name: string;
  description: string;
  colors: ColorEntry[]; // máx. 5 itens: índice 0=tom100, 4=tom500
}

// ── IDs dos grupos por categoria ──────────────────────────────

const VERDE_GROUP_IDS: string[] = [
  "verde-core",
  "verde-meio",
];

const COLOR_GROUP_IDS: string[] = [
  "success",
  "error",
  "warning",
  "info",
];

const NEUTRAL_GROUP_IDS: string[] = [
  "neutrals-light",
  "neutrals-dark",
];

// ── Paleta oficial ColdFlora ──────────────────────────────────

export const colorPalette: ColorGroup[] = [
  // ── Verde Core (escala principal da marca) ────────────────
  {
    id: "verde-core",
    name: "Verde Core",
    description: "Escala principal da identidade Adapta",
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

    case "all":
    default:
      return colorPalette;
  }
}
