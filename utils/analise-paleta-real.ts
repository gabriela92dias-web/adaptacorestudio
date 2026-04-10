/**
 * 🎨 ANÁLISE DE PALETA - VERSÃO REAL
 * ════════════════════════════════════════════════════════════════
 * Análise de paleta usando extração REAL de cores da imagem
 */

import { analyzeImageColors } from './color-extraction';

// Cartilha Cromática ADAPTA v2026.2
const CARTILHA_CROMATICA = {
  neutral: {
    '000': '#F5F7F6',
    '100': '#E8EBE9',
    '200': '#D1D6D4',
    '300': '#BAC2BF',
    '400': '#A3ADAA',
    '500': '#8C9794',
    '600': '#70827D',
    '700': '#556D66',
    '800': '#3A584F',
    '900': '#1F4338',
    '950': '#141A17',
  },
  // OG Hybrid Blend — Identidade Verde Institucional
  ogHybrid: {
    '050': '#F2F8EA', // Olive Haze
    '100': '#E1EDD5', // Crystal Dew
    '200': '#CFE3C6', // Matcha Breeze
    '300': '#ABCEB0', // Crisp Sap
    '400': '#85B99B', // Sour Leaf
    '500': '#619B7F', // Herbal Diesel
    '700': '#3B6C5A', // Pine Extract
    '900': '#1B4235', // Deep Canopy
  },
  // Linalool Sky — Espectro Roxo-Azul (Índica)
  linaloolSky: {
    '050': '#FCF5FF', // Milky Mist
    '100': '#E2EFFF', // Glacial Extract
    '150': '#FBE0FF', // Sweet Trichome
    '200': '#E4DDFA', // Lilac Frost
    '500': '#9687B2', // Lavender Cloud
    '600': '#83639B', // Amethyst Smoke
    '700': '#704085', // Plum Vapor
    '800': '#483D79', // Indigo Resin
  },
  // Myrcene Soul — Espectro Rosa-Laranja-Amarelo (Sativa)
  myrceneSoul: {
    '050': '#FFF5F5', // Terpene Sugar
    '100': '#FFFEE3', // Golden Kief
    '200': '#FFE4C1', // Papaya Daze
    '300': '#F8E5A8', // Tropical Rush
    '350': '#FBDBDB', // Pink Vapor
    '400': '#F394A7', // Berry Infusion
    '500': '#F37A63', // Sunset Nectar
    '700': '#AF4F72', // Cherry Terpene
  },
  // Neutros Claros (UI Light)
  neutralsLight: {
    '000': '#FAFBFA', // Sage Mist
    '050': '#F7F9F8', // Hemp Canvas
    '100': '#EDF1EF', // Sage Whisper
    '200': '#D5E2D5', // Leaf Frost
    '300': '#B5C5BC', // Forest Dew
    '400': '#8FA89B', // Green Smoke
    '500': '#6A8A7A', // Emerald Haze
    '600': '#455A4F', // Deep Pine
  },
  // Neutros Escuros (UI Dark)
  neutralsDark: {
    '100': '#2E3E34', // Forest Shadow
    '200': '#1F2A23', // Midnight Garden
    '300': '#1A231D', // Dark Forest
    '400': '#141A17', // Black Earth
    '500': '#0F1411', // Deep Shadow
    '600': '#0A0D0B', // Void
  },
} as const;

export interface AnalisePaletaResult {
  coresDetectadas: string[];
  usoColorCore: boolean;
  usoNeutral: boolean;
  usoVerdeCore: boolean;
  problemas: string[];
  sugestoes: string[];
  nota: number;
  coresPiratas?: Array<{
    corUsada: string;
    corOficial: string;
    nomeOficial: string;
    distancia: number;
  }>;
}

export interface TipoPeca {
  tipo: 'institucional' | 'campanha-especifica' | 'generico';
  publico: string;
  paletaPermitida: string[];
  paletaProibida: string[];
  explicacao: string;
}

/**
 * Analisa paleta de cores REAL extraída da imagem
 */
