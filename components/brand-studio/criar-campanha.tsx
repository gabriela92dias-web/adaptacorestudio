import { useState, useEffect } from "react";
import { X, ArrowRight, PackageOpen, LayoutTemplate, Activity } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCreateCampaign, useGenerateBlueprint } from "../../helpers/useApi";
import styles from "./criar-campanha.module.css";
import { AnimatePresence, motion } from "motion/react";

interface CriarCampanhaProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CriarCampanha({ isOpen, onClose }: CriarCampanhaProps) {
  const { mutate: saveCampaign } = useCreateCampaign();
  const { mutate: generateBlueprint, isPending: isGenerating, data: blueprintData, isError, error } = useGenerateBlueprint();
  
  // Refactored Caderneta State for Checkboxes
  const [form, setForm] = useState({
    title: "",
    category: "",
    audience: "",
    format: "",
    goals: [] as string[],
    budgetLevel: ""
  });

  const [viewMode, setViewMode] = useState<"maximalist" | "minimalist">("maximalist");
  const [isTyping, setIsTyping] = useState(false);

  // Auto-generate hook
  useEffect(() => {
    // Only fire if essential fields are selected to avoid unnecessary calls
    if (form.title && form.category && form.audience && form.format) {
      const timer = setTimeout(() => {
         generateBlueprint({
            what: `Categoria: ${form.category}`,
            how: `Formato: ${form.format}. Público alvo: ${form.audience}`,
            why: `Objetivos chave: ${form.goals.join(", ")}`,
            quantitative: `Custo especulado: ${form.budgetLevel}`,
            rawInput: `O título do projeto é: ${form.title}`
         });
      }, 1000); // 1 second debounce
      return () => clearTimeout(timer);
    }
  }, [form.title, form.category, form.audience, form.format, form.goals, form.budgetLevel]);

  const toggleGoal = (goal: string) => {
    setForm(prev => {
      if (prev.goals.includes(goal)) return { ...prev, goals: prev.goals.filter(g => g !== goal) };
      if (prev.goals.length >= 3) return prev; // max 3 selections
      return { ...prev, goals: [...prev.goals, goal] };
    });
  };

