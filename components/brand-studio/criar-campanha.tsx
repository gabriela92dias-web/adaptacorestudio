import React from "react";
import {
  ArrowLeft, ArrowRight, Target, Zap, CheckCircle2, Sparkles, FileText, X,
  Blocks, Users, Globe, Receipt, Hexagon
} from "lucide-react";
import { useCampaignWizard } from "./useCampaignWizard";
import { ACTION_TYPES } from "./wizard-constants";

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

function WireframeBlock({ label, title, subtitle, children, className = "" }: { label: string, title?: string, subtitle?: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={`relative border-2 border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 ${className}`}>
      <div className="absolute -top-[11px] left-4 md:left-6 bg-[var(--surface)] px-3 border-l-2 border-r-2 border-[var(--border)] text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)] shrink-0 max-w-[calc(100%-2rem)] overflow-hidden text-ellipsis whitespace-nowrap">
        {label}
      </div>
      {(title || subtitle) && (
        <div className="mb-6 pb-4 border-b border-[var(--border)]">
          {title && <h2 className="text-xl md:text-2xl font-black font-heading uppercase tracking-wider text-[var(--foreground)]">{title}</h2>}
          {subtitle && <p className="text-sm font-sans font-medium text-[var(--muted-foreground)] mt-2">{subtitle}</p>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

export function CriarCampanha({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { state, actions } = useCampaignWizard(onClose);
  const {
    isGenerating, isSaved, isGeneratingPlan, step,
    aiGeneratedType, activeFunnels, aiTrilhaInterna, aiTrilhaExterna, aiOrcamentoLinhas, aiOrcamentoTotal, blueprintTheory,
    modulos, experiencia, eventoDuracao
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

        <div className="flex-1 w-full max-w-5xl mx-auto px-8 md:px-12 pt-4 pb-24 flex flex-col gap-10">
           
           <div className={`transition-all duration-700 ${step >= 0 ? "opacity-100 mt-8" : "hidden"}`}>
             <WireframeBlock label="BLOCO 1: HUB OMNICANAL (RADIAL)" title="DNA DA CAMPANHA (ESCORE + ESCOPO)" subtitle="Centro = decisão mínima que ativa todo o resto. Nodes = pilares que a campanha obrigatoriamente define.">
               {step === 0 ? (
                 <div className="flex flex-col items-center justify-center py-16 opacity-40 mix-blend-luminosity">
                    <div className="w-24 h-24 border-2 border-[var(--primary)] border-dashed rounded-full flex items-center justify-center relative bg-[var(--background)]">
                        <span className="text-[10px] tracking-widest uppercase text-[var(--primary)] font-bold">NODE</span>
                        <div className="absolute w-16 h-0 border-t-2 border-[var(--primary)] border-dashed" style={{ top: '50%', left: '-66px' }}></div>
                        <div className="absolute w-16 h-0 border-t-2 border-[var(--primary)] border-dashed" style={{ top: '50%', right: '-66px' }}></div>
                        <div className="absolute h-16 w-0 border-l-2 border-[var(--primary)] border-dashed" style={{ left: '50%', top: '-66px' }}></div>
                        <div className="absolute h-16 w-0 border-l-2 border-[var(--primary)] border-dashed" style={{ left: '50%', bottom: '-66px' }}></div>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight text-[var(--foreground)] mt-12">O Seu Plano Vai Aparecer Aqui</h3>
                    <p className="text-[var(--muted-foreground)] max-w-md mt-2 font-medium text-sm leading-relaxed text-center">Siga os passos à esquerda para visualizar como a plataforma vai distribuir as tarefas, orçamentos e a estrutura do seu projeto.</p>
                 </div>
               ) : (
                 <div className="flex flex-col md:flex-row gap-8 py-4">
                   <div className="flex-[2] text-[var(--foreground)] text-sm">
                     <ul className="list-disc pl-5 space-y-2">
                       <li><b className="uppercase">Direção:</b> {direcao === "interna" ? "Interna" : direcao === "externa" ? "Externa" : "Híbrida"}</li>
                       <li><b className="uppercase">Experiência:</b> {experiencia === "digital" ? "Digital" : experiencia === "presencial" ? "Presencial" : "Híbrida"}</li>
                       <li><b className="uppercase">Públicos / Pax:</b> {eventoPublico > 0 ? eventoPublico + " pessoas" : "Indefinido"}</li>
                       <li><b className="uppercase">Duração / Janela:</b> {eventoDuracao > 0 ? eventoDuracao + " horas" : "Indefinido"}</li>
                       <li><b className="uppercase">Módulos Ativos:</b> {Object.keys(modulos).filter(k => modulos[k as keyof typeof modulos]).map(k => k.toUpperCase()).join(', ') || "Padrão"}</li>
                     </ul>
                     <div className="mt-6 text-[var(--muted-foreground)] border-l-2 border-[var(--primary)] pl-4 italic text-xs font-medium bg-[var(--surface)] p-3">
                        Regra: se for híbrida, a camada interna existe sempre (kit + alinhamento + risco).
                     </div>
                   </div>
                   <div className="flex-1 flex flex-col items-center justify-center h-48 border border-[var(--border)] bg-[var(--background)] shadow-inner">
                     <div className="w-16 h-16 border-2 border-dashed border-[var(--primary)] rounded-full flex items-center justify-center relative bg-[var(--surface)] text-[var(--foreground)] font-bold text-[9px] tracking-widest uppercase shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]">
                         Node
                         <div className="absolute w-12 h-0 border-t-2 border-[var(--primary)] border-dashed opacity-70" style={{ top: '50%', left: '-50px' }}></div>
                         <div className="absolute w-12 h-0 border-t-2 border-[var(--primary)] border-dashed opacity-70" style={{ top: '50%', right: '-50px' }}></div>
                         <div className="absolute h-12 w-0 border-l-2 border-[var(--primary)] border-dashed opacity-70" style={{ left: '50%', top: '-50px' }}></div>
                         <div className="absolute h-12 w-0 border-l-2 border-[var(--primary)] border-dashed opacity-70" style={{ left: '50%', bottom: '-50px' }}></div>
                     </div>
                   </div>
                 </div>
               )}
             </WireframeBlock>
           </div>

           {/* ── Arquitetura de Funil (Vignette Moderno) ── */}
           {step >= 1 && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 w-full mt-8">
               <WireframeBlock label="BLOCO 2: ESTRUTURA PROGRESSIVA (FUNIL)" title="GATES DE EXECUÇÃO (DO PLANEJAMENTO AO “NO AR”)" subtitle="Cada layer é um “portão”: se não fechar, a campanha não pode avançar.">
                 <div className="flex w-full relative items-start h-[360px] pt-4">

                   {/* FUNÇÕES DE RENDERIZAÇÃO INTERNA */}
                   {(() => {
                      const layers = [];
                      
                      // Layer 1
                      if (modulos.governanca || true) {
                        layers.push({
                           title: "Planejamento Base",
                           subtitle: "Etapa 1",
                           items: ["Controle de Verba", "Contratos & Jurídico", "Aprovação Final da Ideia"],
                           clip: "polygon(0% 0%, 100% 12%, 100% 88%, 0% 100%)",
                           opacity: "opacity-100" // Opacidade Plena
                        });
                      }

                      // Layer 2
                      if (experiencia === "presencial" || experiencia === "hibrida" || modulos.fisico || modulos.evento) {
                        const l2Items = [];
                        if (modulos.evento) l2Items.push("Credenciamento e Acesso", "Estrutura de Palco");
                        else l2Items.push("Materiais e Brindes");
                        l2Items.push("Equipe de Recepção");
                        if (eventoDuracao >= 3) l2Items.push("Alimentação e Bebidas");

                        layers.push({
                           title: "Operação Presencial",
                           subtitle: "Etapa 2",
                           items: l2Items,
                           clip: "polygon(0% 12%, 100% 24%, 100% 76%, 0% 88%)",
                           opacity: "opacity-80" // 80%
                        });
                      }

                      // Layer 3
                      if (experiencia === "digital" || experiencia === "hibrida" || modulos.digital) {
                        layers.push({
                           title: "Atração e Inscrição",
                           subtitle: "Etapa 3",
                           items: ["Página Web do Projeto", "Anúncios de Captação", "Automação de E-mails"],
                           clip: "polygon(0% 24%, 100% 36%, 100% 64%, 0% 76%)",
                           opacity: "opacity-60" // 60%
                        });
                      }

                      // Layer 4
                      layers.push({
                           title: "Pós-Campanha",
                           subtitle: "Etapa 4",
                           items: ["Pesquisa de Satisfação", "Engajamento Contínuo"],
                           clip: "polygon(0% 36%, 100% 48%, 100% 52%, 0% 64%)",
                           opacity: "opacity-40" // 40%
                      });

                      return layers.map((layer, idx) => (
                        <div key={idx} className="flex-1 flex flex-col group">
                           {/* Header: Title */}
                           <div className="h-20 flex flex-col items-center justify-end pb-6 px-2 text-center transition-transform duration-500 group-hover:-translate-y-2">
                               <span className="text-[10px] font-black tracking-widest uppercase text-[var(--muted-foreground)] mb-1">{layer.subtitle}</span>
                               <span className="text-sm font-bold text-[var(--foreground)] leading-tight">{layer.title}</span>
                           </div>
                           
                           {/* Funnel Middle Segment */}
                           <div className="w-full h-40 relative flex items-center justify-center px-[0.5px]">
                              {/* Shadow/Hover Glow Underneath */}
                              <div 
                                className={`absolute inset-0 bg-[var(--primary)] blur-xl transition-all duration-300 opacity-0 group-hover:opacity-30`}
                                style={{ clipPath: layer.clip }}
                              />
                              {/* Solid Funnel Shape */}
                              <div 
                                className={`absolute inset-0 bg-[var(--primary)] ${layer.opacity} transition-all duration-500 border-x border-[var(--background)]`}
                                style={{ clipPath: layer.clip }}
                              />
                              {/* Inner Circle / Label */}
                              <div className="relative z-10 w-8 h-8 rounded-full bg-[var(--background)] flex items-center justify-center shadow-lg font-black font-heading text-xs text-[var(--primary)] border border-[var(--primary)]/20 transition-transform duration-500 group-hover:scale-125">
                                 {idx + 1}
                              </div>
                           </div>
                           
                           {/* Footer: Items List */}
                           <div className="flex flex-col gap-2 mt-8 px-4 items-center">
                              {layer.items.map((item, j) => (
                                 <span key={j} className="text-[9px] uppercase tracking-wider bg-[var(--background)] border border-[var(--border)] px-2 py-1 rounded text-[var(--foreground)] font-bold shadow-sm text-center transition-all duration-300 hover:border-[var(--primary)] hover:text-[var(--primary)] cursor-crosshair">
                                   {item}
                                 </span>
                              ))}
                           </div>
                        </div>
                      ));
                   })()}

                   {/* Dribbble Style Target Pin on the right end */}
                   <div className="w-12 h-68 pt-20 flex flex-col items-center -ml-4 z-10 relative">
                       <div className="w-10 h-10 mt-10 rounded-full bg-[var(--foreground)] text-[var(--background)] shadow-2xl flex items-center justify-center font-black animate-pulse">
                           <Target size={16} />
                       </div>
                   </div>

                 </div>
               </WireframeBlock>
             </div>
           )}

           {/* ── Trilhas Paralelas (Step 2+) ── */}
           {step >= 2 && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 w-full mt-4">
               <WireframeBlock label="BLOCO 3: PAINEL DIVIDIDO (SPLIT L/R)" title="TRILHAS PARALELAS (INTERNA x EXTERNA)" subtitle="Divide o que o time precisa receber/treinar vs. o que o público recebe/experimenta.">
                 <div className="flex flex-col md:flex-row border-2 border-[var(--border)] bg-[var(--background)] gap-[2px]">
                     {/* Lado Interno */}
                     <div className="flex-1 bg-[var(--surface)] p-6">
                         <div className="border-b-2 border-[var(--border)] pb-2 mb-4 text-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--foreground)]">MÓDULO A — CAMADA INTERNA</div>
                         <ul className="flex flex-col gap-3">
                           {aiTrilhaInterna.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-xs md:text-sm font-medium text-[var(--muted-foreground)] p-3 border border-[var(--border)] bg-[var(--background)] hover:border-[var(--foreground)] transition-colors">
                                  <span className="text-[10px] font-bold text-[var(--foreground)] bg-[var(--border)] px-1.5 py-0.5 rounded uppercase shrink-0">0{idx+1}</span>
                                  <span className="leading-relaxed">{item}</span>
                              </li>
                           ))}
                         </ul>
                     </div>
                     {/* Linha Divisoria */}
                     <div className="w-[2px] bg-[var(--border)] hidden md:block"></div>
                     {/* Lado Externo */}
                     <div className="flex-1 bg-[var(--surface)] p-6">
                         <div className="border-b-2 border-[var(--border)] pb-2 mb-4 text-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--foreground)]">MÓDULO B — CAMADA EXTERNA</div>
                         <ul className="flex flex-col gap-3">
                           {aiTrilhaExterna.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-xs md:text-sm font-medium text-[var(--muted-foreground)] p-3 border border-[var(--border)] bg-[var(--background)] hover:border-[var(--foreground)] transition-colors">
                                  <span className="text-[10px] font-bold text-[var(--foreground)] bg-[var(--border)] px-1.5 py-0.5 rounded uppercase shrink-0">0{idx+1}</span>
                                  <span className="leading-relaxed">{item}</span>
                              </li>
                           ))}
                         </ul>
                     </div>
                 </div>
               </WireframeBlock>
             </div>
           )}

           {/* ── Componentes Flutuantes (Step 2+) ── */}
           {step >= 2 && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 w-full mt-4">
               <WireframeBlock label="BLOCO 4: COMPONENTES FLUTUANTES / LÚDICO" title="BIBLIOTECA DE MÓDULOS (TOGGLES) — V2" subtitle="Cada módulo ON abre subdecisões + tarefas + linha de orçamento + prova de pronto.">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                   
                   {/* EVENTO */}
                   <div className={`p-4 border ${experiencia === "presencial" || experiencia === "hibrida" || modulos.evento ? "border-[var(--primary)] bg-[var(--surface)] shadow-sm" : "border-[var(--border)] bg-[var(--background)] opacity-50"} transition-all`}>
                      <div className="font-bold text-xs uppercase mb-3 tracking-widest text-[var(--foreground)] flex justify-between items-center">
                         <span>Evento · Acesso & Prog.</span>
                         {(experiencia === "presencial" || experiencia === "hibrida" || modulos.evento) && <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />}
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-[11px] text-[var(--muted-foreground)]">
                         <li><b className="text-[var(--foreground)]">Modelo:</b> {experiencia}</li>
                         <li>Inscrição, check-in, validação</li>
                         <li>Programação, blocos, convidados</li>
                      </ul>
                   </div>

                   {/* FÍSICO */}
                   <div className={`p-4 border ${(modulos.fisico || experiencia === "presencial" || experiencia === "hibrida") ? "border-[var(--primary)] bg-[var(--surface)] shadow-sm" : "border-[var(--border)] bg-[var(--background)] opacity-50"} transition-all`}>
                      <div className="font-bold text-xs uppercase mb-3 tracking-widest text-[var(--foreground)] flex justify-between items-center">
                         <span>Físico · Infra & Materiais</span>
                         {(modulos.fisico || experiencia === "presencial" || experiencia === "hibrida") && <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />}
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-[11px] text-[var(--muted-foreground)]">
                         <li>Impressos (tiragem por tier)</li>
                         <li>Kits/Brindes, Uniformes/Credenciais</li>
                         <li>Locação, Segurança, Coffee/Alimentação</li>
                      </ul>
                   </div>

                   {/* DIGITAL */}
                   <div className={`p-4 border ${(modulos.digital || experiencia === "digital" || experiencia === "hibrida") ? "border-[var(--primary)] bg-[var(--surface)] shadow-sm" : "border-[var(--border)] bg-[var(--background)] opacity-50"} transition-all`}>
                      <div className="font-bold text-xs uppercase mb-3 tracking-widest text-[var(--foreground)] flex justify-between items-center">
                         <span>Digital · Frentes & Entregáveis</span>
                         {(modulos.digital || experiencia === "digital" || experiencia === "hibrida") && <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />}
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-[11px] text-[var(--muted-foreground)]">
                         <li>Landing Page (campos, destino, LGPD)</li>
                         <li>E-mail/PR/WhatsApp (SLA, scripts)</li>
                         <li>Tráfego/Ads (objetivo, criativos, verba)</li>
                      </ul>
                   </div>

                   {/* GOVERNANÇA */}
                   <div className={`p-4 border ${modulos.governanca || true ? "border-[var(--primary)] bg-[var(--surface)] shadow-sm" : "border-[var(--border)] bg-[var(--background)] opacity-50"} transition-all`}>
                      <div className="font-bold text-xs uppercase mb-3 tracking-widest text-[var(--foreground)] flex justify-between items-center">
                         <span>Governança · Aprovação & Risco</span>
                         <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-[11px] text-[var(--muted-foreground)]">
                         <li>Aprovadores, prazos de corte</li>
                         <li>LGPD, coleta de dados, termo de imagem</li>
                         <li>Respostas difíceis (FAQ) e escalonamento</li>
                      </ul>
                   </div>

                 </div>
                 <div className="mt-5 text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest border-t border-[var(--border)] pt-3">
                   Definição “pronto” (padrão): todo módulo ativo precisa ter custo (R$), responsável, prazo e prova de pronto.
                 </div>
               </WireframeBlock>
             </div>
           )}

           {/* ── Blueprint Text (Step 4+) - BLOCO 5 ── */}
           {step >= 4 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 w-full mt-4">
                <WireframeBlock label="BLOCO 5: FLUXOGRAMA DE DECISÃO" title="ÁRVORE-MÃE (SE → ENTÃO) — V2 EXTREMA" subtitle="Decisão prática → abre módulos físicos/digitais/evento + define resultados verificáveis.">
                   <div className="p-8 md:p-10 border-2 border-[var(--border)] bg-[var(--background)] relative">
                       <div className="absolute top-0 right-0 bg-[var(--foreground)] text-[var(--background)] px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-b-2 border-l-2 border-[var(--primary)]">
                           Blueprint Compilado
                       </div>
                       <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--border)]">
                          <div className="w-10 h-10 border-2 border-[var(--border)] bg-[var(--surface)] flex items-center justify-center">
                            <FileText size={18} className="text-[var(--primary)]" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Síntese de Operação (Decision Tree)</span>
                             <span className="text-lg font-bold font-heading text-[var(--foreground)]">Termo de Abertura / Blueprint</span>
                          </div>
                       </div>
                       <div className="prose prose-sm max-w-none font-medium whitespace-pre-wrap leading-relaxed text-[var(--foreground)] text-justify font-serif selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)]">
                           {blueprintTheory}
                       </div>
                   </div>
                </WireframeBlock>
              </div>
           )}

           {/* ── Notinha de Orçamento Editável (Step 3+) - BLOCO 6 ── */}
           {step >= 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 w-full mt-4">
                <WireframeBlock label="BLOCO 6: DASHBOARD DE DADOS (CARDS E TABELAS)" title="PAINEL DE CONTROLE (DADOS + ALERTAS) — V2" subtitle="Status por módulo + gastos + metas + prova de pronto (auditável).">
                   <div className="border border-[var(--border)] bg-[var(--background)]">
                       {/* KPIs Topo (mock-style) */}
                       <div className="flex border-b border-[var(--border)] divide-x divide-[var(--border)] bg-[var(--surface)]">
                          <div className="flex-1 p-4 flex flex-col justify-between">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Budget Utilizado</span>
                              <span className="text-xl font-black font-mono mt-2 text-[var(--foreground)]">100%</span>
                          </div>
                          <div className="flex-1 p-4 flex flex-col justify-between">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Módulos Ativos</span>
                              <span className="text-xl font-black font-mono mt-2 text-[var(--foreground)]">{Object.values(modulos).filter(v=>v).length + 1}</span>
                          </div>
                          <div className="flex-[2] p-4 flex items-center justify-center bg-[var(--background)]/50">
                              <span className="text-xs text-[var(--muted-foreground)] font-mono text-center">Alertas: 0 pendentes.<br/>KPIs monitorados pelo CoreAct.</span>
                          </div>
                       </div>
                       {/* Header da Tabela */}
                       <div className="hidden sm:grid grid-cols-12 text-[10px] font-bold uppercase tracking-widest border-b border-[var(--border)] pb-3 pt-4 px-6 text-[var(--muted-foreground)] bg-[var(--surface)]">
                           <div className="col-span-4">Categoria</div>
                           <div className="col-span-4">Motivação</div>
                           <div className="col-span-4 text-right">Alocação Estimada (R$)</div>
                       </div>
                       {/* Linhas */}
                       <div className="flex flex-col divide-y divide-[var(--border)]">
                         {aiOrcamentoLinhas.map((linha, idx) => (
                             <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 py-4 px-6 hover:bg-[var(--surface)] transition-colors group">
                                 <div className="sm:col-span-4 flex items-center gap-3">
                                   <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] opacity-50 hidden sm:block"></div>
                                   <div className="text-xs font-bold text-[var(--foreground)] tracking-wide">{linha.categoria}</div>
                                 </div>
                                 <div className="sm:col-span-4 text-[11px] font-medium text-[var(--muted-foreground)] leading-relaxed bg-[var(--background)]/50 sm:bg-transparent p-2 sm:p-0 rounded border border-[var(--border)] sm:border-transparent">
                                   {linha.motivo}
                                 </div>
                                 <div className="sm:col-span-4 flex justify-end">
                                     <div className="relative w-full sm:w-40">
                                         <span className="absolute left-3 top-2 text-[10px] sm:text-xs font-bold text-[var(--muted-foreground)] uppercase">R$</span>
                                         <input 
                                            type="number"
                                            className="w-full bg-[var(--background)] border border-[var(--border)] rounded px-3 py-1.5 text-sm font-bold font-mono text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition-all text-right group-hover:border-[var(--foreground)]/30 hover:border-[var(--foreground)] shadow-sm"
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
                             </div>
                         ))}
                       </div>
                       {/* Footer Total */}
                       <div className="border-t-2 border-[var(--border)] flex items-center justify-between px-6 py-4 bg-[var(--surface)]">
                          <span className="text-xs font-black uppercase tracking-widest text-[var(--foreground)]">Custo Final Projetado</span>
                          <span className="text-2xl font-black font-mono text-[var(--primary)] tracking-tight">R$ {aiOrcamentoLinhas.reduce((acc, curr) => acc + curr.valor_estimado, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                       </div>
                   </div>
                </WireframeBlock>
              </div>
           )}
        </div>
      </main>

    </div>
  );
}
