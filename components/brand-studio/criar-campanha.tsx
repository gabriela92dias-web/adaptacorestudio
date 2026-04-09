import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Target, Megaphone, Stethoscope, Briefcase,
  Zap, CheckCircle2, Sparkles, HeartHandshake, FileText,
  Calendar as CalendarIcon, X, Search, Magnet, Flag, Users,
} from "lucide-react";
import { toast } from "sonner";
import { useCreateCampaign } from "../../helpers/useApi";
import {
  useCreateInitiative,
  useCreateProject,
  useCreateStage,
  useCreateTask,
} from "../../helpers/useCoreActApi";
import s from "./criar-campanha.module.css";

// ─────────────────────────────────────────────────────────────
// CONSTANTES (lógica intacta)
// ─────────────────────────────────────────────────────────────

const ACTION_TYPES = [
  { id: "institucional", name: "Conscientização Institucional", icon: Target },
  { id: "acolhimento",   name: "Mutirão / Acolhimento",        icon: HeartHandshake },
  { id: "medicos",       name: "Educação Prescritora",          icon: Stethoscope },
  { id: "sazonal",       name: "Data da Saúde / Sazonal",       icon: CalendarIcon },
  { id: "pesquisa",      name: "Pesquisa / Ciência",            icon: FileText },
];

const FUNNELS = [
  { id: "awareness",     name: "Conscientizar",  desc: "Opinião Pública",   pct: "100%" },
  { id: "consideration", name: "Educação Médica", desc: "Tabus Clínicos",   pct: "83%"  },
  { id: "conversion",    name: "Acolhimento",     desc: "Entrada Oficial",   pct: "66%"  },
  { id: "retention",     name: "Acompanhamento",  desc: "Zelo Contínuo",     pct: "83%"  },
  { id: "expansion",     name: "Apoio Social",    desc: "Rede de Indicação", pct: "100%" },
];

const TACTICAL_MATRIX_DB: Record<string, { channels: string; focus: string; metrics: string }> = {
  "leads-awareness":     { channels: "Reels Virais 15s, TikTok, YouTube Shorts",   focus: "Foque no problema não mapeado.",                       metrics: "Alcance • CPM • Curtidas" },
  "leads-consideration": { channels: "Carrossel IG, YouTube Longo, Artigos SEO",   focus: "Como a metodologia sana a dor real.",                   metrics: "VTR • Tráfego • Salvamentos" },
  "leads-conversion":    { channels: "Meta Ads de Oferta Direta, Landing Page",    focus: "Apelo de Escassez e Garantia.",                         metrics: "CAC • Taxa de Conversão • ROAS" },
  "leads-retention":     { channels: "Retargeting",                                focus: "Remarketing de Confiança.",                             metrics: "Recall de Marca" },
  "leads-expansion":     { channels: "Captura de Leads Orgânica",                  focus: "Pesquisas com quem rejeitou a oferta.",                  metrics: "Crescimento da Base" },
  "members-awareness":   { channels: "Eventos Livres",                             focus: "Teasar novas atualizações.",                            metrics: "Engajamento no Grupo" },
  "members-consideration": { channels: "Masterclasses, Avisos Telegram",           focus: "Prova de que a nova feature é game-changer.",            metrics: "Taxa de Assistência" },
  "members-conversion":  { channels: "WhatsApp, Oferta Flash E-mail",              focus: "Exclusividade: preço de Ouro.",                         metrics: "Upsell • Taxa de Abertura" },
  "members-retention":   { channels: "Masterclass VIP, Carta do Fundador",         focus: "Acolhimento contínuo.",                                 metrics: "Churn Reduzido • MAU" },
  "members-expansion":   { channels: "MGM Automático",                             focus: "Programa Embaixadores.",                                metrics: "Indicações • NPS" },
  "doctors-awareness":   { channels: "LinkedIn, RP em Congressos",                 focus: "Autoridade em Tratamentos Disruptivos.",                 metrics: "Lead Magnético B2B" },
  "doctors-consideration": { channels: "Casos Clínicos PDF, Whitepapers",          focus: "Robustez e Segurança para Prescrição.",                  metrics: "Download E-book • Consultas" },
  "doctors-conversion":  { channels: "Inside Sales (Call, Key Account)",           focus: "A grande Aliança a longo prazo.",                       metrics: "Reuniões Finalizadas" },
  "doctors-retention":   { channels: "Dashboards VIP, Portal Médico",              focus: "Acompanhamento sem atrito.",                            metrics: "Pacientes Recorrentes • LTV" },
  "doctors-expansion":   { channels: "Mesa Redonda Diretiva",                      focus: "Traga mais Parceiros.",                                 metrics: "Eventos Criados pelos Médicos" },
  "ex-alunos-awareness": { channels: "Lookalike da Base, Ads IG",                  focus: "A Adapta não é mais a mesma.",                          metrics: "Taxa de Clique" },
  "ex-alunos-consideration": { channels: "Cartas Visuais, Depoimentos",            focus: "Veja a Comunidade atual vibrando.",                      metrics: "Reabertura de Contato" },
  "ex-alunos-conversion": { channels: "Campanha Flash WhatsApp",                   focus: "Isenção Completa da Taxa de Adesão.",                   metrics: "Alunos Reativados" },
  "ex-alunos-retention": { channels: "Onboarding Guiado Especialista",             focus: "Cuidaremos do problema que te fez cancelar.",           metrics: "Suporte Imediato" },
  "ex-alunos-expansion": { channels: "Pouco Custo Alocado",                        focus: "Não focar. Concentrar na volta do plano.",              metrics: "N/A" },
};

