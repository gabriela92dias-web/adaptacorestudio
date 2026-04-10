import { useState } from "react";
import { toast } from "sonner";
import { useCreateCampaign } from "../../helpers/useApi";
import {
  useCreateInitiative,
  useCreateProject,
  useCreateStage,
  useCreateTask,
} from "../../helpers/useCoreActApi";
import { WIZARD_TYPE_TO_CAMPAIGN_TYPE } from "./wizard-constants";
import {
  aiTemaSchema,
  aiProposicaoSchema,
  aiOrcamentoSchema,
  aiBlueprintSchema,
  aiActionPlanSchema,
} from "./wizard-schemas";

// ─────────────────────────────────────────────────────────────
// PERSONA — Adapta V8 (Engenheiro Estratégico de Cuidado)
// Vocabulário proibido: cliente, venda, lucro, marketing, lead,
//   público-alvo, retenção, upsell, escalar, funil de vendas.
// Vocabulário aprovado: associado, acesso, sustentabilidade,
//   comunidade, continuidade do cuidado, adesão consciente,
//   pessoas que podem se beneficiar, divulgação institucional.
// ─────────────────────────────────────────────────────────────

const ADAPTA_SYSTEM_PERSONA = `
Você é o Engenheiro Estratégico de Cuidado V8 da Adapta — uma associação de cannabis medicinal brasileira (3º Setor), regulamentada pela RDC 1014/2026 da Anvisa.

REGRAS DE VOCABULÁRIO (violá-las invalida a resposta):
❌ PROIBIDO usar: cliente, venda, lucro, mercado, marketing, campanha publicitária, público-alvo, retenção, lead, upsell, escalar, base de clientes, conversão, funil de vendas, taxa de conversão, CAC.
✅ OBRIGATÓRIO usar: associado, acesso, sustentabilidade, cenário/setor, comunicação institucional, pessoas que podem se beneficiar, continuidade do cuidado, ampliação do cuidado, crescimento orgânico, comunidade, adesão consciente, fluxo de entendimento, custo de acesso, impacto acumulado.

CONTEXTO:
- A Adapta NÃO é empresa. Toda comunicação é um ato de cuidado e de conformidade regulatória.
- Fase atual da marca: Fase 2 — tornar-se reconhecível e desejável sem perder a confiança.
- Arquétipos: Acolhedora · Acessível · Regional (CE) · Técnica.
- Tom: acolhedor + científico + pioneiro. NUNCA emocionalismo raso. NUNCA promessas implícitas.
- Comunicação é infraestrutura de cuidado, não ferramenta de persuasão.
`.trim();

// ─────────────────────────────────────────────────────────────
// SANITIZADOR DE VOCABULÁRIO — Barreira final obrigatória
// Intercepta qualquer saída da IA e substitui termos proibidos
// ANTES de renderizar na UI. Não depende do system prompt.
// ─────────────────────────────────────────────────────────────
const VOCAB_SUBSTITUTIONS: [RegExp, string][] = [
  // Termos comerciais diretos
  [/\bclientes?\b/gi, "associados"],
  [/\bcliente\b/gi, "associado"],
  [/\bvenda[s]?\b/gi, "acesso"],
  [/\bvendendo\b/gi, "ampliando o acesso"],
  [/\bvender\b/gi, "ampliar o acesso"],
  [/\blead[s]?\b/gi, "pessoas interessadas"],
  [/\bmarketing\b/gi, "comunicação institucional"],
  [/\bcampanha publicit[aá]ria\b/gi, "iniciativa institucional"],
  [/\bpúblico[- ]alvo\b/gi, "comunidade"],
  [/\bfideliz\w+\b/gi, "engajar"],
  [/\bretên[çc][aã]o\b/gi, "continuidade do cuidado"],
  [/\bupsell\b/gi, "ampliação de acesso"],
  [/\btaxa de convers[aã]o\b/gi, "taxa de adesão"],
  [/\bconvers[aã]o\b/gi, "adesão"],
  [/\bCAC\b/g, "custo de acesso"],
  [/\bROI\b/g, "impacto acumulado"],
  [/\bescalar\b/gi, "ampliar"],
  [/\binfluenciadora?s?\b/gi, "parceiras de comunicação"],
  [/\bsua marca\b/gi, "a Adapta"],
  [/\bfunil de vendas\b/gi, "jornada do associado"],
  [/\blucro\b/gi, "sustentabilidade financeira"],
  [/\bcompras?\b/gi, "acesso"],
  [/\bconsumidor[as]?\b/gi, "associado"],
];

