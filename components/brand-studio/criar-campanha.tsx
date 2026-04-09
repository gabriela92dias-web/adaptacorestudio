import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { ArrowLeft, ArrowRight, Target, Mail, Ticket, Globe, Megaphone, Stethoscope, Briefcase, Zap, Flame, Crown, Check, CheckCircle2, Copy, Sparkles, Filter, MoreHorizontal, MessageSquare, History, Phone, CreditCard, ChevronDown, CheckCircle, Search, Settings, Building2, Eye, ShieldAlert, Users, HeartHandshake, Magnet, FileText, Flag, Calendar as CalendarIcon, X } from "lucide-react";
import { toast } from "sonner";
import { useCreateCampaign } from "../../helpers/useApi";
import { 
  useCreateInitiative, 
  useCreateProject, 
  useCreateStage, 
  useCreateTask 
} from "../../helpers/useCoreActApi";
import wizardStyles from "./criar-campanha.module.css";
// 1. NATUREZA DA AÇÃO MATRIZ ESTRATÉGICA (Types + AutoFill)
const ACTION_TYPES = [
  { 
    id: "institucional", name: "Conscientização Institucional", icon: Target, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20 hover:border-blue-500",
  },
  { 
    id: "acolhimento", name: "Mutirão / Acolhimento", icon: HeartHandshake, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20 hover:border-emerald-500",
  },
  { 
    id: "medicos", name: "Educação Prescritora", icon: Stethoscope, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20 hover:border-amber-500",
  },
  { 
    id: "sazonal", name: "Data da Saúde / Sazonal", icon: CalendarIcon, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20 hover:border-purple-500",
  },
  { 
    id: "pesquisa", name: "Pesquisa / Ciência", icon: FileText, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20 hover:border-pink-500",
  }
];

// 2. FUNIL AMPULHETA (Marketing + Vendas + Customer Success)
const FUNNELS = [
  { 
    id: "awareness", 
    name: "Descoberta / Topo", 
    desc: "O Despertar: Visitantes descobrem uma necessidade e começam a buscar soluções. Fase de atração.", 
    icon: Search,
    color: "bg-blue-500", width: "w-full"
  },
  { 
    id: "consideration", 
    name: "Consideração / Meio", 
    desc: "O Interesse: O lead admite que precisa de ajuda e cogita a sua marca como resposta. Fase de nutrição.", 
    icon: Magnet,
    color: "bg-green-500", width: "w-4/5"
  },
  { 
    id: "conversion", 
    name: "Conversão / Fundo", 
    desc: "A Decisão: O cliente decide por você e fecha negócio. Ação direta de compra/cadastro.", 
    icon: Zap,
    color: "bg-emerald-600", width: "w-3/5"
  },
  { 
    id: "retention", 
    name: "Retenção / CS", 
    desc: "Sucesso do Cliente: Gosta do serviço, usa ativamente e se mantém na comunidade (evita churn).", 
    icon: HeartHandshake,
    color: "bg-purple-500", width: "w-4/5"
  },
  { 
    id: "expansion", 
    name: "Expansão / Indicação", 
    desc: "Defensores da Marca: Tornam-se leais, compram novos produtos (upsell) e indicam amigos.", 
    icon: Sparkles,
    color: "bg-pink-500", width: "w-full"
  }
];

// 3. COMUNIDADES (Linhas da Matriz)
const COMMUNITIES = [
  { id: "leads", name: "Público Geral", desc: "Leads frios e novos seguidores", icon: Target },
  { id: "members", name: "Adapta Members", desc: "Associados e Pacientes Ativos", icon: Users },
  { id: "doctors", name: "Médicos Parceiros", desc: "Prescritores da Rede", icon: FileText },
  { id: "ex-alunos", name: "Ex-Associados", desc: "Base para reversão de Churn", icon: Flag },
];

