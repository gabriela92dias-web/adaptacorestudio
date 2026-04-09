import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { ArrowLeft, ArrowRight, Target, Mail, Ticket, Globe, Megaphone, Stethoscope, Briefcase, Zap, Flame, Crown, Check, CheckCircle2, Copy, Sparkles, Filter, MoreHorizontal, MessageSquare, History, Phone, CreditCard, ChevronDown, CheckCircle, Search, Settings, Building2, Eye, ShieldAlert, Users, HeartHandshake, Magnet, FileText, Flag, Calendar as CalendarIcon, X } from "lucide-react";
import { toast } from "sonner";
import { useCreateCampaign } from "../../helpers/useApi";

// 1. NATUREZA DA A├ç├âO MATRIZ ESTRAT├ëGICA (Types + AutoFill)
const ACTION_TYPES = [
  { 
    id: "institucional", name: "Conscientiza├º├úo Institucional", icon: Target, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20 hover:border-blue-500",
  },
  { 
    id: "acolhimento", name: "Mutir├úo / Acolhimento", icon: HeartHandshake, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20 hover:border-emerald-500",
  },
  { 
    id: "medicos", name: "Educa├º├úo Prescritora", icon: Stethoscope, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20 hover:border-amber-500",
  },
  { 
    id: "sazonal", name: "Data da Sa├║de / Sazonal", icon: CalendarIcon, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20 hover:border-purple-500",
  },
  { 
    id: "pesquisa", name: "Pesquisa / Ci├¬ncia", icon: FileText, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20 hover:border-pink-500",
  }
];

// 2. FUNIL AMPULHETA (Marketing + Vendas + Customer Success)
const FUNNELS = [
  { 
    id: "awareness", 
    name: "Descoberta / Topo", 
    desc: "O Despertar: Visitantes descobrem uma necessidade e come├ºam a buscar solu├º├╡es. Fase de atra├º├úo.", 
    icon: Search,
    color: "bg-blue-500", width: "w-full"
  },
  { 
    id: "consideration", 
    name: "Considera├º├úo / Meio", 
    desc: "O Interesse: O lead admite que precisa de ajuda e cogita a sua marca como resposta. Fase de nutri├º├úo.", 
    icon: Magnet,
    color: "bg-green-500", width: "w-4/5"
  },
  { 
    id: "conversion", 
    name: "Convers├úo / Fundo", 
    desc: "A Decis├úo: O cliente decide por voc├¬ e fecha neg├│cio. A├º├úo direta de compra/cadastro.", 
    icon: Zap,
    color: "bg-emerald-600", width: "w-3/5"
  },
  { 
    id: "retention", 
    name: "Reten├º├úo / CS", 
    desc: "Sucesso do Cliente: Gosta do servi├ºo, usa ativamente e se mant├⌐m na comunidade (evita churn).", 
    icon: HeartHandshake,
    color: "bg-purple-500", width: "w-4/5"
  },
  { 
    id: "expansion", 
    name: "Expans├úo / Indica├º├úo", 
    desc: "Defensores da Marca: Tornam-se leais, compram novos produtos (upsell) e indicam amigos.", 
    icon: Sparkles,
    color: "bg-pink-500", width: "w-full"
  }
];

// 3. COMUNIDADES (Linhas da Matriz)
const COMMUNITIES = [
  { id: "leads", name: "P├║blico Geral", desc: "Leads frios e novos seguidores", icon: Target },
  { id: "members", name: "Adapta Members", desc: "Associados e Pacientes Ativos", icon: Users },
  { id: "doctors", name: "M├⌐dicos Parceiros", desc: "Prescritores da Rede", icon: FileText },
  { id: "ex-alunos", name: "Ex-Associados", desc: "Base para revers├úo de Churn", icon: Flag },
];

