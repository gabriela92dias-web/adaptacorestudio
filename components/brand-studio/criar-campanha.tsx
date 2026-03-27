import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Send, Sparkles, Target, Users, BookOpen, Lightbulb, ShieldCheck, 
  CheckCircle, Zap, PackageOpen, HeartHandshake, FileText, Magnet, Play
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCampaigns } from "../../contexts/campaigns-context";

interface CriarCampanhaProps {
  isOpen: boolean;
  onClose: () => void;
}

// O Funil de 10 Etapas do Estatuto do Agente
const FUNNEL_STAGES = [
  { id: "atrair", userMind: "Não sei", action: "Atrair", icon: Magnet, color: "var(--primary)" },
  { id: "conectar", userMind: "Isso é pra mim?", action: "Conectar", icon: Users, color: "var(--info)" },
  { id: "explicar", userMind: "Quero entender", action: "Explicar", icon: BookOpen, color: "var(--warning)" },
  { id: "clarificar", userMind: "Faz sentido", action: "Clarificar", icon: Lightbulb, color: "var(--success)" },
  { id: "confianca", userMind: "Posso confiar", action: "Gerar Confiança", icon: ShieldCheck, color: "var(--primary)" },
  { id: "validar", userMind: "Isso é real?", action: "Validar", icon: CheckCircle, color: "var(--info)" },
  { id: "friccao", userMind: "Vale a pena?", action: "Remover Fricção", icon: Zap, color: "var(--warning)" },
  { id: "converter", userMind: "Vou fazer", action: "Converter", icon: Target, color: "var(--success)" },
  { id: "entregar", userMind: "Foi bom", action: "Entregar", icon: PackageOpen, color: "var(--primary)" },
  { id: "reter", userMind: "Quero continuar", action: "Reter", icon: HeartHandshake, color: "var(--success)" },
];

