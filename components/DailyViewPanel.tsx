import React, { useState, useEffect, useMemo } from "react";
import { useTasksWithDailyView, useCreateExecution, useUpdateExecution } from "../helpers/useCoreActApi";
import { Skeleton } from "./Skeleton";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Progress } from "./Progress";
import { Play, Square, ChevronDown, ChevronRight, Clock, Calendar as CalendarIcon } from "lucide-react";
import { TaskActionWithExecutions } from "../endpoints/coreact/tasks/list_GET.schema";
import styles from "./DailyViewPanel.module.css";

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
    
    // Set initial value
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

export default function DailyViewPanel({ 
  operatorId, 
  operatorName, 
  date 
}: { 
  operatorId: string; 
  operatorName: string; 
  date: Date;
}) {
  const { data, isFetching } = useTasksWithDailyView(operatorId, date);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  // Group tasks by project
  const projects = useMemo(() => {
    if (!data?.tasks) return [];
    
    const projectsMap = new Map<string, { projectId: string; projectName: string; tasks: typeof data.tasks }>();
    
    data.tasks.forEach(task => {
      const projectId = task.projectId;
      const projectName = task.projectName || 'Sem Projeto';
      
      if (!projectsMap.has(projectId)) {
        projectsMap.set(projectId, { projectId, projectName, tasks: [] });
      }
      
      projectsMap.get(projectId)!.tasks.push(task);
    });
    
    return Array.from(projectsMap.values());
  }, [data]);

  // Auto-expand projects and tasks when data loads
  useEffect(() => {
    if (projects.length > 0) {
      setExpandedProjects(new Set(projects.map(p => p.projectId)));
      setExpandedTasks(new Set(projects.flatMap(p => p.tasks.map(t => t.id))));
    }
  }, [projects]);

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

  if (isFetching) {
    return (
      <div className={styles.panel}>
        <Skeleton style={{ height: "100px", borderRadius: "var(--radius-lg)" }} />
        <Skeleton style={{ height: "60px" }} />
        <Skeleton style={{ height: "200px" }} />
      </div>
    );
  }

  if (!data || data.tasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <CalendarIcon size={48} className={styles.emptyIcon} />
        <h3>Nenhuma tarefa para hoje</h3>
        <p>Este operador não possui tarefas ou ações alocadas para a data selecionada.</p>
      </div>
    );
  }

  let totalTasks = 0;
  let completedTasks = 0;
  let activeExecutionId: string | null = null;

  projects.forEach(p => {
    p.tasks.forEach(t => {
      totalTasks++;
      if (t.status === 'completed') completedTasks++;
      (t.actions || []).forEach(a => {
        a.executions.forEach(e => {
          if (e.status === 'in_progress') {
            activeExecutionId = e.id;
          }
        });
      });
    });
  });

  return (
    <div className={styles.panel}>
      <div className={styles.summaryBar}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total de Tarefas</span>
          <span className={styles.summaryValue}>{totalTasks}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Tarefas Concluídas</span>
          <span className={styles.summaryValue}>
            {completedTasks} <span className={styles.summarySub}>/ {totalTasks}</span>
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Tempo Registrado Hoje</span>
          <span className={styles.summaryValue}>{formatMinutes(data.totalTimeLogged || 0)}</span>
        </div>
      </div>

      <div className={styles.projectsContainer}>
        {projects.map(project => (
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
                          <span className={styles.taskTitle}>{task.name}</span>
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
                              operatorId={operatorId}
                              operatorName={operatorName}
                              activeExecutionId={activeExecutionId} 
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