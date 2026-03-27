import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Send, Sparkles, Target, Users, BookOpen, Lightbulb, ShieldCheck, 
  CheckCircle, Zap, PackageOpen, HeartHandshake, FileText, Magnet, Play
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCreateCampaign } from "../../helpers/useApi";
import styles from "./criar-campanha.module.css";

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
  const { mutate: saveCampaign } = useCreateCampaign();
  
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
      type: "awareness",
      duration: 30,
      channels: ["Portal", "Redes Educativas", "Apoio Clínico"],
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
        className={styles.overlay}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* LADO A: Jornada Mental do Usuário (Chat Agente) */}
          <div className={styles.sideA}>
             <div className={styles.headerA}>
               <div className={styles.iconA}>
                  <Sparkles size={20} />
               </div>
               <div>
                 <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0, color: "var(--text-primary)" }}>Agente Estratégico</h2>
                 <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', margin: 0, color: "var(--text-tertiary)" }}>Coconstrutor Adapta</p>
               </div>
             </div>

             <div className={styles.chatArea} ref={scrollRef}>
                {messages.map((m, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i}
                    className={`${styles.messageRow} ${m.role === 'user' ? styles.messageRowUser : styles.messageRowAgent}`}
                  >
                     <div className={`${styles.messageBubble} ${m.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleAgent}`}>
                        {m.text}
                     </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${styles.messageRow} ${styles.messageRowAgent}`}>
                     <div className={`${styles.messageBubble} ${styles.messageBubbleAgent}`} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        Digitando...
                     </div>
                  </motion.div>
                )}
             </div>

             <div className={styles.footerA}>
                <div className={styles.inputGroup}>
                   <Input 
                      value={currentInput}
                      onChange={e => setCurrentInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSend()}
                      placeholder="Responda sem filtros ou julgamentos..."
                      style={{ flex: 1, backgroundColor: 'var(--site-bg)', border: '1px solid rgba(255,255,255,0.1)' }}
                      autoFocus
                   />
                   <Button variant="default" onClick={handleSend} disabled={!currentInput.trim() || isTyping}>
                      <Send size={16} />
                   </Button>
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.65rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', color: '#71717a' }}>
                   O agente não bloqueia. O agente transforma.
                </div>
             </div>
          </div>

          {/* LADO B: Resposta Estratégica (Funil Adapta) */}
          <div className={styles.sideB}>
             <div className={styles.headerB}>
               <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>{campaignTitle || "Projeto sem título"}</h2>
                  <p style={{ fontSize: '0.875rem', margin: 0, color: 'var(--text-secondary)' }}>Mapa do Funil Institucional</p>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <Button variant="ghost" onClick={onClose}><X size={20} /></Button>
                 {activeStage >= 9 && (
                   <Button variant="default" onClick={handleFinish} style={{ display: 'flex', gap: '0.5rem' }}>
                     <FileText size={16} /> Homologar
                   </Button>
                 )}
               </div>
             </div>

             <div className={styles.funnelArea}>
                <div className={styles.funnelGrid}>
                   {/* Decorative connecting line */}
                   <div className={styles.funnelLine} />

                   {FUNNEL_STAGES.map((stage, idx) => {
                      const isActive = activeStage === idx;
                      const data = funnelData[stage.id];
                      const isPast = activeStage >= idx;
                      const Icon = stage.icon;

                      const nodeClass = isActive ? styles.funnelNodeActive : (isPast ? styles.funnelNodePast : styles.funnelNodeFuture);
                      const boxClass = isActive ? styles.funnelBoxActive : (data ? styles.funnelBoxPast : styles.funnelBoxFuture);

                      return (
                        <div key={stage.id} className={styles.funnelRow} style={{ opacity: isPast ? 1 : 0.4 }}>
                           
                           {/* Status Node */}
                           <div className={`${styles.funnelNode} ${nodeClass}`}>
                              <Icon size={20} style={{ marginBottom: '4px' }} />
                           </div>

                           {/* Content Box */}
                           <div className={`${styles.funnelBox} ${boxClass}`}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                 <span style={{ fontSize: '0.625rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '2px 8px', borderRadius: '9999px', backgroundColor: stage.color + '20', color: stage.color }}>
                                    Ação: {stage.action}
                                 </span>
                                 <span style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-tertiary)' }}>
                                    "{stage.userMind}"
                                 </span>
                              </div>
                              <p style={{ fontSize: '0.875rem', fontWeight: 500, margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                 {data ? data.strategy : <span style={{ color: '#52525b' }}>Aguardando mapeamento do agente...</span>}
                              </p>
                           </div>
                        </div>
                      )
                   })}
                   
                   <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)', maxWidth: '32rem', marginInline: 'auto', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
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