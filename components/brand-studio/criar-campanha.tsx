import { useState } from "react";
import { X, Wand2, ArrowRight, Lightbulb, PackageOpen, LayoutTemplate, Settings2 } from "lucide-react";
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
  
  // Caderneta State
  const [form, setForm] = useState({
    title: "",
    what: "",
    why: "",
    how: "",
    when: "",
    quantitative: "",
    rawInput: ""
  });

  const [viewMode, setViewMode] = useState<"maximalist" | "minimalist">("maximalist");

  const handleGenerate = () => {
    if (!form.title) {
        alert("Dê um título para sua campanha!");
        return;
    }
    generateBlueprint(form);
  };

  const handleFinish = () => {
    saveCampaign({
      name: form.title || "Campanha Estratégica",
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
          
          {/* LADO A: A Caderneta (Dia Zero) */}
          <div className={styles.sideA}>
             <div className={styles.headerA}>
               <div className={styles.iconA}>
                  <LayoutTemplate size={20} />
               </div>
               <div>
                 <h2 className={styles.titleA}>A Caderneta (Dia Zero)</h2>
                 <p className={styles.subtitleA}>Mapeamento de intenções cruas.</p>
               </div>
             </div>

             <div className={styles.cadernetaArea}>
                <div className={styles.cadernetaPaper}>
                   <div className={styles.inputField}>
                      <label>Nome do Projeto</label>
                      <Input 
                        placeholder="Ex: Programa de Camisas..."
                        value={form.title}
                        onChange={e => setForm({...form, title: e.target.value})}
                        className={styles.cleanInput}
                      />
                   </div>

                   <div className={styles.divider} />

                   <div className={styles.inputField}>
                      <label>1. O que vamos fazer?</label>
                      <textarea 
                        rows={2}
                        placeholder="Descreva a ação nua e crua..."
                        value={form.what}
                        onChange={e => setForm({...form, what: e.target.value})}
                        className={styles.cleanTextarea}
                      />
                   </div>

                   <div className={styles.inputField}>
                      <label>2. Por que estamos fazendo isso?</label>
                      <textarea 
                        rows={2}
                        placeholder="A verdadeira razão de ser..."
                        value={form.why}
                        onChange={e => setForm({...form, why: e.target.value})}
                        className={styles.cleanTextarea}
                      />
                   </div>

                   <div className={styles.inputField}>
                      <label>3. Como e para quem?</label>
                      <textarea 
                        rows={2}
                        placeholder="Canais, tom de voz, público alvo..."
                        value={form.how}
                        onChange={e => setForm({...form, how: e.target.value})}
                        className={styles.cleanTextarea}
                      />
                   </div>

                   <div className={styles.rowInputs}>
                      <div className={styles.inputField} style={{ flex: 1 }}>
                         <label>4. Quando?</label>
                         <Input 
                           placeholder="Datas, sazonalidade..."
                           value={form.when}
                           onChange={e => setForm({...form, when: e.target.value})}
                           className={styles.cleanInput}
                         />
                      </div>
                      <div className={styles.inputField} style={{ flex: 1 }}>
                         <label>5. Orçamento / Volume</label>
                         <Input 
                           placeholder="Budgets ou escalas..."
                           value={form.quantitative}
                           onChange={e => setForm({...form, quantitative: e.target.value})}
                           className={styles.cleanInput}
                         />
                      </div>
                   </div>

                   <div className={styles.divider} />

                   <div className={styles.inputField}>
                      <label>Anotações Livres Adicionais</label>
                      <textarea 
                        rows={3}
                        placeholder="Tem mais alguma ideia solta? Jogue aqui."
                        value={form.rawInput}
                        onChange={e => setForm({...form, rawInput: e.target.value})}
                        className={styles.cleanTextarea}
                      />
                   </div>
                </div>
             </div>

             <div className={styles.footerA}>
                <Button 
                   onClick={handleGenerate} 
                   disabled={isGenerating || !form.title}
                   className={styles.generateBtn}
                   style={{ width: '100%' }}
                >
                   {isGenerating ? "Mapeando Arquitetura..." : "Revelar Estratégia"} <Wand2 size={16} style={{ marginLeft: '8px' }} />
                </Button>
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
                     <ArrowRight size={16} /> Homologar
                   </Button>
                 )}
               </div>
             </div>

             <div className={styles.blueprintArea}>
                {!blueprintData && !isGenerating && !isError && (
                   <div className={styles.emptyState}>
                      <Lightbulb size={48} color="rgba(255,255,255,0.1)" />
                      <p>Preencha a caderneta e clique em Revelar para transformar suas anotações rasas em um funil profissional.</p>
                   </div>
                )}

                {isGenerating && (
                   <div className={styles.loadingState}>
                      <div className={styles.pulseNode} />
                      <p>Analisando vetores estratégicos...</p>
                   </div>
                )}

                {isError && (
                   <div className={styles.errorState}>
                      <p>Erro ao conectar com o motor LLM: {(error as any)?.message}</p>
                   </div>
                )}

                {blueprintData && !isGenerating && (
                   <div className={styles.blueprintContainer}>
                      
                      {/* Dashboard Header */}
                      <div className={styles.bpDashboard}>
                         <div className={styles.bpCard}>
                            <span className={styles.bpLabel}>Classe Operacional</span>
                            <span className={styles.bpValue}>{blueprintData.category}</span>
                         </div>
                         <div className={styles.bpCard}>
                            <span className={styles.bpLabel}>Valor Imaterial Gerado</span>
                            <span className={styles.bpValue}>{blueprintData.coreValue}</span>
                         </div>
                         <div className={styles.bpCard}>
                            <span className={styles.bpLabel}>Especulação de Escala</span>
                            <span className={styles.bpValue}>{blueprintData.budgetSpeculation}</span>
                         </div>
                      </div>

                      {/* View Mode Toggle */}
                      <div className={styles.toggleContainer}>
                         <button 
                            className={viewMode === "maximalist" ? styles.toggleBtnActive : styles.toggleBtn}
                            onClick={() => setViewMode("maximalist")}
                         >
                            Potencial Máximo (Maximalista)
                         </button>
                         <button 
                            className={viewMode === "minimalist" ? styles.toggleBtnActive : styles.toggleBtn}
                            onClick={() => setViewMode("minimalist")}
                         >
                            Operação Enxuta (Minimalista)
                         </button>
                      </div>

                      <div className={styles.dividerB} />

                      {/* The 2D Architectural Funnel */}
                      <h3 className={styles.sectionTitle}>Planta Baixa (Funil de Impacto)</h3>
                      <div className={styles.funnelArchitectural}>
                         <div className={styles.archLine} />
                         {blueprintData.funnelSteps.map((step, idx) => {
                            // In Minimalist mode, we only render key strategic pillars to keep it lean
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