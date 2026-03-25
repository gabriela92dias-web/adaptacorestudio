/**
 * 🎨 ANÁLISE DE PALETA - VERSÃO REAL
 * ════════════════════════════════════════════════════════════════
 * Análise de paleta usando extração REAL de cores da imagem
 */

import { analyzeImageColors } from './color-extraction';

// Cartilha Cromática ADAPTA v2026.1
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
  verdeCore: {
    '300': '#A3C4B4',
    '400': '#8FB09F',
    '500': '#6A8A7A',
    '600': '#557065',
    '700': '#445A4F',
  },
  azul: {
    '300': '#7FB3E8',
    '400': '#5A9FE0',
    '500': '#3D8DD8',
    '600': '#2871B5',
    '700': '#1F5A92',
  },
  laranja: {
    '300': '#FFB88C',
    '400': '#FFA066',
    '500': '#FF8940',
    '600': '#E67329',
    '700': '#CC5E1A',
  },
  rosa: {
    '300': '#FFB3D9',
    '400': '#FF8FC7',
    '500': '#FF6BB5',
    '600': '#E64D9B',
    '700': '#CC3081',
  },
  roxo: {
    '300': '#C5B3E6',
    '400': '#A98FD9',
    '500': '#8D6BCC',
    '600': '#7254B3',
    '700': '#5A3E99',
  },
  verde: {
    '300': '#A8E6A3',
    '400': '#85D97F',
    '500': '#62CC5B',
    '600': '#4AB344',
    '700': '#3A992D',
  },
  amarelo: {
    '300': '#FFF099',
    '400': '#FFE666',
    '500': '#FFDD33',
    '600': '#E6C61A',
    '700': '#CCB000',
  },
  vermelho: {
    '300': '#FF9999',
    '400': '#FF6666',
    '500': '#FF3333',
    '600': '#E61A1A',
    '700': '#CC0000',
  },
  ciano: {
    '300': '#99F0FF',
    '400': '#66E6FF',
    '500': '#33DDFF',
    '600': '#1AC4E6',
    '700': '#00AACC',
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
  const cartilhaPlana = Object.entries(CARTILHA_CROMATICA).flatMap(([espectro, tons]) =>
    Object.entries(tons).map(([tom, hex]) => {
      // Nome mais legível
      const espectroNome = espectro === 'verdeCore' ? 'Verde Core' : 
                          espectro.charAt(0).toUpperCase() + espectro.slice(1);
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
      
      // Detecta padrões de uso
      const nomeLower = official.nome.toLowerCase();
      if (nomeLower.includes('neutral')) {
        usoNeutral = true;
      } else if (nomeLower.includes('verde') && nomeLower.includes('core')) {
        usoVerdeCore = true;
      } else {
        // Qualquer cor que não seja Neutral ou Verde Core = Color Core
        usoColorCore = true;
      }
      
    } else if (isPirata) {
      // 🚨 COR PIRATA DETECTADA!
      totalCoresPiratas++;
      coresValidadas.push(`🚨 ${hex} (PIRATA)`);
      
      problemas.push(`❌ COR PIRATA #${totalCoresPiratas}: ${hex}`);
      problemas.push(`   → NÃO é uma cor oficial da Cartilha Cromática ADAPTA v2026.1`);
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
    problemas.push('TODA peça DEVE usar os códigos EXATOS da Cartilha Cromática v2026.1');
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
