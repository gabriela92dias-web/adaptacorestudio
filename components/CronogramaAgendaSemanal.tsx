import React, { useState, useMemo, useLayoutEffect, useRef } from "react";
import { Sunrise, Sun, Moon, Lock, Play, CheckCircle2, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useUpdateTask } from "../helpers/useCoreActApi";
import type { TaskWithDetails } from "../endpoints/coreact/tasks/list_GET.schema";
import type { TaskDependencyWithDetails } from "../endpoints/coreact/dependencies/list_GET.schema";
import { Button } from "./Button";
import { CronogramaQuickAdd } from "./CronogramaQuickAdd";
import styles from "./CronogramaAgendaSemanal.module.css";

export type ComputedTaskState = "completed" | "in_progress" | "blocked" | "ready";

export interface CronogramaAgendaSemanalProps {
  tasks: TaskWithDetails[];
  projects: { id: string; name: string }[];
  dependencies?: TaskDependencyWithDetails[];
  teamMembers?: { id: string; name: string }[];
  currentDate: Date;
  onTaskClick: (taskId: string) => void;
  onCellClick?: (date: Date, shift: "morning" | "afternoon" | "night") => void;
  onNavigate?: (dir: 1 | -1) => void;
  level?: 0 | 1 | 2 | 3;
}

// Helpers
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date: Date, days: number) => {
  const r = new Date(date);
  r.setDate(r.getDate() + days);
  return r;
};
const getStartOfWeek = (date: Date) => {
  const r = new Date(date);
  const day = r.getDay();
  const diff = r.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
  return startOfDay(new Date(r.setDate(diff)));
};
const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

const weekDayFormatter = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });
const dayMonthFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" });

