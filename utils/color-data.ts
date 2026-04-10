/**
 * ═══════════════════════════════════════════════════════════════
 * ADAPTA COLOR DATA - Cartilha Cromática Oficial v2026.2
 * ═══════════════════════════════════════════════════════════════
 *
 * Fonte única de verdade para Roda Cromática, Gradientes e demais
 * ferramentas de design do CoreStudio.
 *
 * 39 cores — 5 famílias:
 *   - Neutrals (15): Tons esverdeados neutros
 *   - OG Hybrid Blend (8): Identidade verde institucional
 *   - Linalool Sky (8): Espectro roxo-azul (Índica)
 *   - Myrcene Soul (8): Espectro rosa-laranja-amarelo (Sativa)
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
  roles: ColorRole[];
  colors: ColorEntry[];
}

// ── Funções Utilitárias Avançadas (Contraste WCAG) ─────────────

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

const VERDE_GROUP_IDS: string[] = ["og-hybrid-blend"];
const COLOR_GROUP_IDS: string[] = ["linalool-sky", "myrcene-soul"];
const NEUTRAL_GROUP_IDS: string[] = ["neutrals-light", "neutrals-dark"];

// ── Paleta Oficial Adapta v2026.2 ────────────────────────────

export const colorPalette: ColorGroup[] = [

  // ── OG Hybrid Blend — Identidade Principal Verde ──────────
  {
    id: "og-hybrid-blend",
    name: "OG Hybrid Blend",
    description: "A identidade pura da marca — estabilidade institucional, frescor profundo e raízes da terra",
    roles: ["campaign", "ui"],
    colors: [
      { hex: "#F2F8EA", name: "Olive Haze" },
      { hex: "#E1EDD5", name: "Crystal Dew" },
      { hex: "#CFE3C6", name: "Matcha Breeze" },
      { hex: "#ABCEB0", name: "Crisp Sap" },
      { hex: "#85B99B", name: "Sour Leaf" },
      { hex: "#619B7F", name: "Herbal Diesel" },
      { hex: "#3B6C5A", name: "Pine Extract" },
      { hex: "#1B4235", name: "Deep Canopy" },
    ],
  },

  // ── Linalool Sky — Espectro Roxo-Azul (Índica) ───────────
  {
    id: "linalool-sky",
    name: "Linalool Sky",
    description: "Espectro de roxos e azuis — sofisticação, profundidade e confiança",
    roles: ["campaign"],
    colors: [
      { hex: "#FCF5FF", name: "Milky Mist" },
      { hex: "#E2EFFF", name: "Glacial Extract" },
      { hex: "#FBE0FF", name: "Sweet Trichome" },
      { hex: "#E4DDFA", name: "Lilac Frost" },
      { hex: "#9687B2", name: "Lavender Cloud" },
      { hex: "#83639B", name: "Amethyst Smoke" },
      { hex: "#704085", name: "Plum Vapor" },
      { hex: "#483D79", name: "Indigo Resin" },
    ],
  },

  // ── Myrcene Soul — Espectro Rosa-Laranja-Amarelo (Sativa) ─
  {
    id: "myrcene-soul",
    name: "Myrcene Soul",
    description: "Espectro de rosas, laranjas e amarelos — calor, energia e vitalidade",
    roles: ["campaign"],
    colors: [
      { hex: "#FFF5F5", name: "Terpene Sugar" },
      { hex: "#FFFEE3", name: "Golden Kief" },
      { hex: "#FFE4C1", name: "Papaya Daze" },
      { hex: "#F8E5A8", name: "Tropical Rush" },
      { hex: "#FBDBDB", name: "Pink Vapor" },
      { hex: "#F394A7", name: "Berry Infusion" },
      { hex: "#F37A63", name: "Sunset Nectar" },
      { hex: "#AF4F72", name: "Cherry Terpene" },
    ],
  },

  // ── Neutrals Claros — Sistema de UI (modo claro) ──────────
  {
    id: "neutrals-light",
    name: "Neutros Claros",
    description: "Escala de neutros esverdeados para modo claro",
    roles: ["ui", "campaign"],
    colors: [
      { hex: "#FAFBFA", name: "Sage Mist" },
      { hex: "#F7F9F8", name: "Hemp Canvas" },
      { hex: "#EDF1EF", name: "Sage Whisper" },
      { hex: "#D5E2D5", name: "Leaf Frost" },
      { hex: "#B5C5BC", name: "Forest Dew" },
      { hex: "#8FA89B", name: "Green Smoke" },
      { hex: "#6A8A7A", name: "Emerald Haze" },
      { hex: "#455A4F", name: "Deep Pine" },
    ],
  },

  // ── Neutrals Escuros — Sistema de UI (modo escuro) ────────
  {
    id: "neutrals-dark",
    name: "Neutros Escuros",
    description: "Escala de neutros esverdeados para modo escuro",
    roles: ["ui", "campaign"],
    colors: [
      { hex: "#2E3E34", name: "Forest Shadow" },
      { hex: "#1F2A23", name: "Midnight Garden" },
      { hex: "#1A231D", name: "Dark Forest" },
      { hex: "#141A17", name: "Black Earth" },
      { hex: "#0F1411", name: "Deep Shadow" },
      { hex: "#0A0D0B", name: "Void" },
      { hex: "#000000", name: "Pure Black" },
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

// ── Flattened para buscas rápidas ─────────────────────────────
export const allColorsFlat: ColorEntry[] = colorPalette.flatMap((g) => g.colors);

/**
 * Motor Auto-Fix WCAG: Encontra a cor mais acessível (≥ 4.5:1)
 * dentro da família da cor alvo. Fallback para neutros extremos.
 */
export function findClosestAccessibleColor(baseHex: string, targetHex: string): string {
  if (getContrastRatio(baseHex, targetHex) >= 4.5) {
    return targetHex;
  }

  const group = colorPalette.find((g) =>
    g.colors.some((c) => c.hex.toLowerCase() === targetHex.toLowerCase())
  );

  if (group) {
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

  // Fallback: neutros extremos baseados na luminância do fundo
  const baseLuminance = getLuminance(baseHex);
  return baseLuminance > 0.5
    ? "#141A17" // Black Earth (neutro escuro)
    : "#FAFBFA"; // Sage Mist (neutro claro)
}

/**
 * Atribui 'Roles' semânticas de campanha para um arranjo de cores.
 * Recebe as cores geradas pela roda (base, harmonia1, harmonia2).
 */
export function getCampaignRoles(
  selectedColors: string[]
): { background: string; accent: string; text: string } {
  const background = selectedColors[0] || "#F7F9F8";
  const accent = selectedColors[1] || background;
  const rawText = selectedColors[2] || accent;
  const text = findClosestAccessibleColor(background, rawText);

  return { background, accent, text };
}
