import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  BarChart3, TrendingUp, Users, Megaphone, Clock, Construction,
} from "lucide-react";

const mockStats = [
  { label: "Campanhas este mês", value: "4", icon: Megaphone, note: "Motor V8" },
  { label: "Alcance estimado", value: "—", icon: Users, note: "Em breve" },
  { label: "Engajamento médio", value: "—", icon: TrendingUp, note: "Em breve" },
  { label: "Última atualização", value: "—", icon: Clock, note: "Em breve" },
];

const comingSoon = [
  "Relatório de performance por campanha",
  "Comparativo de períodos",
  "Métricas de alcance e engajamento por canal",
  "Histórico de publicações e agendamentos",
  "Export para PDF e planilha",
];

export default function Relatorios() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <Helmet><title>CoreStudio | Relatórios</title></Helmet>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Relatórios</h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe a performance das suas campanhas e ativações.
            </p>
          </div>
          <Badge variant="outline" className="gap-2 self-start">
            <Construction className="w-3 h-3" />
            Em construção
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {mockStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription>{stat.label}</CardDescription>
                    <div className="p-1.5 rounded bg-muted border">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{stat.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">{stat.note}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main placeholder */}
        <Card className="border-border">
          <CardContent className="py-16 flex flex-col items-center gap-6 text-center">
            <div className="p-4 rounded-xl bg-muted border">
              <BarChart3 className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="max-w-md">
              <h2 className="text-lg font-semibold mb-2">Módulo de Relatórios</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Esta seção está em desenvolvimento. Em breve você poderá visualizar
                dados detalhados de performance por campanha, canal e período.
              </p>
            </div>
            <div className="w-full max-w-sm text-left space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">O que vem por aí</p>
              {comingSoon.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 mt-2 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" disabled className="gap-2 mt-2">
              <BarChart3 className="w-4 h-4" />
              Ver Relatórios (em breve)
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
