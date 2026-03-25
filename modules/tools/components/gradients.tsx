import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Info, Palette, Zap } from "lucide-react";
import { useTranslations } from "../../../i18n/use-translations";

export function Gradients() {
  const { tGroup } = useTranslations();
  const t = tGroup('tools');
  
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="p-6 max-w-[1800px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {t.lang === 'pt' ? 'Motor de Gradientes' : 'Gradient Engine'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t.lang === 'pt' 
              ? 'Sistema de gradientes - Aguardando configuração das regras'
              : 'Gradient system - Awaiting rule configuration'}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowInfo(!showInfo)}
          className="gap-2"
        >
          <Info className="w-4 h-4" />
          Info
        </Button>
      </div>

      {/* Info Card */}
      {showInfo && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              {t.lang === 'pt' ? 'Status do Motor' : 'Engine Status'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t.lang === 'pt'
                ? 'O motor de gradientes está pronto para receber as novas regras de geração automática. As 9 famílias de cores da Cartilha Cromática estão disponíveis.'
                : 'The gradient engine is ready to receive new automatic generation rules. The 9 color families from the Color Guide are available.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Status Card */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <CardTitle>
              {t.lang === 'pt' ? 'Sistema em Aguardo' : 'System on Standby'}
            </CardTitle>
          </div>
          <CardDescription>
            {t.lang === 'pt' 
              ? 'Pronto para receber novas regras de gradientes'
              : 'Ready to receive new gradient rules'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              {t.lang === 'pt'
                ? 'O sistema está preparado para gerar gradientes baseados na Cartilha Cromática.'
                : 'The system is ready to generate gradients based on the Color Guide.'}
            </p>
            <p>
              {t.lang === 'pt'
                ? 'Aguardando definição das regras de geração.'
                : 'Awaiting definition of generation rules.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}