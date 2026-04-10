/**
 * ═══════════════════════════════════════════════════════════════
 * ADAPTA CORESTUDIO — Brand Hub
 * ═══════════════════════════════════════════════════════════════
 *
 * Casa do Core da Marca Adapta.
 * Referência institucional técnica, documental e responsiva.
 * Diretrizes · Cartilha Cromática v2026.2 · Guidelines
 */

import { Helmet } from "react-helmet";
import { useTheme } from "../utils/theme-context";
import { colorPalette } from "../utils/color-data";
import { useThemeMode } from "../helpers/themeMode";
import { 
  Shield, 
  Fingerprint, 
  BookOpen, 
  Type, 
  Hexagon, 
  Layers, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  XOctagon, 
  Target, 
  Monitor, 
  Share2, 
  FileText,
  Sun,
  Moon
} from "lucide-react";

// ─── Logos Inline ──────────────────────────────────────────────

const LogoDark = () => (
  <svg width="80" height="80" viewBox="0 0 263.76 280.36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g><path d="M263.76,74.72v130.91c0,3.33-1.77,6.41-4.65,8.09l-112.39,65.37c-2.91,1.69-6.5,1.69-9.41,0L24.97,213.73c-2.88-1.68-4.65-4.76-4.65-8.09V74.74c0-3.33,1.77-6.41,4.65-8.09L137.36,1.27c2.91-1.69,6.5-1.69,9.41,0l112.33,65.36c2.88,1.68,4.65,4.76,4.65,8.09Z" fill="#DFEDD8"/></g>
    <g><polygon points="92.99 149.38 71.29 149.38 71.28 170.56 53.51 170.56 53.51 149.39 31.81 149.38 31.81 132.67 53.5 132.67 53.51 111.38 71.28 111.38 71.29 132.67 92.99 132.67 92.99 149.38" fill="#657570"/></g>
    <g>
      <path d="M155.31,82.59h-18.84l-4.8.22c-2.98.61-5.76,1.7-8.34,3.25-4.25,2.56-7.31,6.35-9.16,11.36l-29.85,81.4-6.95,18.94h28.61l7.21-21.18h48.58l6.9,21.18h29.12l-42.48-115.17ZM120.23,153.85l15.54-45.64c.09-.54.33-.97.71-1.29.38-.34.86-.5,1.41-.5s1,.14,1.38.41c.39.27.69.73.9,1.38l14.56,45.64h-34.5Z" fill="#19302A"/>
      <path d="M204.76,197.77c3.83-.97,7.56-2.27,11.16-3.98,11.8-5.47,20.92-15.05,25.65-27.18,2.83-6.82,3.93-13.93,4.52-21.37v-7.89c-.48-7.36-1.75-14.62-4.51-21.59-4.99-12.62-14.57-22.41-27.01-27.82-6.94-3.01-14.2-4.61-21.8-5.34h-37.46l42.48,115.16M220.83,152.29c-2.41,9.51-8.82,17.04-17.82,20.87-4.08,1.74-8.57,3.1-12.98,3.56l-26.31-71.33,22.29.41c5.67.01,11.07,1.06,16.25,3.14,9.33,3.74,15.99,11.4,18.51,21.14,1.89,7.3,1.91,14.9.06,22.21Z" fill="#19302A"/>
    </g>
  </svg>
);

