import React, { useState, useCallback } from 'react';
import {
  ArrowRight, ArrowLeft, ChevronRight, Layers, Globe, Moon, Sun,
  Pencil, X, Plus, Trash2, Star, ArrowRightCircle, Check, Dot,
  Flame, Rocket, Copy, ChevronUp, ChevronDown, Sparkles, Zap,
  CheckCircle2, LayoutTemplate, MousePointer2, type LucideIcon,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Lang = 'pt' | 'en' | 'de';

interface SlideData {
  id: number;
  type: 'cover' | 'part' | 'problem' | 'generic' | 'solution' | 'future';
  visual?: string;
  icon?: string;
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

// ─── Visual / Icon options ────────────────────────────────────────────────────

const VISUAL_OPTIONS = [
  { value: 'glow',       label: 'Glow',    thumb: '🌟' },
  { value: 'v8-mock',    label: 'CoreAct', thumb: '⚡' },
  { value: 'layers',     label: 'Camadas', thumb: '📐' },
  { value: 'color-core', label: 'Cores',   thumb: '🎨' },
  { value: 'sameness',   label: 'Grid',    thumb: '📊' },
  { value: 'system',     label: 'Sistema', thumb: '🖥️' },
];

const ICON_OPTIONS: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: 'chevron-right',  label: 'Seta',    Icon: ChevronRight  },
  { value: 'check',          label: 'Check',   Icon: Check         },
  { value: 'check-circle',   label: 'Círculo', Icon: CheckCircle2  },
  { value: 'arrow-right',    label: 'Arrow',   Icon: ArrowRightCircle },
  { value: 'star',           label: 'Estrela', Icon: Star          },
  { value: 'dot',            label: 'Ponto',   Icon: Dot           },
  { value: 'flame',          label: 'Chama',   Icon: Flame         },
  { value: 'rocket',         label: 'Foguete', Icon: Rocket        },
];

const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  ICON_OPTIONS.map(o => [o.value, o.Icon])
);

// ─── Templates de slides novos ────────────────────────────────────────────────

