/**
 * ═══════════════════════════════════════════════════════════════
 * ADAPTA PLATFORM - Graphic Analyzer
 * ═══════════════════════════════════════════════════════════════
 * 
 * Análise automatizada de peças gráficas via IA
 * Avaliação segundo as regras da marca Adapta
 * 
 * Funcionalidades:
 * - Upload de imagem (drag & drop)
 * - Seleção de plataforma
 * - Análise via edge function
 * - Nota geral + categorias detalhadas
 * - Sugestões e alertas
 */

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload, X, Loader2, CheckCircle2, XCircle, AlertTriangle,
  ChevronDown, Eye, Type, Palette, LayoutGrid,
  Monitor, Sparkles, RotateCcw, Info,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useTheme } from "../utils/theme-context";
const projectId = "mock_project_id";
const publicAnonKey = "mock_anon_key";
import { analisarPaletaReal } from "../utils/analise-paleta-real";

// ═══════════════════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════════════════

/**
 * MODO MOCK
 * Enquanto as credenciais do Supabase não estiverem configuradas,
 * o sistema usa respostas simuladas para demonstração.
 * 
 * Para ativar API real:
 * 1. Configure VITE_SUPABASE_PROJECT_ID e VITE_SUPABASE_ANON_KEY no .env
 * 2. Mude USE_MOCK_RESPONSES para false
 */
const USE_MOCK_RESPONSES = true;

// ═══════════════════════════════════════════════════════════════
//  MOCK RESPONSES
// ═══════════════════════════════════════════════════════════════

/**
 * CARTILHA CROMÁTICA ADAPTA v2026.1 - 45 CORES OFICIAIS
 * 9 espectros com tons oficiais
 */
const CARTILHA_CROMATICA = {
  // NEUTRAL SYSTEM (12 tons)
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
    '950': '#141A17', // Background principal - verde petróleo bem escuro
  },
  
  // VERDE CORE (Verde Petróleo)
  verdeCore: {
    '300': '#A3C4B4',
    '400': '#8FB09F',
    '500': '#6A8A7A', // Tom principal
    '600': '#557065',
    '700': '#445A4F',
  },
  
  // COLOR CORE - 9 espectros
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

/**
 * Converte hex para RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calcula distância entre duas cores (Delta E simplificado)
 */
