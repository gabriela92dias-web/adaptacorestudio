import React, { useState, useRef } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Copy, Download, Paintbrush, Shuffle, Layers, RefreshCw } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { colorPalette } from "../../../utils/color-data";
import styles from "./gradients.module.css";

// Achatar a paleta para extrair cores utilizáveis fáceis
const allColors = colorPalette.flatMap(g => g.colors).map(c => c.hex);

export function Gradients() {
  const [type, setType] = useState<"linear-gradient" | "radial-gradient">("linear-gradient");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState([
    { color: "#6A8A7A", position: 0 },
    { color: "#FDE2DD", position: 100 }
  ]);
  const previewRef = useRef<HTMLDivElement>(null);

  const generateCss = () => {
    const stopsStr = stops
      .sort((a, b) => a.position - b.position)
      .map(s => `${s.color} ${s.position}%`)
      .join(", ");
    
    if (type === "linear-gradient") {
      return `linear-gradient(${angle}deg, ${stopsStr})`;
    }
    return `radial-gradient(circle, ${stopsStr})`;
  };

  const handleCopyCss = async () => {
    const css = `background: ${generateCss()};`;
    try {
      await navigator.clipboard.writeText(css);
      toast.success("CSS copiado para a área de transferência!");
    } catch {
      toast.error("Erro ao copiar CSS.");
    }
  };

  const handleDownloadPng = async () => {
    if (!previewRef.current) return;
    try {
      toast.info("Processando PNG em alta resolução...");
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 3 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "adapta-gradient.png";
      a.click();
      toast.success("Gradiente exportado com sucesso!");
    } catch (err) {
      toast.error("Falha ao exportar PNG.");
    }
  };

  const randomize = () => {
    const r = () => allColors[Math.floor(Math.random() * allColors.length)];
    setStops([
      { color: r(), position: 0 },
      { color: r(), position: 100 }
    ]);
    setAngle(Math.floor(Math.random() * 360));
  };

  const updateStopColor = (index: number, color: string) => {
    const newStops = [...stops];
    newStops[index].color = color;
    setStops(newStops);
  };

  const updateStopPosition = (index: number, pos: number) => {
    const newStops = [...stops];
    newStops[index].position = pos;
    setStops(newStops);
  };

  const addStop = () => {
    if (stops.length >= 5) return toast.warning("Máximo de 5 cores suportadas");
    setStops([...stops, { color: "#ffffff", position: 50 }]);
  };

  const removeStop = (index: number) => {
    if (stops.length <= 2) return toast.warning("Mínimo de 2 cores por gradiente");
    const newStops = [...stops];
    newStops.splice(index, 1);
    setStops(newStops);
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}><Paintbrush size={32} color="var(--primary)" /> Gerador de Gradientes</h1>
            <p className={styles.subtitle}>Crie e exporte gradientes usando os tokens oficiais da Cartilha Cromática Adapta.</p>
          </div>
          <Button variant="outline" onClick={randomize} style={{ display: 'flex', gap: '8px' }}>
            <Shuffle size={16} /> Surpreenda-me
          </Button>
        </div>

        <div className={styles.mainGrid}>
          {/* Visualização e Saída */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Preview</h2>
              </div>
              <div className={styles.cardContent}>
                <div 
                  className={styles.previewBox} 
                  ref={previewRef}
                  style={{ background: generateCss() }}
                />
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Código CSS</h2>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cssOutput}>
                  background: {generateCss()};
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <Button variant="outline" onClick={handleCopyCss} style={{ flex: 1, gap: "8px" }}>
                    <Copy size={16} /> Copiar CSS
                  </Button>
                  <Button style={{ flex: 1, gap: "8px" }} onClick={handleDownloadPng}>
                    <Download size={16} /> Baixar PNG
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Controles */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}><Layers size={20} /> Configurações</h2>
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.controlsGroup}>
                <span className={styles.label}>Tipo de Gradiente</span>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <Button variant={type === "linear-gradient" ? "default" : "outline"} onClick={() => setType("linear-gradient")} style={{ flex: 1 }}>Linear</Button>
                  <Button variant={type === "radial-gradient" ? "default" : "outline"} onClick={() => setType("radial-gradient")} style={{ flex: 1 }}>Radial</Button>
                </div>
              </div>

              {type === "linear-gradient" && (
                <div className={styles.controlsGroup}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className={styles.label}>Ângulo ({angle}&deg;)</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="360" 
                    value={angle} 
                    onChange={e => setAngle(parseInt(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--primary)" }}
                  />
                </div>
              )}

              <div className={styles.controlsGroup}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className={styles.label}>Cores Híbridas ({stops.length}/5)</span>
                  <Button variant="ghost" size="sm" onClick={addStop} disabled={stops.length >= 5} style={{ height: "auto", padding: "4px 8px" }}>
                    + Adicionar
                  </Button>
                </div>
                
                <div className={styles.colorStopsGrid}>
                  {stops.map((stop, index) => (
                    <div key={index} className={styles.stopRow}>
                      <input 
                        type="color" 
                        value={stop.color} 
                        onChange={e => updateStopColor(index, e.target.value)} 
                        style={{ width: "40px", height: "40px", padding: 0, border: "none", borderRadius: "50%", overflow: "hidden", cursor: "pointer" }}
                      />
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--muted-foreground)" }}>
                          <span>Posição</span>
                          <span>{stop.position}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" max="100" 
                          value={stop.position} 
                          onChange={e => updateStopPosition(index, parseInt(e.target.value))}
                          style={{ width: "100%", accentColor: "var(--primary)" }}
                        />
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeStop(index)} disabled={stops.length <= 2} style={{ color: "var(--destructive)", padding: "4px" }}>
                         Remover
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.controlsGroup}>
                <span className={styles.label}>Paletas Rápidas (Adapta)</span>
                <div className={styles.paletteList}>
                  {allColors.slice(0, 16).map((color, index) => (
                     <div 
                       key={`${color}-${index}`} 
                       className={styles.colorDot} 
                       style={{ backgroundColor: color }} 
                       onClick={() => updateStopColor(0, color)}
                       title={color}
                     />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}