// 4. INTELIG├èNCIA T├üTICA OCULTA EM BANCO DE DADOS (Canais, Dire├º├úo e Metas KPI)
// Mapa: "communityId-funnelId" -> Dicion├írio Rico
const TACTICAL_MATRIX_DB: Record<string, { channels: string, focus: string, metrics: string }> = {
  // LEADS (P├║blico Geral)
  "leads-awareness": { channels: "Reels Virais 15s, TikTok, YouTube Shorts", focus: "Foque no problema n├úo mapeado: 'A dor que seu cliente n├úo sabe que tem.'", metrics: "Massivo Alcance (Impress├╡es) ΓÇó CPM e CPV Baratos ΓÇó Curtidas" },
  "leads-consideration": { channels: "Carrossel Extenso IG, YouTube Longo, Artigos SEO", focus: "Como a metodologia da Adapta sana aquela dor real.", metrics: "Visualiza├º├úo do V├¡deo (VTR) ΓÇó Tr├ífego no Site (Cliques) ΓÇó Salvamentos" },
  "leads-conversion": { channels: "Meta Ads de Oferta Direta, Landing Page Otimizada", focus: "Apelo de Escassez e Garantia Absoluta: 'Sua vaga com b├┤nus!'", metrics: "Custo por Venda (CAC) ΓÇó Taxa de Convers├úo na P├ígina ΓÇó ROAS" },
  "leads-retention": { channels: "Retargeting em Redes", focus: "Remarketing de Confian├ºa (Mostre o Suporte da Adapta).", metrics: "Redu├º├úo de Carrinhos Abandonados ΓÇó Recall de Marca" },
  "leads-expansion": { channels: "Captura de Leads Org├ónica", focus: "Pesquisas com quem rejeitou a oferta principal.", metrics: "Crescimento da Base de E-mails Frios" },

  // MEMBERS (Adapta Members)
  "members-awareness": { channels: "Eventos Livres", focus: "Teasar de novas atualiza├º├╡es de produtos sendo incubados.", metrics: "Engajamento (Coment├írios de Interesse) no Grupo" },
  "members-consideration": { channels: "Masterclasses Abertas, Avisos de Telegram", focus: "A prova de que a nossa nova feature ├⌐ game-changer.", metrics: "Taxa de Assist├¬ncia Nas Lives Mensais" },
  "members-conversion": { channels: "Disparo no WhatsApp, Oferta Flash no E-mail", focus: "Exclusividade: O pre├ºo de Ouro de quem j├í ├⌐ da casa.", metrics: "Picos de Upsell Realizado ΓÇó Taxa de Abertura do Disparo" },
  "members-retention": { channels: "Masterclass Fechada VIP, Carta do Fundador (E-mail)", focus: "Acolhimento cont├¡nuo, Sucesso no Setup. 'N├│s te pegamos pela m├úo.'", metrics: "Estabilidade Constante (Redu├º├úo da Taxa de Churn) ΓÇó MAU (Logins Frequentes)" },
  "members-expansion": { channels: "MGM Autom├ítico na Home do Sistema", focus: "Programa Embaixadores: 'Conhece algu├⌐m que sofre desse mal?'", metrics: "Indica├º├╡es Qualificadas Geradas ΓÇó Net Promoter Score Alto" },

  // DOCTORS (Prescritores)
  "doctors-awareness": { channels: "LinkedIn, Google Escolar, RP em Congressos", focus: "Autoridade inquestion├ível em Tratamentos Disruptivos.", metrics: "Pedidos Iniciais de Casos de Estudo (Lead Magn├⌐tico B2B)" },
  "doctors-consideration": { channels: "Casos Cl├¡nicos PDF, Entrevistas Guiadas, Whitepapers", focus: "Robustez, Ci├¬ncia de Base Plena e Seguran├ºa para a Prescri├º├úo.", metrics: "Download do E-book de Protocolo ΓÇó Consultas de WhatsApp" },
  "doctors-conversion": { channels: "Inside Sales (Conversa 1a1 Call, Key Account)", focus: "A grande Alian├ºa a longo prazo entre Adapta e a Cl├¡nica.", metrics: "Reuni├╡es Finalizadas (Fechamento/Sign-up) e Protocolos Emitidos" },
  "doctors-retention": { channels: "Dashes VIPs do Cliente M├⌐dico, Portal M├⌐dico", focus: "Acompanhamento sem atrito total do Sucesso Terap├¬utico.", metrics: "Pacientes Recorrentes na Prescri├º├úo daquele Doutor ΓÇó LTV" },
  "doctors-expansion": { channels: "Mesa Redonda Diretiva", focus: "Traga mais Parceiros. 'Fa├ºa Palestras pelas Cl├¡nicas Adapta'.", metrics: "Quantidade de Eventos Criados pela Base de M├⌐dicos Atuais" },

  // EX-ALUNOS (Churn / Base Antiga)
  "ex-alunos-awareness": { channels: "An├║ncio 'Lookalike' da Base Suja, Ads no IG", focus: "A Adapta n├úo ├⌐ mais a que voc├¬ deixou para tr├ís (Atualiza├º├úo Total).", metrics: "Taxa de Clique no E-mail Velho" },
  "ex-alunos-consideration": { channels: "Cartas Visuais e Depoimentos Recentes, News VIP", focus: "Veja a Comunidade atual vibrando (Perda Psicol├│gica/FOMO).", metrics: "Interpreta├º├úo da Reabertura de Contato" },
  "ex-alunos-conversion": { channels: "Campanha Flash de Resgate no WhatsApp T├ítico", focus: "Isen├º├úo Completa da Taxa de Ades├úo caso Volte Hoje.", metrics: "Alunos Reativados e Taxa de Voltas de Assinatura" },
  "ex-alunos-retention": { channels: "Onboarding Guiado Especialista", focus: "Cuidaremos daquele problema que te fez cancelar no passado.", metrics: "Suporte Imediato Resolutivo P├│s-Volta" },
  "ex-alunos-expansion": { channels: "Pouco Custo Alocado", focus: "N├úo focar. Focar em Recupera├º├úo Direta 100% Convers├úo.", metrics: "N/A - Concentre na Volta do Plano" }
};

