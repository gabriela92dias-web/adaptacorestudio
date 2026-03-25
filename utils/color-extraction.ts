/**
 * 🎨 COLOR EXTRACTION & ANALYSIS
 * ════════════════════════════════════════════════════════════════
 * Sistema REAL de extração e análise de cores de imagens
 * - Extrai paleta dominante usando quantização de cores
 * - Compara cores usando Delta E (CIE76) para precisão
 * - Detecta cores piratas com tolerância ultra-rigorosa (10 pontos)
 */

import { getPalette } from 'colorthief';

// ═══════════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════════

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface LAB {
  l: number;
  a: number;
  b: number;
}

export interface ExtractedColor {
  hex: string;
  rgb: RGB;
  percentage: number; // % de pixels na imagem
}

// ═══════════════════════════════════════════════════════════════
//  COLOR CONVERSION
// ═══════════════════════════════════════════════════════════════

/**
 * Converte HEX para RGB
 */
export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid HEX color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Converte RGB para HEX
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Converte RGB para LAB (CIELAB)
 * LAB é perceptualmente uniforme - distância = diferença percebida pelo olho humano
 */
export function rgbToLab(rgb: RGB): LAB {
  // 1. RGB → XYZ
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  // Gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  r *= 100;
  g *= 100;
  b *= 100;

  // RGB → XYZ (Observer = 2°, Illuminant = D65)
  const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

  // 2. XYZ → LAB
  const xn = 95.047;  // D65 white point
  const yn = 100.000;
  const zn = 108.883;

  let xr = x / xn;
  let yr = y / yn;
  let zr = z / zn;

  const f = (t: number) => t > 0.008856 ? Math.pow(t, 1 / 3) : (7.787 * t + 16 / 116);

  xr = f(xr);
  yr = f(yr);
  zr = f(zr);

  const l = 116 * yr - 16;
  const a = 500 * (xr - yr);
  const lab_b = 200 * (yr - zr);

  return { l, a, b: lab_b };
}

// ═══════════════════════════════════════════════════════════════
//  DELTA E (CIE76) - Distância perceptual entre cores
// ═══════════════════════════════════════════════════════════════

/**
 * Calcula Delta E (CIE76) entre duas cores
 * 
 * Valores de referência:
 * - 0-2:   Imperceptível ao olho humano
 * - 2-10:  Perceptível com atenção
 * - 10-50: Cores claramente diferentes
 * - 50+:   Cores completamente opostas
 * 
 * ADAPTA usa tolerância de 10 para cores PIRATAS
 */
export function calcularDeltaE(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  const lab1 = rgbToLab(rgb1);
  const lab2 = rgbToLab(rgb2);

  // Delta E (CIE76) - Distância euclidiana no espaço LAB
  const deltaL = lab1.l - lab2.l;
  const deltaA = lab1.a - lab2.a;
  const deltaB = lab1.b - lab2.b;

  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
}

// ═══════════════════════════════════════════════════════════════
//  COLOR EXTRACTION
// ═══════════════════════════════════════════════════════════════

/**
 * Extrai paleta de cores dominantes de uma imagem
 * 
 * @param imageUrl - URL da imagem (pode ser data URL, blob URL, etc)
 * @param numColors - Número de cores dominantes para extrair (padrão: 8)
 * @returns Promise com array de cores extraídas
 */
export async function extractColorsFromImage(
  imageUrl: string,
  numColors: number = 8
): Promise<ExtractedColor[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = async () => {
      try {
        // Extrai paleta usando a API moderna do colorthief v3
        const palette = await getPalette(img, { colorCount: numColors });
        
        if (!palette || palette.length === 0) {
          reject(new Error('Não foi possível extrair cores da imagem'));
          return;
        }

        // Converte Color objects para formato padronizado
        const colors: ExtractedColor[] = palette.map((color) => {
          const rgbObj: RGB = { 
            r: Math.round(color.rgb().r), 
            g: Math.round(color.rgb().g), 
            b: Math.round(color.rgb().b) 
          };
          return {
            hex: color.hex(),
            rgb: rgbObj,
            percentage: color.proportion() * 100, // % real de pixels
          };
        });

        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Erro ao carregar imagem'));
    };

    img.src = imageUrl;
  });
}

