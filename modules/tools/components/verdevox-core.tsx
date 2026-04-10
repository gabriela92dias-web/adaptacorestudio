import { useState, useRef } from "react";
import { Mic, Upload, Download, Play, Pause, Volume2, Wand2, Settings } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Slider } from "../../../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useTranslations } from "../../../i18n/use-translations";

export function VerdeVoxCore() {
  const { tGroup } = useTranslations();
  const t = tGroup('tools');
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [volume, setVolume] = useState([80]);
  const [pitch, setPitch] = useState([0]);
  const [speed, setSpeed] = useState([1]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      console.log(t.lang === 'pt' ? "Áudio carregado:" : "Audio loaded:", file.name);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    console.log(isRecording 
      ? (t.lang === 'pt' ? "Gravação pausada" : "Recording paused")
      : (t.lang === 'pt' ? "Gravação iniciada" : "Recording started")
    );
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    console.log(isPlaying 
      ? (t.lang === 'pt' ? "Reprodução pausada" : "Playback paused")
      : (t.lang === 'pt' ? "Reprodução iniciada" : "Playback started")
    );
  };

  const handleExport = () => {
    console.log(t.lang === 'pt' ? "Exportando áudio..." : "Exporting audio...");
    alert(t.lang === 'pt' 
      ? "Exportação de áudio será implementada em breve" 
      : "Audio export will be implemented soon"
    );
  };

  return (
    <div className="h-full p-8 overflow-auto bg-neutral-950">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neutral-800 border border-neutral-700">
              <Mic className="w-8 h-8 text-neutral-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{t.verdeVoxTitle}</h1>
              <p className="text-neutral-400">{t.verdeVoxDescription}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Painel de Gravação/Upload */}
          <Card className="p-6 border-neutral-700 bg-neutral-900 space-y-6">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Fonte de Áudio</h2>
              
              {/* Upload de Arquivo */}
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-neutral-700 hover:bg-neutral-600 text-white border border-neutral-600"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Fazer Upload de Áudio
                </Button>
                
                {audioFile && (
                  <div className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg">
                    <p className="text-sm text-neutral-400">
                      Arquivo: <span className="text-white">{audioFile.name}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Divisor */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-neutral-700"></div>
                <span className="text-sm text-neutral-500">ou</span>
                <div className="flex-1 h-px bg-neutral-700"></div>
              </div>

              {/* Gravação */}
              <div className="space-y-3">
                <Button
                  onClick={toggleRecording}
                  className={`w-full ${
                    isRecording 
                      ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/50" 
                      : "bg-neutral-700 hover:bg-neutral-600 text-white border-neutral-600"
                  }`}
                  variant={isRecording ? "outline" : "default"}
                >
                  <Mic className={`w-4 h-4 mr-2 ${isRecording ? "animate-pulse" : ""}`} />
                  {isRecording ? "Parar Gravação" : "Gravar Áudio"}
                </Button>

                {isRecording && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-red-400">Gravando...</span>
                      <span className="text-sm text-white font-mono">00:00</span>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 w-1/4 animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Painel de Reprodução */}
          <Card className="p-6 border-neutral-700 bg-neutral-900 space-y-6">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Reprodução</h2>
              
              {/* Forma de onda visual */}
              <div className="h-32 bg-neutral-800 border border-neutral-700 rounded-lg flex items-end justify-center gap-1 p-4">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-neutral-500 rounded-full transition-all"
                    style={{
                      height: `${Math.random() * 100}%`,
                      opacity: isPlaying ? 1 : 0.3
                    }}
                  />
                ))}
              </div>

              {/* Controles de reprodução */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={togglePlayback}
                  disabled={!audioFile && !isRecording}
                  className="bg-neutral-700 hover:bg-neutral-600 text-white border border-neutral-600"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-neutral-400" />
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-neutral-400 w-12 text-right">{volume}%</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Painel de Edição */}
        <Card className="p-6 border-neutral-700 bg-neutral-900 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-neutral-400" />
            <h2 className="text-xl font-semibold text-white">Parâmetros de Edição</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pitch */}
            <div className="space-y-3">
              <Label className="text-white">Tom (Pitch)</Label>
              <div className="space-y-2">
                <Slider
                  value={pitch}
                  onValueChange={setPitch}
                  min={-12}
                  max={12}
                  step={1}
                  className="flex-1"
                />
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>-12</span>
                  <span className="text-white">{pitch[0] > 0 ? "+" : ""}{pitch[0]}</span>
                  <span>+12</span>
                </div>
              </div>
            </div>

            {/* Velocidade */}
            <div className="space-y-3">
              <Label className="text-white">Velocidade</Label>
              <div className="space-y-2">
                <Slider
                  value={speed}
                  onValueChange={setSpeed}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="flex-1"
                />
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>0.5x</span>
                  <span className="text-white">{speed[0].toFixed(1)}x</span>
                  <span>2.0x</span>
                </div>
              </div>
            </div>

            {/* Efeito */}
            <div className="space-y-3">
              <Label className="text-white">Efeito de Voz</Label>
              <Select defaultValue="natural">
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="natural">Natural</SelectItem>
                  <SelectItem value="robotic">Robótico</SelectItem>
                  <SelectItem value="echo">Echo</SelectItem>
                  <SelectItem value="reverb">Reverberação</SelectItem>
                  <SelectItem value="deep">Voz Grave</SelectItem>
                  <SelectItem value="high">Voz Aguda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3 pt-4 border-t border-neutral-700">
            <Button
              onClick={handleExport}
              disabled={!audioFile && !isRecording}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Áudio
            </Button>
            
            <Button
              disabled={!audioFile && !isRecording}
              variant="outline"
              className="border-neutral-600 text-neutral-400 hover:bg-neutral-700"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Aplicar Efeitos IA
            </Button>
          </div>
        </Card>

        {/* Info Footer */}
        <div className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg">
          <p className="text-sm text-neutral-400">
            <span className="text-neutral-500">Dica:</span> O VerdeVox Core permite gravar, editar e processar áudios com qualidade profissional. 
            Use os parâmetros de edição para ajustar tom, velocidade e aplicar efeitos especiais.
          </p>
        </div>
      </div>
    </div>
  );
}