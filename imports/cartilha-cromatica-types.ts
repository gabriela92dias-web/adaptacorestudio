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
  hex: string;
  uso?: string;
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
  candy: {
    id: 'candy',
    nome: 'Candy',
    descricao: 'Verde limão pastel nebuloso, doçura cítrica',
    tons: [
      { nome: 'Marshmallow', hex: '#F7FBF0', uso: 'Backgrounds leves, cards de destaque jovem' },
      { nome: 'Açúcar', hex: '#EFF7E0', uso: 'Overlays frescos, hover states suaves' },
      { nome: 'Baunilha', hex: '#E5F2D0', uso: 'Badges, pills, elementos decorativos' },
      { nome: 'Pistache', hex: '#DBEDC2', uso: 'Acentos vibrantes controlados' },
      { nome: 'Citrus Ice', hex: '#D1E8B4', uso: 'CTAs vibrantes, energia fresca' },
    ],
  },
  
  lemon: {
    id: 'lemon',
    nome: 'Lemon',
    descricao: 'Verde limão suave, frescor cítrico controlado',
    tons: [
      { nome: 'Neblina', hex: '#F5F9F2', uso: 'Backgrounds de campanha, bem-estar' },
      { nome: 'Vapor', hex: '#EAF3E5', uso: 'Cards emocionais, overlays leves' },
      { nome: 'Citrus', hex: '#DFEDD8', uso: 'Hover states, transições suaves' },
      { nome: 'Zeste', hex: '#D3E7CA', uso: 'CTAs vibrantes, links importantes' },
    ],
  },
  
  ventura: {
    id: 'ventura',
    nome: 'Ventura',
    descricao: 'Verde acinzentado etéreo, atmosférico sofisticado',
    tons: [
      { nome: 'Névoa Clara', hex: '#E8EFE0', uso: 'Elementos de apoio, fundos com presença' },
      { nome: 'Fumaça', hex: '#D7E3CC', uso: 'Textos suaves, divisores sutis' },
      { nome: 'Bruma', hex: '#C1D4B2', uso: 'Bordas suaves, estados desabilitados' },
      { nome: 'Jade Mist', hex: '#C7E1BD', uso: 'Hover suave, elementos secundários' },
    ],
  },
  
  profundo: {
    id: 'profundo',
    nome: 'Verde Profundo',
    descricao: 'Tons médios de verde institucional',
    tons: [
      { nome: 'Sage Deep', hex: '#A8BF9A', uso: 'Textos médios, elementos intermediários' },
      { nome: 'Forest Green', hex: '#8CA680', uso: 'Acentos naturais, botões secundários' },
    ],
  },
};

// Compatibilidade: exportar com nome antigo
export const VERDE_CORE_ESPECTROS = VERDE_CORE;

// ═══════════════════════════════════════════════════════════════════
// COLOR CORE - Cores de apoio expressivo (17 cores)
// ═══════════════════════════════════════════════════════════════════

export const COLOR_CORE = {
  energia: {
    id: 'energia',
    nome: 'Energia',
    descricao: 'Espectro de luz quente frutada - amarelo/laranja/coral',
    tons: [
      { nome: 'Campo Alto', hex: '#FFFAE0', uso: 'Backgrounds quentes, destaque leve' },
      { nome: 'Campo Velado', hex: '#FFE7A3', uso: 'Warnings suaves, atenção leve' },
      { nome: 'Centro', hex: '#FFE2C2', uso: 'Acentos pêssego, calor acolhedor' },
      { nome: 'Marca Texto', hex: '#FED376', uso: 'Highlights, CTAs secundários' },
      { nome: 'Denso', hex: '#F58E72', uso: 'CTAs vibrantes, energia máxima' },
    ],
  },
  
  alegria: {
    id: 'alegria',
    nome: 'Alegria',
    descricao: 'Espectro de rosa vivo e berry suave',
    tons: [
      { nome: 'Campo Alto', hex: '#FDE2DD', uso: 'Backgrounds rosa suave' },
      { nome: 'Campo Velado', hex: '#FFC8C2', uso: 'Acentos rosados claros' },
      { nome: 'Centro', hex: '#FFA3B1', uso: 'Rosa médio vibrante' },
      { nome: 'Marca Texto', hex: '#FE86A4', uso: 'CTAs rosados, energia feminina' },
      { nome: 'Denso', hex: '#CF6E9B', uso: 'Rosa profundo, empoderamento' },
    ],
  },
  
  seguranca: {
    id: 'seguranca',
    nome: 'Segurança',
    descricao: 'Espectro de lavanda rosada, pervinca e roxo frio',
    tons: [
      { nome: 'Campo Alto', hex: '#F1E6F0', uso: 'Backgrounds lavanda' },
      { nome: 'Campo Velado', hex: '#DEC7DE', uso: 'Acentos lilás suaves' },
      { nome: 'Centro', hex: '#D0AEE0', uso: 'Roxo médio elegante' },
      { nome: 'Marca Texto', hex: '#D1B4FE', uso: 'Roxo vibrante, modernidade' },
      { nome: 'Denso', hex: '#9DA0EC', uso: 'Azul-roxo profundo, confiança' },
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
  
  // VERDE CORE - Candy (5)
  'candy-100': '#F7FBF0',
  'candy-200': '#EFF7E0',
  'candy-300': '#E5F2D0',
  'candy-400': '#DBEDC2',
  'candy-500': '#D1E8B4',
  
  // VERDE CORE - Lemon (4)
  'lemon-100': '#F5F9F2',
  'lemon-200': '#EAF3E5',
  'lemon-300': '#DFEDD8',
  'lemon-400': '#D3E7CA',
  
  // VERDE CORE - Ventura (4)
  'ventura-100': '#E8EFE0',
  'ventura-200': '#D7E3CC',
  'ventura-300': '#C1D4B2',
  'ventura-400': '#C7E1BD',
  
  // VERDE CORE - Profundo (2)
  'profundo-100': '#A8BF9A',
  'profundo-200': '#8CA680',
  
  // COLOR CORE - Energia (5)
  'energia-100': '#FFFAE0',
  'energia-200': '#FFE7A3',
  'energia-300': '#FFE2C2',
  'energia-400': '#FED376',
  'energia-500': '#F58E72',
  
  // COLOR CORE - Alegria (5)
  'alegria-100': '#FDE2DD',
  'alegria-200': '#FFC8C2',
  'alegria-300': '#FFA3B1',
  'alegria-400': '#FE86A4',
  'alegria-500': '#CF6E9B',
  
  // COLOR CORE - Segurança (5)
  'seguranca-100': '#F1E6F0',
  'seguranca-200': '#DEC7DE',
  'seguranca-300': '#D0AEE0',
  'seguranca-400': '#D1B4FE',
  'seguranca-500': '#9DA0EC',
};

// ═══════════════════════════════════════════════════════════════════
// METADATA
// ═══════════════════════════════════════════════════════════════════

export const CARTILHA_METADATA = {
  name: 'Adapta - Paleta Institucional',
  version: '2026.1 DEFINITIVA',
  date: '2026-03-11',
  totalColors: 45,
  families: 9,
  breakdown: {
    neutrals: 15,
    verdeCore: 15, // Candy(5) + Lemon(4) + Ventura(4) + Profundo(2)
    colorCore: 15, // Energia(5) + Alegria(5) + Segurança(5)
  },
};