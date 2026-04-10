import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AnimationPanel } from "./AnimationPanel";
import { ANIMATIONS } from "./animations";
import { getMascotBodyColors } from "../modules/tools/utils/cartilha-cromatica";
import { MascotConfig } from "./MascotSVG";
import { BODY_SHAPES } from "./body-shapes";
import { EYE_SETS_SELECTABLE } from "./eye-sets";
import { MOUTH_SETS } from "./mouth-sets";
import { BodyMini, EyeMini, MouthMini } from "./MiniPreview";
import { ChevronDown, Shapes, Eye, Smile, Palette as PaletteIcon, SlidersHorizontal, Film, Sparkles } from "lucide-react";

const ANIMATIONS_LABEL_MAP: Record<string, string> = Object.fromEntries(
  ANIMATIONS.map(a => [a.id, a.label])
);

function Section({ title, icon, children, isOpen, onToggle, badge }: {
  title: string; icon?: React.ReactNode; children: React.ReactNode;
  isOpen: boolean; onToggle: () => void; badge?: string;
}) {
  return (
    <div className="pb-0.5" style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        onClick={onToggle}
        className="flex items-center w-full text-left py-2 cursor-pointer gap-2 group"
      >
        {icon && <span className="transition-colors opacity-40 group-hover:opacity-60" style={{ color: 'var(--foreground)' }}>{icon}</span>}
        <span className="text-[11px] tracking-wide uppercase flex-1 font-medium" style={{ color: 'var(--foreground)' }}>{title}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={12} className="opacity-30" style={{ color: 'var(--foreground)' }} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-1 pb-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] w-[48px] shrink-0 text-right" style={{ color: 'var(--muted-foreground)' }}>{label}</span>
      <div className="flex-1 relative h-4 flex items-center">
        <div className="absolute inset-x-0 h-[2px] rounded-full" style={{ backgroundColor: 'var(--border)' }} />
        <div className="absolute left-0 h-[2px] rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: 'var(--foreground)' }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute w-3 h-3 rounded-full shadow-sm transition-all pointer-events-none"
          style={{ 
            left: `calc(${pct}% - 6px)`,
            backgroundColor: 'var(--background)',
            border: '1.5px solid var(--foreground)'
          }}
        />
      </div>
      <span className="text-[9px] w-7 tabular-nums text-right shrink-0" style={{ color: 'var(--muted-foreground)' }}>
        {step < 1 ? value.toFixed(2) : value}
      </span>
    </div>
  );
}

interface Props {
  config: MascotConfig;
  setConfig: (c: MascotConfig) => void;
  onRandomize: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  selectedAnim: string | null;
  onSelectAnim: (id: string | null) => void;
}

