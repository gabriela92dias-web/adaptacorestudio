/*
 * ADAPTA — 9 animações de mascote
 * Cada animação é uma função pura: (t: 0→1) → AnimTransforms
 */

export interface AnimTransforms {
  bodyY: number;
  bodyRotate: number;
  bodyScaleX: number;
  bodyScaleY: number;
  bodyOriginX: number;
  bodyOriginY: number;
  faceY: number;
  faceRotate: number;
  eyeOffsetX: number;
  eyeOffsetY: number;
  eyeScaleX: number;
  eyeScaleY: number;
  eyeRotate: number;
  eyeIdOverride?: string;
  mouthOffsetX: number;
  mouthOffsetY: number;
  mouthScaleY: number;
  shadowScaleX: number;
  shadowOpacity: number;
  showZzz?: boolean;
  zzzOpacity?: number;
  zzzY?: number;
}

const BASE: AnimTransforms = {
  bodyY: 0, bodyRotate: 0, bodyScaleX: 1, bodyScaleY: 1, bodyOriginX: 0.5, bodyOriginY: 0.5,
  faceY: 0, faceRotate: 0,
  eyeOffsetX: 0, eyeOffsetY: 0, eyeScaleX: 1, eyeScaleY: 1, eyeRotate: 0,
  mouthOffsetX: 0, mouthOffsetY: 0, mouthScaleY: 1,
  shadowScaleX: 1, shadowOpacity: 0.06,
};

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function sin01(t: number) { return Math.sin(t * Math.PI * 2); }
function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2; }

function bounce(t: number) {
  if (t < 0.36) return easeInOut(t / 0.36);
  if (t < 0.54) return 1 - easeInOut((t - 0.36) / 0.18) * 0.15;
  if (t < 0.72) return 0.85 + easeInOut((t - 0.54) / 0.18) * 0.15;
  return 1 - easeInOut((t - 0.72) / 0.28);
}

// ── SISTEMA DE LIMITES SEGUROS ──
// Garante que olhos e boca nunca se sobreponham
// Gap base: 12 * faceScale (~30-40px na prática)
// Limites conservadores:
const MAX_EYE_OFFSET_Y = 10;   // Máximo que olhos podem descer
const MIN_EYE_OFFSET_Y = -6;   // Máximo que olhos podem subir
const MAX_MOUTH_OFFSET_Y = 6;  // Máximo que boca pode subir
const MIN_MOUTH_OFFSET_Y = -10; // Máximo que boca pode descer

function clampEyeOffsetY(value: number): number {
  return Math.max(MIN_EYE_OFFSET_Y, Math.min(MAX_EYE_OFFSET_Y, value));
}

function clampMouthOffsetY(value: number): number {
  return Math.max(MIN_MOUTH_OFFSET_Y, Math.min(MAX_MOUTH_OFFSET_Y, value));
}

export interface AnimationDef {
  id: string;
  label: string;
  emoji: string;
  durationMs: number;
  fn: (t: number) => AnimTransforms;
}