const LogoLight = () => (
  <svg width="80" height="80" viewBox="0 0 263.76 280.36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g><path d="M263.76,74.72v130.91c0,3.33-1.77,6.41-4.65,8.09l-112.39,65.37c-2.91,1.69-6.5,1.69-9.41,0L24.97,213.73c-2.88-1.68-4.65-4.76-4.65-8.09V74.74c0-3.33,1.77-6.41,4.65-8.09L137.36,1.27c2.91-1.69,6.5-1.69,9.41,0l112.33,65.36c2.88,1.68,4.65,4.76,4.65,8.09Z" fill="#19302A"/></g>
    <g><polygon points="92.99 149.38 71.29 149.38 71.28 170.56 53.51 170.56 53.51 149.39 31.81 149.38 31.81 132.67 53.5 132.67 53.51 111.38 71.28 111.38 71.29 132.67 92.99 132.67 92.99 149.38" fill="#EFF7E0"/></g>
    <g>
      <path d="M155.31,82.59h-18.84l-4.8.22c-2.98.61-5.76,1.7-8.34,3.25-4.25,2.56-7.31,6.35-9.16,11.36l-29.85,81.4-6.95,18.94h28.61l7.21-21.18h48.58l6.9,21.18h29.12l-42.48-115.17ZM120.23,153.85l15.54-45.64c.09-.54.33-.97.71-1.29.38-.34.86-.5,1.41-.5s1,.14,1.38.41c.39.27.69.73.9,1.38l14.56,45.64h-34.5Z" fill="#F7FBF0"/>
      <path d="M204.76,197.77c3.83-.97,7.56-2.27,11.16-3.98,11.8-5.47,20.92-15.05,25.65-27.18,2.83-6.82,3.93-13.93,4.52-21.37v-7.89c-.48-7.36-1.75-14.62-4.51-21.59-4.99-12.62-14.57-22.41-27.01-27.82-6.94-3.01-14.2-4.61-21.8-5.34h-37.46l42.48,115.16M220.83,152.29c-2.41,9.51-8.82,17.04-17.82,20.87-4.08,1.74-8.57,3.1-12.98,3.56l-26.31-71.33,22.29.41c5.67.01,11.07,1.06,16.25,3.14,9.33,3.74,15.99,11.4,18.51,21.14,1.89,7.3,1.91,14.9.06,22.21Z" fill="#F7FBF0"/>
    </g>
  </svg>
);

// ─── Document Components ───────────────────────────────────────

/**
 * Section title with a document-style anchor format.
 * Ex: [01.00] LOGO SYSTEM
 */
function DocSectionHeader({ id, number, title }: { id: string, number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mt-16 mb-8 border-b border-white/10 pb-4">
      <div className="bg-[#19302A] text-[#DFEDD8] font-mono text-[10px] font-bold px-2 py-1 rounded">
        {number}
      </div>
      <h2 id={id} className="text-sm font-bold tracking-widest uppercase text-white/90 m-0">
        {title}
      </h2>
    </div>
  );
}

/**
 * Color swatch for the technical palette view.
 */
