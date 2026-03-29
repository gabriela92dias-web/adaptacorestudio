import { useState, useRef } from "react";
import { UserCircle, Upload, Download, RefreshCw } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Slider } from "../../ui/slider";

interface AvatarConfig {
  bgColor: string;
  borderColor: string;
  borderWidth: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
}

export function AvatarGenerator() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [config, setConfig] = useState<AvatarConfig>({
    bgColor: "#0f172a",
    borderColor: "#ffffff",
    borderWidth: 8,
    zoom: 100,
    offsetX: 0,
    offsetY: 0,
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 500;
    canvas.width = SIZE;
    canvas.height = SIZE;

    // Clear
    ctx.clearRect(0, 0, SIZE, SIZE);

    // Draw Background
    ctx.fillStyle = config.bgColor;
    ctx.fillRect(0, 0, SIZE, SIZE);

    if (imageSrc) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        // Create Circular clipping path
        ctx.beginPath();
        ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Calculate positioning and zoom
        const aspectRatio = img.width / img.height;
        let drawWidth = SIZE * (config.zoom / 100);
        let drawHeight = SIZE * (config.zoom / 100);

        if (aspectRatio > 1) {
          drawWidth = drawHeight * aspectRatio;
        } else {
          drawHeight = drawWidth / aspectRatio;
        }

        const dx = (SIZE - drawWidth) / 2 + config.offsetX;
        const dy = (SIZE - drawHeight) / 2 + config.offsetY;

        ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
        ctx.restore();

        // Draw Border
        if (config.borderWidth > 0) {
          ctx.beginPath();
          ctx.arc(SIZE / 2, SIZE / 2, (SIZE - config.borderWidth) / 2, 0, Math.PI * 2);
          ctx.lineWidth = config.borderWidth;
          ctx.strokeStyle = config.borderColor;
          ctx.stroke();
        }
      };
      img.src = imageSrc;
    } else {
      // Draw Placeholder
      ctx.beginPath();
      ctx.arc(SIZE / 2, SIZE / 2, (SIZE - config.borderWidth) / 2, 0, Math.PI * 2);
      ctx.lineWidth = config.borderWidth;
      ctx.strokeStyle = config.borderColor;
      ctx.stroke();
    }
  };

  // Redraw when config or image changes
  // Using a small timeout to ensure the image loads if setting state
  setTimeout(drawCanvas, 50);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'avatar-corporativo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <UserCircle className="w-5 h-5 text-foreground" />
        <h2 className="text-xl font-semibold text-foreground">Gerador de Avatar Corporativo</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        Padronize a foto de perfil da sua equipe. Faça o upload da imagem limpa, ajuste o enquadramento e aplique o fundo e a borda institucional para garantir consistência visual em todos os canais de contato.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Formulário Edge (Esquerda) */}
        <div className="col-span-1 lg:col-span-5 space-y-6 p-6 border border-border bg-background rounded-xl shadow-sm">
          
          <div className="space-y-4">
            <Label className="uppercase text-xs tracking-wider text-muted-foreground font-semibold">1. Upload da Imagem</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center gap-3 hover:bg-muted/50 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Clique ou arraste a foto</p>
                <p className="text-xs text-muted-foreground">PNG, JPG (fundo recortado recomendado)</p>
              </div>
              <Input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
            </div>
            {imageSrc && (
              <Button variant="outline" size="sm" onClick={() => setImageSrc(null)} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Remover e Trocar Imagem
              </Button>
            )}
          </div>

          <div className="space-y-5 pt-4 border-t border-border">
            <Label className="uppercase text-xs tracking-wider text-muted-foreground font-semibold">2. Identidade Visual</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cor de Fundo</Label>
                <div className="flex gap-2">
                   <Input 
                    type="color" 
                    value={config.bgColor}
                    onChange={(e) => setConfig({...config, bgColor: e.target.value})}
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    value={config.bgColor}
                    onChange={(e) => setConfig({...config, bgColor: e.target.value})}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cor da Borda</Label>
                <div className="flex gap-2">
                   <Input 
                    type="color" 
                    value={config.borderColor}
                    onChange={(e) => setConfig({...config, borderColor: e.target.value})}
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    value={config.borderColor}
                    onChange={(e) => setConfig({...config, borderColor: e.target.value})}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Espessura da Borda</Label>
                <span className="text-xs text-muted-foreground">{config.borderWidth}px</span>
              </div>
              <Slider 
                value={[config.borderWidth]} 
                min={0} max={40} step={1}
                onValueChange={(vals) => setConfig({...config, borderWidth: vals[0]})}
              />
            </div>
          </div>

          <div className="space-y-5 pt-4 border-t border-border">
            <Label className="uppercase text-xs tracking-wider text-muted-foreground font-semibold">3. Enquadramento</Label>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Zoom</Label>
                <span className="text-xs text-muted-foreground">{config.zoom}%</span>
              </div>
              <Slider 
                value={[config.zoom]} 
                min={50} max={200} step={1}
                onValueChange={(vals) => setConfig({...config, zoom: vals[0]})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Eixo X</Label>
                </div>
                <Slider 
                  value={[config.offsetX]} 
                  min={-200} max={200} step={5}
                  onValueChange={(vals) => setConfig({...config, offsetX: vals[0]})}
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Eixo Y</Label>
                </div>
                <Slider 
                  value={[config.offsetY]} 
                  min={-200} max={200} step={5}
                  onValueChange={(vals) => setConfig({...config, offsetY: vals[0]})}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Live Preview (Direita) */}
        <div className="col-span-1 lg:col-span-7 space-y-4">
          <div className="border border-border rounded-xl p-8 bg-muted/20 flex flex-col items-center justify-center min-h-[450px]">
            <div className="mb-4 text-xs font-mono text-muted-foreground self-start pl-4">Live Preview (500x500px)</div>
            
            <div className="relative shadow-sm rounded-full overflow-hidden w-64 h-64 border border-border">
              <canvas 
                ref={canvasRef} 
                className="w-full h-full cursor-grab active:cursor-grabbing"
              />
              {!imageSrc && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <UserCircle className="w-16 h-16 text-muted-foreground/30" />
                </div>
              )}
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleDownload} className="bg-foreground text-background">
              <Download className="w-4 h-4 mr-2" />
              Baixar Avatar (PNG)
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
