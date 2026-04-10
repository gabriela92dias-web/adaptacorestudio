import React from "react";
import {
  ArrowLeft, ArrowRight, Target, Zap, CheckCircle2, Sparkles, FileText, X,
  Blocks, Users, Globe, Receipt, Hexagon
} from "lucide-react";
import { useCampaignWizard } from "./useCampaignWizard";
import { ACTION_TYPES, FUNNELS } from "./wizard-constants";

function StepTema({ state, actions }: { state: ReturnType<typeof useCampaignWizard>["state"], actions: ReturnType<typeof useCampaignWizard>["actions"] }) {
  const { isGenerating, step, rawName, direcao, experiencia, modulos, eventoPublico, eventoDuracao } = state;
  const { setRawName, setDirecao, setExperiencia, setModulos, setEventoPublico, setEventoDuracao, nextStepTema, setStep } = actions;

  const isActive = step === 0;
  const isPast = step > 0;

  return (
    <div className={`relative pl-8 pb-10 border-l-2 ml-4 transition-all duration-500 ${isActive || isPast ? "border-[var(--primary)]" : "border-[var(--border)] opacity-30 pointer-events-none"}`}>
      <span className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-[var(--background)] border-2 border-[var(--primary)] flex items-center justify-center text-xs font-black font-mono">1</span>
      
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold tracking-wide">Sua Ideia Central</h2>
          <p className="text-sm text-[var(--muted-foreground)]">Sobre o que é essa ação e para quem estamos fazendo?</p>
        </div>

        {isActive ? (
          <div className="flex flex-col gap-6 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)]">
            <input
              autoFocus
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-lg font-bold text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all font-heading"
              value={rawName}
              onChange={(e) => setRawName(e.target.value)}
              placeholder="Ex: Mutirão de Acesso, Educação Médica..."
              disabled={isGenerating}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); nextStepTema(); } }}
            />

            <div className="flex flex-col gap-5">
              
              {/* Direcao */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Público-alvo Principal</span>
                <div className="flex bg-[var(--background)] p-1 rounded-lg border border-[var(--border)] w-fit flex-wrap gap-1">
                  {(["interna", "externa", "hibrida"] as const).map((dir) => (
                    <button
                      key={dir}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${direcao === dir ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm" : "hover:bg-[var(--surface)] text-[var(--muted-foreground)]"}`}
                      onClick={() => setDirecao(dir)}
                    >
                      {dir === "interna" ? "Staff / Associação" : dir === "externa" ? "Público Externo" : "Ambos (Híbrida)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experiencia */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Qual será o formato?</span>
                <div className="flex bg-[var(--background)] p-1 rounded-lg border border-[var(--border)] w-fit flex-wrap gap-1">
                  {(["presencial", "digital", "hibrida"] as const).map((exp) => (
                    <button
                      key={exp}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${experiencia === exp ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm" : "hover:bg-[var(--surface)] text-[var(--muted-foreground)]"}`}
                      onClick={() => setExperiencia(exp)}
                    >
                      {exp === "presencial" ? "Presencial" : exp === "digital" ? "100% Digital" : "Misto (Fís./Dig.)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parametros Logísticos */}
              {(experiencia === "presencial" || experiencia === "hibrida") && (
                <div className="flex flex-col gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]/30 mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)] border-b border-[var(--border)] pb-2 flex items-center gap-2"><Target size={12} /> Detalhes Essenciais de Logística</span>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Quantas pessoas esperamos?</span>
                       <input 
                         type="number"
                         min={0}
                         className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-sm font-bold font-mono text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all placeholder:font-sans placeholder:font-normal"
                         value={eventoPublico || ''}
                         onChange={(e) => setEventoPublico(parseInt(e.target.value) || 0)}
                         placeholder="Ex: 50"
                         disabled={isGenerating}
                         onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); nextStepTema(); } }}
                       />
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-2">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Qual a duração média? (Hrs)</span>
                       <input 
                         type="number"
                         min={0}
                         className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-sm font-bold font-mono text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all placeholder:font-sans placeholder:font-normal"
                         value={eventoDuracao || ''}
                         onChange={(e) => setEventoDuracao(parseInt(e.target.value) || 0)}
                         placeholder="Ex: 4"
                         disabled={isGenerating}
                         onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); nextStepTema(); } }}
                       />
                    </div>
                  </div>
                </div>
              )}

              {/* Modulos */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Que áreas vamos envolver?</span>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(modulos).map((mod) => (
                    <button
                      key={mod}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all ${modulos[mod as keyof typeof modulos] ? "bg-transparent border-[var(--primary)] text-[var(--primary)]" : "bg-transparent border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--border-hover)]"}`}
                      onClick={() => setModulos((prev) => ({ ...prev, [mod]: !prev[mod as keyof typeof modulos] }))}
                    >
                      {mod === "governanca" ? "Governança" : mod === "fisico" ? "Físico" : mod}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <button 
              className="mt-2 w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-bold uppercase tracking-wider text-sm hover:opacity-90 disabled:opacity-50 transition-all font-heading" 
              onClick={nextStepTema} 
              disabled={isGenerating || !rawName.trim()}
            >
              {isGenerating ? (
                <><Sparkles size={16} className="animate-spin opacity-70" /> Salvando...</>
              ) : (
                <>Continuar Planejamento <ArrowRight size={16} /></>
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:border-[var(--border-hover)] transition-all group">
            <div>
              <h3 className="text-xl font-bold font-heading mb-2">{rawName}</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-transparent border border-[var(--primary)] text-[var(--primary)]">Alvo: {direcao}</span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-transparent border border-[var(--primary)] text-[var(--primary)]">Formato: {experiencia}</span>
                {(experiencia === "presencial" || experiencia === "hibrida") && (
                  <>
                    {eventoPublico > 0 && <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]">Pax: {eventoPublico}</span>}
                    {eventoDuracao > 0 && <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]">Dur.: {eventoDuracao}h</span>}
                  </>
                )}
                {Object.keys(modulos).filter((k) => modulos[k as keyof typeof modulos]).map((k) => (
                  <span key={k} className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]">
                    {k === "governanca" ? "Gov" : k === "fisico" ? "Física" : k}
                  </span>
                ))}
              </div>
            </div>
            <button className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] hover:text-[var(--foreground)] opacity-0 group-hover:opacity-100 transition-opacity underline decoration-1 underline-offset-4" onClick={() => setStep(0)}>Alterar Escopo</button>
          </div>
        )}
      </div>
    </div>
  );
}

function StepProposicao({ state, actions }: { state: ReturnType<typeof useCampaignWizard>["state"], actions: ReturnType<typeof useCampaignWizard>["actions"] }) {
  const { isGenerating, step, proposicao, suggestedPropositions } = state;
  const { setProposicao, nextStepProposicao, setStep } = actions;

  const isActive = step === 1;
  const isPast = step > 1;

  return (
    <div className={`relative pl-8 pb-10 border-l-2 ml-4 transition-all duration-500 ${isActive || isPast ? "border-[var(--primary)]" : "border-[var(--border)] opacity-30 pointer-events-none"}`}>
      <span className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black font-mono transition-colors ${isActive || isPast ? "bg-[var(--background)] border-2 border-[var(--primary)]" : "bg-[var(--surface)] border-2 border-[var(--border)] text-[var(--muted-foreground)]"}`}>2</span>
      
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold tracking-wide mt-1">Qual o Gancho Principal?</h2>
          <p className="text-sm text-[var(--muted-foreground)]">Selecione uma ideia da nossa base ou escreva a sua própria visão criativa.</p>
        </div>

        {isActive ? (
          <div className="flex flex-col gap-6 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)]">
            
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Ideias Sugeridas pela Adapta</span>
              {suggestedPropositions.map((sug, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 flex gap-4 group"
                  onClick={() => nextStepProposicao(sug)}
                  disabled={isGenerating}
                >
                  <span className="text-[var(--muted-foreground)] font-mono font-bold text-sm mt-0.5">0{idx + 1}</span>
                  <span className="flex-1 text-sm font-medium leading-relaxed">{sug}</span>
                  <ArrowRight size={16} className="text-[var(--primary)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all mt-0.5" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-[var(--border)] flex-1" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">ou se preferir, descreva com suas palavras</span>
              <div className="h-px bg-[var(--border)] flex-1" />
            </div>

            <textarea
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all min-h-[100px] resize-y"
              value={proposicao}
              onChange={(e) => setProposicao(e.target.value)}
              placeholder="Qual dor queremos resolver? Qual narrativa/mensagem queremos passar?"
              disabled={isGenerating}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); nextStepProposicao(); } }}
            />

            <div className="flex gap-3">
              {proposicao.trim() ? (
                <button className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-bold uppercase tracking-wider text-sm hover:opacity-90 disabled:opacity-50 transition-all font-heading" onClick={() => nextStepProposicao()} disabled={isGenerating}>
                  {isGenerating ? <><Sparkles size={16} className="animate-spin opacity-70" /> Carregando...</> : "Usar Esta Ideia"}
                </button>
              ) : (
                <button className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-transparent border border-[var(--border)] text-[var(--foreground)] font-bold uppercase tracking-wider text-sm hover:bg-[var(--surface)] hover:border-[var(--border-hover)] disabled:opacity-50 transition-all" onClick={() => nextStepProposicao("")} disabled={isGenerating}>
                  {isGenerating ? <><Sparkles size={16} className="animate-spin opacity-70" /> Carregando...</> : "Deixar a Inteligência Inventar"}
                </button>
              )}
            </div>

          </div>
        ) : isPast ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:border-[var(--border-hover)] transition-all group">
            <span className="text-sm italic font-medium leading-relaxed max-w-2xl text-[var(--foreground)]">
              "{proposicao.trim() ? proposicao : "Abstração Sistêmica I.A."}"
            </span>
            <button className="whitespace-nowrap text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] hover:text-[var(--foreground)] opacity-0 group-hover:opacity-100 transition-opacity underline decoration-1 underline-offset-4" onClick={() => setStep(1)}>Refinar Escopo</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StepOrcamento({ state, actions }: { state: ReturnType<typeof useCampaignWizard>["state"], actions: ReturnType<typeof useCampaignWizard>["actions"] }) {
  const { isGenerating, step, orcamento } = state;
  const { setOrcamento, nextStepOrcamento, setStep } = actions;

  const isActive = step === 2;
  const isPast = step > 2;

  return (
    <div className={`relative pl-8 pb-10 border-l-2 ml-4 transition-all duration-500 ${isActive || isPast ? "border-[var(--primary)]" : "border-[var(--border)] opacity-30 pointer-events-none"}`}>
      <span className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black font-mono transition-colors ${isActive || isPast ? "bg-[var(--background)] border-2 border-[var(--primary)]" : "bg-[var(--surface)] border-2 border-[var(--border)] text-[var(--muted-foreground)]"}`}>3</span>
      
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold tracking-wide mt-1">Fazendo as Contas</h2>
          <p className="text-sm text-[var(--muted-foreground)]">Quanto a associação pretende investir nessa empreitada?</p>
        </div>

        {isActive ? (
          <div className="flex flex-col gap-6 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)]">
            <div className="relative">
              <span className="absolute left-4 top-[14px] text-[var(--muted-foreground)] font-bold">R$</span>
              <input
                autoFocus
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-12 pr-4 py-3 text-lg font-bold text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all font-mono"
                value={orcamento}
                onChange={(e) => setOrcamento(e.target.value)}
                placeholder="5.000,00"
                disabled={isGenerating}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); nextStepOrcamento(); } }}
              />
            </div>
            <div className="flex gap-3">
              <button className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-bold uppercase tracking-wider text-sm hover:opacity-90 disabled:opacity-50 transition-all font-heading" onClick={nextStepOrcamento} disabled={isGenerating}>
                {isGenerating ? <><Sparkles size={16} className="animate-spin opacity-70" /> Fatiando verba...</> : <>Distribuir Verba Simbólica <ArrowRight size={16} /></>}
              </button>
              {!orcamento && (
                <button className="w-auto px-6 h-12 flex items-center justify-center gap-2 rounded-xl bg-transparent border border-[var(--border)] text-[var(--foreground)] font-bold uppercase tracking-wider text-sm hover:bg-[var(--surface)] hover:border-[var(--border-hover)] disabled:opacity-50 transition-all" onClick={nextStepOrcamento} disabled={isGenerating}>
                  Não tenho orçamento definido
                </button>
              )}
            </div>
          </div>
        ) : isPast ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:border-[var(--border-hover)] transition-all group">
            <span className="text-2xl font-black font-mono tracking-tight text-[var(--foreground)]">{orcamento ? `R$ ${orcamento}` : "Sem orçamento estipulado"}</span>
            <button className="whitespace-nowrap text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] hover:text-[var(--foreground)] opacity-0 group-hover:opacity-100 transition-opacity underline decoration-1 underline-offset-4" onClick={() => setStep(2)}>Ajustar Valores</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function CriarCampanha({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { state, actions } = useCampaignWizard(onClose);
  const {
    isGenerating, isSaved, isGeneratingPlan, step,
    aiGeneratedType, activeFunnels, aiTrilhaInterna, aiTrilhaExterna, aiOrcamentoLinhas, aiOrcamentoTotal, blueprintTheory
  } = state;
  const { finishCreation, generateActionPlan, generateBlueprintDense, setAiOrcamentoLinhas } = actions;

  if (!isOpen) return null;

  const typeData = ACTION_TYPES.find((t) => t.id === aiGeneratedType) || ACTION_TYPES[0];
  const TypeIcon = typeData.icon;

  return (
    <div className="fixed inset-0 z-[var(--z-overlay)] flex bg-[var(--background)] font-sans">
      
      {/* ── ALINHAMENTO ESQUERDA: EDITOR E PASSOS ── */}
      <aside className="w-full md:w-[600px] h-full flex flex-col border-r border-[var(--border)] bg-[var(--surface)] overflow-y-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border)]">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center gap-2">
              <button className="p-1 rounded-sm hover:bg-[var(--border)] hover:text-[var(--foreground)] transition-colors" onClick={onClose}><ArrowLeft size={14} /></button>
              Voltar ao Hub
            </span>
            <h1 className="text-2xl font-black font-heading mt-1 tracking-tight">Monte sua Campanha</h1>
          </div>

          <div className="flex items-center gap-3">
             <button className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--card)] hover:border-[var(--border-hover)] text-[var(--muted-foreground)] transition-all" onClick={onClose}><X size={18} /></button>
          </div>
        </header>

        <div className="flex-1 px-8 py-10">
          <StepTema state={state} actions={actions} />
          <StepProposicao state={state} actions={actions} />
          <StepOrcamento state={state} actions={actions} />

          {/* ── STEP 3: GERAR BLUEPRINT FINAL ── */}
          {step >= 3 && (
            <div className={`relative pl-8 pt-2 ml-4 transition-all duration-700 ${step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
               {step === 3 && (
                 <button className="w-full h-14 flex items-center justify-center gap-3 rounded-2xl bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-wider text-sm shadow-xl hover:scale-[1.02] hover:shadow-[var(--shadow-focus)] disabled:opacity-50 transition-all font-heading" onClick={generateBlueprintDense} disabled={isGenerating}>
                    {isGenerating ? (
                      <><Sparkles size={18} className="animate-spin opacity-70" /> Escrevendo Diretivas...</>
                    ) : (
                      <>Gerar Meu Plano Completo <Zap size={18} /></>
                    )}
                 </button>
               )}
            </div>
          )}
        </div>
      </aside>

      {/* ── ALINHAMENTO DIREITA: CANVAS DE RESULTADO I.A. ── */}
      <main className="hidden md:flex flex-1 flex-col h-full bg-[var(--background)] overflow-y-auto relative">
        <header className="sticky top-0 z-10 w-full px-12 py-6 bg-gradient-to-b from-[var(--background)] to-transparent flex justify-between items-center pointer-events-none">
           <div />
           <div className="flex items-center gap-3 pointer-events-auto">
             {step >= 4 && !isSaved && (
                <button className="h-10 px-5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[var(--card)] transition-all shadow-sm" onClick={finishCreation}>
                  Aceitar Este Plano <CheckCircle2 size={14} />
                </button>
              )}
              {step >= 4 && isSaved && (
                <button className="h-10 px-5 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-all shadow-md" onClick={generateActionPlan} disabled={isGeneratingPlan}>
                  {isGeneratingPlan ? "Criando Tarefas..." : "Enviar Tarefas pro CoreAct"} <Zap size={14} className={isGeneratingPlan ? "animate-pulse" : ""} />
                </button>
              )}
           </div>
        </header>

        <div className="flex-1 w-full max-w-4xl mx-auto px-12 pt-4 pb-20 flex flex-col gap-8">
           
           {step === 0 && (
             <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="flex flex-col items-center text-[var(--muted-foreground)] opacity-[0.15] mb-12 scale-110">
                  <div className="w-32 h-12 border-2 border-current bg-transparent text-center text-xs flex items-center justify-center font-bold tracking-widest uppercase">Gatilho</div>
                  <div className="w-px h-6 bg-current"></div>
                  <div className="relative flex items-center justify-center">
                    <Hexagon size={64} strokeWidth={1} className="transform -rotate-90" />
                    <span className="absolute text-[10px] font-bold">V8</span>
                  </div>
                  <div className="flex w-64 justify-between -mt-[1px]">
                      <div className="w-1/2 h-8 border-t-2 border-l-2 border-current rounded-tl-xl object-none"></div>
                      <div className="w-1/2 h-8 border-t-2 border-r-2 border-current rounded-tr-xl"></div>
                  </div>
                  <div className="flex w-96 justify-between gap-12">
                      <div className="w-32 h-16 border-2 border-current flex items-center justify-center rounded-lg"><span className="text-[10px] font-bold uppercase tracking-widest">Trilha A</span></div>
                      <div className="w-32 h-16 border-2 border-dashed border-current flex items-center justify-center rounded-lg"><span className="text-[10px] font-bold uppercase tracking-widest">Trilha B</span></div>
                  </div>
                </div>
                <h3 className="text-3xl font-black tracking-tight text-[var(--foreground)] opacity-50 mix-blend-luminosity">O Seu Plano Vai Aparecer Aqui</h3>
                <p className="text-[var(--muted-foreground)] max-w-md mt-4 font-medium text-lg leading-relaxed opacity-50 mix-blend-luminosity">Siga os passos à esquerda para visualizar como a plataforma vai distribuir as tarefas, orçamentos e a estrutura do seu projeto.</p>
             </div>
           )}

           {/* ── Arquitetura de Funil (Logo no step 1+) ── */}
           {step >= 1 && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-2">
                 <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--foreground)]">Funil Sugerido</h4>
                 <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] flex items-center gap-2 shadow-sm">
                   <TypeIcon size={12} /> {typeData.name}
                 </span>
               </div>
               
               <div className="flex flex-col w-full max-w-2xl mx-auto items-center mt-6 gap-0.5">
                  {FUNNELS.map((level, i) => {
                    const isActive = activeFunnels[level.id];
                    const isFirst = i === 0;
                    const isLast = i === FUNNELS.length - 1;
                    return (
                      <div
                        key={level.id}
                        className={`py-3 px-6 flex items-center justify-center gap-3 transition-all duration-500 ${isActive ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm" : "bg-[var(--surface)] text-[var(--muted-foreground)] border border-[var(--border)]"}`}
                        style={{
                          width: level.pct,
                          borderRadius: isFirst ? "1rem 1rem 0.25rem 0.25rem" : isLast ? "0.25rem 0.25rem 1rem 1rem" : "0.25rem",
                        }}
                      >
                         <span className="font-heading font-bold uppercase tracking-wide text-sm">{level.name}</span>
                         {isActive && <span className="opacity-70 text-xs italic font-serif">/ {level.desc}</span>}
                      </div>
                    )
                  })}
               </div>
             </div>
           )}

           {/* ── Trilhas Paralelas (Step 2+) ── */}
           {step >= 2 && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--foreground)] border-b border-[var(--border)] pb-2 flex items-center gap-2"><Users size={14} /> O que a nossa Associação Precisa Fazer</h4>
                  <div className="flex flex-col gap-2 pt-2">
                    {aiTrilhaInterna.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-sm text-sm font-medium text-[var(--foreground)] flex items-start gap-3">
                         <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase mt-0.5 shrink-0">0{idx+1}</span>
                         <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--foreground)] border-b border-[var(--border)] pb-2 flex items-center gap-2"><Globe size={14} /> Como essa ação vai chegar no Público</h4>
                  <div className="flex flex-col gap-2 pt-2">
                    {aiTrilhaExterna.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-sm text-sm font-medium text-[var(--foreground)] flex items-start gap-3">
                         <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase mt-0.5 shrink-0">0{idx+1}</span>
                         <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
           )}

           {/* ── Notinha de Orçamento Editável (Step 3+) ── */}
           {step >= 3 && (
              <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                 <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--foreground)] flex items-center gap-2"><Receipt size={14} /> Distribuição Sugerida de Verba</h4>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-md">Editável! Fique à vontade para ajustar.</span>
                 </div>
                 
                 <div className="mt-4 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col gap-4">
                    {aiOrcamentoLinhas.map((linha, idx) => (
                       <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors group">
                          <div className="flex flex-col flex-1">
                             <span className="text-sm font-bold text-[var(--foreground)]">{linha.categoria}</span>
                             <span className="text-xs text-[var(--muted-foreground)] line-clamp-1">{linha.motivo}</span>
                          </div>
                          <div className="relative w-full sm:w-36 shrink-0">
                             <span className="absolute left-3 top-[10px] text-xs font-bold text-[var(--muted-foreground)]">R$</span>
                             <input 
                               type="number"
                               className="w-full bg-transparent border border-[var(--border)] rounded-lg pl-8 pr-3 py-2 text-sm font-bold font-mono text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all text-right group-hover:border-[var(--border-hover)]"
                               value={linha.valor_estimado === 0 ? '' : linha.valor_estimado}
                               onChange={(e) => {
                                 const val = parseFloat(e.target.value) || 0;
                                 const nextLinhas = [...aiOrcamentoLinhas];
                                 nextLinhas[idx].valor_estimado = val;
                                 setAiOrcamentoLinhas(nextLinhas);
                               }}
                             />
                          </div>
                       </div>
                    ))}
                    
                    <div className="mt-2 pt-4 border-t border-dashed border-[var(--border)] flex items-center justify-between px-2">
                       <span className="text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Total Ajustado:</span>
                       <span className="text-2xl font-black font-mono text-[var(--foreground)] tracking-tight">R$ {aiOrcamentoLinhas.reduce((acc, curr) => acc + curr.valor_estimado, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                 </div>
              </div>
           )}

           {/* ── Blueprint Text (Step 4+) ── */}
           {step >= 4 && (
              <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                 <div className="p-8 rounded-[2rem] bg-[var(--foreground)] text-[var(--background)] shadow-2xl relative overflow-hidden">
                    
                    {/* Badge Dossiê Oficial */}
                    <div className="absolute top-0 right-0 bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-2 rounded-bl-3xl font-bold text-xs uppercase tracking-widest shadow-md">
                       Blueprint Verificado
                    </div>

                    <div className="flex items-center gap-4 mb-8 border-b border-[var(--background)]/20 pb-6 pr-32">
                       <div className="w-14 h-14 rounded-full bg-[var(--background)]/10 flex items-center justify-center font-mono">
                         <Blocks size={24} className="text-[var(--background)]" />
                       </div>
                       <div>
                         <h3 className="text-3xl font-black tracking-tight mt-1">Resumo do Plano (Visão Executiva)</h3>
                         <span className="text-sm opacity-60 font-medium tracking-wider uppercase">Para colocar todo mundo na mesma página</span>
                       </div>
                    </div>
                    <div className="prose prose-invert max-w-none font-medium whitespace-pre-wrap leading-relaxed text-[var(--background)]/90 text-justify hyphens-auto font-serif">
                       {blueprintTheory}
                    </div>
                 </div>
              </div>
           )}
        </div>
      </main>

    </div>
  );
}
