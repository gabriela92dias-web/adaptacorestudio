/**
 * ADAPTA CORE STUDIO - Palette Registry
 * Registro completo da paleta Adapta com todas as cores aprovadas
 * Versão: 2026.1.1 | Build: 1.0.5-palette-registry
 */

export interface AdaptaColor {
  name: string;
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  cssVar: string;
  spectrum: string;
  usage: string;
  wcag?: string;
}

/**
 * PALETA COMPLETA ADAPTA
 * 45 cores organizadas em 9 espectros
 */
export const ADAPTA_PALETTE: AdaptaColor[] = [
  // ========== NEUTRAL SYSTEM (12 tons) ==========
  {
    name: 'Neutral 000',
    hex: '#FAFBFA',
    rgb: [250, 251, 250],
    hsl: [120, 11, 98],
    cssVar: '--neutral-000',
    spectrum: 'NEUTRAL',
    usage: 'Background mais claro possível',
    wcag: 'AAA',
  },
  {
    name: 'Neutral 050',
    hex: '#F7F9F8',
    rgb: [247, 249, 248],
    hsl: [150, 14, 97],
    cssVar: '--neutral-050',
    spectrum: 'NEUTRAL',
    usage: 'Background principal tema claro',
    wcag: 'AAA',
  },
  {
    name: 'Neutral 100',
    hex: '#EDF1EF',
    rgb: [237, 241, 239],
    hsl: [150, 12, 94],
    cssVar: '--neutral-100',
    spectrum: 'NEUTRAL',
    usage: 'Background secundário',
    wcag: 'AAA',
  },
  {
    name: 'Neutral 200',
    hex: '#D7E3DC',
    rgb: [215, 227, 220],
    hsl: [145, 20, 87],
    cssVar: '--neutral-200',
    spectrum: 'NEUTRAL',
    usage: 'Borders suaves',
    wcag: 'AAA',
  },
  {
    name: 'Neutral 300',
    hex: '#C1D4C9',
    rgb: [193, 212, 201],
    hsl: [145, 20, 79],
    cssVar: '--neutral-300',
    spectrum: 'NEUTRAL',
    usage: 'Divisores',
    wcag: 'AAA',
  },
  {
    name: 'Neutral 400',
    hex: '#8FA89B',
    rgb: [143, 168, 155],
    hsl: [149, 13, 61],
    cssVar: '--neutral-400',
    spectrum: 'NEUTRAL',
    usage: 'Textos terciários',
    wcag: 'AAA',
  },
  {
    name: 'Neutral 500',
    hex: '#6A8A7A',
    rgb: [106, 138, 122],
    hsl: [150, 13, 48],
    cssVar: '--neutral-500',
    spectrum: 'NEUTRAL',
    usage: 'Acentos médios - MAX 20% layout',
    wcag: 'AA',
  },
  {
    name: 'Neutral 600',
    hex: '#455A4F',
    rgb: [69, 90, 79],
    hsl: [149, 13, 31],
    cssVar: '--neutral-600',
    spectrum: 'NEUTRAL',
    usage: 'Textos primários',
    wcag: 'AAA',
  },
  {
    name: 'Neutral 700',
    hex: '#2F3F36',
    rgb: [47, 63, 54],
    hsl: [146, 15, 22],
    cssVar: '--neutral-700',
    spectrum: 'NEUTRAL',
    usage: 'Textos de ênfase',
    wcag: 'AAA',
  },
  {
    name: 'Neutral 800',
    hex: '#1A231D',
    rgb: [26, 35, 29],
    hsl: [140, 15, 12],
    cssVar: '--neutral-800',
    spectrum: 'NEUTRAL',
    usage: 'Background escuro secundário',
    wcag: 'AAA',
  },
  {
    name: 'Neutral 900',
    hex: '#141A17',
    rgb: [20, 26, 23],
    hsl: [150, 13, 9],
    cssVar: '--neutral-900',
    spectrum: 'NEUTRAL',
    usage: 'Background principal tema escuro',
    wcag: 'AAA',
  },
  {
    name: 'Neutral 950',
    hex: '#0F1411',
    rgb: [15, 20, 17],
    hsl: [144, 14, 7],
    cssVar: '--neutral-950',
    spectrum: 'NEUTRAL',
    usage: 'Máxima densidade estrutural',
    wcag: 'AAA',
  },

  // ========== ESPECTRO LUZ ==========
  {
    name: 'Luz Sage Mist',
    hex: '#FAFBFA',
    rgb: [250, 251, 250],
    hsl: [120, 11, 98],
    cssVar: '--luz-sage-mist',
    spectrum: 'LUZ',
    usage: 'Backgrounds de destaque máximo',
    wcag: 'AAA',
  },
  {
    name: 'Luz Hemp Canvas',
    hex: '#F7F9F8',
    rgb: [247, 249, 248],
    hsl: [150, 14, 97],
    cssVar: '--luz-hemp-canvas',
    spectrum: 'LUZ',
    usage: 'Background principal tema claro',
    wcag: 'AAA',
  },
  {
    name: 'Luz Sage Whisper',
    hex: '#EDF1EF',
    rgb: [237, 241, 239],
    hsl: [150, 12, 94],
    cssVar: '--luz-sage-whisper',
    spectrum: 'LUZ',
    usage: 'Backgrounds secundários',
    wcag: 'AAA',
  },

  // ========== ESPECTRO ALMA ==========
  {
    name: 'Alma Green Smoke',
    hex: '#8FA89B',
    rgb: [143, 168, 155],
    hsl: [149, 13, 61],
    cssVar: '--alma-green-smoke',
    spectrum: 'ALMA',
    usage: 'Textos terciários',
    wcag: 'AAA',
  },
  {
    name: 'Alma Emerald Haze',
    hex: '#6A8A7A',
    rgb: [106, 138, 122],
    hsl: [150, 13, 48],
    cssVar: '--alma-emerald-haze',
    spectrum: 'ALMA',
    usage: 'Acentos médios',
    wcag: 'AA',
  },
  {
    name: 'Alma Deep Pine',
    hex: '#455A4F',
    rgb: [69, 90, 79],
    hsl: [149, 13, 31],
    cssVar: '--alma-deep-pine',
    spectrum: 'ALMA',
    usage: 'Textos primários',
    wcag: 'AAA',
  },

  // ========== ESPECTRO FIRMEZA ==========
  {
    name: 'Firmeza Dark Forest',
    hex: '#1A231D',
    rgb: [26, 35, 29],
    hsl: [140, 15, 12],
    cssVar: '--firmeza-dark-forest',
    spectrum: 'FIRMEZA',
    usage: 'Backgrounds escuros',
    wcag: 'AAA',
  },
  {
    name: 'Firmeza Black Earth',
    hex: '#141A17',
    rgb: [20, 26, 23],
    hsl: [150, 13, 9],
    cssVar: '--firmeza-black-earth',
    spectrum: 'FIRMEZA',
    usage: 'Background principal tema escuro',
    wcag: 'AAA',
  },
  {
    name: 'Firmeza Deep Shadow',
    hex: '#0F1411',
    rgb: [15, 20, 17],
    hsl: [144, 14, 7],
    cssVar: '--firmeza-deep-shadow',
    spectrum: 'FIRMEZA',
    usage: 'Máxima densidade',
    wcag: 'AAA',
  },

  // ========== ESPECTRO CANDY ==========
  {
    name: 'Candy Marshmallow',
    hex: '#F7FBF0',
    rgb: [247, 251, 240],
    hsl: [82, 58, 96],
    cssVar: '--candy-marshmallow',
    spectrum: 'CANDY',
    usage: 'Backgrounds leves',
    wcag: 'AAA',
  },
  {
    name: 'Candy Açúcar',
    hex: '#EFF7E0',
    rgb: [239, 247, 224],
    hsl: [81, 59, 92],
    cssVar: '--candy-acucar',
    spectrum: 'CANDY',
    usage: 'Overlays frescos',
    wcag: 'AAA',
  },
  {
    name: 'Candy Baunilha',
    hex: '#E5F2D0',
    rgb: [229, 242, 208],
    hsl: [83, 57, 88],
    cssVar: '--candy-baunilha',
    spectrum: 'CANDY',
    usage: 'Badges',
    wcag: 'AAA',
  },

  // ========== ESPECTRO LEMON ==========
  {
    name: 'Lemon Neblina',
    hex: '#F5F9F2',
    rgb: [245, 249, 242],
    hsl: [94, 37, 96],
    cssVar: '--lemon-neblina',
    spectrum: 'LEMON',
    usage: 'Backgrounds de campanha',
    wcag: 'AAA',
  },
  {
    name: 'Lemon Vapor',
    hex: '#EAF3E5',
    rgb: [234, 243, 229],
    hsl: [99, 37, 93],
    cssVar: '--lemon-vapor',
    spectrum: 'LEMON',
    usage: 'Cards emocionais',
    wcag: 'AAA',
  },
  {
    name: 'Lemon Citrus',
    hex: '#DFEDD8',
    rgb: [223, 237, 216],
    hsl: [100, 37, 89],
    cssVar: '--lemon-citrus',
    spectrum: 'LEMON',
    usage: 'Hover states',
    wcag: 'AAA',
  },

  // ========== ESPECTRO VENTURA ==========
  {
    name: 'Ventura Névoa Clara',
    hex: '#E8EFE0',
    rgb: [232, 239, 224],
    hsl: [88, 32, 91],
    cssVar: '--ventura-nevoa-clara',
    spectrum: 'VENTURA',
    usage: 'Elementos de apoio',
    wcag: 'AAA',
  },
  {
    name: 'Ventura Fumaça',
    hex: '#D7E3CC',
    rgb: [215, 227, 204],
    hsl: [91, 29, 85],
    cssVar: '--ventura-fumaca',
    spectrum: 'VENTURA',
    usage: 'Textos suaves',
    wcag: 'AAA',
  },
  {
    name: 'Ventura Bruma',
    hex: '#C1D4B2',
    rgb: [193, 212, 178],
    hsl: [94, 28, 76],
    cssVar: '--ventura-bruma',
    spectrum: 'VENTURA',
    usage: 'Bordas suaves',
    wcag: 'AAA',
  },

  // ========== ESPECTRO ENERGIA ==========
  {
    name: 'Energia Campo Alto',
    hex: '#FFFAE0',
    rgb: [255, 250, 224],
    hsl: [50, 100, 94],
    cssVar: '--energia-campo-alto',
    spectrum: 'ENERGIA',
    usage: 'Backgrounds quentes',
    wcag: 'AAA',
  },
  {
    name: 'Energia Campo Velado',
    hex: '#FFE7A3',
    rgb: [255, 231, 163],
    hsl: [44, 100, 82],
    cssVar: '--energia-campo-velado',
    spectrum: 'ENERGIA',
    usage: 'Destaques quentes',
    wcag: 'AAA',
  },
  {
    name: 'Energia Centro',
    hex: '#FFE2C2',
    rgb: [255, 226, 194],
    hsl: [31, 100, 88],
    cssVar: '--energia-centro',
    spectrum: 'ENERGIA',
    usage: 'Acentos quentes',
    wcag: 'AAA',
  },

  // ========== ESPECTRO ALEGRIA ==========
  {
    name: 'Alegria Campo Alto',
    hex: '#FDE2DD',
    rgb: [253, 226, 221],
    hsl: [9, 89, 93],
    cssVar: '--alegria-campo-alto',
    spectrum: 'ALEGRIA',
    usage: 'Backgrounds rosa suave',
    wcag: 'AAA',
  },
  {
    name: 'Alegria Campo Velado',
    hex: '#FFC8C2',
    rgb: [255, 200, 194],
    hsl: [6, 100, 88],
    cssVar: '--alegria-campo-velado',
    spectrum: 'ALEGRIA',
    usage: 'Destaques rosa',
    wcag: 'AAA',
  },
  {
    name: 'Alegria Centro',
    hex: '#FFA3B1',
    rgb: [255, 163, 177],
    hsl: [351, 100, 82],
    cssVar: '--alegria-centro',
    spectrum: 'ALEGRIA',
    usage: 'Acentos rosa',
    wcag: 'AAA',
  },

  // ========== ESPECTRO SEGURANÇA ==========
  {
    name: 'Segurança Campo Alto',
    hex: '#F1E6F0',
    rgb: [241, 230, 240],
    hsl: [305, 28, 92],
    cssVar: '--seguranca-campo-alto',
    spectrum: 'SEGURANÇA',
    usage: 'Backgrounds lavanda',
    wcag: 'AAA',
  },
  {
    name: 'Segurança Campo Velado',
    hex: '#DEC7DE',
    rgb: [222, 199, 222],
    hsl: [300, 26, 83],
    cssVar: '--seguranca-campo-velado',
    spectrum: 'SEGURANÇA',
    usage: 'Destaques lavanda',
    wcag: 'AAA',
  },
  {
    name: 'Segurança Centro',
    hex: '#D0AEE0',
    rgb: [208, 174, 224],
    hsl: [281, 45, 78],
    cssVar: '--seguranca-centro',
    spectrum: 'SEGURANÇA',
    usage: 'Acentos roxos',
    wcag: 'AAA',
  },

  // ========== CORES DE STATUS (Lei 004) ==========
  {
    name: 'Status Error Primary',
    hex: '#E84545',
    rgb: [232, 69, 69],
    hsl: [0, 73, 59],
    cssVar: '--status-error-primary',
    spectrum: 'STATUS',
    usage: 'Estado de erro',
    wcag: 'AAA',
  },
  {
    name: 'Status Success Primary',
    hex: '#2D7A4F',
    rgb: [45, 122, 79],
    hsl: [147, 46, 33],
    cssVar: '--status-success-primary',
    spectrum: 'STATUS',
    usage: 'Estado de sucesso',
    wcag: 'AAA',
  },
  {
    name: 'Status Warning Primary',
    hex: '#D97706',
    rgb: [217, 119, 6],
    hsl: [38, 95, 44],
    cssVar: '--status-warning-primary',
    spectrum: 'STATUS',
    usage: 'Estado de aviso',
    wcag: 'AAA',
  },
  {
    name: 'Status Info Primary',
    hex: '#0EA5E9',
    rgb: [14, 165, 233],
    hsl: [198, 93, 48],
    cssVar: '--status-info-primary',
    spectrum: 'STATUS',
    usage: 'Estado informativo',
    wcag: 'AA',
  },
];

/**
 * Busca cor por CSS variable
 */
export function getColorByCSSVar(cssVar: string): AdaptaColor | undefined {
  return ADAPTA_PALETTE.find((color) => color.cssVar === cssVar);
}

/**
 * Busca cor por HEX
 */
export function getColorByHex(hex: string): AdaptaColor | undefined {
  return ADAPTA_PALETTE.find(
    (color) => color.hex.toUpperCase() === hex.toUpperCase()
  );
}

/**
 * Lista cores por espectro
 */
export function getColorsBySpectrum(spectrum: string): AdaptaColor[] {
  return ADAPTA_PALETTE.filter((color) => color.spectrum === spectrum);
}

/**
 * Valida se cor existe na paleta
 */
export function isValidAdaptaColor(hex: string): boolean {
  return ADAPTA_PALETTE.some(
    (color) => color.hex.toUpperCase() === hex.toUpperCase()
  );
}