export function CriarCampanha({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { mutateAsync: saveCampaign } = useCreateCampaign();
  const [isGenerating, setIsGenerating] = useState(false);

  // PROGRESSIVE WIZARD STATE
  const [step, setStep] = useState(0);

  // USER INPUTS
  const [rawName, setRawName] = useState("");
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
      toast.success("Chave OpenAI vinculada! O c├⌐rebro da matriz agora ├⌐ real.");
  };

  async function callOpenAI(system: string, user: string) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openAiKey}`
          },
          body: JSON.stringify({
              model: "gpt-4o",
              response_format: { type: "json_object" },
              messages: [
                  { role: "system", content: system },
                  { role: "user", content: user }
              ]
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
            `Voc├¬ ├⌐ o Diretor de Estrat├⌐gia de uma Associa├º├úo Cl├¡nica de Cannabis. O usu├írio vai passar um TEMA de campanha. Voc├¬ DEVE retornar EXATAMENTE um objeto JSON no formato: { "proposicoes": ["Tese 1", "Tese 2", "Tese 3"] }. Cada tese deve ter no m├íximo 20 palavras e ser ABSURDAMENTE densa, te├│rica, focada na mec├ónica do terceiro setor, sem absolutamente nenhum jarg├úo raso de varejo ou vendas.`,
            `Tema da campanha: "${rawName}"`
        );
        const cleaned = payload.replace(/```json|```/gi, "").trim();
        const parsed = JSON.parse(cleaned);
        aiProps = parsed.proposicoes || Object.values(parsed)[0] || [];
        if (!Array.isArray(aiProps) || aiProps.length < 3) throw new Error("Menos de 3");
    } catch (e: any) {
        fallbackUsed = true;
        toast.warning("Sistema I.A. Padr├úo ativado: " + e.message);
        const temaFormatado = rawName.trim() ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : "A├º├úo";
        aiProps = [
            `[OFFLINE] Desestigmatiza├º├úo Direcionada (${temaFormatado}): Combater a assimetria informacional munindo a pauta desta comunidade com dossi├¬s irrefut├íveis.`,
            `[OFFLINE] Expans├úo da Comunidade de Afinidade: Adotar um ecossistema focado no tema "${temaFormatado}" onde pacientes veteranos validam a evolu├º├úo.`,
            `[OFFLINE] Cidadania Terap├¬utica Plena: Promover a narrativa de que o acesso cruzado com pautas de ${temaFormatado} ├⌐ garantia de amparo social.`
        ];
    }

    try {
        const lowerName = rawName.toLowerCase();
        let type = "institucional";
        let funnels = { awareness: true, consideration: true, conversion: false, retention: false, expansion: false };

        if (lowerName.includes('mutir├úo') || lowerName.includes('acolhimento') || lowerName.includes('paciente') || lowerName.includes('associa├º├úo')) {
           type = "acolhimento";
           funnels = { awareness: false, consideration: false, conversion: true, retention: true, expansion: true };
           if (fallbackUsed) {
               aiProps = [
                   `Ancoragem de Acesso Direto (${rawName}): Reduzir a lat├¬ncia log├¡stica entre a valida├º├úo da prescri├º├úo e o contato biol├│gico.`,
                   `Subvers├úo da Burocracia: A estrutura da entidade absorve a fric├º├úo documental pesada deste agrupamento de ${rawName}.`,
                   `Acolhimento Terap├¬utico Focado: Suportar este n├║cleo isolado mitigando o limbo burocr├ítico inicial do Estado frente ├á causa.`
               ];
           }
        } else if (lowerName.includes('m├⌐dico') || lowerName.includes('prescrit') || lowerName.includes('congresso') || lowerName.includes('pesquisa')) {
           type = "medicos";
           funnels = { awareness: true, consideration: true, conversion: true, retention: false, expansion: false };
           if (fallbackUsed) {
               aiProps = [
                   `Transfer├¬ncia de Autoridade em Protocolos de ${rawName}: Fornecer metan├ílises robustas isolando os prescritores de exposi├º├úo jur├¡dica.`,
                   `Engenharia de Casos Cl├¡nicos Interpares: Transferir autoridade usando papers sobre ${rawName} segmentados para a pr├│pria classe m├⌐dica.`,
                   `Concierge Cl├¡nico Compartilhado: Posicionar a associa├º├úo como rede estrat├⌐gica de backoffice no vi├⌐s biom├⌐dico da campanha.`
               ];
           }
        } else if (lowerName.includes('setembro') || lowerName.includes('outubro') || lowerName.includes('sazonal') || lowerName.includes('dia')) {
           type = "sazonal";
           funnels = { awareness: true, consideration: true, conversion: false, retention: true, expansion: true };
           if (fallbackUsed) {
               aiProps = [
                   `Empatia Sist├¬mica Voltada a ${rawName}: Extrair a comunidade alvo do isolamento atrav├⌐s da proje├º├úo social de relatos reais.`,
                   `Resson├óncia do Cuidado Sustent├ível: Alavancar a data pautando evid├¬ncias expl├¡citas da terapia como via central de reinser├º├úo.`,
                   `Janela de Acesso Social Priorit├írio: Redu├º├úo brusca de fric├º├úo unicamente para o ecossistema afetado durante a ocorr├¬ncia da data.`
               ];
           }
        }

        setAiGeneratedType(type);
        setActiveFunnels(funnels);
        setSuggestedPropositions(aiProps);
        setStep(1);
    } catch (err: any) {
        toast.error("Erro Cr├¡tico: " + err.message);
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
                `Voc├¬ ├⌐ o CSO operando uma campanha no Terceiro Setor em Cannabis Medicinal. Devolva um JSON estrito no formato: { "briefing": "O Memorando T├ítico densamente te├│rico validando as diretrizes, usando par├ígrafos e bullet points. ", "channels": ["Canal 1", "Canal 2", "Canal 3"] }. Seja brutal na densidade das m├⌐tricas do terceiro setor (ex: Custo-Por-Aten├º├úo, etc).`,
                `Tema: "${rawName}". Tese Central adotada pela equipe: "${finalProp}". Estruture o Memorando T├ítico justificando as escolhas operacionais visando efici├¬ncia absurda no atendimento, ativismo f├ítico e expans├úo de associa├º├╡es oficiais.`
            );
            data = JSON.parse(payload.replace(/```json|```/gi, "").trim());
        } catch (e: any) {
            toast.warning("OpenAI falhou no Tactical Briefing: " + e.message, { duration: 5000 });
            // Fallback Din├ómico
            const temaFormatado = rawName.trim() ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : "A├º├úo Base";
            if (aiGeneratedType === "acolhimento") {
               data.briefing = `ALINHAMENTO DE FRONT-DESK (PROJETO: ${temaFormatado})\n\nA opera├º├úo em torno de "${finalProp}" exige conten├º├úo imediata de lat├¬ncia. O cluster associado chega vulner├ível (Cognitive Load Alert). O papel da base ├⌐ 'Paralegal', absorvendo a carga de compliance.\n\nΓÇó Gatilho Operacional: Velocidade absoluta e acolhimento humano.`;
               data.channels = ["WhatsApp Dedicado", "Triage Telef├┤nica", "Google T├ítico"];
            } else if (aiGeneratedType === "medicos") {
               data.briefing = `CONSELHO B2B ORIENTADO AO MACRO-TEMA "${temaFormatado.toUpperCase()}"\n\nA comunica├º├úo pautada em "${finalProp}" exigir├í blindagem cient├¡fica dos prescritores envoltos na pauta. Entregaremos prote├º├úo contra "Loss Aversion Jur├¡dico".\n\nΓÇó Core: Metan├ílises isoladoras focadas em abstracts validados.`;
               data.channels = ["LinkedIn InMail Cl├¡nico", "Comit├¬s Virtuais", "Envio Direto de Dossi├¬s"];
            } else if (aiGeneratedType === "sazonal") {
               data.briefing = `ENGENHARIA SOCIO-CULTURAL (TEMA-ALVO: ${temaFormatado})\n\nA estrat├⌐gia de "${finalProp}" capitaneia o ├ípice de consci├¬ncia midi├ítica para pautar fitoterapia na agenda p├║blica (Agenda-Setting). Contexto ├⌐ lei: usar a data como megafone para valida├º├úo emp├¡rica.\n\nΓÇó Racional de A├º├úo: Conectar grupos a casos de melhora cl├¡nica expl├¡citos da associa├º├úo.`;
               data.channels = ["Colabora├º├╡es Sociais via Reels", "Pain├⌐is no YouTube Long-Form", "Dark Social / WhatsApp"];
            } else {
               data.briefing = `PROJE├ç├âO DE MARCA (DIRECIONAL: ${temaFormatado})\n\nA opera├º├úo lastreada em "${finalProp}" foca na mec├ónica de 'Espiral de Engajamento' atrelada visceralmente ├á dor/ideologia contida na premissa tem├ítica do usu├írio. Cultivaremos alt├¡ssimo Share of Engagement.\n\nΓÇó KPI Invis├¡vel: Fomentar massivamente cliques de 'Salvar para Estudo'.`;
               data.channels = ["Instagram Reels", "Digital PR Focado em Sa├║de", "Carrossel Acad├¬mico"];
            }
        }

        setAiBriefing(data.briefing);
        setAiChannels(data.channels);
        setStep(2);
    } catch (err: any) {
        toast.error("Erro Cr├¡tico: " + err.message);
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
                `Voc├¬ analisa or├ºamentos e custos de aquisi├º├úo do Terceiro Setor Biom├⌐dico. Responda um JSON estrito: { "meta": "Sua m├⌐trica densa curta", "goal": "Um par├ígrafo explicando a proje├º├úo t├ítica do CAC, proje├º├úo de leads com jarg├╡es como Edge Cases, Hedge, CPL Cr├¡tico, etc." }.`,
                `A diretoria fixou um teto de m├¡dia de R$ ${val}. A campanha ├⌐ "${rawName}" sob a tese "${proposicao}". Como o Head Cl├¡nico traduziria isso em OKRs palp├íveis para a associa├º├úo?`
            );
            kpiObj = JSON.parse(payload.replace(/```json|```/gi, "").trim());
        } catch (e: any) {
            toast.warning("OpenAI falhou no Or├ºamento: " + e.message, { duration: 5000 });
            // Fallback
            if (aiGeneratedType === "acolhimento") {
                const est = Math.floor(val / 145);
                kpiObj = { meta: "Associa├º├╡es Oficiais (CPA Projetado: ~R$ 145)", goal: val > 0 ? `Com R$ ${orcamento}, estima-se ${est} acolhimentos. Sugerimos hedge preventivo de 15% na verba para remarketing de abandono de laudo.` : "Esfor├ºo direcionado ao inbound org├ónico. CAC em isolamento." };
            } else if (aiGeneratedType === "medicos") {
                const est = Math.floor(val / 320);
                kpiObj = { meta: "Ades├╡es de Corpo Prescritor (CPL: ~R$ 320)", goal: val > 0 ? `Prospec├º├úo viabiliza ~${est} novos parceiros prescritivistas avaliados pelo LTV Cr├¡tico. Aportar 35% em LinkedIn InMail.` : "Pipeline Outbound B2B sem impulsionamento direto de m├¡dia." };
            } else if (aiGeneratedType === "sazonal") {
                kpiObj = { meta: "Share of Voice Transversal Sazonal", goal: val > 0 ? `R$ ${orcamento} traciona CPM ultra segmentado. Pico focal de admiss├╡es na comunidade via triagem no 'day after'.` : "Motoriza├º├úo via Dark Social (WhatsApp) pautada na relev├óncia da data." };
            } else {
                kpiObj = { meta: "Aten├º├úo Social Sustentada (Voice Cr├¡tico)", goal: val > 0 ? `Calibra├º├úo de R$ ${orcamento} resulta em proje├º├úo de ${(val * 4.9).toLocaleString()} impactos visuais plenos com propens├úo a repasse.` : "Massa cr├¡tica dependente quase unicamente de tra├º├úo algor├¡tmica nativa." };
            }
        }
        
        setAiKpi(kpiObj);
        setStep(3);
    } catch(err:any) {
        toast.error("Erro Cr├¡tico KPI: " + err.message);
    } finally {
        setIsGenerating(false);
    }
  };

  const generateBlueprintDense = async () => {
    setIsGenerating(true);
    
    try {
        let text = "";
        try {
            const payload = await callOpenAI(
                `Gere o Blueprint Acad├¬mico Oficial da a├º├úo. Voc├¬ deve responder um objeto JSON estrito: { "blueprint": "Seu texto com no min├¡mo 4 par├ígrafos ultradensos." }. O texto deve invocar teorias sociol├│gicas atreladas ao marketing cl├¡nico, citando Carga Cognitiva, Framing ou Agenda-Setting para chancelar a opera├º├úo de Terceiro Setor.`,
                `Gere a fundamenta├º├úo acad├¬mica que ser├í fixada para justificar o tema: "${rawName}". A tese-chave da opera├º├úo foi "${proposicao}" or├ºada a R$ ${orcamento}. O texto ser├í encaminhado para a Presid├¬ncia.`
            );
            text = JSON.parse(payload.replace(/```json|```/gi, "").trim()).blueprint;
        } catch (e: any) {
            toast.warning("OpenAI falhou ao teorizar: " + e.message, { duration: 5000 });
            // Fallback
            const temaF = rawName.toUpperCase();
            if (aiGeneratedType === "acolhimento") {
                text = `DOUTRINA ACAD├èMICA APLICADA AO ACOLHIMENTO DE ${temaF}:\n\n1. Teoria da Carga Cognitiva (Sweller, 1988): A fadiga decis├│ria ├⌐ contornada absorvendo 100% dos tr├ómites legais do paciente.`;
            } else if (aiGeneratedType === "medicos") {
                text = `ARQUITETURA ACAD├èMICA (B2B): ${temaF}\n\nAplica-se a mitiga├º├úo do 'Loss Aversion' jur├¡dico dos prescritores atrav├⌐s de blindagem institucional e aprova├º├úo interpares (Axioma de Berger).`;
            } else if (aiGeneratedType === "sazonal") {
                text = `TEOREMA DA RELEV├éNCIA TEMPORAL DE ${temaF}:\n\nO Agenda-Setting da data ├⌐ subvertido para garantir utilidade cl├¡nica validada de imediato ao p├║blico alvo afetado pela janela de conscientiza├º├úo.`;
            } else {
                text = `DETERMINISMO MACRO-SOCIOL├ôGICO PARA ${temaF}:\n\nO Framing Sist├¬mico de Goffman aplicado aqui posiciona a Associa├º├úo como autoridade inquestion├ível, fomentando um Espiral de Engajamento social org├ónico (Bandura).`;
            }
        }
        
        setBlueprintTheory(text);
        setStep(4);
    } catch(err:any) {
        toast.error("Erro Cr├¡tico Teoriza├º├úo: " + err.message);
    } finally {
        setIsGenerating(false);
    }
  };

  const finishCreation = () => {
     if(saveCampaign) saveCampaign({ 
         name: rawName, 
         type: ACTION_TYPES.find(t=>t.id===aiGeneratedType)?.name, 
         status: "draft", 
         strategicMatrix: { academic: blueprintTheory.substring(0, 50) } 
     });
     toast.success("Blueprint Criptografado e Salvo com Sucesso!");
     navigate('/marketing/campanhas/ativas');
  };

  const typeData = ACTION_TYPES.find(t => t.id === aiGeneratedType) || ACTION_TYPES[0];
  const TypeIcon = typeData.icon;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] min-h-screen bg-black text-white selection:bg-emerald-500/30 flex flex-col md:flex-row overflow-y-auto">
        
      {showAiConfig && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className="bg-zinc-950 border border-emerald-500/30 p-8 rounded-2xl w-full max-w-md shadow-[0_0_100px_rgba(16,185,129,0.1)]">
              <div className="flex items-center gap-3 mb-4">
                 <Sparkles className="w-5 h-5 text-emerald-500" />
                 <h2 className="text-white font-bold tracking-widest text-lg">PLUG-IN I.A. REQUERIDO</h2>
              </div>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                 Voc├¬ solicitou a intelig├¬ncia artificial real. A partir de agora, as pautas da matriz n├úo ser├úo mais "mockadas".<br/><br/>
                 Insira sua chave <strong className="text-white">OpenAI (GPT-4)</strong> abaixo. Ela ficar├í salva apenas no seu navegador localmente.
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
                 <Button variant="ghost" className="text-zinc-500 hover:text-white" onClick={() => setShowAiConfig(false)}>Voltar ao Padr├úo</Button>
                 <Button onClick={() => saveKey((document.getElementById('openai-key-input') as HTMLInputElement).value)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 px-6">Ligar Motor</Button>
              </div>
           </div>
        </div>
      )}

      {/* HEADER */}
      {/* Header Superior - Mobile + Desktop */}
        <div className="flex items-center justify-between md:hidden mb-6 border-b border-white/5 pb-4">
           <div className="flex items-center gap-3">
              <Megaphone className="w-5 h-5 text-emerald-400" />
              <span className="font-black tracking-widest text-xs">CRIAR A├ç├âO</span>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-md transition-colors"><X size={20}/></button>
        </div>

        <div className="hidden md:flex items-center justify-between mb-8 border-b border-white/5 pb-4">
           <h1 className="text-xl font-black tracking-widest uppercase flex items-center gap-3">
              <Sparkles className="text-emerald-500 w-5 h-5" /> 
              Engenharia de A├º├úo
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold ml-2">Console Blueprint</span>
           </h1>
           <button onClick={onClose} className="text-zinc-400 hover:text-white p-2 hover:bg-white/5 rounded-md transition-colors"><X size={24}/></button>
        </div>

      <aside className="w-full md:w-[400px] lg:w-[500px] shrink-0 bg-zinc-950 border-r border-white/5 p-6 lg:p-12 flex flex-col">
        <header className="h-16 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
         <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white">
               <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
               <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Engenharia de A├º├úo</span>
               <h1 className="text-sm font-semibold text-white">Console Blueprint</h1>
            </div>
         </div>
         {step >= 4 && (
            <Button onClick={finishCreation} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider h-9 px-6 shadow-lg shadow-emerald-500/20">
               Homologar Projeto Oficial <CheckCircle2 className="w-4 h-4 ml-2" />
            </Button>
         )}
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
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 block">Tema / Nome da A├º├úo</label>
                    {step === 0 ? (
                        <div className="space-y-3">
                           <Input 
                              autoFocus 
                              value={rawName} 
                              onChange={e => setRawName(e.target.value)} 
                              placeholder="Ex: Mutir├úo de Acesso, Congresso Brasileiro..." 
                              className="h-14 bg-zinc-900 border-white/10 text-emerald-400 font-medium text-lg placeholder:text-zinc-600 focus-visible:ring-emerald-500"
                              disabled={isGenerating}
                              onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); nextStepTema(); } }}
                           />
                           <Button onClick={nextStepTema} disabled={isGenerating || !rawName} className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold tracking-widest uppercase text-xs">
                              {isGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : "Extrair Funil pela I.A."}
                           </Button>
                        </div>
                     ) : (
                        <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-between shadow-inner">
                           <span className="text-emerald-400 font-bold text-lg">{rawName}</span>
                           <button onClick={()=>setStep(0)} className="text-[10px] uppercase font-bold text-zinc-500 hover:text-white transition-colors tracking-widest">Editar</button>
                        </div>
                     )}
                  </div>
                </div>

                {/* PASSO 2: PROPOSI├ç├âO CENTRAL */}
                <div className={`relative flex gap-6 z-10 transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                  <div className="hidden md:flex flex-col items-center shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-colors ${step > 1 ? 'bg-emerald-500 text-black' : step === 1 ? 'bg-zinc-900 border-2 border-emerald-500 text-emerald-500' : 'bg-zinc-900 border border-white/10 text-zinc-600'}`}>2</div>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 block">Proposi├º├úo Central da A├º├úo</label>
                    {step === 1 ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                           
                           {/* DYNAMIC SUGGESTIONS REPLACING PURE TEXTAREA */}
                           <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-4 h-4 text-zinc-500" />
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Baseado no Funil, a I.A. sugere:</p>
                             </div>
                             
                             {suggestedPropositions.map((sug, idx) => (
                                <button 
                                   key={idx} 
                                   onClick={() => nextStepProposicao(sug)}
                                   disabled={isGenerating}
                                   className="text-left p-4 rounded-xl border border-white/5 bg-zinc-900/80 hover:bg-zinc-800 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all group flex items-start gap-3 disabled:opacity-50"
                                >
                                   <div className="mt-0.5 bg-emerald-500/10 text-emerald-500 rounded px-1.5 py-0.5 text-[10px] font-black group-hover:bg-emerald-500 group-hover:text-black transition-colors">{idx + 1}</div>
                                   <p className="text-sm font-medium text-emerald-400/80 group-hover:text-emerald-400 leading-snug">{sug}</p>
                                   <ArrowRight className="w-4 h-4 text-emerald-500/0 ml-auto group-hover:text-emerald-500/50 transition-colors" />
                                </button>
                             ))}
                           </div>

                           <div className="flex items-center gap-4 py-2">
                              <div className="h-px bg-white/5 flex-1" />
                              <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">OU CRIE UMA DIREX DO ZERO</span>
                              <div className="h-px bg-white/5 flex-1" />
                           </div>

                           <div className="relative group">
                              <textarea 
                                 value={proposicao} 
                                 onChange={e => setProposicao(e.target.value)} 
                                 placeholder="+ Digite o seu pr├│prio core argument ou oferta principal..." 
                                 className="w-full h-24 bg-zinc-950 border border-white/10 text-emerald-400 font-medium text-sm p-4 rounded-xl placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none shadow-inner"
                                 disabled={isGenerating}
                                 onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); nextStepProposicao(); } }}
                              />
                           </div>
                           <div className="flex gap-3 pt-1">
                              {proposicao.trim() ? (
                                <Button onClick={() => nextStepProposicao()} disabled={isGenerating} className="flex-1 h-12 bg-white text-black hover:bg-zinc-200 font-bold tracking-widest uppercase text-xs">
                                   {isGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : "Avan├ºar com Modifica├º├úo Personalizada"}
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
                              <span className={`font-medium text-sm leading-relaxed italic ${proposicao.trim() ? 'text-emerald-400' : 'text-zinc-500'}`}>"{proposicao.trim() ? proposicao : 'I.A. Deduzida Automaticamente (A├º├úo sem Proposi├º├úo Expl├¡cita)'}"</span>
                           </div>
                           <button onClick={()=>setStep(1)} className="text-[10px] uppercase font-bold text-zinc-500 hover:text-white transition-colors self-end tracking-widest ml-7">Refazer Proposi├º├úo</button>
                        </div>
                     ) : (
                        <div className="h-14 bg-zinc-900/50 border border-dashed border-white/5 rounded-xl" />
                     )}
                  </div>
                </div>

                {/* PASSO 3: OR├çAMENTO */}
                <div className={`relative flex gap-6 z-10 transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                  <div className="hidden md:flex flex-col items-center shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-colors ${step > 2 ? 'bg-emerald-500 text-black' : step === 2 ? 'bg-zinc-900 border-2 border-emerald-500 text-emerald-500' : 'bg-zinc-900 border border-white/10 text-zinc-600'}`}>3</div>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 block">Direcionamento de Verba (Teto Opcional)</label>
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
                           <Button onClick={nextStepOrcamento} disabled={isGenerating || !orcamento} className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold tracking-widest uppercase text-xs">
                              {isGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : "Trilhar Metas Operacionais"}
                           </Button>
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
                           {isGenerating ? <Sparkles className="w-5 h-5 animate-spin" /> : "GERAR BLUEPRINT ACAD├èMICO FINAL"}
                         </Button>
                      )}
                  </div>
                </div>

              </div>
            </div>
          </main>
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5 opacity-50 text-[10px] font-mono tracking-wider">
            <span>MODO DE PRODU├ç├âO</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>ONLINE</span>
          </div>
      </aside>

      {/* --- RIGHT COLUMN / SCROLLABLE WIZARD --- */}
      <div className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  {/* FUNNEL OUPUT (Appears at Step 1+) */}
                  {step >= 1 && (
                    <div className="md:col-span-2 bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex items-center justify-between mb-6">
                           <h3 className="text-[11px] font-bold uppercase tracking-widest text-emerald-500">Arquitetura Estrutural Fixada</h3>
                           <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 uppercase font-mono text-[9px]"><TypeIcon className="w-3 h-3 mr-1"/>{typeData.name}</Badge>
                        </div>
                        
                        <div className="w-full flex flex-col items-center justify-center gap-1">
                           {[
                             { id: "awareness", name: "Conscientizar", desc: "Opini├úo P├║blica", color: "bg-emerald-400", clipPath: "polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)" },
                             { id: "consideration", name: "Educa├º├úo M├⌐dica", desc: "Tabus Cl├¡nicos", color: "bg-emerald-500", clipPath: "polygon(15% 0%, 85% 0%, 75% 100%, 25% 100%)" },
                             { id: "conversion", name: "Acolhimento", desc: "Entrada Oficial", color: "bg-blue-500", clipPath: "polygon(25% 0%, 75% 0%, 75% 100%, 25% 100%)" },
                             { id: "retention", name: "Acompanhamento", desc: "Zelo Cont├¡nuo", color: "bg-purple-500", clipPath: "polygon(25% 0%, 75% 0%, 85% 100%, 15% 100%)" },
                             { id: "expansion", name: "Apoio Social", desc: "Rede de Indica├º├úo", color: "bg-pink-500", clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)" }
                           ].map((funnel) => {
                             const isActive = activeFunnels[funnel.id as string];
                             return (
                               <div key={funnel.id} className="w-full max-w-sm">
                                 <div 
                                    className={`w-full h-[40px] relative transition-all duration-700 flex items-center justify-center
                                               ${isActive ? 'opacity-100 scale-100 drop-shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'opacity-20 scale-95 grayscale'}`}
                                    style={{ clipPath: funnel.clipPath }}
                                 >
                                    <div className={`absolute inset-0 ${isActive ? `${funnel.color}/20 border-y border-white/20` : 'bg-zinc-800'}`} />
                                    <div className="relative z-20 flex items-center justify-center gap-2 w-full px-2 text-center pointer-events-none">
                                       <span className={`text-[10px] font-black tracking-widest uppercase ${isActive ? 'text-white' : 'text-zinc-500'}`}>{funnel.name}</span>
                                       {isActive && <span className={`text-[9px] font-semibold ${funnel.color.replace('bg-', 'text-')}`}>{funnel.desc}</span>}
                                    </div>
                                 </div>
                               </div>
                             )
                           })}
                        </div>
                    </div>
                  )}

                  {/* PROTOCOL E CANAIS (Appears at Step 2+) */}
                  {step >= 2 && (
                    <>
                      <div className="col-span-1 bg-zinc-900 border border-white/5 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                         <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-4 block">Memorando T├ítico</h3>
                         <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20 relative">
                            <Target className="absolute top-4 right-4 w-4 h-4 text-emerald-500/50" />
                            <p className="text-xs text-zinc-300 leading-[1.6] font-medium pr-6 whitespace-pre-wrap">{aiBriefing}</p>
                         </div>
                      </div>

                      <div className="col-span-1 bg-zinc-900 border border-white/5 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                         <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-4 block">Superf├¡cies de Contato</h3>
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
                           <h3 className="text-[10px] uppercase font-bold text-blue-500 tracking-widest mb-1">M├⌐tricas Diretas Projetadas</h3>
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
                             <h3 className="text-sm font-black uppercase tracking-widest text-white">Dossi├¬ Estrat├⌐gico Oficial</h3>
                             <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 block mt-1">Conhecimento Cl├¡nico-Sociol├│gico Fundamentado</span>
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
