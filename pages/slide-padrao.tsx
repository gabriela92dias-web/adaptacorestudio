import React, { useState, useCallback } from 'react';
import {
  ArrowRight, ArrowLeft, ChevronRight, Layers, Globe, Moon, Sun,
  Pencil, X, Plus, Trash2, Star, ArrowRightCircle, Check, Dot,
  Flame, Rocket, Copy, ChevronUp, ChevronDown, Zap,
  CheckCircle2, LayoutTemplate, AlertCircle, PanelLeft, PanelRight, Square,
  Sparkles, Grid, Monitor, Wind, ArrowUp, ZoomIn, List, GitCommit,
  LayoutGrid, Target, Tag, GitBranch, Flag,
  type LucideIcon,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Lang = 'pt' | 'en' | 'de';

interface Topic {
  id: string;
  text: string;
  children?: string[]; // sub-tópicos (1 nível, só idioma ativo)
}

interface TopicBlock {
  view: 'list' | 'cards' | 'sequence' | 'flow';
  gridCols?: 2 | 3 | 4; // somente view=cards
  icon?: string;          // somente view=list
  topics: Topic[];
}

interface SlideData {
  id: number;
  type: 'cover' | 'part' | 'problem' | 'generic' | 'solution' | 'future';
  layout?: 'split-right' | 'split-left' | 'center';
  bgStyle?: 'solid' | 'glow' | 'layers' | 'grid' | 'mockup';
  animation?: 'none' | 'fade' | 'slide-up' | 'zoom';
  title: string;
  subtitle?: string;
  badge?: string;
  content?: string;
  topicBlock?: TopicBlock; // substitui points + icon
}

interface ContentStore {
  pt: SlideData[];
  en: SlideData[];
  de: SlideData[];
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const LAYOUT_OPTIONS = [
  { value: 'split-right', label: 'Padrão L/R', icon: PanelRight },
  { value: 'split-left',  label: 'Reverso R/L', icon: PanelLeft },
  { value: 'center',      label: 'Centro',      icon: Square },
];

const BG_OPTIONS = [
  { value: 'solid',       label: 'Limpo',   icon: Square },
  { value: 'glow',        label: 'Glow',    icon: Sparkles },
  { value: 'grid',        label: 'Grid',    icon: Grid },
  { value: 'layers',      label: 'Layers',  icon: Layers },
  { value: 'mockup',      label: 'Mockup',  icon: Monitor },
];

const ANIM_OPTIONS = [
  { value: 'none',        label: 'Seca',    icon: Zap },
  { value: 'fade',        label: 'Fade',    icon: Wind },
  { value: 'slide-up',    label: 'Sobe',    icon: ArrowUp },
  { value: 'zoom',        label: 'Zoom In', icon: ZoomIn },
];

const ICON_OPTIONS: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: 'chevron-right', label: 'Seta',    Icon: ChevronRight    },
  { value: 'check',         label: 'Check',   Icon: Check           },
  { value: 'check-circle',  label: 'Círculo', Icon: CheckCircle2    },
  { value: 'arrow-right',   label: 'Arrow',   Icon: ArrowRightCircle},
  { value: 'star',          label: 'Estrela', Icon: Star            },
  { value: 'dot',           label: 'Ponto',   Icon: Dot             },
  { value: 'flame',         label: 'Chama',   Icon: Flame           },
  { value: 'rocket',        label: 'Foguete', Icon: Rocket          },
];
const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(ICON_OPTIONS.map(o => [o.value, o.Icon]));

type ViewType = 'list' | 'cards' | 'sequence' | 'flow';
const VIEW_CONFIG: Record<ViewType, { label: string; icon: LucideIcon; isFullWidth: boolean }> = {
  list:     { label: 'Lista',     icon: List, isFullWidth: false },
  flow:     { label: 'Fluxo',     icon: GitCommit, isFullWidth: false },
  cards:    { label: 'Cards',     icon: LayoutGrid, isFullWidth: true  },
  sequence: { label: 'Sequência', icon: ArrowRight, isFullWidth: true  },
};

const ALL_LANGS: Lang[] = ['pt', 'en', 'de'];
const LANG_LABELS: Record<Lang, string> = { pt: 'Português', en: 'English', de: 'Deutsch' };
const STORAGE_KEY = 'slide_padrao_content_v3';

const newTopic = (text: string): Topic => ({ id: `t_${Math.random().toString(36).slice(2, 8)}`, text });

const DEFAULT_TOPIC_TEXTS: Record<Lang, { topic: string; child: string }> = {
  pt: { topic: 'Novo tópico', child: 'Sub-tópico' },
  en: { topic: 'New topic',   child: 'Sub-topic'  },
  de: { topic: 'Neues Thema', child: 'Unterthema' },
};

// ─── Default Content ───────────────────────────────────────────────────────────

