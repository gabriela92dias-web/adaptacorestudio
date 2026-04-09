import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/Badge";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/Skeleton";
import {
  Megaphone, RefreshCw, Zap, Blocks, Activity,
  LayoutGrid, ArrowRight, Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CriarCampanha } from "../components/brand-studio/criar-campanha";


interface V8Campaign {
  id: string;
  objetivo_primario: string;
  direcao: string;
  experiencia: string;
  segmento_publico: string;
  created_at: string;
  modulos?: any[];
  gates?: any[];
}

export default function Campanhas() {
  const [campaigns, setCampaigns] = useState<V8Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();


  const fetchCampaigns = () => {
    setLoading(true);
    fetch("/_api/v8/list")
      .then(res => res.json())
      .then(data => setCampaigns(data.campaigns || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCampaigns(); }, []);

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <Helmet><title>CoreStudio | Campanhas V8</title></Helmet>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Campanhas</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie o ciclo de vida, módulos e gates das suas ativações.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button variant="outline" size="icon" onClick={fetchCampaigns} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button className="gap-2" onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4" />
              Nova Campanha
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardDescription>Total de Campanhas</CardDescription>
              <CardTitle className="text-2xl">{campaigns.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Motor V8 ativo</div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardDescription>Prontas para Publicar</CardDescription>
              <CardTitle className="text-2xl">
                {campaigns.filter(c => {
                  const m = c.modulos || [];
                  const g = c.gates || [];
                  return m.some(mod => mod.status === "on") && g.every(gate => gate.ok);
                }).length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Sem gates pendentes</div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardDescription>Com Gates Bloqueados</CardDescription>
              <CardTitle className="text-2xl">
                {campaigns.filter(c => (c.gates || []).some(g => !g.ok)).length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Requer atenção</div>
            </CardContent>
          </Card>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} style={{ height: 100, borderRadius: 12 }} />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
              <div className="p-4 rounded-xl bg-muted border">
                <LayoutGrid className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Nenhuma campanha ativa</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Inicie o Coreact para desenhar seu primeiro escopo V8.
                </p>
              </div>
              <Button onClick={() => navigate("/coreact")} className="gap-2 mt-2">
                <Zap className="w-4 h-4" />
                Abrir Construtor
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {campaigns.map((camp) => {
              const activeMods = (camp.modulos || []).filter(m => m.status === "on").length;
              const pendingGates = (camp.gates || []).filter(g => !g.ok).length;
              const isReady = activeMods > 0 && pendingGates === 0;
              const dateObj = new Date(camp.created_at);
              const formattedDate = !isNaN(dateObj.getTime())
                ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(dateObj)
                : "Recente";

              return (
                <Card key={camp.id} className="border-border hover:border-border/80 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="p-2.5 rounded-lg bg-muted border shrink-0">
                          <Megaphone className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold truncate">
                              {camp.objetivo_primario || "Campanha sem título"}
                            </h3>
                            <Badge variant="outline" className="text-xs shrink-0">V8 Native</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                            {camp.direcao && <span>Direção: <span className="text-foreground">{camp.direcao}</span></span>}
                            {camp.experiencia && <span>Exp.: <span className="text-foreground">{camp.experiencia}</span></span>}
                            <span>Criado em {formattedDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Blocks className="w-3.5 h-3.5" />
                            <span>{activeMods} módulos</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5" />
                            <span>{pendingGates} gates</span>
                          </div>
                        </div>
                        <Badge variant={isReady ? "success" : "warning"}>
                          {isReady ? "Pronta" : "Pendente"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 hidden sm:flex"
                          onClick={() => navigate("/v8-dashboard")}
                        >
                          Dashboard <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <CriarCampanha isOpen={isCreating} onClose={() => setIsCreating(false)} />
    </div>
  );
}