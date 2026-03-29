import React, { useState, useEffect } from "react";
import { 
  User, 
  Trash2,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  Calendar as CalendarIcon,
  Plus,
  Save
} from "lucide-react";
import { toast } from "sonner";
import { 
  useTeamMembers,
  useSectors,
  useProjects,
  useUpdateInitiative, 
  useDeleteInitiative,
  useUpdateProject
} from "../helpers/useCoreActApi";
import { InitiativeStatusArrayValues } from "../helpers/schema";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Popover, PopoverTrigger, PopoverContent } from "./Popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./Select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./Dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";
import { Progress } from "./Progress";
import { CoreActCreateProjectDialog } from "./CoreActCreateProjectDialog";
import { CoreActInitiativeTimeline } from "./CoreActInitiativeTimeline";
import { statusMap, formatDate } from "../helpers/coreactInitiativesUtils";
import { CoreActInlineProjectEditor } from "./CoreActInlineProjectEditor";
import { ProjectStagesSection } from "./ProjectStagesSection";
import { CoreActTaskDetailSheet } from "./CoreActTaskDetailSheet";
import { Separator } from "./Separator";
import styles from "../pages/coreact.iniciativas.module.css";

export function CoreActInitiativeDetailPanel({ 
  initiative, 
  onDeleted
}: { 
  initiative: any; 
  onDeleted: () => void;
}) {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { data: teamData } = useTeamMembers();
  const { data: sectorsData } = useSectors();
  const { data: projectsData } = useProjects();
  const updateMutation = useUpdateInitiative();
  const deleteMutation = useDeleteInitiative();
  const updateProjectMutation = useUpdateProject();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  const [initValues, setInitValues] = useState({
    name: initiative.name || "",
    description: initiative.description || "",
    status: initiative.status || "_empty",
    type: initiative.type || "_empty",
    context: initiative.context || "_empty",
    responsibleId: initiative.responsibleId || "_empty",
    sectorId: initiative.sectorId || "_empty",
    startDate: initiative.startDate ? new Date(initiative.startDate) : null,
    endDate: initiative.endDate ? new Date(initiative.endDate) : null,
  });

  useEffect(() => {
    setInitValues({
      name: initiative.name || "",
      description: initiative.description || "",
      status: initiative.status || "_empty",
      type: initiative.type || "_empty",
      context: initiative.context || "_empty",
      responsibleId: initiative.responsibleId || "_empty",
      sectorId: initiative.sectorId || "_empty",
      startDate: initiative.startDate ? new Date(initiative.startDate) : null,
      endDate: initiative.endDate ? new Date(initiative.endDate) : null,
    });
  }, [initiative]);

  const isDirty = 
    initValues.name !== initiative.name ||
    initValues.description !== (initiative.description || "") ||
    initValues.status !== initiative.status ||
    initValues.type !== (initiative.type || "_empty") ||
    initValues.context !== (initiative.context || "_empty") ||
    initValues.responsibleId !== (initiative.responsibleId || "_empty") ||
    initValues.sectorId !== (initiative.sectorId || "_empty");

  const handleSaveInitiative = async () => {
    try {
      await updateMutation.mutateAsync({
        id: initiative.id,
        name: initValues.name,
        description: initValues.description,
        status: initValues.status as any,
        type: initValues.type === "_empty" ? null : initValues.type,
        context: initValues.context === "_empty" ? null : initValues.context,
        responsibleId: initValues.responsibleId === "_empty" ? null : initValues.responsibleId,
        sectorId: initValues.sectorId === "_empty" ? null : initValues.sectorId,
      });
      toast.success("Iniciativa atualizada com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar iniciativa");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ id: initiative.id });
      toast.success("Iniciativa excluída!");
      setIsDeleteDialogOpen(false);
      onDeleted();
    } catch (err) {
      toast.error("Erro ao excluir iniciativa");
    }
  };

  const handleLinkProject = async (projectId: string) => {
    try {
      await updateProjectMutation.mutateAsync({
        id: projectId,
        initiativeId: initiative.id
      });
      toast.success("Projeto vinculado com sucesso!");
    } catch(err) {
      toast.error("Erro ao vincular projeto");
    }
  };

  const unlinkedProjects = projectsData?.projects?.filter(p => !p.initiativeId) || [];

  return (
    <div className={styles.detailPanel}>
      <div className={styles.detailHeader}>
        <div className={styles.detailHeaderTop}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-3)", flex: 1 }}>
            {isEditingName ? (
              <Input
                value={initValues.name}
                onChange={(e) => setInitValues(prev => ({ ...prev, name: e.target.value }))}
                onBlur={() => setIsEditingName(false)}
                autoFocus
                className={styles.inlineNameInput}
              />
            ) : (
              <h2 
                className={styles.detailTitle} 
                onClick={() => setIsEditingName(true)}
                style={{ cursor: "pointer" }}
                title="Clique para editar o nome"
              >
                {initValues.name}
              </h2>
            )}
            
            <div style={{ display: "flex", gap: "var(--spacing-2)", marginLeft: "auto" }}>
              {isDirty && (
                <Button size="sm" variant="primary" onClick={handleSaveInitiative} disabled={updateMutation.isPending}>
                  <Save size={14} style={{ marginRight: 4 }} />
                  {updateMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              )}
              <Button size="icon-sm" variant="ghost" className={styles.deleteIconBtn} onClick={() => setIsDeleteDialogOpen(true)} title="Excluir Iniciativa">
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className={styles.detailMetaInfo}>
          <div className={styles.inlineEditGrid}>
            <div className={styles.inlineSelectGroup}>
              <label className={styles.inlineSelectLabel}>Status</label>
              <Select value={initValues.status} onValueChange={(val) => setInitValues(p => ({...p, status: val}))}>
                <SelectTrigger className={styles.inlineSelectTrigger}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {InitiativeStatusArrayValues.map(s => (
                    <SelectItem key={s} value={s}>{statusMap[s].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className={styles.inlineSelectGroup}>
              <label className={styles.inlineSelectLabel}>Tipo</label>
              <Select value={initValues.type} onValueChange={(val) => setInitValues(p => ({...p, type: val}))}>
                <SelectTrigger className={styles.inlineSelectTrigger}><SelectValue placeholder="Tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_empty">Sem tipo</SelectItem>
                  <SelectItem value="Operação">Operação</SelectItem>
                  <SelectItem value="Evento">Evento</SelectItem>
                  <SelectItem value="Campanha">Campanha</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={styles.inlineSelectGroup}>
              <label className={styles.inlineSelectLabel}>Contexto</label>
              <Select value={initValues.context} onValueChange={(val) => setInitValues(p => ({...p, context: val}))}>
                <SelectTrigger className={styles.inlineSelectTrigger}><SelectValue placeholder="Contexto" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_empty">Sem contexto</SelectItem>
                  <SelectItem value="Interno">Interno</SelectItem>
                  <SelectItem value="Externo">Externo</SelectItem>
                  <SelectItem value="Híbrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={styles.inlineSelectGroup}>
              <label className={styles.inlineSelectLabel}>Setor</label>
                            <Select value={initValues.sectorId} onValueChange={(val) => {
                  setInitValues(p => ({...p, sectorId: val}));
                  updateMutation.mutateAsync({
                    id: initiative.id,
                    sectorId: val === "_empty" ? null : val,
                  }).then(() => toast.success("Setor atualizado!"))
                    .catch(() => toast.error("Erro ao atualizar setor"));
                }}>
                <SelectTrigger className={styles.inlineSelectTrigger}><SelectValue placeholder="Setor" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_empty">Sem setor</SelectItem>
                  {sectorsData?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className={styles.inlineSelectGroup}>
              <label className={styles.inlineSelectLabel}>Responsável</label>
              <Select value={initValues.responsibleId} onValueChange={(val) => setInitValues(p => ({...p, responsibleId: val}))}>
                <SelectTrigger className={styles.inlineSelectTrigger}><SelectValue placeholder="Responsável" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_empty">Sem responsável</SelectItem>
                  {teamData?.teamMembers.map(tm => <SelectItem key={tm.id} value={tm.id}>{tm.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div style={{ marginTop: "var(--spacing-3)" }}>
            <Textarea 
              value={initValues.description} 
              onChange={(e) => setInitValues(p => ({...p, description: e.target.value}))}
              placeholder="Adicione uma descrição clicando aqui..."
              variant="clear"
              disableResize
              style={{ minHeight: "3rem", fontSize: "var(--font-size-sm)", color: "var(--muted-foreground)" }}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="projetos" className={styles.detailTabs}>
        <TabsList>
          <TabsTrigger value="projetos">Projetos</TabsTrigger>
          <TabsTrigger value="visao_geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projetos" className={styles.tabContentScrollable}>
          <div className={styles.tabSectionHeader}>
            <h3 className={styles.tabSectionTitle}>Projetos Vinculados</h3>
            <div className={styles.tabSectionActions}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LinkIcon size={14} /> Vincular Projeto
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={styles.popoverList}>
                  <div className={styles.popoverHeader}>Projetos Disponíveis</div>
                  {unlinkedProjects.length === 0 ? (
                    <div className={styles.emptyStateCompact}>Nenhum projeto disponível</div>
                  ) : (
                    <div className={styles.popoverOptions}>
                      {unlinkedProjects.map(p => (
                        <div key={p.id} className={styles.popoverOption} onClick={() => handleLinkProject(p.id)}>
                          <span>{p.name}</span>
                          <Plus size={14} className={styles.popoverOptionIcon} />
                        </div>
                      ))}
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              <CoreActCreateProjectDialog defaultInitiativeId={initiative.id} />
            </div>
          </div>

          <div className={styles.linkedProjectsList}>
            {(!initiative.projects || initiative.projects.length === 0) ? (
              <div className={styles.emptyState}>Nenhum projeto vinculado a esta iniciativa.</div>
            ) : (
              initiative.projects.map((p: any) => {
                const isExpanded = expandedProjectId === p.id;
                return (
                  <div key={p.id} className={styles.linkedProjectCardOuter}>
                    <div 
                      className={styles.linkedProjectCard} 
                      onClick={() => setExpandedProjectId(isExpanded ? null : p.id)}
                    >
                      <div className={styles.linkedProjectInfo}>
                        <div className={styles.linkedProjectHeader}>
                          <span className={styles.linkedProjectName}>{p.name}</span>
                          <div className={styles.linkedProjectBadges}>
                            <Badge variant="outline">{p.category || "Sem categoria"}</Badge>
                            <Badge variant="secondary">{p.status}</Badge>
                          </div>
                        </div>
                        <div className={styles.linkedProjectMeta}>
                          <span className={styles.linkedProjectMetaItem}><User size={12} /> {p.ownerName || "Sem responsável"}</span>
                          <span className={styles.linkedProjectMetaItem}><CalendarIcon size={12} /> {formatDate(p.endDate)}</span>
                        </div>
                        <div className={styles.linkedProjectProgressRow}>
                          <Progress value={p.progressPercent} className={styles.linkedProjectProgress} />
                          <span className={styles.linkedProjectProgressText}>{p.progressPercent}% ({p.completedTaskCount}/{p.taskCount})</span>
                        </div>
                      </div>
                      <div className={styles.linkedProjectActions}>
                        <Button 
                          variant="ghost" 
                          size="icon-sm" 
                          onClick={(e) => { e.stopPropagation(); setExpandedProjectId(isExpanded ? null : p.id); }} 
                          title={isExpanded ? "Recolher" : "Editar"}
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </Button>
                      </div>
                    </div>
                    {isExpanded && (
                      <div 
                        className={styles.expandedChecklistContainer}
                        style={{ padding: "var(--spacing-4)", display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}
                      >
                        <CoreActInlineProjectEditor 
                          project={p} 
                          teamMembers={teamData?.teamMembers || []} 
                          sectors={sectorsData || []}
                          initiativeSectorId={initiative.sectorId}
                        />
                        <Separator />
                        <ProjectStagesSection 
                          projectId={p.id} 
                          initiativeId={initiative.id} 
                          onTaskClick={(taskId) => setSelectedTaskId(taskId)}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="visao_geral" className={styles.tabContentScrollable}>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}>
              <span className={styles.kpiValue}>{initiative.projectCount || 0}</span>
              <span className={styles.kpiLabel}>Projetos</span>
            </div>
            <div className={styles.kpiCard}>
              <span className={styles.kpiValue}>{initiative.totalTasks || 0}</span>
              <span className={styles.kpiLabel}>Tarefas</span>
            </div>
            <div className={styles.kpiCard}>
              <span className={styles.kpiValue}>{initiative.completedTasks || 0}</span>
              <span className={styles.kpiLabel}>Concluídas</span>
            </div>
            <div className={styles.kpiCard}>
              <span className={styles.kpiValue}>{initiative.progressPercent || 0}%</span>
              <span className={styles.kpiLabel}>Progresso</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className={styles.tabContentScrollable}>
          <CoreActInitiativeTimeline initiative={initiative} />
        </TabsContent>
      </Tabs>

      <CoreActTaskDetailSheet taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Iniciativa</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a iniciativa "{initiative.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Excluindo..." : "Sim, Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}