const DEFAULT_CONTENT: ContentStore = {
  pt: [
    { id: 1, type: 'cover',    layout: 'center', bgStyle: 'glow', animation: 'fade', title: 'TÍTULO DA APRESENTAÇÃO', subtitle: 'Subtítulo descritivo • Edite para o seu assunto', badge: 'TEMA' },
    { id: 2, type: 'part',     layout: 'center', bgStyle: 'solid', animation: 'slide-up', title: '01. Contexto', subtitle: 'Apresentação do Cenário Atual' },
    { id: 3, type: 'problem',  layout: 'split-right', bgStyle: 'grid', animation: 'fade', title: 'O Desafio', content: 'Descreva o problema central que motiva esta apresentação.', topicBlock: { view: 'list', icon: 'chevron-right', topics: [newTopic('Ponto de atenção 1'), newTopic('Ponto de atenção 2'), newTopic('Impacto estimado')] } },
    { id: 4, type: 'part',     layout: 'center', bgStyle: 'solid', animation: 'slide-up', title: '02. Solução', subtitle: 'Nossa Abordagem' },
    { id: 5, type: 'generic',  layout: 'split-right', bgStyle: 'mockup', animation: 'fade', title: 'Pilar 1', content: 'Descreva o primeiro pilar da sua solução ou proposta.', topicBlock: { view: 'list', icon: 'check', topics: [newTopic('Benefício A'), newTopic('Benefício B'), newTopic('Diferencial')] } },
    { id: 6, type: 'solution', layout: 'center', bgStyle: 'solid', animation: 'slide-up', title: 'Resultados', content: 'Principais resultados e métricas alcançadas.', topicBlock: { view: 'cards', gridCols: 3, topics: [newTopic('Resultado 1'), newTopic('Resultado 2'), newTopic('Resultado 3')] } },
    { id: 7, type: 'future',   layout: 'center', bgStyle: 'glow', animation: 'zoom', title: 'Próximos Passos', content: 'Defina o caminho a seguir e os marcos de implementação.', badge: 'CONCLUSÃO', topicBlock: { view: 'sequence', topics: [newTopic('Passo 1'), newTopic('Passo 2'), newTopic('Passo 3'), newTopic('Passo 4')] } },
    { id: 8, type: 'cover',    layout: 'center', bgStyle: 'solid', animation: 'fade', title: 'Obrigado!', subtitle: 'Dúvidas e próximos passos.' },
  ],
  en: [
    { id: 1, type: 'cover',    layout: 'center', bgStyle: 'glow', animation: 'fade', title: 'PRESENTATION TITLE', subtitle: 'Descriptive subtitle • Edit for your topic', badge: 'TOPIC' },
    { id: 2, type: 'part',     layout: 'center', bgStyle: 'solid', animation: 'slide-up', title: '01. Context', subtitle: 'Current Scenario Overview' },
    { id: 3, type: 'problem',  layout: 'split-right', bgStyle: 'grid', animation: 'fade', title: 'The Challenge', content: 'Describe the core problem motivating this presentation.', topicBlock: { view: 'list', icon: 'chevron-right', topics: [newTopic('Key concern 1'), newTopic('Key concern 2'), newTopic('Estimated impact')] } },
    { id: 4, type: 'part',     layout: 'center', bgStyle: 'solid', animation: 'slide-up', title: '02. Solution', subtitle: 'Our Approach' },
    { id: 5, type: 'generic',  layout: 'split-right', bgStyle: 'mockup', animation: 'fade', title: 'Pillar 1', content: 'Describe the first pillar of your solution or proposal.', topicBlock: { view: 'list', icon: 'check', topics: [newTopic('Benefit A'), newTopic('Benefit B'), newTopic('Differentiator')] } },
    { id: 6, type: 'solution', layout: 'center', bgStyle: 'solid', animation: 'slide-up', title: 'Results', content: 'Main results and metrics achieved.', topicBlock: { view: 'cards', gridCols: 3, topics: [newTopic('Result 1'), newTopic('Result 2'), newTopic('Result 3')] } },
    { id: 7, type: 'future',   layout: 'center', bgStyle: 'glow', animation: 'zoom', title: 'Next Steps', content: 'Define the path forward and implementation milestones.', badge: 'CONCLUSION', topicBlock: { view: 'sequence', topics: [newTopic('Step 1'), newTopic('Step 2'), newTopic('Step 3'), newTopic('Step 4')] } },
    { id: 8, type: 'cover',    layout: 'center', bgStyle: 'solid', animation: 'fade', title: 'Thank you!', subtitle: 'Questions and next steps.' },
  ],
  de: [
    { id: 1, type: 'cover',    layout: 'center', bgStyle: 'glow', animation: 'fade', title: 'PRÄSENTATIONSTITEL', subtitle: 'Beschreibender Untertitel • Für Ihr Thema anpassen', badge: 'THEMA' },
    { id: 2, type: 'part',     layout: 'center', bgStyle: 'solid', animation: 'slide-up', title: '01. Kontext', subtitle: 'Überblick über die aktuelle Situation' },
    { id: 3, type: 'problem',  layout: 'split-right', bgStyle: 'grid', animation: 'fade', title: 'Die Herausforderung', content: 'Beschreiben Sie das zentrale Problem dieser Präsentation.', topicBlock: { view: 'list', icon: 'chevron-right', topics: [newTopic('Hauptproblem 1'), newTopic('Hauptproblem 2'), newTopic('Erwartete Auswirkung')] } },
    { id: 4, type: 'part',     layout: 'center', bgStyle: 'solid', animation: 'slide-up', title: '02. Lösung', subtitle: 'Unser Ansatz' },
    { id: 5, type: 'generic',  layout: 'split-right', bgStyle: 'mockup', animation: 'fade', title: 'Säule 1', content: 'Beschreiben Sie die erste Säule Ihrer Lösung.', topicBlock: { view: 'list', icon: 'check', topics: [newTopic('Vorteil A'), newTopic('Vorteil B'), newTopic('Unterscheidungsmerkmal')] } },
    { id: 6, type: 'solution', layout: 'center', bgStyle: 'solid', animation: 'slide-up', title: 'Ergebnisse', content: 'Hauptergebnisse und erreichte Kennzahlen.', topicBlock: { view: 'cards', gridCols: 3, topics: [newTopic('Ergebnis 1'), newTopic('Ergebnis 2'), newTopic('Ergebnis 3')] } },
    { id: 7, type: 'future',   layout: 'center', bgStyle: 'glow', animation: 'zoom', title: 'Nächste Schritte', content: 'Definieren Sie den Weg vorwärts und Implementierungsmeilensteine.', badge: 'FAZIT', topicBlock: { view: 'sequence', topics: [newTopic('Schritt 1'), newTopic('Schritt 2'), newTopic('Schritt 3'), newTopic('Schritt 4')] } },
    { id: 8, type: 'cover',    layout: 'center', bgStyle: 'solid', animation: 'fade', title: 'Vielen Dank!', subtitle: 'Fragen und nächste Schritte.' },
  ],
};

// ─── Slide Templates ───────────────────────────────────────────────────────────