export const ANIMATIONS: AnimationDef[] = [
  {
    id: "breathing", label: "Respirando", emoji: "", durationMs: 2400,
    fn: (t) => ({
      ...BASE,
      bodyY: sin01(t) * 8,
      shadowScaleX: 1 + sin01(t) * 0.08,
      shadowOpacity: 0.06 + sin01(t) * 0.02,
    }),
  },
  {
    id: "nod", label: "Acenar", emoji: "", durationMs: 1800,
    fn: (t) => {
      const nod = sin01(t) * 15;
      return {
        ...BASE,
        faceY: nod,
        eyeOffsetY: nod * 0.3,
        mouthOffsetY: nod * 0.3,
        bodyScaleY: 1 + nod * 0.002,
      };
    },
  },
  {
    id: "bounce", label: "Pulinho", emoji: "", durationMs: 1000,
    fn: (t) => {
      const jumpT = bounce(t);
      const airborne = jumpT > 0.3;
      const squash = airborne ? 0 : (1 - jumpT) * 0.15;
      return {
        ...BASE,
        bodyY: -jumpT * 35,
        bodyScaleY: 1 - squash,
        bodyScaleX: 1 + squash * 0.6,
        faceY: -jumpT * 35,
        shadowScaleX: 1 - jumpT * 0.4,
        shadowOpacity: lerp(0.06, 0.02, jumpT),
      };
    },
  },
  {
    id: "look-around", label: "Olhando", emoji: "", durationMs: 2200,
    fn: (t) => {
      let ex: number;
      if (t < 0.25) ex = easeInOut(t / 0.25) * 8;
      else if (t < 0.75) ex = lerp(8, -8, easeInOut((t - 0.25) / 0.5));
      else ex = lerp(-8, 0, easeInOut((t - 0.75) / 0.25));
      return {
        ...BASE,
        eyeOffsetX: ex,
        mouthOffsetX: ex * 0.15,
        faceRotate: ex * 0.3,
      };
    },
  },
  {
    id: "dance", label: "Dancinha", emoji: "", durationMs: 1200,
    fn: (t) => {
      const beat = t * 4;
      const phase = beat % 1;
      const step = Math.floor(beat) % 4;
      const e = easeInOut(phase);

      let rot = 0, y = 0, sx = 1;
      if (step === 0) { rot = lerp(0, -10, e); y = -e * 6; sx = lerp(1, 0.96, e); }
      else if (step === 1) { rot = lerp(-10, 0, e); y = -(1 - e) * 6; sx = lerp(0.96, 1.04, e); }
      else if (step === 2) { rot = lerp(0, 10, e); y = -e * 6; sx = lerp(1.04, 0.96, e); }
      else { rot = lerp(10, 0, e); y = -(1 - e) * 6; sx = lerp(0.96, 1, e); }

      return {
        ...BASE,
        bodyRotate: rot,
        bodyY: y,
        bodyScaleX: sx,
        bodyScaleY: 2 - sx,
        faceRotate: rot,
        faceY: y,
        shadowScaleX: 1 + Math.abs(rot) * 0.01,
      };
    },
  },
  {
    id: "blink", label: "Piscadinha", emoji: "", durationMs: 5000,
    fn: (t) => {
      // Ciclo de 5 segundos: pisca RÁPIDO em t=0.1-0.136 (500-680ms = 180ms)
      // 96.4% do tempo com olhos abertos, 3.6% piscando (mais natural)
      const cycleT = t; // t já vai de 0 a 1 ao longo de 5s
      let useWink = false;
      let mouthScale = 1;
      let tiltRotate = 0;
      let bodyY = 0;
      let mouthOffsetX = 0;
      
      // Piscadinha RÁPIDA acontece entre 10% e 13.6% do ciclo (500ms-680ms = 180ms)
      if (cycleT > 0.1 && cycleT < 0.136) {
        useWink = true;
        // Suaviza a transição da piscada (mais rápida, mais snappy)
        const winkProgress = (cycleT - 0.1) / 0.036; // 0→1 dentro da piscada (180ms)
        const winkEase = winkProgress < 0.5 
          ? easeInOut(winkProgress * 2) 
          : 1 - easeInOut((winkProgress - 0.5) * 2);
        mouthScale = 1 - (winkEase * 0.2); // Reduz boca 20% durante a piscada
        tiltRotate = winkEase * 8; // Inclina cabeça 8° durante a piscadinha (simpatia)
        bodyY = -winkEase * 3; // Sobe levemente o corpo
        mouthOffsetX = winkEase * 3; // Boca acompanha inclinação
      } else {
        // Olhos abertos entre piscadas (96.4% do tempo)
        useWink = false;
        mouthScale = 1;
        tiltRotate = 0;
        bodyY = 0;
        mouthOffsetX = 0;
      }
      
      return {
        ...BASE,
        eyeIdOverride: useWink ? "redondo13" : undefined,
        eyeOffsetY: 8, // 20% mais afastado da boca (base ~40px, +8px = 20%)
        eyeRotate: tiltRotate * 0.3, // Olhos inclinam levemente
        mouthOffsetX: mouthOffsetX, // Boca acompanha inclinação
        mouthOffsetY: 0,
        mouthScaleY: mouthScale,
        faceY: useWink ? -1 : 0,
        faceRotate: tiltRotate, // Inclinação da face (simpatia)
        bodyRotate: tiltRotate * 0.6, // Corpo acompanha com 60% da intensidade
        bodyY: bodyY, // Sobe levemente
      };
    },
  },
  {
    id: "squeeze-eyes", label: "Apertar Olhos", emoji: "", durationMs: 5000,
    fn: (t) => {
      // Ciclo de 5 segundos: aperta olhos (fechado1) em t=0.08-0.126 (400-630ms)
      // Funciona melhor com olhos "redondo2" (Grande 1) ou "redondo1" (Redondo 1)
      const cycleT = t;
      let useClosed = false;
      let mouthScale = 1;
      
      // Aperta os olhos entre 8% e 12.6% do ciclo (400ms-630ms em 5000ms) = 230ms
      if (cycleT > 0.08 && cycleT < 0.126) {
        useClosed = true;
        // Suaviza a transição
        const closeProgress = (cycleT - 0.08) / 0.046; // 0→1 dentro do aperto (230ms)
        const closeEase = closeProgress < 0.5 
          ? easeInOut(closeProgress * 2) 
          : 1 - easeInOut((closeProgress - 0.5) * 2);
        mouthScale = 1 - (closeEase * 0.2); // Reduz boca 20% durante o aperto
      } else {
        // Olhos abertos entre apertos
        useClosed = false;
        mouthScale = 1;
      }
      
      return {
        ...BASE,
        eyeIdOverride: useClosed ? "fechado1" : undefined,
        eyeOffsetY: 8, // 20% mais afastado da boca
        mouthOffsetY: 0,
        mouthScaleY: mouthScale,
        faceY: useClosed ? -1 : 0,
      };
    },
  },
  {
    id: "squinting", label: "Cerrando Olhos", emoji: "", durationMs: 5000,
    fn: (t) => {
      // Ciclo de 5 segundos: cerra olhos (semi1) em t=0.08-0.126 (400-630ms)
      // Funciona melhor com olhos "redondo2" (Grande 1) ou "redondo1" (Redondo 1)
      const cycleT = t;
      let useSquint = false;
      let mouthScale = 1;
      
      // Cerra os olhos entre 8% e 12.6% do ciclo (400ms-630ms em 5000ms) = 230ms
      if (cycleT > 0.08 && cycleT < 0.126) {
        useSquint = true;
        // Suaviza a transição
        const squintProgress = (cycleT - 0.08) / 0.046; // 0→1 dentro do cerramento (230ms)
        const squintEase = squintProgress < 0.5 
          ? easeInOut(squintProgress * 2) 
          : 1 - easeInOut((squintProgress - 0.5) * 2);
        mouthScale = 1 - (squintEase * 0.2); // Reduz boca 20% durante o cerramento
      } else {
        // Olhos abertos entre cerramentos
        useSquint = false;
        mouthScale = 1;
      }
      
      return {
        ...BASE,
        eyeIdOverride: useSquint ? "semi1" : undefined,
        eyeOffsetY: 8, // 20% mais afastado da boca
        mouthOffsetY: 0,
        mouthScaleY: mouthScale,
        faceY: useSquint ? -1 : 0,
      };
    },
  },
  {
    id: "thinking", label: "Pensando", emoji: "", durationMs: 4000,
    fn: (t) => {
      // Animação de 4 segundos com olhos alternando entre normal e semi-cerrados
      // Simula concentração/pensamento profundo
      const cycleT = t;
      let eyeState: string | undefined = undefined;
      let headTilt = 0;
      let mouthScale = 1;
      
      // Fase 1 (0-25%): Olhos normais, leve inclinação à esquerda
      if (cycleT < 0.25) {
        const phaseT = cycleT / 0.25;
        headTilt = easeInOut(phaseT) * -3;
        eyeState = undefined;
        mouthScale = 0.95;
      }
      // Fase 2 (25-50%): Cerra olhos (semi1), volta ao centro
      else if (cycleT < 0.50) {
        const phaseT = (cycleT - 0.25) / 0.25;
        headTilt = lerp(-3, 0, easeInOut(phaseT));
        eyeState = "semi1";
        mouthScale = 0.9;
      }
      // Fase 3 (50-75%): Olhos normais, leve inclinação à direita
      else if (cycleT < 0.75) {
        const phaseT = (cycleT - 0.50) / 0.25;
        headTilt = easeInOut(phaseT) * 3;
        eyeState = undefined;
        mouthScale = 0.95;
      }
      // Fase 4 (75-100%): Cerra olhos (semi1), volta ao centro
      else {
        const phaseT = (cycleT - 0.75) / 0.25;
        headTilt = lerp(3, 0, easeInOut(phaseT));
        eyeState = "semi1";
        mouthScale = 0.9;
      }
      
      return {
        ...BASE,
        eyeIdOverride: eyeState,
        faceRotate: headTilt,
        bodyRotate: headTilt * 0.5,
        eyeOffsetY: eyeState === "semi1" ? 6 : 0,
        mouthScaleY: mouthScale,
        mouthOffsetY: eyeState === "semi1" ? 2 : 0,
      };
    },
  },
  {
    id: "sleeping", label: "Dormindo", emoji: "", durationMs: 3200,
    fn: (t) => {
      const zzzPhase = (t * 3) % 1;
      const zzzOpacity = zzzPhase < 0.7 ? zzzPhase / 0.7 : 1 - ((zzzPhase - 0.7) / 0.3);
      const zzzY = -zzzPhase * 25;

      return {
        ...BASE,
        eyeIdOverride: "fechado1",
        bodyRotate: sin01(t) * 2,
        bodyY: sin01(t) * 3,
        faceRotate: sin01(t) * 2,
        faceY: sin01(t) * 3,
        mouthScaleY: 0.8,
        shadowScaleX: 1 + sin01(t) * 0.02,
        showZzz: true,
        zzzOpacity: zzzOpacity * 0.6,
        zzzY: zzzY,
      };
    },
  },
  {
    id: "floating", label: "Flutuando", emoji: "", durationMs: 2800,
    fn: (t) => ({
      ...BASE,
      bodyY: sin01(t) * -10,
      bodyRotate: sin01(t) * 2.5,
      faceY: sin01(t) * -10,
      faceRotate: sin01(t) * 2.5,
      shadowScaleX: 1 - Math.abs(sin01(t)) * 0.25,
      shadowOpacity: lerp(0.06, 0.025, Math.abs(sin01(t))),
    }),
  },
  {
    id: "eye-roll", label: "Revirando", emoji: "", durationMs: 1600,
    fn: (t) => {
      // Rotação completa: começa com pupila apontando pra baixo (180°)
      // e termina com pupila apontando pra cima (360°/0°)
      // Usa "redondo1" (Redondo 1) que tem pupilas bem definidas
      const rotation = lerp(180, 360, easeInOut(t));
      
      return {
        ...BASE,
        eyeIdOverride: "redondo1", // Força uso do Redondo 1 (pupilas claras)
        eyeRotate: rotation, // Rotaciona os olhos 180° (de baixo pra cima)
        eyeOffsetX: 0,
        eyeOffsetY: 0,
        eyeScaleX: 1,
        eyeScaleY: 1,
        mouthScaleY: 0.85 + sin01(t) * 0.15, // Boca levemente animada
        faceY: sin01(t) * 2, // Leve movimento vertical da face
      };
    },
  },
  {
    id: "surprised", label: "Surpresa", emoji: "", durationMs: 2000,
    fn: (t) => {
      // Animação de surpresa: olhos arregalados (Grande 1), corpo recua
      // Não usa olho "wink" (redondo13)
      let eyeScale = 1;
      let bodyY = 0;
      let mouthScaleY = 1;
      let eyeOffsetY = 0;
      
      // Fase 1 (0-30%): Reação inicial - recua e arregala olhos
      if (t < 0.30) {
        const phaseT = t / 0.30;
        const ease = easeInOut(phaseT);
        bodyY = ease * 8; // Recua pra trás
        eyeScale = 1 + ease * 0.3; // Olhos 30% maiores
        mouthScaleY = 1 + ease * 0.5; // Boca abre 50%
        eyeOffsetY = -ease * 4; // Olhos sobem levemente
      }
      // Fase 2 (30-70%): Mantém surpresa
      else if (t < 0.70) {
        bodyY = 8;
        eyeScale = 1.3;
        mouthScaleY = 1.5;
        eyeOffsetY = -4;
      }
      // Fase 3 (70-100%): Retorna ao normal
      else {
        const phaseT = (t - 0.70) / 0.30;
        const ease = easeInOut(phaseT);
        bodyY = lerp(8, 0, ease);
        eyeScale = lerp(1.3, 1, ease);
        mouthScaleY = lerp(1.5, 1, ease);
        eyeOffsetY = lerp(-4, 0, ease);
      }
      
      return {
        ...BASE,
        eyeIdOverride: "redondo2", // Força uso do Grande 1 (olhos arregalados)
        bodyY: bodyY,
        faceY: bodyY,
        eyeScaleX: eyeScale,
        eyeScaleY: eyeScale,
        eyeOffsetY: clampEyeOffsetY(eyeOffsetY),
        mouthScaleY: mouthScaleY,
        shadowScaleX: 1 - (bodyY / 8) * 0.1,
      };
    },
  },
];

export const ANIM_IDS = ANIMATIONS.map(a => a.id);
export type AnimId = typeof ANIM_IDS[number];
export function getAnim(id: string) { return ANIMATIONS.find(a => a.id === id); }
export function getBaseTransforms(): AnimTransforms { return { ...BASE }; }