const SLIDE_TEMPLATES: { label: string; emoji: string; make: (id: number) => { pt: SlideData; en: SlideData; de: SlideData } }[] = [
  {
    label: 'Capa', emoji: '🎯',
    make: (id) => ({
      pt: { id, type: 'cover', visual: 'glow', title: 'Título Principal', subtitle: 'Subtítulo da apresentação', badge: 'CATEGORIA' },
      en: { id, type: 'cover', visual: 'glow', title: 'Main Title', subtitle: 'Presentation subtitle', badge: 'CATEGORY' },
      de: { id, type: 'cover', visual: 'glow', title: 'Haupttitel', subtitle: 'Untertitel der Präsentation', badge: 'KATEGORIE' },
    }),
  },
  {
    label: 'Divisor', emoji: '🏷️',
    make: (id) => ({
      pt: { id, type: 'part', title: '01. Seção', subtitle: 'Descrição da seção' },
      en: { id, type: 'part', title: '01. Section', subtitle: 'Section description' },
      de: { id, type: 'part', title: '01. Abschnitt', subtitle: 'Abschnittsbeschreibung' },
    }),
  },
  {
    label: 'Conteúdo', emoji: '📝',
    make: (id) => ({
      pt: { id, type: 'generic', visual: 'layers', title: 'Título do Slide', content: 'Descreva o conteúdo principal aqui. Seja claro e direto.', points: ['Ponto principal 1', 'Ponto principal 2', 'Ponto principal 3'] },
      en: { id, type: 'generic', visual: 'layers', title: 'Slide Title', content: 'Describe the main content here. Be clear and direct.', points: ['Main point 1', 'Main point 2', 'Main point 3'] },
      de: { id, type: 'generic', visual: 'layers', title: 'Folientitel', content: 'Beschreiben Sie den Hauptinhalt hier. Seien Sie klar und direkt.', points: ['Hauptpunkt 1', 'Hauptpunkt 2', 'Hauptpunkt 3'] },
    }),
  },
  {
    label: 'Problema', emoji: '⚠️',
    make: (id) => ({
      pt: { id, type: 'problem', visual: 'sameness', title: 'O Problema', content: 'Descreva o problema ou desafio central aqui.', points: ['Causa raiz 1', 'Causa raiz 2', 'Impacto'] },
      en: { id, type: 'problem', visual: 'sameness', title: 'The Problem', content: 'Describe the central problem or challenge here.', points: ['Root cause 1', 'Root cause 2', 'Impact'] },
      de: { id, type: 'problem', visual: 'sameness', title: 'Das Problem', content: 'Beschreiben Sie das zentrale Problem oder die Herausforderung.', points: ['Grundursache 1', 'Grundursache 2', 'Auswirkung'] },
    }),
  },
  {
    label: 'Solução', emoji: '✅',
    make: (id) => ({
      pt: { id, type: 'solution', visual: 'color-core', title: 'A Solução', content: 'Descreva como a solução resolve o problema apresentado.', points: ['Benefício 1', 'Benefício 2', 'Resultado esperado'] },
      en: { id, type: 'solution', visual: 'color-core', title: 'The Solution', content: 'Describe how the solution addresses the problem.', points: ['Benefit 1', 'Benefit 2', 'Expected outcome'] },
      de: { id, type: 'solution', visual: 'color-core', title: 'Die Lösung', content: 'Beschreiben Sie, wie die Lösung das Problem löst.', points: ['Vorteil 1', 'Vorteil 2', 'Erwartetes Ergebnis'] },
    }),
  },
  {
    label: 'Encerramento', emoji: '🙌',
    make: (id) => ({
      pt: { id, type: 'future', visual: 'glow', title: 'Próximos Passos', content: 'Defina o caminho a seguir para alcançar os objetivos.', badge: 'CONCLUSÃO' },
      en: { id, type: 'future', visual: 'glow', title: 'Next Steps', content: 'Define the path forward to achieve the objectives.', badge: 'CONCLUSION' },
      de: { id, type: 'future', visual: 'glow', title: 'Nächste Schritte', content: 'Definieren Sie den Weg vorwärts, um die Ziele zu erreichen.', badge: 'FAZIT' },
    }),
  },
];

// ─── Default content (same as pitch, serves as inspiration template) ──────────

