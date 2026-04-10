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

// ─── Document Components ───────────────────────────────────────

const MockupUploadPlaceholder = ({ label, isDarkTheme }: { label: string, isDarkTheme: boolean }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
    }
  };

  const borderColor = isDarkTheme ? 'border-white/20' : 'border-black/20';
  const hoverBorderColor = isDarkTheme ? 'hover:border-white/50' : 'hover:border-black/50';
  const labelBg = isDarkTheme ? 'bg-black/50' : 'bg-white/80';
  const labelText = isDarkTheme ? 'text-white' : 'text-[#141A17]';
  const spanText = isDarkTheme ? 'text-white/50' : 'text-black/50';
  const btnBg = isDarkTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10';
  const btnText = isDarkTheme ? 'text-white' : 'text-black';

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center border-2 border-dashed ${borderColor} rounded-2xl overflow-hidden group transition-colors duration-300 ${hoverBorderColor}`}>
      {imageSrc ? (
         <img src={imageSrc} className="absolute inset-0 w-full h-full object-cover" alt="Mockup preview" />
      ) : (
         <div className="text-center p-4 relative z-10 flex flex-col items-center">
            <span className={`${labelBg} ${labelText} text-[9px] font-mono uppercase px-2 py-1 rounded-full mb-3 backdrop-blur-md shadow-sm border border-current/10 font-bold tracking-widest`}>
              {label}
            </span>
            <span className={`text-[10px] ${spanText} mb-4 font-mono tracking-wider uppercase`}>Upload de Mockup</span>
            <label className={`cursor-pointer ${btnBg} ${btnText} text-[10px] px-4 py-1.5 rounded-lg transition-all font-semibold flex items-center gap-2 hover:scale-105 active:scale-95`}>
              Selecionar SVG / PNG
              <input type="file" accept="image/svg+xml,image/png,image/jpeg" className="hidden" onChange={handleFileChange} />
            </label>
         </div>
      )}
      {imageSrc && (
         <label className={`absolute bottom-4 right-4 cursor-pointer ${labelBg} backdrop-blur-md text-current text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full transition-all z-20 shadow-xl border border-current/10 hover:scale-105 active:scale-95 flex items-center font-bold`}>
            Trocar
            <input type="file" accept="image/svg+xml,image/png,image/jpeg" className="hidden" onChange={handleFileChange} />
         </label>
      )}
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────

export default function Brand() {
  const { t } = useTheme();
  
  // Top Level Navigation
  const [activeTab, setActiveTab] = useState<"coldflora" | "verdecore" | "colorcore">("coldflora");
  
  // Local Theme Simulation Toggle
  const [localDark, setLocalDark] = useState(false);
  const [colorcoreSub, setColorcoreSub] = useState<"linalool" | "myrcene">("myrcene");

  const BRAND_CONTEXTS = {
    coldflora: {
      title: "ColdFlora Suite",
      type: "Interface | UI Digital",
      desc: "Sistema orgânico para interfaces digitais. Cores neutras que projetam ferramentas clínicas e executivas. O foco é clareza máxima sem vazamento agressivo de pigmentos de campanha.",
      mockups: ["Dashboard Desktop v8", "Componentes de Interface", "UI Mobile App"]
    },
    verdecore: {
      title: "VerdeCore Institucional",
      type: "Materialização Estrutural",
      desc: "Aplicações oficiais da marca: papelaria, embalagens primárias e fardamento. A consolidação tátil e clínica da identidade Adapta no mundo físico.",
      mockups: ["Papelaria Oficial (Timbrados)", "Fardamento / Jalecos", "Embalagens Padrão Clínico"]
    },
    colorcore: {
      title: "ColorCore Labs",
      type: "Campanha & Tático",
      desc: "Materialização criativa focada em ação digital, brindes e impacto sensorial. Desvencilia-se de interfaces puras para não comprometer a usabilidade.",
      mockups: ["Criativos Sociais (Feed/Stories)", "Outdoors & Midia Física", "Kits Táticos & Brindes"]
    }
  };

  const context = BRAND_CONTEXTS[activeTab];

  // Dynamic Styles Mapping
  // ─── Sovereign Concept: Interface is ALWAYS ColdFlora ─────────
  const interfaceBg = localDark ? "#0A0D0B" : "#FAFBFA";
  const interfaceText = localDark ? "#FAFBFA" : "#141A17";
  const interfaceFaintText = localDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const interfaceBorder = localDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  let bentoConfigs = [];

  if (activeTab === "coldflora") {
    bentoConfigs.push({
      id: "coldflora",
      contentBg: interfaceBg,
      contentText: interfaceText,
      contentFaintText: interfaceFaintText,
      contentBorder: interfaceBorder,
      familyId: localDark ? "neutrals-dark" : "neutrals-light",
      colors: colorPalette.find(f => f.id === (localDark ? "neutrals-dark" : "neutrals-light"))?.colors || [],
      typog: 'Otimizada para telas e métricas de conversão. Aliada à "Inter" para fluxos longos de leitura cirúrgica. Sem ruídos ornamentais.',
      mockups: context.mockups
    });
  } else if (activeTab === "verdecore") {
    bentoConfigs.push({
      id: "verdecore",
      contentBg: localDark ? "#12251F" : "#F2F8EA",
      contentText: localDark ? "#F2F8EA" : "#1B4235",
      contentFaintText: localDark ? "rgba(242,248,234,0.5)" : "rgba(27,66,53,0.5)",
      contentBorder: localDark ? "rgba(242,248,234,0.1)" : "rgba(27,66,53,0.1)",
      familyId: "og-hybrid-blend",
      colors: colorPalette.find(f => f.id === "og-hybrid-blend")?.colors || [],
      typog: 'Variante Display pesada (ExtraBold/Black) para materialização e escala macro. Peso estrutural traz segurança corporativa sólida.',
      mockups: context.mockups
    });
  } else if (activeTab === "colorcore") {
    bentoConfigs.push({
      id: colorcoreSub === "myrcene" ? "myrcene" : "linalool",
      contentBg: colorcoreSub === "myrcene" 
        ? (localDark ? "#4A1C2C" : "#FFF5F5") 
        : (localDark ? "#251D45" : "#FCF5FF"),
      contentText: colorcoreSub === "myrcene"
        ? (localDark ? "#FFF5F5" : "#AF4F72")
        : (localDark ? "#FCF5FF" : "#483D79"),
      contentFaintText: colorcoreSub === "myrcene"
        ? (localDark ? "rgba(255,245,245,0.5)" : "rgba(175,79,114,0.5)")
        : (localDark ? "rgba(252,245,255,0.5)" : "rgba(72,61,121,0.5)"),
      contentBorder: colorcoreSub === "myrcene"
        ? (localDark ? "rgba(255,245,245,0.1)" : "rgba(175,79,114,0.1)")
        : (localDark ? "rgba(252,245,255,0.1)" : "rgba(72,61,121,0.1)"),
      familyId: colorcoreSub === "myrcene" ? "myrcene-soul" : "linalool-sky",
      colors: colorPalette.find(f => f.id === (colorcoreSub === "myrcene" ? "myrcene-soul" : "linalool-sky"))?.colors || [],
      typog: colorcoreSub === "myrcene" 
        ? 'Ousadia táctica. Peso extremo contraposto a espaços negativos altos para guiar atenções de forma rápida.'
        : 'Abordagem clínica focada. Promove a calma em interações críticas voltadas ao cuidado associativo.',
      mockups: context.mockups
    });
  }

  return (
    <div className="w-full h-screen overflow-hidden font-sans flex flex-col transition-colors duration-700" style={{ backgroundColor: interfaceBg, color: interfaceText }}>
      <Helmet>
        <title>Brand Architecture | Adapta CoreStudio</title>
      </Helmet>

      {/* ── Global Tab Navigation ──────────────────────────────── */}
      <nav className="shrink-0 z-50 backdrop-blur-xl border-b transition-colors duration-700" style={{ borderColor: interfaceBorder, backgroundColor: `${interfaceBg}Cc` }}>
        <div className="max-w-[1600px] w-full mx-auto px-6 md:px-8 h-20 flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 md:py-0">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded flex items-center justify-center bg-current text-current shadow-lg shadow-black/5">
              <Fingerprint size={16} className="mix-blend-difference invert" />
            </div>
            <span className="font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase">
              Brand Sandbox
            </span>
          </div>

          <div className="flex gap-2 p-1.5 rounded-full border hide-scrollbar overflow-x-auto w-full md:w-auto" style={{ borderColor: interfaceBorder, backgroundColor: 'rgba(0,0,0,0.02)' }}>
            {[
              { id: 'coldflora', label: 'Coldflora UI' },
              { id: 'verdecore', label: 'VerdeCore' },
              { id: 'colorcore', label: 'ColorCore' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setLocalDark(false); }}
                className={`px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap outline-none`}
                style={{
                  backgroundColor: activeTab === tab.id ? interfaceText : 'transparent',
                  color: activeTab === tab.id ? interfaceBg : interfaceText,
                  opacity: activeTab === tab.id ? 1 : 0.6,
                  boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Active Context Dashboard ────────────────────────────── */}
      <main className="max-w-[1600px] w-full h-[calc(100vh-5rem)] mx-auto px-6 md:px-8 flex flex-col py-4 md:py-6 overflow-hidden">
        
        {/* Context Hero Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4 mb-4 border-b pb-4 xl:pb-6 shrink-0 transition-colors duration-700" style={{ borderColor: interfaceBorder }}>
           <div className="max-w-4xl">
              <span className="text-[9px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full inline-block mb-3 border backdrop-blur-sm transition-colors duration-700" style={{ borderColor: interfaceBorder, color: interfaceText, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                {context.type}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-2 leading-none">
                {context.title}
              </h1>
              <p className="text-sm md:text-base leading-relaxed font-light line-clamp-2 transition-colors duration-700" style={{ color: interfaceFaintText }}>
                {context.desc}
              </p>
           </div>
           
           {/* Context Local Controls */}
           <div className="flex flex-row items-center gap-4 shrink-0 w-full xl:w-auto justify-between xl:justify-start">
             
             {activeTab === "colorcore" && (
               <div className="flex items-center p-1 rounded-full border backdrop-blur-md transition-colors duration-700" style={{ borderColor: interfaceBorder, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                  <button
                    onClick={() => setColorcoreSub('myrcene')}
                    className="px-4 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase transition-all whitespace-nowrap outline-none"
                    style={{
                      backgroundColor: colorcoreSub === 'myrcene' ? interfaceText : 'transparent',
                      color: colorcoreSub === 'myrcene' ? interfaceBg : interfaceText,
                      opacity: colorcoreSub === 'myrcene' ? 1 : 0.5,
                    }}
                  >
                     Myrcene
                  </button>
                  <button
                    onClick={() => setColorcoreSub('linalool')}
                    className="px-4 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase transition-all whitespace-nowrap outline-none"
                    style={{
                      backgroundColor: colorcoreSub === 'linalool' ? interfaceText : 'transparent',
                      color: colorcoreSub === 'linalool' ? interfaceBg : interfaceText,
                      opacity: colorcoreSub === 'linalool' ? 1 : 0.5,
                    }}
                  >
                     Linalool
                  </button>
               </div>
             )}

             <div className="flex items-center gap-1.5 p-1 rounded-full border backdrop-blur-md transition-colors duration-700" style={{ borderColor: interfaceBorder, backgroundColor: 'rgba(0,0,0,0.02)' }}>
               <button
                 onClick={() => setLocalDark(false)}
                 className="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-transparent"
                 style={!localDark ? {backgroundColor: interfaceText, color: interfaceBg, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transform: 'scale(1)'} : {color: interfaceText, opacity: 0.4, transform: 'scale(0.8)'}}
                 title="Simular Aplicação Clara"
               >
                 <Sun size={14} strokeWidth={2} />
               </button>
               <button
                 onClick={() => setLocalDark(true)}
                 className="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-transparent"
                 style={localDark ? {backgroundColor: interfaceText, color: interfaceBg, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transform: 'scale(1)'} : {color: interfaceText, opacity: 0.4, transform: 'scale(0.8)'}}
                 title="Simular Aplicação Escura"
               >
                 <Moon size={14} strokeWidth={2} />
               </button>
             </div>

           </div>
        </div>

        {/* ── Dashboard Bento Grid(s) ─────────────────────────────── */}
        <div className={`flex-1 min-h-0 flex flex-col xl:flex-row gap-4 pb-2 overflow-hidden`}>
          {bentoConfigs.map(config => (
            <div key={config.id} className="flex-1 min-h-0 flex flex-col h-full bg-transparent overflow-hidden">
               {/* Label for Split View */}
               {bentoConfigs.length > 1 && (
                  <div className="text-[9px] font-mono uppercase tracking-widest mb-2 opacity-50 font-bold ml-2 shrink-0">
                     {config.familyId}
                  </div>
               )}
               
               <div className="flex-1 min-h-0 grid grid-cols-12 grid-rows-3 gap-3 md:gap-4">
                 
                 {/* Mockup 1 (Principal) */}
                 <div className="col-span-12 md:col-span-8 row-span-2 rounded-3xl border overflow-hidden p-1.5 transition-colors duration-700" style={{ borderColor: config.contentBorder, backgroundColor: config.contentBg }}>
                    <MockupUploadPlaceholder label={config.mockups[0]} isDarkTheme={localDark} />
                 </div>

                 {/* Tactical Info Panel - Identity Token */}
                 <div className="col-span-12 md:col-span-4 row-span-1 rounded-3xl border p-4 md:p-6 flex items-center justify-center relative group overflow-hidden transition-colors duration-700" style={{ borderColor: config.contentBorder, backgroundColor: config.contentBg, color: config.contentText }}>
                    {localDark ? <LogoLight className="w-16 md:w-20 lg:w-24 opacity-90 transition-transform duration-700 group-hover:scale-110" /> : <LogoDark className="w-16 md:w-20 lg:w-24 opacity-90 mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />}
                    <div className="absolute top-4 left-5 text-[9px] font-mono uppercase tracking-widest" style={{ color: config.contentFaintText }}>Base Logo</div>
                    <div className="absolute bottom-4 right-5">
                       <Shield size={16} style={{ color: config.contentFaintText, opacity: 0.5 }} strokeWidth={1} />
                    </div>
                 </div>

                 {/* Color Tones Extraction */}
                 <div className="col-span-12 md:col-span-4 row-span-1 rounded-3xl border p-4 md:p-6 flex flex-col justify-between transition-colors duration-700" style={{ borderColor: config.contentBorder, backgroundColor: config.contentBg, color: config.contentText }}>
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-[9px] font-mono uppercase tracking-widest" style={{ color: config.contentFaintText }}>Família Tática</div>
                      <div className="text-[9px] font-bold uppercase py-1 px-2.5 rounded-full border hide-scrollbar overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px] md:max-w-[none]" style={{ borderColor: config.contentBorder }}>{config.familyId}</div>
                    </div>
                    
                    <div className="flex w-full flex-1 min-h-[24px] sm:min-h-[30px] rounded-xl overflow-hidden border" style={{ borderColor: config.contentBorder }}>
                      {config.colors.slice(0, 8).map(c => (
                        <div key={c.hex} className="flex-1 h-full hover:flex-[2.5] transition-all duration-300 shadow-inner" style={{ backgroundColor: c.hex }} title={`${c.name} - ${c.hex}`} />
                      ))}
                    </div>
                    
                    <div className="mt-3 flex justify-between items-end">
                       <span className="text-[10px] md:text-xs font-semibold leading-tight">Paleta<br/>Contextual</span>
                       <span className="text-sm font-mono opacity-50">{config.colors.length} T</span>
                    </div>
                 </div>

                 {/* Mockups 2 e 3 (Secundários) */}
                 <div className="col-span-6 md:col-span-3 row-span-1 rounded-3xl border overflow-hidden p-1.5 transition-colors duration-700" style={{ borderColor: config.contentBorder, backgroundColor: config.contentBg }}>
                    <MockupUploadPlaceholder label={config.mockups[1]} isDarkTheme={localDark} />
                 </div>

                 <div className="col-span-6 md:col-span-3 row-span-1 rounded-3xl border overflow-hidden p-1.5 transition-colors duration-700" style={{ borderColor: config.contentBorder, backgroundColor: config.contentBg }}>
                    <MockupUploadPlaceholder label={config.mockups[2]} isDarkTheme={localDark} />
                 </div>

                 {/* Typography Callout */}
                 <div className="col-span-12 md:col-span-6 row-span-1 rounded-3xl border p-4 md:p-6 flex flex-row justify-between items-center relative overflow-hidden group transition-colors duration-700" style={{ borderColor: config.contentBorder, backgroundColor: config.contentBg, color: config.contentText }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 scale-150 pointer-events-none group-hover:scale-125 group-hover:opacity-10 transition-all duration-1000">
                      <Type size={180} strokeWidth={0.5} style={{ color: config.contentText }} />
                    </div>
                    <div className="relative z-10 w-full max-w-[200px] md:max-w-[280px]">
                       <div className="text-[9px] font-mono uppercase tracking-widest mb-1.5 flex items-center gap-2" style={{ color: config.contentFaintText }}>
                          <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full" style={{ backgroundColor: config.contentText }} /> Tipografia
                       </div>
                       <div className="text-xl md:text-2xl font-black mb-1.5 tracking-tight truncate">Geist Sans</div>
                       <p className="text-[10px] md:text-xs font-light leading-snug lg:leading-relaxed line-clamp-3 md:line-clamp-2" style={{ color: config.contentFaintText }}>
                         {config.typog}
                       </p>
                    </div>
                    <div className="relative z-10 text-4xl md:text-5xl font-bold font-serif italic tracking-tighter opacity-20" style={{ color: config.contentText }}>
                       Aa
                    </div>
                 </div>

               </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
