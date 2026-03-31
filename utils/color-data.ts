/**
 * ═══════════════════════════════════════════════════════════════
 * ADAPTA COLOR DATA - Paleta Institucional Oficial
 * ═══════════════════════════════════════════════════════════════
 *
 * Estrutura de grupos esperada pelo color-wheel.tsx:
 *
 *  GRUPOS VERDE (filtro "verde"):
 *    - IDs devem estar em VERDE_GROUP_IDS abaixo
 *
 *  GRUPOS COLOR (filtro "color"):
 *    - IDs devem estar em COLOR_GROUP_IDS abaixo
 *
 *  GRUPOS NEUTRALS (filtro "neutrals"):
 *    - IDs devem estar em NEUTRAL_GROUP_IDS abaixo
 *
 * Cada grupo tem no máximo 5 cores (tons 100→500).
 * Preencha o array colorPalette com os grupos da identidade visual.
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
// Ajuste esses arrays quando adicionar grupos novos.

const VERDE_GROUP_IDS: string[] = [
  // ex: "candy", "lemon", "ventura", "profundo"
];

const COLOR_GROUP_IDS: string[] = [
  // ex: "energia", "alegria", "seguranca"
];

const NEUTRAL_GROUP_IDS: string[] = [
  // ex: "neutrals"
];

// ── Paleta oficial ────────────────────────────────────────────
// VAZIA — preencha com os grupos da nova identidade visual.

export const colorPalette: ColorGroup[] = [
  // Exemplo de estrutura:
  // {
  //   id: "nome-do-grupo",
  //   name: "Nome Exibido",
  //   description: "Descrição curta",
  //   colors: [
  //     { hex: "#FFFFFF", name: "Tom 100" },
  //     { hex: "#CCCCCC", name: "Tom 200" },
  //     { hex: "#999999", name: "Tom 300" },
  //     { hex: "#666666", name: "Tom 400" },
  //     { hex: "#333333", name: "Tom 500" },
  //   ],
  // },
];

// ── Filtros ───────────────────────────────────────────────────
// Nomes de filtro usados pelo color-wheel.tsx:
//   "verde"          → só grupos Verde
//   "color"          → só grupos Color
//   "both"           → Verde + Color
//   "neutrals"       → só Neutrals
//   "verde-neutrals" → Verde + Neutrals
//   "all"            → tudo

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
