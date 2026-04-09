import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, Zap, ChevronRight, Layers, MousePointer2, CheckCircle2, LayoutTemplate, Globe, Moon, Sun, Pencil, X, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Types ──────────────────────────────────────────────────────────────────

type Lang = 'pt' | 'en' | 'de';

interface SlideData {
  id: number;
  type: 'cover' | 'part' | 'problem' | 'generic' | 'solution' | 'future';
  visual?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  content?: string;
  points?: string[];
}

interface ContentStore {
  pt: SlideData[];
  en: SlideData[];
  de: SlideData[];
}

// ─── Default Content ─────────────────────────────────────────────────────────

const DEFAULT_CONTENT: ContentStore = {
  pt: [
    { id: 1, type: "cover", visual: "glow", title: "ADAPTA 2026", subtitle: "O Espectro do Cuidado • Relatório de Feitos", badge: "REBRANDING & INFRA" },
    { id: 2, type: "part", title: "01. Diagnóstico", subtitle: "Análise da Comunicação Atual" },
    { id: 3, type: "problem", visual: "sameness", title: "Sameness", content: "O modelo tradicional e a saturação visual no mercado de saúde criaram um 'mar de mesmice'. Muito trabalho manual e isolamento estratégico.", points: ["Comunicação genérica", "Silos entre criação e análise", "Descolamento de marca"] },
    { id: 4, type: "part", title: "02. Infraestrutura", subtitle: "CoreStudio & CoreAct Engine" },
    { id: 5, type: "generic", visual: "system", title: "CoreStudio", content: "Sistema de design unificado. Uma biblioteca de componentes, tokens e padrões visuais garantindo consistência absoluta.", points: ["Tokens universais", "Design Atômico", "Single Source of Truth"] },
    { id: 6, type: "solution", visual: "v8-mock", title: "Motor CoreAct V8", content: "Uma plataforma de engajamento baseada em IA. Cadastre o DNA da campanha e a infraestrutura gera todos os Projetos e Tarefas na hora.", points: ["Criador de Campanhas V8", "Geração e Atribuição Automática", "Plataforma Full-Stack"] },
    { id: 7, type: "part", title: "03. Rebranding", subtitle: "Nova Identidade Visual" },
    { id: 8, type: "generic", visual: "layers", title: "As 5 Camadas", content: "A arquitetura da nova identidade. Expandimos do verde estrutural para múltiplas camadas de emoção e aplicação.", points: ["Núcleo Estrutural", "Expressões de Alegria e Alívio", "Creme Editorial Minimalista"] },
    { id: 9, type: "generic", visual: "color-core", title: "Color Core", content: "De 30 verdes soltos fomos para um sistema cromático completo, vivo e perfeitamente orquestrado.", points: ["Paleta Rigorosa", "Acessibilidade", "Paredes de Cor"] },
    { id: 10, type: "future", visual: "glow", title: "Não mudou. Expandiu.", content: "A nova fundação estratégica para os próximos anos. Uma máquina digital e fluida unida a uma marca premium irresistível.", badge: "O FUTURO" },
    { id: 11, type: "cover", title: "Perguntas?", subtitle: "Obrigado por construírem isso com a gente." }
  ],
  en: [
    { id: 1, type: "cover", visual: "glow", title: "ADAPTA 2026", subtitle: "The Care Spectrum • Accomplishment Report", badge: "REBRANDING & INFRA" },
    { id: 2, type: "part", title: "01. Diagnosis", subtitle: "Current Communication Analysis" },
    { id: 3, type: "problem", visual: "sameness", title: "Sameness", content: "The traditional model and visual saturation in the health market created a 'sea of sameness'. Endless manual work and strategic isolation.", points: ["Generic communication", "Silos between creation and analytics", "Brand detachment"] },
    { id: 4, type: "part", title: "02. Infrastructure", subtitle: "CoreStudio & CoreAct Engine" },
    { id: 5, type: "generic", visual: "system", title: "CoreStudio", content: "Unified design system. A library of components, tokens, and visual patterns ensuring absolute consistency.", points: ["Universal tokens", "Atomic Design", "Single Source of Truth"] },
    { id: 6, type: "solution", visual: "v8-mock", title: "CoreAct V8 Engine", content: "An AI-based engagement platform. Input the campaign DNA, and the infrastructure generates all Projects and Tasks instantly.", points: ["V8 Campaign Creator", "Automatic Generation", "Full-Stack Platform"] },
    { id: 7, type: "part", title: "03. Rebranding", subtitle: "New Visual Identity" },
    { id: 8, type: "generic", visual: "layers", title: "The 5 Layers", content: "The architecture of the new identity. We expanded from structural green to multiple layers of emotion and application.", points: ["Structural Core", "Expressions of Joy and Relief", "Minimalist Editorial Cream"] },
    { id: 9, type: "generic", visual: "color-core", title: "Color Core", content: "From 30 loose greens to a complete, vibrant, and perfectly orchestrated chromatic system.", points: ["Rigorous Palette", "Accessibility", "Walls of Color"] },
    { id: 10, type: "future", visual: "glow", title: "It Didn't Change. It Expanded.", content: "The new strategic foundation for the coming years. A fluid digital machine paired with an irresistible premium brand.", badge: "THE FUTURE" },
    { id: 11, type: "cover", title: "Questions?", subtitle: "Thank you for building this with us." }
  ],
  de: [
    { id: 1, type: "cover", visual: "glow", title: "ADAPTA 2026", subtitle: "Das Spektrum der Pflege • Leistungsbericht", badge: "REBRANDING & INFRASTRUKTUR" },
    { id: 2, type: "part", title: "01. Diagnose", subtitle: "Aktuelle Kommunikationsanalyse" },
    { id: 3, type: "problem", visual: "sameness", title: "Gleichförmigkeit", content: "Das traditionelle Modell und die visuelle Sättigung auf dem Gesundheitsmarkt haben ein 'Meer von Gleichförmigkeit' geschaffen.", points: ["Generische Kommunikation", "Silos zwischen Kreation und Analyse", "Markenentfremdung"] },
    { id: 4, type: "part", title: "02. Infrastruktur", subtitle: "CoreStudio & CoreAct Engine" },
    { id: 5, type: "generic", visual: "system", title: "CoreStudio", content: "Einheitliches Designsystem. Eine Bibliothek aus Komponenten, Tokens und visuellen Mustern für absolute Konsistenz.", points: ["Universelle Tokens", "Atomares Design", "Einzige Wahrheitsquelle"] },
    { id: 6, type: "solution", visual: "v8-mock", title: "CoreAct V8 Engine", content: "Eine KI-basierte Engagement-Plattform. Geben Sie die Kampagnen-DNA ein, und die Infrastruktur generiert sofort alle Projekte.", points: ["V8 Kampagnen-Ersteller", "Automatische Generierung", "Full-Stack Plattform"] },
    { id: 7, type: "part", title: "03. Rebranding", subtitle: "Neue visuelle Identität" },
    { id: 8, type: "generic", visual: "layers", title: "Die 5 Schichten", content: "Die Architektur der neuen Identität. Wir haben uns vom strukturellen Grün zu mehreren Schichten von Emotionen erweitert.", points: ["Strukturkern", "Ausdrücke von Freude", "Minimalistische Eleganz"] },
    { id: 9, type: "generic", visual: "color-core", title: "Color Core", content: "Von 30 losen Grüntönen zu einem vollständigen, lebendigen und perfekt orchestrierten chromatischen System.", points: ["Strenge Palette", "Barrierefreiheit", "Farbwände"] },
    { id: 10, type: "future", visual: "glow", title: "Es hat sich nicht verändert. Es ist gewachsen.", content: "Das neue strategische Fundament für die kommenden Jahre. Eine fließende digitale Maschine, gepaart mit einer Premium-Marke.", badge: "DIE ZUKUNFT" },
    { id: 11, type: "cover", title: "Fragen?", subtitle: "Vielen Dank, dass Sie das mit uns aufbauen." }
  ]
};

