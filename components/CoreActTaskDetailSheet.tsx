import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, Plus, CalendarIcon, FileSignature, CreditCard, CheckCircle, Eye, ThumbsUp, Wrench, Check } from "lucide-react";
import { z } from "zod";

import { 
  useTasks, 
  useProjects, 
  useTeamMembers, 
  useUpdateTask, 
  useDeleteTask, 
  useCoreactTaskParticipants, 
  useCreateTaskParticipant, 
  useDeleteTaskParticipant, 
  useCoreactTaskActions, 
  useCreateTaskAction, 
  useUpdateTaskAction, 
  useCoreactActivities,
  useStages,
  useDependencies,
  useCreateDependency,
  useDeleteDependency
} from "../helpers/useCoreActApi";
import { DependencyTypeArrayValues } from "../helpers/schema";
import { StageManager } from "./StageManager";
import { ProjectChecklistPanel } from "./ProjectChecklistPanel";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "./Sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";
import { Badge } from "./Badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./Select";
import { Slider } from "./Slider";
import { Button } from "./Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./Dialog";
import { Form, FormItem, FormControl, FormMessage, useForm } from "./Form";
import { Input } from "./Input";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent } from "./Popover";
import { Calendar } from "./Calendar";
import { Avatar, AvatarFallback } from "./Avatar";

import styles from "./CoreActTaskDetailSheet.module.css";

const actionSchema = z.object({
  type: z.enum(["approve", "confirm_completion", "custom", "make_payment", "review", "sign_document"]).default("custom"),
  title: z.string().min(1, "Título obrigatório"),
  assignedTo: z.string().optional(),
  dueDate: z.date().optional()
});

