/**
 * ═══════════════════════════════════════════════════════════════════
 * CARTILHA CROMÁTICA ADAPTA - SISTEMA OFICIAL DE CORES v2026.2
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 🎨 PALETA OFICIAL: 39 cores em 5 famílias
 * 
 * ✅ NEUTRALS (15 cores): Luz, Alma, Firmeza
 * ✅ VERDE CORE (8 cores): OG Hybrid Blend
 * ✅ COLOR CORE (16 cores): Linalool Sky + Myrcene Soul
 * 
 * 📐 REGRAS DE USO:
 * - Emerald Haze (#6A8A7A): máximo 20% do layout
 * - OG Hybrid Blend: identidade institucional — qualquer componente
 * - Color Core: campanhas, CTAs e ferramentas de design
 * - WCAG 2.1 AA mínimo (contraste 4.5:1)
 */

import {
  NEUTRALS_ESPECTROS,
  VERDE_CORE_ESPECTROS,
  COLOR_CORE_ESPECTROS,
  CARTILHA_METADATA,
} from '../../../imports/cartilha-cromatica-types';

// ═══════════════════════════════════════════════════════════════════
// RE-EXPORTA ESPECTROS OFICIAIS
// ═══════════════════════════════════════════════════════════════════

export const NEUTRALS = NEUTRALS_ESPECTROS;
export const VERDE_CORE = VERDE_CORE_ESPECTROS;
export const COLOR_CORE = COLOR_CORE_ESPECTROS;

// ═══════════════════════════════════════════════════════════════════
// HELPERS - Funções utilitárias para seletores de cor
// ═══════════════════════════════════════════════════════════════════

/**
 * Retorna array de todas as cores dos Neutrals (15 cores)
 */
export function getNeutralsColors(): Array<{ name: string; value: string; spectrum: string }> {
  const colors: Array<{ name: string; value: string; spectrum: string }> = [];
  
  NEUTRALS_ESPECTROS.luz.tons.forEach(ton => {
    colors.push({ name: ton.nome, value: ton.hex, spectrum: 'Luz' });
  });
  
  NEUTRALS_ESPECTROS.alma.tons.forEach(ton => {
    colors.push({ name: ton.nome, value: ton.hex, spectrum: 'Alma' });
  });
  
  NEUTRALS_ESPECTROS.firmeza.tons.forEach(ton => {
    colors.push({ name: ton.nome, value: ton.hex, spectrum: 'Firmeza' });
  });
  
  return colors;
}

/**
 * Sistema Neutral - 12 tons de verde petróleo escuro
 * Base: #141A17 (padrão RGB onde G > B > R)
 * Exportado para uso em componentes de design
 */
export const neutralColors = [
  { name: 'neutral-000', value: '#FAFBFA' },
  { name: 'neutral-050', value: '#F2F4F3' },
  { name: 'neutral-100', value: '#E5E8E6' },
  { name: 'neutral-200', value: '#CCD1CE' },
  { name: 'neutral-300', value: '#B2BAB7' },
  { name: 'neutral-400', value: '#99A39F' },
  { name: 'neutral-500', value: '#7F8C88' },
  { name: 'neutral-600', value: '#657570' },
  { name: 'neutral-700', value: '#4C5E59' },
  { name: 'neutral-800', value: '#324741' },
  { name: 'neutral-900', value: '#19302A' },
  { name: 'neutral-950', value: '#141A17' },
];

/**
 * Retorna array de todas as cores do Verde Core (8 cores)
 */
export function getVerdeCoreColors(): Array<{ name: string; value: string; spectrum: string; conceptual?: string }> {
  const colors: Array<{ name: string; value: string; spectrum: string; conceptual?: string }> = [];
  
  VERDE_CORE_ESPECTROS.og_hybrid.tons.forEach((ton: any) => {
    colors.push({ name: ton.nivel || ton.nome, value: ton.hex, spectrum: 'OG Hybrid Blend', conceptual: ton.nome });
  });
  
  return colors;
}

/**
 * Retorna array de todas as cores do Color Core (15 cores)
 */
export function getColorCoreColors(): Array<{ name: string; value: string; spectrum: string }> {
  const colors: Array<{ name: string; value: string; spectrum: string }> = [];
  
  COLOR_CORE_ESPECTROS.linalool_sky.tons.forEach(ton => {
    colors.push({ name: ton.nome, value: ton.hex, spectrum: 'Linalool Sky' });
  });
  
  COLOR_CORE_ESPECTROS.myrcene_soul.tons.forEach(ton => {
    colors.push({ name: ton.nome, value: ton.hex, spectrum: 'Myrcene Soul' });
  });
  

  
  return colors;
}

/**
 * Retorna TODAS as 45 cores da cartilha organizadas por categoria
 */
