import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Play, Sparkles, Zap, ChevronRight, Layers, MousePointer2, CheckCircle2, LayoutTemplate, Database, PenTool, BarChart, Moon, Sun, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CONTENT = {
  pt: [
    {
      id: 1, type: "cover", title: "CoreStudio", visual: "glow",
      subtitle: "A plataforma de inteligência e automação definitiva para o mercado de marketing.",
      badge: "DNA MARKETING DE ALTA PERFORMANCE"
    },
    {
      id: 2, type: "problem", title: "O Mercado Atual",
      content: "O modelo tradicional de agências quebrou. Muito trabalho braçal, processos repetitivos e descolamento entre a estratégia e a execução.",
      points: ["Processos 100% manuais", "Silos entre criação e análise", "Dificuldade de tracionar branding"]
    },
    {
      id: 3, type: "solution", title: "Motor CoreAct V8", visual: "v8-mock",
      content: "Não é só um CRM. É um cérebro. Você cadastra o DNA da Campanha, e a IA gera todo o workflow de Projetos e Tarefas na hora.",
      points: ["Criador de Campanhas V8", "Gerador de Projetos CoreAct", "Plataforma Full-Stack"]
    },
    {
      id: 4, type: "future", title: "Bem-vindo ao Futuro", visual: "glow",
      content: "Uma máquina digital e fluida que transforma escopo abstrato em planos de ação irrefutáveis e automatizados.",
      badge: "WORKFLOW AUTOMÁGICO"
    }
  ],
  en: [
    {
      id: 1, type: "cover", title: "CoreStudio", visual: "glow",
      subtitle: "The ultimate intelligence and automation platform for the marketing industry.",
      badge: "HIGH PERFORMANCE MARKETING DNA"
    },
    {
      id: 2, type: "problem", title: "The Current Market",
      content: "The traditional agency model is broken. Endless manual labor, repetitive processes, and a huge gap between strategy and execution.",
      points: ["100% manual processes", "Silos between creation and analytics", "Hard to build brand traction"]
    },
    {
      id: 3, type: "solution", title: "CoreAct V8 Engine", visual: "v8-mock",
      content: "It's not just a CRM. It's a brain. You input the Campaign DNA, and the AI generates the entire workflow of Projects and Tasks instantly.",
      points: ["V8 Campaign Creator", "CoreAct Project Generator", "Full-Stack Platform"]
    },
    {
      id: 4, type: "future", title: "Welcome to the Future", visual: "glow",
      content: "A fluid, digital machine that transforms abstract scope into irrefutable, automated action plans.",
      badge: "AUTOMAGIC WORKFLOW"
    }
  ],
  de: [
    {
      id: 1, type: "cover", title: "CoreStudio", visual: "glow",
      subtitle: "Die ultimative Plattform für Intelligenz und Automatisierung in der Marketingbranche.",
      badge: "HIGH-PERFORMANCE MARKETING DNA"
    },
    {
      id: 2, type: "problem", title: "Der Aktuelle Markt",
      content: "Das klassische Agenturmodell ist kaputt. Endlose manuelle Arbeit, wiederkehrende Prozesse und eine tiefe Kluft zwischen Strategie und Ausführung.",
      points: ["100% manuelle Prozesse", "Silos zwischen Kreation und Analyse", "Schwierigkeiten beim Markenaufbau"]
    },
    {
      id: 3, type: "solution", title: "CoreAct V8 Engine", visual: "v8-mock",
      content: "Nicht nur ein CRM. Ein Gehirn. Sie geben die Kampagnen-DNA ein, und die KI generiert sofort den gesamten Workflow an Projekten und Aufgaben.",
      points: ["V8 Kampagnen-Ersteller", "CoreAct Projekt-Generator", "Full-Stack Plattform"]
    },
    {
      id: 4, type: "future", title: "Willkommen in der Zukunft", visual: "glow",
      content: "Eine fließende, digitale Maschine, die abstrakten Umfang in unwiderlegbare, automatisierte Aktionspläne verwandelt.",
      badge: "AUTOMAGISCHER WORKFLOW"
    }
  ]
};

