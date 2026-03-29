import React, { useState, useMemo, useEffect, useRef } from "react";
import type { TaskWithDetails } from "../endpoints/coreact/tasks/list_GET.schema";
import { useUpdateTask } from "../helpers/useCoreActApi";
import { toast } from "sonner";
import { TaskStatus } from "../helpers/schema";
import { Badge } from "./Badge";
import { Avatar, AvatarFallback } from "./Avatar";
import { Progress } from "./Progress";
import { Button } from "./Button";
import { CalendarRange, ClipboardList } from "lucide-react";
import type { GanttViewMode } from "./CronogramaGantt";
import styles from "./CronogramaKanban.module.css";

interface ViewProps {
  tasks: TaskWithDetails[];
  projects: { id: string; name: string }[];
  onTaskClick: (taskId: string) => void;
  level?: 0 | 1 | 2 | 3;
  ganttZoom?: GanttViewMode;
  currentDate?: Date;
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  standby: { label: "Em Espera", className: styles.statusStandby },
  open: { label: "Aberto", className: styles.statusOpen },
  in_progress: { label: "Em Andamento", className: styles.statusInProgress },
  blocked: { label: "Bloqueado", className: styles.statusBlocked },
  overdue: { label: "Atrasado", className: styles.statusOverdue },
  completed: { label: "Concluído", className: styles.statusCompleted },
};

const PRIORITY_MAP: Record<string, { label: string; className: string }> = {
  low: { label: "Baixa", className: styles.priorityLow },
  medium: { label: "Média", className: styles.priorityMedium },
  high: { label: "Alta", className: styles.priorityHigh },
  critical: { label: "Crítica", className: styles.priorityCritical },
};

