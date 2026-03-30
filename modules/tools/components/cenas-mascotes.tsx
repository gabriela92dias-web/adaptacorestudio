import React, { useState } from "react";
import { ScenePlayback } from "../../../components/brand-studio/scene-playback";
import { SCENE_PRESETS, ScenePreset } from "../../../components/brand-studio/scene-presets";
import { useBrandStudio } from "../../../contexts/brand-context";
import { useTheme } from "next-themes";
import { PlayCircle, Download, CheckCircle2, Film } from "lucide-react";
import { downloadSceneGIF } from "../../../utils/export-logo";
import { toast } from "sonner";

export function CenasMascotes() {
  const { layers } = useBrandStudio();
  const { theme } = useTheme();

  const [activeSceneId, setActiveSceneId] = useState<string>(SCENE_PRESETS[0].id);
  const [isExporting, setIsExporting] = useState(false);
  
  const activeScene = SCENE_PRESETS.find(s => s.id === activeSceneId) || SCENE_PRESETS[0];

  const handleExportScene = async () => {
    setIsExporting(true);
    try {
      await downloadSceneGIF(
        activeScene,
        layers,
        activeScene.background === "transparent"
      );
      toast.success("Cena exportada com sucesso!");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao exportar cena.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
          <Film className="w-8 h-8 text-primary" />
          Cenas Coreografadas
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Visualização em estúdio das interações entre mascotes e o logotipo da Adapta.
          Estes cenários mantêm sincronia e física precisa para exportação de painéis e redes sociais.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Lado Esquerdo: Lista de Presets */}
        <div className="flex-1 max-w-sm flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">Cenários Prontos</h2>
          
          {SCENE_PRESETS.map((scene) => {
            const isActive = scene.id === activeSceneId;
            return (
               <button
                 key={scene.id}
                 onClick={() => setActiveSceneId(scene.id)}
                 className={`
                   text-left p-4 rounded-xl border-2 transition-all 
                   ${isActive ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-border hover:border-border/80 hover:bg-black/5 dark:hover:bg-white/5"}
                 `}
               >
                 <div className="flex justify-between items-start">
                   <h3 className={`font-bold text-lg ${isActive ? "text-primary" : "text-foreground"}`}>
                     {scene.title}
                   </h3>
                   {isActive && <CheckCircle2 className="w-5 h-5 text-primary" />}
                 </div>
                 <p className="text-sm text-muted-foreground mt-2">
                   {scene.description}
                 </p>
                 <p className="text-xs font-medium text-black/40 dark:text-white/40 mt-3 pt-3 border-t border-border">
                   Duração: {scene.durationMs / 1000}s
                 </p>
               </button>
            )
          })}
        </div>

        {/* Lado Direito: Palco e Exportação */}
        <div className="flex-[2] flex flex-col gap-6">
          <div className="bg-card border-2 border-border p-4 rounded-2xl flex flex-col items-center">
             
             {/* Componente Player com a Cena */}
             <ScenePlayback 
               scene={activeScene}
               layers={layers}
               width={600}
               height={600}
               className="shadow-2xl shadow-black/20"
             />

             <div className="mt-6 flex flex-wrap justify-between items-center w-full max-w-[600px]">
               <div className="text-sm text-muted-foreground flex items-center gap-2 font-medium">
                  <PlayCircle className="w-4 h-4" />
                  Visualização Prévia Automatizada (30fps)
               </div>
               
               <button
                 onClick={handleExportScene}
                 disabled={isExporting}
                 className={`
                   px-6 py-3 rounded-full font-bold flex items-center gap-2
                   transition-all text-sm
                   ${isExporting 
                     ? "bg-muted text-muted-foreground cursor-wait" 
                     : "bg-primary text-primary-foreground hover:scale-105 shadow-xl shadow-primary/20"}
                 `}
               >
                 <Download className="w-4 h-4" />
                 {isExporting ? "Gerando Cena..." : "Exportar Cena GIF"}
               </button>
             </div>

          </div>
        </div>

      </div>
    </div>
  );
}
