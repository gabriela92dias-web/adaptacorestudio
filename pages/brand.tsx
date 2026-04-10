import { Helmet } from "react-helmet";
import { useTheme } from "../utils/theme-context";
import { colorPalette } from "../utils/color-data";
import { useThemeMode } from "../helpers/themeMode";
import { 
  Shield, 
  Fingerprint, 
  Type, 
  Scale, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  XOctagon, 
  Target, 
  Share2, 
  FileText,
  Sun,
  Moon,
  MoveRight
} from "lucide-react";

// ─── Logos Inline ──────────────────────────────────────────────

const LogoDark = ({ className }: { className?: string }) => (
  <svg className={className} width="120" height="120" viewBox="0 0 263.76 280.36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g><path d="M263.76,74.72v130.91c0,3.33-1.77,6.41-4.65,8.09l-112.39,65.37c-2.91,1.69-6.5,1.69-9.41,0L24.97,213.73c-2.88-1.68-4.65-4.76-4.65-8.09V74.74c0-3.33,1.77-6.41,4.65-8.09L137.36,1.27c2.91-1.69,6.5-1.69,9.41,0l112.33,65.36c2.88,1.68,4.65,4.76,4.65,8.09Z" fill="#DFEDD8"/></g>
    <g><polygon points="92.99 149.38 71.29 149.38 71.28 170.56 53.51 170.56 53.51 149.39 31.81 149.38 31.81 132.67 53.5 132.67 53.51 111.38 71.28 111.38 71.29 132.67 92.99 132.67 92.99 149.38" fill="#657570"/></g>
    <g>
      <path d="M155.31,82.59h-18.84l-4.8.22c-2.98.61-5.76,1.7-8.34,3.25-4.25,2.56-7.31,6.35-9.16,11.36l-29.85,81.4-6.95,18.94h28.61l7.21-21.18h48.58l6.9,21.18h29.12l-42.48-115.17ZM120.23,153.85l15.54-45.64c.09-.54.33-.97.71-1.29.38-.34.86-.5,1.41-.5s1,.14,1.38.41c.39.27.69.73.9,1.38l14.56,45.64h-34.5Z" fill="#19302A"/>
      <path d="M204.76,197.77c3.83-.97,7.56-2.27,11.16-3.98,11.8-5.47,20.92-15.05,25.65-27.18,2.83-6.82,3.93-13.93,4.52-21.37v-7.89c-.48-7.36-1.75-14.62-4.51-21.59-4.99-12.62-14.57-22.41-27.01-27.82-6.94-3.01-14.2-4.61-21.8-5.34h-37.46l42.48,115.16M220.83,152.29c-2.41,9.51-8.82,17.04-17.82,20.87-4.08,1.74-8.57,3.1-12.98,3.56l-26.31-71.33,22.29.41c5.67.01,11.07,1.06,16.25,3.14,9.33,3.74,15.99,11.4,18.51,21.14,1.89,7.3,1.91,14.9.06,22.21Z" fill="#19302A"/>
    </g>
  </svg>
);

const LogoLight = ({ className }: { className?: string }) => (
  <svg className={className} width="80" height="80" viewBox="0 0 263.76 280.36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g><path d="M263.76,74.72v130.91c0,3.33-1.77,6.41-4.65,8.09l-112.39,65.37c-2.91,1.69-6.5,1.69-9.41,0L24.97,213.73c-2.88-1.68-4.65-4.76-4.65-8.09V74.74c0-3.33,1.77-6.41,4.65-8.09L137.36,1.27c2.91-1.69,6.5-1.69,9.41,0l112.33,65.36c2.88,1.68,4.65,4.76,4.65,8.09Z" fill="#19302A"/></g>
    <g><polygon points="92.99 149.38 71.29 149.38 71.28 170.56 53.51 170.56 53.51 149.39 31.81 149.38 31.81 132.67 53.5 132.67 53.51 111.38 71.28 111.38 71.29 132.67 92.99 132.67 92.99 149.38" fill="#EFF7E0"/></g>
    <g>
      <path d="M155.31,82.59h-18.84l-4.8.22c-2.98.61-5.76,1.7-8.34,3.25-4.25,2.56-7.31,6.35-9.16,11.36l-29.85,81.4-6.95,18.94h28.61l7.21-21.18h48.58l6.9,21.18h29.12l-42.48-115.17ZM120.23,153.85l15.54-45.64c.09-.54.33-.97.71-1.29.38-.34.86-.5,1.41-.5s1,.14,1.38.41c.39.27.69.73.9,1.38l14.56,45.64h-34.5Z" fill="#F7FBF0"/>
      <path d="M204.76,197.77c3.83-.97,7.56-2.27,11.16-3.98,11.8-5.47,20.92-15.05,25.65-27.18,2.83-6.82,3.93-13.93,4.52-21.37v-7.89c-.48-7.36-1.75-14.62-4.51-21.59-4.99-12.62-14.57-22.41-27.01-27.82-6.94-3.01-14.2-4.61-21.8-5.34h-37.46l42.48,115.16M220.83,152.29c-2.41,9.51-8.82,17.04-17.82,20.87-4.08,1.74-8.57,3.1-12.98,3.56l-26.31-71.33,22.29.41c5.67.01,11.07,1.06,16.25,3.14,9.33,3.74,15.99,11.4,18.51,21.14,1.89,7.3,1.91,14.9.06,22.21Z" fill="#F7FBF0"/>
    </g>
  </svg>
);