const DEFAULT_CONTENT: ContentStore = {
  pt: [
    { id: 1, type: 'cover', visual: 'glow', title: 'TÍTULO DA APRESENTAÇÃO', subtitle: 'Subtítulo descritivo • Edite para o seu assunto', badge: 'TEMA' },
    { id: 2, type: 'part', title: '01. Contexto', subtitle: 'Apresentação do Cenário Atual' },
    { id: 3, type: 'problem', visual: 'sameness', title: 'O Desafio', content: 'Descreva o problema central que motiva esta apresentação. Seja direto e específico.', points: ['Ponto de atenção 1', 'Ponto de atenção 2', 'Impacto esperado'] },
    { id: 4, type: 'part', title: '02. Solução', subtitle: 'Nossa Abordagem' },
    { id: 5, type: 'generic', visual: 'layers', title: 'Pilar 1', content: 'Descreva o primeiro pilar da sua solução ou proposta.', points: ['Benefício A', 'Benefício B', 'Diferencial'] },
    { id: 6, type: 'solution', visual: 'color-core', title: 'Pilar 2', content: 'Descreva o segundo pilar com seus diferenciais e resultados esperados.', points: ['Resultado 1', 'Resultado 2', 'Métrica de sucesso'] },
    { id: 7, type: 'future', visual: 'glow', title: 'Próximos Passos', content: 'Defina o caminho a seguir e os marcos de implementação.', badge: 'CONCLUSÃO' },
    { id: 8, type: 'cover', title: 'Obrigado!', subtitle: 'Dúvidas e próximos passos.' },
  ],
  en: [
    { id: 1, type: 'cover', visual: 'glow', title: 'PRESENTATION TITLE', subtitle: 'Descriptive subtitle • Edit for your topic', badge: 'TOPIC' },
    { id: 2, type: 'part', title: '01. Context', subtitle: 'Current Scenario Overview' },
    { id: 3, type: 'problem', visual: 'sameness', title: 'The Challenge', content: 'Describe the core problem motivating this presentation.', points: ['Key concern 1', 'Key concern 2', 'Expected impact'] },
    { id: 4, type: 'part', title: '02. Solution', subtitle: 'Our Approach' },
    { id: 5, type: 'generic', visual: 'layers', title: 'Pillar 1', content: 'Describe the first pillar of your solution or proposal.', points: ['Benefit A', 'Benefit B', 'Differentiator'] },
    { id: 6, type: 'solution', visual: 'color-core', title: 'Pillar 2', content: 'Describe the second pillar with differentials and expected results.', points: ['Result 1', 'Result 2', 'Success metric'] },
    { id: 7, type: 'future', visual: 'glow', title: 'Next Steps', content: 'Define the path forward and implementation milestones.', badge: 'CONCLUSION' },
    { id: 8, type: 'cover', title: 'Thank you!', subtitle: 'Questions and next steps.' },
  ],
  de: [
    { id: 1, type: 'cover', visual: 'glow', title: 'PRÄSENTATIONSTITEL', subtitle: 'Beschreibender Untertitel • Für Ihr Thema anpassen', badge: 'THEMA' },
    { id: 2, type: 'part', title: '01. Kontext', subtitle: 'Überblick über die aktuelle Situation' },
    { id: 3, type: 'problem', visual: 'sameness', title: 'Die Herausforderung', content: 'Beschreiben Sie das zentrale Problem dieser Präsentation.', points: ['Hauptproblem 1', 'Hauptproblem 2', 'Erwartete Auswirkung'] },
    { id: 4, type: 'part', title: '02. Lösung', subtitle: 'Unser Ansatz' },
    { id: 5, type: 'generic', visual: 'layers', title: 'Säule 1', content: 'Beschreiben Sie die erste Säule Ihrer Lösung oder Ihres Vorschlags.', points: ['Vorteil A', 'Vorteil B', 'Unterscheidungsmerkmal'] },
    { id: 6, type: 'solution', visual: 'color-core', title: 'Säule 2', content: 'Beschreiben Sie die zweite Säule mit Alleinstellungsmerkmalen.', points: ['Ergebnis 1', 'Ergebnis 2', 'Erfolgsmetrik'] },
    { id: 7, type: 'future', visual: 'glow', title: 'Nächste Schritte', content: 'Definieren Sie den Weg vorwärts und Implementierungsmeilensteine.', badge: 'FAZIT' },
    { id: 8, type: 'cover', title: 'Vielen Dank!', subtitle: 'Fragen und nächste Schritte.' },
  ],
};

const STORAGE_KEY = 'slide_padrao_content_v1';
const LANG_LABELS: Record<Lang, string> = { pt: 'Português', en: 'English', de: 'Deutsch' };
const ALL_LANGS: Lang[] = ['pt', 'en', 'de'];

// ─── CoreStudio V8 Mock (visual prop) ─────────────────────────────────────────

const MOCK_I18N = {
  pt: { btn: 'Gerar Roteiro Mágico', step1: 'Analisando...', step2: 'Conectando...', title: 'Plano Gerado', tk1: 'Design UX/UI', tk1s: 'Alta Prioridade', tk2: 'Automação', tk2s: 'Pronto para Revisão' },
  en: { btn: 'Generate Magic Script', step1: 'Analyzing...', step2: 'Connecting...', title: 'Plan Generated', tk1: 'UX/UI Design', tk1s: 'High Priority', tk2: 'Automation', tk2s: 'Ready for Review' },
  de: { btn: 'Magisches Skript', step1: 'Analysieren...', step2: 'Verbinden...', title: 'Plan erstellt', tk1: 'UX/UI Design', tk1s: 'Hohe Priorität', tk2: 'Automatisierung', tk2s: 'Zur Überprüfung' },
};

