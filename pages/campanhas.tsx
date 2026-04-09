import React, { useState } from "react";
import { Helmet } from "react-helmet";
import {
  Megaphone, RefreshCw, Zap, Blocks, Activity,
  LayoutGrid, ArrowRight, Plus, AlertCircle, CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CriarCampanha } from "../components/brand-studio/criar-campanha";
import { useCampaigns } from "../helpers/useApi";

export default function Campanhas() {
  const { data, isLoading: loading, isError, refetch } = useCampaigns();
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const campaigns = data?.campaigns || [];
  const totalAtivas = campaigns.filter(
    (c: any) => c.status === "active" || c.status === "approved"
  ).length;
  const totalRascunhos = campaigns.filter((c: any) => c.status === "draft").length;

  const TYPE_LABELS: Record<string, string> = {
    seasonal_promotion: "Sazonal",
    awareness: "Awareness",
    brand_engagement: "Engajamento",
    corporate_event: "Evento",
    product_launch: "Lançamento",
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans antialiased flex flex-col items-center">
      <Helmet>
        <title>CoreStudio | Campanhas V8</title>
      </Helmet>

      <div className="w-full max-w-7xl px-6 py-12 flex flex-col gap-10">
        
        {/* -- Header -- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center shadow-lg shadow-[var(--shadow-focus)]">
              <Zap size={26} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--foreground)] uppercase font-heading">
                Campanhas Ativas
              </h1>
              <p className="text-[var(--muted-foreground)] mt-1 font-medium text-sm md:text-base">
                Planejamento estratégico e blueprints estruturais (V8 Engine)
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={loading}
              className="w-11 h-11 flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--surface-foreground)] hover:border-[var(--border-hover)] hover:bg-[var(--card)] transition-all"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => setIsCreating(true)}
              className="h-11 px-6 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md group"
            >
              Gerar Campanha I.A.
              <Plus size={16} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* -- Stats -- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between opacity-70 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider">Volume Total</span>
              <Megaphone size={16} />
            </div>
            <div className="flex items-end gap-3 cursor-default">
              <span className="text-5xl font-black font-heading leading-none text-[var(--foreground)]">{campaigns.length}</span>
              <span className="text-sm font-medium text-[var(--muted-foreground)] mb-1">registros totais</span>
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--success)] rounded-2xl p-6 shadow-sm shadow-[var(--success)]/10">
            <div className="flex items-center justify-between text-[var(--success)] mb-4">
              <span className="text-xs font-bold uppercase tracking-wider">Governança Ativa</span>
              <Activity size={16} />
            </div>
            <div className="flex items-end gap-3 cursor-default">
              <span className="text-5xl font-black font-heading leading-none text-[var(--foreground)]">{totalAtivas}</span>
              <span className="text-sm font-medium text-[var(--muted-foreground)] mb-1">campanhas rodando</span>
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--warning)]/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-[var(--warning)] mb-4">
              <span className="text-xs font-bold uppercase tracking-wider">Blueprint (Rascunho)</span>
              <Blocks size={16} />
            </div>
            <div className="flex items-end gap-3 cursor-default">
              <span className="text-5xl font-black font-heading leading-none text-[var(--foreground)]">{totalRascunhos}</span>
              <span className="text-sm font-medium text-[var(--muted-foreground)] mb-1">aguardando deploy</span>
            </div>
          </div>
        </div>

        {/* -- Body -- */}
        {loading ? (
          <div className="animate-pulse flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[var(--border)] rounded-3xl bg-[var(--surface)]/50">
            <AlertCircle size={48} strokeWidth={1} className="text-[var(--error)] mb-4" />
            <h2 className="text-xl font-bold mb-2">Erro de sincronização</h2>
            <p className="text-[var(--muted-foreground)] mb-6 max-w-md">Não foi possível carregar as campanhas ativas do sistema.</p>
            <button onClick={() => refetch()} className="px-5 py-2 rounded-full border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--surface)] text-sm font-medium flex items-center gap-2">
              <RefreshCw size={14} /> Tentar novamente
            </button>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-[var(--border)] rounded-[2rem] bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
            <div className="w-20 h-20 rounded-full bg-[var(--background)] border border-[var(--border)] mb-6 flex items-center justify-center text-[var(--muted-foreground)]">
              <LayoutGrid size={32} strokeWidth={1} />
            </div>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wide mb-3">Banco Vazio</h2>
            <p className="text-[var(--muted-foreground)] mb-8 max-w-sm text-sm">Nenhuma campanha orquestrada. Inicialize o processo criativo no motor estrutural.</p>
            <button onClick={() => setIsCreating(true)} className="h-12 px-8 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-md">
              INICIAR CONSTRUTOR V8
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {campaigns.map((camp: any) => {
              const dateObj = new Date(camp.createdAt || "");
              const formattedDate = !isNaN(dateObj.getTime())
                ? new Intl.DateTimeFormat("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(dateObj)
                : "Recente";

              const activeModsCount = camp.dna_modulos
                ? Object.values(camp.dna_modulos).filter((v) => v === true).length
                : 0;

              const isDraft = camp.status === "draft";
              const isFinished = camp.status === "completed";

              return (
                <div key={camp.id} className="group relative bg-[var(--card)] border border-[var(--border)] hover:border-[var(--border-hover)] rounded-2xl p-1 md:p-2 transition-all hover:shadow-lg flex flex-col md:flex-row items-stretch overflow-hidden">
                  
                  {/* Left Color Strip based on status */}
                  <div className={`hidden md:block w-2 rounded-xl mr-4 ${isDraft ? 'bg-[var(--warning)]/50' : isFinished ? 'bg-[var(--success)]/20' : 'bg-[var(--success)]'}`} />

                  {/* Status Tag for Mobile */}
                  <div className={`md:hidden w-full h-1 mb-3 ${isDraft ? 'bg-[var(--warning)]/50' : isFinished ? 'bg-[var(--success)]/20' : 'bg-[var(--success)]'}`} />

                  {/* Content Container */}
                  <div className="flex-1 flex flex-col md:flex-row md:items-center p-4 gap-6">
                    
                    {/* Name and Type */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold uppercase truncate pr-4 text-[var(--foreground)]">{camp.name || "Campanha Neutra"}</h3>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[var(--surface)] text-[var(--muted-foreground)] border border-[var(--border)] whitespace-nowrap">
                          {TYPE_LABELS[camp.type] ?? camp.type ?? "Geral"}
                        </span>
                      </div>
                      {camp.objective && (
                        <p className="text-sm font-medium text-[var(--muted-foreground)] truncate max-w-xl">
                          Tese: {camp.objective}
                        </p>
                      )}
                    </div>

                    {/* Timeline & Metadata */}
                    <div className="flex flex-row md:flex-col gap-4 md:gap-1 text-sm text-[var(--muted-foreground)] items-center md:items-end w-full md:w-auto mt-2 md:mt-0 px-2 md:px-0">
                      <span className="font-mono text-xs">{formattedDate}</span>
                      <div className="flex items-center gap-3">
                         {camp.dna_direcao && <span className="uppercase text-[10px] font-bold tracking-wider">{camp.dna_direcao}</span>}
                         <div className="flex items-center gap-1 opacity-60">
                           <Blocks size={12} />
                           <span className="text-xs">{activeModsCount} Mód.</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Action Trigger */}
                  <button 
                    onClick={() => navigate("/coreact")}
                    className="w-full md:w-20 md:border-l border-[var(--border)] flex flex-row md:flex-col items-center justify-center gap-2 p-3 mt-3 md:mt-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors group/btn"
                  >
                     <span className="text-[10px] font-bold uppercase tracking-widest block md:hidden">Abrir Board</span>
                     <ArrowRight size={18} className="transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CriarCampanha
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
      />
    </div>
  );
}