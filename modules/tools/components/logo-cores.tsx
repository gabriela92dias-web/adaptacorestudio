import { useState, useRef, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { 
  Download,
  FileType,
  Image as ImageIcon,
  FileText,
  Palette,
  Layers,
  Shuffle,
  Eye,
  Info,
  Sparkles,
} from "lucide-react";
import { useBrandStudio } from "../../../contexts/brand-context";
import { SampleLogo } from "../../../components/brand-studio/sample-logo";
import { AnimatedLogo } from "../../../components/brand-studio/animated-logo";
import { Player } from "@remotion/player";
import { ColorControls } from "../../../components/brand-studio/color-controls";
import { downloadLogoSVG, downloadLogoPNG, downloadLogoPDFVector, downloadLogoGIF } from "../../../utils/export-logo";
import { toast } from "sonner";
import { InfoNote } from "../../../components/brand-studio/info-note";
import { getAllDesignColors } from "../utils/cartilha-cromatica";
import { useTranslations } from "../../../i18n/use-translations";

type BackgroundType = "white" | "black" | "gray" | "transparent";

/**
 * Logo & Cores - Editor interativo de identidade visual
 */
export function LogoCores() {
  const { layers, updateLayersWithHistory, undo, redo, canUndo, canRedo } = useBrandStudio();
  const [backgroundType, setBackgroundType] = useState<BackgroundType>("white");
  const [viewMode, setViewMode] = useState<"static" | "animated">("static");
  const [animationType, setAnimationType] = useState<"A01" | "A02" | "A03" | "A04">("A03");
  const previewRef = useRef<HTMLDivElement>(null);
  const { tGroup, language, t: rawT } = useTranslations();
  const tools = useMemo(() => tGroup('tools'), [tGroup, language]);
  const actions = useMemo(() => tGroup('actions'), [tGroup, language]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space - Randomizar (não quando focado em input)
      if (e.key === " " && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        handleRandomize();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleRandomize = () => {
    // 🎨 CARTILHA CROMÁTICA ADAPTA - Paleta completa (Verde Core + Color Core)
    const allColors = getAllDesignColors();
    const colorValues = allColors.map(c => c.value);
    
    const newLayers = { ...layers };
    Object.keys(newLayers).forEach((key) => {
      const randomColor = colorValues[Math.floor(Math.random() * colorValues.length)];
      const randomOpacity = Math.random() * 0.5 + 0.5; // 0.5 to 1.0
      newLayers[key] = {
        ...newLayers[key],
        color: randomColor,
        opacity: randomOpacity,
        visible: true, // Mantém visível ao randomizar
      };
    });
    
    updateLayersWithHistory(newLayers);
    toast.success("Cores randomizadas da Cartilha Cromática!", {
      description: "Use Ctrl+Z para desfazer se necessário",
    });
  };

  const handleDownload = async (format: "svg" | "png" | "pdf" | "gif") => {
    const logoElement = previewRef.current?.querySelector("svg");
    if (!logoElement) {
      toast.error("Erro ao exportar", {
        description: "Elemento do logo não encontrado",
      });
      return;
    }

    try {
      toast.loading(`Gerando ${format.toUpperCase()}...`);
      
      if (format === "svg") {
        await downloadLogoSVG(logoElement);
      } else if (format === "png") {
        await downloadLogoPNG(logoElement);
      } else if (format === "pdf") {
        await downloadLogoPDFVector(logoElement);
      } else if (format === "gif") {
        // GIF requer renderização completa em background
        const transparentBg = backgroundType === "transparent";
        await downloadLogoGIF(layers, animationType, transparentBg);
      }
      
      toast.dismiss();
      toast.success("Logo exportado com sucesso!", {
        description: `Arquivo ${format.toUpperCase()} baixado`,
      });
    } catch (error) {
      toast.dismiss();
      toast.error("Erro ao exportar", {
        description: `Não foi possível gerar o arquivo ${format.toUpperCase()}`,
      });
      console.error("Export error:", error);
    }
  };

  const backgroundStyles: Record<BackgroundType, string> = {
    white: "bg-white",
    black: "bg-black",
    gray: "bg-neutral-200",
    transparent: "bg-[repeating-conic-gradient(#e5e5e5_0%_25%,white_0%_50%)] bg-[length:20px_20px]",
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Logo & Cores</h1>
            <p className="text-muted-foreground mt-1">
              Editor interativo de identidade visual - Customize as camadas do logo Adapta
            </p>
          </div>
          <Badge variant="outline" className="gap-2 shrink-0 self-start">
            <Palette className="w-3 h-3" />
            Editor Avançado
          </Badge>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Section */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Preview do Logo
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Visualize as alterações em tempo real
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRandomize}
                      className="gap-1"
                    >
                      <Shuffle className="w-3 h-3" />
                      Randomizar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Control Bar: Background Selector & View Mode Toggle */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Fundo:</span>
                    <div className="flex gap-2">
                      {(["white", "black", "gray", "transparent"] as BackgroundType[]).map((bg) => (
                        <button
                          key={bg}
                          onClick={() => setBackgroundType(bg)}
                          className={`px-3 py-1.5 rounded-lg border-2 text-xs font-medium transition-all ${
                            backgroundType === bg
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background hover:border-primary/50"
                          }`}
                        >
                          {bg === "white" && "Branco"}
                          {bg === "black" && "Preto"}
                          {bg === "gray" && "Cinza"}
                          {bg === "transparent" && "Transparente"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex bg-secondary/50 p-1.5 rounded-xl border border-border/50 shadow-sm w-full sm:w-auto min-w-[280px]">
                    <button
                      onClick={() => setViewMode("static")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === "static" ? "bg-background shadow-md text-foreground scale-[1.02]" : "text-muted-foreground hover:bg-black/5"}`}
                    >
                      Estático
                    </button>
                    <button
                      onClick={() => setViewMode("animated")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === "animated" ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-[1.02] ring-2 ring-primary/20" : "text-muted-foreground hover:bg-black/5"}`}
                    >
                      Animado <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Logo Preview */}
                <div
                  ref={previewRef}
                  className={`rounded-xl border-2 border-border p-8 flex flex-col items-center justify-center min-h-[400px] ${backgroundStyles[backgroundType]}`}
                >

                  {viewMode === "animated" && (
                    <div className="flex gap-2 mb-8">
                       {(["A01", "A02", "A03", "A04"] as const).map(type => (
                         <button
                           key={type}
                           onClick={() => setAnimationType(type)}
                           className={`px-3 py-1 text-xs font-semibold rounded-full border ${animationType === type ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
                         >
                           {type === "A01" && "Pulso"}
                           {type === "A02" && "Gota"}
                           {type === "A03" && "Coração"}
                           {type === "A04" && "Folha"}
                         </button>
                       ))}
                    </div>
                  )}

                  <div className="w-full max-w-sm flex items-center justify-center">
                    {viewMode === "static" ? (
                      <SampleLogo layers={layers} width={320} height={320} className="w-full h-auto" />
                    ) : (
                      <Player
                        component={AnimatedLogo}
                        inputProps={{ layers, width: 320, height: 320, animationType, className: "w-full h-auto" }}
                        durationInFrames={150}
                        fps={30}
                        compositionWidth={320}
                        compositionHeight={320}
                        style={{
                          width: 320,
                          height: 320,
                        }}
                        autoPlay
                        loop
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls Section */}
          <div className="space-y-4">
            <Card className="border-border sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Controles de Cor
                </CardTitle>
                <CardDescription>
                  Ajuste cores e opacidade das camadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ColorControls />
              </CardContent>
            </Card>

            {/* Export Section */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Exportar Logo
                </CardTitle>
                <CardDescription>
                  Baixe o logo nas configurações atuais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleDownload("svg")}
                  className="w-full justify-start gap-2"
                  variant="outline"
                >
                  <FileType className="w-4 h-4" />
                  Baixar SVG (Vetor)
                </Button>
                <Button
                  onClick={() => handleDownload("png")}
                  className="w-full justify-start gap-2"
                  variant="outline"
                >
                  <ImageIcon className="w-4 h-4" />
                  Baixar PNG (4096x4096)
                </Button>
                <Button
                  onClick={() => handleDownload("pdf")}
                  className="w-full justify-start gap-2"
                  variant="outline"
                >
                  <FileText className="w-4 h-4" />
                  Baixar PDF (Vetor)
                </Button>
                
                {viewMode === "animated" && (
                  <Button
                    onClick={() => handleDownload("gif")}
                    className="w-full justify-start gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-all font-semibold"
                    variant="outline"
                  >
                    <Download className="w-4 h-4" />
                    Baixar GIF Animado (Alta Qualidade)
                  </Button>
                )}
                <Separator className="my-4" />
                <InfoNote
                  icon={<Info className="w-4 h-4" />}
                  title="Formatos disponíveis"
                  description="SVG e PDF são vetoriais (escaláveis). PNG é raster em alta resolução."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
