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
    <div className={`relative w-full h-full flex flex-col items-center justify-center border-2 border-dashed ${borderColor} rounded-[2rem] overflow-hidden group transition-colors duration-300 ${hoverBorderColor}`}>
      {imageSrc ? (
         <img src={imageSrc} className="absolute inset-0 w-full h-full object-cover" alt="Mockup preview" />
      ) : (
         <div className="text-center p-6 relative z-10 flex flex-col items-center">
            <span className={`${labelBg} ${labelText} text-[10px] font-mono uppercase px-3 py-1.5 rounded-full mb-4 backdrop-blur-md shadow-sm border border-current/10 font-bold tracking-widest`}>
              {label}
            </span>
            <span className={`text-xs ${spanText} mb-6 font-mono tracking-wider uppercase`}>Upload de Mockup</span>
            <label className={`cursor-pointer ${btnBg} ${btnText} text-xs px-5 py-2.5 rounded-xl transition-all font-semibold flex items-center gap-2 hover:scale-105 active:scale-95`}>
              Selecionar SVG / PNG
              <input type="file" accept="image/svg+xml,image/png,image/jpeg" className="hidden" onChange={handleFileChange} />
            </label>
         </div>
      )}
      {imageSrc && (
         <label className={`absolute bottom-6 right-6 cursor-pointer ${labelBg} backdrop-blur-md text-current text-[10px] uppercase tracking-widest px-4 py-2 rounded-full transition-all z-20 shadow-xl border border-current/10 hover:scale-105 active:scale-95 flex items-center font-bold`}>
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
  const [colorcoreSub, setColorcoreSub] = useState<"linalool" | "myrcene">("linalool");

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
  let bg = "";
  let text = "";
  let faintText = "";
  let border = "";
  let familyId = "";

  if (activeTab === "coldflora") {
    bg = localDark ? "#0A0D0B" : "#FAFBFA";
    text = localDark ? "#FAFBFA" : "#141A17";
    faintText = localDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
    border = localDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
    familyId = localDark ? "neutrals-dark" : "neutrals-light";
  } else if (activeTab === "verdecore") {
    bg = localDark ? "#12251F" : "#F2F8EA";
    text = localDark ? "#F2F8EA" : "#1B4235";
    faintText = localDark ? "rgba(242,248,234,0.5)" : "rgba(27,66,53,0.5)";
    border = localDark ? "rgba(242,248,234,0.1)" : "rgba(27,66,53,0.1)";
    familyId = "og-hybrid-blend"; 
  } else if (activeTab === "colorcore") {
    if (colorcoreSub === "linalool") {
      bg = localDark ? "#251D45" : "#FCF5FF";
      text = localDark ? "#FCF5FF" : "#483D79";
      faintText = localDark ? "rgba(252,245,255,0.5)" : "rgba(72,61,121,0.5)";
      border = localDark ? "rgba(252,245,255,0.1)" : "rgba(72,61,121,0.1)";
      familyId = "linalool-sky";
    } else {
      bg = localDark ? "#4A1C2C" : "#FFF5F5";
      text = localDark ? "#FFF5F5" : "#AF4F72";
      faintText = localDark ? "rgba(255,245,245,0.5)" : "rgba(175,79,114,0.5)";
      border = localDark ? "rgba(255,245,245,0.1)" : "rgba(175,79,114,0.1)";
      familyId = "myrcene-soul";
    }
  }

  const activeFamily = colorPalette.find(f => f.id === familyId);
  const primaryColors = activeFamily?.colors || [];

  return (
    <div className="w-full min-h-screen font-sans flex flex-col transition-colors duration-700" style={{ backgroundColor: bg, color: text }}>
      <Helmet>
        <title>Brand Architecture | Adapta CoreStudio</title>
      </Helmet>

      {/* ── Global Tab Navigation ──────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ borderColor: border, backgroundColor: `${bg}Cc` }}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-20 flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 md:py-0">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded flex items-center justify-center bg-current text-current shadow-lg shadow-black/5">
              <Fingerprint size={16} className="mix-blend-difference invert" />
            </div>
            <span className="font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase">
              Brand Sandbox
            </span>
          </div>

          <div className="flex gap-2 p-1.5 rounded-full border hide-scrollbar overflow-x-auto w-full md:w-auto" style={{ borderColor: border, backgroundColor: 'rgba(0,0,0,0.02)' }}>
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
                  backgroundColor: activeTab === tab.id ? text : 'transparent',
                  color: activeTab === tab.id ? bg : text,
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
      <main className="max-w-[1600px] w-full mx-auto px-6 md:px-12 flex-1 pt-12 md:pt-20 pb-32">
        
        {/* Context Hero Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 mb-16 md:mb-24 border-b pb-12 md:pb-16" style={{ borderColor: border }}>
           <div className="max-w-4xl">
              <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest px-4 py-2 rounded-full inline-block mb-8 border backdrop-blur-sm" style={{ borderColor: border, color: text, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                {context.type}
              </span>
              <h1 className="text-5xl sm:text-7xl md:text-[7.5rem] font-black tracking-tighter mb-8 leading-[0.9]">
                {context.title}
              </h1>
              <p className="text-xl md:text-2xl leading-relaxed font-light" style={{ color: faintText }}>
                {context.desc}
              </p>
           </div>
           
           {/* Context Local Controls */}
           <div className="flex flex-row xl:flex-col items-center xl:items-end gap-6 shrink-0 w-full xl:w-auto justify-between xl:justify-start">
             
             {activeTab === "colorcore" && (
                <div className="flex flex-col sm:flex-row gap-2 p-1.5 rounded-3xl sm:rounded-full border w-full sm:w-auto" style={{ borderColor: border, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                   <button 
                     onClick={() => setColorcoreSub('linalool')} 
                     className="px-6 py-3 rounded-2xl sm:rounded-full text-xs font-bold uppercase transition-all" 
                     style={colorcoreSub === 'linalool' ? {backgroundColor: text, color: bg, boxShadow: '0 4px 12px rgba(0,0,0,0.05)'} : {color: text, opacity: 0.6}}
                   >
                     Linalool (Índica)
                   </button>
                   <button 
                     onClick={() => setColorcoreSub('myrcene')} 
                     className="px-6 py-3 rounded-2xl sm:rounded-full text-xs font-bold uppercase transition-all" 
                     style={colorcoreSub === 'myrcene' ? {backgroundColor: text, color: bg, boxShadow: '0 4px 12px rgba(0,0,0,0.05)'} : {color: text, opacity: 0.6}}
                   >
                     Myrcene (Sativa)
                   </button>
                </div>
             )}
             
             <div className="flex flex-col items-end gap-3">
               <div className="flex items-center gap-2 p-1.5 rounded-full border backdrop-blur-md" style={{ borderColor: border, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                 <button
                   onClick={() => setLocalDark(false)}
                   className="w-14 h-14 rounded-full flex items-center justify-center transition-all bg-transparent"
                   style={!localDark ? {backgroundColor: text, color: bg, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transform: 'scale(1)'} : {color: text, opacity: 0.4, transform: 'scale(0.8)'}}
                   title="Simular Aplicação Clara"
                 >
                   <Sun size={24} strokeWidth={2} />
                 </button>
                 <button
                   onClick={() => setLocalDark(true)}
                   className="w-14 h-14 rounded-full flex items-center justify-center transition-all bg-transparent"
                   style={localDark ? {backgroundColor: text, color: bg, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transform: 'scale(1)'} : {color: text, opacity: 0.4, transform: 'scale(0.8)'}}
                   title="Simular Aplicação Escura"
                 >
                   <Moon size={24} strokeWidth={2} />
                 </button>
               </div>
               <span className="text-[10px] font-mono uppercase tracking-widest text-right mt-1" style={{ color: faintText }}>
                 Testar Variações de Tema
               </span>
             </div>

           </div>
        </div>

        {/* ── Dashboard Bento Grid ────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
           
           {/* Mockup 1 (Principal) */}
           <div className="md:col-span-8 aspect-square sm:aspect-[4/3] rounded-[2.5rem] border overflow-hidden p-3" style={{ borderColor: border, backgroundColor: 'rgba(0,0,0,0.03)' }}>
              <MockupUploadPlaceholder label={context.mockups[0]} isDarkTheme={localDark} />
           </div>

           {/* Tactical Info Panel */}
           <div className="md:col-span-4 flex flex-col gap-6 md:gap-8">
              
              {/* Identity Token */}
              <div className="rounded-[2.5rem] border p-8 md:p-12 flex items-center justify-center flex-1 relative group" style={{ borderColor: border, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                 {localDark ? <LogoLight className="w-32 md:w-40 opacity-90 transition-transform duration-700 group-hover:scale-110" /> : <LogoDark className="w-32 md:w-40 opacity-90 mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />}
                 <div className="absolute top-6 left-6 text-[10px] font-mono uppercase tracking-widest" style={{ color: faintText }}>Base Logo</div>
                 <div className="absolute bottom-6 right-6">
                    <Shield size={24} style={{ color: faintText, opacity: 0.5 }} strokeWidth={1} />
                 </div>
              </div>

              {/* Color Tones Extraction */}
              <div className="rounded-[2.5rem] border p-8 md:p-10 flex flex-col justify-between" style={{ borderColor: border, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                 <div className="flex justify-between items-center mb-8">
                   <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: faintText }}>Família Tática</div>
                   <div className="text-xs font-bold uppercase py-1 px-3 rounded-full border" style={{ borderColor: border, color: text }}>{familyId}</div>
                 </div>
                 
                 <div className="flex w-full h-20 rounded-2xl overflow-hidden border" style={{ borderColor: border }}>
                   {primaryColors.slice(0, 8).map(c => (
                     <div key={c.hex} className="flex-1 h-full hover:flex-[2.5] transition-all duration-300 shadow-inner" style={{ backgroundColor: c.hex }} title={`${c.name} - ${c.hex}`} />
                   ))}
                 </div>
                 
                 <div className="mt-8 flex justify-between items-end">
                    <span className="text-sm md:text-base font-semibold leading-tight">Paleta<br/>Contextual</span>
                    <span className="text-xl font-mono opacity-50">{primaryColors.length} T</span>
                 </div>
              </div>
           </div>

           {/* Mockups 2 e 3 (Secundários) */}
           <div className="md:col-span-6 aspect-[4/3] sm:aspect-video rounded-[2.5rem] border overflow-hidden p-3" style={{ borderColor: border, backgroundColor: 'rgba(0,0,0,0.03)' }}>
              <MockupUploadPlaceholder label={context.mockups[1]} isDarkTheme={localDark} />
           </div>

           <div className="md:col-span-6 aspect-[4/3] sm:aspect-video rounded-[2.5rem] border overflow-hidden p-3" style={{ borderColor: border, backgroundColor: 'rgba(0,0,0,0.03)' }}>
              <MockupUploadPlaceholder label={context.mockups[2]} isDarkTheme={localDark} />
           </div>

           {/* Typography Callout */}
           <div className="md:col-span-12 rounded-[2.5rem] border p-12 md:p-20 flex flex-col md:flex-row justify-between items-center gap-12 mt-4 md:mt-8 relative overflow-hidden group" style={{ borderColor: border, backgroundColor: 'rgba(0,0,0,0.02)' }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 scale-150 pointer-events-none group-hover:scale-125 group-hover:opacity-10 transition-all duration-1000">
                <Type size={300} strokeWidth={0.5} style={{ color: text }} />
              </div>
              <div className="relative z-10">
                 <div className="text-[10px] font-mono uppercase tracking-widest mb-6 flex items-center gap-3" style={{ color: faintText }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: text }} /> Padrão Tipográfico
                 </div>
                 <div className="text-5xl md:text-7xl font-black mb-6 tracking-tight">Geist Sans</div>
                 <p className="text-lg md:text-xl max-w-2xl font-light leading-relaxed" style={{ color: faintText }}>
                   {activeTab === 'coldflora' ? 'Tipografia otimizada para telas e métricas de conversão. Aliada à "Inter" para fluxos longos de leitura cirúrgica. Sem ruídos ornamentais.' 
                   : activeTab === 'verdecore' ? 'Variante Display pesada (ExtraBold/Black) para materialização e escala macro. Peso estrutural traz segurança corporativa sólida.' 
                   : 'Ousadia táctica. Peso extremo contraposto a espaços negativos altos para guiar atenções do associado de forma instintiva e rápida.'}
                 </p>
              </div>
              <div className="relative z-10 text-8xl md:text-[12rem] font-bold font-serif italic tracking-tighter text-center md:text-right mt-8 md:mt-0 opacity-20" style={{ color: text }}>
                 Aa
              </div>
           </div>

        </div>
      </main>
    </div>
  );
}
