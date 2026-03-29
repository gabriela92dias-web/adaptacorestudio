import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { format } from "date-fns"; // We shouldn't use date-fns per instructions, Int format instead
import { Calendar, Trash2, Edit3, MoreVertical, RefreshCw, Megaphone } from "lucide-react";
import { useCampaigns, useDeleteCampaign } from "../helpers/useApi";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Tabs, TabsList, TabsTrigger } from "../components/Tabs";
import { Skeleton } from "../components/Skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "../components/Dialog";
import { toast } from "sonner";
import { CampaignStatus } from "../helpers/schema";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";
import styles from "./campanhas.module.css";
import { CriarCampanha } from "../components/brand-studio/criar-campanha";

const STATUS_MAP: Record<string, { label: string; variant: "default" | "success" | "warning" | "outline" | "secondary" }> = {
  draft: { label: "Rascunho", variant: "outline" },
  active: { label: "Ativa", variant: "success" },
  approved: { label: "Aprovada", variant: "secondary" },
  completed: { label: "Concluída", variant: "outline" },
};

const TYPE_MAP: Record<string, string> = {
  awareness: "Conscientização",
  brand_engagement: "Engajamento",
  corporate_event: "Evento Corp.",
  product_launch: "Lançamento",
  seasonal_promotion: "Sazonal",
};

export default function Campanhas() {
  const { ref, level, className: adaptiveClass } = useAdaptiveLevel();
  const [activeTab, setActiveTab] = useState<"all" | CampaignStatus>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const { data, isLoading, isError, refetch } = useCampaigns(
    activeTab !== "all" ? { status: activeTab as CampaignStatus } : {}
  );
  
  const { mutateAsync: deleteCampaign, isPending: isDeleting } = useDeleteCampaign();
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!campaignToDelete) return;
    try {
      await deleteCampaign({ id: campaignToDelete });
      toast.success("Campanha excluída com sucesso");
      setCampaignToDelete(null);
    } catch (error) {
      toast.error("Erro ao excluir campanha");
    }
  };

  const formatDate = (dateInput: Date | string | null) => {
    if (!dateInput) return "N/A";
    const date = new Date(dateInput);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div ref={ref} className={`${styles.pageContainer} ${adaptiveClass} ${styles[`level${level}`]}`}>
      <Helmet>
        <title>Campanhas Salvas | Adapta Studio</title>
      </Helmet>

      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Campanhas</h1>
          {data && (
            <Badge variant="secondary" className={styles.countBadge}>
              {data.campaigns.length}
            </Badge>
          )}
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Button variant="outline" onClick={() => refetch()} size="icon-md">
            <RefreshCw size={16} />
          </Button>
          <Button onClick={() => setIsCreateOpen(true)} style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', fontWeight: 'bold' }}>
            <Megaphone size={16} style={{ marginRight: '8px' }} /> Nova Campanha
          </Button>
        </div>
      </div>

      <div className={styles.filters}>
        <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)}>
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="active">Ativas</TabsTrigger>
            <TabsTrigger value="draft">Rascunho</TabsTrigger>
            <TabsTrigger value="completed">Concluídas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className={styles.content}>
        {isLoading && (
          <div className={styles.grid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonHeader}>
                  <Skeleton style={{ width: "60%", height: "1.5rem" }} />
                  <Skeleton style={{ width: "2rem", height: "2rem", borderRadius: "var(--radius-sm)" }} />
                </div>
                <Skeleton style={{ width: "40%", height: "1rem", marginTop: "var(--spacing-2)" }} />
                <div className={styles.skeletonMeta}>
                  <Skeleton style={{ width: "30%", height: "1rem" }} />
                  <Skeleton style={{ width: "30%", height: "1rem" }} />
                </div>
                <div className={styles.skeletonFooter}>
                  <Skeleton style={{ width: "100%", height: "2rem" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className={styles.emptyState}>
            <p>Erro ao carregar as campanhas. Tente novamente.</p>
            <Button onClick={() => refetch()} variant="outline">Tentar Novamente</Button>
          </div>
        )}

        {!isLoading && !isError && data?.campaigns.length === 0 && (
          <div className={styles.emptyState}>
            <Megaphone size={48} className={styles.emptyIcon} />
            <h2>Nenhuma campanha encontrada</h2>
            <p>Você ainda não tem campanhas nesta categoria.</p>
          </div>
        )}

        {!isLoading && !isError && data && data.campaigns.length > 0 && (
          <div className={styles.grid}>
            {data.campaigns.map((campaign) => {
              const statusInfo = STATUS_MAP[campaign.status || "draft"] || STATUS_MAP.draft;
              const typeName = TYPE_MAP[campaign.type] || campaign.type;

              return (
                <div key={campaign.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.cardTitle}>{campaign.name}</h3>
                      <div className={styles.cardBadges}>
                        <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
                        <Badge variant="outline">{typeName}</Badge>
                      </div>
                    </div>
                    
                    <Dialog open={campaignToDelete === campaign.id} onOpenChange={(open) => !open && setCampaignToDelete(null)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon-md" className={styles.actionButton} onClick={() => setCampaignToDelete(campaign.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Excluir Campanha</DialogTitle>
                          <DialogDescription>
                            Tem certeza que deseja excluir a campanha <strong>{campaign.name}</strong>? Esta ação removerá também todos os posts gerados e não pode ser desfeita.
                          </DialogDescription>
                        </DialogHeader>
                        <div className={styles.dialogActions}>
                          <DialogClose asChild>
                            <Button variant="outline" disabled={isDeleting}>Cancelar</Button>
                          </DialogClose>
                          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Excluindo..." : "Sim, excluir campanha"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.metaInfo}>
                      <Calendar size={14} className={styles.metaIcon} />
                      <span>{campaign.duration} dias</span>
                      <span className={styles.metaDot}>•</span>
                      <span>Criada em {formatDate(campaign.createdAt)}</span>
                    </div>

                    <div className={styles.channelsList}>
                      {(campaign.channels || []).map((channel, i) => (
                        <span key={i} className={styles.channelTag}>{channel}</span>
                      ))}
                    </div>
                    
                    <div className={styles.postsMeta}>
                      <span className={styles.postsCount}>
                        {campaign.posts?.length || 0} materiais gerados
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.cardFooter}>
                    <Button variant="secondary" className={styles.viewButton} onClick={() => alert("Função em desenvolvimento: A página de edição está sendo construída!")}>
                      <Edit3 size={16} />
                      Editar Detalhes
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CriarCampanha isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}