import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Activity, Zap, CheckCircle, Clock, Link as LinkIcon } from "lucide-react";
import { useGenerateBlueprint } from "../../helpers/useApi";
import styles from "./criar-campanha.module.css";
import { OutputType } from "../../endpoints/assistant/generate_POST.schema";

interface CriarCampanhaProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CriarCampanha({ isOpen, onClose }: CriarCampanhaProps) {
  const { mutateAsync: generateBlueprintAsync, isPending, data: blueprintData, isError, error } = useGenerateBlueprint();
  
  const [magicInput, setMagicInput] = useState("");
  const [phase, setPhase] = useState<"ignition" | "cockpit">("ignition");

  const handleIgnitionClick = async () => {
    if (!magicInput.trim()) return;
    try {
       await generateBlueprintAsync({ magicInput });
       setPhase("cockpit");
    } catch(e) {}
  };

  useEffect(() => {
    if (!isOpen) { 
      setMagicInput(""); setPhase("ignition");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.overlay}>
         <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className={styles.containerV8}>
            
            <div className={styles.header}>
               <div className={styles.headerLeft}>
                  <h1 className={styles.title}>Motor V8 (MVP - Rules Engine)</h1>
                  <span className={styles.subtitle}>CÉREBRO DETERMINÍSTICO DE GROWTH</span>
               </div>
               <button className={styles.closeBtn} onClick={onClose}>✕</button>
            </div>

            <div className={styles.contentAndSides} style={{ flexDirection: 'column', gap: '2rem', overflowY: 'auto', padding: '2rem', alignItems: 'center' }}>
               
               {/* Input Section */}
               <div className={styles.magicContainerV8} style={{ width: '100%', maxWidth: '800px' }}>
                  <Input 
                     placeholder="Qual a intenção? Ex: Captação presencial para mães atípicas..." 
                     value={magicInput} 
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMagicInput(e.target.value)}
                     onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') handleIgnitionClick(); }}
                     disabled={isPending}
                  />
                  <Button onClick={handleIgnitionClick} disabled={!magicInput.trim() || isPending} style={{ marginTop: '1rem', width: '100%' }}>
                     {isPending ? <Activity className={styles.spinIcon} /> : <><Zap size={16} style={{marginRight: 8}}/> ATIVAR MOTOR (EXTRAÇÃO LLM)</>}
                  </Button>
                  {isError && <div style={{color:'red', marginTop:'1rem'}}>{(error as Error)?.message}</div>}
               </div>
               
               {/* Output Section */}
               {phase === "cockpit" && blueprintData && (
                  <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      
                      {/* Bloco 1: DNA */}
                      <div style={{ background: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem' }}>
                          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>BLOCO 1: DNA (Via LLM Classifier)</h3>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: '#ccc' }}>
                              <div><strong>Direção:</strong> <span style={{color: '#6AC4D1'}}>{(blueprintData as OutputType).dna?.direcao?.toUpperCase()}</span></div>
                              <div><strong>Experiência:</strong> <span style={{color: '#6AC4D1'}}>{(blueprintData as OutputType).dna?.experiencia?.toUpperCase()}</span></div>
                              <div><strong>Público:</strong> <span style={{color: '#6AC4D1'}}>{(blueprintData as OutputType).dna?.segmento_publico}</span></div>
                              <div><strong>Objetivo:</strong> <span style={{color: '#6AC4D1'}}>{(blueprintData as OutputType).dna?.objetivo_primario}</span></div>
                          </div>
                      </div>

                      {/* Blocos 2..5: Motor de Regras e Soft Gates */}
                      <div style={{ background: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem' }}>
                          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>BLOCOS ROTEADOS: TRILHAS E HOOKS (Via Código Fixo)</h3>
                          
                          {/* Gates */}
                          <div style={{ marginBottom: '2rem' }}>
                              <h4 style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>SOFT GATES (RESTRIÇÕES P0)</h4>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                 {(blueprintData as OutputType).gates?.map(gate => (
                                     <div key={gate.id} style={{ background: '#1a1a1a', border: '1px dashed #444', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                         {gate.ok ? <CheckCircle size={16} color="#4caf50" /> : <Clock size={16} color="#ff9800" />}
                                         <span style={{ color: gate.critical ? '#ff5252' : '#ccc', fontSize: '0.9rem', fontWeight: gate.critical ? 'bold' : 'normal' }}>
                                            {gate.name}
                                         </span>
                                     </div>
                                 ))}
                              </div>
                          </div>

                          <h4 style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>MÓDULOS DE CAMPANHA</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              {(blueprintData as OutputType).modulos?.map(mod => (
                                  <div key={mod.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '1rem' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                          <h4 style={{ color: '#fff', margin: 0 }}>{mod.nome}</h4>
                                          <span style={{ fontSize: '0.75rem', background: '#333', padding: '2px 8px', borderRadius: '4px', color: '#aaa' }}>BLOCO {mod.bloco}</span>
                                      </div>
                                      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1rem' }}>{mod.descricao}</p>
                                      
                                      {/* Management attributes */}
                                      <div style={{ background: '#050505', padding: '0.75rem', borderRadius: '6px', border: '1px solid #1a1a1a', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                                             <span style={{ fontSize: '0.65rem', color: '#555' }}>OWNER</span>
                                             <span style={{ fontSize: '0.8rem', color: mod.owner ? '#ccc' : '#A34F4F' }}>{mod.owner || "A DEFINIR"}</span>
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                                             <span style={{ fontSize: '0.65rem', color: '#555' }}>CUSTO</span>
                                             <span style={{ fontSize: '0.8rem', color: mod.cost ? '#ccc' : '#A34F4F' }}>R$ {mod.cost}</span>
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                             <span style={{ fontSize: '0.65rem', color: '#555' }}>TRIGGER CATCHER</span>
                                             <span style={{ fontSize: '0.8rem', color: '#34B0E0' }}>{mod.okTrigger}</span>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>

                  </div>
               )}
            </div>
         </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}