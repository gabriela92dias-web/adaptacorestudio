import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { usePermissions } from "../helpers/usePermissions";
import { PermissionWall } from "../components/PermissionWall";
import { useTasks } from "../helpers/useCoreActApi";
import { CreateTaskModal } from "../components/CoreActQuickActions";
import { CoreActTaskDetailSheet } from "../components/CoreActTaskDetailSheet";
import styles from "./coreact.tarefas.module.css";
import { Calendar, MessageSquare, Paperclip, MoreHorizontal } from "lucide-react";

const COLUMNS = [
  { id: "open", label: "A Fazer" },
  { id: "in_progress", label: "Em Andamento" },
  { id: "standby", label: "Em Espera" },
  { id: "completed", label: "Concluído" }
];

export default function CoreactTarefas() {
  const { hasPermission } = usePermissions();
  const { data: tasksData, isLoading } = useTasks();
  
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  if (!hasPermission("coreactTarefas")) {
    return <PermissionWall moduleName="Tarefas" />;
  }

  const tasks = tasksData?.tasks || [];

  return (
    <div className={styles.container}>
      <Helmet><title>CoreStudio | Tarefas</title></Helmet>
      <header className={styles.header}>
        <h1 className={styles.title}>Tarefas</h1>
        <button 
          onClick={() => setIsCreatingTask(true)}
          style={{
            padding: "0.75rem 1.5rem", background: "var(--text-primary)", 
            color: "var(--bg-primary)", borderRadius: "999px",
            border: "none", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer"
          }}
        >
          Criar Tarefa
        </button>
      </header>

      <div className={styles.kanbanBoard}>
        {isLoading && <p style={{ padding: '2rem' }}>Carregando tarefas...</p>}
        {!isLoading && COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id || (col.id === 'standby' && t.status === 'blocked'));
          const isCompleteCol = col.id === "completed";

          return (
            <div key={col.id} className={styles.kanbanColumn}>
              <div className={styles.columnHeader}>
                {col.label} <span className={styles.taskCount}>({colTasks.length})</span>
              </div>
              
              {colTasks.map(task => {
                // UX: Se a tarefa está "Complete", ela colapsa visualmente (discreta)
                if (isCompleteCol) {
                  return (
                    <div 
                      key={task.id} 
                      className={`${styles.card} ${styles.collapsed}`}
                      onClick={() => setSelectedTaskId(task.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <span className={styles.cardTitle}>{task.name}</span>
                      <div className={styles.avatarGroup}>
                        <div className={styles.avatar}>
                          {task.assigneeInitials ? (
                            <div style={{ background: 'var(--bg-tertiary)', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                              {task.assigneeInitials}
                            </div>
                          ) : (
                            <div style={{ background: 'var(--bg-tertiary)', width: '100%', height: '100%' }} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div 
                    key={task.id} 
                    className={styles.card}
                    onClick={() => setSelectedTaskId(task.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={styles.cardTop}>
                      <div className={styles.tagGroup}>
                        {task.projectName && (
                          <span className={styles.tag}>{task.projectName}</span>
                        )}
                        {task.stageName && (
                          <span className={styles.tag}>{task.stageName}</span>
                        )}
                      </div>
                      <MoreHorizontal size={18} color="var(--text-tertiary)" />
                    </div>

                    <h3 className={styles.cardTitle}>{task.name}</h3>
                    <p className={styles.cardDesc}>
                      {task.progress ? `${task.progress}% concluído` : "0% concluído"}
                    </p>

                    <div className={styles.cardBottom}>
                      {task.endDate && (
                        <div className={styles.dueDate}>
                          <Calendar size={12} />
                          {new Date(task.endDate).toLocaleDateString("pt-BR")}
                        </div>
                      )}

                      <div className={styles.metaIcons}>
                        <div className={styles.avatarGroup}>
                          {task.assigneeInitials && (
                             <div className={styles.avatar} style={{ zIndex: 10 }}>
                                <div style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                                  {task.assigneeInitials}
                                </div>
                             </div>
                          )}
                        </div>

                        {task.actions && task.actions.length > 0 && (
                          <div className={styles.metaItem}>
                            <MessageSquare size={14} /> {task.actions.length}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <CreateTaskModal open={isCreatingTask} onOpenChange={setIsCreatingTask} />
      
      {selectedTaskId && (
        <CoreActTaskDetailSheet 
          taskId={selectedTaskId} 
          onClose={() => setSelectedTaskId(null)} 
        />
      )}
    </div>
  );
}