function TaskParticipantsSection({ taskId, teamMembers }: { taskId: string, teamMembers: any[] }) {
  const { data } = useCoreactTaskParticipants(taskId);
  const createParticipant = useCreateTaskParticipant();
  const deleteParticipant = useDeleteTaskParticipant();
  const [selectedMember, setSelectedMember] = useState<string>("_empty");

  const handleAdd = () => {
    if (selectedMember !== "_empty") {
      createParticipant.mutate({ taskId, memberId: selectedMember, role: "observer" }, {
        onSuccess: () => {
          setSelectedMember("_empty");
          toast.success("Participante adicionado");
        }
      });
    }
  };

  return (
    <div className={styles.participantsSection}>
      <h4 className={styles.sectionTitle}>Participantes</h4>
      <div className={styles.participantsList}>
        {data?.taskParticipants.length === 0 && <span className={styles.emptyText}>Nenhum participante.</span>}
        {data?.taskParticipants.map(p => (
           <div key={p.id} className={styles.participantItem}>
             <Avatar>
               <AvatarFallback>{p.memberInitials || p.memberName?.charAt(0) || "?"}</AvatarFallback>
             </Avatar>
             <div className={styles.participantInfo}>
               <span className={styles.participantName}>{p.memberName}</span>
               <Badge variant="secondary" className={styles.roleBadge}>{p.role}</Badge>
             </div>
             <Button variant="ghost" size="icon-sm" onClick={() => deleteParticipant.mutate({ id: p.id })}>
               <X size={14} />
             </Button>
           </div>
        ))}
      </div>
      <div className={styles.addParticipant}>
        <Select value={selectedMember} onValueChange={setSelectedMember}>
          <SelectTrigger>
            <SelectValue placeholder="Adicionar membro..." />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="_empty">Selecione um membro</SelectItem>
             {teamMembers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="icon-md" variant="outline" onClick={handleAdd} disabled={selectedMember === "_empty" || createParticipant.isPending}>
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
}

function TaskActionsTab({ taskId, teamMembers }: { taskId: string, teamMembers: any[] }) {
  const { data } = useCoreactTaskActions(taskId);
  const createAction = useCreateTaskAction();
  const updateAction = useUpdateTaskAction();

  const form = useForm({
    schema: actionSchema,
    defaultValues: { type: "custom", title: "", assignedTo: "_empty" }
  });

  const onSubmit = (values: z.infer<typeof actionSchema>) => {
    createAction.mutate({
      taskId,
      type: values.type,
      title: values.title,
      assignedTo: values.assignedTo === "_empty" ? null : values.assignedTo,
      dueDate: values.dueDate
    }, {
      onSuccess: () => {
        form.setValues({ type: "custom", title: "", assignedTo: "_empty", dueDate: undefined });
        toast.success("Ação criada com sucesso");
      }
    });
  };

  const actionTypes = [
    { value: "sign_document", label: "Assinar Documento" },
    { value: "make_payment", label: "Realizar Pagamento" },
    { value: "confirm_completion", label: "Confirmar Conclusão" },
    { value: "review", label: "Revisar" },
    { value: "approve", label: "Aprovar" },
    { value: "custom", label: "Personalizado" },
  ];

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'sign_document': return <FileSignature size={16} />;
      case 'make_payment': return <CreditCard size={16} />;
      case 'confirm_completion': return <CheckCircle size={16} />;
      case 'review': return <Eye size={16} />;
      case 'approve': return <ThumbsUp size={16} />;
      default: return <Wrench size={16} />;
    }
  };

  const handleStatusUpdate = (actionId: string, status: 'completed' | 'rejected') => {
    updateAction.mutate({ id: actionId, status, completedAt: status === 'completed' ? new Date() : null });
  };

  return (
    <div className={styles.tabContent}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.newActionForm}>
          <h4 className={styles.sectionTitle}>Nova Ação</h4>
          <div className={styles.formRow}>
            <FormItem name="type">
              <Select value={form.values.type} onValueChange={(val) => form.setValues(prev => ({...prev, type: val as any}))}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {actionTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
            <FormItem name="assignedTo">
              <Select value={form.values.assignedTo} onValueChange={(val) => form.setValues(prev => ({...prev, assignedTo: val}))}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Responsável" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="_empty">Sem responsável</SelectItem>
                  {teamMembers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </div>
          <FormItem name="title">
            <FormControl>
              <Input placeholder="Título da ação" value={form.values.title} onChange={e => form.setValues(prev => ({...prev, title: e.target.value}))} />
            </FormControl>
            <FormMessage />
          </FormItem>
          <div className={styles.formRow}>
            <FormItem name="dueDate">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" className={styles.datePickerBtn}>
                      <CalendarIcon size={16} />
                      {form.values.dueDate ? new Intl.DateTimeFormat('pt-BR').format(form.values.dueDate) : "Prazo"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent removeBackgroundAndPadding>
                  <Calendar
                    mode="single"
                    selected={form.values.dueDate}
                    onSelect={(date) => {
                      if (date) form.setValues(prev => ({...prev, dueDate: date}));
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
            <Button type="submit" disabled={createAction.isPending}>Adicionar</Button>
          </div>
        </form>
      </Form>

      <div className={styles.actionsList}>
        {data?.taskActions.length === 0 && <span className={styles.emptyText}>Nenhuma ação criada.</span>}
        {data?.taskActions.map(action => (
          <div key={action.id} className={styles.actionItem}>
            <div className={styles.actionHeader}>
              <div className={styles.actionTitleGroup}>
                {getActionIcon(action.type)}
                <span className={styles.actionTitle}>{action.title}</span>
              </div>
              <Badge variant={action.status === 'completed' ? 'success' : action.status === 'rejected' ? 'destructive' : 'secondary'}>
                {action.status}
              </Badge>
            </div>
            <div className={styles.actionMeta}>
              {action.assignedToName && <span>Atribuído a: {action.assignedToName}</span>}
              {action.dueDate && <span>Prazo: {new Date(action.dueDate).toLocaleDateString('pt-BR')}</span>}
            </div>
            {(action.status === 'pending' || action.status === 'in_progress') && (
              <div className={styles.actionControls}>
                <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(action.id, 'rejected')}>
                  <X size={14} /> Rejeitar
                </Button>
                <Button size="sm" variant="primary" onClick={() => handleStatusUpdate(action.id, 'completed')}>
                  <Check size={14} /> Concluir
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskDependenciesTab({ taskId, projectId }: { taskId: string, projectId: string }) {
  const { data: depsData } = useDependencies({ taskId });
  const { data: tasksData } = useTasks({ projectId });
  const createDep = useCreateDependency();
  const deleteDep = useDeleteDependency();

  const [dependsOnTaskId, setDependsOnTaskId] = useState<string>("_empty");
  const [dependencyType, setDependencyType] = useState<string>("finish_to_start");

  const otherTasks = tasksData?.tasks.filter(t => t.id !== taskId) || [];
  const dependencies = depsData?.dependencies || [];

  const handleAdd = () => {
    if (dependsOnTaskId !== "_empty") {
      createDep.mutate({
        taskId,
        dependsOnTaskId,
        dependencyType: dependencyType as any
      }, {
        onSuccess: () => {
          setDependsOnTaskId("_empty");
          setDependencyType("finish_to_start");
          toast.success("Dependência adicionada");
        }
      });
    }
  };

  const typeLabels: Record<string, string> = {
    finish_to_start: "Fim para Início",
    start_to_start: "Início para Início",
    finish_to_finish: "Fim para Fim",
    start_to_finish: "Início para Fim"
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.newActionForm}>
        <h4 className={styles.sectionTitle}>Nova Dependência</h4>
        <div className={styles.formRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.detailLabel}>Tarefa</label>
            <Select value={dependsOnTaskId} onValueChange={setDependsOnTaskId}>
              <SelectTrigger><SelectValue placeholder="Selecione a tarefa..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_empty">Selecione uma tarefa</SelectItem>
                {otherTasks.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.detailLabel}>Tipo</label>
            <Select value={dependencyType} onValueChange={setDependencyType}>
              <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                {DependencyTypeArrayValues.map(t => <SelectItem key={t} value={t}>{typeLabels[t]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className={styles.formRow} style={{ justifyContent: 'flex-end' }}>
           <Button onClick={handleAdd} disabled={dependsOnTaskId === "_empty" || createDep.isPending}>
             Adicionar
           </Button>
        </div>
      </div>

      <div className={styles.actionsList}>
        {dependencies.length === 0 && <span className={styles.emptyText}>Nenhuma dependência configurada.</span>}
        {dependencies.map(dep => {
          const isBlocker = dep.taskId === taskId;
          const relatedTaskName = isBlocker ? dep.dependsOnTaskName : dep.taskName;
          const relationText = isBlocker ? "Depende de" : "Bloqueia";
          
          return (
            <div key={dep.id} className={styles.actionItem}>
              <div className={styles.actionHeader}>
                <div className={styles.actionTitleGroup}>
                  <Badge variant={isBlocker ? "secondary" : "destructive"}>{relationText}</Badge>
                  <span className={styles.actionTitle}>{relatedTaskName}</span>
                </div>
                <Badge variant="outline">{typeLabels[dep.dependencyType]}</Badge>
              </div>
              <div className={styles.actionControls}>
                <Button size="icon-sm" variant="ghost" onClick={() => deleteDep.mutate({ id: dep.id })}>
                  <X size={14} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskHistoryTab({ taskId, projectId }: { taskId: string, projectId: string }) {
  const { data } = useCoreactActivities(projectId);
  
  const taskActivities = data?.activityLogs.filter(a => a.entityId === taskId) || [];

  const formatAction = (action: string) => {
    const map: Record<string, string> = {
      created: "criou a tarefa",
      updated: "atualizou a tarefa",
      deleted: "excluiu a tarefa",
      status_changed: "alterou o status",
      assigned: "atribuiu a tarefa",
      completed: "concluiu a tarefa",
      commented: "comentou na tarefa"
    };
    return map[action] || action;
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.historyTimeline}>
        {taskActivities.length === 0 && <p className={styles.emptyText}>Nenhum histórico encontrado.</p>}
        {taskActivities.map(act => (
          <div key={act.id} className={styles.historyItem}>
            <div className={styles.historyDot} />
            <div className={styles.historyContent}>
               <p className={styles.historyAction}>
                 <strong>{act.performerName || 'Sistema'}</strong> {formatAction(act.action)}
               </p>
               <span className={styles.historyDate}>{new Date(act.performedAt as any).toLocaleString('pt-BR')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CoreActTaskDetailSheet({ taskId, onClose }: { taskId: string | null; onClose: () => void }) {
  const navigate = useNavigate();
  const { data: tasksData } = useTasks();
  const { data: projectsData } = useProjects();
  const { data: teamData } = useTeamMembers();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const task = tasksData?.tasks.find(t => t.id === taskId);
  const { data: stagesData } = useStages(task?.projectId);
  const stages = stagesData?.stages || [];
  const project = projectsData?.projects.find(p => p.id === task?.projectId);
  const assignee = teamData?.teamMembers.find(m => m.id === task?.assigneeId);

  const [localProgress, setLocalProgress] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (task) {
      setLocalProgress(task.progress || 0);
    }
  }, [task?.id, task?.progress]);

  if (!task) {
    return (
      <Sheet open={!!taskId} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="right">
          <SheetHeader><SheetTitle>Carregando...</SheetTitle></SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  const handleProgressChange = (vals: number[]) => {
    setLocalProgress(vals[0]);
  };

  const handleProgressCommit = (vals: number[]) => {
    if (task) {
      updateTask.mutate({ id: task.id, progress: vals[0] });
    }
  };

  const handleStatusChange = (val: string) => {
    updateTask.mutate({ id: task.id, status: val as any });
  };

  const handleDelete = () => {
    deleteTask.mutate({ id: task.id }, {
      onSuccess: () => {
        toast.success("Tarefa excluída");
        setIsDeleteDialogOpen(false);
        onClose();
      }
    });
  };

  return (
    <>
      <Sheet open={!!taskId} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="right" className={styles.detailSheet}>
          <SheetHeader className={styles.sheetHeader}>
            <SheetTitle>{task.name}</SheetTitle>
            <SheetDescription>Projeto: {project?.name || "Desconhecido"}</SheetDescription>
            <button 
              className={styles.calendarLink} 
              onClick={() => {
                onClose();
                navigate('/coreact/cronograma');
              }}
            >
              <CalendarIcon size={12} />
              Ver a tarefa no calendário
            </button>
          </SheetHeader>
          
          <Tabs defaultValue="detalhes" className={styles.tabsContainer}>
            <TabsList>
              <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
              <TabsTrigger value="acoes">Ações</TabsTrigger>
              <TabsTrigger value="dependencias">Dependências</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="detalhes" className={styles.tabContent}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Responsável</span>
                <span className={styles.detailValue}>{assignee?.name || "Sem responsável"}</span>
              </div>
              
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Prioridade</span>
                <Badge variant="outline" className={styles[`priority-${task.priority || 'medium'}`]}>
                  {task.priority === 'critical' ? 'Crítica' : task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                </Badge>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Datas</span>
                <span className={styles.detailValue}>
                  {task.startDate ? new Date(task.startDate).toLocaleDateString('pt-BR') : '-'} até {task.endDate ? new Date(task.endDate).toLocaleDateString('pt-BR') : '-'}
                </span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Etapa</span>
                <span className={styles.detailValue}>{task.stageName || "Sem etapa"}</span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.detailLabel}>Status</label>
                <Select value={task.status || "open"} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Aberto</SelectItem>
                    <SelectItem value="standby">Em Espera</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="blocked">Bloqueado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="overdue">Atrasado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.detailLabel}>Etapa</label>
                <Select value={task.stageId || "_empty"} onValueChange={(val) => updateTask.mutate({ id: task.id, stageId: val === "_empty" ? undefined : val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a etapa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_empty">Sem etapa</SelectItem>
                    {stages.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.detailLabel}>Progresso: {localProgress}%</label>
                <Slider 
                  value={[localProgress]} 
                  max={100} 
                  step={5} 
                  onValueChange={handleProgressChange} 
                  onValueCommit={handleProgressCommit}
                />
              </div>

              <TaskParticipantsSection taskId={task.id} teamMembers={teamData?.teamMembers || []} />

              <div style={{ marginTop: 'var(--spacing-6)' }}>
                <StageManager projectId={task.projectId} />
              </div>
            </TabsContent>

            <TabsContent value="checklist" className={styles.tabContent}>
              <ProjectChecklistPanel projectId={task.projectId} />
            </TabsContent>

            <TabsContent value="acoes">
              <TaskActionsTab taskId={task.id} teamMembers={teamData?.teamMembers || []} />
            </TabsContent>

            <TabsContent value="dependencias">
              <TaskDependenciesTab taskId={task.id} projectId={task.projectId} />
            </TabsContent>

            <TabsContent value="historico">
              <TaskHistoryTab taskId={task.id} projectId={task.projectId} />
            </TabsContent>
          </Tabs>

          <SheetFooter className={styles.sheetFooter}>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              Excluir Tarefa
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Tarefa</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita e todas as ações e históricos associados serão perdidos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteTask.isPending}>
              {deleteTask.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}