function distanciaCor(cor1: string, cor2: string): number {
  const rgb1 = hexToRgb(cor1);
  const rgb2 = hexToRgb(cor2);
  if (!rgb1 || !rgb2) return 999;
  
  const dr = rgb1.r - rgb2.r;
  const dg = rgb1.g - rgb2.g;
  const db = rgb1.b - rgb2.b;
  
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Busca a cor oficial mais próxima
 */
function encontrarCorOficial(corHex: string): {
  oficial: boolean;
  corOficial: string | null;
  nomeOficial: string | null;
  distancia: number;
  espectro: string | null;
} {
  let menorDistancia = Infinity;
  let corMaisProxima = null;
  let nomeCorMaisProxima = null;
  let espectroMaisProximo = null;

  // Percorre TODA a cartilha cromática
  for (const [espectro, tons] of Object.entries(CARTILHA_CROMATICA)) {
    for (const [tom, hex] of Object.entries(tons)) {
      const dist = distanciaCor(corHex, hex);
      if (dist < menorDistancia) {
        menorDistancia = dist;
        corMaisProxima = hex;
        nomeCorMaisProxima = `${espectro.charAt(0).toUpperCase() + espectro.slice(1)} ${tom}`;
        espectroMaisProximo = espectro;
      }
    }
  }

  // TOLERÂNCIA RIGOROSA: distância < 10 = cor oficial
  // Cores de compressão podem ter variação de ~5-8 pontos
  // Mas "cores parecidas" (piratas) terão distância > 15
  const oficial = menorDistancia < 10;

  return {
    oficial,
    corOficial: corMaisProxima,
    nomeOficial: nomeCorMaisProxima,
    distancia: menorDistancia,
    espectro: espectroMaisProximo,
  };
}

/**
 * Detecta o tipo de peça e público-alvo baseado na plataforma e contexto
 */
function detectarTipoPeca(platform: string): {
  tipo: 'institucional' | 'campanha-especifica' | 'generico';
  publico: string;
  paletaPermitida: string[];
  paletaProibida: string[];
  explicacao: string;
} {
  // Em produção, a IA analisaria o CONTEÚDO da imagem (texto, elementos visuais)
  // Para MOCK, criamos cenários baseados em probabilidades mais realistas
  
  const tipos = [
    // ═══════════════════════════════════════════════════════════
    //  INSTITUCIONAL (20%) - Fala DA empresa/marca
    // ═══════════════════════════════════════════════════════════
    {
      tipo: 'institucional' as const,
      publico: 'Corporativo / Institucional',
      paletaPermitida: ['Neutral System', 'Verde Core (Verde Petróleo)'],
      paletaProibida: ['Color Core (Azul, Laranja, Rosa, etc)'],
      explicacao: 'Material INSTITUCIONAL: missão/valores, quem somos, apresentação de serviços/estrutura, interfaces do site/plataforma, vagas. DEVE usar APENAS Neutral + Verde Core.',
      peso: 0.20,  // REDUZIDO: maioria das peças de social media são campanhas
      keywords: ['missão', 'valores', 'quem somos', 'vaga', 'trabalhe conosco', 'nossa história', 'manifesto', 'nossos serviços', 'especialidades', 'atendimento', 'estrutura', 'equipe', 'agenda', 'painel', 'dashboard', 'interface', 'plataforma', 'sistema'],
    },
    
    // ═══════════════════════════════════════════════════════════
    //  CAMPANHAS ESPECÍFICAS (70%) - Estratégias de comunicação
    // ═══════════════════════════════════════════════════════════
    {
      tipo: 'campanha-especifica' as const,
      publico: 'Público infantil / Pediatria',
      paletaPermitida: ['Color Core vibrante (Rosa, Amarelo, Laranja, Azul)', 'Neutral System', 'Verde Core'],
      paletaProibida: [],
      explicacao: 'Campanha para CRIANÇAS e pais. DEVE usar Color Core vibrante e lúdico. Cores precisam ser EXATAS da Cartilha.',
      peso: 0.20,  // AUMENTADO: muito comum em saúde
      keywords: ['criança', 'infantil', 'pediatria', 'kids', 'pequenos', 'brincadeira', 'diversão', 'pais'],
    },
    {
      tipo: 'campanha-especifica' as const,
      publico: 'Datas comemorativas / Sazonais',
      paletaPermitida: ['Color Core temático', 'Neutral System', 'Verde Core'],
      paletaProibida: [],
      explicacao: 'Campanha SAZONAL (Dia das Mães, Natal, etc). Pode usar Color Core apropriado ao tema/emoção.',
      peso: 0.18,  // AUMENTADO: muito comum
      keywords: ['dia das mães', 'natal', 'páscoa', 'ano novo', 'festa junina', 'black friday', 'carnaval'],
    },
    {
      tipo: 'campanha-especifica' as const,
      publico: 'Conscientização / Educação em saúde',
      paletaPermitida: ['Color Core estratégico (Outubro Rosa, Novembro Azul, etc)', 'Neutral System', 'Verde Core'],
      paletaProibida: [],
      explicacao: 'Campanha de CONSCIENTIZAÇÃO. Pode usar Color Core alinhado ao movimento (Rosa para câncer de mama, Azul para próstata, etc).',
      peso: 0.15,  // AUMENTADO
      keywords: ['conscientização', 'prevenção', 'outubro rosa', 'novembro azul', 'setembro amarelo', 'saúde mental', 'vacinação'],
    },
    {
      tipo: 'campanha-especifica' as const,
      publico: 'Promoção / Oferta / Lançamento',
      paletaPermitida: ['Color Core para destaque', 'Neutral System', 'Verde Core'],
      paletaProibida: [],
      explicacao: 'Campanha PROMOCIONAL. Pode usar Color Core para criar urgência e conversão (Laranja, Amarelo, Vermelho).',
      peso: 0.10,  // AUMENTADO
      keywords: ['promoção', 'desconto', 'oferta', 'lançamento', 'novo', 'exclusivo', 'aproveite', 'garanta'],
    },
    {
      tipo: 'campanha-especifica' as const,
      publico: 'Bem-estar / Lifestyle / Engajamento',
      paletaPermitida: ['Color Core moderado', 'Neutral System', 'Verde Core'],
      paletaProibida: [],
      explicacao: 'Campanha de ENGAJAMENTO (bem-estar, nutrição, exercícios, dicas). Pode usar Color Core suave para atratividade.',
      peso: 0.07,  // AUMENTADO
      keywords: ['bem-estar', 'saúde', 'nutrição', 'exercício', 'dica', 'qualidade de vida', 'autocuidado'],
    },
    
    // ═══════════════════════════════════════════════════════════
    //  GENÉRICO (10%) - Sem segmentação clara
    // ═══════════════════════════════════════════════════════════
    {
      tipo: 'generico' as const,
      publico: 'Geral / Amplo',
      paletaPermitida: ['Neutral System', 'Verde Core', 'Color Core (apenas destaques pontuais)'],
      paletaProibida: [],
      explicacao: 'Material GENÉRICO sem público ou propósito específico. Preferível Neutral + Verde Core, Color Core só em destaques.',
      peso: 0.10,
      keywords: [],
    },
  ];

  // Para MOCK: seleciona tipo aleatório baseado nos pesos
  // Em produção: IA analisaria texto OCR + elementos visuais + contexto fornecido
  const random = Math.random();
  let acumulado = 0;
  for (const t of tipos) {
    acumulado += t.peso;
    if (random <= acumulado) {
      return {
        tipo: t.tipo,
        publico: t.publico,
        paletaPermitida: t.paletaPermitida,
        paletaProibida: t.paletaProibida,
        explicacao: t.explicacao,
      };
    }
  }

  return {
    tipo: tipos[tipos.length - 1].tipo,
    publico: tipos[tipos.length - 1].publico,
    paletaPermitida: tipos[tipos.length - 1].paletaPermitida,
    paletaProibida: tipos[tipos.length - 1].paletaProibida,
    explicacao: tipos[tipos.length - 1].explicacao,
  };
}

/**
 * NOTA: Função analisarPaletaCores foi movida para /src/utils/analise-paleta-real.ts
 * Agora usa extração REAL de cores com ColorThief + Delta E (não é mais mock!)
 */

async function generateMockAnalysis(platform: string, imageUrl: string): Promise<AnalysisResult> {
  const platformName = PLATFORMS.find(p => p.id === platform)?.label || platform;
  
  // NOVA LÓGICA: Detecta tipo de peça e valida paleta REAL
  const tipoPeca = detectarTipoPeca(platform);
  const analiseCores = await analisarPaletaReal(imageUrl, tipoPeca);
  
  // Detecta cores piratas
  const temCoresPiratas = analiseCores.coresPiratas && analiseCores.coresPiratas.length > 0;
  
  // Nota geral influenciada pela análise de cores
  const notaCores = analiseCores.nota;
  const notaOutras = 7 + Math.random() * 2; // 7-9 para outras categorias
  const notaGeral = Math.round(((notaCores * 0.4) + (notaOutras * 0.6)) * 10) / 10;
  const aprovado = notaGeral >= 6.0;

  const categorias: CategoryResult[] = [
    {
      id: "leitura",
      nome: "Leitura e Contraste",
      nota: Math.round((7 + Math.random() * 2.5) * 10) / 10,
      peso: 20,
      problemas: notaGeral < 7.5 ? ["Contraste do texto principal pode ser melhorado"] : [],
      sugestoes: ["Use cores da Cartilha Cromática para garantir acessibilidade"],
    },
    {
      id: "hierarquia",
      nome: "Hierarquia Visual",
      nota: Math.round((7.5 + Math.random() * 2) * 10) / 10,
      peso: 15,
      problemas: [],
      sugestoes: notaGeral < 8 ? ["Destaque ainda mais o título principal"] : [],
    },
    {
      id: "cores",
      nome: "Paleta de Cores",
      nota: notaCores,
      peso: 35, // PESO AUMENTADO - cores são críticas
      problemas: [
        ...analiseCores.problemas,
        // Só adiciona problema de contexto se NÃO houver cores piratas
        ...(tipoPeca.tipo === 'institucional' && analiseCores.usoColorCore && !temCoresPiratas
          ? ['🚨 Tipo de peça: INSTITUCIONAL - Color Core OFICIAL é PROIBIDO']
          : []
        ),
      ],
      sugestoes: [
        `📋 Tipo detectado: ${tipoPeca.publico}`,
        `✓ Paleta permitida: ${tipoPeca.paletaPermitida.join(', ')}`,
        ...(tipoPeca.paletaProibida.length > 0 
          ? [`❌ Paleta proibida: ${tipoPeca.paletaProibida.join(', ')}`]
          : []
        ),
        `🎨 Cores detectadas: ${analiseCores.coresDetectadas.join(', ')}`,
        ...analiseCores.sugestoes,
      ],
      metadata: {
        tipoPeca: tipoPeca.tipo,
        publico: tipoPeca.publico,
        explicacao: tipoPeca.explicacao,
        coresDetectadas: analiseCores.coresDetectadas,
        usoColorCore: analiseCores.usoColorCore,
        usoNeutral: analiseCores.usoNeutral,
        usoVerdeCore: analiseCores.usoVerdeCore,
      },
    },
    {
      id: "tipografia",
      nome: "Tipografia",
      nota: Math.round((7 + Math.random() * 2) * 10) / 10,
      peso: 15,
      problemas: notaGeral < 7 ? ["Tamanho da fonte pode estar pequeno demais para mobile"] : [],
      sugestoes: ["Use a fonte Geist para melhor legibilidade"],
    },
    {
      id: "plataforma",
      nome: `Adequação ${platformName}`,
      nota: Math.round((7.5 + Math.random() * 2) * 10) / 10,
      peso: 15,
      problemas: platform === "instagram-post" && notaGeral < 8 
        ? ["Verifique se a assinatura Adapta está visível"]
        : [],
      sugestoes: platform === "instagram-post"
        ? ["Evite elementos importantes nas zonas de cobertura (avatar e ações)"]
        : [],
    },
  ];

  const pontosFortes = [];
  const alertasCriticos = [];

  // Alertas críticos APENAS se Color Core OFICIAL usado indevidamente em institucional
  // NÃO alertar se já tiver cores piratas (problema maior já detectado)
  if (tipoPeca.tipo === 'institucional' && analiseCores.usoColorCore && !temCoresPiratas) {
    alertasCriticos.push('🚨 Color Core OFICIAL usado em material INSTITUCIONAL - substituir urgentemente');
    alertasCriticos.push('Material corporativo só aceita Neutral System + Verde Core');
  }
  
  // Alerta para cores piratas (problema mais grave que contexto errado)
  if (temCoresPiratas) {
    alertasCriticos.push('🚨 CORES PIRATAS DETECTADAS - códigos HEX não são da Cartilha oficial');
    if (tipoPeca.publico.includes('infantil') || tipoPeca.tipo === 'campanha-especifica') {
      alertasCriticos.push(`✓ Color Core PERMITIDO para ${tipoPeca.publico.toLowerCase()}, mas DEVE usar cores OFICIAIS`);
    }
  }

  if (notaGeral >= 8 && !alertasCriticos.length) {
    pontosFortes.push(
      "Excelente uso das cores da Cartilha Cromática",
      "Paleta adequada ao tipo de peça e público-alvo",
      "Hierarquia visual bem definida",
      "Legibilidade adequada para a plataforma"
    );
  } else if (notaGeral >= 7 && !alertasCriticos.length) {
    pontosFortes.push(
      "Boa aplicação das cores da marca",
      "Composição equilibrada"
    );
  } else if (!alertasCriticos.length) {
    pontosFortes.push("Composição básica adequada");
  }

  if (notaGeral < 6) {
    alertasCriticos.push("Peça precisa de ajustes antes de publicação");
  }

  let resumo = "";
  if (aprovado && alertasCriticos.length === 0) {
    resumo = `Peça aprovada com nota ${notaGeral.toFixed(1)}. ${
      notaGeral >= 8 
        ? `Excelente trabalho! Paleta correta para ${tipoPeca.publico.toLowerCase()}.` 
        : "Alguns ajustes menores podem melhorar ainda mais o resultado."
    }`;
  } else {
    resumo = `Peça ${alertasCriticos.length > 0 ? 'REPROVADA' : 'aprovada com ressalvas'} - nota ${notaGeral.toFixed(1)}. ${
      alertasCriticos.length > 0 
        ? 'Correção urgente necessária na paleta de cores.' 
        : 'Necessita revisão antes de publicação.'
    }`;
  }

  return {
    notaGeral,
    aprovado: aprovado && alertasCriticos.length === 0,
    categorias,
    resumo,
    pontosFortes,
    alertasCriticos,
  };
}

// ═══════════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════════

interface CategoryResult {
  id: string;
  nome: string;
  nota: number;
  peso: number;
  problemas: string[];
  sugestoes: string[];
  metadata?: {
    tipoPeca: 'institucional' | 'campanha-especifica' | 'generico';
    publico: string;
    explicacao: string;
    coresDetectadas: string[];
    usoColorCore: boolean;
    usoNeutral: boolean;
    usoVerdeCore: boolean;
  };
}

interface AnalysisResult {
  notaGeral: number;
  aprovado: boolean;
  categorias: CategoryResult[];
  resumo: string;
  pontosFortes: string[];
  alertasCriticos: string[];
}

const PLATFORMS = [
  { id: "instagram-post", label: "Instagram Post", desc: "1080 x 1080" },
  { id: "instagram-carrossel", label: "Instagram Carrossel", desc: "Slide individual" },
  { id: "instagram-reels", label: "Reels / Stories", desc: "1080 x 1920" },
  { id: "linkedin", label: "LinkedIn", desc: "1200 x 627" },
  { id: "apresentacao", label: "Apresentação", desc: "16:9" },
  { id: "impresso", label: "Impresso", desc: "CMYK" },
  { id: "email", label: "Email Marketing", desc: "600px largura" },
  { id: "generico", label: "Outro / Genérico", desc: "Formato livre" },
] as const;

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  leitura: Eye,
  hierarquia: LayoutGrid,
  cores: Palette,
  tipografia: Type,
  plataforma: Monitor,
};

