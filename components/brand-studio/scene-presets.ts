import { MascotConfig } from "../../imports/MascotSVG";

export type BackgroundType = "white" | "black" | "gray" | "transparent";

export interface SceneMascotInfo {
  config: MascotConfig;
  animId: string; // ex: "nod", "bounce", "dancing", "sleeping"
  scale: number;
  x: number; // pos relativa em percentual (0-100)
  y: number; // pos relativa em percentual (0-100)
}

export interface SceneLogoInfo {
  animationType: "A01" | "A02" | "A03" | "A04";
  scale: number;
  x: number; // pos relativa em percentual (0-100)
  y: number; // pos relativa em percentual (0-100)
}

export interface ScenePreset {
  id: string;
  title: string;
  description: string;
  background: BackgroundType;
  durationMs: number; // Duração do looping principal (baseado na soma/MMC ou no mascote-chave)
  mascots: SceneMascotInfo[];
  logo: SceneLogoInfo;
}

// Configuração de Mascote Base Padrão Adapta (Verde Core)
const defaultMascot: MascotConfig = {
  bodyId: "forma2",
  eyeId: "redondo4",
  mouthId: "boca2",
  faceOffsetY: -12,
  noiseAmount: 20,
  bodyColor: "#BCDE4B",
};

// Configuração de Mascote Secundário (Rosa/Colorido)
const secondaryMascot: MascotConfig = {
  bodyId: "forma8",
  eyeId: "redondo1",
  mouthId: "boca4",
  faceOffsetY: -5,
  noiseAmount: 10,
  bodyColor: "#F4A3BE",
};

export const SCENE_PRESETS: ScenePreset[] = [
  {
    id: "scene-discovery",
    title: "1. A Descoberta",
    description: "Mascote observando o Logotipo flutuar com pulsação vital.",
    background: "transparent",
    durationMs: 5000, // Cerração durando 5s
    logo: {
      animationType: "A01", // Pulsando
      scale: 0.8,
      x: 70, // Canto superior direito
      y: 40,
    },
    mascots: [
      {
        config: defaultMascot,
        animId: "squinting", // Cerrando os olhos investigando
        scale: 1.1,
        x: 30, // Canto inferior esquerdo
        y: 60,
      }
    ]
  },
  {
    id: "scene-dance",
    title: "2. Festa da Marca",
    description: "Dois mascotes dançando ao redor do Logotipo Coração.",
    background: "transparent",
    durationMs: 2400, // Dance é 1200ms, então 2400 cobre 2 loops perfeitos
    logo: {
      animationType: "A03", // Coração (animado apaixonante)
      scale: 0.9,
      x: 50, // Centro absoluto
      y: 50,
    },
    mascots: [
      {
        config: defaultMascot,
        animId: "dance",
        scale: 0.85,
        x: 20,
        y: 65,
      },
      {
        config: secondaryMascot,
        animId: "dance",
        scale: 0.65,
        x: 80,
        y: 65,
      }
    ]
  },
  {
    id: "scene-nap",
    title: "3. Soneca da Tarde",
    description: "Um descanso merecido debaixo do Logotipo folha.",
    background: "transparent",
    durationMs: 3200, // Sleeping duration
    logo: {
      animationType: "A04", // Folha (calma e balançando levemente)
      scale: 1,
      x: 50,
      y: 30,
    },
    mascots: [
      {
        config: defaultMascot,
        animId: "sleeping",
        scale: 1,
        x: 50, // Bem abaixo do logo
        y: 75,
      }
    ]
  }
];
