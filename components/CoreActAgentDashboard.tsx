import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTasksWithDailyView, useCreateExecution, useUpdateExecution } from "../helpers/useCoreActApi";
import { Skeleton } from "./Skeleton";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Progress } from "./Progress";
import { Play, Square, CheckCircle2 } from "lucide-react";
import { TaskActionWithExecutions } from "../endpoints/coreact/tasks/list_GET.schema";
import styles from "./CoreActAgentDashboard.module.css";

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

const getPriorityClass = (priority?: string | null) => {
  switch (priority) {
    case 'critical': return styles.priorityCritical;
    case 'high': return styles.priorityHigh;
    case 'low': return styles.priorityLow;
    case 'medium':
    default: return styles.priorityMedium;
  }
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

function AgentActionItem({ 
  action, 
  operatorId, 
  activeExecutionId 
}: { 
  action: TaskActionWithExecutions; 
  operatorId: string;
  activeExecutionId: string | null;
}) {
  const createExecution = useCreateExecution();
  const updateExecution = useUpdateExecution();
  
  const inProgressExec = action.executions.find(e => e.status === 'in_progress');

  const handleStart = () => {
    createExecution.mutate({
      taskActionId: action.id,
      operatorId: operatorId,
      startedAt: new Date(),
      status: 'in_progress'
    });
  };

  const handleStop = () => {
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
      <div className={styles.actionInfo}>
        <span className={styles.actionTitle}>{action.title}</span>
        <Badge variant="secondary">{actionTypeMap[action.type] || action.type}</Badge>
        <Badge variant={action.status === 'completed' ? 'success' : action.status === 'in_progress' ? 'primary' : 'outline'}>
          {actionStatusMap[action.status] || action.status}
        </Badge>
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
  );
}

export function CoreActAgentDashboard({ teamMemberId, userName }: { teamMemberId: string; userName: string }) {
  const today = new Date();
  const todayStr = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(today);
  const { data, isFetching: isLoading } = useTasksWithDailyView(teamMemberId, today);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Skeleton style={{ height: "100px", borderRadius: "var(--radius-lg)" }} />
        <Skeleton style={{ height: "60px" }} />
        <Skeleton style={{ height: "200px" }} />
      </div>
    );
  }

  let totalTasks = 0;
  let completedTasks = 0;
  let activeExecutionId: string | null = null;
  const flatTasks: Array<{ task: any, projectName: string }> = [];

  if (data) {
    data.tasks.forEach(t => {
      totalTasks++;
      if (t.status === 'completed') completedTasks++;
      flatTasks.push({ task: t, projectName: t.projectName || 'Sem Projeto' });
      
      t.actions?.forEach(a => {
        a.executions.forEach(e => {
          if (e.status === 'in_progress') {
            activeExecutionId = e.id;
          }
        });
      });
    });
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.greeting}>Olá, {userName}!</h1>
        <p className={styles.dateSubtitle}>{todayStr.charAt(0).toUpperCase() + todayStr.slice(1)}</p>
      </header>

      <div className={styles.summaryBar}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Minhas Tarefas Hoje</span>
          <span className={styles.summaryValue}>{totalTasks}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Concluídas</span>
          <span className={styles.summaryValue}>
            {completedTasks}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Tempo Registrado</span>
          <span className={styles.summaryValue}>{formatMinutes(data?.totalTimeLogged || 0)}</span>
        </div>
      </div>

      {flatTasks.length === 0 ? (
        <div className={styles.emptyState}>
          <CheckCircle2 size={48} className={styles.emptyIcon} />
          <h3>Tudo limpo por aqui!</h3>
          <p>Você não tem tarefas atribuídas para o dia de hoje.</p>
        </div>
      ) : (
        <div className={styles.tasksList}>
          {flatTasks.map(({ task, projectName }) => (
            <div key={task.id} className={styles.taskCard}>
              <div className={styles.taskHeader}>
                <div className={styles.taskTitleRow}>
                  <div className={styles.taskTitleGroup}>
                    <span className={styles.taskTitle}>{task.name}</span>
                    <span className={styles.projectName}>({projectName})</span>
                  </div>
                  <div className={styles.taskBadges}>
                    <Badge variant={task.status === 'completed' ? 'success' : 'outline'}>
                      {statusMap[task.status || 'open'] || task.status}
                    </Badge>
                    <Badge variant="outline" className={`${styles.priorityBadge} ${getPriorityClass(task.priority)}`}>
                      {priorityMap[task.priority || 'medium'] || task.priority}
                    </Badge>
                  </div>
                </div>
                <div className={styles.taskProgress}>
                  <Progress value={task.progress || 0} />
                </div>
              </div>
              <div className={styles.actionsList}>
                {task.actions && task.actions.length > 0 ? (
                  task.actions.map((action: TaskActionWithExecutions) => (
                    <AgentActionItem 
                      key={action.id} 
                      action={action} 
                      operatorId={teamMemberId}
                      activeExecutionId={activeExecutionId} 
                    />
                  ))
                ) : (
                  <span className={styles.noActions}>Nenhuma ação definida para esta tarefa.</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <Link to="/coreact/visao-diaria" className={styles.linkText}>
          Ver visão diária completa &rarr;
        </Link>
      </div>
    </div>
  );
}