const CATEGORY_COLORS: Record<string, string> = {
  leitura: "#8FA89B",
  hierarquia: "#6A8A7A",
  cores: "#8FA89B",
  tipografia: "#6A8A7A",
  plataforma: "#8FA89B",
};

function getScoreColor(nota: number): string {
  if (nota >= 8) return "#8FA89B";
  if (nota >= 6) return "#C8D1CD";
  if (nota >= 4) return "#7A8A83";
  return "#5A6A63";
}

function getScoreLabel(nota: number): string {
  if (nota >= 8) return "Excelente";
  if (nota >= 6) return "Aprovado";
  if (nota >= 4) return "Insuficiente";
  return "Crítico";
}

// ═══════════════════════════════════════════════════════════════
//  SCORE RING COMPONENT
// ═══════════════════════════════════════════════════════════════

function ScoreRing({ score, size = 140 }: { score: number; size?: number }) {
  const { isDark } = useTheme();
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(score / 10, 1);
  const offset = circ * (1 - pct);
  const color = getScoreColor(score);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={r} 
          fill="none" 
          stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)"} 
          strokeWidth={8} 
        />
        <motion.circle
          cx={size / 2} 
          cy={size / 2} 
          r={r} 
          fill="none"
          stroke={color} 
          strokeWidth={8} 
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          className="text-5xl font-bold tabular-nums"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        >
          {score.toFixed(1)}
        </motion.div>
        <div className="text-xs text-muted-foreground mt-1 font-medium">
          / 10
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CATEGORY CARD COMPONENT
// ═══════════════════════════════════════════════════════════════

