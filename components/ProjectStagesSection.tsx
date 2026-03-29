import React, { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, X, CalendarIcon, ChevronRight } from "lucide-react";
import { 
  useStages, 
  useCreateStage 
} from "../helpers/useCoreactHierarchyHooks";
import { 
  useTasks, 
  useCreateTask 
} from "../helpers/useCoreActApi";
import { StageStatusArrayValues, TaskStatusArrayValues } from "../helpers/schema";
import { Button } from "./Button";
import { Input } from "./Input";
import { Badge } from "./Badge";
import { Skeleton } from "./Skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./Select";
import { Form, FormItem, FormControl, FormMessage, useForm } from "./Form";
import { Avatar, AvatarFallback } from "./Avatar";
import styles from "./ProjectStagesSection.module.css";

// Translations & Design Maps
const stageStatusMap: Record<string, { label: string; variant: "primary" | "secondary" | "outline" | "success" | "warning" | "destructive" }> = {
  pending: { label: "Pendente", variant: "outline" },
  in_progress: { label: "Em Andamento", variant: "primary" },
  completed: { label: "Concluída", variant: "success" },
};

const taskStatusMap: Record<string, { label: string; variant: "primary" | "secondary" | "outline" | "success" | "warning" | "destructive" }> = {
  open: { label: "Aberto", variant: "outline" },
  in_progress: { label: "Em Andamento", variant: "primary" },
  completed: { label: "Concluído", variant: "success" },
  blocked: { label: "Bloqueado", variant: "destructive" },
  standby: { label: "Standby", variant: "secondary" },
  overdue: { label: "Atrasado", variant: "warning" },
};

// --- Schemas for Inline Forms ---

const stageSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  status: z.enum(StageStatusArrayValues).default("pending"),
});

const taskSchema = z.object({
  name: z.string().min(1, "Nome da tarefa é obrigatório"),
});

// --- Inline Form Components ---