/**
 * Filtra cores muito similares (evita duplicatas)
 */
export function filterSimilarColors(
  colors: ExtractedColor[],
  minDeltaE: number = 15
): ExtractedColor[] {
  const filtered: ExtractedColor[] = [];

  for (const color of colors) {
    const isSimilar = filtered.some(
      (existing) => calcularDeltaE(color.hex, existing.hex) < minDeltaE
    );

    if (!isSimilar) {
      filtered.push(color);
    }
  }

  return filtered;
}

/**
 * Remove cores muito claras/escuras (ruído de fundo, sombras, etc)
 */
export function filterExtremeColors(colors: ExtractedColor[]): ExtractedColor[] {
  return colors.filter((color) => {
    const { r, g, b } = color.rgb;
    const brightness = (r + g + b) / 3;
    
    // Remove cores muito escuras (< 20) e muito claras (> 240)
    return brightness > 20 && brightness < 240;
  });
}

// ═══════════════════════════════════════════════════════════════
//  PIRATE COLOR DETECTION
// ═══════════════════════════════════════════════════════════════

/**
 * Encontra a cor oficial MAIS PRÓXIMA da Cartilha Cromática
 */
export function findClosestOfficialColor(
  hexColor: string,
  cartilhaCromatica: Array<{ hex: string; nome: string }>
): {
  corOficial: { hex: string; nome: string };
  distancia: number;
  isPirata: boolean;
} {
  let closestColor = cartilhaCromatica[0];
  let minDistance = Infinity;

  for (const corOficial of cartilhaCromatica) {
    const distance = calcularDeltaE(hexColor, corOficial.hex);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = corOficial;
    }
  }

  // Tolerância ULTRA-RIGOROSA: 10 pontos Delta E
  const TOLERANCIA_PIRATA = 10;
  const isExactMatch = minDistance < TOLERANCIA_PIRATA;

  return {
    corOficial: closestColor,
    distancia: minDistance,
    isPirata: !isExactMatch && minDistance < 50, // Pirata = parecido mas não oficial
  };
}

// ═══════════════════════════════════════════════════════════════
//  COMPLETE ANALYSIS PIPELINE
// ═══════════════════════════════════════════════════════════════

/**
 * Pipeline completo de análise de cores de imagem
 */
export async function analyzeImageColors(
  imageUrl: string,
  cartilhaCromatica: Array<{ hex: string; nome: string }>,
  options: {
    numColors?: number;
    filterSimilar?: boolean;
    filterExtremes?: boolean;
  } = {}
): Promise<{
  extractedColors: ExtractedColor[];
  analysis: Array<{
    extracted: ExtractedColor;
    official: { hex: string; nome: string };
    distance: number;
    isPirata: boolean;
  }>;
}> {
  const { numColors = 8, filterSimilar = true, filterExtremes = true } = options;

  // 1. Extrai cores da imagem
  let colors = await extractColorsFromImage(imageUrl, numColors);

  // 2. Filtra ruído (opcional)
  if (filterExtremes) {
    colors = filterExtremeColors(colors);
  }

  if (filterSimilar) {
    colors = filterSimilarColors(colors);
  }

  // 3. Compara cada cor extraída com a Cartilha
  const analysis = colors.map((color) => {
    const result = findClosestOfficialColor(color.hex, cartilhaCromatica);
    return {
      extracted: color,
      official: result.corOficial,
      distance: result.distancia,
      isPirata: result.isPirata,
    };
  });

  return {
    extractedColors: colors,
    analysis,
  };
}