const WIZARD_TYPE_TO_CAMPAIGN_TYPE: Record<string, "awareness" | "brand_engagement" | "corporate_event" | "product_launch" | "seasonal_promotion"> = {
  institucional: "awareness",
  acolhimento:   "corporate_event",
  medicos:       "product_launch",
  sazonal:       "seasonal_promotion",
  pesquisa:      "brand_engagement",
};

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

export function CriarCampanha({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { mutateAsync: saveCampaign }     = useCreateCampaign();
  const { mutateAsync: createInitiative } = useCreateInitiative();
  const { mutateAsync: createProject }    = useCreateProject();
  const { mutateAsync: createStage }      = useCreateStage();
  const { mutateAsync: createTask }       = useCreateTask();

  const [isGenerating, setIsGenerating]         = useState(false);
  const [isSaved, setIsSaved]                   = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [step, setStep]                         = useState(0);

  // Inputs
  const [rawName, setRawName]     = useState("");
  const [direcao, setDirecao]     = useState<"interna" | "externa" | "hibrida">("externa");
  const [experiencia, setExperiencia] = useState<"presencial" | "digital" | "hibrida">("digital");
  const [modulos, setModulos]     = useState({ fisico: false, digital: true, evento: false, governanca: true });
  const [proposicao, setProposicao] = useState("");
  const [suggestedPropositions, setSuggestedPropositions] = useState<string[]>([]);
  const [orcamento, setOrcamento] = useState("");

  // AI outputs
  const [aiGeneratedType, setAiGeneratedType] = useState<string>("institucional");
  const [activeFunnels, setActiveFunnels]     = useState<Record<string, boolean>>({});
  const [aiBriefing, setAiBriefing]           = useState("");
  const [aiChannels, setAiChannels]           = useState<string[]>([]);
  const [aiKpi, setAiKpi]                     = useState({ meta: "", goal: "" });
  const [blueprintTheory, setBlueprintTheory] = useState("");

  // OpenAI
  const [openAiKey, setOpenAiKey]   = useState(() => localStorage.getItem("OPENAI_API_KEY") || "");
  const [showAiConfig, setShowAiConfig] = useState(false);

  const saveKey = (key: string) => {
    localStorage.setItem("OPENAI_API_KEY", key);
    setOpenAiKey(key);
    setShowAiConfig(false);
    toast.success("Chave OpenAI vinculada!");
  };

  async function callOpenAI(system: string, user: string) {
    const res = await fetch("/_api/ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: openAiKey, system, user }),
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
    if (!openAiKey) { setShowAiConfig(true); return; }

    setIsGenerating(true);
    let fallbackUsed = false;
    let aiProps: string[] = [];

    try {
      const payload = await callOpenAI(
        `Você é o Diretor de Estratégia de uma Associação Clínica de Cannabis. Retorne EXATAMENTE um JSON: { "proposicoes": ["Tese 1", "Tese 2", "Tese 3"] }. Cada tese máx 20 palavras, densa, focada no terceiro setor.`,
        `Tema da campanha: "${rawName}"`
      );
      const cleaned = payload.replace(/```json|```/gi, "").trim();
      const parsed  = JSON.parse(cleaned);
      aiProps = parsed.proposicoes || Object.values(parsed)[0] || [];
      if (!Array.isArray(aiProps) || aiProps.length < 3) throw new Error("Menos de 3");
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
      let type   = "institucional";
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
        data = JSON.parse(payload.replace(/```json|```/gi, "").trim());
      } catch (e: any) {
        toast.warning("OpenAI falhou: " + e.message, { duration: 5000 });
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
    if (!orcamento.trim()) return;
    setIsGenerating(true);

    try {
      const val = parseFloat(orcamento.replace(/\D/g, "")) || 0;
      let kpiObj = { meta: "", goal: "" };
      try {
        const payload = await callOpenAI(
          `Analisa orçamentos do Terceiro Setor Biomédico. Responda JSON: { "meta": "métrica curta", "goal": "parágrafo com CAC, OKRs, CPL." }`,
          `Teto de mídia: R$ ${val}. Campanha: "${rawName}". Tese: "${proposicao}".`
        );
        kpiObj = JSON.parse(payload.replace(/```json|```/gi, "").trim());
      } catch (e: any) {
        toast.warning("OpenAI falhou no Orçamento: " + e.message, { duration: 5000 });
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
        text = JSON.parse(payload.replace(/```json|```/gi, "").trim()).blueprint;
      } catch (e: any) {
        toast.warning("OpenAI falhou ao teorizar: " + e.message, { duration: 5000 });
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
      const json = JSON.parse(payload.replace(/```json|```/gi, "").trim());

      toast.info("Criando Iniciativa Base...");
      const initObj = await createInitiative({ name: `Campanha V8: ${rawName}` });
      const initiativeId = initObj.initiative.id;

      toast.info("Criando Projeto Tático...");
      const projObj = await createProject({ name: `Ativação Técnica: ${rawName}`, startDate: new Date(), initiativeId, status: "active", category: "custom" });
      const projectId = projObj.project.id;

      for (const [gateName, tasks] of Object.entries(json)) {
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

  const typeData = ACTION_TYPES.find((t) => t.id === aiGeneratedType) || ACTION_TYPES[0];
  const TypeIcon = typeData.icon;

  if (!isOpen) return null;

  // ─────────────────────────────────────────────────────────
  return (
    <div className={s.wizardRoot}>

      {/* ── AI Config Overlay ── */}
      {showAiConfig && (
        <div className={s.aiOverlay}>
          <div className={s.aiPanel}>
            <h2 className={s.aiPanelTitle}>
              <Sparkles size={18} /> Plug-in I.A. Requerido
            </h2>
            <p className={s.aiPanelText}>
              Insira sua chave <strong>OpenAI (GPT-4)</strong> abaixo. Ela ficará
              salva apenas no seu navegador localmente.
            </p>
            <input
              id="openai-key-input"
              className={s.stepInput}
              placeholder="sk-proj-..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") saveKey(e.currentTarget.value);
              }}
            />
            <div className={s.aiPanelActions}>
              <button className={s.ctaBtnSecondary} style={{ width: "auto", padding: "0 1rem" }} onClick={() => setShowAiConfig(false)}>
                Voltar ao Padrão
              </button>
              <button
                className={s.saveBtn}
                onClick={() => saveKey((document.getElementById("openai-key-input") as HTMLInputElement).value)}
              >
                Ligar Motor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          SIDE PANEL
      ══════════════════════════════════════ */}
      <aside className={s.sidePanel}>

        {/* ── Sticky header ── */}
        <header className={s.stickyHeader}>
          <div className={s.headerLeft}>
            <button className={s.backBtn} onClick={onClose}>
              <ArrowLeft size={16} />
            </button>
            <div className={s.headerMeta}>
              <span className={s.headerLabel}>Nova Campanha</span>
              <h1 className={s.headerTitle}>Construtor de Ação V8</h1>
            </div>
          </div>

          <div className={s.headerRight}>
            {step >= 4 && !isSaved && (
              <button className={s.saveBtn} onClick={finishCreation}>
                Salvar <CheckCircle2 size={13} />
              </button>
            )}
            {step >= 4 && isSaved && (
              <button className={s.coreActBtn} onClick={generateActionPlan} disabled={isGeneratingPlan}>
                {isGeneratingPlan ? "Gerando..." : "Enviar ao CoreAct"} <Zap size={13} />
              </button>
            )}
            <button className={s.closeBtn} onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </header>

        {/* ── Wizard steps ── */}
        <div className={s.wizardBody}>

          {/* ─── STEP 0: TEMA ─────────────────────────── */}
          <div className={`${s.stepItem} ${step === 0 ? "" : s.locked === undefined ? "" : ""}`}
               style={{ opacity: step === 0 || step > 0 ? 1 : 0.3, pointerEvents: step === 0 ? "auto" : "none" }}>
            <span className={s.stepLabel}>1 — Nome da campanha</span>

            {step === 0 ? (
              <>
                <input
                  autoFocus
                  className={s.stepInput}
                  value={rawName}
                  onChange={(e) => setRawName(e.target.value)}
                  placeholder="Ex: Mutirão de Acesso, Educação Médica..."
                  disabled={isGenerating}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); nextStepTema(); } }}
                />

                <div className={s.dnaSection}>
                  {/* Direção */}
                  <div className={s.dnaBlock}>
                    <span className={s.dnaBlockLabel}>Direção</span>
                    <div className={s.dnaToggles}>
                      {(["interna", "externa", "hibrida"] as const).map((dir) => (
                        <button
                          key={dir}
                          className={`${s.dnaBtn} ${direcao === dir ? s.active : ""}`}
                          onClick={() => setDirecao(dir)}
                        >
                          {dir}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Experiência */}
                  <div className={s.dnaBlock}>
                    <span className={s.dnaBlockLabel}>Experiência</span>
                    <div className={s.dnaToggles}>
                      {(["presencial", "digital", "hibrida"] as const).map((exp) => (
                        <button
                          key={exp}
                          className={`${s.dnaBtn} ${experiencia === exp ? s.active : ""}`}
                          onClick={() => setExperiencia(exp)}
                        >
                          {exp}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Módulos */}
                  <div className={s.dnaBlock}>
                    <span className={s.dnaBlockLabel}>Módulos ativos</span>
                    <div className={s.modulosGrid}>
                      {Object.keys(modulos).map((mod) => (
                        <button
                          key={mod}
                          className={`${s.dnaBtn} ${modulos[mod as keyof typeof modulos] ? s.active : ""}`}
                          onClick={() =>
                            setModulos((prev) => ({ ...prev, [mod]: !prev[mod as keyof typeof modulos] }))
                          }
                        >
                          {mod === "governanca" ? "Governança" : mod === "fisico" ? "Físico" : mod}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button className={s.ctaBtn} onClick={nextStepTema} disabled={isGenerating || !rawName.trim()}>
                  {isGenerating ? (
                    <><Sparkles size={15} className={s.spin} /> Analisando...</>
                  ) : (
                    <>Analisar e continuar <ArrowRight size={14} /></>
                  )}
                </button>
              </>
            ) : (
              <div className={s.confirmedCard}>
                <div className={s.confirmedCardRow}>
                  <span className={s.confirmedValueLarge}>{rawName}</span>
                  <button className={s.resetLink} onClick={() => setStep(0)}>Restaurar DNA</button>
                </div>
                <div className={s.confirmedTags}>
                  <span className={`${s.confirmedTag} ${s.confirmedTagActive}`}>Dir: {direcao}</span>
                  <span className={`${s.confirmedTag} ${s.confirmedTagActive}`}>Exp: {experiencia}</span>
                  {Object.keys(modulos)
                    .filter((k) => modulos[k as keyof typeof modulos])
                    .map((k) => (
                      <span key={k} className={s.confirmedTag}>
                        {k === "governanca" ? "Gov." : k === "fisico" ? "Fís." : k}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── STEP 1: PROPOSIÇÃO ───────────────────── */}
          <div style={{ opacity: step >= 1 ? 1 : 0.25, pointerEvents: step >= 1 ? "auto" : "none", transition: "opacity 0.3s" }}>
            <span className={s.stepLabel}>2 — Proposição central</span>

            {step === 1 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
                <div className={s.propOptions}>
                  {suggestedPropositions.map((sug, idx) => (
                    <button
                      key={idx}
                      className={s.propOption}
                      onClick={() => nextStepProposicao(sug)}
                      disabled={isGenerating}
                    >
                      <span className={s.propOptionNum}>{idx + 1}</span>
                      <span className={s.propOptionText}>{sug}</span>
                      <ArrowRight size={14} className={s.propOptionArrow} />
                    </button>
                  ))}
                </div>

                <div className={s.dividerRow}>
                  <div className={s.dividerLine} />
                  <span className={s.dividerLabel}>ou defina sua própria</span>
                  <div className={s.dividerLine} />
                </div>

                <textarea
                  className={s.stepTextarea}
                  value={proposicao}
                  onChange={(e) => setProposicao(e.target.value)}
                  placeholder="+ Digite seu core argument ou oferta principal..."
                  disabled={isGenerating}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); nextStepProposicao(); } }}
                />

                {proposicao.trim() ? (
                  <button className={s.ctaBtn} onClick={() => nextStepProposicao()} disabled={isGenerating}>
                    {isGenerating ? <Sparkles size={14} className={s.spin} /> : "Avançar com esta proposta"}
                  </button>
                ) : (
                  <button className={s.ctaBtnSecondary} onClick={() => nextStepProposicao("")} disabled={isGenerating}>
                    {isGenerating ? <Sparkles size={14} className={s.spin} /> : "Pular — deixar I.A. deduzir"}
                  </button>
                )}
              </div>
            ) : step > 1 ? (
              <div className={s.confirmedCard} style={{ marginTop: "0.75rem" }}>
                <div className={s.confirmedCardRow}>
                  <span className={s.confirmedValue} style={{ fontStyle: "italic", fontSize: "var(--font-size-sm)" }}>
                    "{proposicao.trim() ? proposicao : "I.A. Deduzida Automaticamente"}"
                  </span>
                  <button className={s.resetLink} onClick={() => setStep(1)}>Refazer</button>
                </div>
              </div>
            ) : (
              <div className={s.stepPlaceholder} style={{ marginTop: "0.75rem" }} />
            )}
          </div>

          {/* ─── STEP 2: ORÇAMENTO ────────────────────── */}
          <div style={{ opacity: step >= 2 ? 1 : 0.25, pointerEvents: step >= 2 ? "auto" : "none", transition: "opacity 0.3s" }}>
            <span className={s.stepLabel}>
              3 — Orçamento estimado{" "}
              <span style={{ fontWeight: 400, opacity: 0.55 }}>(opcional)</span>
            </span>

            {step === 2 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.75rem" }}>
                <input
                  autoFocus
                  className={s.stepInput}
                  value={orcamento}
                  onChange={(e) => setOrcamento(e.target.value)}
                  placeholder="Ex: R$ 5.000"
                  disabled={isGenerating}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); nextStepOrcamento(); } }}
                />
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button className={s.ctaBtn} onClick={nextStepOrcamento} disabled={isGenerating}>
                    {isGenerating ? <><Sparkles size={14} className={s.spin} /> Calculando...</> : <>Continuar <ArrowRight size={14} /></>}
                  </button>
                  {!orcamento && (
                    <button className={s.ctaBtnSecondary} style={{ flex: "0 0 auto", width: "auto", padding: "0 1rem" }} onClick={nextStepOrcamento} disabled={isGenerating}>
                      Pular
                    </button>
                  )}
                </div>
              </div>
            ) : step > 2 ? (
              <div className={s.confirmedCard} style={{ marginTop: "0.75rem" }}>
                <div className={s.confirmedCardRow}>
                  <span className={s.confirmedValueLarge}>R$ {orcamento}</span>
                  <button className={s.resetLink} onClick={() => setStep(2)}>Ajustar Teto</button>
                </div>
              </div>
            ) : (
              <div className={s.stepPlaceholder} style={{ marginTop: "0.75rem" }} />
            )}
          </div>

          {/* ─── STEP 3: GERAR BLUEPRINT ──────────────── */}
          {step >= 3 && (
            <div style={{ opacity: step >= 3 ? 1 : 0, transition: "opacity 0.4s" }}>
              {step === 3 && (
                <button className={s.ctaBtnFinal} onClick={generateBlueprintDense} disabled={isGenerating}>
                  {isGenerating ? (
                    <><Sparkles size={15} className={s.spin} /> Gerando Blueprint...</>
                  ) : (
                    <>Gerar Blueprint Acadêmico Final <Zap size={14} /></>
                  )}
                </button>
              )}
            </div>
          )}

        </div>
      </aside>

      {/* ══════════════════════════════════════
          RIGHT PANEL — Outputs
      ══════════════════════════════════════ */}
      <div className={s.rightPanel}>
        <div className={s.outputGrid}>

          {/* ── FUNIL (step 1+) ── */}
          {step >= 1 && (
            <div className={`${s.outputBlock} ${s.fullWidth}`}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span className={s.outputBlockLabel}>Arquitetura do funil</span>
                <div className={s.outputBadge}>
                  <TypeIcon size={12} strokeWidth={1.8} />
                  {typeData.name}
                </div>
              </div>

              <div className={s.funnelStack}>
                {FUNNELS.map((level, i) => {
                  const isActive = activeFunnels[level.id];
                  const isFirst  = i === 0;
                  const isLast   = i === FUNNELS.length - 1;
                  return (
                    <div
                      key={level.id}
                      className={s.funnelLevel + " " + (isActive ? s.active : "")}
                      style={{
                        width: level.pct,
                        borderRadius: isFirst ? "8px 8px 3px 3px" : isLast ? "3px 3px 8px 8px" : "3px",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      <span className={s.funnelLevelName}>{level.name}</span>
                      {isActive && (
                        <span className={s.funnelLevelDesc}>— {level.desc}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── BRIEFING (step 2+) ── */}
          {step >= 2 && (
            <div className={s.outputBlock}>
              <span className={s.outputBlockLabel}>Memorando Tático</span>
              <p className={s.briefingText}>{aiBriefing}</p>
            </div>
          )}

          {/* ── CANAIS (step 2+) ── */}
          {step >= 2 && (
            <div className={s.outputBlock}>
              <span className={s.outputBlockLabel}>Canais de Contato</span>
              <div className={s.channelList}>
                {aiChannels.map((ch) => (
                  <span key={ch} className={s.channelTag}>{ch}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── KPI (step 3+) ── */}
          {step >= 3 && (
            <div className={`${s.outputBlock} ${s.fullWidth}`}>
              <span className={s.outputBlockLabel}>Métricas Projetadas</span>
              <div className={s.kpiBlock}>
                <div className={s.kpiIcon}>
                  <Target size={22} strokeWidth={1.6} />
                </div>
                <div className={s.kpiContent}>
                  <span className={s.kpiMeta}>{aiKpi.meta}</span>
                  <p className={s.kpiGoal}>{aiKpi.goal}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── BLUEPRINT (step 4+) ── */}
          {step >= 4 && (
            <div className={`${s.blueprintBlock} ${s.fullWidth}`}>
              <div className={s.blueprintHeader}>
                <div className={s.blueprintIcon}>
                  <FileText size={18} strokeWidth={1.6} />
                </div>
                <div>
                  <h3 className={s.blueprintTitle}>Dossiê Estratégico Oficial</h3>
                  <span className={s.blueprintSubtitle}>
                    Conhecimento Clínico-Sociológico Fundamentado
                  </span>
                </div>
              </div>
              <p className={s.blueprintText}>{blueprintTheory}</p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