export async function analisarPaletaReal(
  imageUrl: string,
  tipoPeca: TipoPeca
): Promise<AnalisePaletaResult> {
  // 1. Prepara cartilha em formato plano
  const ESPECTRO_LABELS: Record<string, string> = {
    neutral: 'Neutral',
    ogHybrid: 'OG Hybrid Blend',
    linaloolSky: 'Linalool Sky',
    myrceneSoul: 'Myrcene Soul',
    neutralsLight: 'Neutros Claros',
    neutralsDark: 'Neutros Escuros',
  };
  const cartilhaPlana = Object.entries(CARTILHA_CROMATICA).flatMap(([espectro, tons]) =>
    Object.entries(tons).map(([tom, hex]) => {
      const espectroNome = ESPECTRO_LABELS[espectro] ?? espectro;
      return {
        hex,
        nome: `${espectroNome} ${tom}`,
      };
    })
  );

  // 2. Extrai cores reais da imagem
  const { extractedColors, analysis } = await analyzeImageColors(imageUrl, cartilhaPlana, {
    numColors: 8,
    filterSimilar: true,
    filterExtremes: true,
  });

  // 3. Inicializa resultados
  const problemas: string[] = [];
  const sugestoes: string[] = [];
  const coresPiratas: Array<{
    corUsada: string;
    corOficial: string;
    nomeOficial: string;
    distancia: number;
  }> = [];
  const coresValidadas: string[] = [];
  
  let nota = 10;
  let totalCoresPiratas = 0;
  let usoColorCore = false;
  let usoNeutral = false;
  let usoVerdeCore = false;

  // 4. Valida cada cor extraída
  for (const item of analysis) {
    const { extracted, official, distance, isPirata } = item;
    const hex = extracted.hex.toUpperCase();
    
    // Tolerância: Delta E < 10 = oficial
    const isOficial = distance < 10;
    
    if (isOficial) {
      // ✓ COR OFICIAL
      coresValidadas.push(`✓ ${official.nome}`);
      
      // Detecta padrões de uso (v2026.2)
      const nomeLower = official.nome.toLowerCase();
      if (nomeLower.includes('neutral') || nomeLower.includes('neutros')) {
        usoNeutral = true;
      } else if (nomeLower.includes('og hybrid')) {
        usoVerdeCore = true;
      } else if (nomeLower.includes('linalool') || nomeLower.includes('myrcene')) {
        // Linalool Sky e Myrcene Soul = Color Core
        usoColorCore = true;
      } else {
        usoColorCore = true;
      }
      
    } else if (isPirata) {
      // 🚨 COR PIRATA DETECTADA!
      totalCoresPiratas++;
      coresValidadas.push(`🚨 ${hex} (PIRATA)`);
      
      problemas.push(`❌ COR PIRATA #${totalCoresPiratas}: ${hex}`);
      problemas.push(`   → NÃO é uma cor oficial da Cartilha Cromática ADAPTA v2026.2`);
      problemas.push(`   → Mais próxima: ${official.nome} (${official.hex.toUpperCase()})`);
      problemas.push(`   → Distância detectada: ${Math.round(distance)} (tolerância: 10)`);
      problemas.push('');
      
      coresPiratas.push({
        corUsada: hex,
        corOficial: official.hex,
        nomeOficial: official.nome,
        distancia: distance,
      });
      
      nota -= 4.5;  // Penalidade CRÍTICA
      
      // Detecta padrão mesmo sendo pirata (para validação de contexto)
      if (!official.nome.toLowerCase().includes('neutral')) {
        usoColorCore = true;
      }
    }
  }

  // 5. Alerta crítico de cores piratas
  if (totalCoresPiratas > 0) {
    problemas.push('');
    problemas.push(`🚨 REPROVAÇÃO: ${totalCoresPiratas} COR${totalCoresPiratas > 1 ? 'ES' : ''} PIRATA${totalCoresPiratas > 1 ? 'S' : ''} DETECTADA${totalCoresPiratas > 1 ? 'S' : ''}!`);
    problemas.push('═══════════════════════════════════════════════════════');
    problemas.push('As cores PARECEM corretas visualmente, mas o código HEX NÃO É OFICIAL.');
    problemas.push('TODA peça DEVE usar os códigos EXATOS da Cartilha Cromática v2026.2');
    problemas.push('Diferença de 1 dígito = COR PIRATA = REPROVAÇÃO');
    
    sugestoes.push('');
    sugestoes.push('🔧 CORREÇÃO OBRIGATÓRIA - Substituir cores:');
    coresPiratas.forEach((cp, idx) => {
      sugestoes.push(`   ${idx + 1}. ${cp.corUsada} → ${cp.corOficial.toUpperCase()} (${cp.nomeOficial})`);
    });
    sugestoes.push('');
    sugestoes.push('💡 IMPORTANTE:');
    sugestoes.push('   • Use o Color Picker oficial da Cartilha Cromática');
    sugestoes.push('   • Copie o código HEX EXATO - não digite manualmente');
    sugestoes.push('   • Cores "parecidas" não são aceitas');
    sugestoes.push('   • Validação é feita por código HEX, não por aparência visual');
  }

  // 6. Validações de contexto
  
  // INSTITUCIONAL com Color Core OFICIAL = ERRO
  if (tipoPeca.tipo === 'institucional' && usoColorCore && totalCoresPiratas === 0) {
    problemas.push('');
    problemas.push('❌ ERRO: Color Core OFICIAL usado em peça INSTITUCIONAL');
    problemas.push('Material corporativo DEVE usar apenas Neutral System + Verde Core');
    nota = Math.min(nota, 4.0);
    sugestoes.push('Substitua Color Core por tons do Neutral System');
    sugestoes.push('Use Verde Petróleo (Verde Core) para destaques pontuais');
  }
  // INSTITUCIONAL SEM Color Core = PERFEITO
  else if (tipoPeca.tipo === 'institucional' && !usoColorCore && totalCoresPiratas === 0) {
    sugestoes.push('✓ Paleta PERFEITA para material institucional (Neutral + Verde Core oficial)');
    nota = 10.0;
  }
  // INFANTIL COM Color Core OFICIAL = EXCELENTE
  else if (tipoPeca.publico.toLowerCase().includes('infantil') && usoColorCore && totalCoresPiratas === 0) {
    sugestoes.push('✓ EXCELENTE! Color Core OFICIAL + público infantil = combinação perfeita');
    sugestoes.push('Paleta vibrante, atrativa e 100% dentro da Cartilha Cromática');
    nota = 10.0;
  }
  // INFANTIL SEM Color Core = RECOMENDAÇÃO
  else if (tipoPeca.publico.toLowerCase().includes('infantil') && !usoColorCore) {
    sugestoes.push('⚠️ Público INFANTIL: recomendado usar Color Core vibrante!');
    sugestoes.push('Cores vibrantes aumentam engajamento com crianças e pais');
    nota = Math.min(nota, 7.0);
  }
  // CAMPANHA COM Color Core OFICIAL = ÓTIMO
  else if (tipoPeca.tipo === 'campanha-especifica' && usoColorCore && totalCoresPiratas === 0) {
    sugestoes.push('✓ Uso PERFEITO de Color Core oficial para campanha segmentada');
    nota = Math.max(nota, 9.5);
  }

  // Validações adicionais
  if (!usoNeutral) {
    problemas.push('');
    problemas.push('❌ Neutral System não detectado - TODA peça deve ter base neutra');
    nota -= 2.0;
  }

  if (coresValidadas.length > 5) {
    problemas.push('⚠️ Muitas cores diferentes - máximo recomendado: 3-4 cores');
    nota -= 0.5;
  }

  return {
    coresDetectadas: coresValidadas,
    usoColorCore,
    usoNeutral,
    usoVerdeCore,
    problemas,
    sugestoes,
    nota: Math.max(0, Math.min(10, nota)),
    coresPiratas: coresPiratas.length > 0 ? coresPiratas : undefined,
  };
}