function StageInlineForm({
  projectId,
  sortOrder,
  onSuccess,
  onCancel,
}: {
  projectId: string;
  sortOrder: number;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const createMutation = useCreateStage();

  const form = useForm({
    schema: stageSchema,
    defaultValues: { name: "", status: "pending" },
  });

  const onSubmit = async (data: z.infer<typeof stageSchema>) => {
    try {
      await createMutation.mutateAsync({
        projectId,
        name: data.name,
        status: data.status,
        sortOrder,
      });
      toast.success("Etapa criada com sucesso");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar etapa");
    }
  };

  const isPending = createMutation.isPending;

  return (
    <div className={styles.stageInlineForm}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.inlineFormLayout}>
          <div className={styles.inlineFormInputs}>
            <FormItem name="name" className={styles.flexItem}>
              <FormControl>
                <Input
                  placeholder="Nome da Etapa"
                  value={form.values.name}
                  onChange={(e) => form.setValues((p) => ({ ...p, name: e.target.value }))}
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem name="status" className={styles.fixedWidthItem}>
              <FormControl>
                <Select
                  value={form.values.status}
                  onValueChange={(val: any) => form.setValues((p) => ({ ...p, status: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {StageStatusArrayValues.map((s) => (
                      <SelectItem key={s} value={s}>
                        {stageStatusMap[s]?.label || s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>

          <div className={styles.inlineFormActions}>
            <Button variant="ghost" size="icon" onClick={onCancel} disabled={isPending} type="button">
              <X size={16} />
            </Button>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function TaskInlineForm({
  projectId,
  stageId,
  onSuccess,
  onCancel,
}: {
  projectId: string;
  stageId: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const createMutation = useCreateTask();

  const form = useForm({
    schema: taskSchema,
    defaultValues: { name: "" },
  });

  const onSubmit = async (data: z.infer<typeof taskSchema>) => {
    try {
      await createMutation.mutateAsync({
        projectId,
        stageId,
        name: data.name,
        status: "open",
        priority: "medium",
        shift: "morning",
        progress: 0,
      });
      toast.success("Tarefa criada com sucesso");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar tarefa");
    }
  };

  const isPending = createMutation.isPending;

  return (
    <div className={styles.taskInlineForm}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.inlineFormLayout}>
          <div className={styles.inlineFormInputs}>
            <FormItem name="name" className={styles.flexItem}>
              <FormControl>
                <Input
                  placeholder="Título da nova tarefa"
                  value={form.values.name}
                  onChange={(e) => form.setValues((p) => ({ ...p, name: e.target.value }))}
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>

          <div className={styles.inlineFormActions}>
            <Button variant="ghost" size="icon" onClick={onCancel} disabled={isPending} type="button">
              <X size={16} />
            </Button>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// --- Main Component ---

interface ProjectStagesSectionProps {
  projectId: string;
  initiativeId: string;
  onTaskClick?: (taskId: string) => void;
}

export function ProjectStagesSection({ projectId, initiativeId, onTaskClick }: ProjectStagesSectionProps) {
  const { data: stagesData, isFetching: isFetchingStages } = useStages(projectId);
  const { data: tasksData, isFetching: isFetchingTasks } = useTasks({ projectId });

  const [isCreatingStage, setIsCreatingStage] = useState(false);
  const [creatingTaskForStage, setCreatingTaskForStage] = useState<string | null>(null);

  const stages = stagesData?.stages || [];
  const allTasks = tasksData?.tasks || [];
  
  const nextSortOrder = stages.length > 0 ? Math.max(...stages.map((s) => s.sortOrder || 0)) + 1 : 0;

  const formatDateRange = (start?: Date | string | null, end?: Date | string | null) => {
    if (!start && !end) return null;
    const formatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });
    const formattedStart = start ? formatter.format(new Date(start)) : "...";
    const formattedEnd = end ? formatter.format(new Date(end)) : "...";
    return `${formattedStart} - ${formattedEnd}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Etapas</h3>
        {!isCreatingStage && (
          <Button variant="outline" size="sm" onClick={() => setIsCreatingStage(true)}>
            <Plus size={14} /> Nova Etapa
          </Button>
        )}
      </div>

      {isFetchingStages && stages.length === 0 ? (
        <div className={styles.loadingState}>
          <Skeleton style={{ height: "3rem", marginBottom: "var(--spacing-2)" }} />
          <Skeleton style={{ height: "5rem", marginBottom: "var(--spacing-4)" }} />
        </div>
      ) : (
        <div className={styles.stagesList}>
          {stages.length === 0 && !isCreatingStage ? (
            <div className={styles.emptyState}>Nenhuma etapa cadastrada neste projeto.</div>
          ) : (
            stages.map((stage) => {
              const stageTasks = allTasks.filter((t) => t.stageId === stage.id);
              const isAddingTask = creatingTaskForStage === stage.id;

              return (
                <div key={stage.id} className={styles.stageGroup}>
                  <div className={styles.stageHeader}>
                    <div className={styles.stageInfo}>
                      <span className={styles.stageName}>{stage.name}</span>
                      <Badge variant={stageStatusMap[stage.status]?.variant || "default"}>
                        {stageStatusMap[stage.status]?.label || stage.status}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={styles.addTaskBtn}
                      onClick={() => setCreatingTaskForStage(stage.id)}
                      disabled={isAddingTask}
                    >
                      <Plus size={14} /> Nova Tarefa
                    </Button>
                  </div>

                  <div className={styles.taskList}>
                    {stageTasks.length === 0 && !isAddingTask ? (
                      <div className={styles.emptyTasks}>Nenhuma tarefa nesta etapa.</div>
                    ) : (
                      stageTasks.map((task) => {
                        const dateRangeStr = formatDateRange(task.startDate, task.endDate);

                        return (
                          <div 
                            key={task.id} 
                            className={styles.taskRow} 
                            onClick={() => onTaskClick?.(task.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && onTaskClick?.(task.id)}
                          >
                            <div className={styles.taskPrimary}>
                              <span className={styles.taskName}>{task.name}</span>
                              <Badge variant={taskStatusMap[task.status || "open"]?.variant || "default"}>
                                {taskStatusMap[task.status || "open"]?.label || task.status}
                              </Badge>
                            </div>

                            <div className={styles.taskSecondary}>
                              {dateRangeStr && (
                                <div className={styles.taskMeta}>
                                  <CalendarIcon size={14} />
                                  <span>{dateRangeStr}</span>
                                </div>
                              )}
                              
                              {(task.assigneeName || task.assigneeInitials) ? (
                                <div className={styles.assignee}>
                                  <Avatar className={styles.avatar}>
                                    <AvatarFallback>{task.assigneeInitials?.substring(0,2) || "?"}</AvatarFallback>
                                  </Avatar>
                                  <span className={styles.assigneeName}>
                                    {task.assigneeName?.split(' ')[0]}
                                  </span>
                                </div>
                              ) : (
                                <span className={styles.unassigned}>Não atribuído</span>
                              )}
                              <ChevronRight size={16} className={styles.chevron} />
                            </div>
                          </div>
                        );
                      })
                    )}

                    {isAddingTask && (
                      <TaskInlineForm
                        projectId={projectId}
                        stageId={stage.id}
                        onSuccess={() => setCreatingTaskForStage(null)}
                        onCancel={() => setCreatingTaskForStage(null)}
                      />
                    )}
                  </div>
                </div>
              );
            })
          )}

          {isCreatingStage && (
            <StageInlineForm
              projectId={projectId}
              sortOrder={nextSortOrder}
              onSuccess={() => setIsCreatingStage(false)}
              onCancel={() => setIsCreatingStage(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}