const MOCK_I18N = {
  pt: { newCampaign: "+ Nova Campanha", targetAudience: "Público Alvo (DNA)", audienceText: "Donos de Clínicas de Alta Renda", btn: "Gerar Roteiro Mágico", step1: "Analisando DNA...", step2: "Conectando ao CoreAct...", title: "Plano V8 Gerado", tk1: "Design UX/UI (Landing Page)", tk1s: "Projeto: Captação • Prioridade Alta", tk2: "Scripts de E-mail", tk2s: "Automático • Pronto para Revisão" },
  en: { newCampaign: "+ New Campaign", targetAudience: "Target Audience (DNA)", audienceText: "High-Income Clinic Owners", btn: "Generate Magic Script", step1: "Analyzing DNA...", step2: "Connecting to CoreAct...", title: "V8 Plan Generated", tk1: "UX/UI Design (Landing Page)", tk1s: "Project: Leads • High Priority", tk2: "Email Automation Scripts", tk2s: "Automatic • Ready for Review" },
  de: { newCampaign: "+ Neue Kampagne", targetAudience: "Zielgruppe (DNA)", audienceText: "Eigentümer von Premium-Kliniken", btn: "Magisches Skript generieren", step1: "DNA analysieren...", step2: "Verbindung mit CoreAct...", title: "V8-Plan erstellt", tk1: "UX/UI Design (Landing Page)", tk1s: "Projekt: Leads • Hohe Priorität", tk2: "E-Mail-Automationsskripte", tk2s: "Automatisch • Zur Überprüfung bereit" }
};

