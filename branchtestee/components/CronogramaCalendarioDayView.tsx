import React, { useMemo, useState, useEffect } from "react";
import { Sunrise, Sun, Moon, CheckCircle2, Circle, Lock, Play, Clock, Square, ChevronDown, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Badge } from "./Badge";
import { Progress } from "./Progress";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";
import { useUpdateTask, useTasksWithDailyView, useCreateExecution, useUpdateExecution } from "../helpers/useCoreActApi";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";
import { toast } from "sonner";
import type { TaskWithDetails, TaskWithActions, TaskActionWithExecutions } from "../endpoints/coreact/tasks/list_GET.schema";
import { isTaskOnDay, sortTasksByPriority, getTaskShift, SHIFTS, computeTaskStatuses, type ComputedTaskState, type ShiftId } from "../helpers/cronogramaTaskUtils";
import { CronogramaQuickAdd } from "./CronogramaQuickAdd";
import styles from "./CronogramaCalendarioDayView.module.css";

const SHIFT_ICONS: Record<ShiftId, React.ElementType> = {
  morning: Sunrise,
  afternoon: Sun,
  night: Moon,
};

interface Props {
  tasks: (TaskWithDetails | TaskWithActions)[];
  currentDate: Date;
  onTaskClick: (taskId: string) => void;
  mode?: "all" | "operator";
  operatorId?: string;
  operatorName?: string;
}

const statusMap: Record<string, string> = {
  open: "Aberto",
  in_progress: "Em Andamento",
  blocked: "Bloqueado",
  standby: "Standby",
  overdue: "Atrasado",
  completed: "Concluído"
};

const priorityMap: Record<string, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  critical: "Crítica"
};

const actionStatusMap: Record<string, string> = {
  pending: "Pendente",
  in_progress: "Em Andamento",
  completed: "Concluído",
  rejected: "Rejeitado"
};

const actionTypeMap: Record<string, string> = {
  approve: "Aprovar",
  confirm_completion: "Confirmar Conclusão",
  custom: "Personalizado",
  make_payment: "Realizar Pagamento",
  review: "Revisar",
  sign_document: "Assinar Documento"
};

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function ActiveTimerDisplay({ startedAt }: { startedAt: Date }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(startedAt).getTime();
    setElapsed(Math.floor((Date.now() - start) / 1000));
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');

  return <span>{pad(hours)}:{pad(minutes)}:{pad(seconds)}</span>;
}

function ActionItem({ 
  action, 
  operatorId, 
  operatorName,
  activeExecutionId 
}: { 
  action: TaskActionWithExecutions; 
  operatorId: string;
  operatorName: string;
  activeExecutionId: string | null;
}) {
  const createExecution = useCreateExecution();
  const updateExecution = useUpdateExecution();
  
  const inProgressExec = action.executions.find(e => e.status === 'in_progress');

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    createExecution.mutate({
      taskActionId: action.id,
      operatorId: operatorId,
      startedAt: new Date(),
      status: 'in_progress'
    });
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inProgressExec) {
      updateExecution.mutate({
        id: inProgressExec.id,
        status: 'completed',
        endedAt: new Date()
      });
    }
  };

  return (
    <div className={styles.actionItem}>
       <div className={styles.actionHeader}>
          <div className={styles.actionTitleGroup}>
            <span className={styles.actionTitle}>{action.title}</span>
            <div className={styles.actionBadges}>
               <Badge variant="secondary">{actionTypeMap[action.type] || action.type}</Badge>
               <Badge variant="outline">{operatorName}</Badge>
               <Badge 
                 variant={action.status === 'completed' ? 'success' : action.status === 'in_progress' ? 'primary' : 'outline'}
               >
                 {actionStatusMap[action.status] || action.status}
               </Badge>
            </div>
          </div>
          <div className={styles.actionControls}>
            {inProgressExec ? (
              <Button variant="destructive" size="sm" onClick={handleStop} disabled={updateExecution.isPending}>
                <Square size={14} /> Parar (<ActiveTimerDisplay startedAt={inProgressExec.startedAt} />)
              </Button>
            ) : (
              <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={handleStart} 
                 disabled={!!activeExecutionId || createExecution.isPending}
                 title={activeExecutionId ? "Outro timer já está ativo" : "Iniciar Timer"}
              >
                <Play size={14} /> Iniciar
              </Button>
            )}
          </div>
       </div>
       
       {action.executions.length > 0 && (
         <div className={styles.executionsList}>
            {action.executions.map(exec => (
               <div key={exec.id} className={styles.executionRow}>
                  <Clock size={14} />
                  <span>
                    {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(exec.startedAt))}
                    {exec.endedAt && ` - ${new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(exec.endedAt))}`}
                  </span>
                  {exec.durationMinutes != null && (
                    <span className={styles.executionDuration}>({formatMinutes(exec.durationMinutes)})</span>
                  )}
                  {exec.status === 'in_progress' && (
                    <Badge variant="primary" className={styles.executionStatusBadge}>Em Andamento</Badge>
                  )}
                  {exec.notes && <span className={styles.executionNotes}>- {exec.notes}</span>}
               </div>
            ))}
         </div>
       )}
    </div>
  );
}