// 4. INTELIGÊNCIA TÁTICA OCULTA EM BANCO DE DADOS (Canais, Direção e Metas KPI)
// Mapa: "communityId-funnelId" -> Dicionário Rico
const TACTICAL_MATRIX_DB: Record<string, { channels: string, focus: string, metrics: string }> = {
  // LEADS (Público Geral)
  "leads-awareness": { channels: "Reels Virais 15s, TikTok, YouTube Shorts", focus: "Foque no problema não mapeado: 'A dor que seu cliente não sabe que tem.'", metrics: "Massivo Alcance (Impressões) • CPM e CPV Baratos • Curtidas" },
  "leads-consideration": { channels: "Carrossel Extenso IG, YouTube Longo, Artigos SEO", focus: "Como a metodologia da Adapta sana aquela dor real.", metrics: "Visualização do Vídeo (VTR) • Tráfego no Site (Cliques) • Salvamentos" },
  "leads-conversion": { channels: "Meta Ads de Oferta Direta, Landing Page Otimizada", focus: "Apelo de Escassez e Garantia Absoluta: 'Sua vaga com bônus!'", metrics: "Custo por Venda (CAC) • Taxa de Conversão na Página • ROAS" },
  "leads-retention": { channels: "Retargeting em Redes", focus: "Remarketing de Confiança (Mostre o Suporte da Adapta).", metrics: "Redução de Carrinhos Abandonados • Recall de Marca" },
  "leads-expansion": { channels: "Captura de Leads Orgânica", focus: "Pesquisas com quem rejeitou a oferta principal.", metrics: "Crescimento da Base de E-mails Frios" },

  // MEMBERS (Adapta Members)
  "members-awareness": { channels: "Eventos Livres", focus: "Teasar de novas atualizações de produtos sendo incubados.", metrics: "Engajamento (Comentários de Interesse) no Grupo" },
  "members-consideration": { channels: "Masterclasses Abertas, Avisos de Telegram", focus: "A prova de que a nossa nova feature é game-changer.", metrics: "Taxa de Assistência Nas Lives Mensais" },
  "members-conversion": { channels: "Disparo no WhatsApp, Oferta Flash no E-mail", focus: "Exclusividade: O preço de Ouro de quem já é da casa.", metrics: "Picos de Upsell Realizado • Taxa de Abertura do Disparo" },
  "members-retention": { channels: "Masterclass Fechada VIP, Carta do Fundador (E-mail)", focus: "Acolhimento contínuo, Sucesso no Setup. 'Nós te pegamos pela mão.'", metrics: "Estabilidade Constante (Redução da Taxa de Churn) • MAU (Logins Frequentes)" },
  "members-expansion": { channels: "MGM Automático na Home do Sistema", focus: "Programa Embaixadores: 'Conhece alguém que sofre desse mal?'", metrics: "Indicações Qualificadas Geradas • Net Promoter Score Alto" },

  // DOCTORS (Prescritores)
  "doctors-awareness": { channels: "LinkedIn, Google Escolar, RP em Congressos", focus: "Autoridade inquestionável em Tratamentos Disruptivos.", metrics: "Pedidos Iniciais de Casos de Estudo (Lead Magnético B2B)" },
  "doctors-consideration": { channels: "Casos Clínicos PDF, Entrevistas Guiadas, Whitepapers", focus: "Robustez, Ciência de Base Plena e Segurança para a Prescrição.", metrics: "Download do E-book de Protocolo • Consultas de WhatsApp" },
  "doctors-conversion": { channels: "Inside Sales (Conversa 1a1 Call, Key Account)", focus: "A grande Aliança a longo prazo entre Adapta e a Clínica.", metrics: "Reuniões Finalizadas (Fechamento/Sign-up) e Protocolos Emitidos" },
  "doctors-retention": { channels: "Dashes VIPs do Cliente Médico, Portal Médico", focus: "Acompanhamento sem atrito total do Sucesso Terapêutico.", metrics: "Pacientes Recorrentes na Prescrição daquele Doutor • LTV" },
  "doctors-expansion": { channels: "Mesa Redonda Diretiva", focus: "Traga mais Parceiros. 'Faça Palestras pelas Clínicas Adapta'.", metrics: "Quantidade de Eventos Criados pela Base de Médicos Atuais" },

  // EX-ALUNOS (Churn / Base Antiga)
  "ex-alunos-awareness": { channels: "Anúncio 'Lookalike' da Base Suja, Ads no IG", focus: "A Adapta não é mais a que você deixou para trás (Atualização Total).", metrics: "Taxa de Clique no E-mail Velho" },
  "ex-alunos-consideration": { channels: "Cartas Visuais e Depoimentos Recentes, News VIP", focus: "Veja a Comunidade atual vibrando (Perda Psicológica/FOMO).", metrics: "Interpretação da Reabertura de Contato" },
  "ex-alunos-conversion": { channels: "Campanha Flash de Resgate no WhatsApp Tático", focus: "Isenção Completa da Taxa de Adesão caso Volte Hoje.", metrics: "Alunos Reativados e Taxa de Voltas de Assinatura" },
  "ex-alunos-retention": { channels: "Onboarding Guiado Especialista", focus: "Cuidaremos daquele problema que te fez cancelar no passado.", metrics: "Suporte Imediato Resolutivo Pós-Volta" },
  "ex-alunos-expansion": { channels: "Pouco Custo Alocado", focus: "Não focar. Focar em Recuperação Direta 100% Conversão.", metrics: "N/A - Concentre na Volta do Plano" }
};

