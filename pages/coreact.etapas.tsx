import React, { useState, useRef, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet";
import { usePermissions } from "../helpers/usePermissions";
import { PermissionWall } from "../components/PermissionWall";
import { useStages, useCreateStage, useUpdateStage, useProjects } from "../helpers/useCoreActApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/Dialog";
import { Input } from "../components/Input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/Select";
import { Button } from "../components/Button";
import { toast } from "sonner";
import styles from "./coreact.etapas.module.css";
import { Plus } from "lucide-react";

export default function CoreactEtapas() {
  const { hasPermission } = usePermissions();
  const { data: stagesData, isLoading } = useStages();
  const { data: projectsData } = useProjects();
  const createStage = useCreateStage();
  const updateStage = useUpdateStage();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const milestones = useMemo(() => {
    if (!stagesData?.stages) return [];
    return stagesData.stages.map(stage => {
      const project = projectsData?.projects?.find(p => p.id === stage.projectId);
      return {
        id: stage.id,
        name: stage.name,
        project: project?.name || "Projeto Desconhecido",
        dateRange: stage.startDate ? `${new Date(stage.startDate).toLocaleDateString('pt-BR')} - ${stage.endDate ? new Date(stage.endDate).toLocaleDateString('pt-BR') : 'Sem data'}` : 'Não definido',
        progress: 0, // Real progress would need tasks associated with stage. For now, 0.
        health: stage.status === 'completed' ? 'OnTrack' : stage.status === 'in_progress' ? 'Delayed' : 'AtRisk',
        status: stage.status || 'pending',
      };
    });
  }, [stagesData, projectsData]);
  
  // Virtualization State
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  // Constants for Virtualization
  const ROW_HEIGHT = 86; // Approximate height of .row from CSS module
  const CONTAINER_HEIGHT = 600; // Fixed scroll window

  useEffect(() => {
    const handleScroll = (e: Event) => {
      setScrollTop((e.target as HTMLElement).scrollTop);
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (!hasPermission("coreactEtapas")) {
    return <PermissionWall moduleName="Etapas" />;
  }

  const getHealthLabel = (code: string) => {
    switch (code) {
      case "OnTrack": return "No Prazo";
      case "Delayed": return "Atrasado";
      case "AtRisk": return "Em Risco";
      default: return code;
    }
  };

  const handleCreateStage = () => {
    if (!newStageName.trim() || !selectedProjectId) {
      toast.error("Preencha o nome e selecione um projeto.");
      return;
    }
    createStage.mutate({
      name: newStageName,
      projectId: selectedProjectId,
      status: "pending",
      sortOrder: milestones.length + 1
    }, {
      onSuccess: () => {
        toast.success("Etapa criada com sucesso!");
        setIsDialogOpen(false);
        setNewStageName("");
        setSelectedProjectId("");
      },
      onError: (err) => {
        toast.error("Erro ao criar etapa: " + err.message);
      }
    });
  }

  // Virtualization calculations
  const totalHeight = milestones.length * ROW_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 2); // Buffer of 2 rows above
  const visibleItemCount = Math.ceil(CONTAINER_HEIGHT / ROW_HEIGHT) + 4; // Buffer of 4 rows below
  const endIndex = Math.min(milestones.length, startIndex + visibleItemCount);

  const visibleMilestones = useMemo(() => {
    return milestones.slice(startIndex, endIndex);
  }, [milestones, startIndex, endIndex]);

  const offsetY = startIndex * ROW_HEIGHT;

  return (
    <div className={styles.container}>
      <Helmet><title>CoreStudio | Etapas</title></Helmet>
      <header className={styles.header}>
        <h1 className={styles.title}>Etapas</h1>
        <button 
          onClick={() => setIsDialogOpen(true)}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.75rem 1.5rem", background: "var(--text-primary)", 
            color: "var(--bg-primary)", borderRadius: "999px",
            border: "none", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer"
          }}
        >
          <Plus size={16} /> Nova Etapa (Virtualizada)
        </button>
      </header>

      <div className={styles.listContainer}>
        <div className={styles.listHeader}>
          <div>Milestone (Total: {milestones.length})</div>
          <div>Ciclo (Período)</div>
          <div>Progresso</div>
          <div style={{ textAlign: "right" }}>Status</div>
        </div>

        {isLoading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>Carregando etapas...</div>
        ) : milestones.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>Nenhuma etapa cadastrada.</div>
        ) : (
          <div 
            ref={containerRef}
            style={{ height: `${CONTAINER_HEIGHT}px`, overflowY: 'auto', position: 'relative' }}
          >
            <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
              <div style={{ transform: `translateY(${offsetY}px)`, position: 'absolute', top: 0, left: 0, width: '100%' }}>
                {visibleMilestones.map((ms) => (
                  <div key={ms.id} className={styles.row}>
                    <div className={styles.colName}>
                      <span className={styles.milestoneName}>{ms.name}</span>
                      <span className={styles.milestoneProject}>{ms.project}</span>
                    </div>
                    <div className={styles.colDate}>
                      {ms.dateRange}
                    </div>
                    <div className={styles.colProgress}>
                      <div className={styles.progressTrack}>
                        <div 
                          className={styles.progressFill} 
                          style={{ width: `${ms.progress}%` }} 
                        />
                      </div>
                      <div className={styles.progressText}>{ms.progress}%</div>
                    </div>
                    <div className={styles.colHealth}>
                      <Select 
                        value={ms.status} 
                        onValueChange={(val) => {
                          updateStage.mutate({ id: ms.id, status: val as any }, {
                            onSuccess: () => toast.success("Status atualizado!"),
                            onError: () => toast.error("Falha ao salvar status")
                          })
                        }}
                      >
                        <SelectTrigger className={`${styles.healthBadge} ${styles[`health_${ms.health}`]}`} style={{ height: "32px", border: "none" }}>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent side="bottom" align="end">
                          <SelectItem value="completed">No Prazo (Completo)</SelectItem>
                          <SelectItem value="in_progress">Atrasado (Em And.)</SelectItem>
                          <SelectItem value="pending">Em Risco (Aguard.)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Etapa</DialogTitle>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <Input 
              placeholder="Nome da Etapa" 
              value={newStageName} 
              onChange={e => setNewStageName(e.target.value)} 
            />
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o Projeto" />
              </SelectTrigger>
              <SelectContent>
                {projectsData?.projects?.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter style={{ marginTop: '1.5rem' }}>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button 
              variant="primary" 
              onClick={handleCreateStage}
              disabled={createStage.isPending || !newStageName || !selectedProjectId}
            >
              {createStage.isPending ? "Criando..." : "Criar Etapa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