  const handleFinish = () => {
    saveCampaign({
      name: form.title || "Projeto Base",
      type: "awareness",
      duration: 30,
      channels: blueprintData ? blueprintData.suggestedAssets : [],
      objective: blueprintData ? blueprintData.coreValue : "",
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
          
          {/* LADO A: Seletores (Zero Digitação) */}
          <div className={styles.sideA}>
             <div className={styles.headerA}>
               <div className={styles.iconA}>
                  <LayoutTemplate size={20} />
               </div>
               <div>
                 <h2 className={styles.titleA}>Menu de Ação</h2>
                 <p className={styles.subtitleA}>Construção por seletores (Automático)</p>
               </div>
             </div>

             <div className={styles.cadernetaArea}>
                <div className={styles.cadernetaPaper}>
                   
                   <div className={styles.inputField}>
                      <label>Nome do Projeto (Obrigatório)</label>
                      <Input 
                        placeholder="Ex: Lançamento Q3..."
                        value={form.title}
                        onChange={e => {
                          setForm({...form, title: e.target.value});
                          setIsTyping(true);
                          setTimeout(() => setIsTyping(false), 800);
                        }}
                        className={styles.cleanInput}
                      />
                   </div>

                   <div className={styles.divider} />

                   <div className={styles.inputField}>
                      <label>1. Foco Principal</label>
                      <div className={styles.pillContainer}>
                        {["Endomarketing", "Lançamento", "Institucional", "Sazonal"].map(pill => (
                           <button 
                             key={pill} 
                             className={form.category === pill ? styles.pillActive : styles.pill}
                             onClick={() => setForm({...form, category: pill})}
                           >{pill}</button>
                        ))}
                      </div>
                   </div>

                   <div className={styles.inputField}>
                      <label>2. Público / Alcance</label>
                      <div className={styles.pillContainer}>
                        {["Membros Internos", "Clientes Atuais", "Mercado Externo"].map(pill => (
                           <button 
                             key={pill} 
                             className={form.audience === pill ? styles.pillActive : styles.pill}
                             onClick={() => setForm({...form, audience: pill})}
                           >{pill}</button>
                        ))}
                      </div>
                   </div>

                   <div className={styles.inputField}>
                      <label>3. Formato Predominante</label>
                      <div className={styles.pillContainer}>
                        {["100% Digital", "Presencial", "Híbrido"].map(pill => (
                           <button 
                             key={pill} 
                             className={form.format === pill ? styles.pillActive : styles.pill}
                             onClick={() => setForm({...form, format: pill})}
                           >{pill}</button>
                        ))}
                      </div>
                   </div>

                   <div className={styles.divider} />

                   <div className={styles.inputField}>
                      <label>4. Sentimentos a Gerar (Multi-Seleção máx 3)</label>
                      <div className={styles.pillContainer} style={{ flexWrap: 'wrap' }}>
                        {["Pertencimento", "Urgência", "Autoridade", "Acolhimento", "Exclusividade", "Confiança"].map(pill => (
                           <button 
                             key={pill} 
                             className={form.goals.includes(pill) ? styles.pillActiveCheck : styles.pill}
                             onClick={() => toggleGoal(pill)}
                           >{pill}</button>
                        ))}
                      </div>
                   </div>

                   <div className={styles.inputField} style={{ marginTop: '0.5rem' }}>
                      <label>5. Escala Especulada</label>
                      <div className={styles.pillContainer}>
                        {["Esforço Orgânico", "Baixo Custo", "Alto Impacto Financeiro"].map(pill => (
                           <button 
                             key={pill} 
                             className={form.budgetLevel === pill ? styles.pillActive : styles.pill}
                             onClick={() => setForm({...form, budgetLevel: pill})}
                           >{pill}</button>
                        ))}
                      </div>
                   </div>

                </div>
             </div>

             <div className={styles.footerA}>
                <div className={styles.autoSaveStatus}>
                   {isTyping ? "Digitando..." : (isGenerating ? <><Activity size={12} className={styles.spinIcon}/> Processando LLM...</> : "Mecanismo em Escuta (Autosave)")}
                </div>
             </div>
          </div>

          {/* LADO B: Funil Arquitetônico */}
          <div className={styles.sideB}>
             <div className={styles.headerB}>
               <div>
                  <h2 className={styles.titleB}>{form.title || "Blueprint Arquitetônico"}</h2>
                  <p className={styles.subtitleB}>Tradução estratégica em tempo real</p>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <Button variant="ghost" onClick={onClose}><X size={20} /></Button>
                 {blueprintData && (
                   <Button variant="default" onClick={handleFinish} style={{ display: 'flex', gap: '0.5rem' }}>
                     <ArrowRight size={16} /> Homologar Projeto
                   </Button>
                 )}
               </div>
             </div>

             <div className={styles.blueprintArea}>
                {!blueprintData && !isGenerating && !isError && (
                   <div className={styles.emptyState}>
                      <Activity size={48} color="rgba(255,255,255,0.1)" />
                      <p>Sua matriz estratégica reagirá aqui. Selecione o PÚBLICO, o FORMATO e o FOCO no painel esquerdo para iniciar.</p>
                   </div>
                )}

                {isGenerating && !blueprintData && (
                   <div className={styles.loadingState}>
                      <div className={styles.pulseNode} />
                      <p>Renderizando planta baixa estrutural...</p>
                   </div>
                )}

                {isError && (
                   <div className={styles.errorState}>
                      <p>Erro no construtor IA: {(error as any)?.message}</p>
                   </div>
                )}

                {blueprintData && (
                   <div className={styles.blueprintContainer} style={{ opacity: isGenerating ? 0.5 : 1, transition: 'opacity 0.5s' }}>
                      
                      {/* Dashboard Header */}
                      <div className={styles.bpDashboard}>
                         <div className={styles.bpCard}>
                            <span className={styles.bpLabel}>Natureza Operacional</span>
                            <span className={styles.bpValue}>{blueprintData.category}</span>
                         </div>
                         <div className={styles.bpCard}>
                            <span className={styles.bpLabel}>Impacto Imaterial</span>
                            <span className={styles.bpValue}>{blueprintData.coreValue}</span>
                         </div>
                         <div className={styles.bpCard}>
                            <span className={styles.bpLabel}>Orçamento Sugerido</span>
                            <span className={styles.bpValue}>{blueprintData.budgetSpeculation}</span>
                         </div>
                      </div>

                      {/* View Mode Toggle */}
                      <div className={styles.toggleContainer}>
                         <button 
                            className={viewMode === "maximalist" ? styles.toggleBtnActive : styles.toggleBtn}
                            onClick={() => setViewMode("maximalist")}
                         >
                            Potencial Pleno 
                         </button>
                         <button 
                            className={viewMode === "minimalist" ? styles.toggleBtnActive : styles.toggleBtn}
                            onClick={() => setViewMode("minimalist")}
                         >
                            Visão Enxuta
                         </button>
                      </div>

                      <div className={styles.dividerB} />

                      {/* The 2D Architectural Funnel */}
                      <h3 className={styles.sectionTitle}>Planta Mestra de {viewMode === "maximalist" ? "10 Fases" : "4 Fases"}</h3>
                      <div className={styles.funnelArchitectural}>
                         <div className={styles.archLine} />
                         {blueprintData.funnelSteps.map((step, idx) => {
                            if (viewMode === "minimalist" && !["atrair", "explicar", "converter", "reter"].includes(step.id)) {
                               return null;
                            }
                            return (
                               <div key={idx} className={styles.archRow}>
                                  <div className={styles.archStatus}>
                                     <div className={styles.archDot} />
                                  </div>
                                  <div className={styles.archBox}>
                                     <div className={styles.archBoxHeader}>
                                        <span className={styles.archBoxTag}>_{step.action.toUpperCase()}</span>
                                        <span className={styles.archBoxId}>node_0{idx + 1}</span>
                                     </div>
                                     <p className={styles.archBoxText}>{step.strategy}</p>
                                  </div>
                               </div>
                            )
                         })}
                      </div>

                      <div className={styles.dividerB} />

                      {/* Expanded Needs */}
                      <h3 className={styles.sectionTitle}>Checklist Operacional Resultante</h3>
                      <div className={styles.assetsGrid}>
                         {blueprintData.suggestedAssets.map((asset, i) => (
                           <div key={i} className={styles.assetCard}>
                              <PackageOpen size={16} />
                              <span>{asset}</span>
                           </div>
                         ))}
                      </div>

                   </div>
                )}
             </div>
          </div>
          
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}