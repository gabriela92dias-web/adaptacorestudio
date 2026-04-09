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

  // AI outputs
  const [aiGeneratedType, setAiGeneratedType] = useState<string>("institucional");
  const [activeFunnels, setActiveFunnels] = useState<Record<string, boolean>>({});
  const [aiBriefing, setAiBriefing] = useState("");
  const [aiChannels, setAiChannels] = useState<string[]>([]);
  const [aiKpi, setAiKpi] = useState({ meta: "", goal: "" });
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
        `Você é o Diretor de Estratégia de uma Associação Clínica de Cannabis. Retorne EXATAMENTE um JSON: { "proposicoes": ["Tese 1", "Tese 2", "Tese 3"] }. Cada tese máx 20 palavras, densa, focada no terceiro setor.`,
        `Tema da campanha: "${rawName}"`
      );
      const cleaned = payload.replace(/```json|```/gi, "").trim();
      const parsed = JSON.parse(cleaned);
      const validation = aiTemaSchema.safeParse(parsed);
      
      if (!validation.success) {
         // Se Zod falhar, tenta catar algo do JSON cru antes de jogar erro
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
        `[OFFLINE] Desestigmatização Direcionada (${t}): Combater a assimetria informacional com dossiês irrefutáveis.`,
        `[OFFLINE] Expansão da Comunidade de Afinidade: Ecossistema focado em "${t}" onde veteranos validam a evolução.`,
        `[OFFLINE] Cidadania Terapêutica Plena: Acesso cruzado com pautas de ${t} como garantia de amparo social.`,
      ];
    }

    try {
      const lower = rawName.toLowerCase();
      let type = "institucional";
      let funnels = { awareness: true, consideration: true, conversion: false, retention: false, expansion: false };

      if (lower.includes("mutirão") || lower.includes("acolhimento") || lower.includes("paciente") || lower.includes("associação")) {
        type = "acolhimento";
        funnels = { awareness: false, consideration: false, conversion: true, retention: true, expansion: true };
        if (fallbackUsed) aiProps = [
          `Ancoragem de Acesso Direto (${rawName}): Reduzir latência entre prescrição e contato biológico.`,
          `Subversão da Burocracia: A entidade absorve a fricção documental do ${rawName}.`,
          `Acolhimento Terapêutico Focado: Suportar o núcleo isolado mitigando o limbo burocrático.`,
        ];
      } else if (lower.includes("médico") || lower.includes("prescrit") || lower.includes("congresso") || lower.includes("pesquisa")) {
        type = "medicos";
        funnels = { awareness: true, consideration: true, conversion: true, retention: false, expansion: false };
        if (fallbackUsed) aiProps = [
          `Transferência de Autoridade em Protocolos de ${rawName}: Fornecer metanálises robustas.`,
          `Engenharia de Casos Clínicos Interpares: Transferir autoridade via papers segmentados.`,
          `Concierge Clínico Compartilhado: Associação como rede estratégica de backoffice.`,
        ];
      } else if (lower.includes("setembro") || lower.includes("outubro") || lower.includes("sazonal") || lower.includes("dia")) {
        type = "sazonal";
        funnels = { awareness: true, consideration: true, conversion: false, retention: true, expansion: true };
        if (fallbackUsed) aiProps = [
          `Empatia Sistêmica Voltada a ${rawName}: Extrair a comunidade do isolamento via relatos reais.`,
          `Ressonância do Cuidado Sustentável: Evidências da terapia como reinserção central.`,
          `Janela de Acesso Social Prioritário: Redução de fricção para o ecossistema afetado.`,
        ];
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

    try {
      let data = { briefing: "", channels: ["Instagram Oficial", "Disparo E-Mail"] };
      try {
        const payload = await callOpenAI(
          `Você é o CSO de uma campanha no Terceiro Setor (Cannabis Medicinal). Devolva JSON: { "briefing": "Memorando Tático em markdown", "channels": ["Canal 1", "Canal 2"] }.`,
          `Tema: "${rawName}". Tese: "${finalProp}". Tipo: ${aiGeneratedType}.`
        );
        const parsed = JSON.parse(payload.replace(/```json|```/gi, "").trim());
        const validation = aiProposicaoSchema.safeParse(parsed);
        if (!validation.success) throw new Error("Schema Inválido");
        data = validation.data;
      } catch (e: any) {
        toast.warning("OpenAI falhou (ou Zod): " + e.message, { duration: 5000 });
        const tF = rawName.trim() ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : "Ação Base";
        if (aiGeneratedType === "acolhimento") {
          data.briefing  = `ALINHAMENTO DE FRONT-DESK (${tF})\n\nA operação exige contenção imediata de latência. Cluster chega vulnerável.\n\n• Gatilho: Velocidade absoluta e acolhimento humano.`;
          data.channels  = ["WhatsApp Dedicado", "Triage Telefônica", "Google Tático"];
        } else if (aiGeneratedType === "medicos") {
          data.briefing  = `CONSELHO B2B — ${tF.toUpperCase()}\n\nBlindar prescritors da pauta via metanálises.\n\n• Core: Abstracts validados.`;
          data.channels  = ["LinkedIn InMail Clínico", "Comitês Virtuais", "Dossiês Diretos"];
        } else if (aiGeneratedType === "sazonal") {
          data.briefing  = `ENGENHARIA SOCIO-CULTURAL (${tF})\n\nAgenda-Setting: pautar fitoterapia via a data.\n\n• Ação: Liga grupos a casos de melhora clínica.`;
          data.channels  = ["Reels de Colaboração", "YouTube Long-Form", "Dark Social / WhatsApp"];
        } else {
          data.briefing  = `PROJEÇÃO DE MARCA (${tF})\n\nEspiral de Engajamento atrelada ao tema.\n\n• KPI: Cultivar Share of Engagement alto.`;
          data.channels  = ["Instagram Reels", "Digital PR Saúde", "Carrossel Acadêmico"];
        }
      }

      setAiBriefing(data.briefing);
      setAiChannels(data.channels);
      setStep(2);
    } catch (err: any) {
      toast.error("Erro Crítico: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── STEP 2 → 3 ──────────────────────────────────────────
  const nextStepOrcamento = async () => {
    if (!orcamento.trim()) {
      setStep(3);
      return;
    }
    setIsGenerating(true);

    try {
      const val = parseFloat(orcamento.replace(/\D/g, "")) || 0;
      let kpiObj = { meta: "", goal: "" };
      try {
        const payload = await callOpenAI(
          `Analisa orçamentos do Terceiro Setor Biomédico. Responda JSON: { "meta": "métrica curta", "goal": "parágrafo com CAC, OKRs, CPL." }`,
          `Teto de mídia: R$ ${val}. Campanha: "${rawName}". Tese: "${proposicao}".`
        );
        const parsed = JSON.parse(payload.replace(/```json|```/gi, "").trim());
        const validation = aiOrcamentoSchema.safeParse(parsed);
        if (!validation.success) throw new Error("Schema Inválido");
        kpiObj = validation.data;
      } catch (e: any) {
        toast.warning("OpenAI falhou de forma controlada: " + e.message, { duration: 3000 });
        if (aiGeneratedType === "acolhimento") {
          const est = Math.floor(val / 145);
          kpiObj = { meta: "Associações Oficiais (CPA ~R$ 145)", goal: val > 0 ? `Com R$ ${orcamento}, ~${est} acolhimentos. Hedge 15% para remarketing.` : "Esforço inbound orgânico." };
        } else if (aiGeneratedType === "medicos") {
          const est = Math.floor(val / 320);
          kpiObj = { meta: "Adesões de Prescritor (CPL ~R$ 320)", goal: val > 0 ? `~${est} novos parceiros. 35% em LinkedIn InMail.` : "Pipeline Outbound B2B sem impulsionamento." };
        } else if (aiGeneratedType === "sazonal") {
          kpiObj = { meta: "Share of Voice Sazonal", goal: val > 0 ? `R$ ${orcamento} traciona CPM segmentado. Pico de admissões no 'day after'.` : "Via Dark Social." };
        } else {
          kpiObj = { meta: "Atenção Social Sustentada", goal: val > 0 ? `R$ ${orcamento} → ~${(val * 4.9).toLocaleString()} impactos visuais.` : "Dependente de tração algorítmica nativa." };
        }
      }

      setAiKpi(kpiObj);
      setStep(3);
    } catch (err: any) {
      toast.error("Erro KPI: " + err.message);
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
        const modsStr = Object.entries(modulos).filter(([_,v]) => v).map(([k]) => k).join(", ");
        const dnaCtx  = `DNA: Direção [${direcao.toUpperCase()}], Experiência [${experiencia.toUpperCase()}], Módulos [${modsStr}].`;
        const payload = await callOpenAI(
          `Gere o Blueprint Oficial. Responda JSON: { "blueprint": "markdown longo" }. Inclua: Visão Estratégica, Alocação de Orçamento, Ações (internas/externas), Etapas, Tarefas e Times.`,
          `Tema: "${rawName}". Tese: "${proposicao}". Orçamento: R$ ${orcamento}. ${dnaCtx}`
        );
        const parsed = JSON.parse(payload.replace(/```json|```/gi, "").trim());
        const validation = aiBlueprintSchema.safeParse(parsed);
        if (!validation.success) throw new Error("Schema Blueprint Inválido");
        text = validation.data.blueprint;
      } catch (e: any) {
        toast.warning("OpenAI falhou de forma controlada: " + e.message, { duration: 3000 });
        const tF = rawName.toUpperCase();
        if (aiGeneratedType === "acolhimento") {
          text = `### Blueprint: ${tF}\n\n**Alocação:** Infraestrutura de Front-Desk.\n\n**Ações:** Fila digital estruturada • Capacitação Parajurídica\n\n**Times:** Relacionamento Humano, Advogados Pro-Bono.`;
        } else if (aiGeneratedType === "medicos") {
          text = `### Blueprint B2B: ${tF}\n\n**Alocação:** LinkedIn InMail.\n\n**Ações:** Dossiês • Reuniões Clínicas Digitais\n\n**Times:** Técnico, Suporte Médico, Growth Médicos.`;
        } else if (aiGeneratedType === "sazonal") {
          text = `### Blueprint Sazonal: ${tF}\n\n**Alocação:** 100% mídia qualificada na janela da data.\n\n**Ações:** Impacto visual IG • Captação via Direct\n\n**Times:** Marketing, P.R., Atendimento Emergencial.`;
        } else {
          text = `### Matriz Operacional: ${tF}\n\n**Alocação:** 70% Mídia Ativa, 30% Estruturação.\n\n**Times:** Coordenação Geral, Growth & Mídia, Comunicação Interna.`;
        }
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
        type:          WIZARD_TYPE_TO_CAMPAIGN_TYPE[aiGeneratedType] ?? "awareness",
        status:        "draft",
        objective:     proposicao || undefined,
        channels:      aiChannels,
        dna_direcao:   direcao,
        dna_experiencia: experiencia,
        dna_modulos:   modulos,
      });
      setIsSaved(true);
      toast.success("Blueprint e DNA salvos com sucesso!");
    } catch (e) {
      toast.error("Erro ao salvar campanha.");
    }
  };

  // ── GENERATE PLAN ────────────────────────────────────────
  const generateActionPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const payload = await callOpenAI(
        `Crie o Plano de Ação Tático para "${rawName}". Responda JSON: { "governanca": ["tarefa"], "producao": ["tarefa"], "distribuicao": ["tarefa"] }.`,
        `Blueprint: ${blueprintTheory.substring(0, 300)}... Orçamento: R$ ${orcamento}.`
      );
      const parsed = JSON.parse(payload.replace(/```json|```/gi, "").trim());
      const validation = aiActionPlanSchema.safeParse(parsed);
      let gates = parsed;
      if (validation.success) {
        gates = validation.data;
      } else {
        toast.warning("Zod Validation Failed on Action Plan. Using Raw parsed output.", { duration: 3000 })
      }

      toast.info("Criando Iniciativa Base...");
      const initObj = await createInitiative({ name: `Campanha V8: ${rawName}` });
      const initiativeId = initObj.initiative.id;

      toast.info("Criando Projeto Tático...");
      const projObj = await createProject({ name: `Ativação Técnica: ${rawName}`, startDate: new Date(), initiativeId, status: "active", category: "custom" });
      const projectId = projObj.project.id;

      for (const [gateName, tasks] of Object.entries(gates)) {
        if (!Array.isArray(tasks) || tasks.length === 0) continue;
        const stageObj = await createStage({ projectId, name: `Gate: ${gateName.toUpperCase()}` });
        const stageId  = stageObj.stage.id;
        for (const t of tasks) {
          await createTask({ projectId, stageId, name: String(t), status: "open", priority: "medium", shift: "morning" });
        }
      }

      toast.success("Plano de Ação construído no CoreAct!");
      onClose();
    } catch (e: any) {
      toast.error("Falha ao gerar plano: " + e.message);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return {
    state: {
      isGenerating, isSaved, isGeneratingPlan, step,
      rawName, direcao, experiencia, modulos, proposicao, suggestedPropositions, orcamento,
      aiGeneratedType, activeFunnels, aiBriefing, aiChannels, aiKpi, blueprintTheory
    },
    actions: {
      setStep, setRawName, setDirecao, setExperiencia, setModulos, setProposicao, setOrcamento,
      nextStepTema, nextStepProposicao, nextStepOrcamento, generateBlueprintDense, finishCreation, generateActionPlan
    }
  };
}
