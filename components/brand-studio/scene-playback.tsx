import React, { useRef } from "react";
import { Player } from "@remotion/player";
import { useCurrentFrame } from "remotion";
import { AnimatedLogo } from "./animated-logo";
import { MascotSVG } from "../../imports/MascotSVG";
import { getAnim } from "../../imports/animations";
import { ScenePreset } from "./scene-presets";

const FPS = 30;

export interface ScenePlaybackProps {
  scene: ScenePreset;
  layers: Record<string, any>;
  width?: number;
  height?: number;
  className?: string;
}

// O miolo que renderiza todos os vetores matematicamente no frame atual
export const RawSceneCompositor: React.FC<{
  scene: ScenePreset;
  layers: Record<string, any>;
  frameOverride?: number;
}> = ({ scene, layers, frameOverride }) => {
  let defaultFrame = 0;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    defaultFrame = useCurrentFrame();
  } catch (e) {
    // ignora se chamado pelo renderToStaticMarkup sem Player
  }
  
  const frame = frameOverride !== undefined ? frameOverride : defaultFrame;
  const timeMs = frame * (1000 / FPS);

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      {/* 1. O Logotipo Animado (Flubber + Core Layers) no Z-Index 1 */}
      <div 
        className="absolute transition-all"
        style={{
          left: `${scene.logo.x}%`,
          top: `${scene.logo.y}%`,
          transform: `translate(-50%, -50%) scale(${scene.logo.scale})`,
          zIndex: 10
        }}
      >
        <AnimatedLogo 
          animationType={scene.logo.animationType}
          layers={layers}
          width={400} // Tamanho base generoso, a escala é feita pelo CSS acima
          height={400}
          frameOverride={frame}
        />
      </div>

      {/* 2. Os Mascotes (Math Transforms) no Z-Index 20 e adiante */}
      {scene.mascots.map((mascot, i) => {
        const animDef = getAnim(mascot.animId);
        // Calcula o t: tempo local do mascote rodando em loop na sua própria duração
        // Mesmo em cenas híbridas, cada mascote pode rodar fora de sync ou em sync perfeito
        // dependendo do durationMs do Preset da Cena!
        let t = 0;
        if (animDef) {
           t = (timeMs % animDef.durationMs) / animDef.durationMs;
        }
        
        const animTransforms = animDef ? animDef.fn(t) : undefined;
        
        return (
          <div 
            key={i}
            className="absolute transition-all"
            style={{
              left: `${mascot.x}%`,
              top: `${mascot.y}%`,
              transform: `translate(-50%, -50%) scale(${mascot.scale})`,
              zIndex: 20 + i
            }}
          >
            <div style={{ width: 400, height: 400 }}>
               <MascotSVG 
                 config={mascot.config} 
                 anim={animTransforms} 
               />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const ScenePlayback: React.FC<ScenePlaybackProps> = ({
  scene,
  layers,
  width = 600,
  height = 600,
  className
}) => {
  // O Remotion Player calcula totalFrames baseado na cena geral
  const totalFrames = Math.ceil((scene.durationMs / 1000) * FPS);

  const bgStyles: Record<string, string> = {
    white: "bg-white",
    black: "bg-black",
    gray: "bg-neutral-200",
    transparent: "bg-[repeating-conic-gradient(#e5e5e5_0%_25%,white_0%_50%)] bg-[length:20px_20px]",
  };

  return (
    <div className={`rounded-xl border-2 border-border overflow-hidden flex items-center justify-center ${bgStyles[scene.background] || "white"} ${className}`}>
      <Player
        component={RawSceneCompositor}
        inputProps={{ scene, layers }}
        durationInFrames={totalFrames}
        fps={FPS}
        compositionWidth={1080}  // Virtual resolution base is 1080x1080
        compositionHeight={1080}
        style={{
          width: width,
          height: height,
        }}
        autoPlay
        loop
      />
    </div>
  );
};