const SLIDE_TEMPLATES: {
  label: string; icon: LucideIcon;
  make: (id: number) => { pt: SlideData; en: SlideData; de: SlideData };
}[] = [
  {
    label: 'Capa', icon: Target,
    make: id => ({
      pt: { id, type: 'cover', layout: 'center', bgStyle: 'glow', animation: 'fade', title: 'Título Principal', subtitle: 'Subtítulo da apresentação', badge: 'CATEGORIA' },
      en: { id, type: 'cover', layout: 'center', bgStyle: 'glow', animation: 'fade', title: 'Main Title', subtitle: 'Presentation subtitle', badge: 'CATEGORY' },
      de: { id, type: 'cover', layout: 'center', bgStyle: 'glow', animation: 'fade', title: 'Haupttitel', subtitle: 'Untertitel der Präsentation', badge: 'KATEGORIE' },
    }),
  },
  {
    label: 'Divisor', icon: Tag,
    make: id => ({
      pt: { id, type: 'part', layout: 'center', bgStyle: 'solid', animation: 'slide-up', title: '01. Seção', subtitle: 'Descrição da seção' },
      en: { id, type: 'part', layout: 'center', bgStyle: 'solid', animation: 'slide-up', title: '01. Section', subtitle: 'Section description' },
      de: { id, type: 'part', layout: 'center', bgStyle: 'solid', animation: 'slide-up', title: '01. Abschnitt', subtitle: 'Abschnittsbeschreibung' },
    }),
  },
  {
    label: 'Lista', icon: List,
    make: id => ({
      pt: { id, type: 'generic', layout: 'split-right', bgStyle: 'grid', animation: 'fade', title: 'Título', content: 'Contexto breve.', topicBlock: { view: 'list', icon: 'chevron-right', topics: [newTopic('Ponto 1'), newTopic('Ponto 2'), newTopic('Ponto 3')] } },
      en: { id, type: 'generic', layout: 'split-right', bgStyle: 'grid', animation: 'fade', title: 'Title', content: 'Brief context.', topicBlock: { view: 'list', icon: 'chevron-right', topics: [newTopic('Point 1'), newTopic('Point 2'), newTopic('Point 3')] } },
      de: { id, type: 'generic', layout: 'split-right', bgStyle: 'grid', animation: 'fade', title: 'Titel', content: 'Kurzer Kontext.', topicBlock: { view: 'list', icon: 'chevron-right', topics: [newTopic('Punkt 1'), newTopic('Punkt 2'), newTopic('Punkt 3')] } },
    }),
  },
  {
    label: 'Cards', icon: LayoutGrid,
    make: id => ({
      pt: { id, type: 'generic', layout: 'center', bgStyle: 'solid', animation: 'fade', title: 'Título', content: '', topicBlock: { view: 'cards', gridCols: 3, topics: [newTopic('Elemento 1'), newTopic('Elemento 2'), newTopic('Elemento 3')] } },
      en: { id, type: 'generic', layout: 'center', bgStyle: 'solid', animation: 'fade', title: 'Title', content: '', topicBlock: { view: 'cards', gridCols: 3, topics: [newTopic('Element 1'), newTopic('Element 2'), newTopic('Element 3')] } },
      de: { id, type: 'generic', layout: 'center', bgStyle: 'solid', animation: 'fade', title: 'Titel', content: '', topicBlock: { view: 'cards', gridCols: 3, topics: [newTopic('Element 1'), newTopic('Element 2'), newTopic('Element 3')] } },
    }),
  },
  {
    label: 'Sequência', icon: ArrowRight,
    make: id => ({
      pt: { id, type: 'generic', layout: 'center', bgStyle: 'solid', animation: 'fade', title: 'Processo', content: '', topicBlock: { view: 'sequence', topics: [newTopic('Passo 1'), newTopic('Passo 2'), newTopic('Passo 3'), newTopic('Passo 4')] } },
      en: { id, type: 'generic', layout: 'center', bgStyle: 'solid', animation: 'fade', title: 'Process', content: '', topicBlock: { view: 'sequence', topics: [newTopic('Step 1'), newTopic('Step 2'), newTopic('Step 3'), newTopic('Step 4')] } },
      de: { id, type: 'generic', layout: 'center', bgStyle: 'solid', animation: 'fade', title: 'Prozess', content: '', topicBlock: { view: 'sequence', topics: [newTopic('Schritt 1'), newTopic('Schritt 2'), newTopic('Schritt 3'), newTopic('Schritt 4')] } },
    }),
  },
  {
    label: 'Fluxo', icon: GitBranch,
    make: id => ({
      pt: { id, type: 'generic', layout: 'split-right', bgStyle: 'grid', animation: 'fade', title: 'Fluxo', content: '', topicBlock: { view: 'flow', topics: [newTopic('Etapa 1'), newTopic('Etapa 2'), newTopic('Etapa 3')] } },
      en: { id, type: 'generic', layout: 'split-right', bgStyle: 'grid', animation: 'fade', title: 'Flow', content: '', topicBlock: { view: 'flow', topics: [newTopic('Stage 1'), newTopic('Stage 2'), newTopic('Stage 3')] } },
      de: { id, type: 'generic', layout: 'split-right', bgStyle: 'grid', animation: 'fade', title: 'Ablauf', content: '', topicBlock: { view: 'flow', topics: [newTopic('Phase 1'), newTopic('Phase 2'), newTopic('Phase 3')] } },
    }),
  },
  {
    label: 'Encerramento', icon: Flag,
    make: id => ({
      pt: { id, type: 'future', layout: 'center', bgStyle: 'glow', animation: 'zoom', title: 'Próximos Passos', content: 'Defina o caminho a seguir.', badge: 'CONCLUSÃO' },
      en: { id, type: 'future', layout: 'center', bgStyle: 'glow', animation: 'zoom', title: 'Next Steps', content: 'Define the path forward.', badge: 'CONCLUSION' },
      de: { id, type: 'future', layout: 'center', bgStyle: 'glow', animation: 'zoom', title: 'Nächste Schritte', content: 'Definieren Sie den Weg vorwärts.', badge: 'FAZIT' },
    }),
  },
];

// ─── Utility ───────────────────────────────────────────────────────────────────

export const getDynamicFontSize = (text: string | undefined, type: 'cover-title' | 'cover-subtitle' | 'part-title' | 'part-subtitle' | 'generic-title' | 'generic-content') => {
  if (!text) return '';
  const len = text.length;

  if (type === 'cover-title') {
    if (len < 15) return 'clamp(4rem, 10vw, 9rem)';
    if (len < 30) return 'clamp(3.5rem, 8vw, 7.5rem)';
    if (len < 60) return 'clamp(2.5rem, 6vw, 5.5rem)';
    return 'clamp(2rem, 4vw, 4rem)';
  }
  if (type === 'cover-subtitle') {
    if (len < 40) return 'clamp(1.5rem, 3vw, 2.5rem)';
    if (len < 100) return 'clamp(1.2rem, 2vw, 1.75rem)';
    return 'clamp(1rem, 1.5vw, 1.3rem)';
  }
  if (type === 'part-title') {
    if (len < 20) return 'clamp(2rem, 4vw, 4rem)';
    if (len < 40) return 'clamp(1.5rem, 3vw, 3rem)';
    return 'clamp(1.2rem, 2vw, 2rem)';
  }
  if (type === 'part-subtitle') {
    if (len < 20) return 'clamp(3.5rem, 7vw, 6rem)';
    if (len < 50) return 'clamp(3rem, 6vw, 5rem)';
    if (len < 100) return 'clamp(2rem, 4vw, 4rem)';
    return 'clamp(1.5rem, 3vw, 3rem)';
  }
  if (type === 'generic-title') {
    if (len < 20) return 'clamp(2.5rem, 5vw, 5rem)';
    if (len < 50) return 'clamp(2rem, 4vw, 4rem)';
    return 'clamp(1.5rem, 3vw, 3rem)';
  }
  if (type === 'generic-content') {
    if (len < 100) return 'clamp(1.25rem, 2vw, 1.5rem)';
    if (len < 250) return 'clamp(1.1rem, 1.5vw, 1.25rem)';
    return 'clamp(1rem, 1.2vw, 1.1rem)';
  }
  
  return '';
};

