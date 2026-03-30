import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, CalendarIcon, LayoutDashboard, Target } from "lucide-react";

import { 
  useProjects,
  useUpdateProject, 
  useDeleteProject,
  useTeamMembers,
  useInitiatives
} from "../helpers/useCoreActApi";
import { ProjectStatusArrayValues, ProjectCategoryArrayValues } from "../helpers/schema";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "./Sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";
import { Badge } from "./Badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./Select";
import { Button } from "./Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./Dialog";
import { ProjectChecklistPanel } from "./ProjectChecklistPanel";
import { ProjectStagesSection } from "./ProjectStagesSection";
import { ProjectModulesPanel } from "./ProjectModulesPanel";
import { CoreActTaskDetailSheet } from "./CoreActTaskDetailSheet";

import styles from "./CoreActTaskDetailSheet.module.css";

export function CoreActProjectDetailSheet({ projectId, onClose }: { projectId: string | null; onClose: () => void }) {
  const { data: projectsData } = useProjects();
  const { data: teamData } = useTeamMembers();
  const { data: initiativesData } = useInitiatives();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const project = projectsData?.projects.find(p => p.id === projectId);
  const owner = teamData?.teamMembers.find(m => m.id === project?.ownerId);
  const initiative = initiativesData?.initiatives?.find((i: any) => i.id === project?.initiativeId);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  if (!project) {
    return (
      <Sheet open={!!projectId} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="right">
          <SheetHeader><SheetTitle>Carregando...</SheetTitle></SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  const handleStatusChange = (val: string) => {
    updateProject.mutate({ id: project.id, status: val as any }, {
      onSuccess: () => toast.success("Status do projeto atualizado")
    });
  };

  const handleCategoryChange = (val: string) => {
    updateProject.mutate({ id: project.id, category: val as any }, {
      onSuccess: () => toast.success("Categoria do projeto atualizada")
    });
  };

  const handleDelete = () => {
    deleteProject.mutate({ id: project.id }, {
      onSuccess: () => {
        toast.success("Projeto excluído");
        setIsDeleteDialogOpen(false);
        onClose();
      }
    });
  };

  return (
    <>
      <Sheet open={!!projectId} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="right" className={styles.detailSheet}>
          <SheetHeader className={styles.sheetHeader}>
            <SheetTitle>{project.name}</SheetTitle>
            <SheetDescription>Iniciativa: {project.initiativeName || "Avulso"}</SheetDescription>
          </SheetHeader>
          
          <Tabs defaultValue="detalhes" className={styles.tabsContainer}>
            <TabsList>
              <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
              <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
              <TabsTrigger value="etapas">Etapas</TabsTrigger>
              <TabsTrigger value="modulos">Módulos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="detalhes" className={styles.tabContent}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Responsável</span>
                <span className={styles.detailValue}>{owner?.name || project.ownerName || "Sem responsável"}</span>
              </div>
              
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Datas</span>
                <span className={styles.detailValue}>
                  {project.startDate ? new Date(project.startDate).toLocaleDateString('pt-BR') : '-'} até {project.endDate ? new Date(project.endDate).toLocaleDateString('pt-BR') : '-'}
                </span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.detailLabel}>Orçamento</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {project.budget && <Badge variant="secondary">R$ {project.budget}</Badge>}
                  {!project.budget && <span className={styles.detailValue}>Não definido</span>}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.detailLabel}>Status</label>
                <Select value={project.status || "active"} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ProjectStatusArrayValues.map(s => (
                      <SelectItem key={s} value={s}>{s === 'active' ? 'Ativo' : s === 'paused' ? 'Pausado' : s === 'completed' ? 'Concluído' : s === 'cancelled' ? 'Cancelado' : s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.detailLabel}>Categoria</label>
                <Select value={project.category || "custom"} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {ProjectCategoryArrayValues.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </TabsContent>

            <TabsContent value="tarefas" className={styles.tabContent} style={{ overflowY: "auto" }}>
              <ProjectChecklistPanel projectId={project.id} />
            </TabsContent>

            <TabsContent value="etapas" className={styles.tabContent} style={{ overflowY: "auto" }}>
              <ProjectStagesSection 
                projectId={project.id} 
                initiativeId={project.initiativeId}
                onTaskClick={(tid) => setSelectedTaskId(tid)}
              />
            </TabsContent>

            <TabsContent value="modulos" className={styles.tabContent}>
              <ProjectModulesPanel projectId={project.id} />
            </TabsContent>
          </Tabs>

          <SheetFooter className={styles.sheetFooter}>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              Excluir Projeto
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Projeto</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteProject.isPending}>
              {deleteProject.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {selectedTaskId && (
        <CoreActTaskDetailSheet 
          taskId={selectedTaskId} 
          onClose={() => setSelectedTaskId(null)} 
        />
      )}
    </>
  );
}