const STORAGE_KEY = 'pitch_deck_content_v2';

// ─── CoreStudio Mock ──────────────────────────────────────────────────────────

const MOCK_I18N = {
  pt: { newCampaign: "+ Nova Campanha", targetAudience: "Público Alvo (DNA)", audienceText: "Donos de Clínicas de Alta Renda", btn: "Gerar Roteiro Mágico", step1: "Analisando DNA...", step2: "Conectando ao CoreAct...", title: "Plano V8 Gerado", tk1: "Design UX/UI (Landing Page)", tk1s: "Projeto: Captação • Prioridade Alta", tk2: "Scripts de E-mail", tk2s: "Automático • Pronto para Revisão" },
  en: { newCampaign: "+ New Campaign", targetAudience: "Target Audience (DNA)", audienceText: "High-Income Clinic Owners", btn: "Generate Magic Script", step1: "Analyzing DNA...", step2: "Connecting to CoreAct...", title: "V8 Plan Generated", tk1: "UX/UI Design (Landing Page)", tk1s: "Project: Leads • High Priority", tk2: "Email Automation Scripts", tk2s: "Automatic • Ready for Review" },
  de: { newCampaign: "+ Neue Kampagne", targetAudience: "Zielgruppe (DNA)", audienceText: "Eigentümer von Premium-Kliniken", btn: "Magisches Skript generieren", step1: "DNA analysieren...", step2: "Verbindung mit CoreAct...", title: "V8-Plan erstellt", tk1: "UX/UI Design (Landing Page)", tk1s: "Projekt: Leads • Hohe Priorität", tk2: "E-Mail-Automationsskripte", tk2s: "Automatisch • Zur Überprüfung bereit" }
};