// ─── Helpers ───────────────────────────────────────────────────

function isLightColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

// ─── Document Components ───────────────────────────────────────

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
    <div className="flex flex-col bg-[#141A17] border border-white/10 rounded-3xl p-8 group">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/5 text-white/60 group-hover:bg-[#619B7F]/10 group-hover:text-[#619B7F] transition-all">
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <h4 className="text-sm font-bold text-white/90 uppercase tracking-widest m-0">{title}</h4>
      </div>
      
      {description && (
        <p className="text-sm text-white/50 mb-8 leading-relaxed font-light">{description}</p>
      )}

      {approved && approved.length > 0 && (
        <div className="mb-6">
          <div className="text-[10px] font-bold text-[#619B7F] mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={14} strokeWidth={2} /> Uso Aprovado
          </div>
          <ul className="flex flex-col gap-2 list-none p-0 m-0">
            {approved.map((item, i) => (
              <li key={i} className="text-xs text-white/70 flex items-start gap-2">
                <span className="text-[#619B7F] mt-0.5 opacity-50">›</span> {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {prohibited && prohibited.length > 0 && (
        <div className="mt-auto pt-4 border-t border-white/5">
          <div className="text-[10px] font-bold text-[#F37A63] mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <XOctagon size={14} strokeWidth={2} /> Uso Restrito
          </div>
          <ul className="flex flex-col gap-2 list-none p-0 m-0">
            {prohibited.map((item, i) => (
              <li key={i} className="text-xs text-white/50 flex items-start gap-2">
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

  return (
    <div className="w-full min-h-screen font-sans pb-32" style={{ backgroundColor: t.bg }}>
      <Helmet>
        <title>Brand Architecture | Adapta CoreStudio</title>
      </Helmet>

      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b bg-current/5" style={{ borderColor: t.line }}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 rounded flex items-center justify-center bg-[#19302A]">
              <Fingerprint size={14} className="text-[#DFEDD8]" />
            </div>
            <span className="font-mono text-[11px] font-bold tracking-widest uppercase" style={{ color: t.text }}>
              Brand Architecture Core
            </span>
          </div>
          
          <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 rounded-full p-1 border" style={{ borderColor: t.line }}>
            <button
              onClick={switchToLightMode}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${!isDark ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <Sun size={14} strokeWidth={2} />
            </button>
            <button
              onClick={switchToDarkMode}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDark ? 'bg-[#19302A] border border-[#619B7F]/30 shadow-sm text-white' : 'text-gray-500 hover:text-black'}`}
            >
              <Moon size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-6 md:px-12 mt-12">
        
        {/* ── Hero / Lead ───────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] p-10 md:p-20 mb-20 min-h-[60vh] flex flex-col justify-between group border border-black/5 dark:border-white/5">
          {/* Backgrounds */}
          <div className="absolute inset-0 bg-[#0A0D0B]" />
          <div className="absolute inset-0 opacity-40 transition-opacity duration-1000 group-hover:opacity-60" 
               style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #203A2E 0%, transparent 60%)' }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_40%,#000_60%,transparent_100%)]" />

          {/* Top meta */}
          <div className="relative z-10 flex items-center gap-3">
            <Shield className="text-[#619B7F]" size={20} strokeWidth={1.5} />
            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#A3B4AE] uppercase">
              Protocol: v2026.2.0 — Encrypted Core
            </span>
          </div>

          {/* Bottom Title */}
          <div className="relative z-10 mt-32 max-w-4xl">
            <h1 className="text-6xl sm:text-8xl md:text-[9rem] font-extrabold tracking-tighter text-white leading-[0.9] mb-8 mix-blend-screen">
              ADAPTA<span className="text-[#619B7F]">.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#A3B4AE] max-w-2xl leading-relaxed font-light">
              A documentação funcional e rigorosa da identidade visual. O epicentro de diretrizes matemáticas e semânticas da Engenharia Estratégica de Cuidado.
            </p>
          </div>
        </section>

        {/* ── 01. Logo Bento Box ──────────────────────────────────── */}
        <section className="mb-32">
          <div className="mb-12">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-[#19302A] text-[#DFEDD8] px-3 py-1.5 rounded-full inline-block mb-4">
              01.00 Matrix
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: t.text }}>
              Structural Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Monumental Dark Logo */}
            <div className="md:col-span-8 md:row-span-2 relative bg-[#141A17] rounded-[2rem] border border-black/5 dark:border-white/5 overflow-hidden group min-h-[500px] flex items-center justify-center isolation-auto overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
              <LogoDark className="scale-[1.5] sm:scale-[2] md:scale-[2.5] transition-transform duration-[1.5s] ease-out group-hover:scale-[2.6] opacity-90 group-hover:opacity-100" />
              
              <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 flex flex-col gap-2">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 w-max">
                  Primary Axis - Dark
                </span>
              </div>
              <div className="absolute top-8 right-8 text-[10px] text-white/20 font-mono text-right hidden sm:block">
                H: #DFEDD8 <br/> T: #19302A
              </div>
            </div>

            {/* Light Variant */}
            <div className="md:col-span-4 relative bg-[#F2F8EA] rounded-[2rem] overflow-hidden group min-h-[240px] flex items-center justify-center border border-black/5">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
              <LogoLight className="scale-150 transition-transform duration-700 ease-out group-hover:scale-125 mix-blend-multiply" />
              <div className="absolute top-6 left-6">
                <span className="text-[10px] font-mono text-black/50 uppercase tracking-widest">
                  Light Variant
                </span>
              </div>
            </div>

            {/* Micro Specs */}
            <div className="md:col-span-4 relative bg-[#0A0D0B] rounded-[2rem] p-8 md:p-10 border border-black/5 dark:border-white/5 flex flex-col justify-between group overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-50 transition-opacity">
                <Scale size={64} strokeWidth={1} className="text-white" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#619B7F] uppercase tracking-widest mb-6 block">
                  Geometria Base
                </span>
                <p className="text-white/80 font-light leading-relaxed mb-6">
                  Hexágono regular com interseção simétrica. O respiro de segurança ("clear space") deve equivaler a <strong>50%</strong> da largura radial do símbolo para proteção tátil.
                </p>
              </div>
              <div className="border-t border-white/10 pt-6">
                <span className="text-xs text-white/50 flex items-center gap-2 group-hover:text-white/80 transition-colors">
                  <MoveRight size={14}/> Strictly Mathematical
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* ── 02. Typographic Specimens ───────────────────────────── */}
        <section className="mb-32">
          <div className="mb-12">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-[#19302A] text-[#DFEDD8] px-3 py-1.5 rounded-full inline-block mb-4">
              02.00 Flow
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: t.text }}>
              Signatures & Types
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GEIST SANS */}
            <div className="bg-[#141A17] rounded-[2rem] border border-black/5 dark:border-white/5 p-8 md:p-14 relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-20 text-[20rem] font-black text-white/[0.02] font-['Geist'] leading-none select-none pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                Aa
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-16">
                  <div>
                    <h3 className="text-sm font-bold text-[#619B7F] tracking-widest uppercase mb-1">Títulos / Display</h3>
                    <p className="text-white/90 text-2xl md:text-3xl font-bold font-sans tracking-tight">Geist Sans</p>
                  </div>
                  <Type size={32} strokeWidth={1} className="text-white/20" />
                </div>
                
                <div className="mb-16">
                  <div className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tighter">
                    Abcd Efgh Ijkl<br/>
                    1234 5678
                  </div>
                  <p className="text-white/40 text-lg md:text-xl font-light leading-relaxed">The quick brown fox jumps over the lazy dog. A precisão em cada vértice define a nossa comunicação estrutural.</p>
                </div>

                <div className="flex gap-4 border-t border-white/10 pt-8 mt-auto">
                  <div className="bg-white/5 px-5 py-2.5 rounded-lg text-xs text-white/70 font-semibold font-sans box-border">Regular</div>
                  <div className="bg-white/5 px-5 py-2.5 rounded-lg text-xs text-white/70 font-bold font-sans box-border">SemiBold</div>
                  <div className="bg-[#DFEDD8] px-5 py-2.5 rounded-lg text-xs text-[#19302A] font-black font-sans box-border">ExtraBold</div>
                </div>
              </div>
            </div>

            {/* INTER */}
            <div className="bg-[#F7F9F8] dark:bg-[#0A0D0B] rounded-[2rem] border border-black/5 dark:border-white/5 p-8 md:p-14 relative overflow-hidden group shadow-xl shadow-black/5">
              <div className="absolute -right-10 -bottom-20 text-[20rem] font-bold text-black/[0.03] dark:text-white/[0.02] font-['Inter'] leading-none select-none pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                Aa
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-16">
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 dark:text-white/40 tracking-widest uppercase mb-1">Leitura / Corpo</h3>
                    <p className="text-gray-900 dark:text-white/90 text-2xl md:text-3xl font-bold font-['Inter']">Inter</p>
                  </div>
                  <FileText size={32} strokeWidth={1} className="text-gray-300 dark:text-white/20" />
                </div>
                
                <div className="mb-16">
                  <div className="text-5xl lg:text-7xl font-normal text-gray-900 dark:text-white/90 leading-[1.1] mb-6 tracking-tight font-['Inter']">
                    Abcd Efgh Ijkl<br/>
                    1234 5678
                  </div>
                  <p className="text-gray-500 dark:text-white/50 text-lg md:text-xl font-light font-['Inter'] leading-relaxed">The quick brown fox jumps over the lazy dog. Legibilidade inquestionável para documentos e interfaces complexas.</p>
                </div>

                <div className="flex gap-4 border-t border-gray-200 dark:border-white/10 pt-8 mt-auto flex-wrap">
                  <div className="border border-gray-300 dark:border-white/10 px-5 py-2.5 rounded-lg text-xs text-gray-500 dark:text-white/50 font-light font-['Inter']">Light</div>
                  <div className="bg-gray-100 dark:bg-white/5 px-5 py-2.5 rounded-lg text-xs text-gray-700 dark:text-white/70 font-normal font-['Inter']">Regular</div>
                  <div className="bg-gray-900 dark:bg-[#EFF7E0] px-5 py-2.5 rounded-lg text-xs text-white dark:text-[#19302A] font-medium font-['Inter'] shadow-lg">Medium</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 03. High-End Color Constellations ──────────────────── */}
        <section className="mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-black/5 dark:border-white/5 pb-8">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-[#19302A] text-[#DFEDD8] px-3 py-1.5 rounded-full inline-block mb-4">
                03.00 Chromatic
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: t.text }}>
                Spectrum Rules
              </h2>
              <p className="text-sm md:text-base max-w-xl leading-relaxed m-0" style={{ color: t.textMuted }}>
                39 variáveis oficiais mapeadas. É terminantemente proibido inserir blends externos. Software auditor rastreia correspondências paramétricas e bloqueia <span className="font-mono bg-black/5 dark:bg-white/10 px-1 rounded">ΔE &gt; limite</span>.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-20">
            {colorPalette.map((family) => (
              <div key={family.name} className="relative">
                <div className="flex flex-col xl:flex-row gap-8 xl:gap-16">
                  
                  {/* Family Meta */}
                  <div className="w-full xl:w-72 shrink-0">
                    <h3 className="text-2xl font-bold mb-3" style={{ color: t.text }}>{family.name}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>{family.description}</p>
                  </div>

                  {/* Swatches as a fluid masonry/strip */}
                  <div className="flex-1 overflow-x-auto pb-8 hide-scrollbar cursor-grab">
                    <div className="flex gap-3 w-max">
                      {family.colors.map((color, i) => {
                        const light = isLightColor(color.hex);
                        return (
                          <div 
                            key={color.hex} 
                            className="group relative w-24 md:w-32 lg:w-40 h-56 md:h-72 rounded-[2rem] flex flex-col justify-between p-5 overflow-hidden shadow-sm transition-all duration-500 hover:w-36 md:hover:w-48 hover:-translate-y-4 hover:shadow-2xl hover:z-10 bg-white"
                            style={{ background: color.hex }}
                          >
                            <span 
                              className="text-[10px] font-mono font-bold tracking-widest mix-blend-overlay"
                              style={{ color: light ? 'black' : 'white', opacity: 0.5 }}
                            >
                              {color.level || `VAR-${i}`}
                            </span>
                            <div className="translate-y-12 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                              <div className="text-[13px] font-extrabold truncate mb-1.5" style={{ color: light ? '#000' : '#FFF' }}>
                                {color.name}
                              </div>
                              <div className="text-[10px] font-mono" style={{ color: light ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)' }}>
                                {color.hex.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 04. Protocols Board ─────────────────────────────────── */}
        <section className="mb-20">
          <div className="mb-12">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-[#19302A] text-[#DFEDD8] px-3 py-1.5 rounded-full inline-block mb-4">
              04.00 Behavior
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: t.text }}>
              Voice & Systems
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Tone of Voice */}
            <div className="lg:col-span-2 bg-[#141A17] rounded-[3rem] border border-black/5 dark:border-white/5 p-10 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#619B7F] rounded-full filter blur-[150px] opacity-10 pointer-events-none" />
              <div className="relative z-10">
                <MessageSquare className="text-[#619B7F] mb-8" size={32} strokeWidth={1.5} />
                <h3 className="text-3xl font-extrabold text-white mb-4">Protocolo Léxico</h3>
                <p className="text-white/50 text-base mb-12 leading-relaxed max-w-xl font-light">
                  Regras estritas de redação validada para a associação. Evita jargões de "vendas", trocando-o por acolhimento e suporte orgânico à qualidade de vida.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="text-[10px] font-bold text-[#619B7F] mb-4 uppercase tracking-widest flex items-center gap-2">
                       <CheckCircle2 size={14} /> Tokens Operacionais (Aprovados)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Associado", "Indivíduo", "Membro", "Acesso", "Suporte", "Jornada", "Sistema", "Qualidade de Vida"].map(w => (
                        <span key={w} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white/90">{w}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#F37A63] mb-4 uppercase tracking-widest flex items-center gap-2">
                       <AlertTriangle size={14} /> Vetados (Viés Comercial)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Cliente", "Consumidor", "Venda", "Transação", "Desconto", "Promoção", "Comprador"].map(w => (
                        <span key={w} className="px-4 py-2 bg-[#F37A63]/5 border border-[#F37A63]/10 rounded-xl text-xs font-medium text-[#F37A63]/70 line-through decoration-[#F37A63]/30">{w}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Scenarios */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <RuleBlock 
                icon={Target}
                title="Institutional"
                description="Documentações, site núcleo e painéis governamentais da organização."
                approved={["Base Neutral obrigatória", "Destaque apenas OG Hybrid"]}
                prohibited={["Cores vibrantes Linalool/Myrcene"]}
              />
              <RuleBlock 
                icon={Share2}
                title="Campaign Actions"
                description="Material orgânico temporário para frentes de saúde e social."
                approved={["Myrcene: Metabolismo/Energia", "Linalool: Neuro/Neurologia"]}
                prohibited={["Mescla acentuada de famílias"]}
              />
            </div>

          </div>
        </section>

      </main>

      {/* ── Minimal Footer ────────────────────────────────────────── */}
      <footer className="max-w-[1600px] mx-auto px-6 md:px-12 border-t pt-10 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: t.line }}>
        <div className="flex items-center gap-3">
          <Shield size={16} strokeWidth={1.5} style={{ color: t.border }} />
          <span className="text-xs font-mono font-bold tracking-widest" style={{ color: t.textFaint }}>
            ADAPTA ARCHITECTURE CORE
          </span>
        </div>
        <div className="text-[10px] font-mono tracking-widest uppercase" style={{ color: t.textFaint }}>
          Rendered via CoreStudio — V.26
        </div>
      </footer>
    </div>
  );
}
