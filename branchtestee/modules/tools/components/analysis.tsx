/**
 * ═══════════════════════════════════════════════════════════════
 * ADAPTA PLATFORM - Graphic Analysis Page (Ultra Compact)
 * ═══════════════════════════════════════════════════════════════
 */

import { useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Eye, Sparkles, Upload, Target, CheckCircle2, AlertTriangle } from "lucide-react";
import { GraphicAnalyzer } from "../../../components/graphic-analyzer";
import { useTranslations } from "../../../i18n/use-translations";

export function Analysis() {
  const { tGroup } = useTranslations();
  const t = tGroup('tools');
  
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);

  return (
    <div className="p-4 max-w-[1600px] mx-auto">
      <div className="space-y-4">
        {/* Header Compacto */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {t.lang === 'pt' ? 'Análise de Peças Gráficas' : 'Graphic Piece Analysis'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t.lang === 'pt' 
                ? 'Avaliação automatizada via IA segundo as regras da marca Adapta'
                : 'AI-powered automated evaluation according to Adapta brand rules'}
            </p>
          </div>
          <Badge variant="outline" className="gap-1.5 h-7">
            <Sparkles className="w-3 h-3" />
            {t.lang === 'pt' ? 'IA Powered' : 'AI Powered'}
          </Badge>
        </div>

        {/* CTA Principal Ultra Compacto */}
        <Card className="border-border">
          <CardContent className="p-6 bg-muted/30">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-neutral-800 border-2 border-neutral-700 shrink-0">
                <Eye className="w-8 h-8 text-neutral-300" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold mb-1">
                  {t.lang === 'pt' 
                    ? 'Analise suas peças com Inteligência Artificial'
                    : 'Analyze your pieces with Artificial Intelligence'}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t.lang === 'pt'
                    ? 'Upload de material gráfico com análise detalhada: nota, problemas e sugestões de melhoria baseadas nas diretrizes Adapta.'
                    : 'Upload graphic material with detailed analysis: score, issues, and improvement suggestions based on Adapta guidelines.'}
                </p>
              </div>

              <Button
                className="gap-2 h-10 px-6 shrink-0"
                onClick={() => setIsAnalyzerOpen(true)}
              >
                <Upload className="w-4 h-4" />
                {t.lang === 'pt' ? 'Começar Análise' : 'Start Analysis'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Grid Ultra Compacto - Tudo em uma linha */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Col 1: Features + Como Funciona */}
          <div className="space-y-4">
            {/* Features */}
            <Card className="border-border">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-neutral-800 rounded border border-neutral-700">
                    <Eye className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold">5 Categorias de Análise</h3>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      Leitura, hierarquia, cores, tipografia e plataforma
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-neutral-800 rounded border border-neutral-700">
                    <Target className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold">Nota Geral (0-10)</h3>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      Aprovação automática com nota mínima 6.0
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-neutral-800 rounded border border-neutral-700">
                    <Sparkles className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold">Sugestões Inteligentes</h3>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      Problemas + sugestões práticas por categoria
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Como Funciona */}
            <Card className="border-border">
              <CardContent className="p-4">
                <h3 className="text-xs font-bold mb-3">Como Funciona</h3>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center mx-auto mb-1">
                      <span className="text-xs font-bold text-neutral-300">1</span>
                    </div>
                    <p className="text-[9px] font-semibold">Upload</p>
                    <p className="text-[8px] text-muted-foreground leading-tight">Até 10MB</p>
                  </div>
                  <div>
                    <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center mx-auto mb-1">
                      <span className="text-xs font-bold text-neutral-300">2</span>
                    </div>
                    <p className="text-[9px] font-semibold">Configurar</p>
                    <p className="text-[8px] text-muted-foreground leading-tight">Plataforma</p>
                  </div>
                  <div>
                    <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center mx-auto mb-1">
                      <span className="text-xs font-bold text-neutral-300">3</span>
                    </div>
                    <p className="text-[9px] font-semibold">Analisar</p>
                    <p className="text-[8px] text-muted-foreground leading-tight">IA processa</p>
                  </div>
                  <div>
                    <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center mx-auto mb-1">
                      <span className="text-xs font-bold text-neutral-300">4</span>
                    </div>
                    <p className="text-[9px] font-semibold">Resultados</p>
                    <p className="text-[8px] text-muted-foreground leading-tight">Nota + dicas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Col 2: Plataformas */}
          <Card className="border-border">
            <CardContent className="p-4">
              <h3 className="text-xs font-bold mb-3">Plataformas Suportadas</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Instagram Post", desc: "1080 x 1080" },
                  { label: "Carrossel", desc: "Slides" },
                  { label: "Reels/Stories", desc: "1080 x 1920" },
                  { label: "LinkedIn", desc: "1200 x 627" },
                  { label: "Apresentação", desc: "16:9" },
                  { label: "Impresso", desc: "CMYK" },
                  { label: "Email", desc: "600px" },
                  { label: "Outros", desc: "Genérico" },
                ].map((platform, idx) => (
                  <div key={idx} className="p-2 bg-neutral-800/50 rounded border border-neutral-700">
                    <p className="text-[10px] font-semibold leading-tight">{platform.label}</p>
                    <p className="text-[9px] text-muted-foreground">{platform.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Col 3: Critérios + Alertas */}
          <div className="space-y-4">
            <Card className="border-border bg-neutral-800/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-neutral-400" />
                  <h3 className="text-xs font-bold">Critérios de Aprovação</h3>
                </div>
                <div className="space-y-1 text-[10px]">
                  <p className="text-foreground">• Nota geral ≥ 6.0</p>
                  <p className="text-foreground">• Cores da paleta oficial</p>
                  <p className="text-foreground">• Tipografia legível</p>
                  <p className="text-foreground">• Hierarquia clara</p>
                  <p className="text-foreground">• Assinatura Adapta</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-neutral-800/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4 text-neutral-400" />
                  <h3 className="text-xs font-bold">Alertas Comuns</h3>
                </div>
                <div className="space-y-1 text-[10px]">
                  <p className="text-foreground">• Contraste insuficiente</p>
                  <p className="text-foreground">• Texto pequeno mobile</p>
                  <p className="text-foreground">• Zonas de cobertura</p>
                  <p className="text-foreground">• Falta assinatura</p>
                  <p className="text-foreground">• Cores fora do padrão</p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      {/* Analyzer Modal */}
      <GraphicAnalyzer isOpen={isAnalyzerOpen} onClose={() => setIsAnalyzerOpen(false)} />
    </div>
  );
}