function sanitizeVocabulary(text: string): string {
  let result = text;
  for (const [pattern, replacement] of VOCAB_SUBSTITUTIONS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

function sanitizePropositions(props: string[]): string[] {
  return props.map(sanitizeVocabulary);
}

const NATUREZA_CONTEUDO_OPTIONS = ["técnico", "institucional", "educativo", "cultural", "acadêmico", "político-social"];

export function useCampaignWizard(onClose: () => void) {
  const { mutateAsync: saveCampaign } = useCreateCampaign();
  const { mutateAsync: createInitiative } = useCreateInitiative();
  const { mutateAsync: createProject } = useCreateProject();
  const { mutateAsync: createStage } = useCreateStage();
  const { mutateAsync: createTask } = useCreateTask();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [step, setStep] = useState(0);

  // ── DNA DA CAMPANHA (Bloco 1 — Hub Omnicanal) ──────────────
  const [rawName, setRawName] = useState("");
  const [direcao, setDirecao] = useState<"interna" | "externa" | "hibrida">("externa");
  const [experiencia, setExperiencia] = useState<"presencial" | "digital" | "hibrida">("digital");
  const [modulos, setModulos] = useState({
    fisico: false,
    digital: true,
    evento: false,
    governanca: true,
  });
  const [proposicao, setProposicao] = useState("");
  const [suggestedPropositions, setSuggestedPropositions] = useState<string[]>([]);
  const [orcamento, setOrcamento] = useState("");

  // V8 Deterministic Modifiers
  const [eventoPublico, setEventoPublico] = useState<number>(0);
  const [eventoDuracao, setEventoDuracao] = useState<number>(0);

  // AI outputs
  const [aiGeneratedType, setAiGeneratedType] = useState<string>("institucional");
  const [activeFunnels, setActiveFunnels] = useState<Record<string, boolean>>({});

  // Step 1: Trilhas Paralelas (Módulo A — Interna / Módulo B — Externa)
  const [aiTrilhaInterna, setAiTrilhaInterna] = useState<string[]>([]);
  const [aiTrilhaExterna, setAiTrilhaExterna] = useState<string[]>([]);

  // Step 2: Orçamento detalhado por linha de categoria
  const [aiOrcamentoLinhas, setAiOrcamentoLinhas] = useState<
    { categoria: string; valor_estimado: number; motivo: string }[]
  >([]);
  const [aiOrcamentoTotal, setAiOrcamentoTotal] = useState(0);

  const [blueprintTheory, setBlueprintTheory] = useState("");

  async function callOpenAI(system: string, user: string) {
    const res = await fetch("/_api/ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, user }),
    });
    if (!res.ok) {
      let errMsg = `A OpenAI retornou erro ${res.status}.`;
      try {
        const d = await res.json();
        if (d.error?.message) errMsg = d.error.message;
      } catch {}
      throw new Error(errMsg);
    }
    const data = await res.json();
    return data.choices[0].message.content;
  }

  // ── STEP 0 → 1: Gerar Proposições Sistêmicas ─────────────────
  const nextStepTema = async () => {
    if (!rawName.trim()) return;
    setIsGenerating(true);
    let aiProps: string[] = [];

    try {
      const payload = await callOpenAI(
        `${ADAPTA_SYSTEM_PERSONA}

Retorne EXATAMENTE um JSON: { "proposicoes": ["Tese 1", "Tese 2", "Tese 3"] }.

Crie 3 proposições centrais de ação/iniciativa com base em ARQUITETURA SISTÊMICA.
Use conceitos de alta densidade: 'Ressonância', 'Empatia Sistêmica', 'Alavancagem Tática', 'Projeção', 'Extração de Comunidade', 'Convergência', 'Pertencimento Estrutural', 'Continuidade do Cuidado'.

Formato mandatório: "[Nome do Conceito Sistêmico]: [Ação arquitetural para o tema]"
Máximo: 25 palavras por proposição.

NUNCA use: publicidade, vendas, leads, marketing, narrativas infantis (fadas, floresta, magia).
SEMPRE use o vocabulário aprovado da Adapta.

Exemplo válido: "Empatia Sistêmica — Dia das Mães: Estruturar acesso ao cuidado a partir da narrativa de quem cuida, ativando continuidade pela comunidade de associadas."`,
        `Tema da iniciativa: "${rawName}"\nDireção: ${direcao} | Experiência: ${experiencia}`
      );

      const cleaned = payload.replace(/```json|```/gi, "").trim();
      const parsed = JSON.parse(cleaned);
      const validation = aiTemaSchema.safeParse(parsed);

      if (!validation.success) {
        aiProps = parsed.proposicoes || Object.values(parsed)[0] || [];
        if (!Array.isArray(aiProps) || aiProps.length < 3)
          throw new Error("Schema inválido e fallback de parsing falhou");
      } else {
        aiProps = validation.data.proposicoes;
      }
    } catch (e: any) {
      toast.warning("Sistema I.A. Padrão ativado: " + e.message);
      const t = rawName.trim()
        ? rawName.charAt(0).toUpperCase() + rawName.slice(1)
        : "Ação";
      // Fallback com vocabulário correto
      aiProps = [
        `Ressonância Institucional (${t}): Estruturar a iniciativa como ponto de convergência entre a comunidade e o sistema de cuidado.`,
        `Alavancagem Tática (${t}): Concentrar esforço em um único eixo mobilizador que amplie o acesso e sustente a continuidade do cuidado.`,
        `Pertencimento Estrutural (${t}): Integrar os associados à iniciativa como co-autores, gerando engajamento orgânico e enraizamento comunitário.`,
      ];
    }

    // Classificação determinística por natureza do tema
    const lower = rawName.toLowerCase();
    let type = "institucional";
    let funnels = { awareness: true, consideration: true, conversion: false, retention: false, expansion: false };

    if (lower.includes("mutirão") || lower.includes("acolhimento") || lower.includes("evento")) {
      type = "acolhimento";
      funnels = { awareness: false, consideration: false, conversion: true, retention: true, expansion: true };
    } else if (lower.includes("médico") || lower.includes("congresso") || lower.includes("pesquisa") || lower.includes("acadêm")) {
      type = "medicos";
      funnels = { awareness: true, consideration: true, conversion: true, retention: false, expansion: false };
    } else if (lower.includes("sazonal") || lower.includes("dia das") || lower.includes("data comemorativa")) {
      type = "sazonal";
      funnels = { awareness: true, consideration: true, conversion: false, retention: true, expansion: true };
    } else if (lower.includes("treinamento") || lower.includes("capacitação") || lower.includes("alinhamento")) {
      type = "interno";
      funnels = { awareness: false, consideration: false, conversion: false, retention: true, expansion: false };
    }

    setAiGeneratedType(type);
    setActiveFunnels(funnels);
    setSuggestedPropositions(sanitizePropositions(aiProps)); // barreira de vocabulário
    setIsGenerating(false);

    setStep(1);
  };

  // ── STEP 1 → 2: Trilhas Paralelas (Árvore-Mãe — Bloco 3 + Bloco 5A/5B) ──
  const nextStepProposicao = async (suppliedProp?: string) => {
    const finalProp = typeof suppliedProp === "string" ? suppliedProp : proposicao;
    setIsGenerating(true);
    setProposicao(finalProp);

    setTimeout(() => {
      // ── MÓDULO A: CAMADA INTERNA ─────────────────────────────
      // Regra V8: se for híbrida, a camada interna SEMPRE existe.
      let trilhaInterna: string[] = [];

      const precisaLayerInterna = direcao === "interna" || direcao === "hibrida";
      if (precisaLayerInterna) {
        // Layer 1 — Definição & Governança
        trilhaInterna.push(
          "L-GATE 1 | Aprovação da iniciativa: definir quem aprova, prazo e versão final",
          "L-GATE 1 | LGPD: definir se haverá coleta de dados, termo de imagem e política de inscrição",
          "L-GATE 1 | Mapeamento de risco: preparar FAQ com perguntas difíceis e definir escalonamento (quando acionar diretoria/jurídico)",
          "L-GATE 1 | Claim-check: garantir que nenhuma peça faça promessas não sustentáveis",
          // Kit interno mandatório para híbrida/interna
          "Kit interno: produzir 1-pager de alinhamento com objetivos, tom e o que NÃO dizer publicamente",
          "Kit interno: preparar FAQ de atendimento (respostas rápidas para perguntas recorrentes)",
          "Kit interno: definir scripts de comunicação (o que falar / o que não falar por canal)"
        );

        // Treinamento do time
        trilhaInterna.push(
          "Treinamento do time: formato síncrono (briefing) + assíncrono (material de consulta)",
          "Treinamento do time: teste de validação pós-briefing (critério de pronto: % do time aprovado com nota mínima)"
        );

        if (experiencia === "presencial" || experiencia === "hibrida") {
          trilhaInterna.push(
            "Materiais de identificação: uniforme, crachá ou pulseira por tier (quantidade + tamanhos)",
            "Logística interna: convite da equipe, definição de ponto de encontro e horário de chegada do staff"
          );
          if (eventoDuracao > 3) {
            trilhaInterna.push("Alimentação da equipe: coffee ou refeição para staff (mandatório para eventos acima de 3h)");
          }
        }
      }

      // Se for apenas externa, ainda precisa de governança mínima
      if (direcao === "externa") {
        trilhaInterna.push(
          "L-GATE 1 | Aprovação da iniciativa: quem aprova, prazo e versão final",
          "L-GATE 1 | LGPD: coleta de dados, termo de imagem, política de privacidade",
          "L-GATE 1 | Risco: FAQ com perguntas difíceis e protocolo de escalonamento"
        );
      }

      // ── MÓDULO B: CAMADA EXTERNA ─────────────────────────────
      let trilhaExterna: string[] = [];

      // Layer 1 — Modelo de acesso e tiers
      if (direcao === "externa" || direcao === "hibrida") {
        trilhaExterna.push(
          "Modelo de acesso: definir aberto / fechado / segmentado por tiers",
          "Tiers possíveis a configurar: associados · comunidade médica · convidados · sociedade · imprensa · parceiros",
          "Para cada tier ativo: definir elegibilidade, validação, cota de vagas, janela de inscrição e benefício"
        );
      }

      // Layer 2 — Produção & Operação (Presencial)
      if (experiencia === "presencial" || experiencia === "hibrida") {
        trilhaExterna.push(
          "Inscrição: plataforma (form/Sympla/lista), limite de vagas, lista de espera e prazo de confirmação",
          "Check-in: sim/não · tipo de credencial (crachá/pulseira) · validação (lista/CRM/documento)",
          "Programação: blocos de agenda, duração de cada bloco, espaço para Q&A",
          "Convidados/palestrantes: papel (fala/mediação/presença), logística, termo de imagem",
          "Certificado: sim/não · para quais tiers",
          "Captação A/V: foto e vídeo, responsável, entregáveis pós-evento",
          "Infraestrutura: capacidade do local, acessibilidade, segurança, contrato de locação",
          "Sinalização: credenciamento, pontos de informação, identidade visual aplicada"
        );
        if (eventoDuracao > 3) {
          trilhaExterna.push("Coffee/alimentação: formato (coffee break/refeição), quantidade, restrições alimentares");
        }
        if (eventoPublico >= 30) {
          trilhaExterna.push("Estrutura sanitária verificada (capacidade de banheiros para +30 pessoas)");
        }
        trilhaExterna.push(
          "Conversão/adesão no local: haverá cadastro presencial? (QR/form/tablet) · campos obrigatórios · fluxo LGPD",
          "Follow-up pós-evento: definir quem faz, SLA de resposta e script de acompanhamento"
        );
      }

      // Layer 2 — Produção & Operação (Digital)
      if (experiencia === "digital" || experiencia === "hibrida") {
        trilhaExterna.push(
          "Frentes digitais: definir quais estão ativas (orgânico / ads / landing / WhatsApp / e-mail / PR / comunidades)",
          "Orgânico: qty de peças por formato (feed, reels, stories), frequência e datas de publicação",
          "Ads (se ativo): objetivo · audiência · orçamento diário (R$) · qty de criativos · plataforma",
          "Landing/form: campos obrigatórios · aceite LGPD · destino após envio · e-mail de confirmação",
          "WhatsApp: inbound ou outbound · scripts aprovados · SLA de resposta (ex: 4h úteis) · quem responde",
          "E-mail/PR: sequência de envios · pauta para imprensa · lista de distribuição",
          "Tracking: UTM por frente · eventos configurados (view / submit / clique WhatsApp) · ferramenta de análise"
        );
      }

      // "Finalmentes" verificáveis — resultados com meta numérica (Bloco 5D)
      trilhaExterna.push("─── FINALMENTES (resultados verificáveis) ───");

      if (direcao === "interna") {
        trilhaExterna.push(
          "Meta interna: % do time com participação confirmada até [data]",
          "Meta interna: % do time aprovado no teste pós-briefing (nota mínima definida)",
          "Meta interna: redução de erros ou dúvidas operacionais após a iniciativa"
        );
      }
      if (experiencia === "presencial" || experiencia === "hibrida") {
        trilhaExterna.push(
          "Meta presencial: nº de inscrições por tier confirmadas até [data]",
          "Meta presencial: taxa de comparecimento em relação às inscrições (%)",
          "Meta presencial: nº de adesões (associações/cadastros) realizadas no local"
        );
      }
      if (experiencia === "digital" || experiencia === "hibrida") {
        trilhaExterna.push(
          "Meta digital: nº de cadastros completos via landing/form",
          "Meta digital: nº de conversas qualificadas no WhatsApp + % de SLA cumprido",
          "Meta digital: taxa de conversão landing → ação (%) + custo por ação (R$)"
        );
      }

      setAiTrilhaInterna(trilhaInterna);
      setAiTrilhaExterna(trilhaExterna);
      setStep(2);
      setIsGenerating(false);
    }, 400);
  };

  // ── STEP 2 → 3: Orçamento por categoria (Bloco 5C) ──────────
  const nextStepOrcamento = async () => {
    const val = parseFloat(orcamento.replace(/\D/g, "")) || 0;

    if (val === 0) {
      setAiOrcamentoLinhas([{ categoria: "In-House", valor_estimado: 0, motivo: "Recursos nativos das equipes" }]);
      setAiOrcamentoTotal(0);
      setStep(3);
      return;
    }

    setIsGenerating(true);

    // Determinar faixa de orçamento V8
    const faixaOrcamento =
      val < 1000 ? "0–1k" :
      val < 5000 ? "1–5k" :
      val < 20000 ? "5–20k" :
      val < 100000 ? "20–100k" : "100k+";

    // Linhas de custo esperadas conforme Bloco 5C do wireframe
    const linhasEsperadas = [
      "Criação/Produção (design de peças, identidade visual)",
      "Mídia paga (ads, impulsionamento)",
      ...(experiencia !== "digital" ? ["Impressos (cartazes, banners, materiais de apoio)"] : []),
      ...(modulos.fisico || experiencia !== "digital" ? ["Kits/Brindes (composição + montagem por tier)"] : []),
      ...(experiencia !== "digital" ? ["Uniforme/Identificação (crachá, camiseta por tier)"] : []),
      ...(experiencia !== "digital" && eventoDuracao > 2 ? ["Coffee/Alimentação (formatos + qty)"] : []),
      ...(experiencia !== "digital" ? ["Locação/Infraestrutura (espaço + A/V + segurança)"] : []),
      ...(experiencia !== "digital" ? ["Captação (foto, vídeo, entregáveis)"] : []),
      "Plataforma de inscrição (se aplicável)",
      "Logística geral",
      "Contingência (reserva de risco operacional; recomendado: 10–15%)",
    ];

    try {
      let orcamentoObj = {
        linhas: [{ categoria: "Alocação Principal", valor_estimado: val, motivo: "Baseado no escopo" }],
        total_estimado: val,
      };

      try {
        const payload = await callOpenAI(
          `${ADAPTA_SYSTEM_PERSONA}

Você é o Arquiteto Financeiro V8. Fatie o orçamento disponível em linhas reais e detalhadas.
Responda EXATAMENTE um JSON: { "linhas": [{ "categoria": "Nome", "valor_estimado": 500, "motivo": "Justificativa" }], "total_estimado": ${val} }.

Regras:
- O somatório de todos os valores deve bater EXATAMENTE o total_estimado (${val}).
- Use as categorias reais de custo conforme o escopo da iniciativa.
- Inclua SEMPRE uma linha de Contingência (10–15% do total, reserva de risco).
- Faixa de orçamento declarada: ${faixaOrcamento}. Calibre as divisões proporcionalmente.
- Módulo Físico ativo: ${modulos.fisico || experiencia !== "digital" ? "SIM" : "NÃO"}.
- Módulo Digital ativo: ${modulos.digital || experiencia !== "presencial" ? "SIM" : "NÃO"}.
- Evento presencial: ${experiencia !== "digital" ? "SIM" : "NÃO"}.
- Duração do evento: ${eventoDuracao}h. Público estimado: ${eventoPublico} pessoas.

Categorias a considerar (use as que se aplicam ao escopo):
${linhasEsperadas.map((l, i) => `${i + 1}. ${l}`).join("\n")}`,
          `Iniciativa: "${rawName}". Tese: "${proposicao}". Orçamento total disponível: R$ ${val}.`
        );

        const parsed = JSON.parse(payload.replace(/```json|```/gi, "").trim());
        const validation = aiOrcamentoSchema.safeParse(parsed);
        if (!validation.success) throw new Error("Schema inválido");
        orcamentoObj = validation.data;
      } catch (e: any) {
        toast.warning("Fallback de orçamento ativado: " + e.message, { duration: 3000 });
        // Fallback com split proporcional por escopo
        const temFisico = modulos.fisico || experiencia !== "digital";
        const temDigital = modulos.digital || experiencia !== "presencial";
        orcamentoObj.linhas = [
          ...(temFisico ? [
            { categoria: "Produção Física (locação, infra, A/V)", valor_estimado: Math.round(val * 0.30), motivo: "Estrutura presencial" },
            { categoria: "Impressos / Kits / Uniforme", valor_estimado: Math.round(val * 0.15), motivo: "Materiais físicos por tier" },
            ...(eventoDuracao > 2 ? [{ categoria: "Coffee/Alimentação", valor_estimado: Math.round(val * 0.10), motivo: "Nutrição do evento" }] : []),
          ] : []),
          ...(temDigital ? [
            { categoria: "Criação & Produção Visual", valor_estimado: Math.round(val * 0.20), motivo: "Design, peças e identidade aplicada" },
            { categoria: "Mídia Digital (ads, impulsionamento)", valor_estimado: Math.round(val * 0.15), motivo: "Distribuição paga" },
          ] : []),
          { categoria: "Contingência (reserva de risco)", valor_estimado: Math.round(val * 0.10), motivo: "Hedge operacional — 10% do total" },
        ];
        orcamentoObj.total_estimado = val;
      }

      setAiOrcamentoLinhas(orcamentoObj.linhas);
      setAiOrcamentoTotal(orcamentoObj.total_estimado);
      setStep(3);
    } catch (err: any) {
      toast.error("Erro Orçamento: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── STEP 3 → 4: Blueprint Denso (Árvore-Mãe Completa) ──────
  const generateBlueprintDense = async () => {
    setIsGenerating(true);

    // Natureza do conteúdo determinística pelo tipo da ação
    const naturezaConteudo =
      aiGeneratedType === "medicos" ? "acadêmico / técnico" :
      aiGeneratedType === "interno" ? "institucional / operacional" :
      aiGeneratedType === "sazonal" ? "cultural / educativo" :
      "educativo / institucional";

    try {
      let text = "";

      try {
        const payload = await callOpenAI(
          `${ADAPTA_SYSTEM_PERSONA}

Você é o Arquiteto Chefe de Iniciativas V8. Gere um Blueprint Motor V8 completo e profundo.
Responda EXATAMENTE um JSON: { "blueprint": "markdown completo" }.

A estrutura do markdown deve seguir EXATAMENTE estes blocos — desenvolva cada um com profundidade real:

## 1. A Grande Ideia (Conceito Central)
Apresente a tese sistêmica da iniciativa. NÃO é um slogan. É a arquitetura conceitual que orienta TODAS as decisões.
Use o conceito sistêmico escolhido como âncora (Ressonância, Empatia Sistêmica, etc.).

## 2. Natureza do Conteúdo
Classifique: ${naturezaConteudo}.
Defina o tom mandatório (institucional / didático / técnico / mobilizador).
Liste o que NÃO pode soar nesse contexto (ex: oportunismo comercial, sensacionalismo, promessas implícitas).

## 3. Jornada do Associado (7 momentos reais)
Mapeie a jornada real da pessoa que vai participar dessa iniciativa — da descoberta à consolidação.
Para CADA etapa: pergunta real da pessoa → o que a Adapta comunica → canal/formato ideal.
Etapas: Descoberta · Investigação · Consideração · Decisão · Acolhimento · Adaptação · Consolidação.

## 4. Módulos Ativos e Critérios de Pronto (Gates V8)
Com base em: Direção=${direcao} | Experiência=${experiencia} | Público=${eventoPublico} | Duração=${eventoDuracao}h.
Liste cada módulo ativo (Governança, Físico, Digital, Evento-Acesso, Evento-Programação).
Para cada módulo: o que precisa estar feito, quem é o dono e qual é a PROVA DE PRONTO (link, foto, doc aprovado).
REGRA: nenhum módulo pode estar ON sem ter custo estimado, dono e prova de pronto definidos.

## 5. Finalmentes (Resultados Verificáveis)
Defina 2–4 resultados finais com: meta numérica + janela de tempo + custo por resultado.
Resultados devem ser VERIFICÁVEIS (contáveis/auditáveis).
Exemplo: "Nº de adesões no local: meta 15 pessoas até o fim do evento. Custo por adesão: R$ X."

## 6. Governança e Gestão de Risco
Quem aprova a iniciativa e em que prazo?
Quais são as perguntas difíceis que podem surgir e como responder?
Qual é o protocolo de escalonamento (quando acionar diretoria/jurídico)?
Quais os riscos operacionais de alto impacto e como mitigá-los?`,
          `Tema: "${rawName}". Tese: "${proposicao}". Direção: ${direcao}. Experiência: ${experiencia}. Duração: ${eventoDuracao}h. Público estimado: ${eventoPublico}. Orçamento: R$ ${aiOrcamentoTotal}.`
        );

        const parsed = JSON.parse(payload.replace(/```json|```/gi, "").trim());
        const validation = aiBlueprintSchema.safeParse(parsed);
        if (!validation.success) throw new Error("Schema Blueprint inválido");
        text = validation.data.blueprint;
      } catch (e: any) {
        toast.warning("Fallback de Blueprint ativado: " + e.message, { duration: 3000 });
        text = `## Blueprint Operacional: ${rawName.toUpperCase()}

**Direção:** ${direcao} | **Experiência:** ${experiencia}
**Orçamento:** R$ ${aiOrcamentoTotal.toLocaleString("pt-BR")}

### Conceito Central
${proposicao}

### Natureza do Conteúdo
${naturezaConteudo} — Tom: institucional/técnico. Proibido: oportunismo comercial ou promessas implícitas.

### Gates de Execução
- **L-Gate 1 (Governança):** aprovação formal, LGPD, mapeamento de risco
- **L-Gate 2 (Produção):** peças, infraestrutura, kits, scripts prontos
- **L-Gate 3 (Distribuição):** publicação, tracking, follow-up configurado

### Finalmentes (resultados verificáveis a definir)
- Definir meta numérica principal com janela de tempo
- Definir custo por resultado esperado

### Risco
Solicitar alinhamento do jurídico antes da publicação. Preparar FAQ com perguntas difíceis.`;
      }

      setBlueprintTheory(text);
      setStep(4);
    } catch (err: any) {
      toast.error("Erro Blueprint: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── SAVE ─────────────────────────────────────────────────────
  const finishCreation = async () => {
    try {
      await saveCampaign({
        name:            rawName,
        type:            WIZARD_TYPE_TO_CAMPAIGN_TYPE[aiGeneratedType] ?? "corporate_event",
        status:          "draft",
        objective:       proposicao || undefined,
        channels:        aiTrilhaExterna,
        dna_direcao:     direcao,
        dna_experiencia: experiencia,
        dna_modulos:     modulos,
      });
      setIsSaved(true);
      toast.success("Blueprint e DNA V8 salvos com sucesso!");
    } catch (e) {
      toast.error("Erro ao salvar a operação.");
    }
  };

  // ── GENERATE PLAN ─────────────────────────────────────────────
  const generateActionPlan = async () => {
    setIsGeneratingPlan(true);

    try {
      // 1. Tarefas determinísticas por Gate (Bloco 2 — Gates de Execução)
      let deterministicTasks: string[] = [
        // L-GATE 1: DEFINIÇÃO & GOVERNANÇA
        "L-Gate 1 | Solicitar aprovação formal da iniciativa (quem assina, prazo, versão final)",
        "L-Gate 1 | Validar conformidade LGPD: coleta de dados, termo de imagem, política de inscrição",
        "L-Gate 1 | Elaborar FAQ de risco com perguntas difíceis e protocolo de escalonamento",
        "L-Gate 1 | Claim-check: revisar todas as peças para garantir que não há promessas implícitas",
      ];

      // Módulo A — Camada Interna (sempre se for interna ou híbrida)
      if (direcao === "interna" || direcao === "hibrida") {
        deterministicTasks.push(
          "Módulo A | Produzir kit interno: 1-pager, FAQ de atendimento e scripts de comunicação",
          "Módulo A | Realizar treinamento do time (briefing síncrono + material assíncrono)",
          "Módulo A | Aplicar teste de validação pós-briefing e registrar % de aprovação"
        );
      }

      // L-GATE 2: PRODUÇÃO & OPERAÇÃO — Presencial
      if (experiencia === "presencial" || experiencia === "hibrida") {
        deterministicTasks.push(
          "L-Gate 2 | Confirmar local: capacidade, acessibilidade, segurança, contrato de locação",
          "L-Gate 2 | Definir modelo de acesso e tiers (aberto/fechado/segmentado)",
          "L-Gate 2 | Configurar inscrição: plataforma, limite de vagas, lista de espera, prazo de confirmação",
          "L-Gate 2 | Definir programação: agenda de blocos, duração, espaço para Q&A",
          "L-Gate 2 | Providenciar identificação do staff (uniforme, crachá ou pulseira por tier)",
          "L-Gate 2 | Estruturar A/V: microfone, som, tela, iluminação, captação (foto/vídeo)"
        );
        if (eventoDuracao >= 3) {
          deterministicTasks.push("L-Gate 2 | Coffee/alimentação: definir formato, quantidade, restrições e fornecedor");
        }
        if (eventoPublico >= 30) {
          deterministicTasks.push("L-Gate 2 | Verificar capacidade de banheiros para +30 pessoas no local");
        }
      }

      // L-GATE 2: PRODUÇÃO & OPERAÇÃO — Digital
      if (experiencia === "digital" || experiencia === "hibrida") {
        deterministicTasks.push(
          "L-Gate 2 | Configurar e aprovar landing page: campos, aceite LGPD, destino pós-envio",
          "L-Gate 2 | Produzir peças orgânicas: feed, reels, stories (qty e calendário definidos)",
          "L-Gate 2 | Configurar scripts de WhatsApp: inbound e/ou outbound, SLA de resposta, quem responde"
        );
      }

      // L-GATE 3: DISTRIBUIÇÃO & COLETA
      deterministicTasks.push(
        "L-Gate 3 | Configurar tracking: UTMs por frente, eventos (view/submit/clique WhatsApp)",
        "L-Gate 3 | Definir follow-up pós-iniciativa: quem faz, SLA e script de acompanhamento",
        "L-Gate 3 | Coletar e consolidar 'Finalmentes': resultados verificáveis vs. metas definidas"
      );

      // 2. Estágios estratégicos via IA (vocabulário correto)
      let aiFunnels: Record<string, string[]> = {};

      try {
        const payload = await callOpenAI(
          `${ADAPTA_SYSTEM_PERSONA}

Construa a jornada completa de execução para a iniciativa descrita. Crie de 6 a 8 estágios operacionais detalhados.
Responda APENAS um JSON mapeando NOME DO ESTÁGIO (chave) para um array de TAREFAS (valor).

Os estágios devem seguir a jornada do associado V8:
- Descoberta → Investigação → Consideração → Decisão → Acolhimento → Adaptação → Consolidação

Nomenclatura de estágios exemplos:
"ETAPA 1 — DIVULGAÇÃO INICIAL", "ETAPA 2 — APROFUNDAMENTO DE ENTENDIMENTO", "ETAPA 3 — ADESÃO CONSCIENTE", "ETAPA 4 — ACOLHIMENTO", "ETAPA 5 — CONTINUIDADE DO CUIDADO".

Cada tarefa deve ser uma ação concreta, com verbo no infinitivo. Máximo 15 palavras por tarefa.
De 5 a 8 tarefas por estágio. Total de estágios: 6 a 8.`,
          `Tema: "${rawName}". Tese: "${proposicao}". Blueprint: ${blueprintTheory.substring(0, 1800)}. Direção: ${direcao}. Experiência: ${experiencia}.`
        );

        const parsed = JSON.parse(payload.replace(/```json|```/gi, "").trim());
        const validation = aiActionPlanSchema.safeParse(parsed);
        if (validation.success) aiFunnels = validation.data;
      } catch (e: any) {
        console.warn("Falha ao gerar estágios estratégicos", e);
      }

      toast.info("Processando integração com CoreAct...");

      const initObj = await createInitiative({ name: `V8 [${direcao.toUpperCase()}]: ${rawName}` });
      const initiativeId = initObj.initiative.id;

      const projObj = await createProject({
        name: `Plano Operacional — ${rawName}`,
        startDate: new Date(),
        initiativeId,
        status: "active",
        category: "custom",
      });
      const projectId = projObj.project.id;

      let hasTasks = false;

      // Criar estágio determinístico (Governança & Compliance)
      const baseStageObj = await createStage({ projectId, name: "L-GATE: GOVERNANÇA & COMPLIANCE" });
      for (const t of deterministicTasks) {
        hasTasks = true;
        await createTask({
          projectId,
          stageId: baseStageObj.stage.id,
          name: String(t),
          status: "open",
          priority: "high",
          shift: "morning",
        });
      }

      // Criar estágios estratégicos da jornada do associado
      for (const [stageName, tasks] of Object.entries(aiFunnels)) {
        const uniqueTasks = Array.from(
          new Set(tasks.filter((t) => typeof t === "string" && t.trim() !== ""))
        );
        if (uniqueTasks.length === 0) continue;

        const stageClean = stageName.replace("_", " ").toUpperCase();
        const stageObj = await createStage({ projectId, name: stageClean });
        const stageId = stageObj.stage.id;

        for (const t of uniqueTasks) {
          hasTasks = true;
          await createTask({
            projectId,
            stageId,
            name: String(t),
            status: "open",
            priority: "medium",
            shift: "morning",
          });
        }
      }

      if (!hasTasks) toast.warning("Fallback: Nenhuma tarefa detectada pelo CoreAct");

      toast.success("Plano de ação construído e integrado ao CoreAct!");
      onClose();
    } catch (e: any) {
      toast.error("Falha de Arquitetura V8 ao gerar plano: " + e.message);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return {
    state: {
      isGenerating, isSaved, isGeneratingPlan, step,
      rawName, direcao, experiencia, modulos, proposicao, suggestedPropositions, orcamento,
      eventoPublico, eventoDuracao,
      aiGeneratedType, activeFunnels, aiTrilhaInterna, aiTrilhaExterna,
      aiOrcamentoLinhas, aiOrcamentoTotal, blueprintTheory,
    },
    actions: {
      setStep, setRawName, setDirecao, setExperiencia, setModulos, setProposicao,
      setOrcamento, setAiOrcamentoLinhas,
      setEventoPublico, setEventoDuracao,
      nextStepTema, nextStepProposicao, nextStepOrcamento,
      generateBlueprintDense, finishCreation, generateActionPlan,
    },
  };
}