const V8Mock = ({ lang }: { lang: Lang }) => {
  const t = MOCK_I18N[lang];
  return (
    <div className="relative w-full aspect-[4/3] rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-lg)] flex flex-col font-sans">
      <div className="flex flex-1">
        <div className="w-36 border-r border-[var(--border)] bg-[var(--sidebar)] flex-col gap-2 p-4 hidden md:flex">
          <div className="font-bold text-[var(--sidebar-foreground)] mb-4 text-sm">CoreStudio</div>
          <div className="h-7 rounded bg-[var(--primary)] flex items-center px-2 opacity-80"><span className="text-xs font-semibold text-[var(--primary-foreground)] truncate">+ Nova</span></div>
          <div className="h-5 rounded bg-[var(--muted)] opacity-40 mt-1" />
          <div className="h-5 rounded bg-[var(--muted)] opacity-40" />
        </div>
        <div className="flex-1 p-5 flex flex-col gap-4">
          <h3 className="text-[var(--foreground)] font-bold text-base flex items-center gap-2"><Zap className="w-4 h-4 text-[var(--primary)]" /> Wizard V8</h3>
          <div className="h-8 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] flex items-center px-3 font-mono text-xs text-[var(--foreground)]">
            <span className="animate-pulse border-r border-[var(--primary)] pr-1">DNA da campanha...</span>
          </div>
          <div className="h-8 rounded-[var(--radius)] bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-xs">{t.btn}</div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="p-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--muted)] flex items-center justify-center"><LayoutTemplate className="w-4 h-4 text-[var(--foreground)]" /></div>
              <div><div className="text-[var(--foreground)] font-semibold text-xs">{t.tk1}</div><div className="text-[var(--muted-foreground)] text-xs">{t.tk1s}</div></div>
            </div>
            <div className="p-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] flex gap-3 opacity-70">
              <div className="w-8 h-8 rounded-full bg-[var(--success)] flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-white" /></div>
              <div><div className="text-[var(--foreground)] font-semibold text-xs">{t.tk2}</div><div className="text-[var(--muted-foreground)] text-xs">{t.tk2s}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Edit Modal ───────────────────────────────────────────────────────────────

type SavingState = 'idle' | 'translating' | 'error';

function EditModal({ slideIndex, activeLang, content, onSave, onClose }: {
  slideIndex: number; activeLang: Lang; content: ContentStore;
  onSave: (updated: ContentStore) => void; onClose: () => void;
}) {
  const [draft, setDraft] = useState<ContentStore>(() => JSON.parse(JSON.stringify(content)));
  const [saving, setSaving] = useState<SavingState>('idle');

  const activeSlide = draft[activeLang][slideIndex];
  const hasPoints = !!activeSlide.points;
  const hasContent = activeSlide.type !== 'cover' && activeSlide.type !== 'part';

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
      next[activeLang][slideIndex].points![idx] = value;
      return next;
    });
  };

  const addPoint = () => {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      for (const l of ALL_LANGS) {
        if (!next[l][slideIndex].points) next[l][slideIndex].points = [];
        next[l][slideIndex].points!.push(l === activeLang ? 'Novo ponto' : 'New point');
      }
      return next;
    });
  };

  const removePoint = (idx: number) => {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      for (const l of ALL_LANGS) next[l][slideIndex].points!.splice(idx, 1);
      return next;
    });
  };

  const handleSaveAll = async () => {
    const editedFields: Record<string, string | string[]> = {};
    const src = draft[activeLang][slideIndex];
    if (src.title) editedFields.title = src.title;
    if (src.subtitle) editedFields.subtitle = src.subtitle;
    if (src.badge) editedFields.badge = src.badge;
    if (src.content) editedFields.content = src.content;
    if (src.points) editedFields.points = src.points;

    const targetLangs = ALL_LANGS.filter(l => l !== activeLang);
    setSaving('translating');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch('/_api/pitch/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: editedFields, sourceLang: activeLang, targetLangs }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        const { translations } = await res.json();
        setDraft(prev => {
          const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
          for (const l of targetLangs) {
            if (translations[l]) Object.assign(next[l][slideIndex], translations[l]);
          }
          return next;
        });
        setSaving('idle');
        onSave(draft);
        onClose();
        return;
      }
    } catch { /* timeout or error */ }
    clearTimeout(timeout);
    setSaving('error');
    onSave(draft);
    setTimeout(onClose, 1500);
  };

  const inputStyle = { background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <h2 className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>Editar Slide {slideIndex + 1}</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ color: 'var(--muted-foreground)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>{LANG_LABELS[activeLang]}</p>
          <div className="flex flex-col gap-3">
            {activeSlide.badge !== undefined && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>badge</label>
                <input value={activeSlide.badge ?? ''} onChange={e => updateField('badge', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>title</label>
              <input value={activeSlide.title} onChange={e => updateField('title', e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
            </div>
            {activeSlide.subtitle !== undefined && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>subtitle</label>
                <input value={activeSlide.subtitle ?? ''} onChange={e => updateField('subtitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
              </div>
            )}
            {hasContent && activeSlide.content !== undefined && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>content</label>
                <textarea value={activeSlide.content ?? ''} onChange={e => updateField('content', e.target.value)}
                  rows={3} className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none" style={inputStyle} />
              </div>
            )}
            {hasPoints && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>points</label>
                <div className="flex flex-col gap-2">
                  {(activeSlide.points ?? []).map((pt, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input value={pt} onChange={e => updatePoint(idx, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
                      <button onClick={() => removePoint(idx)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{ color: 'var(--muted-foreground)' }}>
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button onClick={addPoint}
                    className="flex items-center gap-1 text-xs font-semibold py-1 px-2 rounded-lg w-fit"
                    style={{ color: 'var(--primary)', border: '1px dashed var(--primary)' }}>
                    <Plus className="w-3 h-3" /> Adicionar item
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Visual */}
          {activeSlide.visual !== undefined && (
            <div className="flex flex-col gap-2 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Visual do slide</label>
              <div className="flex flex-wrap gap-2">
                {VISUAL_OPTIONS.map(opt => {
                  const isActive = (draft.pt[slideIndex].visual ?? 'glow') === opt.value;
                  return (
                    <button key={opt.value}
                      onClick={() => setDraft(prev => { const next = JSON.parse(JSON.stringify(prev)) as ContentStore; for (const l of ALL_LANGS) next[l][slideIndex].visual = opt.value; return next; })}
                      className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                      style={{ background: isActive ? 'var(--primary)' : 'var(--background)', color: isActive ? 'var(--primary-foreground)' : 'var(--muted-foreground)', border: isActive ? '1px solid var(--primary)' : '1px solid var(--border)' }}>
                      <span className="text-lg">{opt.thumb}</span>{opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Icon */}
          {hasPoints && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Ícone dos pontos</label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map(opt => {
                  const isActive = (draft.pt[slideIndex].icon ?? 'chevron-right') === opt.value;
                  return (
                    <button key={opt.value} title={opt.label}
                      onClick={() => setDraft(prev => { const next = JSON.parse(JSON.stringify(prev)) as ContentStore; for (const l of ALL_LANGS) next[l][slideIndex].icon = opt.value; return next; })}
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                      style={{ background: isActive ? 'var(--primary)' : 'var(--background)', color: isActive ? 'var(--primary-foreground)' : 'var(--muted-foreground)', border: isActive ? '1px solid var(--primary)' : '1px solid var(--border)' }}>
                      <opt.Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex flex-col gap-2 px-6 py-4 border-t"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <p className="text-xs" style={{ color: saving === 'error' ? 'var(--destructive)' : 'var(--muted-foreground)' }}>
            {saving === 'translating' && '⏳ Traduzindo automaticamente para EN e DE…'}
            {saving === 'error' && '⚠️ Tradução falhou. Salvo só neste idioma.'}
            {saving === 'idle' && `✏️ Editando em ${LANG_LABELS[activeLang]}. Ao salvar, outros idiomas são traduzidos.`}
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} disabled={saving === 'translating'}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: 'var(--foreground)', border: '1px solid var(--border)' }}>
              Cancelar
            </button>
            <button onClick={handleSaveAll} disabled={saving === 'translating'}
              className="px-5 py-2 rounded-lg text-sm font-semibold"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              {saving === 'translating' ? 'Traduzindo…' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Add Slide Panel ──────────────────────────────────────────────────────────

function AddSlideMenu({ onAdd, onClose }: { onAdd: (tpl: typeof SLIDE_TEMPLATES[0]) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-3"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>Adicionar slide</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full"
            style={{ color: 'var(--muted-foreground)' }}><X className="w-4 h-4" /></button>
        </div>
        {SLIDE_TEMPLATES.map(tpl => (
          <button key={tpl.label} onClick={() => { onAdd(tpl); onClose(); }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-all"
            style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <span className="text-xl">{tpl.emoji}</span>
            <div>
              <div className="font-semibold text-sm">{tpl.label}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Slide Visual Renderer ────────────────────────────────────────────────────

function SlideVisual({ slide, lang }: { slide: SlideData; lang: Lang }) {
  const BulletIcon = ICON_MAP[slide.icon ?? 'chevron-right'] ?? ChevronRight;

  return (
    <>
      {slide.badge && (
        <div className="mb-6 flex">
          <span className="text-xs font-bold tracking-[0.15em] text-[var(--primary)] uppercase bg-[var(--surface)] border border-[var(--border)] px-4 py-2 rounded-[var(--radius-full)] shadow-[var(--shadow)]">
            {slide.badge}
          </span>
        </div>
      )}

      {slide.type === 'cover' ? (
        <div className="text-center flex flex-col items-center">
          <h1 className="text-7xl md:text-[8rem] font-bold tracking-tighter mb-8 text-[var(--foreground)] font-heading leading-tight">
            {slide.title}
          </h1>
          <p className="text-xl md:text-3xl text-[var(--muted-foreground)] font-medium max-w-4xl leading-relaxed">
            {slide.subtitle}
          </p>
        </div>
      ) : slide.type === 'part' ? (
        <div className="text-center flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-[0.2em] mb-4 text-[var(--primary)] font-heading uppercase opacity-80">
            {slide.title}
          </h1>
          <p className="text-5xl md:text-7xl text-[var(--foreground)] font-bold tracking-tight leading-tight">
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
                      <BulletIcon className="w-4 h-4" />
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative w-full">
            {slide.visual === 'v8-mock' ? (
              <V8Mock lang={lang} />
            ) : slide.visual === 'layers' ? (
              <div className="w-full aspect-[4/3] rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center group shadow-[var(--shadow-lg)]">
                <div className="relative w-48 h-48 group-hover:scale-110 transition-transform duration-700">
                  <div className="absolute inset-0 bg-[var(--primary)] opacity-20 rounded-xl transform translate-x-8 -translate-y-8" />
                  <div className="absolute inset-x-0 inset-y-4 bg-[var(--primary)] opacity-40 rounded-xl transform translate-x-4 -translate-y-4" />
                  <div className="absolute inset-y-8 inset-x-0 bg-[var(--primary)] opacity-80 rounded-xl border border-[var(--border)] shadow-lg" />
                </div>
              </div>
            ) : slide.visual === 'color-core' ? (
              <div className="w-full aspect-[4/3] rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center group shadow-[var(--shadow-lg)]">
                <div className="flex -space-x-8 group-hover:scale-110 transition-transform duration-700">
                  <div className="w-24 h-24 rounded-full bg-[var(--primary)] mix-blend-multiply opacity-80 animate-pulse" />
                  <div className="w-24 h-24 rounded-full bg-[var(--info)] mix-blend-multiply opacity-80 animate-pulse" />
                  <div className="w-24 h-24 rounded-full bg-[var(--success)] mix-blend-multiply opacity-80 animate-pulse" />
                </div>
              </div>
            ) : slide.visual === 'sameness' ? (
              <div className="w-full aspect-[4/3] rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center group shadow-[var(--shadow-lg)]">
                <div className="grid grid-cols-3 gap-3 p-8 group-hover:rotate-6 transition-transform duration-700">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-16 h-16 bg-[var(--muted)] border border-[var(--border)] rounded-md shadow-sm opacity-40 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-[var(--muted-foreground)] opacity-20" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full aspect-[4/3] rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center group shadow-[var(--shadow-lg)]">
                <Layers className="w-32 h-32 text-[var(--muted)] group-hover:text-[var(--primary)] transition-colors duration-700 group-hover:scale-110 ease-out opacity-50" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SlidePadrao() {
  const [content, setContent] = useState<ContentStore>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
  });

  const [current, setCurrent] = useState(0);
  const [lang, setLang] = useState<Lang>('pt');
  const [isDark, setIsDark] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);

  const slideList = content[lang];
  const slide = slideList[current];

  const save = (updated: ContentStore) => {
    setContent(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* quota */ }
  };

  // ── Slide management ──────────────────────────────────────────────────────

  const moveUp = useCallback((idx: number) => {
    if (idx === 0) return;
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      for (const l of ALL_LANGS) {
        const arr = next[l];
        [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* quota */ }
      setCurrent(idx - 1);
      return next;
    });
  }, []);

  const moveDown = useCallback((idx: number) => {
    setContent(prev => {
      if (idx >= prev.pt.length - 1) return prev;
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      for (const l of ALL_LANGS) {
        const arr = next[l];
        [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* quota */ }
      setCurrent(idx + 1);
      return next;
    });
  }, []);

  const duplicateSlide = useCallback((idx: number) => {
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      const newId = Date.now();
      for (const l of ALL_LANGS) {
        const copy = JSON.parse(JSON.stringify(next[l][idx])) as SlideData;
        copy.id = newId;
        next[l].splice(idx + 1, 0, copy);
      }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* quota */ }
      setCurrent(idx + 1);
      return next;
    });
  }, []);

  const deleteSlide = useCallback((idx: number) => {
    setContent(prev => {
      if (prev.pt.length <= 1) return prev;
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      for (const l of ALL_LANGS) next[l].splice(idx, 1);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* quota */ }
      setCurrent(c => Math.min(c, next.pt.length - 1));
      return next;
    });
  }, []);

  const addSlide = useCallback((tpl: typeof SLIDE_TEMPLATES[0]) => {
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      const newId = Date.now();
      const made = tpl.make(newId);
      for (const l of ALL_LANGS) next[l].splice(current + 1, 0, made[l]);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* quota */ }
      setCurrent(current + 1);
      return next;
    });
  }, [current]);

  const cycleLang = () => setLang(l => l === 'pt' ? 'en' : l === 'en' ? 'de' : 'pt');

  const bgClass = isDark ? 'dark' : '';

  return (
    <div className={bgClass} style={{ colorScheme: isDark ? 'dark' : 'light' }}>
      <div className="min-h-screen w-full flex bg-[var(--background)] text-[var(--foreground)] font-sans transition-colors duration-700">

        {/* ── Slide Manager Panel ────────────────────────────────────────── */}
        {panelOpen && (
          <div className="w-56 flex-shrink-0 border-r flex flex-col"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Slides</span>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{slideList.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {slideList.map((s, idx) => (
                <div key={s.id}
                  className="group flex items-center gap-1 px-2 py-1 mx-2 my-0.5 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: idx === current ? 'color-mix(in srgb, var(--primary) 12%, transparent)' : 'transparent',
                    borderLeft: idx === current ? '2px solid var(--primary)' : '2px solid transparent',
                  }}
                  onClick={() => setCurrent(idx)}>
                  <div className="flex-1 min-w-0" >
                    <div className="text-xs font-semibold truncate" style={{ color: idx === current ? 'var(--primary)' : 'var(--foreground)' }}>
                      {idx + 1}. {s.title}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{s.type}</div>
                  </div>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={e => { e.stopPropagation(); moveUp(idx); }} disabled={idx === 0}
                      className="w-5 h-5 flex items-center justify-center rounded transition-colors disabled:opacity-20"
                      style={{ color: 'var(--muted-foreground)' }}
                      title="Mover para cima">
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); moveDown(idx); }} disabled={idx === slideList.length - 1}
                      className="w-5 h-5 flex items-center justify-center rounded transition-colors disabled:opacity-20"
                      style={{ color: 'var(--muted-foreground)' }}
                      title="Mover para baixo">
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); duplicateSlide(idx); }}
                      className="w-5 h-5 flex items-center justify-center rounded transition-colors"
                      style={{ color: 'var(--muted-foreground)' }}
                      title="Duplicar slide">
                      <Copy className="w-3 h-3" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); deleteSlide(idx); }} disabled={slideList.length <= 1}
                      className="w-5 h-5 flex items-center justify-center rounded transition-colors disabled:opacity-20"
                      style={{ color: 'var(--muted-foreground)' }}
                      title="Deletar slide">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add slide */}
            <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <button onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{ color: 'var(--primary)', border: '1px dashed var(--primary)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--primary) 8%, transparent)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <Plus className="w-3 h-3" /> Adicionar slide
              </button>
            </div>
          </div>
        )}

        {/* ── Main Slide Area ─────────────────────────────────────────────── */}
        <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center min-h-screen">

          {/* Glow BG */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {slide.visual === 'glow' && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)] rounded-full blur-[120px] opacity-10 animate-pulse" />
            )}
          </div>

          {/* Top Nav */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-50">
            <div className="flex items-center gap-2">
              <button onClick={() => setPanelOpen(p => !p)}
                className="px-3 h-8 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}>
                <Layers className="w-3 h-3" />
                {panelOpen ? 'Ocultar' : 'Slides'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditOpen(true)}
                className="px-4 h-9 rounded-full flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                <Pencil className="w-3.5 h-3.5 text-[var(--primary)]" />
                Editar slide
              </button>
              <button onClick={cycleLang}
                className="px-4 h-9 rounded-full flex items-center gap-2 text-sm font-medium uppercase transition-colors"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                <Globe className="w-3.5 h-3.5 text-[var(--primary)]" />
                {lang}
              </button>
              <button onClick={() => setIsDark(d => !d)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Slide Content */}
          <div className="relative z-10 w-full max-w-6xl px-8 flex flex-col justify-center min-h-[70vh]">
            <div key={`${current}-${lang}`} className="w-full animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-4 duration-500 ease-out">
              <SlideVisual slide={slide} lang={lang} />
            </div>
          </div>

          {/* Navigation */}
          <div className="absolute bottom-8 left-6 right-6 flex justify-between items-center z-50">
            <div className="flex gap-2">
              {slideList.map((_, idx) => (
                <button key={idx} onClick={() => setCurrent(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${idx === current ? 'w-8 bg-[var(--primary)]' : 'w-2 bg-[var(--border)] hover:bg-[var(--muted-foreground)]'}`} />
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setCurrent(p => Math.max(0, p - 1))} disabled={current === 0}
                className="w-12 h-12 rounded-full border flex items-center justify-center transition-all disabled:opacity-30"
                style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--foreground)' }}>
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrent(p => Math.min(slideList.length - 1, p + 1))} disabled={current === slideList.length - 1}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {editOpen && (
        <EditModal slideIndex={current} activeLang={lang} content={content}
          onSave={updated => { save(updated); setEditOpen(false); }}
          onClose={() => setEditOpen(false)} />
      )}
      {addOpen && (
        <AddSlideMenu onAdd={addSlide} onClose={() => setAddOpen(false)} />
      )}
    </div>
  );
}
