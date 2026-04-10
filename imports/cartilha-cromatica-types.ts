/**
 * ═══════════════════════════════════════════════════════════════════
 * CARTILHA CROMÁTICA ADAPTA - PALETA INSTITUCIONAL OFICIAL
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 45 cores oficiais - 9 famílias cromáticas
 * Esta é a ÚNICA fonte de verdade para cores da marca ADAPTA
 * 
 * Versão: 2026.1 DEFINITIVA
 * Data: 2026-03-11
 */

export interface CorEspectro {
  nome: string;
  nivel?: string;
  hex: string;
  uso?: string;
  a11y?: {
    allows_black_foreground: boolean;
    allows_white_foreground: boolean;
  };
}

export interface Espectro {
  id: string;
  nome: string;
  descricao: string;
  tons: CorEspectro[];
}

// ═══════════════════════════════════════════════════════════════════
// NEUTRALS - Sistema completo de tons neutros esverdeados (15 cores)
// ═══════════════════════════════════════════════════════════════════

export const NEUTRALS = {
  // Neutros Claros (8 tons)
  '000': { nome: 'Sage Mist', hex: '#FAFBFA', uso: 'Branco quase puro' },
  '050': { nome: 'Hemp Canvas', hex: '#F7F9F8', uso: 'Background tema claro' },
  '100': { nome: 'Sage Whisper', hex: '#EDF1EF', uso: 'Backgrounds secundários' },
  '200': { nome: 'Leaf Frost', hex: '#D5E2D5', uso: 'Bordas suaves' },
  '300': { nome: 'Forest Dew', hex: '#B5C5BC', uso: 'Bordas definidas' },
  '400': { nome: 'Green Smoke', hex: '#8FA89B', uso: 'Textos terciários' },
  '500': { nome: 'Emerald Haze', hex: '#6A8A7A', uso: 'Máx 20% - Acentos médios' },
  '600': { nome: 'Deep Pine', hex: '#455A4F', uso: 'Textos primários' },
  
  // Neutros Escuros (7 tons)
  '700': { nome: 'Forest Shadow', hex: '#2E3E34', uso: 'Elementos escuros' },
  '800': { nome: 'Midnight Garden', hex: '#1F2A23', uso: 'Backgrounds escuros secundários' },
  '900': { nome: 'Dark Forest', hex: '#1A231D', uso: 'Textos principais tema claro' },
  '950': { nome: 'Black Earth', hex: '#141A17', uso: 'Background tema escuro - verde petróleo profundo' },
  '975': { nome: 'Deep Shadow', hex: '#0F1411', uso: 'Máxima densidade estrutural' },
  '990': { nome: 'Void', hex: '#0A0D0B', uso: 'Profundidade extrema' },
  '1000': { nome: 'Pure Black', hex: '#000000', uso: 'Preto absoluto' },
};

