import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Sparkles, Activity } from "lucide-react";
import { useCreateCampaign, useGenerateBlueprint } from "../../helpers/useApi";
import styles from "./criar-campanha.module.css";

interface CriarCampanhaProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CriarCampanha({ isOpen, onClose }: CriarCampanhaProps) {
  const { mutateAsync: saveCampaign } = useCreateCampaign();
  const { mutateAsync: generateBlueprintAsync, isPending: isGenerating, data: blueprintData, isError, error } = useGenerateBlueprint();
  
  const [magicInput, setMagicInput] = useState("");
  const [activeLevers, setActiveLevers] = useState<Record<string, any>>({});
  
  // Phase States
  const [phase, setPhase] = useState<"ignition" | "scoping" | "scenarios" | "blueprinting" | "cockpit">("ignition");
  const [scopingSteps, setScopingSteps] = useState<string[]>([]);
  const [visibleSteps, setVisibleSteps] = useState<string[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>("");

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleIgnitionClick = async () => {
    if (!magicInput.trim()) return;
    setActiveLevers({});
    setPhase("scoping");
    setVisibleSteps([]);
    
    // Simulate instant intelligence while waiting for network
    const fakeSteps = [
       "Decodificando a intenção base e variáveis ocultas...",
       "Cruzando restrições de orçamento, tempo e sazonalidade...",
       "Simulando atrito de conversão nos funis de aquisição...",
       "Estruturando hipóteses táticas para os 3 cenários de guerra..."
    ];
    
    let stepCount = 0;
    const interval = setInterval(() => {
       if (stepCount < fakeSteps.length) {
          setVisibleSteps(prev => [...prev, fakeSteps[stepCount]]);
          stepCount++;
       }
    }, 1200);

    try {
       const res = await generateBlueprintAsync({ magicInput, phase: "scoping" });
       clearInterval(interval);
       
       if (res.scenarios) {
          setScenarios(res.scenarios);
          // Auto reveal all remaining fake steps immediately to close the loop
          setVisibleSteps(fakeSteps);
          setTimeout(() => setPhase("scenarios"), 600);
       }
    } catch(e) {
       clearInterval(interval);
    }
  };

  const handleScenarioSelect = async (scenarioData: any) => {
    setSelectedScenario(scenarioData.title);
    setPhase("blueprinting");
    try {
       await generateBlueprintAsync({ magicInput, phase: "blueprinting", selectedScenario: scenarioData.title });
       setPhase("cockpit");
    } catch(e) {}
  };

  const handleLeverChange = (id: string, value: any) => {
    const newLevers = { ...activeLevers, [id]: value };
    setActiveLevers(newLevers);
    
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
       const formattedLevers = Object.entries(newLevers).map(([k, v]) => ({ id: k, value: v as string | number | boolean }));
       generateBlueprintAsync({ magicInput, phase: "blueprinting", selectedScenario, activeLevers: formattedLevers });
    }, 1200);
  };

  useEffect(() => {
    if (!isOpen) { 
      setMagicInput(""); setActiveLevers({}); setPhase("ignition"); setVisibleSteps([]); setScopingSteps([]); setScenarios([]); setSelectedScenario("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
         initial={{ opacity: 0 }} 
         animate={{ opacity: 1 }} 
         exit={{ opacity: 0 }} 
         className={styles.overlay}
      >
         <motion.div 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            exit={{ y: "100%" }} 
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={styles.containerV8}
         >
            <div className={styles.header}>
               <div className={styles.headerLeft}>
                  <h1 className={styles.title}>Motor de Campanhas V8</h1>
                  <span className={styles.subtitle}>COCKPIT AUTÔNOMO DE GROWTH</span>
               </div>
               <button className={styles.closeBtn} onClick={onClose}>✕</button>
            </div>

            <div className={styles.contentAndSides}>
               {/* LADO A: THE COCKPIT */}
               <div className={styles.sideA}>
                 <div className={styles.magicContainerV8}>
                    <div className={styles.magicHeader}><Sparkles size={16}/> NÚCLEO COGNITIVO V8</div>
                    <Input 
                       placeholder="Qual a missão tática? Ex: Dia das Mães..." 
                       value={magicInput} 
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMagicInput(e.target.value)}
                       onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter' && phase === 'ignition') handleIgnitionClick(); }}
                       disabled={phase !== 'ignition' && phase !== 'cockpit'}
                    />
                    {phase === 'ignition' && (
                       <Button onClick={handleIgnitionClick} disabled={!magicInput.trim()}>
                          INICIAR MAPEAMENTO LOGICO
                       </Button>
                    )}
                 </div>
                    
                    {phase === 'cockpit' && blueprintData?.dynamicLevers && (
                       <div className={styles.leversArea}>
                          <h3 className={styles.sectionTitle}>Controles Táticos (Calibrados via IA)</h3>
                          {blueprintData.dynamicLevers.map(lever => {
                              const val = activeLevers[lever.id] !== undefined ? activeLevers[lever.id] : lever.currentValue;
                              
                              if (lever.type === 'slider') {
                                  return (
                                     <div key={lever.id} className={styles.leverBlock}>
                                        <div className={styles.leverHeader}>
                                            <span className={styles.leverTitle}>{lever.label}</span>
                                            <span className={styles.leverValue}>{val}</span>
                                        </div>
                                        <p className={styles.leverDesc}>{lever.description}</p>
                                        <input 
                                           type="range" 
                                           className={styles.customSlider} 
                                           min={lever.min||0} 
                                           max={lever.max||100} 
                                           step={lever.step||1} 
                                           value={val as number} 
                                           onChange={e => handleLeverChange(lever.id, Number(e.target.value))} 
                                        />
                                     </div>
                                  );
                              }
                              if (lever.type === 'toggle') {
                                  return (
                                     <div key={lever.id} className={styles.leverBlockSwitch}>
                                        <div style={{flex: 1}}>
                                            <span className={styles.leverTitle}>{lever.label}</span>
                                            <p className={styles.leverDesc}>{lever.description}</p>
                                        </div>
                                        <div className={`${styles.dynamicSwitch} ${val ? styles.switchOn : ''}`} onClick={() => handleLeverChange(lever.id, !val)}>
                                            <div className={styles.switchHandle} />
                                        </div>
                                     </div>
                                  );
                              }
                              return null;
                          })}
                          
                          <div className={styles.cadernetaV1}>
                             <h4>📙 Caderneta de Decisões</h4>
                             <ul>
                                <li><strong>Missão:</strong> {magicInput}</li>
                                <li><strong>Cenário:</strong> {selectedScenario}</li>
                             </ul>
                          </div>
                       </div>
                    )}
                    {isError && <div style={{color:'red', marginTop:'1rem', fontSize:'0.8rem'}}>{(error as Error)?.message || "Erro."}</div>}
                  </div>

                  {/* LADO B: THE CAUSAL CHAIN E SCOPING */}
                  <div className={styles.sideB}>
                     <div className={styles.headerB}>
                        <h2 className={styles.titleB}>O Funil Estratégico</h2>
                        <p className={styles.subtitleB}>Mapeamento Ativo e Execução</p>
                     </div>
                     
                     {phase === 'ignition' && (
                        <div className={styles.emptyState}>
                           <Activity size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                           <p>O Motor V8 está aguardando sua instrução no painel esquerdo.</p>
                           <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Digite seu objetivo para mapearmos os cenários possíveis.</p>
                        </div>
                     )}

                     {(phase === 'scoping' || phase === 'scenarios' || phase === 'blueprinting') && (
                        <div className={styles.scopingArea}>
                           <h3 className={styles.scopingTitle}>Desconstruindo a Intenção (Scoping)</h3>
                           
                           <div className={styles.stepsList}>
                              {visibleSteps.map((step, i) => (
                                 <motion.div 
                                    key={i} 
                                    className={styles.scopingStepItem}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                 >
                                    <Sparkles size={14} className={styles.stepIcon} />
                                    <span>{step}</span>
                                 </motion.div>
                              ))}
                              {phase === 'scoping' && (
                                <div className={styles.thinkingPill}><Activity size={14} className={styles.spinIcon} /> Mapeando correlações ocultas...</div>
                              )}
                           </div>
                           
                           {phase === 'scenarios' && (
                              <motion.div className={styles.scenariosGrid} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                 <h4 className={styles.scenariosHeadline}>Com base no contexto, encontramos 3 caminhos viáveis:</h4>
                                 <p className={styles.scenariosSub}>Acione o cenário desejado para construir o Cockpit final.</p>
                                 <div className={styles.scenariosWrapper}>
                                    {scenarios.map((cen: any, i) => (
                                       <div key={i} className={styles.scenarioCard} onClick={() => handleScenarioSelect(cen)}>
                                          <div className={styles.cenHeader}>
                                             <span className={styles.cenBadge}>{cen.investmentMode}</span>
                                          </div>
                                          <h5 className={styles.cenTitle}>{cen.title}</h5>
                                          <p className={styles.cenDesc}>{cen.description}</p>
                                          <button className={styles.cenBtn}>Calibrar Painel V8</button>
                                       </div>
                                    ))}
                                 </div>
                              </motion.div>
                           )}

                           {phase === 'blueprinting' && (
                              <div className={styles.blueprintingLoading}>
                                 <Activity size={32} className={styles.spinIcon} />
                                 <p>Construindo Geometria Dribbble e Alavancas para o cenário: <strong>{selectedScenario}</strong></p>
                              </div>
                           )}
                        </div>
                     )}

                     {phase === 'cockpit' && blueprintData?.dribbbleFunnel && (
                        <div className={styles.blueprintArea}>
                           {/* Info Header */}
                           <div className={styles.blueprintDetails}>
                              <div className={styles.detailPill}><strong>Cat:</strong> {blueprintData.category}</div>
                              <div className={styles.detailPill}><strong>Valor Raiz:</strong> {blueprintData.coreValue}</div>
                              <div className={styles.detailPill}><strong>Grau de Custos:</strong> {blueprintData.budgetSpeculation}</div>
                           </div>

                           <div className={styles.dribbbleFunnelContainer}>
                           {blueprintData.dribbbleFunnel.map((step: any, idx: number) => {
                              const wA = idx === 0 ? 300 : idx === 1 ? 230 : 160;
                              const wB = idx === 0 ? 230 : idx === 1 ? 160 : 90;
                              const color = idx === 0 ? '#6AC4D1' : idx === 1 ? '#34B0E0' : '#024D7F';
                              
                              return (
                                 <div key={step.id} className={styles.dribbbleRow}>
                                     {/* LEFT: Metrics */}
                                     <div className={styles.dribbbleLeft}>
                                         <h3 className={styles.dribbblePercent}>{step.metricsPercent}</h3>
                                         <div className={styles.dribbbleProgBg}>
                                            <div className={styles.dribbbleProgFill} style={{ width: step.metricsPercent, background: color }} />
                                         </div>
                                         <span className={styles.dribbbleProgLabel}>{step.metricsLabel}</span>
                                     </div>

                                     {/* CENTER: 3D Funnel SVG Map */}
                                     <div className={styles.dribbbleCenter}>
                                        <svg width={wA} height={120} viewBox={`0 0 ${wA} 120`} className={styles.svgClean}>
                                            {/* Fake 3D Rim only on ToFu */}
                                            {idx === 0 && <ellipse cx={wA/2} cy={20} rx={wA/2} ry={15} fill="#4fa8b5" />}
                                            <path 
                                              d={`M 0 20 Q ${wA/2} 40 ${wA} 20 L ${wA - (wA-wB)/2} 120 Q ${wA/2} 140 ${(wA-wB)/2} 120 Z`} 
                                              fill={color} 
                                            />
                                            <text x="50%" y="70%" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="1.25rem" dominantBaseline="middle" style={{ letterSpacing: '2px' }}>
                                               {step.id.toUpperCase()}
                                            </text>
                                        </svg>
                                     </div>

                                     {/* RIGHT: Tactic & Pedagogical Nuance */}
                                     <div className={styles.dribbbleRight}>
                                        <div className={styles.dribbbleStageEyebrow}>
                                            <Sparkles size={12} />
                                            {step.stage}
                                        </div>
                                        <h4 className={styles.dribbbleTactic}>{step.tactic}</h4>
                                        <div className={styles.dribbbleNuance}>
                                            <span>Por que usar essa tática?</span>
                                            <p>{step.nuance}</p>
                                        </div>
                                     </div>
                                 </div>
                              )
                           })}
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