export function CronogramaAgendaSemanal({
  tasks,
  dependencies,
  currentDate,
  onTaskClick,
  onCellClick,
  onNavigate,
  level = 0,
}: CronogramaAgendaSemanalProps) {
  const updateTask = useUpdateTask();
  const boardRef = useRef<HTMLDivElement>(null);

  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const [dependencyLines, setDependencyLines] = useState<{ id: string; x1: number; y1: number; x2: number; y2: number }[]>([]);
  
  const [quickAddCell, setQuickAddCell] = useState<{ date: Date, shift: string, dayIndex: number } | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Compute week dates
  const weekStart = useMemo(() => getStartOfWeek(currentDate), [currentDate]);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  // Task Status Logic
  const taskStatusMap = useMemo(() => {
    const map = new Map<string, ComputedTaskState>();
    tasks.forEach((t) => {
      if (t.progress === 100 || t.status === "completed") map.set(t.id, "completed");
      else if ((t.progress && t.progress > 0) || t.status === "in_progress") map.set(t.id, "in_progress");
      else map.set(t.id, "ready");
    });
    if (dependencies) {
      dependencies.forEach((dep) => {
        if (map.get(dep.taskId) === "completed") return;
        const sStatus = map.get(dep.dependsOnTaskId);
        if (dep.dependencyType === "finish_to_start" && sStatus !== "completed") {
          map.set(dep.taskId, "blocked");
        }
      });
    }
    return map;
  }, [tasks, dependencies]);

  // Segment generation logic
  type TaskSegment = { task: TaskWithDetails; type: "mon-fri" | "sat" | "sun"; col: number; span: number; slot: number; state: ComputedTaskState };

  const generateSegments = (task: TaskWithDetails): Omit<TaskSegment, "slot" | "state">[] => {
    const segs: Omit<TaskSegment, "slot" | "state">[] = [];
    if (!task.startDate || !task.endDate) return segs;

    const tStart = startOfDay(new Date(task.startDate)).getTime();
    const tEnd = startOfDay(new Date(task.endDate)).getTime();
    const wStart = weekStart.getTime();
    const wEnd = wStart + 6 * 86400000;

    if (tEnd < wStart || tStart > wEnd) return segs; // No overlap

    const overlapStart = Math.max(tStart, wStart);
    const overlapEnd = Math.min(tEnd, wEnd);

    let mfStart = -1;
    let mfEnd = -1;

    for (let d = new Date(overlapStart); d.getTime() <= overlapEnd; d = addDays(d, 1)) {
      const dayIndex = d.getDay(); // 0=Sun, 1=Mon...
      if (dayIndex >= 1 && dayIndex <= 5) {
        if (mfStart === -1) mfStart = dayIndex;
        mfEnd = dayIndex;
      } else if (dayIndex === 6) {
        segs.push({ task, type: "sat", col: 1, span: 1 });
      } else if (dayIndex === 0) {
        segs.push({ task, type: "sun", col: 1, span: 1 });
      }
    }

    if (mfStart !== -1) {
      segs.push({ task, type: "mon-fri", col: mfStart, span: mfEnd - mfStart + 1 });
    }
    return segs;
  };

  // Build grid data per shift
  const shiftsData = useMemo(() => {
    const shifts = [
      { id: "morning", label: "Manhã", Icon: Sunrise },
      { id: "afternoon", label: "Tarde", Icon: Sun },
      { id: "night", label: "Noite", Icon: Moon },
    ] as const;

    return shifts.map((shift) => {
      const shiftTasks = tasks.filter((t) => (t.shift || "morning") === shift.id);
      
      const mfSegs: TaskSegment[] = [];
      const satSegs: TaskSegment[] = [];
      const sunSegs: TaskSegment[] = [];

      shiftTasks.forEach((t) => {
        const segs = generateSegments(t);
        const state = taskStatusMap.get(t.id) || "ready";
        segs.forEach((s) => {
          const fullSeg = { ...s, slot: 0, state };
          if (s.type === "mon-fri") mfSegs.push(fullSeg);
          if (s.type === "sat") satSegs.push(fullSeg);
          if (s.type === "sun") sunSegs.push(fullSeg);
        });
      });

      // Sort and Slot Mon-Fri
      mfSegs.sort((a, b) => b.span - a.span || a.col - b.col);
      const mfSlots: number[] = [];
      mfSegs.forEach((seg) => {
        let slot = mfSlots.findIndex((endCol) => endCol < seg.col);
        if (slot === -1) {
          slot = mfSlots.length;
          mfSlots.push(seg.col + seg.span - 1);
        } else {
          mfSlots[slot] = seg.col + seg.span - 1;
        }
        seg.slot = slot;
      });

      // Slot Sat/Sun (vertical stack)
      satSegs.forEach((seg, i) => (seg.slot = i));
      sunSegs.forEach((seg, i) => (seg.slot = i));

      return { ...shift, mfSegs, satSegs, sunSegs };
    });
  }, [tasks, weekStart, taskStatusMap]);

  // Dependency overlay rendering
  useLayoutEffect(() => {
    if (!hoveredTaskId || !dependencies || !boardRef.current) {
      setDependencyLines([]);
      return;
    }

    const boardRect = boardRef.current.getBoundingClientRect();
    const newLines = dependencies
      .filter((d) => d.taskId === hoveredTaskId || d.dependsOnTaskId === hoveredTaskId)
      .map((d) => {
        const el1 = document.querySelector(`[data-task-id="${d.dependsOnTaskId}"]`);
        const el2 = document.querySelector(`[data-task-id="${d.taskId}"]`);
        if (el1 && el2) {
          const r1 = el1.getBoundingClientRect();
          const r2 = el2.getBoundingClientRect();
          return {
            id: d.id,
            x1: r1.left + r1.width / 2 - boardRect.left,
            y1: r1.top + r1.height / 2 - boardRect.top,
            x2: r2.left + r2.width / 2 - boardRect.left,
            y2: r2.top + r2.height / 2 - boardRect.top,
          };
        }
        return null;
      })
      .filter((l): l is NonNullable<typeof l> => l !== null);

    setDependencyLines(newLines);
  }, [hoveredTaskId, tasks, dependencies, shiftsData]);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ id: taskId }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, targetDayIndex: number, targetShift: "morning" | "afternoon" | "night") => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (!data.id) return;

      const task = tasks.find((t) => t.id === data.id);
      if (!task || !task.startDate || !task.endDate) return;

      // targetDayIndex: 1=Mon, ..., 5=Fri, 6=Sat, 0=Sun
      const dayOffset = targetDayIndex === 0 ? 6 : targetDayIndex - 1;
      const exactTargetDate = addDays(weekStart, dayOffset);

      const oldStart = startOfDay(new Date(task.startDate));
      const diffMs = exactTargetDate.getTime() - oldStart.getTime();
      const newStart = exactTargetDate;
      const newEnd = new Date(new Date(task.endDate).getTime() + diffMs);

      updateTask.mutate(
        { id: task.id, startDate: newStart, endDate: newEnd, shift: targetShift },
        {
          onSuccess: () => toast.success("Tarefa movida com sucesso"),
          onError: () => toast.error("Erro ao mover a tarefa"),
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Rendering Task Blocks
  const renderTaskBlock = (seg: TaskSegment) => {
    const { task, col, span, slot, state } = seg;
    let StateIcon = Circle;
    if (state === "blocked") StateIcon = Lock;
    else if (state === "in_progress") StateIcon = Play;
    else if (state === "completed") StateIcon = CheckCircle2;

    return (
      <div
        key={`${task.id}-${seg.type}`}
        data-task-id={task.id}
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        onClick={() => onTaskClick(task.id)}
        onMouseEnter={() => setHoveredTaskId(task.id)}
        onMouseLeave={() => setHoveredTaskId(null)}
        className={`${styles.taskBlock} ${styles[`priority-${task.priority || "medium"}`]} ${styles[`state-${state}`]} ${
          hoveredTaskId === task.id ? styles.taskHovered : ""
        }`}
        style={{ gridColumn: `${col} / span ${span}`, gridRow: slot + 1 }}
      >
        <StateIcon size={12} className={styles.statusIcon} />
        <span className={styles.taskName}>{task.name}</span>
        {task.assigneeInitials && <span className={styles.assigneeAvatar}>{task.assigneeInitials.substring(0, 2).toUpperCase()}</span>}
      </div>
    );
  };

  return (
    <div className={`${styles.container} ${styles[`level${level}`]}`}>
      {/* Optional Navigation Header */}
      {onNavigate && (
        <div className={styles.navHeader}>
          <div className={styles.navControls}>
            <Button variant="outline" size="icon-sm" onClick={() => onNavigate(-1)}>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="outline" size="icon-sm" onClick={() => onNavigate(1)}>
              <ChevronRight size={16} />
            </Button>
            <span className={styles.currentMonthLabel}>
              {new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(currentDate)}
            </span>
          </div>
        </div>
      )}

      {/* Main Board */}
      <div className={styles.boardWrapper}>
        <div className={styles.boardContent} ref={boardRef}>
          <div className={styles.leftSection}>
            {/* Columns Header */}
            <div className={styles.columnsHeaderRow}>
              <div className={styles.rowHeaderPlaceholder} />
              <div className={styles.monFriHeader}>
                {days.slice(0, 5).map((d) => (
                  <div 
                    key={d.toISOString()} 
                    className={`${styles.colHeader} ${isSameDay(d, new Date()) ? styles.todayText : ""}`}
                    onClick={() => onCellClick?.(d, "morning")}
                    style={{ cursor: "pointer" }}
                  >
                    <span className={styles.dayName}>{weekDayFormatter.format(d)}</span>
                    <span className={styles.dayDate}>{dayMonthFormatter.format(d)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shifts */}
            {shiftsData.map((shift) => (
              <div key={shift.id} className={styles.shiftRow}>
                <div className={styles.rowHeader}>
                  <shift.Icon size={16} className={styles.shiftIcon} />
                  <span className={styles.shiftLabel}>{shift.label}</span>
                </div>
                <div className={styles.shiftContent}>
                  <div className={styles.monFriArea}>
                    {/* Background Grid & Drop Zones */}
                    <div className={styles.monFriBg}>
                      {[1, 2, 3, 4, 5].map((dayIndex) => {
                        const d = days[dayIndex - 1];
                        return (
                          <div
                            key={dayIndex}
                            className={`${styles.dropZone} ${isSameDay(d, new Date()) ? styles.todayBg : ""}`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, dayIndex, shift.id as any)}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (e.detail === 2) {
                                if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
                                setQuickAddCell({ date: d, shift: shift.id, dayIndex });
                              } else if (e.detail === 1) {
                                clickTimeoutRef.current = setTimeout(() => {
                                  onCellClick?.(d, shift.id as any);
                                }, 250);
                              }
                            }}
                          />
                        );
                      })}
                    </div>
                    {/* Foreground Tasks */}
                    <div className={styles.monFriTasks}>
                        {shift.mfSegs.map(renderTaskBlock)}
                        {quickAddCell?.shift === shift.id && quickAddCell.dayIndex >= 1 && quickAddCell.dayIndex <= 5 && (
                          <div style={{ gridColumn: quickAddCell.dayIndex, gridRow: 1, zIndex: 100 }}>
                            <CronogramaQuickAdd date={quickAddCell.date} shift={shift.id} onClose={() => setQuickAddCell(null)} />
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.fdsColumn}>
            <div className={styles.fdsColumnHeader}>
              <span className={styles.fdsHeaderText}>FDS (Fim de Sem.)</span>
            </div>
            <div className={styles.fdsColumnBody}>
              {/* SATURDAY */}
              <div className={styles.fdsDaySection}>
                <div 
                  className={`${styles.fdsDayHeader} ${isSameDay(days[5], new Date()) ? styles.todayText : ""}`}
                  onClick={() => onCellClick?.(days[5], "morning")}
                  style={{ cursor: "pointer" }}
                >
                  <span className={styles.dayName}>Sáb</span>
                  <span className={styles.dayDate}>{dayMonthFormatter.format(days[5])}</span>
                </div>
                {shiftsData.map((shift) => (
                  <div key={`sat-${shift.id}`} className={styles.fdsMiniShift}>
                    <div className={styles.fdsMiniShiftLabel}>{shift.label.toLowerCase()}</div>
                    <div className={styles.fdsMiniShiftContent}>
                      <div
                        className={`${styles.dropZone} ${styles.fdsDropZone} ${isSameDay(days[5], new Date()) ? styles.todayBg : ""}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, 6, shift.id as any)}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (e.detail === 2) {
                            if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
                            setQuickAddCell({ date: days[5], shift: shift.id, dayIndex: 6 });
                          } else if (e.detail === 1) {
                            clickTimeoutRef.current = setTimeout(() => {
                              onCellClick?.(days[5], shift.id as any);
                            }, 250);
                          }
                        }}
                      />
                      <div className={styles.fdsTasks} style={{ position: "relative" }}>
                          {shift.satSegs.map(renderTaskBlock)}
                          {quickAddCell?.shift === shift.id && quickAddCell.dayIndex === 6 && (
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '200px', zIndex: 100 }}>
                              <CronogramaQuickAdd date={quickAddCell.date} shift={shift.id} onClose={() => setQuickAddCell(null)} />
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* SUNDAY */}
              <div className={styles.fdsDaySection}>
                <div 
                  className={`${styles.fdsDayHeader} ${isSameDay(days[6], new Date()) ? styles.todayText : ""}`}
                  onClick={() => onCellClick?.(days[6], "morning")}
                  style={{ cursor: "pointer" }}
                >
                  <span className={styles.dayName}>Dom</span>
                  <span className={styles.dayDate}>{dayMonthFormatter.format(days[6])}</span>
                </div>
                {shiftsData.map((shift) => (
                  <div key={`sun-${shift.id}`} className={styles.fdsMiniShift}>
                    <div className={styles.fdsMiniShiftLabel}>{shift.label.toLowerCase()}</div>
                    <div className={styles.fdsMiniShiftContent}>
                      <div
                        className={`${styles.dropZone} ${styles.fdsDropZone} ${isSameDay(days[6], new Date()) ? styles.todayBg : ""}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, 0, shift.id as any)}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (e.detail === 2) {
                            if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
                            setQuickAddCell({ date: days[6], shift: shift.id, dayIndex: 0 });
                          } else if (e.detail === 1) {
                            clickTimeoutRef.current = setTimeout(() => {
                              onCellClick?.(days[6], shift.id as any);
                            }, 250);
                          }
                        }}
                      />
                      <div className={styles.fdsTasks} style={{ position: "relative" }}>
                          {shift.sunSegs.map(renderTaskBlock)}
                          {quickAddCell?.shift === shift.id && quickAddCell.dayIndex === 0 && (
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '200px', zIndex: 100 }}>
                              <CronogramaQuickAdd date={quickAddCell.date} shift={shift.id} onClose={() => setQuickAddCell(null)} />
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SVG Dependency Overlay */}
          {dependencyLines.length > 0 && (
            <svg className={styles.dependencyOverlay}>
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" className={styles.dependencyArrowMarker} />
                </marker>
              </defs>
              {dependencyLines.map((line) => (
                <line
                  key={line.id}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  className={styles.dependencyLine}
                  markerEnd="url(#arrow)"
                />
              ))}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}