// Compatibilidade: formato de espectros antigo
export const NEUTRALS_ESPECTROS = {
  luz: {
    id: 'luz',
    nome: 'Luz',
    descricao: 'Espectro de brancura e claridade estrutural',
    tons: [
      { nome: 'Sage Mist', hex: '#FAFBFA', uso: 'Branco quase puro' },
      { nome: 'Hemp Canvas', hex: '#F7F9F8', uso: 'Background tema claro' },
      { nome: 'Sage Whisper', hex: '#EDF1EF', uso: 'Backgrounds secundários' },
    ],
  },
  alma: {
    id: 'alma',
    nome: 'Alma',
    descricao: 'Espectro de meio-termo e equilíbrio neutro',
    tons: [
      { nome: 'Green Smoke', hex: '#8FA89B', uso: 'Textos terciários' },
      { nome: 'Emerald Haze', hex: '#6A8A7A', uso: 'Máx 20% - Acentos médios' },
      { nome: 'Deep Pine', hex: '#455A4F', uso: 'Textos primários' },
    ],
  },
  firmeza: {
    id: 'firmeza',
    nome: 'Firmeza',
    descricao: 'Espectro de densidade e presença escura',
    tons: [
      { nome: 'Dark Forest', hex: '#1A231D', uso: 'Textos principais tema claro' },
      { nome: 'Black Earth', hex: '#141A17', uso: 'Background tema escuro' },
      { nome: 'Deep Shadow', hex: '#0F1411', uso: 'Máxima densidade estrutural' },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════
// VERDE CORE - Espectros de identidade institucional (13 cores)
// ═══════════════════════════════════════════════════════════════════

export const VERDE_CORE = {
  og_hybrid: {
    id: 'og-hybrid',
    nome: 'OG Hybrid Blend',
    descricao: 'A identidade pura da marca — Estabilidade institucional sólida, frescor profundo e raízes da terra.',
    tons: [
      { nome: 'Deep Canopy', nivel: '900', hex: '#1B4235', a11y: { allows_black_foreground: false, allows_white_foreground: true } },
      { nome: 'Pine Extract', nivel: '700', hex: '#3B6C5A', a11y: { allows_black_foreground: false, allows_white_foreground: true } },
      { nome: 'Herbal Diesel', nivel: '500', hex: '#619B7F', a11y: { allows_black_foreground: true, allows_white_foreground: true } },
      { nome: 'Sour Leaf', nivel: '400', hex: '#85B99B', a11y: { allows_black_foreground: true, allows_white_foreground: false } },
      { nome: 'Crisp Sap', nivel: '300', hex: '#ABCEB0', a11y: { allows_black_foreground: true, allows_white_foreground: false } },
      { nome: 'Matcha Breeze', nivel: '200', hex: '#CFE3C6', a11y: { allows_black_foreground: true, allows_white_foreground: false } },
      { nome: 'Crystal Dew', nivel: '100', hex: '#E1EDD5', a11y: { allows_black_foreground: true, allows_white_foreground: false } },
      { nome: 'Olive Haze', nivel: '50', hex: '#F2F8EA', a11y: { allows_black_foreground: true, allows_white_foreground: false } },
    ],
  },
};

// Compatibilidade: exportar com nome antigo
export const VERDE_CORE_ESPECTROS = VERDE_CORE;

// ═══════════════════════════════════════════════════════════════════
// COLOR CORE - Cores de apoio expressivo (17 cores)
// ═══════════════════════════════════════════════════════════════════

export const COLOR_CORE = {
  linalool_sky: {
    id: 'linalool-sky',
    nome: 'Linalool Sky',
    descricao: 'Espectro de roxos e azuis (Índica)',
    tons: [
      { nome: 'Indigo Resin', nivel: '900', hex: '#483D79', a11y: { allows_black_foreground: false, allows_white_foreground: true } },
      { nome: 'Plum Vapor', nivel: '800', hex: '#704085', a11y: { allows_black_foreground: false, allows_white_foreground: true } },
      { nome: 'Amethyst Smoke', nivel: '700', hex: '#83639B', a11y: { allows_black_foreground: false, allows_white_foreground: true } },
      { nome: 'Lavender Cloud', nivel: '500', hex: '#9687B2', a11y: { allows_black_foreground: true,  allows_white_foreground: true } },
      { nome: 'Lilac Frost', nivel: '300', hex: '#E4DDFA', a11y: { allows_black_foreground: true,  allows_white_foreground: false } },
      { nome: 'Sweet Trichome', nivel: '200', hex: '#FBE0FF', a11y: { allows_black_foreground: true,  allows_white_foreground: false } },
      { nome: 'Glacial Extract', nivel: '100', hex: '#E2EFFF', a11y: { allows_black_foreground: true,  allows_white_foreground: false } },
      { nome: 'Milky Mist', nivel: '50',  hex: '#FCF5FF', a11y: { allows_black_foreground: true,  allows_white_foreground: false } },
    ],
  },
  
  myrcene_soul: {
    id: 'myrcene-soul',
    nome: 'Myrcene Soul',
    descricao: 'Espectro de rosas, laranjas e amarelos (Sativa)',
    tons: [
      { nome: 'Cherry Terpene', nivel: '900', hex: '#AF4F72', a11y: { allows_black_foreground: false, allows_white_foreground: true } },
      { nome: 'Sunset Nectar', nivel: '700', hex: '#F37A63', a11y: { allows_black_foreground: false, allows_white_foreground: true } },
      { nome: 'Berry Infusion', nivel: '500', hex: '#F394A7', a11y: { allows_black_foreground: true,  allows_white_foreground: true } },
      { nome: 'Pink Vapor', nivel: '400', hex: '#FBDBDB', a11y: { allows_black_foreground: true,  allows_white_foreground: false } },
      { nome: 'Tropical Rush', nivel: '300', hex: '#F8E5A8', a11y: { allows_black_foreground: true,  allows_white_foreground: false } },
      { nome: 'Papaya Daze', nivel: '200', hex: '#FFE4C1', a11y: { allows_black_foreground: true,  allows_white_foreground: false } },
      { nome: 'Golden Kief', nivel: '100', hex: '#FFFEE3', a11y: { allows_black_foreground: true,  allows_white_foreground: false } },
      { nome: 'Terpene Sugar', nivel: '50',  hex: '#FFF5F5', a11y: { allows_black_foreground: true,  allows_white_foreground: false } },
    ],
  },
};

// Compatibilidade: exportar com nome antigo
export const COLOR_CORE_ESPECTROS = COLOR_CORE;

// ═══════════════════════════════════════════════════════════════════
// TODAS AS CORES EM FORMATO FLAT (45 cores)
// ═══════════════════════════════════════════════════════════════════

export const TODAS_AS_CORES: Record<string, string> = {
  // NEUTRALS (15)
  'neutral-000': '#FAFBFA',
  'neutral-050': '#F7F9F8',
  'neutral-100': '#EDF1EF',
  'neutral-200': '#D5E2D5',
  'neutral-300': '#B5C5BC',
  'neutral-400': '#8FA89B',
  'neutral-500': '#6A8A7A',
  'neutral-600': '#455A4F',
  'neutral-700': '#2E3E34',
  'neutral-800': '#1F2A23',
  'neutral-900': '#1A231D',
  'neutral-950': '#141A17',
  'neutral-975': '#0F1411',
  'neutral-990': '#0A0D0B',
  'neutral-1000': '#000000',
  
  // VERDE CORE - OG Hybrid (8)
  'og-hybrid-900': '#1B4235',
  'og-hybrid-700': '#3B6C5A',
  'og-hybrid-500': '#619B7F',
  'og-hybrid-400': '#85B99B',
  'og-hybrid-300': '#ABCEB0',
  'og-hybrid-200': '#CFE3C6',
  'og-hybrid-100': '#E1EDD5',
  'og-hybrid-50': '#F2F8EA',
  
  // COLOR CORE - Linalool Sky (8)
  'linalool-900': '#483D79',
  'linalool-800': '#704085',
  'linalool-700': '#83639B',
  'linalool-500': '#9687B2',
  'linalool-300': '#E4DDFA',
  'linalool-200': '#FBE0FF',
  'linalool-100': '#E2EFFF',
  'linalool-50': '#FCF5FF',
  
  // COLOR CORE - Myrcene Soul (8)
  'myrcene-900': '#AF4F72',
  'myrcene-700': '#F37A63',
  'myrcene-500': '#F394A7',
  'myrcene-400': '#FBDBDB',
  'myrcene-300': '#F8E5A8',
  'myrcene-200': '#FFE4C1',
  'myrcene-100': '#FFFEE3',
  'myrcene-50': '#FFF5F5',
};

// ═══════════════════════════════════════════════════════════════════
// METADATA
// ═══════════════════════════════════════════════════════════════════

export const CARTILHA_METADATA = {
  name: 'Adapta - Paleta Institucional',
  version: '2026.2 DEFINITIVA',
  date: '2026-04-10',
  totalColors: 39,
  families: 5,
  breakdown: {
    neutrals: 15,
    verdeCore: 8, // OG Hybrid(8)
    colorCore: 16, // Linalool(8) + Myrcene(8)
  },
};