const CoreStudioV8Mock = ({ lang }: { lang: 'pt'|'en'|'de' }) => {
  const [step, setStep] = useState(0);
  const t = MOCK_I18N[lang];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % 5);
    }, 3000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-square xl:aspect-[4/3] rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-lg)] flex flex-col font-sans transition-colors duration-300">
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <div className="w-16 md:w-48 border-r border-[var(--border)] bg-[var(--sidebar)] flex flex-col gap-2 p-4 hidden md:flex transition-colors duration-300">
          <div className="font-bold text-[var(--sidebar-foreground)] mb-6 tracking-tight">CoreStudio</div>
          <div className="h-8 rounded bg-[var(--primary)] flex items-center px-2 opacity-80"><span className="text-xs font-semibold text-[var(--primary-foreground)]">{t.newCampaign}</span></div>
          <div className="h-6 rounded bg-[var(--muted)] opacity-50 mt-2" />
          <div className="h-6 rounded bg-[var(--muted)] opacity-50" />
        </div>

        {/* Workspace Central */}
        <div className="flex-1 bg-[var(--background)] relative p-6 md:p-8 flex flex-col overflow-hidden transition-colors duration-300">
          
          {/* Passo 0: Input DNA */}
          <div className={`transition-all duration-700 absolute inset-0 p-8 flex flex-col gap-6 ${step === 0 ? 'opacity-100 z-10 translate-y-0' : 'opacity-0 z-0 pointer-events-none translate-y-4'}`}>
            <h3 className="text-[var(--foreground)] font-bold text-xl flex items-center gap-2">
              <Zap className="w-5 h-5 text-[var(--primary)]" /> Wizard V8
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--muted-foreground)] uppercase font-semibold">{t.targetAudience}</label>
                <div className="h-10 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] flex items-center px-4 font-mono text-sm text-[var(--foreground)]">
                  <span className="animate-[pulse_1s_ease-in-out_infinite] border-r-2 border-[var(--primary)] pr-1">{t.audienceText}</span>
                </div>
              </div>
              <div className="h-10 rounded-[var(--radius)] bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-sm shadow-[var(--shadow-md)] mt-4">
                {t.btn}
              </div>
            </div>
          </div>

          {/* Passo 1 e 2: Processing */}
          <div className={`transition-all duration-700 absolute inset-0 p-8 flex flex-col items-center justify-center gap-6 ${step === 1 || step === 2 ? 'opacity-100 z-20 scale-100' : 'opacity-0 z-0 pointer-events-none scale-95'}`}>
             <Sparkles className={`w-12 h-12 text-[var(--primary)] ${step === 1 ? 'animate-spin-slow' : 'animate-bounce'}`} />
             <div className="text-[var(--foreground)] font-semibold">
               {step === 1 ? t.step1 : t.step2}
             </div>
             <div className="w-48 h-1 bg-[var(--border)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--primary)] transition-all duration-3000 ease-out" style={{ width: step === 1 ? '40%' : '100%' }}></div>
             </div>
          </div>

          {/* Passo 3 e 4: Output Projetos CoreAct */}
          <div className={`transition-all duration-700 absolute inset-0 p-8 flex flex-col gap-4 overflow-hidden ${step >= 3 ? 'opacity-100 z-30 translate-y-0' : 'opacity-0 z-0 pointer-events-none translate-y-8'}`}>
             <div className="flex justify-between items-end mb-2">
                <h3 className="text-[var(--foreground)] font-bold text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[var(--success)]" /> {t.title}
                </h3>
             </div>
             
             <div className="p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--muted)] flex items-center justify-center text-[var(--foreground)]">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[var(--foreground)] font-semibold text-sm">{t.tk1}</div>
                  <div className="text-[var(--muted-foreground)] text-xs mt-1">{t.tk1s}</div>
                </div>
             </div>

             <div className={`p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] flex gap-4 transition-all duration-700 delay-300 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-10 h-10 rounded-full bg-[var(--success)] opacity-80 flex items-center justify-center text-[var(--success-foreground)]">
                  <CheckCircle2 className="w-5 h-5 text-[var(--primary-foreground)]" />
                </div>
                <div>
                  <div className="text-[var(--foreground)] font-semibold text-sm">{t.tk2}</div>
                  <div className="text-[var(--muted-foreground)] text-xs mt-1">{t.tk2s}</div>
                </div>
             </div>
          </div>

          {/* Fake Mouse Pointer */}
          <div 
            className="absolute transition-all duration-1000 ease-in-out z-50 drop-shadow-md text-[var(--foreground)]"
            style={{ 
              top: step === 0 ? '60%' : step === 1 ? '50%' : step === 3 ? '40%' : '75%', 
              left: step === 0 ? '60%' : step === 1 ? '50%' : step === 3 ? '70%' : '40%' 
            }}
          >
            <MousePointer2 className="w-6 h-6 fill-[var(--foreground)] text-[var(--background)]" />
          </div>

        </div>
      </div>
      <style>{`
        .animate-spin-slow { animation: spin 4s linear infinite; }
      `}</style>
    </div>
  );
};

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lang, setLang] = useState<'pt'|'en'|'de'>('pt');
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Força o dark mode incialmente, mas é manipulável
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const slideList = CONTENT[lang];
  const slide = slideList[currentSlide];

  const next = () => { if (currentSlide < slideList.length - 1) setCurrentSlide(prev => prev + 1); };
  const prev = () => { if (currentSlide > 0) setCurrentSlide(prev => prev - 1); };
  const toggleTheme = () => setIsDark(!isDark);
  
  const cycleLang = () => {
    if (lang === 'pt') setLang('en');
    else if (lang === 'en') setLang('de');
    else setLang('pt');
  };

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] font-sans overflow-hidden flex flex-col items-center justify-center relative transition-colors duration-700">
      
      {/* Glow Effects strictly based on CSS vars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {slide.visual === 'glow' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)] rounded-full blur-[120px] transition-all duration-1000 ease-in-out opacity-10 animate-pulse"></div>
        )}
        {(slide.type === 'solution' || slide.visual === 'v8-mock') && (
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--info)] rounded-full blur-[150px] transition-all duration-1000 ease-in-out opacity-10"></div>
        )}
      </div>

      {/* Navegação Topo - Tema e Idioma */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-50 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[var(--primary)] flex items-center justify-center shadow-[var(--shadow)]">
            <Zap className="w-4 h-4 text-[var(--primary-foreground)]" />
          </div>
          <span className="font-bold tracking-tight text-lg text-[var(--foreground)]">Core<span className="text-[var(--muted-foreground)]">Studio</span></span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={cycleLang}
            className="px-4 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] flex items-center gap-2 shadow-[var(--shadow-sm)] hover:bg-[var(--border)] transition-colors font-medium text-sm uppercase"
            title="Mudar Idioma"
          >
            <Globe className="w-4 h-4 text-[var(--primary)]" />
            {lang}
          </button>
          
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] flex items-center justify-center shadow-[var(--shadow-sm)] hover:bg-[var(--border)] transition-colors"
            title="Alternar Tema"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Conteúdo Central */}
      <div className="relative z-10 w-full max-w-6xl px-8 flex flex-col justify-center min-h-[70vh]">
        <div 
          key={currentSlide + lang} 
          className="w-full flex-col flex animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-4 duration-700 ease-out fill-mode-forwards"
        >
          
          {slide.badge && (
            <div className="mb-6 flex">
              <span className="text-xs font-bold tracking-[0.15em] text-[var(--primary)] uppercase bg-[var(--surface)] border border-[var(--border)] px-4 py-2 rounded-[var(--radius-full)] shadow-[var(--shadow)]">
                {slide.badge}
              </span>
            </div>
          )}

          {slide.type === 'cover' ? (
            <div className="text-center flex flex-col items-center">
               <h1 className="text-7xl md:text-[8rem] font-bold tracking-tighter mb-8 text-[var(--foreground)] font-heading leading-tight drop-shadow-sm">
                  {slide.title}
               </h1>
               <p className="text-xl md:text-3xl text-[var(--muted-foreground)] font-medium max-w-4xl leading-relaxed text-center">
                 {slide.subtitle}
               </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div>
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.1] text-[var(--foreground)] font-heading">
                  {slide.title}
                </h2>
                <p className="text-xl text-[var(--muted-foreground)] leading-relaxed mb-10 font-medium">
                  {slide.content}
                </p>
                {slide.points && (
                  <ul className="space-y-6">
                    {slide.points.map((point, idx) => (
                      <li key={idx} className="flex items-center gap-4 text-xl text-[var(--foreground)] font-medium">
                        <div className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] shadow-[var(--shadow)]">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Área Visual Dinâmica */}
              <div className="relative w-full">
                {slide.visual === 'v8-mock' ? (
                  <CoreStudioV8Mock lang={lang} />
                ) : (
                  <div className="w-full aspect-square xl:aspect-[4/3] rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center group shadow-[var(--shadow-lg)] relative overflow-hidden transition-colors duration-300">
                     <Layers className="w-32 h-32 text-[var(--muted)] group-hover:text-[var(--primary)] transition-colors duration-700 group-hover:scale-110 ease-out opacity-50" />
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Controles de Navegação */}
      <div className="absolute bottom-10 left-8 right-8 flex justify-between items-center z-50">
        
        <div className="flex gap-2">
          {slideList.map((_, idx) => (
             <div 
               key={idx} 
               className={`h-2 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-8 bg-[var(--primary)] shadow-[var(--shadow-focus)]' : 'w-2 bg-[var(--border)]'}`}
             />
          ))}
        </div>

        <div className="flex gap-4">
          <button 
            onClick={prev}
            disabled={currentSlide === 0}
            className="w-14 h-14 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--border)] disabled:opacity-30 disabled:hover:bg-[var(--surface)] transition-all shadow-[var(--shadow-md)]"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={next}
            disabled={currentSlide === slideList.length - 1}
            className="w-14 h-14 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center hover:opacity-90 disabled:opacity-30 transition-all shadow-[var(--shadow-lg)]"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
