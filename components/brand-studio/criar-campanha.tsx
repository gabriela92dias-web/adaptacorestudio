import {
  ArrowLeft, ArrowRight, Target, Zap, CheckCircle2, Sparkles, FileText, X,
  Blocks, Users, Globe, Receipt, Hexagon, Tent, Package, Shield
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

function CampaignBlock({ label, title, subtitle, children, className = "" }: { label: string, title?: string, subtitle?: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={`relative border border-[var(--border)] bg-[var(--surface)] p-8 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all duration-300 ${className}`}>
      <div className="absolute -top-3.5 left-8 bg-[var(--background)] px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--primary)] border border-[var(--border)] rounded-full shadow-sm flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
        {label}
      </div>
      {(title || subtitle) && (
        <div className="mb-8 pb-6 border-b border-[var(--border)]/50">
          {title && <h2 className="text-xl md:text-2xl font-black font-heading tracking-tight text-[var(--foreground)]">{title}</h2>}
          {subtitle && <p className="text-sm font-medium text-[var(--muted-foreground)] mt-2 leading-relaxed">{subtitle}</p>}
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
             <CampaignBlock label="1. Hub Omnicanal (Radial)" title="DNA da Campanha (Escore + Escopo)" subtitle="Centro = decisão mínima que ativa todo o resto. Nodes = pilares que a campanha obrigatoriamente define.">
               {step === 0 ? (
                 <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-32 h-32 rounded-full border border-[var(--border)] flex items-center justify-center bg-[var(--card)] shadow-[0_0_40px_rgba(var(--primary-rgb),0.05)] relative">
                       <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center animate-pulse">
                         <div className="w-8 h-8 rounded-full bg-[var(--primary)] shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"></div>
                       </div>
                       {/* Hub Orbitals */}
                       <div className="absolute inset-0 border border-[var(--border)] rounded-full animate-[spin_20s_linear_infinite]" style={{ margin: '-20px' }}></div>
                       <div className="absolute inset-0 border border-[var(--primary)]/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" style={{ margin: '-40px' }}></div>
                    </div>
                    <h3 className="text-xl font-black font-heading tracking-tight text-[var(--foreground)] mt-16">O Seu Plano Vai Aparecer Aqui</h3>
                    <p className="text-[var(--muted-foreground)] max-w-md mt-3 font-medium text-sm leading-relaxed text-center">Siga os passos à esquerda para visualizar como a plataforma vai distribuir as tarefas, orçamentos e a estrutura do seu projeto.</p>
                 </div>
               ) : (
                 <div className="flex flex-col md:flex-row gap-8 py-4">
                   <div className="flex-[2] text-[var(--foreground)] text-sm">
                     <ul className="list-none space-y-4">
                       <li className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[10px] font-bold text-[var(--primary)]">DR</div> <span className="font-medium"><b>Direção:</b> {direcao === "interna" ? "Interna" : direcao === "externa" ? "Externa" : "Híbrida"}</span></li>
                       <li className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[10px] font-bold text-[var(--primary)]">EX</div> <span className="font-medium"><b>Experiência:</b> {experiencia === "digital" ? "Digital" : experiencia === "presencial" ? "Presencial" : "Híbrida"}</span></li>
                       <li className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[10px] font-bold text-[var(--primary)]">OA</div> <span className="font-medium"><b>Orçamento / Escopo:</b> {orcamento.toString()}</span></li>
                       <li className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[10px] font-bold text-[var(--primary)]">DU</div> <span className="font-medium"><b>Duração / Janela:</b> {eventoDuracao > 0 ? eventoDuracao + " horas" : "Indefinido"}</span></li>
                       <li className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[10px] font-bold text-[var(--primary)]">MD</div> <span className="font-medium"><b>Módulos Ativos:</b> {Object.keys(modulos).filter(k => modulos[k as keyof typeof modulos]).map(k => k.toUpperCase()).join(', ') || "Padrão"}</span></li>
                     </ul>
                     <div className="mt-8 text-[var(--muted-foreground)] border border-[var(--border)] rounded-lg pl-4 italic text-xs font-medium bg-[var(--card)] p-4 shadow-sm flex items-start gap-3">
                        <div className="mt-0.5"><Zap size={14} className="text-[var(--primary)]" /></div>
                        Regra da plataforma: se for híbrida, a camada interna existe sempre (kit + alinhamento + risco).
                     </div>
                   </div>
                   <div className="flex-1 flex flex-col items-center justify-center h-48 rounded-xl bg-[var(--surface)]/50 border border-[var(--border)] shadow-inner relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--background)] to-[var(--surface)]" />
                      <div className="w-16 h-16 rounded-full border border-[var(--primary)]/30 flex items-center justify-center relative bg-[var(--background)] shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)] z-10">
                         <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-[var(--primary)]" />
                         </div>
                         {/* Connection lines */}
                         <div className="absolute w-16 h-[1px] bg-gradient-to-l from-[var(--primary)]/50 to-transparent" style={{ top: '50%', left: '-64px' }}></div>
                         <div className="absolute w-16 h-[1px] bg-gradient-to-r from-[var(--primary)]/50 to-transparent" style={{ top: '50%', right: '-64px' }}></div>
                         <div className="absolute h-16 w-[1px] bg-gradient-to-t from-[var(--primary)]/50 to-transparent" style={{ left: '50%', top: '-64px' }}></div>
                         <div className="absolute h-16 w-[1px] bg-gradient-to-b from-[var(--primary)]/50 to-transparent" style={{ left: '50%', bottom: '-64px' }}></div>
                      </div>
                   </div>
                 </div>
               )}
             </CampaignBlock>
           </div>

           {/* ── Arquitetura de Funil (Vignette Moderno) ── */}
           {step >= 1 && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 w-full mt-8">
               <CampaignBlock label="2. Estrutura Progressiva" title="Gates de Execução (Layer Funnel)" subtitle="Cada layer é um “portão”: se não fechar, a campanha não pode avançar.">
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
               </CampaignBlock>
             </div>
           )}

           {/* ── Trilhas Paralelas (Step 2+) ── */}
           {step >= 2 && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 w-full mt-8">
               <CampaignBlock label="3. Split L/R" title="Trilhas Paralelas (Interna x Externa)" subtitle="Divide o que o time precisa receber/treinar vs. o que o público recebe/experimenta.">
                 <div className="flex flex-col md:flex-row gap-6">
                     {/* Lado Interno */}
                     <div className="flex-1 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors shadow-sm">
                         <div className="border-b border-[var(--border)]/50 pb-4 mb-6 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] flex items-center justify-between">
                             <span>Módulo A — Camada Interna</span>
                             <div className="w-8 h-1 rounded-full bg-[var(--border)]"></div>
                         </div>
                         <ul className="flex flex-col gap-4">
                           {aiTrilhaInterna.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-sm font-medium text-[var(--muted-foreground)] transition-colors group">
                                  <span className="text-[9px] font-black text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded-md uppercase shrink-0 mt-0.5 shadow-sm group-hover:bg-[var(--primary)] group-hover:text-[var(--background)] transition-colors">0{idx+1}</span>
                                  <span className="leading-relaxed text-[var(--foreground)]/80 group-hover:text-[var(--foreground)]">{item}</span>
                              </li>
                           ))}
                         </ul>
                     </div>
                     {/* Lado Externo */}
                     <div className="flex-1 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors shadow-sm">
                         <div className="border-b border-[var(--border)]/50 pb-4 mb-6 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] flex items-center justify-between">
                             <span>Módulo B — Camada Externa</span>
                             <div className="w-8 h-1 rounded-full bg-[var(--primary)]/30"></div>
                         </div>
                         <ul className="flex flex-col gap-4">
                           {aiTrilhaExterna.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-sm font-medium text-[var(--muted-foreground)] transition-colors group">
                                  <span className="text-[9px] font-black text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded-md uppercase shrink-0 mt-0.5 shadow-sm group-hover:bg-[var(--primary)] group-hover:text-[var(--background)] transition-colors">0{idx+1}</span>
                                  <span className="leading-relaxed text-[var(--foreground)]/80 group-hover:text-[var(--foreground)]">{item}</span>
                              </li>
                           ))}
                         </ul>
                     </div>
                 </div>
               </CampaignBlock>
             </div>
           )}

           {/* ── Componentes Flutuantes (Step 2+) ── */}
           {step >= 2 && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 w-full mt-8">
               <CampaignBlock label="4. Componentes Flutuantes" title="Biblioteca de Módulos (Toggles)" subtitle="Cada módulo ON abre subdecisões + tarefas + linha de orçamentos + provas de executabilidade.">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                   
                   {/* EVENTO */}
                   <div className={`p-5 rounded-2xl border ${experiencia === "presencial" || experiencia === "hibrida" || modulos.evento ? "border-[var(--primary)]/50 bg-[var(--primary)]/5 shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)]" : "border-[var(--border)] bg-[var(--surface)] opacity-70"} transition-all duration-300`}>
                      <div className="font-black text-xs uppercase mb-4 tracking-widest text-[var(--foreground)] flex justify-between items-center">
                         <span className="flex items-center gap-2"><div className={`p-1.5 rounded-md ${experiencia === "presencial" || experiencia === "hibrida" || modulos.evento ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "bg-[var(--border)] text-[var(--muted-foreground)]"}`}><Tent size={14} /></div> Evento · Acesso & Prog.</span>
                         {(experiencia === "presencial" || experiencia === "hibrida" || modulos.evento) ? <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]" /> : <div className="w-2 h-2 rounded-full bg-[var(--border)]" />}
                      </div>
                      <ul className="flex flex-col gap-2 text-xs font-medium text-[var(--muted-foreground)]">
                         <li className="flex gap-2 items-center"><div className="w-1 h-1 rounded-full bg-[var(--border)]"></div> <b className="text-[var(--foreground)]">Modelo:</b> {experiencia}</li>
                         <li className="flex gap-2 items-center"><div className="w-1 h-1 rounded-full bg-[var(--border)]"></div> Inscrição, check-in, validação</li>
                         <li className="flex gap-2 items-center"><div className="w-1 h-1 rounded-full bg-[var(--border)]"></div> Programação, blocos, convidados</li>
                      </ul>
                   </div>

                   {/* FÍSICO */}
                   <div className={`p-5 rounded-2xl border ${(modulos.fisico || experiencia === "presencial" || experiencia === "hibrida") ? "border-[var(--primary)]/50 bg-[var(--primary)]/5 shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)]" : "border-[var(--border)] bg-[var(--surface)] opacity-70"} transition-all duration-300`}>
                      <div className="font-black text-xs uppercase mb-4 tracking-widest text-[var(--foreground)] flex justify-between items-center">
                         <span className="flex items-center gap-2"><div className={`p-1.5 rounded-md ${(modulos.fisico || experiencia === "presencial" || experiencia === "hibrida") ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "bg-[var(--border)] text-[var(--muted-foreground)]"}`}><Package size={14} /></div> Físico · Infra & Mat.</span>
                         {(modulos.fisico || experiencia === "presencial" || experiencia === "hibrida") ? <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]" /> : <div className="w-2 h-2 rounded-full bg-[var(--border)]" />}
                      </div>
                      <ul className="flex flex-col gap-2 text-xs font-medium text-[var(--muted-foreground)]">
                         <li className="flex gap-2 items-center"><div className="w-1 h-1 rounded-full bg-[var(--border)]"></div> Impressos (tiragem por tier)</li>
                         <li className="flex gap-2 items-center"><div className="w-1 h-1 rounded-full bg-[var(--border)]"></div> Kits/Brindes, Uniformes/Ids</li>
                         <li className="flex gap-2 items-center"><div className="w-1 h-1 rounded-full bg-[var(--border)]"></div> Locação, Segurança, Coffee</li>
                      </ul>
                   </div>

                   {/* DIGITAL */}
                   <div className={`p-5 rounded-2xl border ${(modulos.digital || experiencia === "digital" || experiencia === "hibrida") ? "border-[var(--primary)]/50 bg-[var(--primary)]/5 shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)]" : "border-[var(--border)] bg-[var(--surface)] opacity-70"} transition-all duration-300`}>
                      <div className="font-black text-xs uppercase mb-4 tracking-widest text-[var(--foreground)] flex justify-between items-center">
                         <span className="flex items-center gap-2"><div className={`p-1.5 rounded-md ${(modulos.digital || experiencia === "digital" || experiencia === "hibrida") ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "bg-[var(--border)] text-[var(--muted-foreground)]"}`}><Globe size={14} /></div> Digital · Tráfego & Ads</span>
                         {(modulos.digital || experiencia === "digital" || experiencia === "hibrida") ? <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]" /> : <div className="w-2 h-2 rounded-full bg-[var(--border)]" />}
                      </div>
                      <ul className="flex flex-col gap-2 text-xs font-medium text-[var(--muted-foreground)]">
                         <li className="flex gap-2 items-center"><div className="w-1 h-1 rounded-full bg-[var(--border)]"></div> Landing Page e Captura</li>
                         <li className="flex gap-2 items-center"><div className="w-1 h-1 rounded-full bg-[var(--border)]"></div> E-mail, Régua de Disparos</li>
                         <li className="flex gap-2 items-center"><div className="w-1 h-1 rounded-full bg-[var(--border)]"></div> Gestão de Tráfego e Dados</li>
                      </ul>
                   </div>

                   {/* GOVERNANÇA */}
                   <div className={`p-5 rounded-2xl border ${modulos.governanca || true ? "border-[var(--primary)]/50 bg-[var(--primary)]/5 shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)]" : "border-[var(--border)] bg-[var(--surface)] opacity-70"} transition-all duration-300`}>
                      <div className="font-black text-xs uppercase mb-4 tracking-widest text-[var(--foreground)] flex justify-between items-center">
                         <span className="flex items-center gap-2"><div className={`p-1.5 rounded-md ${modulos.governanca || true ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "bg-[var(--border)] text-[var(--muted-foreground)]"}`}><Shield size={14} /></div> Gov · Aprovação & Risco</span>
                         <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]" />
                      </div>
                      <ul className="flex flex-col gap-2 text-xs font-medium text-[var(--muted-foreground)]">
                         <li className="flex gap-2 items-center"><div className="w-1 h-1 rounded-full bg-[var(--border)]"></div> Aprovadores, prazos de corte</li>
                         <li className="flex gap-2 items-center"><div className="w-1 h-1 rounded-full bg-[var(--border)]"></div> LGPD e Termo de Imagem</li>
                         <li className="flex gap-2 items-center"><div className="w-1 h-1 rounded-full bg-[var(--border)]"></div> Escalonamento e Gestão de Risco</li>
                      </ul>
                   </div>

                 </div>
                 <div className="mt-8 text-[11px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                   <CheckCircle2 size={14} className="text-[var(--primary)]" /> Definição de Pronto Padrão: Todo módulo requer responsável, verba e prova.
                 </div>
               </CampaignBlock>
             </div>
           )}

           {/* ── Blueprint Text (Step 3+) - BLOCO 5 ── */}
           {step >= 3 && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 w-full mt-8">
               <CampaignBlock label="5. Blueprint Compilado" title="Árvore de Decisão Lógica" subtitle="Visão global de como a campanha escala, cruzando canais com experiência.">
                 <div className="p-1 rounded-2xl bg-gradient-to-br from-[var(--border)] via-[var(--background)] to-[var(--surface)]">
                   <div className="p-8 rounded-xl bg-[var(--surface)]/80 backdrop-blur-sm border border-[var(--border)]/50 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden shadow-inner">
                      {/* Background decorativo criptico */}
                      <div className="absolute inset-0 opacity-5 pointer-events-none">
                         <div className="w-[200%] h-[200%] max-w-none text-[8px] leading-none text-[var(--foreground)] font-mono break-all font-bold">
                             {JSON.stringify({ direcao, experiencia, eventoPublico, eventoDuracao, orcamento, modulos }).repeat(20)}
                         </div>
                      </div>
                      
                      <div className="bg-[var(--background)]/80 backdrop-blur-md border border-[var(--primary)]/30 rounded-2xl px-10 py-8 shadow-[0_10px_40px_rgba(var(--primary-rgb),0.1)] z-10 flex flex-col items-center w-full max-w-3xl">
                          <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                                 <FileText size={20} className="text-[var(--primary)]" />
                              </div>
                              <div className="text-xs font-black text-[var(--primary)] uppercase tracking-widest">Payload Termo de Abertura</div>
                          </div>
                          
                          <div className="w-full text-center mb-6">
                              <span className="text-xl font-heading font-black text-[var(--foreground)]">
                                  {Object.keys(modulos).filter(k=>modulos[k as keyof typeof modulos]).length} Módulos · {aiTrilhaInterna.length + aiTrilhaExterna.length} Nós de Ação
                              </span>
                          </div>
                          
                          <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent mb-6"></div>
                          
                          <div className="w-full text-sm font-medium text-[var(--muted-foreground)] whitespace-pre-wrap leading-relaxed text-justify font-serif selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)] bg-gradient-to-b from-[var(--foreground)] to-[var(--muted-foreground)] bg-clip-text text-transparent opacity-80 h-[100px] overflow-hidden relative">
                              {blueprintTheory}
                              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--background)] to-transparent"></div>
                          </div>
                          
                          <div className="mt-4 px-6 py-2.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--muted-foreground)] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[var(--muted-foreground)]/50"></div>
                              Somente View (Estrutural)
                          </div>
                      </div>
                   </div>
                 </div>
               </CampaignBlock>
             </div>
           )}

           {/* ── Dashboard de Dados (Step 3+) - BLOCO 6 ── */}
           {step >= 3 && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 w-full mt-8">
               <CampaignBlock label="6. Dashboard Base (Simulado)" title="Controle Operacional" subtitle="Impacto previsto baseado nas diretrizes de módulo e orçamentos inseridos.">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                     {/* STAT CARD 1 */}
                     <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[var(--primary)]/30 transition-colors shadow-sm">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--primary)]/5 rounded-bl-full translate-x-12 -translate-y-12 group-hover:bg-[var(--primary)]/10 transition-colors"></div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] mb-4 flex items-center gap-2"><Receipt size={14} className="text-[var(--primary)] opacity-50" /> Budget Global</div>
                         <div className="flex items-baseline gap-1">
                             <span className="text-xs font-bold text-[var(--muted-foreground)]">R$</span>
                             <span className="text-2xl font-black font-heading text-[var(--foreground)] tracking-tight">{orcamento.toLocaleString()}</span>
                         </div>
                     </div>

                     {/* STAT CARD 2 */}
                     <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[var(--primary)]/30 transition-colors shadow-sm">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--primary)]/5 rounded-bl-full translate-x-12 -translate-y-12 group-hover:bg-[var(--primary)]/10 transition-colors"></div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] mb-4 flex items-center gap-2"><Blocks size={14} className="text-[var(--primary)] opacity-50" /> Custo / Módulo</div>
                         <div className="flex items-baseline gap-1">
                             <span className="text-xs font-bold text-[var(--muted-foreground)]">R$</span>
                             <span className="text-2xl font-black font-heading text-[var(--foreground)] tracking-tight">{Object.keys(modulos).filter(k=>modulos[k as keyof typeof modulos]).length > 0 ? Math.floor(orcamento / Object.keys(modulos).filter(k=>modulos[k as keyof typeof modulos]).length).toLocaleString() : "..."}</span>
                         </div>
                     </div>

                     {/* STAT CARD 3 */}
                     <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[var(--primary)]/30 transition-colors shadow-sm">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--primary)]/5 rounded-bl-full translate-x-12 -translate-y-12 group-hover:bg-[var(--primary)]/10 transition-colors"></div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] mb-4 flex items-center gap-2"><Users size={14} className="text-[var(--primary)] opacity-50" /> Headcount Estimado</div>
                         <div className="flex items-baseline gap-2">
                             <span className="text-2xl font-black font-heading text-[var(--foreground)] tracking-tight">{aiTrilhaInterna.length + aiTrilhaExterna.length}</span>
                             <span className="text-[9px] font-bold text-[var(--muted-foreground)] uppercase tracking-wide pt-1">Tarefas</span>
                         </div>
                     </div>

                     {/* STAT CARD 4 */}
                     <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[var(--primary)]/30 transition-colors shadow-sm">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--primary)]/5 rounded-bl-full translate-x-12 -translate-y-12 group-hover:bg-[var(--primary)]/10 transition-colors"></div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] mb-4 flex items-center gap-2"><Target size={14} className="text-[var(--primary)] opacity-50" /> Deploy SLA Estimado</div>
                         <div className="flex items-baseline gap-2">
                             <span className="text-2xl font-black font-heading text-[var(--foreground)] tracking-tight">15</span>
                             <span className="text-[9px] font-bold text-[var(--muted-foreground)] uppercase tracking-wide pt-1">Dias úteis</span>
                         </div>
                     </div>
                 </div>
                 
                 {/* BOTÃO FINAL / CALL TO ACTION EXECUTIVA */}
                 <div className="mt-12 pt-8 border-t border-[var(--border)]/50 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="text-sm font-medium text-[var(--muted-foreground)] max-w-sm ml-2">
                         O plano de ação será compilado e as atividades CoreAct provisionadas para a sua equipe.
                     </div>
                     <button
                        onClick={generateActionPlan}
                        disabled={isGeneratingPlan}
                        className={`group relative overflow-hidden flex items-center gap-3 px-8 py-4 rounded-xl font-black text-xs tracking-[0.2em] uppercase transition-all ${
                          isGeneratingPlan 
                            ? "bg-[var(--surface)] text-[var(--muted-foreground)] border border-[var(--border)] cursor-wait" 
                            : "bg-[var(--foreground)] text-[var(--background)] hover:shadow-[0_10px_40px_rgba(var(--foreground),0.15)] hover:-translate-y-1"
                        }`}
                     >
                       {/* Efeito Glow Hover */}
                       {!isGeneratingPlan && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-[shimmer_1.5s_infinite]"></div>}
                       
                       {isGeneratingPlan ? (
                         <>
                           <div className="w-5 h-5 rounded-full border-2 border-[var(--muted-foreground)] border-t-transparent animate-spin"></div>
                           <span>Compilando Blueprint...</span>
                         </>
                       ) : (
                         <>
                           <span className="relative z-10 pt-0.5">Executar Plano CoreAct</span>
                           <div className="w-8 h-8 rounded-full bg-[var(--background)]/10 flex items-center justify-center relative z-10 group-hover:bg-[var(--background)]/20 group-hover:translate-x-1 transition-all">
                               <ArrowRight size={14} className="text-[var(--background)]" />
                           </div>
                         </>
                       )}
                     </button>
                 </div>
               </CampaignBlock>
             </div>
           )}
        </div>
      </main>

    </div>
  );
}