export function CriarCampanha({ isOpen, onClose }: CriarCampanhaProps) {
  const { saveCampaign } = useCampaigns();
  
  // Agente Conversation
  const [messages, setMessages] = useState<{role: 'agent'|'user', text: string}[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Strategic State
  const [campaignTitle, setCampaignTitle] = useState("");
  const [activeStage, setActiveStage] = useState<number>(0); // 0 to 9
  const [funnelData, setFunnelData] = useState<Record<string, { strategy: string, focus: boolean }>>({});

  useEffect(() => {
    if (isOpen) {
      setMessages([
        { role: 'agent', text: "Olá! Sou seu coconstrutor estratégico. Vamos organizar essa campanha juntos, sem bloqueios." },
        { role: 'agent', text: "Para começarmos, qual é o tema ou o objetivo principal dessa ação que você tem em mente?" }
      ]);
      setCampaignTitle("");
      setFunnelData({});
      setActiveStage(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!currentInput.trim()) return;
    
    const userText = currentInput;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setCurrentInput("");
    setIsTyping(true);

    // AI Mock Logic based on Estatuto
    setTimeout(() => {
      setIsTyping(false);
      let agentReply = "";
      
      if (!campaignTitle) {
         setCampaignTitle(userText);
         agentReply = "Perfeito. Uma campanha sobre isso vai iniciar preenchendo o começo da jornada: a Descoberta. O público está no estado de 'Não sei'. Como vamos ATRAIR esse público pela primeira vez sem sensacionalismo?";
         setActiveStage(0);
         setFunnelData(prev => ({ ...prev, atrair: { strategy: "Identificando o público que ainda não sabe da solução de " + userText, focus: true } }));
      } else if (activeStage === 0) {
         setFunnelData(prev => ({ ...prev, atrair: { strategy: userText, focus: true }, conectar: { strategy: "Aguardando definição...", focus: true } }));
         setActiveStage(1);
         agentReply = "Ótimo. Faz muito sentido. Agora eles viram e estão se perguntando: 'Isso é pra mim?'. Como vamos CONECTAR com a dor específica deles aqui?";
      } else if (activeStage === 1) {
         setFunnelData(prev => ({ ...prev, conectar: { strategy: userText, focus: true }, explicar: { strategy: "Aguardando...", focus: true } }));
         setActiveStage(2);
         agentReply = "Compreendi a conexão. Agora o público diz: 'Quero entender'. Qual será o nosso formato educativo para EXPLICAR a ciência e o método da Adapta sem pesar na complexidade?";
      } else if (activeStage === 2) {
         setFunnelData(prev => ({ ...prev, explicar: { strategy: userText, focus: true }, clarificar: { strategy: "Em breve", focus: true } }));
         setActiveStage(3);
         agentReply = "Legal! O funil está ganhando corpo. O público já entendeu e agora diz: 'Faz sentido'. Mas precisamos CLARIFICAR os próximos passos. O que mostrar pra eles na sequência?";
      } else {
         // Fast forward logic or wrap up
         setFunnelData(prev => ({ ...prev, 
           clarificar: { strategy: userText, focus: true },
           confianca: { strategy: "Comprovação científica local.", focus: true },
           validar: { strategy: "Depoimentos em texto de médicos.", focus: true },
           friccao: { strategy: "Reduzir burocracia do primeiro contato.", focus: true },
           converter: { strategy: "Botão direto para o onboarding.", focus: true },
           entregar: { strategy: "Primeira consulta guiada e acolhimento.", focus: true },
           reter: { strategy: "Follow-up quinzenal automático.", focus: true }
         }));
         setActiveStage(9);
         agentReply = "Entendi perfeitamente. Organizei os insights no nosso Funil Estratégico ao lado, preenchendo as etapas de confiança e conversão baseado nos nossos princípios institucionais. O que acha dessa estrutura final?";
      }

      setMessages(prev => [...prev, { role: 'agent', text: agentReply }]);
    }, 1500);
  };

  const handleFinish = () => {
    saveCampaign({
      name: campaignTitle || "Nova Campanha Estratégica",
      type: "Estratégica",
      duration: 30,
      channels: ["Portal", "Redes Educativas", "Apoio Clínico"],
      posts: [],
      objective: "Descoberta ao Acolhimento",
      status: "draft",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex items-center justify-center p-4"
        style={{ backgroundColor: "var(--modal-backdrop)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full h-full max-w-[1400px] max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
          style={{ backgroundColor: "var(--site-bg)", border: "1px solid var(--border)" }}
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* LADO A: Jornada Mental do Usuário (Chat Agente) */}
          <div className="w-full md:w-5/12 flex flex-col border-r border-white/10" style={{ backgroundColor: "var(--bg-secondary)" }}>
             <div className="p-6 border-b border-white/10 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
               </div>
               <div>
                 <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Agente Estratégico</h2>
                 <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--text-tertiary)" }}>Coconstrutor Adapta</p>
               </div>
             </div>

             <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6" ref={scrollRef}>
                {messages.map((m, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                     <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                        m.role === 'user' 
                          ? 'bg-[var(--primary)] text-[var(--primary-foreground)] rounded-tr-sm' 
                          : 'bg-[var(--bg-primary)] border border-white/5 text-[var(--text-secondary)] rounded-tl-sm shadow-md'
                     }`}>
                        {m.text}
                     </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                     <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-[var(--bg-primary)] border border-white/5 flex gap-1 items-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <span className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '0.2s' }} />
                     </div>
                  </motion.div>
                )}
             </div>

             <div className="p-4 bg-[var(--bg-primary)] border-t border-white/10">
                <div className="flex items-center gap-3">
                   <Input 
                      value={currentInput}
                      onChange={e => setCurrentInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSend()}
                      placeholder="Responda sem filtros ou julgamentos..."
                      className="flex-1 bg-[var(--site-bg)] border-white/10"
                      autoFocus
                   />
                   <Button variant="default" onClick={handleSend} size="icon-md" disabled={!currentInput.trim() || isTyping}>
                      <Send className="w-4 h-4" />
                   </Button>
                </div>
                <div className="mt-4 text-[10px] text-center uppercase tracking-widest font-bold text-zinc-500">
                   O agente não bloqueia. O agente transforma.
                </div>
             </div>
          </div>

          {/* LADO B: Resposta Estratégica (Funil Adapta) */}
          <div className="w-full md:w-7/12 flex flex-col relative" style={{ backgroundColor: "var(--site-bg)" }}>
             <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[var(--site-bg)] z-10">
               <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{campaignTitle || "Projeto sem título"}</h2>
                  <p className="text-sm text-[var(--text-secondary)]">Mapa do Funil Institucional</p>
               </div>
               <div className="flex items-center gap-3">
                 <Button variant="ghost" onClick={onClose}><X className="w-5 h-5" /></Button>
                 {activeStage >= 9 && (
                   <Button variant="default" onClick={handleFinish} className="gap-2">
                     <FileText className="w-4 h-4" /> Homologar
                   </Button>
                 )}
               </div>
             </div>

             <div className="flex-1 overflow-y-auto p-8 lg:p-12">
                <div className="max-w-2xl mx-auto flex flex-col gap-3 relative">
                   {/* Decorative connecting line */}
                   <div className="absolute left-8 top-8 bottom-8 w-px bg-white/5" />

                   {FUNNEL_STAGES.map((stage, idx) => {
                      const isActive = activeStage === idx;
                      const data = funnelData[stage.id];
                      const isPast = activeStage >= idx;
                      const Icon = stage.icon;

                      return (
                        <div key={stage.id} className={`flex gap-6 items-start transition-opacity duration-700 ${isPast ? 'opacity-100' : 'opacity-30'}`}>
                           
                           {/* Status Node */}
                           <div className={`w-16 h-16 shrink-0 rounded-full flex flex-col items-center justify-center shrink-0 z-10 transition-all duration-500 ${
                              isActive ? 'bg-[var(--primary)] text-white shadow-[0_0_20px_var(--primary)]' : 
                              isPast ? 'bg-[var(--bg-secondary)] border-2 border-[var(--primary)] text-[var(--primary)]' : 
                              'bg-[var(--bg-secondary)] border border-white/10 text-zinc-600'
                           }`}>
                              <Icon className="w-5 h-5 mb-1" />
                           </div>

                           {/* Content Box */}
                           <div className={`flex-1 flex flex-col justify-center rounded-xl p-5 border transition-all duration-500 ${
                              isActive ? 'bg-[var(--bg-secondary)] border-[var(--primary)] shadow-lg' : 
                              data ? 'bg-[var(--bg-secondary)] border-white/5' : 
                              'bg-transparent border-dashed border-white/10'
                           }`}>
                              <div className="flex items-center justify-between mb-2">
                                 <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ backgroundColor: stage.color + '20', color: stage.color }}>
                                    Ação: {stage.action}
                                 </span>
                                 <span className="text-xs font-serif italic text-[var(--text-tertiary)]">
                                    "{stage.userMind}"
                                 </span>
                              </div>
                              <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                                 {data ? data.strategy : <span className="text-zinc-600">Aguardando mapeamento do agente...</span>}
                              </p>
                           </div>
                        </div>
                      )
                   })}
                   
                   <div className="mt-8 text-center text-xs text-[var(--text-tertiary)] max-w-lg mx-auto leading-relaxed border-t border-white/10 pt-8">
                     Este sistema acompanha a construção em tempo real, conectando a jornada do usuário às decisões estratégicas da Adapta. Priorizando educação, clareza e acolhimento sem fricção.
                   </div>
                </div>
             </div>
          </div>
          
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}