export function CriarCampanha({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { mutateAsync: saveCampaign } = useCreateCampaign();
  const { mutateAsync: createInitiative } = useCreateInitiative();
  const { mutateAsync: createProject } = useCreateProject();
  const { mutateAsync: createStage } = useCreateStage();
  const { mutateAsync: createTask } = useCreateTask();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // PROGRESSIVE WIZARD STATE
  const [step, setStep] = useState(0);

  // USER INPUTS
  const [rawName, setRawName] = useState("");
  const [direcao, setDirecao] = useState<"interna" | "externa" | "hibrida">("externa");
  const [experiencia, setExperiencia] = useState<"presencial" | "digital" | "hibrida">("digital");
  const [modulos, setModulos] = useState({ fisico: false, digital: true, evento: false, governanca: true });
  const [proposicao, setProposicao] = useState("");
  const [suggestedPropositions, setSuggestedPropositions] = useState<string[]>([]);
  const [orcamento, setOrcamento] = useState("");

  // AI OUTPUTS 
  const [aiGeneratedType, setAiGeneratedType] = useState<string>("institucional");
  const [activeFunnels, setActiveFunnels] = useState<Record<string, boolean>>({});
  
  const [aiBriefing, setAiBriefing] = useState("");
  const [aiChannels, setAiChannels] = useState<string[]>([]);
  
  const [aiKpi, setAiKpi] = useState({ meta: "", goal: "" });
  
  const [blueprintTheory, setBlueprintTheory] = useState("");

  // AI LOGIC - REAL OPENAI INTEGRATION
  const [openAiKey, setOpenAiKey] = useState(() => localStorage.getItem("OPENAI_API_KEY") || "");
  const [showAiConfig, setShowAiConfig] = useState(false);

  const saveKey = (key: string) => {
      localStorage.setItem("OPENAI_API_KEY", key);
      setOpenAiKey(key);
      setShowAiConfig(false);
      toast.success("Chave OpenAI vinculada! O cérebro da matriz agora é real.");
  };

  async function callOpenAI(system: string, user: string) {
      // Usa proxy interno para evitar CORS em produção
      const res = await fetch("/_api/ai/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              key: openAiKey,
              system,
              user,
          })
      });
      
      if (!res.ok) {
          let errMsg = `A OpenAI retornou erro ${res.status}.`;
          try {
              const errData = await res.json();
              if (errData.error?.message) errMsg = errData.error.message;
          } catch(e) {}
          throw new Error(errMsg);
      }
      
      const data = await res.json();
      return data.choices[0].message.content;
  }

  // --- ACTIONS ---
  
  const nextStepTema = async () => {
    if (!rawName.trim()) return;
    if (!openAiKey) {
        setShowAiConfig(true);
        return;
    }
    
    setIsGenerating(true);
    let fallbackUsed = false;
    let aiProps: string[] = [];
    
    try {
        const payload = await callOpenAI(
            `Você é o Diretor de Estratégia de uma Associação Clínica de Cannabis. O usuário vai passar um TEMA de campanha. Você DEVE retornar EXATAMENTE um objeto JSON no formato: { "proposicoes": ["Tese 1", "Tese 2", "Tese 3"] }. Cada tese deve ter no máximo 20 palavras e ser ABSURDAMENTE densa, teórica, focada na mecânica do terceiro setor, sem absolutamente nenhum jargão raso de varejo ou vendas.`,
            `Tema da campanha: "${rawName}"`
        );
        const cleaned = payload.replace(/```json|```/gi, "").trim();
        const parsed = JSON.parse(cleaned);
        aiProps = parsed.proposicoes || Object.values(parsed)[0] || [];
        if (!Array.isArray(aiProps) || aiProps.length < 3) throw new Error("Menos de 3");
    } catch (e: any) {
        fallbackUsed = true;
        toast.warning("Sistema I.A. Padrão ativado: " + e.message);
        const temaFormatado = rawName.trim() ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : "Ação";
        aiProps = [
            `[OFFLINE] Desestigmatização Direcionada (${temaFormatado}): Combater a assimetria informacional munindo a pauta desta comunidade com dossiês irrefutáveis.`,
            `[OFFLINE] Expansão da Comunidade de Afinidade: Adotar um ecossistema focado no tema "${temaFormatado}" onde pacientes veteranos validam a evolução.`,
            `[OFFLINE] Cidadania Terapêutica Plena: Promover a narrativa de que o acesso cruzado com pautas de ${temaFormatado} é garantia de amparo social.`
        ];
    }

    try {
        const lowerName = rawName.toLowerCase();
        let type = "institucional";
        let funnels = { awareness: true, consideration: true, conversion: false, retention: false, expansion: false };

        if (lowerName.includes('mutirão') || lowerName.includes('acolhimento') || lowerName.includes('paciente') || lowerName.includes('associação')) {
           type = "acolhimento";
           funnels = { awareness: false, consideration: false, conversion: true, retention: true, expansion: true };
           if (fallbackUsed) {
               aiProps = [
                   `Ancoragem de Acesso Direto (${rawName}): Reduzir a latência logística entre a validação da prescrição e o contato biológico.`,
                   `Subversão da Burocracia: A estrutura da entidade absorve a fricção documental pesada deste agrupamento de ${rawName}.`,
                   `Acolhimento Terapêutico Focado: Suportar este núcleo isolado mitigando o limbo burocrático inicial do Estado frente à causa.`
               ];
           }
        } else if (lowerName.includes('médico') || lowerName.includes('prescrit') || lowerName.includes('congresso') || lowerName.includes('pesquisa')) {
           type = "medicos";
           funnels = { awareness: true, consideration: true, conversion: true, retention: false, expansion: false };
           if (fallbackUsed) {
               aiProps = [
                   `Transferência de Autoridade em Protocolos de ${rawName}: Fornecer metanálises robustas isolando os prescritores de exposição jurídica.`,
                   `Engenharia de Casos Clínicos Interpares: Transferir autoridade usando papers sobre ${rawName} segmentados para a própria classe médica.`,
                   `Concierge Clínico Compartilhado: Posicionar a associação como rede estratégica de backoffice no viés biomédico da campanha.`
               ];
           }
        } else if (lowerName.includes('setembro') || lowerName.includes('outubro') || lowerName.includes('sazonal') || lowerName.includes('dia')) {
           type = "sazonal";
           funnels = { awareness: true, consideration: true, conversion: false, retention: true, expansion: true };
           if (fallbackUsed) {
               aiProps = [
                   `Empatia Sistêmica Voltada a ${rawName}: Extrair a comunidade alvo do isolamento através da projeção social de relatos reais.`,
                   `Ressonância do Cuidado Sustentável: Alavancar a data pautando evidências explícitas da terapia como via central de reinserção.`,
                   `Janela de Acesso Social Prioritário: Redução brusca de fricção unicamente para o ecossistema afetado durante a ocorrência da data.`
               ];
           }
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

  const nextStepProposicao = async (suppliedProp?: string) => {
    const finalProp = typeof suppliedProp === 'string' ? suppliedProp : proposicao;
    setIsGenerating(true);
    setProposicao(finalProp);
    
    try {
        let data = { briefing: "", channels: ["Instagram Oficial", "Disparo E-Mail"] };
        try {
            const payload = await callOpenAI(
                `Você é o CSO operando uma campanha no Terceiro Setor em Cannabis Medicinal. Devolva um JSON estrito no formato: { "briefing": "O Memorando Tático densamente teórico validando as diretrizes, usando parágrafos e bullet points. ", "channels": ["Canal 1", "Canal 2", "Canal 3"] }. Seja brutal na densidade das métricas do terceiro setor (ex: Custo-Por-Atenção, etc).`,
                `Tema: "${rawName}". Tese Central adotada pela equipe: "${finalProp}". Estruture o Memorando Tático justificando as escolhas operacionais visando eficiência absurda no atendimento, ativismo fático e expansão de associações oficiais.`
            );
            data = JSON.parse(payload.replace(/```json|```/gi, "").trim());
        } catch (e: any) {
            toast.warning("OpenAI falhou no Tactical Briefing: " + e.message, { duration: 5000 });
            // Fallback Dinâmico
            const temaFormatado = rawName.trim() ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : "Ação Base";
            if (aiGeneratedType === "acolhimento") {
               data.briefing = `ALINHAMENTO DE FRONT-DESK (PROJETO: ${temaFormatado})\n\nA operação em torno de "${finalProp}" exige contenção imediata de latência. O cluster associado chega vulnerável (Cognitive Load Alert). O papel da base é 'Paralegal', absorvendo a carga de compliance.\n\n• Gatilho Operacional: Velocidade absoluta e acolhimento humano.`;
               data.channels = ["WhatsApp Dedicado", "Triage Telefônica", "Google Tático"];
            } else if (aiGeneratedType === "medicos") {
               data.briefing = `CONSELHO B2B ORIENTADO AO MACRO-TEMA "${temaFormatado.toUpperCase()}"\n\nA comunicação pautada em "${finalProp}" exigirá blindagem científica dos prescritores envoltos na pauta. Entregaremos proteção contra "Loss Aversion Jurídico".\n\n• Core: Metanálises isoladoras focadas em abstracts validados.`;
               data.channels = ["LinkedIn InMail Clínico", "Comitês Virtuais", "Envio Direto de Dossiês"];
            } else if (aiGeneratedType === "sazonal") {
               data.briefing = `ENGENHARIA SOCIO-CULTURAL (TEMA-ALVO: ${temaFormatado})\n\nA estratégia de "${finalProp}" capitaneia o ápice de consciência midiática para pautar fitoterapia na agenda pública (Agenda-Setting). Contexto é lei: usar a data como megafone para validação empírica.\n\n• Racional de Ação: Conectar grupos a casos de melhora clínica explícitos da associação.`;
               data.channels = ["Colaborações Sociais via Reels", "Painéis no YouTube Long-Form", "Dark Social / WhatsApp"];
            } else {
               data.briefing = `PROJEÇÃO DE MARCA (DIRECIONAL: ${temaFormatado})\n\nA operação lastreada em "${finalProp}" foca na mecânica de 'Espiral de Engajamento' atrelada visceralmente à dor/ideologia contida na premissa temática do usuário. Cultivaremos altíssimo Share of Engagement.\n\n• KPI Invisível: Fomentar massivamente cliques de 'Salvar para Estudo'.`;
               data.channels = ["Instagram Reels", "Digital PR Focado em Saúde", "Carrossel Acadêmico"];
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

  const nextStepOrcamento = async () => {
    if (!orcamento.trim()) return;
    setIsGenerating(true);
    
    try {
        const val = parseFloat(orcamento.replace(/\D/g, '')) || 0;
        let kpiObj = { meta: "", goal: "" };
        try {
            const payload = await callOpenAI(
                `Você analisa orçamentos e custos de aquisição do Terceiro Setor Biomédico. Responda um JSON estrito: { "meta": "Sua métrica densa curta", "goal": "Um parágrafo explicando a projeção tática do CAC, projeção de leads com jargões como Edge Cases, Hedge, CPL Crítico, etc." }.`,
                `A diretoria fixou um teto de mídia de R$ ${val}. A campanha é "${rawName}" sob a tese "${proposicao}". Como o Head Clínico traduziria isso em OKRs palpáveis para a associação?`
            );
            kpiObj = JSON.parse(payload.replace(/```json|```/gi, "").trim());
        } catch (e: any) {
            toast.warning("OpenAI falhou no Orçamento: " + e.message, { duration: 5000 });
            // Fallback
            if (aiGeneratedType === "acolhimento") {
                const est = Math.floor(val / 145);
                kpiObj = { meta: "Associações Oficiais (CPA Projetado: ~R$ 145)", goal: val > 0 ? `Com R$ ${orcamento}, estima-se ${est} acolhimentos. Sugerimos hedge preventivo de 15% na verba para remarketing de abandono de laudo.` : "Esforço direcionado ao inbound orgânico. CAC em isolamento." };
            } else if (aiGeneratedType === "medicos") {
                const est = Math.floor(val / 320);
                kpiObj = { meta: "Adesões de Corpo Prescritor (CPL: ~R$ 320)", goal: val > 0 ? `Prospecção viabiliza ~${est} novos parceiros prescritivistas avaliados pelo LTV Crítico. Aportar 35% em LinkedIn InMail.` : "Pipeline Outbound B2B sem impulsionamento direto de mídia." };
            } else if (aiGeneratedType === "sazonal") {
                kpiObj = { meta: "Share of Voice Transversal Sazonal", goal: val > 0 ? `R$ ${orcamento} traciona CPM ultra segmentado. Pico focal de admissões na comunidade via triagem no 'day after'.` : "Motorização via Dark Social (WhatsApp) pautada na relevância da data." };
            } else {
                kpiObj = { meta: "Atenção Social Sustentada (Voice Crítico)", goal: val > 0 ? `Calibração de R$ ${orcamento} resulta em projeção de ${(val * 4.9).toLocaleString()} impactos visuais plenos com propensão a repasse.` : "Massa crítica dependente quase unicamente de tração algorítmica nativa." };
            }
        }
        
        setAiKpi(kpiObj);
        setStep(3);
    } catch(err:any) {
        toast.error("Erro Crítico KPI: " + err.message);
    } finally {
        setIsGenerating(false);
    }
  };

  const generateBlueprintDense = async () => {
    setIsGenerating(true);
    
    try {
        let text = "";
        try {
            const modsStr = Object.entries(modulos).filter(([_, v]) => v).map(([k]) => k).join(", ");
            const dnaContext = `O DNA da campanha é: Direção [${direcao.toUpperCase()}], Experiência [${experiencia.toUpperCase()}], Módulos Táticos [${modsStr}].`;
            
            const payload = await callOpenAI(
                `Gere o Blueprint Oficial da Ação. Responda num objeto JSON estrito: { "blueprint": "Texto longo em markdown" }. O texto 'blueprint' DEVE ser a máxima fatoração lógica da operação e conter obrigatoriamente: 1) Visão Estratégica Teórica (citando Carga Cognitiva ou Agenda-Setting), 2) Sugestões práticas de alocação de Orçamento, 3) Sugestões práticas de Ações (internas e externas), 4) Sugestão detalhada de Etapas, Tarefas e Times necessários. Seja denso, técnico e estruturado no formato markdown.`,
                `Tema: "${rawName}". Tese-chave escolhida: "${proposicao}". Orçamento total: R$ ${orcamento}. ${dnaContext} Escreva este Mega-Blueprint visando a operação e o planejamento do CoreAct que virá a seguir.`
            );
            text = JSON.parse(payload.replace(/```json|```/gi, "").trim()).blueprint;
        } catch (e: any) {
            toast.warning("OpenAI falhou ao teorizar: " + e.message, { duration: 5000 });
            // Fallback
            const temaF = rawName.toUpperCase();
            if (aiGeneratedType === "acolhimento") {
                text = `### Blueprint de Operação: ${temaF}\n\nA estrutura tática para "${proposicao}" assume a urgência de Acolhimento Social.\n\n**Alocação de Verba:** Concentrada primariamente em Infraestrutura de Front-Desk.\n\n**Ações sugeridas:**\n- Fila digital estruturada\n- Capacitação de Parajurídicos\n\n**Times Envolvidos:** Relacionamento Humano, Advogados Pro-Bono.`;
            } else if (aiGeneratedType === "medicos") {
                text = `### Blueprint B2B: ${temaF}\n\nAplica-se a mitigação do 'Loss Aversion' jurídico dos prescritores.\n\n**Alocação de Verba:** Foco em Mídia Inbound (LinkedIn InMail).\n\n**Ações sugeridas:**\n- Elaboração de Dossiês\n- Reuniões Clínicas (Digital)\n\n**Times Envolvidos:** Time Técnico, Suporte Médico, Growth Médicos.`;
            } else if (aiGeneratedType === "sazonal") {
                text = `### Blueprint Sazonal: ${temaF}\n\nO Agenda-Setting da data é subvertido para fomento de utilidade clínica imediata.\n\n**Alocação Estratégica:** 100% da verba em Mídia Qualificada na janela da data.\n\n**Ações:**\n- Impacto visual no Instagram\n- Captação direta pelo Direct\n\n**Times:** Marketing, P.R., Atendimento Emergencial.`;
            } else {
                text = `### Matriz Operacional: ${temaF}\n\nO Framing Sistêmico posiciona a Associação como autoridade inquestionável.\n\n**Alocação Recomendada:** 70% Investimento Midia Ativa, 30% Estruturação.\n\n**Times:** Coordenação Geral, Growth & Mídia, Atendimento e Comunicação Interna.`;
            }
        }
        
        setBlueprintTheory(text);
        setStep(4);
    } catch(err:any) {
        toast.error("Erro Crítico Teorização: " + err.message);
    } finally {
        setIsGenerating(false);
    }
  };

  const WIZARD_TYPE_TO_CAMPAIGN_TYPE: Record<string, "awareness" | "brand_engagement" | "corporate_event" | "product_launch" | "seasonal_promotion"> = {
    institucional: "awareness",
    acolhimento: "corporate_event",
    medicos: "product_launch",
    sazonal: "seasonal_promotion",
    pesquisa: "brand_engagement",
  };

  const finishCreation = async () => {
    try {
      await saveCampaign({
         name: rawName,
         type: WIZARD_TYPE_TO_CAMPAIGN_TYPE[aiGeneratedType] ?? "awareness",
         status: "draft",
         objective: proposicao || undefined,
         channels: aiChannels,
         dna_direcao: direcao,
         dna_experiencia: experiencia,
         dna_modulos: modulos,
      });
      setIsSaved(true);
      toast.success("Blueprint e DNA Criptografado salvo com Sucesso!");
    } catch(e) {
      toast.error("Erro ao salvar campanha.");
    }
  };

  const generateActionPlan = async () => {
     setIsGeneratingPlan(true);
     try {
       const payload = await callOpenAI(
          `Você criará o Plano de Ação Tático (CoreAct) para a campanha "${rawName}". Responda estritamente um JSON neste formato: { "governanca": ["tarefa 1", "tarefa 2"], "producao": ["tarefa 3"], "distribuicao": ["tarefa 4"] }. Mantenha as tarefas curtas e voltadas para execução no terceiro setor.`,
          `O Blueprint da campanha é: ${blueprintTheory.substring(0, 300)}... O orçamento é R$ ${orcamento}.`
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
          const stageId = stageObj.stage.id;
          
          for (const t of tasks) {
             await createTask({ projectId, stageId, name: String(t), status: "open", priority: "medium", shift: "morning" });
          }
       }
       toast.success("Plano de Ação construído com sucesso no CoreAct!");
       onClose();
     } catch(e: any) {
       toast.error("Falha ao gerar plano: " + e.message);
     } finally {
       setIsGeneratingPlan(false);
     }
  };

  const typeData = ACTION_TYPES.find(t => t.id === aiGeneratedType) || ACTION_TYPES[0];
  const TypeIcon = typeData.icon;

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] min-h-screen flex flex-col md:flex-row overflow-y-auto ${wizardStyles.wizardRoot}`}>
        
      {showAiConfig && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className="bg-zinc-950 border border-emerald-500/30 p-8 rounded-2xl w-full max-w-md shadow-[0_0_100px_rgba(16,185,129,0.1)]">
              <div className="flex items-center gap-3 mb-4">
                 <Sparkles className="w-5 h-5 text-emerald-500" />
                 <h2 className="text-white font-bold tracking-widest text-lg">PLUG-IN I.A. REQUERIDO</h2>
              </div>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                 Você solicitou a inteligência artificial real. A partir de agora, as pautas da matriz não serão mais "mockadas".<br/><br/>
                 Insira sua chave <strong className="text-white">OpenAI (GPT-4)</strong> abaixo. Ela ficará salva apenas no seu navegador localmente.
              </p>
              <Input 
                 placeholder="sk-proj-..." 
                 className="bg-zinc-900 border-zinc-800 text-white font-mono text-sm h-12 mb-4 focus:border-emerald-500 focus:ring-emerald-500/20"
                 onKeyDown={(e) => {
                     if (e.key === "Enter") saveKey(e.currentTarget.value);
                 }}
                 id="openai-key-input"
                 autoFocus
              />
              <div className="flex justify-end gap-3">
                 <Button variant="ghost" className="text-zinc-500 hover:text-white" onClick={() => setShowAiConfig(false)}>Voltar ao Padrão</Button>
                 <Button onClick={() => saveKey((document.getElementById('openai-key-input') as HTMLInputElement).value)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 px-6">Ligar Motor</Button>
              </div>
           </div>
        </div>
      )}



      <aside className={`w-full md:w-[400px] lg:w-[500px] shrink-0 flex flex-col ${wizardStyles.sidePanel}`}>
        <header className={`h-16 flex items-center justify-between px-5 sticky top-0 z-50 ${wizardStyles.stickyHeader}`}>
         <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white">
               <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
               <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">Nova Campanha</span>
               <h1 className="text-sm font-semibold text-white leading-tight">Construtor de Ação V8</h1>
            </div>
         </div>
         <div className="flex items-center gap-2">
           {step >= 4 && !isSaved && (
              <Button onClick={finishCreation} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 px-4">
                 Salvar <CheckCircle2 className="w-3.5 h-3.5 ml-1.5" />
              </Button>
           )}
           {step >= 4 && isSaved && (
              <Button 
                  onClick={generateActionPlan} 
                  disabled={isGeneratingPlan}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-8 px-4"
              >
                 {isGeneratingPlan ? "Gerando..." : "Enviar ao CoreAct"}
                 <Zap className="w-3.5 h-3.5 ml-1.5" />
              </Button>
           )}
           <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white">
             <X size={18}/>
           </button>
         </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-4 -mr-4"> {/* Added pr-4 -mr-4 for custom scrollbar */}
          <main className="w-full max-w-[1600px] mx-auto p-6 lg:p-12 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* === COLUNA ESQUERDA: WIZARD ITERATIVO === */}
              <div className="lg:col-span-5 flex flex-col gap-8 relative">
                
                <div className="absolute top-4 bottom-4 left-4 w-px bg-zinc-800 hidden md:block" />

                {/* PASSO 1: TEMA */}
                <div className={`relative flex gap-6 z-10 transition-opacity duration-500 ${step >= 0 ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                  <div className="hidden md:flex flex-col items-center shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-colors ${step > 0 ? 'bg-emerald-500 text-black shadow-emerald-500/20' : step === 0 ? 'bg-zinc-900 border-2 border-emerald-500 text-emerald-500' : 'bg-zinc-900 border border-white/10 text-zinc-600'}`}>1</div>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-zinc-500 mb-3 block">Nome da campanha</label>
                    {step === 0 ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                               <Input 
                                  autoFocus 
                                  value={rawName} 
                                  onChange={e => setRawName(e.target.value)} 
                                  placeholder="Ex: Mutirão de Acesso, Educação Médica..." 
                                  className="h-14 bg-zinc-900 border-white/10 text-emerald-400 font-medium text-lg placeholder:text-zinc-600 focus-visible:ring-emerald-500"
                                  disabled={isGenerating}
                                  onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); nextStepTema(); } }}
                               />
                            </div>

                           <div className="space-y-4 pt-4 border-t border-white/5">
                               <div className="space-y-2">
                                   <label className="text-[10px] font-semibold text-zinc-500">Direção</label>
                                   <div className="flex gap-2">
                                     {['interna', 'externa', 'hibrida'].map(dir => (
                                        <button key={dir} onClick={() => setDirecao(dir as any)} className={`flex-1 py-2 text-[10px] font-bold rounded-lg border uppercase tracking-wider transition-colors ${direcao === dir ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900 border-white/5 text-zinc-600 hover:bg-zinc-800'}`}>
                                           {dir}
                                        </button>
                                     ))}
                                   </div>
                               </div>

                               <div className="space-y-2 pt-2 border-t border-white/5">
                                   <label className="text-[10px] font-semibold text-zinc-500">Experiência</label>
                                   <div className="flex gap-2">
                                     {['presencial', 'digital', 'hibrida'].map(exp => (
                                        <button key={exp} onClick={() => setExperiencia(exp as any)} className={`flex-1 py-2 text-[10px] font-bold rounded-lg border uppercase tracking-wider transition-colors ${experiencia === exp ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900 border-white/5 text-zinc-600 hover:bg-zinc-800'}`}>
                                           {exp}
                                        </button>
                                     ))}
                                   </div>
                               </div>

                                 <div className="space-y-2 pt-2 border-t border-white/5">
                                     <label className="text-[10px] font-semibold text-zinc-500">Módulos ativos</label>
                                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                       {Object.keys(modulos).map((mod) => (
                                          <button key={mod} onClick={() => setModulos(prev => ({...prev, [mod]: !prev[mod as keyof typeof modulos]}))} className={`px-2 py-3 text-[10px] font-bold rounded-lg border uppercase tracking-widest transition-colors ${modulos[mod as keyof typeof modulos] ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-zinc-900 border-white/5 text-zinc-600 hover:bg-zinc-800'}`}>
                                             {mod === 'governanca' ? 'Governança' : mod === 'fisico' ? 'Físico' : mod}                                                                       
                                          </button>
                                       ))}
                                     </div>
                                 </div>
                           </div>

                           <Button onClick={nextStepTema} disabled={isGenerating || !rawName} className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-semibold text-sm">
                              {isGenerating ? <><Sparkles className="w-4 h-4 animate-spin mr-2" /> Analisando...</> : "Analisar e continuar →"}
                           </Button>
                        </div>
                     ) : (
                        <div className="space-y-4">
                           <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl flex flex-col gap-3 shadow-inner">
                              <div className="flex items-center justify-between">
                                 <span className="text-emerald-400 font-bold text-lg">{rawName}</span>
                                 <button onClick={()=>setStep(0)} className="text-[10px] uppercase font-bold text-zinc-500 hover:text-white transition-colors tracking-widest">Restaurar DNA</button>
                              </div>
                              <div className="flex flex-wrap gap-2 text-[9px] font-bold uppercase tracking-widest">
                                 <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded">Dir: {direcao}</span>
                                 <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded">Exp: {experiencia}</span>
                                 {Object.keys(modulos).filter(k => modulos[k as keyof typeof modulos] && k !== experiencia).map(k => (
                                    <span key={k} className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-white/5">{k === 'governanca' ? 'Gov.' : k === 'fisico' ? 'Fís.' : k}</span>
                                 ))}
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
                </div>

                {/* PASSO 2: PROPOSIÇÃO CENTRAL */}
                <div className={`relative flex gap-6 z-10 transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                  <div className="hidden md:flex flex-col items-center shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-colors ${step > 1 ? 'bg-emerald-500 text-black' : step === 1 ? 'bg-zinc-900 border-2 border-emerald-500 text-emerald-500' : 'bg-zinc-900 border border-white/10 text-zinc-600'}`}>2</div>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-zinc-500 mb-3 block">Proposição central</label>
                    {step === 1 ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                           
                           <div className="flex flex-col gap-3">
                             <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-4 h-4 text-zinc-500" />
                                <p className="text-[10px] text-zinc-400 font-bold tracking-wide">Propostas do Motor I.A.:</p>
                             </div>
                             
                             {suggestedPropositions.map((sug, idx) => (
                                <button 
                                   key={idx} 
                                   onClick={() => nextStepProposicao(sug)}
                                   disabled={isGenerating}
                                   className="text-left p-4 rounded-xl border border-white/5 bg-zinc-900/80 hover:bg-zinc-800 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all group flex items-start gap-3 disabled:opacity-50"
                                >
                                   <div className="mt-0.5 bg-emerald-500/10 text-emerald-500 rounded px-1.5 py-0.5 text-[10px] font-black group-hover:bg-emerald-500 group-hover:text-black transition-colors">{idx + 1}</div>
                                   <p className="text-sm font-medium text-emerald-400/80 group-hover:text-emerald-400 leading-snug flex-1 min-w-0 break-words">{sug}</p>
                                   <ArrowRight className="w-4 h-4 shrink-0 text-emerald-500/0 ml-2 group-hover:text-emerald-500/50 transition-colors" />
                                </button>
                             ))}
                           </div>

                           <div className="flex items-center gap-4 py-2">
                              <div className="h-px bg-white/5 flex-1" />
                              <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">OU DEFINA SUA PRÓPRIA DIRETRIZ</span>
                              <div className="h-px bg-white/5 flex-1" />
                           </div>

                           <div className="relative group">
                              <textarea 
                                 value={proposicao} 
                                 onChange={e => setProposicao(e.target.value)} 
                                 placeholder="+ Digite o seu próprio core argument ou oferta principal..." 
                                 className="w-full h-24 bg-zinc-950 border border-white/10 text-emerald-400 font-medium text-sm p-4 rounded-xl placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none shadow-inner"
                                 disabled={isGenerating}
                                 onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); nextStepProposicao(); } }}
                              />
                           </div>
                           <div className="flex gap-3 pt-1">
                              {proposicao.trim() ? (
                                <Button onClick={() => nextStepProposicao()} disabled={isGenerating} className="flex-1 h-12 bg-white text-black hover:bg-zinc-200 font-bold tracking-widest uppercase text-xs">
                                   {isGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : "Avançar com Modificação Personalizada"}
                                </Button>
                              ) : (
                                <Button onClick={() => nextStepProposicao('')} disabled={isGenerating} className="flex-1 h-12 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white font-bold tracking-widest uppercase text-xs">
                                   {isGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : "Pular Tese (Deixar IA Deduzir os Canais)"}
                                </Button>
                              )}
                           </div>
                        </div>
                     ) : step > 1 ? (
                        <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl flex flex-col gap-3 shadow-inner group">
                           <div className="flex gap-3 items-start">
                               <Target className="w-4 h-4 text-emerald-500/50 mt-1 shrink-0" />
                               <span className={`font-medium text-sm leading-relaxed italic ${proposicao.trim() ? 'text-emerald-400' : 'text-zinc-500'}`}>"{proposicao.trim() ? proposicao : 'I.A. Deduzida Automaticamente (Ação sem Proposição Explícita)'}"</span>
                            </div>
                            <button onClick={()=>setStep(1)} className="text-[10px] uppercase font-bold text-zinc-500 hover:text-white transition-colors self-end tracking-widest ml-7">Refazer Proposição</button>
                         </div>
                      ) : (
                         <div className="h-14 bg-zinc-900/50 border border-dashed border-white/5 rounded-xl" />
                      )}
                  </div>
                </div>

                {/* PASSO 3: ORÇAMENTO */}
                <div className={`relative flex gap-6 z-10 transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                  <div className="hidden md:flex flex-col items-center shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-colors ${step > 2 ? 'bg-emerald-500 text-black' : step === 2 ? 'bg-zinc-900 border-2 border-emerald-500 text-emerald-500' : 'bg-zinc-900 border border-white/10 text-zinc-600'}`}>3</div>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-zinc-500 mb-3 block">Orçamento estimado <span className="font-normal opacity-60">(opcional)</span></label>
                    {step === 2 ? (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
                           <Input 
                              autoFocus
                              value={orcamento} 
                              onChange={e => setOrcamento(e.target.value)} 
                              placeholder="Ex: R$ 5.000" 
                              className="h-14 bg-zinc-900 border-white/10 text-emerald-400 font-bold text-xl placeholder:text-zinc-700 focus-visible:ring-emerald-500"
                              disabled={isGenerating}
                              onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); nextStepOrcamento(); } }}
                           />
                           <div className="flex gap-2">
                              <Button onClick={nextStepOrcamento} disabled={isGenerating} className="flex-1 h-12 bg-white text-black hover:bg-zinc-200 font-semibold text-sm">
                                 {isGenerating ? <><Sparkles className="w-4 h-4 animate-spin mr-2" /> Calculando...</> : "Continuar →"}
                              </Button>
                              {!orcamento && (
                                <Button onClick={nextStepOrcamento} disabled={isGenerating} variant="ghost" className="h-12 px-4 text-zinc-500 hover:text-white text-xs">Pular</Button>
                              )}
                           </div>
                        </div>
                     ) : step > 2 ? (
                        <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-between shadow-inner">
                           <span className="text-emerald-400 font-bold text-lg">R$ {orcamento}</span>
                           <button onClick={()=>setStep(2)} className="text-[10px] uppercase font-bold text-zinc-500 hover:text-white transition-colors tracking-widest">Ajustar Teto</button>
                        </div>
                     ) : (
                        <div className="h-14 bg-zinc-900/50 border border-dashed border-white/5 rounded-xl" />
                     )}
                  </div>
                </div>

                {/* PASSO 4: FINAL BLUEPRINT BUTTON */}
                <div className={`relative flex gap-6 z-10 transition-opacity duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <div className="flex-1 ml-0 md:ml-14">
                      {step === 3 && (
                         <Button onClick={generateBlueprintDense} disabled={isGenerating} className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black tracking-[0.2em] uppercase text-sm shadow-[0_0_20px_rgba(37,99,235,0.3)] animate-in fade-in zoom-in duration-500">
                           {isGenerating ? <Sparkles className="w-5 h-5 animate-spin" /> : "GERAR BLUEPRINT ACADÊMICO FINAL"}
                         </Button>
                      )}
                  </div>
                </div>

              </div>
            </div>
          </main>
        </div>

      </aside>

      {/* --- RIGHT COLUMN / SCROLLABLE WIZARD --- */}
      <div className={`flex-1 p-6 lg:p-12 overflow-y-auto ${wizardStyles.rightPanel}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  {/* FUNNEL OUPUT (Appears at Step 1+) */}
                  {step >= 1 && (
                    <div className="md:col-span-2 border border-[--border] rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ backgroundColor: 'var(--card)' }}>
                        <div className="flex items-center justify-between mb-5">
                           <h3 className="text-[11px] font-semibold tracking-wide text-zinc-500">Arquitetura do funil</h3>
                           <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 uppercase font-mono text-[9px]"><TypeIcon className="w-3 h-3 mr-1"/>{typeData.name}</Badge>
                        </div>
                        
                        <div className="w-full flex flex-col items-center gap-0.5">
                           {[
                             { id: "awareness",     name: "Conscientizar",   desc: "Opinião Pública",  bg: "bg-emerald-400", pct: "100%" },
                             { id: "consideration", name: "Educação Médica", desc: "Tabus Clínicos",   bg: "bg-[#10b981]", pct: "83%"  },
                             { id: "conversion",    name: "Acolhimento",     desc: "Entrada Oficial",  bg: "bg-blue-500",    pct: "66%"  },
                             { id: "retention",     name: "Acompanhamento",  desc: "Zelo Contínuo",    bg: "bg-purple-500",  pct: "83%"  },
                             { id: "expansion",     name: "Apoio Social",    desc: "Rede de Indicação",bg: "bg-pink-500",    pct: "100%" },
                           ].map((level, i) => {
                             const isActive = activeFunnels[level.id as string];
                             const isFirst = i === 0;
                             const isLast = i === 4;
                             return (
                               <div key={level.id} style={{ width: level.pct }} className="transition-all duration-700 mx-auto">
                                 <div className={`h-9 flex items-center justify-center gap-2 transition-all duration-700
                                   ${isFirst ? 'rounded-t-lg' : ''} ${isLast ? 'rounded-b-lg' : ''}
                                   ${isActive ? `${level.bg} shadow-sm` : 'bg-zinc-100 opacity-30'}`}
                                 >
                                   <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: isActive ? 'white' : 'inherit' }}>
                                     {level.name}
                                   </span>
                                   {isActive && (
                                     <span className="text-[8px] font-medium opacity-80" style={{ color: 'white' }}>
                                       — {level.desc}
                                     </span>
                                   )}
                                 </div>
                               </div>
                             );
                           })}
                        </div>
                    </div>
                  )}

                  {/* PROTOCOL E CANAIS (Appears at Step 2+) */}
                  {step >= 2 && (
                    <>
                      <div className="col-span-1 bg-zinc-900 border border-white/5 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                         <h3 className="text-[11px] font-semibold text-zinc-500 mb-4 block">Memorando Tático</h3>
                         <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20 relative">
                            <Target className="absolute top-4 right-4 w-4 h-4 text-emerald-500/50" />
                            <p className="text-xs text-zinc-300 leading-[1.6] font-medium pr-6 whitespace-pre-wrap">{aiBriefing}</p>
                         </div>
                      </div>

                      <div className="col-span-1 bg-zinc-900 border border-white/5 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                         <h3 className="text-[11px] font-semibold text-zinc-500 mb-4 block">Canais de Contato</h3>
                         <div className="flex flex-wrap gap-2">
                             {aiChannels.map(ch => (
                                <span key={ch} className="px-3 py-1.5 bg-zinc-950 border border-white/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-inner">{ch}</span>
                             ))}
                         </div>
                      </div>
                    </>
                  )}

                  {/* KPIs (Appears at Step 3+) */}
                  {step >= 3 && (
                     <div className="md:col-span-2 bg-[#0a0a0a] border border-blue-500/30 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700 flex gap-6 items-center">
                        <div className="p-4 bg-blue-500/10 rounded-full border border-blue-500/30">
                           <Target className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                           <h3 className="text-[10px] font-semibold text-blue-500 mb-1">Métricas projetadas</h3>
                           <div className="text-lg font-bold text-white mb-1">{aiKpi.meta}</div>
                           <div className="text-xs text-zinc-400 font-mono">{aiKpi.goal}</div>
                        </div>
                     </div>
                  )}

                  {/* DENSE ACADEMIC BLUEPRINT (Appears at Step 4+) */}
                  {step >= 4 && (
                     <div className="md:col-span-2 mt-4 bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 relative overflow-hidden">
                        
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />
                        
                        <div className="flex items-center gap-3 border-b border-zinc-800 pb-6 mb-6">
                           <FileText className="w-6 h-6 text-emerald-500" />
                           <div>
                             <h3 className="text-sm font-bold text-white">Dossiê Estratégico Oficial</h3>
                             <span className="text-[10px] font-mono tracking-wide text-zinc-400 block mt-1">Conhecimento Clínico-Sociológico Fundamentado</span>
                           </div>
                        </div>

                        <div className="text-xs text-zinc-300 leading-[1.8] font-serif whitespace-pre-wrap">
                           {blueprintTheory}
                        </div>
                     </div>
                  )}

               </div>
            </div>
    </div>
  );
}