export const CronogramaKanban = ({ tasks, onTaskClick, level = 0, ganttZoom, currentDate }: ViewProps) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [groupMode, setGroupMode] = useState<"status" | "time">("status");
  const [optimisticTasks, setOptimisticTasks] = useState<TaskWithDetails[]>(tasks);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);
  const { mutate: updateTask } = useUpdateTask();

  // Sync tasks
  useEffect(() => {
    setOptimisticTasks(tasks);
  }, [tasks]);

  // Time groupings builder
  const timeColumnsData = useMemo(() => {
    if (!ganttZoom || !currentDate) return [];

    let startDate = new Date(currentDate);
    let endDate = new Date(currentDate);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    if (ganttZoom === "ano") {
      startDate.setMonth(0, 1);
      endDate.setFullYear(startDate.getFullYear() + 1, 0, 0);
    } else if (ganttZoom === "semestre") {
      if (startDate.getMonth() < 6) {
        startDate.setMonth(0, 1);
        endDate.setMonth(6, 0);
      } else {
        startDate.setMonth(6, 1);
        endDate.setFullYear(startDate.getFullYear() + 1, 0, 0);
      }
    } else if (ganttZoom === "trimestre") {
      const q = Math.floor(startDate.getMonth() / 3);
      startDate.setMonth(q * 3, 1);
      endDate.setMonth(q * 3 + 3, 0);
    } else if (ganttZoom === "mes") {
      startDate.setDate(1);
      endDate.setMonth(startDate.getMonth() + 1, 0);
    } else if (ganttZoom === "quinzena1") {
      startDate.setDate(1);
      endDate.setDate(15);
    } else if (ganttZoom === "quinzena2") {
      startDate.setDate(16);
      endDate.setMonth(startDate.getMonth() + 1, 0);
    } else if (ganttZoom === "semana") {
      const day = startDate.getDay();
      startDate.setDate(startDate.getDate() - day);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
    } else if (ganttZoom === "dia") {
      endDate = new Date(startDate);
    }

    const minT = startDate.getTime();
    const maxT = endDate.getTime();
    const cols: Array<{ id: string; label: string; startMs: number; endMs: number }> = [];

    const isMonth = ["ano", "semestre", "trimestre"].includes(ganttZoom);
    const isDay = ["mes", "quinzena1", "quinzena2", "semana"].includes(ganttZoom);
    const isHour = ganttZoom === "dia";

    if (isMonth) {
      let cur = new Date(startDate);
      while (cur <= endDate) {
        const mStart = new Date(cur.getFullYear(), cur.getMonth(), 1);
        const mEnd = new Date(cur.getFullYear(), cur.getMonth() + 1, 0, 23, 59, 59, 999);
        const name = cur.toLocaleString("pt-BR", { month: "short" }).toUpperCase();
        cols.push({
          id: `time_${cur.getFullYear()}_${cur.getMonth()}`,
          label: `${name} ${cur.getFullYear()}`,
          startMs: Math.max(mStart.getTime(), minT),
          endMs: Math.min(mEnd.getTime(), maxT),
        });
        cur.setMonth(cur.getMonth() + 1, 1);
      }
    } else if (isDay) {
      let cur = new Date(startDate);
      while (cur <= endDate) {
        const dStart = new Date(cur);
        const dEnd = new Date(cur);
        dEnd.setHours(23, 59, 59, 999);
        const name = cur.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric" }).toUpperCase();
        cols.push({
          id: `time_${cur.getFullYear()}_${cur.getMonth()}_${cur.getDate()}`,
          label: name,
          startMs: dStart.getTime(),
          endMs: dEnd.getTime(),
        });
        cur.setDate(cur.getDate() + 1);
      }
    } else if (isHour) {
      let cur = new Date(startDate);
      const endDay = new Date(startDate);
      endDay.setHours(23, 59, 59, 999);
      while (cur <= endDay) {
        const hStart = new Date(cur);
        const hEnd = new Date(cur);
        hEnd.setMinutes(59, 59, 999);
        const name = `${cur.getHours().toString().padStart(2, '0')}:00`;
        cols.push({
          id: `time_${cur.getTime()}`,
          label: name,
          startMs: hStart.getTime(),
          endMs: hEnd.getTime(),
        });
        cur.setHours(cur.getHours() + 1);
      }
    }

    cols.push({
      id: "time_unassigned",
      label: "SEM DATA",
      startMs: 0,
      endMs: 0,
    });

    return cols;
  }, [ganttZoom, currentDate]);

  const displayColumns = useMemo(() => {
    if (groupMode === "status") {
      return ["standby", "open", "in_progress", "blocked", "overdue", "completed"].map(k => ({
        id: k,
        label: STATUS_MAP[k]?.label || k,
        className: STATUS_MAP[k]?.className || "",
      }));
    }
    
    return timeColumnsData.map(t => ({
      id: t.id,
      label: t.label,
      className: styles.statusOpen, // default theme style for time columns
      timeRef: t
    }));
  }, [groupMode, timeColumnsData]);

  const groupedTasks = useMemo(() => {
    const acc: Record<string, TaskWithDetails[]> = {};
    displayColumns.forEach(c => acc[c.id] = []);

    if (groupMode === "status") {
      optimisticTasks.forEach(task => {
        const status = task.status || "open";
        if (!acc[status]) acc[status] = [];
        acc[status].push(task);
      });
    } else {
      // time based
      optimisticTasks.forEach(task => {
        if (!task.startDate) {
          if (acc["time_unassigned"]) acc["time_unassigned"].push(task);
          return;
        }

        const tMs = new Date(task.startDate).getTime();
        let assigned = false;
        
        for (const col of displayColumns) {
          if (col.id !== "time_unassigned" && col.timeRef) {
            if (tMs >= col.timeRef.startMs && tMs <= col.timeRef.endMs) {
              acc[col.id].push(task);
              assigned = true;
              break;
            }
          }
        }
        
      if (!assigned && acc["time_unassigned"]) {
        acc["time_unassigned"].push(task);
      }
    });
  }
  return acc;
}, [optimisticTasks, groupMode, displayColumns]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', gap: '8px', padding: '12px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <Button 
          variant={groupMode === "status" ? "primary" : "outline"} 
          size="sm"
          onClick={() => setGroupMode("status")}
        >
          <ClipboardList size={16} className="mr-2" /> Agrupar por Status
        </Button>
        <Button 
          variant={groupMode === "time" ? "primary" : "outline"} 
          size="sm"
          onClick={() => setGroupMode("time")}
        >
          <CalendarRange size={16} className="mr-2" /> Agrupar por Período (Arrastar Tempo)
        </Button>
      </div>

      <div 
        className={`${styles.board} ${styles[`level${level}`] || ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          const rect = e.currentTarget.getBoundingClientRect();
          const threshold = 180; // Larger safe zone pixels for smoother activation
          const board = e.currentTarget;
          
          if (!scrollInterval.current) {
            if (e.clientX > rect.right - threshold) {
              scrollInterval.current = setInterval(() => { board.scrollLeft += 15 }, 16);
            } else if (e.clientX < rect.left + threshold) {
              scrollInterval.current = setInterval(() => { board.scrollLeft -= 15 }, 16);
            }
          }
        }}
        onDragLeave={() => {
          if (scrollInterval.current) { clearInterval(scrollInterval.current); scrollInterval.current = null; }
        }}
        onDrop={() => {
          if (scrollInterval.current) { clearInterval(scrollInterval.current); scrollInterval.current = null; }
        }}
      >
        {displayColumns.map((col) => {
          const columnTasks = groupedTasks[col.id] || [];

          return (
            <div 
              key={col.id} 
              className={`${styles.column} ${dragOverColumn === col.id ? styles.columnDragOver : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragOverColumn !== col.id) {
                  setDragOverColumn(col.id);
                }
              }}
              onDragLeave={() => {
                if (dragOverColumn === col.id) {
                  setDragOverColumn(null);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverColumn(null);
                const taskId = e.dataTransfer.getData("taskId");
                const sourceGroupId = e.dataTransfer.getData("sourceGroupId");
                if (scrollInterval.current) { clearInterval(scrollInterval.current); scrollInterval.current = null; }
                
                if (taskId && sourceGroupId !== col.id) {
                  const taskItem = optimisticTasks.find(t => t.id === taskId);
                  if (!taskItem) return;

                  if (groupMode === "status") {
                    setOptimisticTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: col.id as TaskStatus } : t));
                    updateTask(
                      { id: taskId, status: col.id as TaskStatus },
                      {
                        onSuccess: () => {
                          const sourceLabel = STATUS_MAP[sourceGroupId]?.label || sourceGroupId;
                          const targetLabel = col.label;
                          toast.success(`Status: ${sourceLabel} → ${targetLabel}`);
                        },
                        onError: () => toast.error("Erro ao atualizar status da tarefa.")
                      }
                    );
                  } else {
                    // Time grouping mode
                    if (col.id === "time_unassigned") {
                      setOptimisticTasks(prev => prev.map(t => t.id === taskId ? { ...t, startDate: null as any, endDate: null as any } : t));
                      updateTask(
                        { id: taskId, startDate: null, endDate: null },
                        { 
                          onSuccess: () => toast.success("Datas removidas da tarefa."),
                          onError: (err) => toast.error("Erro ao limpar datas: " + String(err))
                        }
                      );
                    } else if (col.timeRef) {
                      try {
                        let newStart = new Date(col.timeRef.startMs);
                        let newEnd: Date | null = taskItem.endDate ? new Date(taskItem.endDate) : null;

                        if (taskItem.startDate && newEnd) {
                          const diff = newStart.getTime() - new Date(taskItem.startDate).getTime();
                          newEnd = new Date(newEnd.getTime() + diff);
                        }

                        // Remove 'as any' and explicitly map to expected Types
                        setOptimisticTasks(prev => prev.map(t => 
                          t.id === taskId ? { 
                            ...t, 
                            startDate: newStart, 
                            endDate: newEnd 
                          } : t
                        ));
                        
                        updateTask(
                          { 
                            id: taskId, 
                            startDate: new Date(newStart.toISOString()), 
                            endDate: newEnd ? new Date(newEnd.toISOString()) : null 
                          },
                          { 
                            onSuccess: () => toast.success(`Tarefa movida para ${col.label}`),
                            onError: (err) => {
                                toast.error("Erro ao atualizar período da tarefa: " + String(err));
                                setOptimisticTasks(tasks); // REVERT optimistic update on error
                            }
                          }
                        );
                      } catch (e) {
                         toast.error("Erro ao processar datas da tarefa.");
                      }
                    }
                  }
                }
              }}
            >
              <div className={`${styles.columnHeader} ${col.className}`}>
                <span className={styles.columnTitle}>{col.label}</span>
                <Badge variant="secondary" className={styles.countBadge}>
                  {columnTasks.length}
                </Badge>
              </div>

              <div className={styles.cardList}>
                {columnTasks.map((task) => {
                  const priorityConfig =
                    PRIORITY_MAP[task.priority || "medium"] || PRIORITY_MAP.medium;

                  return (
                    <div
                      key={task.id}
                      className={`${styles.card} ${draggedTaskId === task.id ? styles.cardDragging : ""}`}
                      onClick={() => onTaskClick(task.id)}
                      role="button"
                      tabIndex={0}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("taskId", task.id);
                        e.dataTransfer.setData("sourceGroupId", col.id);
                        setDraggedTaskId(task.id);
                      }}
                      onDragEnd={() => {
                        setDraggedTaskId(null);
                        setDragOverColumn(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onTaskClick(task.id);
                        }
                      }}
                    >
                      <div className={styles.cardHeader}>
                        <Badge
                          variant="outline"
                          className={`${styles.priorityBadge} ${priorityConfig.className}`}
                        >
                          {priorityConfig.label}
                        </Badge>
                        {task.assigneeInitials && (
                          <Avatar className={styles.assigneeAvatar}>
                            <AvatarFallback>{task.assigneeInitials}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>

                      <h4 className={styles.taskTitle}>{task.name}</h4>

                      {task.projectName && (
                        <span className={styles.projectName}>
                          {task.projectName}
                        </span>
                      )}

                      {task.stageName && (
                        <span className={styles.projectName}>
                          Etapa: {task.stageName}
                        </span>
                      )}

                      <div className={styles.progressSection}>
                        <div className={styles.progressLabel}>
                          Progresso: {task.progress ?? 0}%
                        </div>
                        <Progress value={task.progress ?? 0} />
                      </div>
                    </div>
                  );
                })}
                {columnTasks.length === 0 && (
                  <div className={styles.emptyColumn}>Sem tarefas</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};