export function ControlPanel({
  config, setConfig, onRandomize, onReset,
  canUndo, canRedo, onUndo, onRedo,
  selectedAnim, onSelectAnim,
}: Props) {
  const [openSection, setOpenSection] = useState<string>('cores-corpo');
  
  const set = <K extends keyof MascotConfig>(key: K, val: MascotConfig[K]) =>
    setConfig({ ...config, [key]: val });

  // ── VALIDAÇÃO: Proibir combinações incompatíveis ──
  // "Piscadinha" (blink) usa "redondo13" (wink) - não combina com olhos cerrados
  const INCOMPATIBLE_EYES_WITH_WINK = ['fechado1', 'semi1'];
  const isWinkAnimation = selectedAnim === 'blink';
  const hasIncompatibleEyes = INCOMPATIBLE_EYES_WITH_WINK.includes(config.eyeId);
  
  // ⚠️ CORREÇÃO: Mover setState para useEffect para evitar "Cannot update component while rendering"
  useEffect(() => {
    // Se animação wink está ativa e olhos incompatíveis selecionados, troca automaticamente
    if (isWinkAnimation && hasIncompatibleEyes) {
      // Troca para redondo1 (padrão seguro)
      setConfig({ ...config, eyeId: 'redondo1' });
    }
  }, [isWinkAnimation, hasIncompatibleEyes]); // Apenas quando essas flags mudarem
  
  // 🎨 MASCOT COLORS - Primeiros 3 tons de cada espectro (27 cores total)
  const ALL_COLORS = getMascotBodyColors();
  
  // ✅ FILTRO CURADO: Verdes selecionados + TODO Color Core
  // VERDES: Alma (3 médios) + seleção de tons claros específicos
  const ALMA_COLORS = ALL_COLORS.filter(c => c.spectrum === 'Alma'); // 3 cores
  const VENTURA_VEU = ALL_COLORS.filter(c => c.spectrum === 'Ventura' && c.name === 'Véu'); // 1 cor
  const CANDY_COLORS = ALL_COLORS.filter(c => c.spectrum === 'Candy'); // 4 cores
  const LEMON_CITRUS = ALL_COLORS.filter(c => c.spectrum === 'Lemon' && c.name === 'Citrus'); // 1 cor
  
  // COLOR CORE: TODOS os 16 tons (Linalool Sky + Myrcene Soul)
  const COLOR_CORE_COLORS = ALL_COLORS.filter(c => 
    c.spectrum === 'Linalool Sky' || c.spectrum === 'Myrcene Soul'
  ); // 16 cores
  
  // Organização: Verdes curados (9) + Color Core completo (16) = 25 cores
  const MASCOT_COLORS = [
    ...ALMA_COLORS,        // Linha 1: 3 verdes médios (Green Smoke, Emerald Haze, Deep Pine)
    ...VENTURA_VEU,        // +1 acinzentado (Véu)
    ...CANDY_COLORS,       // +4 pastel (Marshmallow, Açúcar, Baunilha, Pistache)
    ...LEMON_CITRUS,       // +1 suave (Citrus)
    ...COLOR_CORE_COLORS,  // +16 Color Core (Linalool, Myrcene)
  ]; // Total: 25 cores

  return (
    <div className="flex flex-col gap-0 w-full">

      {/* CORES + CORPO - LADO A LADO COM EQUIDADE */}
      <div className="grid gap-3 pb-0.5" style={{ gridTemplateColumns: '1.8fr 1fr', borderBottom: '1px solid #DAE2DD' }}>
        
        {/* Cores - COLUNA MAIOR (mais conteúdo) */}
        <Section 
          title="Cores" 
          icon={<PaletteIcon size={13} />}
          isOpen={openSection === 'cores-corpo'}
          onToggle={() => setOpenSection(openSection === 'cores-corpo' ? '' : 'cores-corpo')}
        >
          <div className="space-y-1">
            <div className="grid grid-cols-6 gap-1">
              {MASCOT_COLORS.map((color) => (
                <button
                  key={`body-${color.value}`}
                  onClick={() => {
                    set("bodyColor", color.value);
                    // Mantém cores-corpo aberto (não navega)
                  }}
                  className="w-full aspect-square rounded-md transition-all"
                  style={{
                    backgroundColor: color.value,
                    boxShadow: config.bodyColor === color.value ? '0 0 0 2px #2E3D34' : '0 0 0 1px #DAE2DD',
                  }}
                  title={`${color.name} (${color.spectrum})`}
                />
              ))}
            </div>
          </div>
        </Section>

        {/* Corpo - COLUNA MENOR (menos conteúdo) */}
        <Section 
          title="Corpo" 
          icon={<Shapes size={13} />} 
          badge={BODY_SHAPES.find(b => b.id === config.bodyId)?.label}
          isOpen={openSection === 'cores-corpo'}
          onToggle={() => setOpenSection(openSection === 'cores-corpo' ? '' : 'cores-corpo')}
        >
          <div className="grid grid-cols-3 gap-1.5">
            {BODY_SHAPES.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  set("bodyId", b.id);
                  // Mantém cores-corpo aberto (não navega)
                }}
                className={`flex flex-col items-center justify-center aspect-square rounded-lg transition-all cursor-pointer`}
                style={{
                  backgroundColor: config.bodyId === b.id ? '#F7F9F8' : '#EDF1EF',
                  boxShadow: config.bodyId === b.id ? '0 0 0 2px #2E3D34' : '0 0 0 1px #DAE2DD',
                }}
              >
                <BodyMini bodyId={b.id} color={config.bodyColor} size={36} />
              </button>
            ))}
          </div>
        </Section>

      </div>

      {/* Olhos */}
      <Section 
        title="Olhos" 
        icon={<Eye size={13} />} 
        badge={EYE_SETS_SELECTABLE.find(e => e.id === config.eyeId)?.label}
        isOpen={openSection === 'olhos'}
        onToggle={() => setOpenSection(openSection === 'olhos' ? '' : 'olhos')}
      >
        <div className="grid grid-cols-3 gap-1">
          {EYE_SETS_SELECTABLE.map((e) => {
            // Desabilitar olhos cerrados se animação "Piscadinha" estiver ativa
            const isIncompatible = isWinkAnimation && INCOMPATIBLE_EYES_WITH_WINK.includes(e.id);
            
            return (
              <button
                key={e.id}
                onClick={() => {
                  // Se tentar selecionar olho incompatível, desativa a animação wink
                  if (INCOMPATIBLE_EYES_WITH_WINK.includes(e.id) && isWinkAnimation) {
                    onSelectAnim(null);
                  }
                  set("eyeId", e.id);
                  setOpenSection('boca');
                }}
                disabled={isIncompatible}
                className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all ${isIncompatible ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                style={{
                  backgroundColor: config.eyeId === e.id ? '#F7F9F8' : '#EDF1EF',
                  boxShadow: config.eyeId === e.id ? '0 0 0 2px #2E3D34' : 'none',
                }}
              >
                <EyeMini eyeId={e.id} size={48} />
                <span 
                  className="text-[9px] tracking-tight leading-none truncate w-full text-center"
                  style={{ color: config.eyeId === e.id ? '#141A17' : '#6A8A7A', fontWeight: config.eyeId === e.id ? 500 : 400 }}
                >
                  {e.label}
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Boca */}
      <Section 
        title="Boca" 
        icon={<Smile size={13} />} 
        badge={MOUTH_SETS.find(m => m.id === config.mouthId)?.label}
        isOpen={openSection === 'boca'}
        onToggle={() => setOpenSection(openSection === 'boca' ? '' : 'boca')}
      >
        <div className="grid grid-cols-3 gap-1">
          {MOUTH_SETS.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                set("mouthId", m.id);
                setOpenSection('ajustes');
              }}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all cursor-pointer`}
              style={{
                backgroundColor: config.mouthId === m.id ? '#F7F9F8' : '#EDF1EF',
                boxShadow: config.mouthId === m.id ? '0 0 0 2px #2E3D34' : 'none',
              }}
            >
              <MouthMini mouthId={m.id} size={48} />
              <span 
                className="text-[9px] tracking-tight leading-none"
                style={{ color: config.mouthId === m.id ? '#141A17' : '#6A8A7A', fontWeight: config.mouthId === m.id ? 500 : 400 }}
              >
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </Section>

      {/* Ajustes */}
      <Section 
        title="Ajustes" 
        icon={<SlidersHorizontal size={13} />}
        isOpen={openSection === 'ajustes'}
        onToggle={() => setOpenSection(openSection === 'ajustes' ? '' : 'ajustes')}
      >
        <div className="flex flex-col gap-3 py-1">
          <Slider label="Ruido" value={config.noiseAmount} min={0} max={1} step={0.05} onChange={(v) => set("noiseAmount", v)} />
          <Slider label="Face Y" value={config.faceOffsetY} min={-25} max={25} step={1} onChange={(v) => set("faceOffsetY", v)} />
        </div>
      </Section>

      {/* Animação */}
      <Section 
        title="Animacao" 
        icon={<Film size={13} />} 
        badge={selectedAnim ? ANIMATIONS_LABEL_MAP[selectedAnim] : undefined}
        isOpen={openSection === 'animacao'}
        onToggle={() => setOpenSection(openSection === 'animacao' ? '' : 'animacao')}
      >
        <AnimationPanel
          config={config}
          selectedAnim={selectedAnim}
          onSelectAnim={onSelectAnim}
        />
      </Section>

      {/* Surpresa */}
      <div className="pt-1.5">
        <button
          onClick={onRandomize}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg active:scale-[0.98] transition-all cursor-pointer text-[10px] shadow-sm"
          style={{ 
            backgroundColor: '#2E3D34',
            color: '#FAFBFA'
          }}
        >
          <Sparkles size={11} /> Surpresa!
        </button>
      </div>
    </div>
  );
}
