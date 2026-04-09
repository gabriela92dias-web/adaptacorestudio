import React, { useState } from "react";
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
import { useCampaigns } from "../helpers/useApi";

export default function Campanhas() {
  const { data, isLoading: loading, refetch } = useCampaigns();
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const campaigns = data?.campaigns || [];

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <Helmet><title>CoreStudio | Campanhas V8</title></Helmet>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Campanhas</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie o ciclo de vida e a governança das suas ativações V8.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button variant="outline" size="icon" onClick={() => refetch()} disabled={loading}>
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
              <CardDescription>Ativas / Aprovadas</CardDescription>
              <CardTitle className="text-2xl">
                {campaigns.filter(c => c.status === "active" || c.status === "approved").length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Em execução</div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardDescription>Rascunhos</CardDescription>
              <CardTitle className="text-2xl">
                {campaigns.filter(c => c.status === "draft").length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Requer governança</div>
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
                <h2 className="text-lg font-semibold">Nenhuma campanha registrada</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Inicie o Motor V8 para desenhar o blueprint da sua primeira campanha.
                </p>
              </div>
              <Button onClick={() => setIsCreating(true)} className="gap-2 mt-2">
                <Zap className="w-4 h-4" />
                Abrir Construtor
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {campaigns.map((camp) => {
              const dateObj = new Date(camp.createdAt || "");
              const formattedDate = !isNaN(dateObj.getTime())
                ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute:"2-digit" }).format(dateObj)
                : "Recente";

              const activeModsCount = camp.dna_modulos 
                ? Object.values(camp.dna_modulos).filter(v => v === true).length 
                : 0;

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
                              {camp.name || "Campanha sem título"}
                            </h3>
                            <Badge variant="outline" className="text-xs shrink-0">{camp.type}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                            {camp.dna_direcao && <span>Direção: <span className="text-foreground capitalize">{camp.dna_direcao}</span></span>}
                            {camp.dna_experiencia && <span>Exp.: <span className="text-foreground capitalize">{camp.dna_experiencia}</span></span>}
                            <span>Tese: <span className="text-foreground truncate max-w-[200px] inline-block align-bottom">{camp.objective || "-"}</span></span>
                            <span>{formattedDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Blocks className="w-3.5 h-3.5" />
                            <span>{activeModsCount} módulos</span>
                          </div>
                        </div>
                        <Badge variant={camp.status === 'draft' ? 'warning' : 'success'}>
                          {camp.status === 'draft' ? "Rascunho" : "Publicada"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 hidden sm:flex"
                          onClick={() => navigate("/coreact")}
                        >
                          Governança <ArrowRight className="w-3 h-3" />
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