export function getAllDesignColors(): Array<{ name: string; value: string; spectrum: string; category: 'Neutrals' | 'Verde Core' | 'Color Core'; a11y?: { allows_black_foreground: boolean; allows_white_foreground: boolean } }> {
  // Vamos resgatar os a11y direto do objeto original das cores se existirem
  const mapColorWithA11y = (arr: any[], spectrumObj: any) => {
    return arr.map(c => {
      const tonMatch = spectrumObj.tons.find((t: any) => t.nome === c.name || t.hex.toLowerCase() === c.value.toLowerCase());
      return { ...c, a11y: tonMatch?.a11y };
    });
  };

  const neutrals = getNeutralsColors().map(c => ({ ...c, category: 'Neutrals' as const }));
  const verdeCore = getVerdeCoreColors().map(c => ({ ...c, category: 'Verde Core' as const }));
  
  // Para ColorCore, pegamos a11y do linalool_sky e myrcene_soul
  const colorCoreRaw = getColorCoreColors();
  const colorCore = colorCoreRaw.map(c => {
    const isLinalool = c.spectrum === 'Linalool Sky';
    const spectrumObj = isLinalool ? COLOR_CORE_ESPECTROS.linalool_sky : COLOR_CORE_ESPECTROS.myrcene_soul;
    const tonMatch = spectrumObj.tons.find((t: any) => t.hex.toLowerCase() === c.value.toLowerCase());
    return { ...c, category: 'Color Core' as const, a11y: tonMatch?.a11y };
  });
  
  return [...neutrals, ...verdeCore, ...colorCore];
}

/**
 * Retorna paleta completa organizada por espectros
 */
export function getPaletteBySpectrums() {
  return {
    neutrals: {
      luz: NEUTRALS_ESPECTROS.luz,
      alma: NEUTRALS_ESPECTROS.alma,
      firmeza: NEUTRALS_ESPECTROS.firmeza,
    },
    verdeCore: {
      og_hybrid: VERDE_CORE_ESPECTROS.og_hybrid,
    },
    colorCore: {
      linalool_sky: COLOR_CORE_ESPECTROS.linalool_sky,
      myrcene_soul: COLOR_CORE_ESPECTROS.myrcene_soul,
    },
  };
}

/**
 * Metadados da cartilha
 */
export const metadata = CARTILHA_METADATA;

// ═══════════════════════════════════════════════════════════════════
// CONTRASTE - Funções para garantir acessibilidade WCAG 2.1
// ═══════════════════════════════════════════════════════════════════

/**
 * Calcula a luminância relativa de uma cor (WCAG 2.1)
 * @param hex - Cor em formato hexadecimal (#RRGGBB)
 */
function getLuminance(hex: string): number {
  // Remove o # se presente
  const rgb = hex.replace('#', '');
  
  // Extrai RGB
  const r = parseInt(rgb.substring(0, 2), 16) / 255;
  const g = parseInt(rgb.substring(2, 4), 16) / 255;
  const b = parseInt(rgb.substring(4, 6), 16) / 255;
  
  // Aplica fórmula WCAG
  const [rs, gs, bs] = [r, g, b].map(c => 
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calcula a razão de contraste entre duas cores (WCAG 2.1)
 * @param color1 - Primeira cor (#RRGGBB)
 * @param color2 - Segunda cor (#RRGGBB)
 * @returns Razão de contraste (1 a 21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Retorna apenas cores com contraste mínimo em relação a uma cor de referência
 * @param colors - Array de cores para filtrar
 * @param referenceColor - Cor de referência (#RRGGBB)
 * @param minContrast - Razão de contraste mínima (padrão: 3.0 para UI grande)
 */
export function getColorsWithMinContrast(
  colors: Array<{ name: string; value: string; spectrum: string }>,
  referenceColor: string,
  minContrast: number = 3.0
): Array<{ name: string; value: string; spectrum: string; contrast: number }> {
  return colors
    .map(color => ({
      ...color,
      contrast: getContrastRatio(color.value, referenceColor)
    }))
    .filter(color => color.contrast >= minContrast);
}

/**
 * Retorna cores de mascote com contraste garantido para boca preta (#0e0d10)
 */
export function getMascotBodyColors(): Array<{ name: string; value: string; spectrum: string; contrast: number }> {
  const MOUTH_COLOR = '#0e0d10'; // Preto escuro da boca/olhos
  const allColors = getAllDesignColors();
  
  // Filtro de acessibilidade "fundamental":
  // Respeita explicitamente a propriedade a11y.allows_black_foreground quando presente (json de ColorCore)
  // Caso não esteja presente (cores antigas), usa a regra de WCAG AA para contrastes mínimos (>= 3.0)
  return allColors
    .map(color => ({
      ...color,
      contrast: getContrastRatio(color.value, MOUTH_COLOR)
    }))
    .filter(color => {
      if (color.a11y && color.a11y.allows_black_foreground !== undefined) {
        return color.a11y.allows_black_foreground;
      }
      return color.contrast >= 3.0; // Fallback WCAG para textos/elementos visuais grandes
    });
}