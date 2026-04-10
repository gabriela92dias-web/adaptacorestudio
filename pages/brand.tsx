import React, { useState } from "react";
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

  const [activePaletteIndex, setActivePaletteIndex] = useState(0);
  const [localThemeDark, setLocalThemeDark] = useState(false);

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

        {/* ── 03. High-End Color Constellations (Tabbed Bento) ──────── */}
        <section className="mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b-0 pb-0">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-[#19302A] text-[#DFEDD8] px-3 py-1.5 rounded-full inline-block mb-4">
                03.00 Chromatic
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: t.text }}>
                Brand Identity Palettes
              </h2>
              <p className="text-sm md:text-base max-w-xl leading-relaxed m-0" style={{ color: t.textMuted }}>
                Explore as paletas e aplicações práticas (mockups, aplicações de logotipo e tipografia) para cada frente da arquitetura da marca.
              </p>
            </div>
            
            {/* Global Theme Toggle for the Palettes preview is optional, we will use a local one inside the box */}
          </div>

          {/* Palette Tabs */}
          <div className="flex gap-2 md:gap-6 mb-8 overflow-x-auto hide-scrollbar border-b" style={{ borderColor: t.line }}>
            {colorPalette.map((family, idx) => (
              <button 
                key={family.id}
                onClick={() => setActivePaletteIndex(idx)}
                className={`pb-4 px-2 font-mono uppercase tracking-widest text-xs transition-all whitespace-nowrap outline-none focus:outline-none`}
                style={{ 
                  color: activePaletteIndex === idx ? t.text : t.textMuted,
                  borderBottom: `2px solid ${activePaletteIndex === idx ? t.text : 'transparent'}`,
                  opacity: activePaletteIndex === idx ? 1 : 0.6
                }}
              >
                {family.name}
              </button>
            ))}
          </div>

          {/* Active Palette Bento Box */}
          {(() => {
            const family = colorPalette[activePaletteIndex];
            const baseColors = family.colors;
            const primaryColor = baseColors[baseColors.length - 3]?.hex || '#000';
            const lightColor = baseColors[1]?.hex || '#FFF';
            const darkColor = baseColors[baseColors.length - 1]?.hex || '#000';
            
            // Use local theme to define background and text of the bento box
            const bentoBg = localThemeDark ? darkColor : lightColor;
            const bentoText = localThemeDark ? lightColor : darkColor;
            
            // Placeholder Mockup Paths (the user will replace these with the actual files)
            const mockupImg1 = `/mockups/${family.id}-1.png`;
            const mockupImg2 = `/mockups/${family.id}-2.png`;
            const mockupImg3 = `/mockups/${family.id}-3.png`;

            return (
              <div 
                className="rounded-[2.5rem] p-6 md:p-10 transition-colors duration-700 ease-in-out border border-black/5 dark:border-white/5"
                style={{ backgroundColor: bentoBg }}
              >
                {/* Header of Bento Box */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight" style={{ color: bentoText }}>{family.name}</h3>
                    <p className="text-sm opacity-70 mt-1 max-w-md" style={{ color: bentoText }}>{family.description}</p>
                  </div>
                  <div className="flex items-center gap-2 p-1 rounded-full bg-black/10 dark:bg-white/10">
                    <button
                      onClick={() => setLocalThemeDark(false)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${!localThemeDark ? 'bg-white shadow text-black' : 'text-current opacity-50 hover:opacity-100'}`}
                      style={{ color: !localThemeDark ? '#000' : bentoText }}
                    >
                      <Sun size={14} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => setLocalThemeDark(true)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${localThemeDark ? 'bg-black shadow text-white' : 'text-current opacity-50 hover:opacity-100'}`}
                      style={{ color: localThemeDark ? '#FFF' : bentoText }}
                    >
                      <Moon size={14} strokeWidth={2} />
                    </button>
                  </div>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                  
                  {/* Top Left: Mockup 1 (e.g. Poster / Product) */}
                  <div className="md:col-span-5 relative rounded-[2rem] overflow-hidden group aspect-[4/5] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center">
                    {/* Placeholder image representation */}
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-80" style={{ backgroundImage: `url(${mockupImg1})` }} />
                    <div className="text-center p-8 relative z-10 w-full h-full flex flex-col items-center justify-center bg-black/5 backdrop-blur-[2px]">
                      <span className="bg-black/80 text-white text-[10px] font-mono uppercase px-3 py-1.5 rounded-full mb-3">Mockup Placeholder 1</span>
                      <p className="text-xs max-w-[200px]" style={{ color: bentoText }}>Substitua por: {mockupImg1}</p>
                    </div>
                  </div>

                  {/* Top Right Box */}
                  <div className="md:col-span-7 flex flex-col gap-4 md:gap-6">
                    
                    {/* Top Row inside Right Box */}
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 flex-1">
                      {/* Product Mockup 2 */}
                      <div className="flex-1 relative rounded-[2rem] overflow-hidden group bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 min-h-[220px] flex items-center justify-center">
                         <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-80" style={{ backgroundImage: `url(${mockupImg2})` }} />
                         <div className="relative z-10 text-center bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                            <span className="bg-black/80 text-white text-[10px] font-mono uppercase px-2 py-1 rounded-full block mb-2">Mockup 2</span>
                            <span className="text-[10px] opacity-70" style={{ color: bentoText }}>{mockupImg2}</span>
                         </div>
                      </div>
                      
                      {/* Logo variations */}
                      <div className="w-full sm:w-48 flex flex-col gap-4 md:gap-6">
                        <div className="flex-1 rounded-[2rem] bg-white border border-black/5 flex items-center justify-center p-4 min-h-[100px]">
                          <LogoDark className="w-20 mix-blend-multiply opacity-80" />
                        </div>
                        <div className="flex-1 rounded-[2rem] bg-[#141A17] border border-white/5 flex items-center justify-center p-4 min-h-[100px]">
                          <LogoLight className="w-20 opacity-90" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row inside Right Box */}
                    <div className="flex flex-col xl:flex-row gap-4 md:gap-6">
                      {/* Color Strip */}
                      <div className="flex-1 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 p-6 flex flex-col justify-end min-h-[200px]">
                        <div className="flex gap-2 w-full h-16 rounded-xl overflow-hidden mb-4">
                          {family.colors.slice(0, 6).map(c => (
                            <div key={c.hex} className="flex-1 h-full" style={{ backgroundColor: c.hex }} title={c.name} />
                          ))}
                        </div>
                        <span className="text-[11px] font-mono uppercase opacity-60 tracking-widest" style={{ color: bentoText }}>
                          Color Sequence ({family.colors.length} vars)
                        </span>
                      </div>

                      {/* Typo Block */}
                      <div className="flex-1 rounded-[2rem] p-6 border border-black/5 dark:border-white/5 min-h-[200px]" style={{ backgroundColor: primaryColor }}>
                        <div className="text-[10px] font-mono uppercase tracking-widest mb-4 opacity-70 text-white">
                          Typography
                        </div>
                        <div className="text-3xl font-extrabold text-white mb-2 tracking-tight">Geist Sans</div>
                        <div className="text-xs text-white/70 font-mono overflow-hidden whitespace-nowrap text-ellipsis">
                          Aa Bb Cc Dd Ee Ff Gg Hh
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Optional Bottom Row: Third mockup or big text display */}
                <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                  {/* Mockup 3 */}
                  <div className="md:col-span-4 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 aspect-square relative flex items-center justify-center overflow-hidden group">
                     <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-80" style={{ backgroundImage: `url(${mockupImg3})` }} />
                     <div className="relative z-10 text-center bg-black/10 backdrop-blur-sm p-4 rounded-xl border border-black/10">
                        <span className="bg-white/80 text-black text-[10px] font-mono uppercase px-2 py-1 rounded-full block mb-2">Mockup 3</span>
                        <span className="text-[10px] opacity-90" style={{ color: bentoBg }}>{mockupImg3}</span>
                     </div>
                  </div>
                  
                  {/* Large Message Display */}
                  <div className="md:col-span-8 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 p-8 md:p-12 flex flex-col justify-center">
                    <h4 className="text-2xl md:text-4xl font-light leading-tight tracking-tight mb-4" style={{ color: bentoText }}>
                      "Redefinindo o cuidado e o acolhimento sistêmico."
                    </h4>
                    <span className="text-xs font-mono uppercase opacity-50 tracking-widest" style={{ color: bentoText }}>
                      Brand Voice Manifest
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
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