export const CronogramaCalendarioDayView = ({
  tasks,
  currentDate,
  onTaskClick,
  mode = "all",
  operatorId,
  operatorName = "Operador"
}: Props) => {
  const updateTask = useUpdateTask();
  const { ref: containerRef, level, className: adaptiveClass } = useAdaptiveLevel({
    itemCount: tasks.length,
  });

  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const [quickAddShift, setQuickAddShift] = useState<ShiftId | null>(null);
  
  // Timer for single/double click
  const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const { total, completed, avgProgress } = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const avgProgress =
      total > 0
        ? Math.round(
            tasks.reduce((acc, t) => acc + (t.progress || 0), 0) / total
          )
        : 0;
    return { total, completed, avgProgress };
  }, [tasks]);

  const sortedTasks = useMemo(() => {
    return sortTasksByPriority(tasks);
  }, [tasks]);

  const tasksByShift = useMemo(() => {
    const map = new Map<ShiftId, typeof sortedTasks>();
    SHIFTS.forEach((s) => map.set(s.id, []));

    sortedTasks.forEach((t) => {
      const shift = getTaskShift(t);
      if (map.has(shift)) {
        map.get(shift)!.push(t);
      } else {
        map.get("morning")!.push(t);
      }
    });
    return map;
  }, [sortedTasks]);

  const dayName = currentDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const taskStatusMap = useMemo(() => computeTaskStatuses(tasks), [tasks]);

  const getTaskStatusState = (task: TaskWithDetails | TaskWithActions) => {
    return taskStatusMap.get(task.id) || "ready";
  };

  const hasActiveExecution = (task: any) => {
    if (!task.actions) return false;
    return task.actions.some((a: any) =>
      a.executions?.some((e: any) => e.status === "in_progress")
    );
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ id: taskId }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, targetShift: ShiftId, hourOffset: number) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (!data.id) return;

      const task = tasks.find((t) => t.id === data.id);
      if (!task) return;

      const shiftDef = SHIFTS.find((s) => s.id === targetShift)!;
      let newStart = task.startDate ? new Date(task.startDate) : new Date(currentDate);
      
      const targetHour = Math.floor(shiftDef.startHour + hourOffset);
      const targetMinute = Math.round((hourOffset % 1) * 60);
      
      newStart.setHours(targetHour, targetMinute, 0, 0);

      let newEnd = task.endDate ? new Date(task.endDate) : new Date(newStart.getTime() + 3600000);
      if (task.startDate && task.endDate) {
        const duration = new Date(task.endDate).getTime() - new Date(task.startDate).getTime();
        newEnd = new Date(newStart.getTime() + duration);
      }

      updateTask.mutate(
        { id: task.id, shift: targetShift, startDate: newStart, endDate: newEnd },
        {
          onSuccess: () => toast.success("Tarefa movida com sucesso"),
          onError: () => toast.error("Erro ao mover a tarefa"),
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const renderTaskBlock = (task: TaskWithDetails | TaskWithActions, shiftDef: typeof SHIFTS[number]) => {
    const state = getTaskStatusState(task);
    const isActive = hasActiveExecution(task);

    let StateIcon = Circle;
    if (state === "blocked") StateIcon = Lock;
    else if (state === "in_progress") StateIcon = Play;
    else if (state === "completed") StateIcon = CheckCircle2;

    const totalShiftHours = shiftDef.endHour - shiftDef.startHour;
    let leftPct = 0;
    let widthPct = 100 / totalShiftHours; 

    if (task.startDate) {
      const d = new Date(task.startDate);
      const taskHour = d.getHours() + d.getMinutes() / 60;
      leftPct = Math.max(0, Math.min(100, ((taskHour - shiftDef.startHour) / totalShiftHours) * 100));

      if (task.endDate) {
        const eD = new Date(task.endDate);
        const endHour = eD.getHours() + eD.getMinutes() / 60;
        const durationHours = endHour - taskHour;
        widthPct = Math.max(2, Math.min(100 - leftPct, (durationHours / totalShiftHours) * 100));
      }
    }

    const style = level === 3 ? {} : { left: `${leftPct}%`, width: `${widthPct}%` };

    return (
      <div
        key={task.id}
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        onClick={() => onTaskClick(task.id)}
        onMouseEnter={() => setHoveredTaskId(task.id)}
        onMouseLeave={() => setHoveredTaskId(null)}
        className={`${styles.taskBlock} ${styles[`priority-${task.priority || "medium"}`]} ${styles[`state-${state}`]} ${
          hoveredTaskId === task.id ? styles.taskHovered : ""
        }`}
        style={style}
      >
        <div className={styles.taskBlockInner}>
          <StateIcon size={12} className={styles.statusIcon} />
          <span className={styles.taskName}>{task.name}</span>
          {isActive && <Clock size={12} className={styles.activeTimerIcon} />}
          {task.assigneeInitials && (
            <span className={styles.assigneeAvatar}>{task.assigneeInitials.substring(0, 2).toUpperCase()}</span>
          )}
        </div>
      </div>
    );
  };

  // --- Operator Mode Logic ---
  const { data: operatorData, isFetching: isOperatorFetching } = useTasksWithDailyView(
    mode === "operator" ? operatorId : undefined,
    mode === "operator" ? currentDate : undefined
  );
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const operatorProjects = useMemo(() => {
    if (!operatorData?.tasks) return [];
    const projectsMap = new Map<string, { projectId: string; projectName: string; tasks: typeof operatorData.tasks }>();
    operatorData.tasks.forEach(task => {
      const projectId = task.projectId;
      const projectName = task.projectName || 'Sem Projeto';
      if (!projectsMap.has(projectId)) {
        projectsMap.set(projectId, { projectId, projectName, tasks: [] });
      }
      projectsMap.get(projectId)!.tasks.push(task);
    });
    return Array.from(projectsMap.values());
  }, [operatorData]);

  useEffect(() => {
    if (operatorProjects.length > 0) {
      setExpandedProjects(new Set(operatorProjects.map(p => p.projectId)));
      setExpandedTasks(new Set(operatorProjects.flatMap(p => p.tasks.map(t => t.id))));
    }
  }, [operatorProjects]);

  const toggleProject = (id: string) => {
    const next = new Set(expandedProjects);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedProjects(next);
  };

  const toggleTask = (id: string) => {
    const next = new Set(expandedTasks);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedTasks(next);
  };

  if (mode === "operator") {
    if (isOperatorFetching) {
      return (
        <div ref={containerRef} className={`${styles.operatorPanel} ${adaptiveClass} ${styles[`level${level}`]}`}>
          <Skeleton style={{ height: "100px", borderRadius: "var(--radius-lg)" }} />
          <Skeleton style={{ height: "60px" }} />
          <Skeleton style={{ height: "200px" }} />
        </div>
      );
    }

    if (!operatorData || operatorData.tasks.length === 0) {
      return (
        <div ref={containerRef} className={`${styles.operatorPanel} ${adaptiveClass} ${styles[`level${level}`]}`}>
          <div className={styles.emptyStateContainer}>
            <CalendarIcon size={48} className={styles.emptyIcon} />
            <h3>Nenhuma tarefa para hoje</h3>
            <p>Este operador não possui tarefas ou ações alocadas para a data selecionada.</p>
          </div>
        </div>
      );
    }

    let opTotalTasks = 0;
    let opCompletedTasks = 0;
    let opActiveExecutionId: string | null = null;

    operatorProjects.forEach(p => {
      p.tasks.forEach(t => {
        opTotalTasks++;
        if (t.status === 'completed') opCompletedTasks++;
        (t.actions || []).forEach(a => {
          a.executions.forEach(e => {
            if (e.status === 'in_progress') {
              opActiveExecutionId = e.id;
            }
          });
        });
      });
    });

    return (
      <div ref={containerRef} className={`${styles.operatorPanel} ${adaptiveClass} ${styles[`level${level}`]}`}>
        <div className={styles.summaryBar}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total de Tarefas</span>
            <span className={styles.summaryValue}>{opTotalTasks}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Tarefas Concluídas</span>
            <span className={styles.summaryValue}>
              {opCompletedTasks} <span className={styles.summarySub}>/ {opTotalTasks}</span>
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Tempo Registrado Hoje</span>
            <span className={styles.summaryValue}>{formatMinutes(operatorData.totalTimeLogged || 0)}</span>
          </div>
        </div>

        <div className={styles.projectsContainer}>
          {operatorProjects.map(project => (
            <div key={project.projectId} className={styles.projectSection}>
              <div className={styles.projectHeader} onClick={() => toggleProject(project.projectId)}>
                {expandedProjects.has(project.projectId) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                <h2 className={styles.projectTitle}>{project.projectName}</h2>
                <Badge variant="secondary">{project.tasks.length} tarefas</Badge>
              </div>

              {expandedProjects.has(project.projectId) && (
                <div className={styles.tasksList}>
                  {project.tasks.map(task => (
                    <div key={task.id} className={styles.taskCard}>
                      <div className={styles.taskHeader} onClick={() => toggleTask(task.id)}>
                        <div className={styles.taskInfo}>
                          <div className={styles.taskTitleRow}>
                            {expandedTasks.has(task.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <span className={styles.opTaskTitle} onClick={(e) => { e.stopPropagation(); onTaskClick(task.id); }}>{task.name}</span>
                            <Badge variant={task.status === 'completed' ? 'success' : 'outline'}>
                              {statusMap[task.status || 'open'] || task.status}
                            </Badge>
                            <Badge variant="outline" className={styles[`priority-${task.priority || 'medium'}`]}>
                              {priorityMap[task.priority || 'medium'] || task.priority}
                            </Badge>
                          </div>
                          <div className={styles.taskProgress}>
                            <Progress value={task.progress || 0} />
                          </div>
                        </div>
                        <div className={styles.taskMeta}>
                          <span className={styles.actionCount}>{(task.actions || []).length} ações</span>
                        </div>
                      </div>
                      
                      {expandedTasks.has(task.id) && (
                        <div className={styles.taskBody}>
                          {task.actions && task.actions.length > 0 ? (
                            task.actions.map(action => (
                              <ActionItem 
                                key={action.id} 
                                action={action} 
                                operatorId={operatorId!}
                                operatorName={operatorName}
                                activeExecutionId={opActiveExecutionId} 
                              />
                            ))
                          ) : (
                            <span className={styles.noActions}>Nenhuma ação definida para esta tarefa.</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- All / Timeline Mode Logic ---
  return (
    <div ref={containerRef} className={`${styles.container} ${adaptiveClass} ${styles[`level${level}`]}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{dayName}</h2>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{total}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{completed}</span>
            <span className={styles.statLabel}>Concluídas</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{avgProgress}%</span>
            <span className={styles.statLabel}>Progresso</span>
          </div>
        </div>
      </div>

      <div className={styles.timelineContainer}>
        {/* Agenda aberta */}

        {SHIFTS.map((shift) => {
          const shiftTasks = tasksByShift.get(shift.id) || [];

          const totalHours = shift.endHour - shift.startHour;
          const hours = Array.from({ length: totalHours }, (_, i) => shift.startHour + i);

          return (
            <div key={shift.id} className={styles.shiftBand}>
              <div className={styles.shiftHeader}>
                                {(() => { const ShiftIcon = SHIFT_ICONS[shift.id]; return <ShiftIcon size={16} className={styles.shiftIcon} />; })()}
                <span className={styles.shiftLabel}>{shift.label}</span>
              </div>
              
              <div className={styles.shiftContent}>
                <div className={styles.timeRuler}>
                  {hours.map((h) => (
                    <div key={h} className={styles.hourMarker}>
                      <span className={styles.hourText}>{`${h.toString().padStart(2, '0')}h`}</span>
                    </div>
                  ))}
                </div>
                
                <div className={styles.tasksArea}>
                  <div className={styles.dropZonesRow}>
                    {hours.map((h, i) => (
                      <div
                        key={h}
                        title="Nova Tarefa (arraste, clique 1x ou duplo clique rápido)"
                        className={styles.dropZone}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, shift.id, i)}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (e.detail === 2) {
                            if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
                            setQuickAddShift(shift.id);
                          } else if (e.detail === 1) {
                            clickTimeoutRef.current = setTimeout(() => {
                              onTaskClick("new");
                            }, 250); // delay to wait for potential double click
                          }
                        }}
                      />
                    ))}
                  </div>

                  <div className={styles.tasksWrapper}>
                    {quickAddShift === shift.id && (
                      <div style={{ position: "absolute", top: 0, left: 0, width: "300px", zIndex: 100 }}>
                        <CronogramaQuickAdd 
                          date={currentDate} 
                          shift={shift.id} 
                          onClose={() => setQuickAddShift(null)} 
                        />
                      </div>
                    )}
                    {shiftTasks.map(t => renderTaskBlock(t, shift))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};