const CoreStudioV8Mock = ({ lang }: { lang: Lang }) => {
  const [step, setStep] = useState(0);
  const t = MOCK_I18N[lang];
  useEffect(() => {
    const interval = setInterval(() => { setStep(s => (s + 1) % 5); }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative w-full aspect-square xl:aspect-[4/3] rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-lg)] flex flex-col font-sans transition-colors duration-300">
      <div className="flex flex-1 relative">
        <div className="w-16 md:w-48 border-r border-[var(--border)] bg-[var(--sidebar)] flex-col gap-2 p-4 hidden md:flex transition-colors duration-300">
          <div className="font-bold text-[var(--sidebar-foreground)] mb-6 tracking-tight">CoreStudio</div>
          <div className="h-8 rounded bg-[var(--primary)] flex items-center px-2 opacity-80"><span className="text-xs font-semibold text-[var(--primary-foreground)]">{t.newCampaign}</span></div>
          <div className="h-6 rounded bg-[var(--muted)] opacity-50 mt-2" />
          <div className="h-6 rounded bg-[var(--muted)] opacity-50" />
        </div>
        <div className="flex-1 bg-[var(--background)] relative p-6 md:p-8 flex flex-col overflow-hidden transition-colors duration-300">
          <div className={`transition-all duration-700 absolute inset-0 p-8 flex flex-col gap-6 ${step === 0 ? 'opacity-100 z-10 translate-y-0' : 'opacity-0 z-0 pointer-events-none translate-y-4'}`}>
            <h3 className="text-[var(--foreground)] font-bold text-xl flex items-center gap-2"><Zap className="w-5 h-5 text-[var(--primary)]" /> Wizard V8</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--muted-foreground)] uppercase font-semibold">{t.targetAudience}</label>
                <div className="h-10 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] flex items-center px-4 font-mono text-sm text-[var(--foreground)]">
                  <span className="animate-[pulse_1s_ease-in-out_infinite] border-r-2 border-[var(--primary)] pr-1">{t.audienceText}</span>
                </div>
              </div>
              <div className="h-10 rounded-[var(--radius)] bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-sm shadow-[var(--shadow-md)] mt-4">{t.btn}</div>
            </div>
          </div>
          <div className={`transition-all duration-700 absolute inset-0 p-8 flex flex-col items-center justify-center gap-6 ${step === 1 || step === 2 ? 'opacity-100 z-20 scale-100' : 'opacity-0 z-0 pointer-events-none scale-95'}`}>
            <Sparkles className={`w-12 h-12 text-[var(--primary)] ${step === 1 ? 'animate-spin-slow' : 'animate-bounce'}`} />
            <div className="text-[var(--foreground)] font-semibold">{step === 1 ? t.step1 : t.step2}</div>
            <div className="w-48 h-1 bg-[var(--border)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--primary)] transition-all duration-3000 ease-out" style={{ width: step === 1 ? '40%' : '100%' }}></div>
            </div>
          </div>
          <div className={`transition-all duration-700 absolute inset-0 p-8 flex flex-col gap-4 overflow-hidden ${step >= 3 ? 'opacity-100 z-30 translate-y-0' : 'opacity-0 z-0 pointer-events-none translate-y-8'}`}>
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-[var(--foreground)] font-bold text-lg flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[var(--success)]" /> {t.title}</h3>
            </div>
            <div className="p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--muted)] flex items-center justify-center text-[var(--foreground)]"><LayoutTemplate className="w-5 h-5" /></div>
              <div>
                <div className="text-[var(--foreground)] font-semibold text-sm">{t.tk1}</div>
                <div className="text-[var(--muted-foreground)] text-xs mt-1">{t.tk1s}</div>
              </div>
            </div>
            <div className={`p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] flex gap-4 transition-all duration-700 delay-300 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-10 h-10 rounded-full bg-[var(--success)] opacity-80 flex items-center justify-center text-[var(--success-foreground)]"><CheckCircle2 className="w-5 h-5 text-[var(--primary-foreground)]" /></div>
              <div>
                <div className="text-[var(--foreground)] font-semibold text-sm">{t.tk2}</div>
                <div className="text-[var(--muted-foreground)] text-xs mt-1">{t.tk2s}</div>
              </div>
            </div>
          </div>
          <div className="absolute transition-all duration-1000 ease-in-out z-50 drop-shadow-md text-[var(--foreground)]" style={{ top: step === 0 ? '60%' : step === 1 ? '50%' : step === 3 ? '40%' : '75%', left: step === 0 ? '60%' : step === 1 ? '50%' : step === 3 ? '70%' : '40%' }}>
            <MousePointer2 className="w-6 h-6 fill-[var(--foreground)] text-[var(--background)]" />
          </div>
        </div>
      </div>
      <style>{`.animate-spin-slow { animation: spin 4s linear infinite; }`}</style>
    </div>
  );
};

// ─── Edit Modal ───────────────────────────────────────────────────────────────

const LANG_LABELS: Record<Lang, string> = { pt: 'Português', en: 'English', de: 'Deutsch' };
const ALL_LANGS: Lang[] = ['pt', 'en', 'de'];

interface EditModalProps {
  slideIndex: number;
  activeLang: Lang;
  content: ContentStore;
  onSave: (updated: ContentStore) => void;
  onClose: () => void;
}

function EditModal({ slideIndex, activeLang, content, onSave, onClose }: EditModalProps) {
  // Deep-clone current content for editing
  const [draft, setDraft] = useState<ContentStore>(() =>
    JSON.parse(JSON.stringify(content))
  );

  const activeSlide = draft[activeLang][slideIndex];

  const updateField = (field: keyof SlideData, value: string) => {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      (next[activeLang][slideIndex] as Record<string, unknown>)[field] = value;
      return next;
    });
  };

  const updatePoint = (idx: number, value: string) => {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      const pts = next[activeLang][slideIndex].points ?? [];
      pts[idx] = value;
      next[activeLang][slideIndex].points = pts;
      return next;
    });
  };

  const addPoint = () => {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      const pts = next[activeLang][slideIndex].points ?? [];
      next[activeLang][slideIndex].points = [...pts, ''];
      return next;
    });
  };

  const removePoint = (idx: number) => {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      const pts = next[activeLang][slideIndex].points ?? [];
      next[activeLang][slideIndex].points = pts.filter((_, i) => i !== idx);
      return next;
    });
  };

  const [saving, setSaving] = useState(false);

  // Ao salvar: traduz os campos do idoma ativo para EN e DE via backend e salva tudo
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const sourceSlide = draft[activeLang][slideIndex];
      const otherLangs = ALL_LANGS.filter(l => l !== activeLang);

      // Monta um objeto só com os campos que existem no slide (exclui 'type' e 'visual')
      const fields: Record<string, string | string[]> = {};
      if (sourceSlide.badge !== undefined) fields.badge = sourceSlide.badge ?? '';
      fields.title = sourceSlide.title;
      if (sourceSlide.subtitle !== undefined) fields.subtitle = sourceSlide.subtitle ?? '';
      if (sourceSlide.content !== undefined) fields.content = sourceSlide.content ?? '';
      if (sourceSlide.points?.length) fields.points = sourceSlide.points;

      const res = await fetch('/_api/pitch/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields, sourceLang: activeLang, targetLangs: otherLangs }),
      });

      const result = await res.json() as { translations?: Record<string, typeof fields>; error?: string };

      const next = JSON.parse(JSON.stringify(draft)) as ContentStore;

      if (result.translations) {
        for (const lang of otherLangs) {
          const t = result.translations[lang];
          if (!t) continue;
          const target = next[lang][slideIndex];
          if (t.badge !== undefined) target.badge = t.badge as string;
          if (t.title) target.title = t.title as string;
          if (t.subtitle !== undefined) target.subtitle = t.subtitle as string;
          if (t.content !== undefined) target.content = t.content as string;
          if (Array.isArray(t.points)) target.points = t.points as string[];
        }
      }

      onSave(next);
    } catch (err) {
      console.error('Translate error:', err);
      // fallback: salva só o idioma ativo sem tradução
      onSave(draft);
    } finally {
      setSaving(false);
    }
  };

  const hasPoints = !!activeSlide.points;
  const hasContent = activeSlide.type !== 'cover' && activeSlide.type !== 'part';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <h2 className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>
            Editar Slide {slideIndex + 1}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ color: 'var(--muted-foreground)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--border)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
            {LANG_LABELS[activeLang]}
          </p>
          <div className="flex flex-col gap-3">
            {/* badge */}
            {activeSlide.badge !== undefined && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>badge</label>
                <input
                  value={activeSlide.badge ?? ''}
                  onChange={e => updateField('badge', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>
            )}
            {/* title */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>title</label>
              <input
                value={activeSlide.title}
                onChange={e => updateField('title', e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
                style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </div>
            {/* subtitle */}
            {activeSlide.subtitle !== undefined && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>subtitle</label>
                <input
                  value={activeSlide.subtitle ?? ''}
                  onChange={e => updateField('subtitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>
            )}
            {/* content */}
            {hasContent && activeSlide.content !== undefined && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>content</label>
                <textarea
                  value={activeSlide.content ?? ''}
                  onChange={e => updateField('content', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none transition-all"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>
            )}
            {/* points */}
            {hasPoints && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>points</label>
                <div className="flex flex-col gap-2">
                  {(activeSlide.points ?? []).map((pt, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        value={pt}
                        onChange={e => updatePoint(idx, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all"
                        style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                      />
                      <button
                        onClick={() => removePoint(idx)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                        style={{ color: 'var(--muted-foreground)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--destructive)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted-foreground)'; }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addPoint()}
                    className="flex items-center gap-1 text-xs font-semibold py-1 px-2 rounded-lg w-fit transition-colors"
                    style={{ color: 'var(--primary)', border: '1px dashed var(--primary)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--primary) 10%, transparent)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Plus className="w-3 h-3" /> Adicionar item
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>



        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex flex-col gap-2 px-6 py-4 border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {saving
              ? '⏳ Traduzindo automaticamente para EN e DE…'
              : `✏️ Editando em ${LANG_LABELS[activeLang]}. Ao salvar, EN e DE serão traduzidos automaticamente.`}
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
              style={{ color: 'var(--foreground)', border: '1px solid var(--border)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--border)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {saving ? 'Traduzindo…' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lang, setLang] = useState<Lang>('pt');
  const [isDark, setIsDark] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [content, setContent] = useState<ContentStore>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_CONTENT;
    } catch {
      return DEFAULT_CONTENT;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editOpen) return; // don't navigate while editing
      if (e.key === 'ArrowRight' || e.key === ' ') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, editOpen]);

  const slideList = content[lang];
  const slide = slideList[currentSlide];

  const next = useCallback(() => {
    if (currentSlide < slideList.length - 1) setCurrentSlide(p => p + 1);
  }, [currentSlide, slideList.length]);

  const prev = useCallback(() => {
    if (currentSlide > 0) setCurrentSlide(p => p - 1);
  }, [currentSlide]);

  const handleSave = (updated: ContentStore) => {
    setContent(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* quota exceeded */ }
    setEditOpen(false);
  };

  const cycleLang = () => {
    setLang(l => l === 'pt' ? 'en' : l === 'en' ? 'de' : 'pt');
  };

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] font-sans overflow-hidden flex flex-col items-center justify-center relative transition-colors duration-700">

      {/* Glow BG */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {slide.visual === 'glow' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)] rounded-full blur-[120px] transition-all duration-1000 ease-in-out opacity-10 animate-pulse" />
        )}
        {(slide.type === 'solution' || slide.visual === 'v8-mock') && (
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--info)] rounded-full blur-[150px] transition-all duration-1000 ease-in-out opacity-10" />
        )}
      </div>

      {/* Top Nav */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-50 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[var(--primary)] flex items-center justify-center shadow-[var(--shadow)]">
            <Zap className="w-4 h-4 text-[var(--primary-foreground)]" />
          </div>
          <span className="font-bold tracking-tight text-lg text-[var(--foreground)]">Core<span className="text-[var(--muted-foreground)]">Studio</span></span>
        </div>

        <div className="flex items-center gap-2">
          {/* Edit current slide button */}
          <button
            onClick={() => setEditOpen(true)}
            className="px-4 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] flex items-center gap-2 shadow-[var(--shadow-sm)] hover:bg-[var(--border)] transition-colors font-medium text-sm"
            title="Editar slide atual"
          >
            <Pencil className="w-4 h-4 text-[var(--primary)]" />
            Editar slide
          </button>

          <button
            onClick={cycleLang}
            className="px-4 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] flex items-center gap-2 shadow-[var(--shadow-sm)] hover:bg-[var(--border)] transition-colors font-medium text-sm uppercase"
            title="Mudar Idioma"
          >
            <Globe className="w-4 h-4 text-[var(--primary)]" />
            {lang}
          </button>

          <button
            onClick={() => setIsDark(d => !d)}
            className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] flex items-center justify-center shadow-[var(--shadow-sm)] hover:bg-[var(--border)] transition-colors"
            title="Alternar Tema"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="relative z-10 w-full max-w-6xl px-8 flex flex-col justify-center min-h-[70vh]">
        <div key={currentSlide + lang} className="w-full flex-col flex animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-4 duration-700 ease-out fill-mode-forwards">

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
          ) : slide.type === 'part' ? (
            <div className="text-center flex flex-col items-center justify-center">
              <h1 className="text-3xl md:text-5xl font-bold tracking-[0.2em] mb-4 text-[var(--primary)] font-heading uppercase opacity-80">
                {slide.title}
              </h1>
              <p className="text-5xl md:text-7xl text-[var(--foreground)] font-bold tracking-tight text-center leading-tight">
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

              <div className="relative w-full">
                {slide.visual === 'v8-mock' ? (
                  <CoreStudioV8Mock lang={lang} />
                ) : slide.visual === 'layers' ? (
                  <div className="w-full aspect-square xl:aspect-[4/3] rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center group shadow-[var(--shadow-lg)] relative overflow-hidden transition-colors duration-300">
                    <div className="relative w-48 h-48 group-hover:scale-110 transition-transform duration-700">
                      <div className="absolute inset-0 bg-[var(--primary)] opacity-20 rounded-xl transform translate-x-8 -translate-y-8" />
                      <div className="absolute inset-x-0 inset-y-4 bg-[var(--primary)] opacity-40 rounded-xl transform translate-x-4 -translate-y-4" />
                      <div className="absolute inset-y-8 inset-x-0 bg-[var(--primary)] opacity-80 rounded-xl border border-[var(--border)] shadow-lg" />
                    </div>
                  </div>
                ) : slide.visual === 'color-core' ? (
                  <div className="w-full aspect-square xl:aspect-[4/3] rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center group shadow-[var(--shadow-lg)] relative overflow-hidden transition-colors duration-300">
                    <div className="flex -space-x-8 group-hover:scale-110 transition-transform duration-700">
                      <div className="w-24 h-24 rounded-full bg-[var(--primary)] mix-blend-multiply opacity-80 animate-pulse" />
                      <div className="w-24 h-24 rounded-full bg-[var(--info)] mix-blend-multiply opacity-80 animate-pulse" />
                      <div className="w-24 h-24 rounded-full bg-[var(--success)] mix-blend-multiply opacity-80 animate-pulse" />
                    </div>
                  </div>
                ) : slide.visual === 'sameness' ? (
                  <div className="w-full aspect-square xl:aspect-[4/3] rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center group shadow-[var(--shadow-lg)] relative overflow-hidden transition-colors duration-300">
                    <div className="grid grid-cols-3 gap-3 p-8 group-hover:rotate-6 transition-transform duration-700">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-16 h-16 bg-[var(--muted)] border border-[var(--border)] rounded-md shadow-sm opacity-40 flex items-center justify-center">
                          <Globe className="w-6 h-6 text-[var(--muted-foreground)] opacity-20" />
                        </div>
                      ))}
                    </div>
                  </div>
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

      {/* Navigation Controls */}
      <div className="absolute bottom-10 left-8 right-8 flex justify-between items-center z-50">
        <div className="flex gap-2">
          {slideList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-8 bg-[var(--primary)] shadow-[var(--shadow-focus)]' : 'w-2 bg-[var(--border)] hover:bg-[var(--muted-foreground)]'}`}
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

      {/* Edit Modal */}
      {editOpen && (
      <EditModal
          slideIndex={currentSlide}
          activeLang={lang}
          content={content}
          onSave={handleSave}
          onClose={() => setEditOpen(false)}
        />
      )}
    </div>
  );
}