function CategoryCard({ cat }: { cat: CategoryResult }) {
  const { isDark } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const Icon = CATEGORY_ICONS[cat.id] || Info;
  const accentColor = CATEGORY_COLORS[cat.id] || "#8FA89B";
  const scoreColor = getScoreColor(cat.nota);
  const hasIssues = cat.problemas.length > 0 || cat.sugestoes.length > 0;

  return (
    <Card className="overflow-hidden border-border">
      <button
        onClick={() => hasIssues && setExpanded(!expanded)}
        className="w-full flex items-center gap-2 p-3 text-left transition-colors hover:bg-muted/30"
        style={{ cursor: hasIssues ? "pointer" : "default" }}
      >
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ 
            backgroundColor: isDark ? `${accentColor}15` : `${accentColor}10`,
          }}
        >
          <Icon className="w-4 h-4" style={{ color: accentColor }} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate">{cat.nome}</p>
          <p className="text-[10px] text-muted-foreground">
            Peso {cat.peso}%
            {cat.problemas.length > 0 && ` · ${cat.problemas.length} problema${cat.problemas.length > 1 ? "s" : ""}`}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-xl font-bold tabular-nums" style={{ color: scoreColor }}>
              {cat.nota}
            </div>
          </div>
          {hasIssues && (
            <motion.div 
              animate={{ rotate: expanded ? 180 : 0 }} 
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </motion.div>
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-3 space-y-2 bg-muted/20">
              {cat.problemas.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <XCircle className="w-3 h-3 text-neutral-500" />
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                      Problemas
                    </p>
                  </div>
                  <div className="space-y-1 ml-5">
                    {cat.problemas.map((p, i) => (
                      <p key={i} className="text-xs text-foreground leading-relaxed">
                        • {p}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              
              {cat.sugestoes.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3 h-3 text-neutral-400" />
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                      Sugestões
                    </p>
                  </div>
                  <div className="space-y-1 ml-5">
                    {cat.sugestoes.map((s, i) => (
                      <p key={i} className="text-xs text-foreground leading-relaxed">
                        • {s}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

interface GraphicAnalyzerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GraphicAnalyzer({ isOpen, onClose }: GraphicAnalyzerProps) {
  const { isDark } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [platform, setPlatform] = useState("instagram-post");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione uma imagem (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Imagem muito grande. Máximo 10MB.");
      return;
    }
    setError(null);
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageData(e.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleAnalyze = async () => {
    if (!imageData) return;
    setLoading(true);
    setError(null);
    setResult(null);

    // MODO MOCK: Análise com extração REAL de cores
    if (USE_MOCK_RESPONSES) {
      try {
        // Delay reduzido para análise real (500-1000ms)
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
        const mockResult = await generateMockAnalysis(platform, imageData);
        setResult(mockResult);
        setLoading(false);
      } catch (err: any) {
        console.error("Mock analysis error:", err);
        setError("Erro ao gerar análise simulada. Tente novamente.");
        setLoading(false);
      }
      return;
    }

    // MODO API REAL: Chamada para Supabase Edge Function
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92b477aa/analyze-piece`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            image: imageData,
            platform: PLATFORMS.find(p => p.id === platform)?.label || platform,
            description: description || undefined,
          }),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(errData.error || `Erro ${res.status}`);
      }

      const analysis: AnalysisResult = await res.json();
      setResult(analysis);
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err.message || "Erro ao analisar a peça. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageData(null);
    setImageName("");
    setResult(null);
    setError(null);
    setDescription("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ 
              background: isDark 
                ? "linear-gradient(135deg, #6A8A7A 0%, #8FA89B 100%)"
                : "linear-gradient(135deg, #445A4F 0%, #6A8A7A 100%)"
            }}
          >
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">Análise de Peça Gráfica</h2>
            <p className="text-xs text-muted-foreground">
              Avaliação automática segundo as regras da marca Adapta
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!result && !loading && (
            <div className="space-y-5">
              {/* Upload Zone */}
              <div
                className={`relative rounded-xl overflow-hidden transition-all cursor-pointer ${
                  dragOver ? "ring-2 ring-neutral-600 ring-offset-2 ring-offset-background" : ""
                }`}
                style={{
                  border: `2px dashed ${dragOver ? "var(--neutral-600)" : "var(--border)"}`,
                  backgroundColor: dragOver ? (isDark ? "rgba(143, 168, 155, 0.08)" : "rgba(106, 138, 122, 0.05)") : "transparent",
                  minHeight: imageData ? "auto" : 200,
                }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !imageData && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />

                {imageData ? (
                  <div className="relative">
                    <img 
                      src={imageData} 
                      alt="Preview" 
                      className="w-full max-h-[320px] object-contain rounded-lg" 
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="backdrop-blur-md bg-black/70 hover:bg-black/80 text-white"
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      >
                        <RotateCcw className="w-4 h-4 mr-1.5" />
                        Trocar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="backdrop-blur-md"
                        onClick={(e) => { e.stopPropagation(); handleReset(); }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg backdrop-blur-md bg-black/70">
                      <p className="text-xs text-white truncate max-w-[250px] font-medium">
                        {imageName}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <motion.div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-neutral-900/50"
                      animate={dragOver ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                    >
                      <Upload className="w-8 h-8 text-neutral-400" />
                    </motion.div>
                    <p className="text-sm font-semibold mb-1">
                      Arraste a peça aqui
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ou clique para selecionar · PNG, JPG, WEBP · max 10MB
                    </p>
                  </div>
                )}
              </div>

              {/* Platform Selector */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                  Plataforma / Formato
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PLATFORMS.map(p => {
                    const selected = platform === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPlatform(p.id)}
                        className={`p-3 rounded-lg text-left transition-all ${
                          selected 
                            ? "bg-neutral-800/30 ring-2 ring-neutral-700" 
                            : "bg-muted/50 hover:bg-muted border border-border"
                        }`}
                      >
                        <p className={`text-xs font-semibold ${selected ? "text-foreground" : "text-muted-foreground"}`}>
                          {p.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Context */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                  Contexto adicional <span className="text-muted-foreground/50">(opcional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Slide 1 de um carrossel de Dia das Mães, público feminino 25-45..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-neutral-600 bg-muted/50 border border-border placeholder:text-muted-foreground/40"
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20"
                >
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </motion.div>
              )}

              {/* Analyze Button */}
              <motion.div
                whileTap={{ scale: imageData && !loading ? 0.98 : 1 }}
                transition={{ duration: 0.1 }}
              >
                <Button
                  onClick={handleAnalyze}
                  disabled={!imageData || loading}
                  className="w-full h-12 text-sm font-semibold transition-all hover:shadow-lg active:shadow-sm"
                  style={{
                    background: imageData 
                      ? (isDark 
                        ? "linear-gradient(135deg, #6A8A7A 0%, #8FA89B 100%)" 
                        : "linear-gradient(135deg, #445A4F 0%, #6A8A7A 100%)")
                      : undefined,
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analisando com IA...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Analisar Peça
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6 bg-neutral-900/50"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Eye className="w-12 h-12 text-neutral-400" />
              </motion.div>
              <p className="text-base font-semibold mb-2">
                Analisando a peça...
              </p>
              <p className="text-sm text-muted-foreground">
                Verificando regras da marca, contraste, hierarquia e plataforma
              </p>
              <div className="mt-6 flex gap-2">
                {[0, 1, 2, 3, 4].map(i => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-neutral-600"
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Results */}
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Verdict Card - Compacto */}
              <Card 
                className="relative overflow-hidden border-neutral-700"
                style={{
                  backgroundColor: isDark ? "rgba(143, 168, 155, 0.05)" : "rgba(106, 138, 122, 0.03)",
                  borderWidth: 2,
                }}
              >
                <CardContent className="relative z-10 p-5">
                  <div className="flex items-center gap-6">
                    {/* Score Ring - Menor */}
                    <div className="shrink-0">
                      <ScoreRing score={result.notaGeral} size={110} />
                    </div>

                    {/* Info e Preview */}
                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <Badge 
                          variant={result.aprovado ? "default" : "destructive"}
                          className="mb-2 text-xs font-bold uppercase tracking-wider px-3 py-1"
                          style={{
                            backgroundColor: result.aprovado ? "rgba(143, 168, 155, 0.2)" : "rgba(122, 138, 131, 0.2)",
                            color: result.aprovado ? "#8FA89B" : "#7A8A83",
                            borderColor: result.aprovado ? "rgba(143, 168, 155, 0.3)" : "rgba(122, 138, 131, 0.3)",
                          }}
                        >
                          {result.aprovado ? (
                            <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1 inline" />
                          )}
                          {result.aprovado ? "Aprovado" : "Reprovado"}
                        </Badge>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {result.resumo}
                        </p>
                      </div>

                      {/* Image Preview Inline */}
                      {imageData && (
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 border border-border">
                          <img 
                            src={imageData} 
                            alt="Analyzed" 
                            className="w-10 h-10 rounded object-cover" 
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate">{imageName}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {PLATFORMS.find(p => p.id === platform)?.label}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            className="h-7 text-xs"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Nova
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alertas e Pontos Fortes - Lado a Lado */}
              {((result.alertasCriticos && result.alertasCriticos.length > 0) || 
                (result.pontosFortes && result.pontosFortes.length > 0)) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Critical Alerts */}
                  {result.alertasCriticos && result.alertasCriticos.length > 0 && (
                    <Card className="border-destructive/20 bg-destructive/5">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                          <p className="text-[10px] font-bold uppercase tracking-wide text-destructive">
                            Alertas Críticos
                          </p>
                        </div>
                        <div className="space-y-1">
                          {result.alertasCriticos.map((a, i) => (
                            <p key={i} className="text-xs text-foreground">• {a}</p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Strong Points */}
                  {result.pontosFortes && result.pontosFortes.length > 0 && (
                    <Card className="border-neutral-700/50" style={{ backgroundColor: isDark ? "rgba(143, 168, 155, 0.05)" : "rgba(106, 138, 122, 0.03)" }}>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-neutral-400" />
                          <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                            Pontos Fortes
                          </p>
                        </div>
                        <div className="space-y-1">
                          {result.pontosFortes.map((p, i) => (
                            <p key={i} className="text-xs text-foreground">• {p}</p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Category Scores - Grid Compacto */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Detalhamento por Categoria
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.categorias.map((cat, i) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <CategoryCard cat={cat} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
