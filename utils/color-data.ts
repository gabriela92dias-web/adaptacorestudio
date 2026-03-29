/**
 * ═══════════════════════════════════════════════════════════════
 * ADAPTA COLOR DATA - Paleta Institucional Oficial
 * ═══════════════════════════════════════════════════════════════
 * 
 * 45 cores oficiais - 9 famílias cromáticas
 * Versão: 2026.1 DEFINITIVA
 * Data: 2026-03-11
 */

export interface ColorEntry {
  hex: string;
  name: string;
}

export interface ColorGroup {
  id: string;
  name: string;
  description: string;
  colors: ColorEntry[];
}

/**
 * Paleta de cores oficial ADAPTA
 * 45 cores organizadas em 9 famílias
 */
export const colorPalette: ColorGroup[] = [
  {
    id: "neutrals",
    name: "Neutrals",
    description: "Sistema neutro esverdeado (15 tons)",
    colors: [
      { hex: "#FAFBFA", name: "Sage Mist" },
      { hex: "#F7F9F8", name: "Hemp Canvas" },
      { hex: "#EDF1EF", name: "Sage Whisper" },
      { hex: "#D5E2D5", name: "Leaf Frost" },
      { hex: "#B5C5BC", name: "Forest Dew" },
      { hex: "#8FA89B", name: "Green Smoke" },
      { hex: "#6A8A7A", name: "Emerald Haze" },
      { hex: "#455A4F", name: "Deep Pine" },
      { hex: "#2E3E34", name: "Forest Shadow" },
      { hex: "#1F2A23", name: "Midnight Garden" },
      { hex: "#1A231D", name: "Dark Forest" },
      { hex: "#141A17", name: "Black Earth" },
      { hex: "#0F1411", name: "Deep Shadow" },
      { hex: "#0A0D0B", name: "Void" },
      { hex: "#000000", name: "Pure Black" },
    ],
  },
  {
    id: "candy",
    name: "Verde Candy",
    description: "Verde limão pastel nebuloso (5 tons)",
    colors: [
      { hex: "#F7FBF0", name: "Marshmallow" },
      { hex: "#EFF7E0", name: "Açúcar" },
      { hex: "#E5F2D0", name: "Baunilha" },
      { hex: "#DBEDC2", name: "Pistache" },
      { hex: "#D1E8B4", name: "Citrus Ice" },
    ],
  },
  {
    id: "lemon",
    name: "Verde Lemon",
    description: "Verde limão suave, frescor cítrico (4 tons)",
    colors: [
      { hex: "#F5F9F2", name: "Neblina" },
      { hex: "#EAF3E5", name: "Vapor" },
      { hex: "#DFEDD8", name: "Citrus" },
      { hex: "#D3E7CA", name: "Zeste" },
    ],
  },
  {
    id: "ventura",
    name: "Verde Ventura",
    description: "Verde atmosférico sofisticado (4 tons)",
    colors: [
      { hex: "#E8EFE0", name: "Névoa Clara" },
      { hex: "#D7E3CC", name: "Fumaça" },
      { hex: "#C1D4B2", name: "Bruma" },
      { hex: "#C7E1BD", name: "Jade Mist" },
    ],
  },
  {
    id: "profundo",
    name: "Verde Profundo",
    description: "Tons médios de verde institucional (2 tons)",
    colors: [
      { hex: "#A8BF9A", name: "Sage Deep" },
      { hex: "#8CA680", name: "Forest Green" },
    ],
  },
  {
    id: "energia",
    name: "Energia",
    description: "Amarelo/laranja/coral (5 tons)",
    colors: [
      { hex: "#FFFAE0", name: "Campo Alto" },
      { hex: "#FFE7A3", name: "Campo Velado" },
      { hex: "#FFE2C2", name: "Centro" },
      { hex: "#FED376", name: "Marca Texto" },
      { hex: "#F58E72", name: "Denso" },
    ],
  },
  {
    id: "alegria",
    name: "Alegria",
    description: "Rosa vivo e berry (5 tons)",
    colors: [
      { hex: "#FDE2DD", name: "Campo Alto" },
      { hex: "#FFC8C2", name: "Campo Velado" },
      { hex: "#FFA3B1", name: "Centro" },
      { hex: "#FE86A4", name: "Marca Texto" },
      { hex: "#CF6E9B", name: "Denso" },
    ],
  },
  {
    id: "seguranca",
    name: "Segurança",
    description: "Lavanda, pervinca e roxo (5 tons)",
    colors: [
      { hex: "#F1E6F0", name: "Campo Alto" },
      { hex: "#DEC7DE", name: "Campo Velado" },
      { hex: "#D0AEE0", name: "Centro" },
      { hex: "#D1B4FE", name: "Marca Texto" },
      { hex: "#9DA0EC", name: "Denso" },
    ],
  },
];

/**
 * Filtra cores por feature
 */
export function filterForFeature(feature: string): ColorGroup[] {
  switch (feature) {
    case "neutrals":
      return colorPalette.filter(g => g.id === "neutrals");
    case "verde-core":
      return colorPalette.filter(g => 
        ["candy", "lemon", "ventura", "profundo"].includes(g.id)
      );
    case "color-core":
      return colorPalette.filter(g => 
        ["energia", "alegria", "seguranca"].includes(g.id)
      );
    default:
      return colorPalette;
  }
}