function ColorSwatch({ hex, name, level }: { hex: string; name: string; level: string }) {
  const isLight = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  };
  const textColor = isLight(hex) ? "#1A231D" : "#F2F8EA";

  return (
    <div className="group flex flex-col border border-white/5 rounded-md overflow-hidden bg-[#141A17] hover:border-white/20 transition-colors">
      <div 
        className="h-14 w-full flex items-end p-2 transition-transform origin-bottom" 
        style={{ background: hex }}
      >
        <span 
          className="text-[9px] font-mono font-bold tracking-wider opacity-60 mix-blend-normal"
          style={{ color: textColor }}
        >
          {level}
        </span>
      </div>
      <div className="p-3">
        <div className="text-[11px] font-bold text-white/90 truncate mb-1">
          {name}
        </div>
        <div className="text-[10px] font-mono text-white/40 tracking-wider">
          {hex.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

/**
 * Strict Document Rule Card (No emojis, functional)
 */
function RuleBlock({ 
  icon: Icon, 
  title, 
  description, 
  approved, 
  prohibited 
}: {
  icon: any;
  title: string;
  description?: string;
  approved?: string[];
  prohibited?: string[];
}) {
  return (
    <div className="flex flex-col bg-[#141A17] border border-white/10 rounded-lg p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/5 border border-white/5 text-white/60">
          <Icon size={16} strokeWidth={1.5} />
        </div>
        <h4 className="text-xs font-bold text-white/90 uppercase tracking-widest m-0">{title}</h4>
      </div>
      
      {description && (
        <p className="text-xs text-white/60 mb-5 leading-relaxed">{description}</p>
      )}

      {approved && approved.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] font-bold text-[#619B7F] mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={12} strokeWidth={2} /> Uso Aprovado
          </div>
          <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
            {approved.map((item, i) => (
              <li key={i} className="text-[11px] text-white/70 flex items-start gap-2">
                <span className="text-[#619B7F] mt-0.5 opacity-50">›</span> {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {prohibited && prohibited.length > 0 && (
        <div className="mt-auto pt-2">
          <div className="text-[10px] font-bold text-[#F37A63] mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <XOctagon size={12} strokeWidth={2} /> Uso Restrito
          </div>
          <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
            {prohibited.map((item, i) => (
              <li key={i} className="text-[11px] text-white/50 flex items-start gap-2">
                <span className="text-[#F37A63] mt-0.5 opacity-40">›</span> {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────

export default function Brand() {
  const { isDark, t } = useTheme();
  const { mode, switchToDarkMode, switchToLightMode } = useThemeMode();

  // Extract from master palette
  const cartilhaFamilias = colorPalette.map((group) => ({
    name: group.name,
    description: group.description || "",
    colors: group.colors.map((c) => ({
      hex: c.hex,
      name: c.name,
      level: c.level || c.hex,
    })),
  }));

  const logoVariants = [
    {
      id: "dark",
      label: "Variant: Dark Context",
      bg: "#141A17",
      description: "Primary configuration for use over dark background tones.",
      component: <LogoDark />,
      spec: "Hexagon: #DFEDD8 · Type: #19302A",
    },
    {
      id: "light",
      label: "Variant: Light Context",
      bg: "#F2F8EA",
      description: "Configuration tailored for off-white and light brand backgrounds.",
      component: <LogoLight />,
      spec: "Hexagon: #19302A · Type: #EFF7E0",
    },
    {
      id: "mono",
      label: "Variant: Monochrome (Positive)",
      bg: "#FFFFFF",
      description: "High-contrast structural format. Reserved for strict print environments.",
      component: (
        <svg width="80" height="80" viewBox="0 0 263.76 280.36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g><path d="M263.76,74.72v130.91c0,3.33-1.77,6.41-4.65,8.09l-112.39,65.37c-2.91,1.69-6.5,1.69-9.41,0L24.97,213.73c-2.88-1.68-4.65-4.76-4.65-8.09V74.74c0-3.33,1.77-6.41,4.65-8.09L137.36,1.27c2.91-1.69,6.5-1.69,9.41,0l112.33,65.36c2.88,1.68,4.65,4.76,4.65,8.09Z" fill="#19302A"/></g>
          <g><polygon points="92.99 149.38 71.29 149.38 71.28 170.56 53.51 170.56 53.51 149.39 31.81 149.38 31.81 132.67 53.5 132.67 53.51 111.38 71.28 111.38 71.29 132.67 92.99 132.67 92.99 149.38" fill="#FFFFFF"/></g>
          <g>
             <path d="M155.31,82.59h-18.84l-4.8.22c-2.98.61-5.76,1.7-8.34,3.25-4.25,2.56-7.31,6.35-9.16,11.36l-29.85,81.4-6.95,18.94h28.61l7.21-21.18h48.58l6.9,21.18h29.12l-42.48-115.17ZM120.23,153.85l15.54-45.64c.09-.54.33-.97.71-1.29.38-.34.86-.5,1.41-.5s1,.14,1.38.41c.39.27.69.73.9,1.38l14.56,45.64h-34.5Z" fill="#FFFFFF"/>
             <path d="M204.76,197.77c3.83-.97,7.56-2.27,11.16-3.98,11.8-5.47,20.92-15.05,25.65-27.18,2.83-6.82,3.93-13.93,4.52-21.37v-7.89c-.48-7.36-1.75-14.62-4.51-21.59-4.99-12.62-14.57-22.41-27.01-27.82-6.94-3.01-14.2-4.61-21.8-5.34h-37.46l42.48,115.16M220.83,152.29c-2.41,9.51-8.82,17.04-17.82,20.87-4.08,1.74-8.57,3.1-12.98,3.56l-26.31-71.33,22.29.41c5.67.01,11.07,1.06,16.25,3.14,9.33,3.74,15.99,11.4,18.51,21.14,1.89,7.3,1.91,14.9.06,22.21Z" fill="#FFFFFF"/>
          </g>
        </svg>
      ),
      spec: "Single color: #19302A or #000000",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 font-sans">
      <Helmet>
        <title>Brand Reference | Adapta CoreStudio</title>
      </Helmet>

      {/* ── Document Lead ───────────────────────────────────────── */}
      <div 
        className="mb-14 border-l-2 pl-5 md:pl-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6"
        style={{ borderColor: t.border }}
      >
        <div>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen size={20} strokeWidth={1.5} style={{ color: t.textFaint }} />
            <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: t.textMuted }}>Protocol: v2026.2</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3" style={{ color: t.text }}>
            Adapta Brand Architecture
          </h1>
          <p className="text-sm md:text-base max-w-2xl leading-relaxed m-0" style={{ color: t.textMuted }}>
            Repositório central de documentação funcional da identidade Adapta. 
            Este documento define a cartilha cromática exata, proporções estruturais do logo e a persona verbal obrigatória, operando como única fonte de verdade para ativos institucionais.
          </p>
        </div>
        
        {/* Toggle Theme Panel */}
        <div className="bg-[#141A17] border border-white/10 rounded-lg p-4 shrink-0 flex flex-col gap-3 min-w-[200px]">
          <div className="text-[9px] font-mono text-white/40 tracking-widest uppercase mb-1">
            Environment Context
          </div>
          <div className="flex items-center bg-white/5 rounded p-1 border border-white/5">
            <button
              onClick={() => switchToLightMode()}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded text-xs font-bold transition-all ${
                !isDark 
                  ? "bg-[#619B7F] text-white shadow-sm" 
                  : "text-white/40 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              <Sun size={14} strokeWidth={2} />
              Light
            </button>
            <button
              onClick={() => switchToDarkMode()}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded text-xs font-bold transition-all ${
                isDark 
                  ? "bg-[#141A17] text-[#DFEDD8] border border-[#619B7F]/30 shadow-sm" 
                  : "text-white/40 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              <Moon size={14} strokeWidth={2} />
              Dark
            </button>
          </div>
        </div>
      </div>

      {/* ── [01.00] LOGO & TOPOGRAPHY ────────────────────────────── */}
      <section id="identidade" className="mb-20">
        <div className="flex items-center gap-3 mt-16 mb-8 border-b pb-4" style={{ borderColor: t.line }}>
          <div className="bg-[#19302A] text-[#DFEDD8] font-mono text-[10px] font-bold px-2 py-1 rounded">
            01.00
          </div>
          <h2 id="01.00" className="text-sm font-bold tracking-widest uppercase m-0" style={{ color: t.text }}>
            Logo System & Topography
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {logoVariants.map((v) => (
            <div key={v.id} className="flex flex-col bg-[#141A17] border border-white/10 rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-center p-8 min-h-[160px] border-b border-white/5"
                style={{ background: v.bg }}
              >
                {v.component}
              </div>
              <div className="p-4">
                <div className="text-xs font-bold text-white/90 mb-1">{v.label}</div>
                <div className="text-[10px] font-mono text-white/40 mb-3">{v.spec}</div>
                <p className="text-[11px] text-white/60 leading-relaxed m-0">
                  {v.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Structural Specs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#141A17] border border-white/10 rounded-lg p-5 flex gap-4">
            <Hexagon size={24} className="text-white/30 shrink-0 mt-1" strokeWidth={1.5} />
            <div>
              <h4 className="text-xs font-bold text-white/90 mb-1">Geometria e Proporção</h4>
              <p className="text-[11px] text-white/60 leading-relaxed">
                A marca é estruturada no <strong>Hexágono regular</strong>, refletindo precisão e biologia. 
                A área ocupada pela sigla 'AD' preenche harmonicamente ~40% da área útil interna do elemento, onde a letra 'A' comporta um recorte medicinal transversal.
              </p>
            </div>
          </div>
          
          <div className="bg-[#141A17] border border-white/10 rounded-lg p-5 flex gap-4">
            <Layers size={24} className="text-white/30 shrink-0 mt-1" strokeWidth={1.5} />
            <div>
              <h4 className="text-xs font-bold text-white/90 mb-1">Margem e Zona de Proteção</h4>
              <p className="text-[11px] text-white/60 leading-relaxed">
                Todo respiro externo ao redor do hexágono deve equivaler a no mínimo <strong>50% da largura total</strong> da própria forma principal. Componentes adjacentes não podem invadir este raio delimitado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── [02.00] TYPOGRAPHY ───────────────────────────────────── */}
      <section id="tipografia" className="mb-20">
        <div className="flex items-center gap-3 mt-16 mb-8 border-b pb-4" style={{ borderColor: t.line }}>
          <div className="bg-[#19302A] text-[#DFEDD8] font-mono text-[10px] font-bold px-2 py-1 rounded">
            02.00
          </div>
          <h2 id="02.00" className="text-sm font-bold tracking-widest uppercase m-0" style={{ color: t.text }}>
            Typography Definition
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Geist */}
          <div className="bg-[#141A17] border border-white/10 rounded-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-[10px] font-bold tracking-widest text-[#619B7F] uppercase mb-1">Type 01: Principal</div>
                <div className="text-xl font-bold text-white/90 font-sans tracking-tight">Geist Sans</div>
              </div>
              <Type size={20} className="text-white/20" strokeWidth={1.5} />
            </div>
            
            <div className="text-4xl font-extrabold text-white/90 leading-none mb-6 font-['Geist'] tracking-tight">
              Aa Bb Cc 123
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <div className="text-[10px] text-white/40 font-mono tracking-wider mb-1">ROLE</div>
                <div className="text-xs text-white/70">Títulos & Identidade Digital</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40 font-mono tracking-wider mb-1">WEIGHTS</div>
                <div className="text-xs text-white/70">Regular, SemiBold, ExtraBold</div>
              </div>
            </div>
          </div>

          {/* Inter */}
          <div className="bg-[#141A17] border border-white/10 rounded-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-[10px] font-bold tracking-widest text-white/50 uppercase mb-1">Type 02: Suporte</div>
                <div className="text-xl font-bold text-white/90 font-['Inter']">Inter</div>
              </div>
              <FileText size={20} className="text-white/20" strokeWidth={1.5} />
            </div>
            
            <div className="text-4xl font-normal text-white/90 leading-none mb-6 font-['Inter']">
              Aa Bb Cc 456
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <div className="text-[10px] text-white/40 font-mono tracking-wider mb-1">ROLE</div>
                <div className="text-xs text-white/70">Interface corporativa & Leitura</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40 font-mono tracking-wider mb-1">WEIGHTS</div>
                <div className="text-xs text-white/70">Light, Regular, Medium</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── [03.00] CHROMATIC PALETTE ────────────────────────────── */}
      <section id="cartilha" className="mb-20">
        <div className="flex items-center gap-3 mt-16 mb-8 border-b pb-4" style={{ borderColor: t.line }}>
          <div className="bg-[#19302A] text-[#DFEDD8] font-mono text-[10px] font-bold px-2 py-1 rounded">
            03.00
          </div>
          <h2 id="03.00" className="text-sm font-bold tracking-widest uppercase m-0" style={{ color: t.text }}>
            Chromatic Logic v2026.2
          </h2>
        </div>
        
        <div className="w-full bg-[#19302A]/30 border border-[#19302A] rounded-md p-4 mb-8 flex items-start gap-4">
          <Fingerprint size={18} className="text-[#619B7F] shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-xs leading-relaxed m-0" style={{ color: t.text }}>
              O sistema baseia-se em <strong>39 variáveis exatas mapeadas em 5 constelações/famílias</strong>. 
              Para manter o integrity score, nenhuma variação externa é permitida.
              Softwares auditores rejeitarão correspondências cuja diferença de percepção (<span className="font-mono">ΔE</span>) ultrapasse uma margem de compressão de tolerância.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-12">
          {cartilhaFamilias.map((family) => (
            <div key={family.name}>
              <div className="mb-4">
                <h3 className="text-sm font-bold m-0" style={{ color: t.text }}>{family.name}</h3>
                <p className="text-[11px] mt-1 mb-0 max-w-2xl" style={{ color: t.textMuted }}>{family.description}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-10 gap-3">
                {family.colors.map((color) => (
                  <ColorSwatch
                    key={color.hex}
                    hex={color.hex}
                    name={color.name}
                    level={color.level || ""}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── [04.00] PROTOCOLS ────────────────────────────────────── */}
      <section id="guidelines" className="mb-20">
        <div className="flex items-center gap-3 mt-16 mb-8 border-b pb-4" style={{ borderColor: t.line }}>
          <div className="bg-[#19302A] text-[#DFEDD8] font-mono text-[10px] font-bold px-2 py-1 rounded">
            04.00
          </div>
          <h2 id="04.00" className="text-sm font-bold tracking-widest uppercase m-0" style={{ color: t.text }}>
            Usage Protocols
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <RuleBlock 
            icon={Target}
            title="Institutional Layer"
            description="Para documentação de alto nível corporativo, assinaturas, site oficial e software core."
            approved={[
              "Neutral System base",
              "OG Hybrid Blend highlights",
              "Tipografia monocromática"
            ]}
            prohibited={[
              "Uso de Linalool Sky (Azuis)",
              "Uso de Myrcene Soul (Laranjas)",
              "Imagens com alto contraste artificial"
            ]}
          />

          <RuleBlock 
            icon={Share2}
            title="Campaign Actions"
            description="Peças temporárias para saúde preventiva. (Ex: Outubro Rosa, Novembro Azul)."
            approved={[
              "Linalool Sky (quando voltado à neuro/med masculina)",
              "Myrcene Soul (temas vibrantes, metabolismo)",
              "Integração da base Neutral obrigatória"
            ]}
            prohibited={[
              "Combinar múltiplas famílias simultaneamente",
              "Acentos da campanha ofuscando a assinatura Institucional"
            ]}
          />

          <RuleBlock 
            icon={Monitor}
            title="Digital Ecosystem"
            description="Diretrizes para distribuição em redes sociais, aplicativos web e publicações breves."
            approved={[
              "Bordas e limites bem definidos (glassmorphism contido)",
              "Uso moderado de cores quentes para engajamento",
              "Mínimo de contraste de texto garantido por WCAG AA"
            ]}
            prohibited={[
              "Fundos neon",
              "Filtros genéricos não padronizados em fotos",
              "Layouts desequilibrados (> 4 cores dominantes)"
            ]}
          />
        </div>

        {/* Brand Voice Layer */}
        <div className="flex items-center gap-3 mt-16 mb-8 border-b pb-4" style={{ borderColor: t.line }}>
          <div className="bg-[#19302A] text-[#DFEDD8] font-mono text-[10px] font-bold px-2 py-1 rounded">
            04.10
          </div>
          <h2 id="04.10" className="text-sm font-bold tracking-widest uppercase m-0" style={{ color: t.text }}>
            Communication Logic
          </h2>
        </div>
        
        <div className="bg-[#141A17] border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <MessageSquare size={18} className="text-white/40" strokeWidth={1.5} />
            <div>
              <h3 className="text-sm font-bold text-white/90 m-0">Protocolo de Engenharia Estratégica de Cuidado</h3>
              <p className="text-[11px] text-white/50 m-0 mt-1">Regras léxicas para sistemas, agentes assistentes (ex: IA de copy) e publicações redatoriais.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <div className="text-[10px] font-bold text-[#619B7F] mb-3 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={12} strokeWidth={2} /> Termos Homologados
              </div>
              <ul className="grid grid-cols-1 gap-2 m-0 p-0 list-none">
                {["Associado, Indivíduo, Membro, Família", "Acesso, Acolhimento, Suporte, Jornada", "Sistema, Inteligência, Protocolo, Tratamento", "Cuidado Sistêmico, Qualidade de vida, Bem-estar", "Ciência Endocanabinoide, Fitofármaco"].map(item => (
                  <li key={item} className="text-xs text-white/80 p-2 rounded bg-white/[0.02] border border-white/5 overflow-hidden text-ellipsis whitespace-nowrap">{item}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="text-[10px] font-bold text-[#F37A63] mb-3 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={12} strokeWidth={2} /> Bloqueio Léxico Comercial
              </div>
              <ul className="grid grid-cols-1 gap-2 m-0 p-0 list-none">
                {["Cliente, Consumidor, Comprador (Subst: Associado)", "Venda, Compra, Transação (Subst: Acesso/Repasse)", "Usuário no sentido pejorativo (Subst: Indivíduo)", "Desconto, Promoção, Saldo, Assinatura", "Droga (Apenas sentido farmacobotânico restrito)"].map(item => (
                  <li key={item} className="text-xs text-white/50 p-2 rounded bg-[#F37A63]/5 border border-[#F37A63]/10 overflow-hidden text-ellipsis whitespace-nowrap">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="mt-20 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-10 border-t" style={{ borderColor: t.line }}>
        <div className="flex items-center gap-3">
          <Shield size={14} strokeWidth={1.5} style={{ color: t.textFaint }} />
          <span className="text-[10px] font-mono tracking-wider" style={{ color: t.textFaint }}>ADAPTA SYSTEM :: SECURITY PROTOCOL SEC-A</span>
        </div>
        <div className="text-[10px] font-mono uppercase" style={{ color: t.textFaint }}>
          Build v2026.2.0 • Data Index 39.5
        </div>
      </footer>
    </div>
  );
}