// ─── V8 Mock visual ────────────────────────────────────────────────────────────

const V8Mock = () => (
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
        <div className="h-8 rounded-[var(--radius)] border border-[var(--border)] flex items-center px-3 font-mono text-xs text-[var(--foreground)]">
          <span className="animate-pulse border-r border-[var(--primary)] pr-1">DNA da campanha...</span>
        </div>
        <div className="h-8 rounded-[var(--radius)] bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-xs">Gerar Roteiro</div>
        <div className="p-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] flex gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--muted)] flex items-center justify-center"><LayoutTemplate className="w-4 h-4 text-[var(--foreground)]" /></div>
          <div><div className="text-[var(--foreground)] font-semibold text-xs">UX/UI Design</div><div className="text-[var(--muted-foreground)] text-xs">Alta Prioridade</div></div>
        </div>
        <div className="p-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] flex gap-3 opacity-70">
          <div className="w-8 h-8 rounded-full bg-[var(--success)] flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-white" /></div>
          <div><div className="text-[var(--foreground)] font-semibold text-xs">Automação</div><div className="text-[var(--muted-foreground)] text-xs">Pronto para Revisão</div></div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Topic Block Renderer ──────────────────────────────────────────────────────

function TopicBlockRenderer({ block }: { block: TopicBlock }) {
  const BulletIcon = ICON_MAP[block.icon ?? 'chevron-right'] ?? ChevronRight;

  if (block.view === 'list') {
    return (
      <ul className="space-y-5 mt-4">
        {block.topics.map(t => (
          <li key={t.id} className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--primary)' }}>
              <BulletIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-medium leading-snug" style={{ color: 'var(--foreground)' }}>{t.text}</div>
              {t.children?.map((child, ci) => (
                <div key={ci} className="flex items-center gap-2 mt-1.5 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current inline-block flex-shrink-0" />
                  {child}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (block.view === 'flow') {
    return (
      <div className="flex flex-col gap-0 mt-4">
        {block.topics.map((t, idx) => (
          <div key={t.id} className="flex gap-4">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                {idx + 1}
              </div>
              {idx < block.topics.length - 1 && (
                <div className="w-px flex-1 my-1" style={{ background: 'var(--border)', minHeight: '24px' }} />
              )}
            </div>
            <div className="pb-4 pt-0.5">
              <div className="text-xl font-medium leading-snug" style={{ color: 'var(--foreground)' }}>{t.text}</div>
              {t.children?.map((child, ci) => (
                <div key={ci} className="flex items-center gap-2 mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current inline-block flex-shrink-0" />
                  {child}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (block.view === 'cards') {
    const cols = block.gridCols ?? (block.topics.length <= 2 ? 2 : 3);
    return (
      <div className="mt-6 w-full" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {block.topics.map((t, idx) => (
          <div key={t.id}
            className="rounded-2xl p-5 flex flex-col gap-2 transition-all duration-300"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'default' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <div className="font-bold font-heading" style={{ fontSize: '2rem', lineHeight: 1, color: 'var(--primary)', opacity: 0.4 }}>
              {String(idx + 1).padStart(2, '0')}
            </div>
            <div className="font-semibold text-base leading-snug" style={{ color: 'var(--foreground)' }}>{t.text}</div>
            {t.children?.map((child, ci) => (
              <div key={ci} className="flex items-start gap-1.5 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-current inline-block flex-shrink-0 mt-1.5" />
                {child}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (block.view === 'sequence') {
    return (
      <div className="flex flex-wrap items-start justify-center gap-2 mt-8 w-full">
        {block.topics.map((t, idx) => (
          <React.Fragment key={t.id}>
            <div className="flex flex-col items-center text-center gap-2" style={{ maxWidth: '160px' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                {idx + 1}
              </div>
              <div className="text-sm font-semibold leading-snug" style={{ color: 'var(--foreground)' }}>{t.text}</div>
              {t.children?.map((child, ci) => (
                <div key={ci} className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{child}</div>
              ))}
            </div>
            {idx < block.topics.length - 1 && (
              <div style={{ paddingTop: '0.9rem' }}>
                <ArrowRight className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary)', opacity: 0.35 }} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return null;
}

// ─── Stage Element (Right-column visual) ───────────────────────────────────

function StageElement({ style }: { style?: string }) {
  if (style === 'mockup') return <V8Mock />;
  
  if (style === 'layers') return (
    <div className="w-full aspect-[4/3] rounded-[var(--radius-lg)] flex items-center justify-center group"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="relative w-48 h-48 group-hover:scale-110 transition-transform duration-700">
        <div className="absolute inset-0 rounded-xl transform translate-x-8 -translate-y-8" style={{ background: 'var(--primary)', opacity: 0.15 }} />
        <div className="absolute inset-x-0 inset-y-4 rounded-xl transform translate-x-4 -translate-y-4" style={{ background: 'var(--primary)', opacity: 0.35 }} />
        <div className="absolute inset-y-8 inset-x-0 rounded-xl border" style={{ background: 'var(--primary)', opacity: 0.75, borderColor: 'var(--border)' }} />
      </div>
    </div>
  );

  return null;
}

// ─── Slide Visual ──────────────────────────────────────────────────────────────

function SlideVisual({ slide }: { slide: SlideData }) {
  const isLayers = slide.bgStyle === 'layers';
  const isMockup = slide.bgStyle === 'mockup';
  const hasObject = isLayers || isMockup;

  const Badge = ({ text }: { text: string }) => (
    <div className="mb-6 flex">
      <span className="text-xs font-bold tracking-[0.15em] uppercase px-4 py-2 rounded-full"
        style={{ color: 'var(--primary)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {text}
      </span>
    </div>
  );

  const textCol = (
    <div className={`flex flex-col ${slide.layout === 'center' ? 'items-center text-center' : ''}`}>
      {slide.badge && <Badge text={slide.badge} />}
      
      {slide.type === 'cover' ? (
        <>
          <h1 className="font-bold tracking-tighter mb-6 font-heading leading-tight"
            style={{ fontSize: getDynamicFontSize(slide.title, 'cover-title'), color: 'var(--foreground)' }}>
            {slide.title}
          </h1>
          <p className="font-medium max-w-4xl leading-relaxed"
            style={{ fontSize: getDynamicFontSize(slide.subtitle, 'cover-subtitle'), color: 'var(--muted-foreground)' }}>
            {slide.subtitle}
          </p>
        </>
      ) : slide.type === 'part' ? (
        <>
          <h1 className="font-bold tracking-[0.2em] mb-4 font-heading uppercase"
            style={{ fontSize: getDynamicFontSize(slide.title, 'part-title'), color: 'var(--primary)', opacity: 0.7 }}>
            {slide.title}
          </h1>
          <p className="font-bold tracking-tight leading-tight"
            style={{ fontSize: getDynamicFontSize(slide.subtitle, 'part-subtitle'), color: 'var(--foreground)' }}>
            {slide.subtitle}
          </p>
        </>
      ) : (
        <>
          <h2 className={`font-bold tracking-tight mb-4 leading-tight font-heading ${slide.layout === 'center' ? 'max-w-4xl' : ''}`}
            style={{ fontSize: getDynamicFontSize(slide.title, 'generic-title'), color: 'var(--foreground)' }}>
            {slide.title}
          </h2>
          {slide.content && (
            <p className={`font-medium mb-6 leading-relaxed ${slide.layout === 'center' ? 'max-w-3xl' : ''}`}
              style={{ fontSize: getDynamicFontSize(slide.content, 'generic-content'), color: 'var(--muted-foreground)' }}>
              {slide.content}
            </p>
          )}
          {slide.topicBlock && (
            <div className={`w-full ${slide.layout === 'center' ? 'flex justify-center max-w-4xl text-left' : ''}`}>
              <TopicBlockRenderer block={slide.topicBlock} />
            </div>
          )}
        </>
      )}
    </div>
  );

  const stageCol = hasObject ? (
    <div className={`relative w-full ${slide.layout === 'center' ? 'mt-16 max-w-4xl mx-auto' : ''}`}>
      <StageElement style={slide.bgStyle} />
    </div>
  ) : null;

  if (slide.layout === 'center') {
    return (
      <div className="w-full">
        {textCol}
        {stageCol}
      </div>
    );
  }

  if (slide.layout === 'split-left') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {stageCol || <div className="hidden lg:block w-full" />}
        {textCol}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
      {textCol}
      {stageCol || <div className="hidden lg:block w-full" />}
    </div>
  );
}

// ─── Topic Block Editor (inside EditModal) ─────────────────────────────────────

type SetDraft = React.Dispatch<React.SetStateAction<ContentStore>>;

function TopicBlockEditor({ slideIndex, activeLang, draft, setDraft }: {
  slideIndex: number; activeLang: Lang; draft: ContentStore; setDraft: SetDraft;
}) {
  const block = draft[activeLang][slideIndex].topicBlock;
  if (!block) return null;

  const isFullView = VIEW_CONFIG[block.view].isFullWidth;
  const DENSITY = isFullView ? 6 : 7;
  const isDense = block.topics.length >= DENSITY;

  // Global updates (view structure, gridCols, icon) — synced across all langs
  const setVisual = (partial: Partial<TopicBlock>) => {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      for (const l of ALL_LANGS) {
        const block = next[l][slideIndex].topicBlock;
        if (block) Object.assign(block, partial);
      }
      return next;
    });
  };

  // Topic text — active lang only (translation happens on save)
  const setTopicText = (topicIdx: number, text: string) => {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      const topics = next[activeLang][slideIndex].topicBlock?.topics;
      if (topics?.[topicIdx]) topics[topicIdx].text = text;
      return next;
    });
  };

  // Add / remove topics — all langs (structure stays in sync)
  const addTopic = () => {
    const newId = `t_${Math.random().toString(36).slice(2, 8)}`;
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      for (const l of ALL_LANGS) {
        next[l][slideIndex].topicBlock?.topics.push({ id: newId, text: DEFAULT_TOPIC_TEXTS[l].topic });
      }
      return next;
    });
  };

  const removeTopic = (idx: number) => {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      for (const l of ALL_LANGS) next[l][slideIndex].topicBlock?.topics.splice(idx, 1);
      return next;
    });
  };

  const moveTopic = (idx: number, dir: -1 | 1) => {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      for (const l of ALL_LANGS) {
        const topics = next[l][slideIndex].topicBlock?.topics;
        if (!topics) continue;
        const to = idx + dir;
        if (to < 0 || to >= topics.length) continue;
        [topics[idx], topics[to]] = [topics[to], topics[idx]];
      }
      return next;
    });
  };

  // Children — active lang only
  const addChild = (topicIdx: number) => {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      const topic = next[activeLang][slideIndex].topicBlock?.topics[topicIdx];
      if (topic) { if (!topic.children) topic.children = []; topic.children.push(DEFAULT_TOPIC_TEXTS[activeLang].child); }
      return next;
    });
  };

  const setChildText = (topicIdx: number, ci: number, text: string) => {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      const topic = next[activeLang][slideIndex].topicBlock?.topics[topicIdx];
      if (topic?.children) topic.children[ci] = text;
      return next;
    });
  };

  const removeChild = (topicIdx: number, ci: number) => {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      const topic = next[activeLang][slideIndex].topicBlock?.topics[topicIdx];
      if (topic?.children) topic.children.splice(ci, 1);
      return next;
    });
  };

  const inputSt = { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' } as const;
  const btnSt = (active: boolean) => ({
    background: active ? 'var(--primary)' : 'var(--background)',
    color: active ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
    border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
  } as const);

  return (
    <div className="flex flex-col gap-5">

      {/* View selector */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Visualização</label>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(VIEW_CONFIG) as ViewType[]).map(v => {
            const ViewIcon = VIEW_CONFIG[v].icon;
            return (
              <button key={v} onClick={() => setVisual({ view: v })}
                className="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={btnSt(block.view === v)}>
                <ViewIcon className="w-5 h-5" />
                {VIEW_CONFIG[v].label}
              </button>
            )
          })}
        </div>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          {isFullView ? 'Ocupa largura total do slide.' : 'Aparece centralizado na coluna.'}
        </p>
      </div>

      {/* Grid cols (cards only) */}
      {block.view === 'cards' && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Colunas por linha</label>
          <div className="flex gap-2">
            {([2, 3, 4] as const).map(n => (
              <button key={n} onClick={() => setVisual({ gridCols: n })}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                style={btnSt((block.gridCols ?? 3) === n)}>
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Icon (list only) */}
      {block.view === 'list' && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Ícone dos tópicos</label>
          <div className="flex flex-wrap gap-2">
            {ICON_OPTIONS.map(opt => {
              const active = (block.icon ?? 'chevron-right') === opt.value;
              return (
                <button key={opt.value} title={opt.label} onClick={() => setVisual({ icon: opt.value })}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                  style={btnSt(active)}>
                  <opt.Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Topic list */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>
          Tópicos <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>({block.topics.length})</span>
        </label>

        <div className="flex flex-col gap-2">
          {block.topics.map((topic, idx) => (
            <div key={topic.id} className="flex flex-col gap-1.5 p-3 rounded-xl"
              style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>

              {/* Topic row */}
              <div className="flex gap-2 items-center">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveTopic(idx, -1)} disabled={idx === 0}
                    className="w-5 h-5 flex items-center justify-center rounded disabled:opacity-20"
                    style={{ color: 'var(--muted-foreground)' }}>
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button onClick={() => moveTopic(idx, 1)} disabled={idx === block.topics.length - 1}
                    className="w-5 h-5 flex items-center justify-center rounded disabled:opacity-20"
                    style={{ color: 'var(--muted-foreground)' }}>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                <input value={topic.text} onChange={e => setTopicText(idx, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-sm outline-none" style={inputSt} />
                <button onClick={() => addChild(idx)} title="Desdobrar tópico"
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                  style={{ color: 'var(--primary)', border: '1px dashed var(--primary)' }}>
                  <Plus className="w-3 h-3" />
                </button>
                <button onClick={() => removeTopic(idx)} disabled={block.topics.length <= 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:opacity-20"
                  style={{ color: 'var(--muted-foreground)' }}>
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {/* Children */}
              {topic.children?.map((child, ci) => (
                <div key={ci} className="flex gap-2 items-center ml-7">
                  <span className="text-xs flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>└</span>
                  <input value={child} onChange={e => setChildText(idx, ci, e.target.value)}
                    placeholder="sub-tópico…"
                    className="flex-1 px-2 py-1.5 rounded-lg text-xs outline-none" style={inputSt} />
                  <button onClick={() => removeChild(idx, ci)}
                    className="w-5 h-5 flex items-center justify-center rounded"
                    style={{ color: 'var(--muted-foreground)' }}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        <button onClick={addTopic}
          className="flex items-center gap-1 text-xs font-semibold py-1.5 px-3 rounded-lg w-fit transition-all"
          style={{ color: 'var(--primary)', border: '1px dashed var(--primary)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--primary) 8%, transparent)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <Plus className="w-3 h-3" /> Adicionar tópico
        </button>
      </div>

      {/* Density warning */}
      {isDense && (
        <div className="flex items-start gap-2 p-3 rounded-xl"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
          <p className="text-xs" style={{ color: '#f59e0b' }}>
            <strong>Slide denso.</strong> Considere mover alguns tópicos para um novo slide.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Edit Modal ────────────────────────────────────────────────────────────────

type SavingState = 'idle' | 'translating' | 'error';

function EditModal({ slideIndex, activeLang, content, onSave, onClose }: {
  slideIndex: number; activeLang: Lang; content: ContentStore;
  onSave: (updated: ContentStore) => void; onClose: () => void;
}) {
  const [draft, setDraft] = useState<ContentStore>(() => {
    const initial = JSON.parse(JSON.stringify(content)) as ContentStore;
    // Opção A: todo slide de conteúdo sempre tem topicBlock
    const contentTypes = ['generic', 'problem', 'solution', 'future'];
    for (const l of ALL_LANGS) {
      const slide = initial[l][slideIndex];
      if (contentTypes.includes(slide.type) && !slide.topicBlock) {
        const id1 = `t_${Math.random().toString(36).slice(2, 8)}`;
        slide.topicBlock = {
          view: 'list', icon: 'chevron-right',
          topics: [{ id: id1, text: DEFAULT_TOPIC_TEXTS[l as Lang].topic }],
        };
      }
    }
    return initial;
  });
  const [saving, setSaving] = useState<SavingState>('idle');

  const activeSlide = draft[activeLang][slideIndex];
  const isContentSlide = ['generic', 'problem', 'solution', 'future'].includes(activeSlide.type);

  const updateField = (field: keyof SlideData, value: string) => {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      (next[activeLang][slideIndex] as Record<string, unknown>)[field] = value;
      return next;
    });
  };

  const addTopicBlock = () => {
    const id1 = `t_${Math.random().toString(36).slice(2, 8)}`;
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      for (const l of ALL_LANGS) {
        next[l][slideIndex].topicBlock = {
          view: 'list', icon: 'chevron-right',
          topics: [{ id: id1, text: DEFAULT_TOPIC_TEXTS[l].topic }],
        };
      }
      return next;
    });
  };

  const handleSave = async () => {
    const src = draft[activeLang][slideIndex];
    const editedFields: Record<string, unknown> = {};
    if (src.title)    editedFields.title    = src.title;
    if (src.subtitle) editedFields.subtitle = src.subtitle;
    if (src.badge)    editedFields.badge    = src.badge;
    if (src.content)  editedFields.content  = src.content;
    if (src.topicBlock?.topics?.length) {
      editedFields.topics = src.topicBlock.topics.map(t => t.text);
    }

    const targetLangs = ALL_LANGS.filter(l => l !== activeLang);
    setSaving('translating');
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 12000);

    const next = JSON.parse(JSON.stringify(draft)) as ContentStore;
    try {
      const res = await fetch('/_api/pitch/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: editedFields, sourceLang: activeLang, targetLangs }),
        signal: ctrl.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        const { translations } = await res.json();
        for (const l of targetLangs) {
          if (!translations[l]) continue;
          const t = translations[l];
          const slide = next[l][slideIndex];
          if (t.title)    slide.title    = t.title;
          if (t.subtitle) slide.subtitle = t.subtitle;
          if (t.badge)    slide.badge    = t.badge;
          if (t.content)  slide.content  = t.content;
          if (t.topics && slide.topicBlock) {
            slide.topicBlock.topics = slide.topicBlock.topics.map((tp, i) => ({
              ...tp, text: (t.topics as string[])[i] ?? tp.text,
            }));
          }
        }
        setSaving('idle');
        onSave(next);
        onClose();
        return;
      }
    } catch { /* timeout */ }
    clearTimeout(timeout);
    setSaving('error');
    onSave(next);
    setTimeout(onClose, 1500);
  };

  const inputSt = { background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' } as const;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <h2 className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>Editar Slide {slideIndex + 1}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ color: 'var(--muted-foreground)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>{LANG_LABELS[activeLang]}</p>

          {/* Text fields */}
          <div className="flex flex-col gap-3">
            {activeSlide.badge !== undefined && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>badge</label>
                <input value={activeSlide.badge ?? ''} onChange={e => updateField('badge', e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputSt} />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>title</label>
              <input value={activeSlide.title} onChange={e => updateField('title', e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputSt} />
            </div>
            {activeSlide.subtitle !== undefined && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>subtitle</label>
                <input value={activeSlide.subtitle ?? ''} onChange={e => updateField('subtitle', e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputSt} />
              </div>
            )}
            {isContentSlide && activeSlide.content !== undefined && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>content</label>
                <textarea value={activeSlide.content ?? ''} onChange={e => updateField('content', e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none" style={inputSt} />
              </div>
            )}
          </div>

          {/* Settings Grid (Layout / Palco / Animação) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Layout Mestre</label>
              <div className="flex flex-col gap-2">
                {LAYOUT_OPTIONS.map(opt => {
                  const active = (draft.pt[slideIndex].layout ?? 'center') === opt.value;
                  const ThumbIcon = (opt as any).icon;
                  return (
                    <button key={opt.value}
                      onClick={() => setDraft(prev => { const next = JSON.parse(JSON.stringify(prev)) as ContentStore; for (const l of ALL_LANGS) next[l][slideIndex].layout = opt.value as any; return next; })}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all w-full text-left"
                      style={{ background: active ? 'var(--primary)' : 'var(--background)', color: active ? 'var(--primary-foreground)' : 'var(--muted-foreground)', border: active ? '1px solid var(--primary)' : '1px solid var(--border)' }}>
                      <ThumbIcon className={`w-4 h-4 text-center ${!active ? 'opacity-50' : ''}`} />{opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Estilo de Fundo/Palco</label>
              <div className="flex flex-col gap-2">
                {BG_OPTIONS.map(opt => {
                  const active = (draft.pt[slideIndex].bgStyle ?? 'solid') === opt.value;
                  const ThumbIcon = (opt as any).icon;
                  return (
                    <button key={opt.value}
                      onClick={() => setDraft(prev => { const next = JSON.parse(JSON.stringify(prev)) as ContentStore; for (const l of ALL_LANGS) next[l][slideIndex].bgStyle = opt.value as any; return next; })}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all w-full text-left"
                      style={{ background: active ? 'var(--primary)' : 'var(--background)', color: active ? 'var(--primary-foreground)' : 'var(--muted-foreground)', border: active ? '1px solid var(--primary)' : '1px solid var(--border)' }}>
                      <ThumbIcon className={`w-4 h-4 text-center ${!active ? 'opacity-50' : ''}`} />{opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Animação/Transição</label>
              <div className="flex flex-col gap-2">
                {ANIM_OPTIONS.map(opt => {
                  const active = (draft.pt[slideIndex].animation ?? 'none') === opt.value;
                  const ThumbIcon = (opt as any).icon;
                  return (
                    <button key={opt.value}
                      onClick={() => setDraft(prev => { const next = JSON.parse(JSON.stringify(prev)) as ContentStore; for (const l of ALL_LANGS) next[l][slideIndex].animation = opt.value as any; return next; })}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all w-full text-left"
                      style={{ background: active ? 'var(--primary)' : 'var(--background)', color: active ? 'var(--primary-foreground)' : 'var(--muted-foreground)', border: active ? '1px solid var(--primary)' : '1px solid var(--border)' }}>
                      <ThumbIcon className={`w-4 h-4 text-center ${!active ? 'opacity-50' : ''}`} />{opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Topic Block Editor — sempre visível em slides de conteúdo (Opção A) */}
          {isContentSlide && activeSlide.topicBlock && (
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--muted-foreground)' }}>Tópicos</p>
              <TopicBlockEditor slideIndex={slideIndex} activeLang={activeLang} draft={draft} setDraft={setDraft} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex flex-col gap-2 px-6 py-4 border-t"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <p className="text-xs" style={{ color: saving === 'error' ? '#f59e0b' : 'var(--muted-foreground)' }}>
            {saving === 'translating' && '⏳ Traduzindo automaticamente para EN e DE…'}
            {saving === 'error' && 'Problema na tradução. Salvo no idioma atual.'}
            {saving === 'idle' && `Editando em ${LANG_LABELS[activeLang]}. Outros idiomas são traduzidos ao salvar.`}
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} disabled={saving === 'translating'}
              className="px-5 py-2 rounded-lg text-sm font-medium"
              style={{ color: 'var(--foreground)', border: '1px solid var(--border)' }}>
              Cancelar
            </button>
            <button onClick={handleSave} disabled={saving === 'translating'}
              className="px-5 py-2 rounded-lg text-sm font-semibold"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              {saving === 'translating' ? 'Traduzindo…' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Add Slide Menu ────────────────────────────────────────────────────────────

function AddSlideMenu({ onAdd, onClose }: { onAdd: (tpl: typeof SLIDE_TEMPLATES[0]) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-sm rounded-2xl shadow-2xl p-5 flex flex-col gap-2"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>Adicionar slide</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full" style={{ color: 'var(--muted-foreground)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        {SLIDE_TEMPLATES.map(tpl => {
          const TemplateIcon = tpl.icon;
          return (
            <button key={tpl.label} onClick={() => { onAdd(tpl); onClose(); }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-all"
              style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
              <TemplateIcon className="w-5 h-5 opacity-60" style={{ color: 'var(--foreground)' }} />
              <span className="font-semibold text-sm">{tpl.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  );
}

// ─── Slide Content Safe Zone ──────────────────────────────────────────────────

function SlideContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col justify-center w-full max-w-[1400px] mx-auto px-10 xl:px-20 pt-28 pb-32 z-10 relative">
      <div className="w-full relative">
        {children}
      </div>
    </div>
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

  const [current, setCurrent]   = useState(0);
  const [lang, setLang]         = useState<Lang>('pt');
  const [isDark, setIsDark]     = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen]   = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);

  const slideList = content[lang];
  const slide     = slideList[current];

  const persist = (updated: ContentStore) => {
    setContent(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* quota */ }
  };

  const cycleLang = () => setLang(l => l === 'pt' ? 'en' : l === 'en' ? 'de' : 'pt');

  const moveUp = useCallback((idx: number) => {
    if (idx === 0) return;
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      for (const l of ALL_LANGS) [next[l][idx - 1], next[l][idx]] = [next[l][idx], next[l][idx - 1]];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* quota */ }
      setCurrent(idx - 1);
      return next;
    });
  }, []);

  const moveDown = useCallback((idx: number) => {
    setContent(prev => {
      if (idx >= prev.pt.length - 1) return prev;
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      for (const l of ALL_LANGS) [next[l][idx], next[l][idx + 1]] = [next[l][idx + 1], next[l][idx]];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* quota */ }
      setCurrent(idx + 1);
      return next;
    });
  }, []);

  const duplicateSlide = useCallback((idx: number) => {
    const newId = Date.now();
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      for (const l of ALL_LANGS) {
        const copy = { ...JSON.parse(JSON.stringify(next[l][idx])), id: newId };
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
    const newId = Date.now();
    const made = tpl.make(newId);
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ContentStore;
      for (const l of ALL_LANGS) next[l].splice(current + 1, 0, made[l]);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* quota */ }
      setCurrent(current + 1);
      return next;
    });
  }, [current]);

  return (
    <div className={isDark ? 'dark' : ''} style={{ colorScheme: isDark ? 'dark' : 'light' }}>
      <div className="min-h-screen w-full flex" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>

        {/* ── Slide Panel ── */}
        {panelOpen && (
          <div className="w-56 flex-shrink-0 border-r flex flex-col" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Slides</span>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{slideList.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {slideList.map((s, idx) => (
                <div key={s.id}
                  className="group flex items-center gap-1 px-2 py-1.5 mx-2 my-0.5 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: idx === current ? 'color-mix(in srgb, var(--primary) 12%, transparent)' : 'transparent',
                    borderLeft: `2px solid ${idx === current ? 'var(--primary)' : 'transparent'}`,
                  }}
                  onClick={() => setCurrent(idx)}>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate" style={{ color: idx === current ? 'var(--primary)' : 'var(--foreground)' }}>
                      {idx + 1}. {s.title}
                    </div>
                    <div className="text-[10px] flex items-center gap-1 mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                      <span>{s.type}</span>
                      {s.topicBlock && (
                        <>
                          <span className="opacity-40">•</span>
                          {React.createElement(VIEW_CONFIG[s.topicBlock.view].icon, { className: "w-3 h-3 opacity-60" })}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {[
                      { title: '↑', action: () => moveUp(idx),        disabled: idx === 0,                  Icon: ChevronUp   },
                      { title: '↓', action: () => moveDown(idx),      disabled: idx === slideList.length-1, Icon: ChevronDown },
                      { title: '⧉', action: () => duplicateSlide(idx), disabled: false,                     Icon: Copy        },
                      { title: '✕', action: () => deleteSlide(idx),   disabled: slideList.length <= 1,      Icon: Trash2      },
                    ].map(({ title, action, disabled, Icon }) => (
                      <button key={title} onClick={e => { e.stopPropagation(); action(); }} disabled={disabled} title={title}
                        className="w-5 h-5 flex items-center justify-center rounded transition-colors disabled:opacity-20"
                        style={{ color: 'var(--muted-foreground)' }}>
                        <Icon className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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

        {/* ── Main Area ── */}
        <div className="flex-1 relative overflow-hidden flex flex-col min-h-screen">

          {/* Ambient Background Engine */}
          {slide.bgStyle === 'glow' && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
              <div className={`w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full blur-[120px] opacity-10 animate-pulse transition-transform duration-1000 ${slide.layout === 'split-right' ? 'translate-x-1/4' : slide.layout === 'split-left' ? '-translate-x-1/4' : ''}`}
                style={{ background: 'var(--primary)' }} />
            </div>
          )}
          {slide.bgStyle === 'grid' && (
            <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000" style={{
              backgroundImage: 'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
              backgroundSize: '4rem 4rem',
              opacity: 0.15,
              maskImage: `radial-gradient(ellipse at ${slide.layout === 'split-right' ? '70% 50%' : slide.layout === 'split-left' ? '30% 50%' : 'center'}, black 40%, transparent 80%)`
            }} />
          )}

          {/* Top bar (Fora da Safe Zone) */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-50">
            <button onClick={() => setPanelOpen(p => !p)}
              className="px-3 h-8 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}>
              <Layers className="w-3 h-3" /> {panelOpen ? 'Ocultar' : 'Slides'}
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditOpen(true)}
                className="px-4 h-9 rounded-full flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                <Pencil className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} /> Editar slide
              </button>
              <button onClick={cycleLang}
                className="px-4 h-9 rounded-full flex items-center gap-2 text-sm font-medium uppercase"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                <Globe className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} /> {lang}
              </button>
              <button onClick={() => setIsDark(d => !d)}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Slide Content Safe Zone */}
          <SlideContentWrapper>
            <div key={`${current}-${lang}-${slide.animation}`} className={`w-full ${
              slide.animation === 'fade' ? 'animate-in fade-in duration-700 ease-out' :
              slide.animation === 'slide-up' ? 'animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out' :
              slide.animation === 'zoom' ? 'animate-in fade-in zoom-in-95 duration-700 ease-out' : ''
            }`}>
              <SlideVisual slide={slide} />
            </div>
          </SlideContentWrapper>

          {/* Nav (Fora da Safe Zone) */}
          <div className="absolute bottom-8 left-6 right-6 flex justify-between items-center z-50">
            <div className="flex gap-2">
              {slideList.map((_, idx) => (
                <button key={idx} onClick={() => setCurrent(idx)}
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ width: idx === current ? '2rem' : '0.5rem', background: idx === current ? 'var(--primary)' : 'var(--border)' }} />
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
          onSave={updated => { persist(updated); setEditOpen(false); }}
          onClose={() => setEditOpen(false)} />
      )}
      {addOpen && <AddSlideMenu onAdd={addSlide} onClose={() => setAddOpen(false)} />}
    </div>
  );
}
