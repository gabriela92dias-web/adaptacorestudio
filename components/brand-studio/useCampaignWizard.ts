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

  // Inputs
  const [rawName, setRawName] = useState("");
  const [direcao, setDirecao] = useState<"interna" | "externa" | "hibrida">("externa");
  const [experiencia, setExperiencia] = useState<"presencial" | "digital" | "hibrida">("digital");
  const [modulos, setModulos] = useState({ fisico: false, digital: true, evento: false, governanca: true });
  const [proposicao, setProposicao] = useState("");
  const [suggestedPropositions, setSuggestedPropositions] = useState<string[]>([]);
  const [orcamento, setOrcamento] = useState("");
  
  // V8 Deterministic Modifiers
  const [eventoPublico, setEventoPublico] = useState<number>(0);
  const [eventoDuracao, setEventoDuracao] = useState<number>(0);

  // AI outputs
  const [aiGeneratedType, setAiGeneratedType] = useState<string>("institucional");
  const [activeFunnels, setActiveFunnels] = useState<Record<string, boolean>>({});
  
  // Step 1 outputs (Trilhas Paralelas - Módulo A e B)
  const [aiTrilhaInterna, setAiTrilhaInterna] = useState<string[]>([]);
  const [aiTrilhaExterna, setAiTrilhaExterna] = useState<string[]>([]);
  
  // Step 2 outputs (Estimativa de Orçamento - Notinha)
  const [aiOrcamentoLinhas, setAiOrcamentoLinhas] = useState<{categoria: string, valor_estimado: number, motivo: string}[]>([]);
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
      try { const d = await res.json(); if (d.error?.message) errMsg = d.error.message; } catch {}
      throw new Error(errMsg);
    }
    const data = await res.json();
    return data.choices[0].message.content;
  }

  // ── STEP 0 → 1 ──────────────────────────────────────────
  const nextStepTema = async () => {
    if (!rawName.trim()) return;

    setIsGenerating(true);
    let fallbackUsed = false;
    let aiProps: string[] = [];

    try {
      const payload = await callOpenAI(
        `Você é o Diretor Executivo de Operações Institucionais e Estratégia B2B da Adapta. Retorne EXATAMENTE um JSON: { "proposicoes": ["Tese 1", "Tese 2", "Tese 3"] }. Crie 3 escopos institucionais (teses de campanha) pragmáticas, operacionais e realistas. Foco em relacionamento corporativo, capacitação, reuniões táticas ou engajamento de rede. ZERO fantasia, ZERO historinhas lúdicas ou poéticas. Seja absolutamente executivo e direto. Máximo 25 palavras por tese.`,
        `Tema da proposição de ação/campanha: "${rawName}"`
      );
      const cleaned = payload.replace(/```json|```/gi, "").trim();
      const parsed = JSON.parse(cleaned);
      const validation = aiTemaSchema.safeParse(parsed);
      
      if (!validation.success) {
         aiProps = parsed.proposicoes || Object.values(parsed)[0] || [];
         if (!Array.isArray(aiProps) || aiProps.length < 3) throw new Error("Schema Inválido e Fallback de Parsing Falhou");
      } else {
         aiProps = validation.data.proposicoes;
      }
    } catch (e: any) {
      fallbackUsed = true;
      toast.warning("Sistema I.A. Padrão ativado: " + e.message);
      const t = rawName.trim() ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : "Ação";
      aiProps = [
        `[OPERACIONAL] Estruturação Presencial (${t}): Logística centralizada e acesso escalonado.`,
        `[LOGÍSTICO] Captação e Distribuição Ativa: Malha digital orientada para a audiência alvo com SLA rígido para "${t}".`,
        `[HÍBRIDO] Evento Multi-Fases: Alinhamento on-site suportado por contingenciamento digital e aprovações estritas.`,
      ];
    }

    try {
      const lower = rawName.toLowerCase();
      let type = "institucional";
      let funnels = { awareness: true, consideration: true, conversion: false, retention: false, expansion: false };

      if (lower.includes("mutirão") || lower.includes("acolhimento") || lower.includes("evento")) {
        type = "acolhimento";
        funnels = { awareness: false, consideration: false, conversion: true, retention: true, expansion: true };
      } else if (lower.includes("médico") || lower.includes("congresso") || lower.includes("pesquisa")) {
        type = "medicos";
        funnels = { awareness: true, consideration: true, conversion: true, retention: false, expansion: false };
      } else if (lower.includes("sazonal") || lower.includes("dia")) {
        type = "sazonal";
        funnels = { awareness: true, consideration: true, conversion: false, retention: true, expansion: true };
      }

      setAiGeneratedType(type);
      setActiveFunnels(funnels);
      setSuggestedPropositions(aiProps);
      setStep(1);
    } catch (err: any) {
      toast.error("Erro Crítico: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── STEP 1 → 2 ──────────────────────────────────────────
  const nextStepProposicao = async (suppliedProp?: string) => {
    const finalProp = typeof suppliedProp === "string" ? suppliedProp : proposicao;
    setIsGenerating(true);
    setProposicao(finalProp);

    // GERAÇÃO DETERMINÍSTICA (Economia de Tokens e aplicação do Manual de Adaptação)
    setTimeout(() => {
      let trilhaInterna = ["Definição da Tese e Alinhamento Executivo (Hedge Orçamentário)"];
      let trilhaExterna = ["Configuração da Estrutura Central da Campanha"];

      if (direcao === "interna" || direcao === "hibrida") {
        trilhaInterna.push("Engajamento da Liderança (Embaixadores Internos)", "Disparo de Comunicado e Alinhamento do Time");
      }
      if (direcao === "externa" || direcao === "hibrida") {
        trilhaExterna.push("Mapeamento do Público-Alvo e Canais Oficiais", "Régua de Relacionamento (Antes, Durante e Depois)");
      }

      if (experiencia === "presencial" || experiencia === "hibrida") {
        trilhaInterna.push("Escala de Staff Técnico (Apoio, Triagem e Coordenação)", "Treinamento Rápido do Staff On-Site");
        trilhaExterna.push("Sinalização, Credenciamento e Infraestrutura de Acesso");
        if (eventoDuracao > 3) trilhaExterna.push("Logística de Nutrição (Coffee/Catering Mandatório)");
      }

      if (experiencia === "digital" || experiencia === "hibrida") {
        trilhaExterna.push("Gestão de Tráfego e Landing Pages para Captação", "Automação de Confirmações (WhatsApp/Email)");
      }

      setAiTrilhaInterna(trilhaInterna);
      setAiTrilhaExterna(trilhaExterna);
      setStep(2);
      setIsGenerating(false);
    }, 400); // Simulando loading
  };

  // ── STEP 2 → 3 ──────────────────────────────────────────
  const nextStepOrcamento = async () => {
    const val = parseFloat(orcamento.replace(/\\D/g, "")) || 0;
    if (val === 0) {
       // Se orçamento é zero, insere uma linha genérica ou skip.
       setAiOrcamentoLinhas([ { categoria: "In-House", valor_estimado: 0, motivo: "Recursos nativos das equipes" } ]);
       setAiOrcamentoTotal(0);
       setStep(3);
       return;
    }
    
    setIsGenerating(true);
    try {
      let orcamentoObj = { linhas: [{ categoria: "Alocação Principal", valor_estimado: val, motivo: "Baseado no escopo" }], total_estimado: val };
      try {
        const payload = await callOpenAI(
          `Arquiteto V8, fatie os R$ ${val} do orçamento disponível. Responda JSON: { "linhas": [{ "categoria": "Criação/Produção", "valor_estimado": 1000, "motivo": "Design de peças" }], "total_estimado": ${val} }. Inclua linhas logísticas necessárias (Mídia, Coffee, Locação, Impressos, Inscrição) de acordo com a Experiência (${experiencia}). O somatório dos valores deve bater o total_estimado.`,
          `Campanha: "${rawName}". Teto/Orçamento Padrão: R$ ${val}.`
        );
        const parsed = JSON.parse(payload.replace(/```json|```/gi, "").trim());
        const validation = aiOrcamentoSchema.safeParse(parsed);
        if (!validation.success) throw new Error("Schema Inválido");
        orcamentoObj = validation.data;
      } catch (e: any) {
        toast.warning("OpenAI falhou de forma controlada no orçamento: " + e.message, { duration: 3000 });
        orcamentoObj.linhas = [
          { categoria: "Produção Física", valor_estimado: val * 0.4, motivo: "Estrutura material e locação base" },
          { categoria: "Mídia & Distribuição", valor_estimado: val * 0.4, motivo: "Mídia paga e inbound social" },
          { categoria: "Governança & Contingência", valor_estimado: val * 0.2, motivo: "Hedge de risco operacional" },
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

  // ── STEP 3 → 4 ──────────────────────────────────────────
  const generateBlueprintDense = async () => {
    setIsGenerating(true);

    try {
      let text = "";
      try {
        const payload = await callOpenAI(
          `Você é o mestre da Estratégia de Campanhas (Nível C-Level/Diretor de Criação). Gere uma Árvore-mãe Tática (Blueprint Motor V8) incrivelmente profunda e brilhante. Responda EXATAMENTE um JSON: { "blueprint": "markdown longo" }.
Siga EXATAMENTE esta estrutura no markdown, desenvolvendo com profundidade extrema:
## 1. O Gancho Principal (A Grande Ideia)
Crie uma narrativa central fora da caixa, magnética e irresistível para o público.

## 2. A Jornada Completa (Estratégia de Captação e Adesão)
Mapeie uma jornada exaustiva com 7 a 10 etapas detalhadas! Desde a Captação/Atenção, Aquecimento, Adesão até a Retenção/Follow-up. Descreva a intenção psicológica e os gatilhos de engajamento de cada etapa. Não use palavras como "lead", "cliente" ou "fechamento", use "audiência", "participante", "adesão".

## 3. Oportunidades & Gatilhos Práticos
Estratégias de expansão, parcerias ou ativações surpreendentes durante a campanha.

## 4. Governança e Riscos
Resumo executivo do que pode dar errado na mensagem e como o Hedge atua.`,
          `Tema: "${rawName}". Tese/Objetivo: "${proposicao}". Direção: ${direcao}, Exp: ${experiencia}. Prev. Duração: ${eventoDuracao}h. Prev. Público: ${eventoPublico}. Orçamento: R$ ${aiOrcamentoTotal}.`
        );
        const parsed = JSON.parse(payload.replace(/```json|```/gi, "").trim());
        const validation = aiBlueprintSchema.safeParse(parsed);
        if (!validation.success) throw new Error("Schema Blueprint Inválido");
        text = validation.data.blueprint;
      } catch (e: any) {
        toast.warning("OpenAI falhou (Fallback usado): " + e.message, { duration: 3000 });
        text = `### Blueprint Operacional: ${rawName.toUpperCase()}\n\n**Direção:** ${direcao}\n**Experiência:** ${experiencia}\n\n**Execução Tática:** Evento focado em resultados. Necessidade de alinhar permissões logísticas e sanitárias. Tolerância de orçamento cravada no Hedge.`;
      }

      setBlueprintTheory(text);
      setStep(4);
    } catch (err: any) {
      toast.error("Erro Blueprint: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── SAVE ────────────────────────────────────────────────
  const finishCreation = async () => {
    try {
      await saveCampaign({
        name:          rawName,
        type:          WIZARD_TYPE_TO_CAMPAIGN_TYPE[aiGeneratedType] ?? "corporate_event",
        status:        "draft",
        objective:     proposicao || undefined,
        channels:      aiTrilhaExterna,
        dna_direcao:   direcao,
        dna_experiencia: experiencia,
        dna_modulos:   modulos,
      });
      setIsSaved(true);
      toast.success("Blueprint e DNA V8 salvos com sucesso!");
    } catch (e) {
      toast.error("Erro ao salvar a operação.");
    }
  };

  // ── GENERATE PLAN ────────────────────────────────────────
  const generateActionPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      // 1. CARREGAR LÓGICA DETERMINÍSTICA (Infraestrutura Base Mínima)
      let deterministicTasks: string[] = [
        "Solicitar aval formal e alinhamento do jurídico", 
        "Garantir Termo de LGPD e autorização de uso de imagem"
      ];

      if (experiencia === "presencial" || experiencia === "hibrida") {
        deterministicTasks.push("Definir local do evento e verificar acessibilidade", "Criar programação oficial do evento");
        deterministicTasks.push("Providenciar camisas ou identificação para o Staff de apoio");
        
        if (eventoDuracao >= 3) {
          deterministicTasks.push("Estruturar e orçar Coffee Break (Mandatório para duração longa)");
        }
        if (eventoPublico >= 30) {
          deterministicTasks.push("Verificar estrutura e capacidade de banheiros no local (> 30 pessoas)");
        }
      }

      if (experiencia === "digital" || experiencia === "hibrida") {
        deterministicTasks.push("Configurar e aprovar Landing Page de cadastro/informações", "Disparar régua de convites digitais", "Acompanhar campanha de Ads geolocalizada");
      }

      // 2. BUSCAR O FUNIL MONSTRO E ESTRATÉGIAS EXAUSTIVAS VIA IA
      let aiFunnels: Record<string, string[]> = {};

      try {
        const payload = await callOpenAI(
          `Você é o mestre de Estratégia B2B e Diretor de Operações C-Level. 
Construa a jornada completa e exaustiva de execução para o Blueprint fornecido. 
Pense em "910210 funções" macro! Segmente em etapas profundas.
Crie estágios criativos como "CAPTAÇÃO DE PÚBLICO", "AQUECIMENTO DE AUDIÊNCIA", "GATILHO DE EXCLUSIVIDADE", "FOLLOW UP DE ENGAJAMENTO", "RETENÇÃO". NUNCA use palavras de marketing como "lead", "cliente", "venda", "funil", use "audiência", "participantes", "adesão", "jornada".
Responda APENAS um JSON válido mapeando NOME DO ESTÁGIO (CHAVE) para um array de TAREFAS CRUCIAIS DE ALTÍSSIMO VALOR ESTRATÉGICO (VALOR). 
Exemplo: { "FASE 1 - GERAÇÃO DE DEMANDA": ["Criar gancho central...", "Sincronizar base de convidados..."], "FASE 2 - FILTRO DE AUDIÊNCIA": ["..."] }.
Crie DE 6 A 10 ETAPAS DE JORNADA COMPLETAS.`,
          `Tema: "${rawName}". Blueprint: ${blueprintTheory.substring(0, 1500)}... Exp: ${experiencia}. Direção: ${direcao}.`
        );
        const parsed = JSON.parse(payload.replace(/```json|```/gi, "").trim());
        const validation = aiActionPlanSchema.safeParse(parsed);
        if (validation.success) aiFunnels = validation.data;
      } catch (e: any) {
        console.warn("Falha ao gerar funil monstro", e);
      }

      toast.info("Processando Integração B2B de Eventos...");
      const initObj = await createInitiative({ name: `V8 [${direcao.toUpperCase()}]: ${rawName}` });
      const initiativeId = initObj.initiative.id;

      const projObj = await createProject({ name: `Logística Operacional - ${rawName}`, startDate: new Date(), initiativeId, status: "active", category: "custom" });
      const projectId = projObj.project.id;

      let hasTasks = false;
      
      // Criar estágio determinístico primeiro
      const baseStageObj = await createStage({ projectId, name: `L-GATE: INFRA E COMPLIANCE` });
      for (const t of deterministicTasks) {
          hasTasks = true;
          await createTask({ projectId, stageId: baseStageObj.stage.id, name: String(t), status: "open", priority: "high", shift: "morning" });
      }

      // Criar os estágios estratégicos do funil monstro
      for (const [stageName, tasks] of Object.entries(aiFunnels)) {
        const uniqueTasks = Array.from(new Set(tasks.filter(t => typeof t === 'string' && t.trim() !== "")));
        if (uniqueTasks.length === 0) continue;
        
        const stageClean = stageName.replace("_", " ").toUpperCase();
        const stageObj = await createStage({ projectId, name: `ESTRUTURA: ${stageClean}` });
        const stageId  = stageObj.stage.id;
        
        for (const t of uniqueTasks) {
          hasTasks = true;
          await createTask({ projectId, stageId, name: String(t), status: "open", priority: "medium", shift: "morning" });
        }
      }
      
      if (!hasTasks) toast.warning("Fallback: Nenhuma tarefa detectada pelo CoreAct");

      toast.success("Plano de Ação construído e repassado pro CoreAct!");
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
      aiGeneratedType, activeFunnels, aiTrilhaInterna, aiTrilhaExterna, aiOrcamentoLinhas, aiOrcamentoTotal, blueprintTheory
    },
    actions: {
      setStep, setRawName, setDirecao, setExperiencia, setModulos, setProposicao, setOrcamento, setAiOrcamentoLinhas,
      setEventoPublico, setEventoDuracao,
      nextStepTema, nextStepProposicao, nextStepOrcamento, generateBlueprintDense, finishCreation, generateActionPlan
    }
  };
}
