import React, { useMemo } from "react";
import type { TaskWithDetails } from "../endpoints/coreact/tasks/list_GET.schema";
import { isTaskOnDay } from "../helpers/cronogramaTaskUtils";
import { CronogramaQuickAdd } from "./CronogramaQuickAdd";
import styles from "./CronogramaCalendario.module.css";

interface ViewProps {
  level?: 0 | 1 | 2 | 3;
  tasks: TaskWithDetails[];
  projects: { id: string; name: string }[];
  onTaskClick: (taskId: string) => void;
  calendarMode?: "year" | "month" | "week";
  currentDate: Date;
  onDateChange?: (date: Date) => void;
  onModeChange?: (mode: "year" | "month" | "week") => void;
  onDayClick?: (date: Date) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<TaskWithDetails>) => void;
}

// Helper: Normalize date to midnight local time
const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Sunday = 0
const getStartOfWeek = (date: Date) => {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  return startOfDay(result);
};

const getStartOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const getMonthGrid = (date: Date) => {
  const firstDay = getStartOfMonth(date);
  const startGrid = getStartOfWeek(firstDay);
  const days = [];
  let current = startGrid;
  for (let i = 0; i < 42; i++) {
    days.push(current);
    current = addDays(current, 1);
  }
  return days;
};

const monthOnlyFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
});

const weekDayFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
});

const isMultiDay = (t: TaskWithDetails) => {
  if (!t.startDate || !t.endDate) return false;
  const s = startOfDay(new Date(t.startDate)).getTime();
  const e = startOfDay(new Date(t.endDate)).getTime();
  return e > s;
};

// Calculates slots for absolute positioned multi-spanning bars
function getSpanningTasks(tasksList: TaskWithDetails[], weekDays: Date[]) {
  const weekStart = startOfDay(weekDays[0]).getTime();
  const weekEnd = startOfDay(weekDays[6]).getTime() + 86400000 - 1;

  const activeTasks = tasksList.filter((t) => {
    if (!t.startDate && !t.endDate) return false;
    const s = t.startDate ? startOfDay(new Date(t.startDate)).getTime() : startOfDay(new Date(t.endDate!)).getTime();
    const e = t.endDate ? startOfDay(new Date(t.endDate)).getTime() : startOfDay(new Date(t.startDate!)).getTime();
    return s <= weekEnd && e >= weekStart;
  });

  const spanItems = activeTasks.map((t) => {
    const s = t.startDate ? startOfDay(new Date(t.startDate)).getTime() : startOfDay(new Date(t.endDate!)).getTime();
    const e = t.endDate ? startOfDay(new Date(t.endDate)).getTime() : startOfDay(new Date(t.startDate!)).getTime();
    
    let startIdx = weekDays.findIndex((d) => startOfDay(d).getTime() === s);
    let endIdx = weekDays.findIndex((d) => startOfDay(d).getTime() === e);
    
    if (startIdx === -1) startIdx = 0;
    if (endIdx === -1) endIdx = 6;
    
    return { task: t, startIdx, endIdx, s, e };
  });

  spanItems.sort((a, b) => {
    const aLen = a.endIdx - a.startIdx;
    const bLen = b.endIdx - b.startIdx;
    if (bLen !== aLen) return bLen - aLen;
    // Tie breaker: start date
    return a.startIdx - b.startIdx;
  });

  const slots: number[] = [];
  return spanItems.map((item) => {
    let slot = slots.findIndex((end) => end < item.startIdx);
    if (slot === -1) {
      slot = slots.length;
      slots.push(item.endIdx);
    } else {
      slots[slot] = item.endIdx;
    }
    return { ...item, slot };
  });
}

export const CronogramaCalendario = ({
  tasks,
  onTaskClick,
  calendarMode = "month",
  currentDate,
  onDateChange,
  onModeChange,
  onDayClick,
  onTaskUpdate,
}: ViewProps) => {

  const [draggingTask, setDraggingTask] = React.useState<{
    taskId: string;
    edge: "start" | "end";
    daysDelta: number;
  } | null>(null);

  const [quickAddCell, setQuickAddCell] = React.useState<{ date: Date, col: number } | null>(null);
  const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = (e: React.PointerEvent, task: TaskWithDetails, edge: "start" | "end") => {
    e.stopPropagation();
    e.preventDefault();

    const targetEl = e.currentTarget as HTMLElement;
    const gridEl = targetEl.closest(`.${styles.monthWeekTasksGrid}`) as HTMLElement;
    if (!gridEl) return;
    
    const dayWidth = gridEl.offsetWidth / 7;
    const startX = e.clientX;
    const originalStartDate = task.startDate ? new Date(task.startDate) : undefined;
    const originalEndDate = task.endDate ? new Date(task.endDate) : undefined;
    
    if (!originalStartDate || !originalEndDate) return;

    setDraggingTask({ taskId: task.id, edge, daysDelta: 0 });

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      // Provide snapping to days by dividing delta by day cell width
      const daysDelta = Math.round(deltaX / dayWidth);
      setDraggingTask({ taskId: task.id, edge, daysDelta });
      
      // Keep cursor styling globally consistent during drag
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      const deltaX = upEvent.clientX - startX;
      const daysDelta = Math.round(deltaX / dayWidth);
      
      setDraggingTask(null);
      
      if (daysDelta !== 0 && onTaskUpdate) {
        const newStartDate = new Date(originalStartDate);
        const newEndDate = new Date(originalEndDate);
        
        if (edge === "start") {
          newStartDate.setDate(newStartDate.getDate() + daysDelta);
          if (newStartDate > newEndDate) return; 
          onTaskUpdate(task.id, { startDate: newStartDate });
        } else {
          newEndDate.setDate(newEndDate.getDate() + daysDelta);
          if (newEndDate < newStartDate) return;
          onTaskUpdate(task.id, { endDate: newEndDate });
        }
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const gridDates = React.useMemo(() => {
    if (calendarMode === "month") {
      return getMonthGrid(currentDate);
    } else if (calendarMode === "week") {
      const startWeek = getStartOfWeek(currentDate);
      const days = [];
      let current = startWeek;
      for (let i = 0; i < 7; i++) {
        days.push(current);
        current = addDays(current, 1);
      }
      return days;
    }
    return [currentDate];
  }, [currentDate, calendarMode]);

  const weeks = React.useMemo(() => {
    if (calendarMode !== "month") return [];
    const result = [];
    for (let i = 0; i < gridDates.length; i += 7) {
      result.push(gridDates.slice(i, i + 7));
    }
    return result;
  }, [gridDates, calendarMode]);

  const monthTasks = useMemo(() => calendarMode === "month" ? tasks : [], [tasks, calendarMode]);

  const weekMultiTasks = useMemo(() => calendarMode === "week" ? tasks.filter((t) => isMultiDay(t)) : [], [tasks, calendarMode]);
  const weekMultiSpanning = useMemo(() => calendarMode === "week" && gridDates.length === 7 ? getSpanningTasks(weekMultiTasks, gridDates) : [], [weekMultiTasks, gridDates, calendarMode]);
  const weekSingleTasks = useMemo(() => calendarMode === "week" ? tasks.filter((t) => !isMultiDay(t)) : [], [tasks, calendarMode]);

  return (
    <div className={styles.container}>
      <div className={styles.viewContent}>
        {calendarMode === "year" && (
          <div className={styles.yearGrid}>
            {Array.from({ length: 12 }).map((_, mIdx) => {
              const monthStart = new Date(currentDate.getFullYear(), mIdx, 1);
              const grid = getMonthGrid(monthStart);
              
              return (
                <div 
                  key={mIdx} 
                  className={styles.yearMonthCard} 
                  onClick={() => { 
                    if (onDateChange) onDateChange(monthStart); 
                    if (onModeChange) onModeChange("month"); 
                  }}
                >
                  <div className={styles.yearMonthName}>{monthOnlyFormatter.format(monthStart)}</div>
                  <div className={styles.yearMiniGrid}>
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((wd, i) => (
                      <div key={i} className={styles.yearMiniHeader}>{wd}</div>
                    ))}
                    {grid.map((d, i) => {
                      const isOther = d.getMonth() !== mIdx;
                      const hasTasks = tasks.some(t => isTaskOnDay(t, d));
                      const isToday = isSameDay(d, new Date());
                      return (
                        <div 
                          key={i} 
                          className={`${styles.yearMiniDay} ${isOther ? styles.otherMonth : ""} ${isToday ? styles.today : ""} ${hasTasks && !isOther ? styles.hasTasks : ""}`}
                          onClick={(e) => { 
                            if (!isOther && onDayClick) {
                                e.stopPropagation();
                                onDayClick(d); 
                            }
                          }}
                          style={{ cursor: !isOther && onDayClick ? "pointer" : "default" }}
                        >
                          {!isOther && d.getDate()}
                        </div>
                      )
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {calendarMode === "month" && (
          <div className={styles.monthContainer}>
            <div className={styles.monthHeaderGrid}>
              {gridDates.slice(0, 7).map((d, i) => (
                <div key={`header-${i}`} className={styles.weekdayHeader}>
                  {weekDayFormatter.format(d)}
                </div>
              ))}
            </div>
            <div className={styles.monthBody}>
              {weeks.map((week, wIdx) => {
                const spanning = getSpanningTasks(monthTasks, week);
                const visibleSpanning: ReturnType<typeof getSpanningTasks> = [];
                const hiddenTasksInSlot: TaskWithDetails[][] = Array.from({ length: 7 }, () => []);
                
                spanning.forEach(item => {
                  if (item.slot < 4) {
                    visibleSpanning.push(item);
                  } else {
                    for (let i = item.startIdx; i <= item.endIdx; i++) {
                      hiddenTasksInSlot[i].push(item.task);
                    }
                  }
                });

                return (
                  <div key={wIdx} className={styles.monthWeekRow}>
                    <div className={styles.monthWeekDaysBg}>
                      {week.map((d, i) => {
                        const isToday = isSameDay(d, new Date());
                        const isOtherMonth = d.getMonth() !== currentDate.getMonth();
                        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                        
                        return (
                          <div
                            key={i}
                            className={`${styles.dayCellBg} ${isOtherMonth ? styles.otherMonth : ""} ${isToday ? styles.today : ""} ${isWeekend ? styles.weekend : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (e.detail === 2) {
                                if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
                                setQuickAddCell({ date: d, col: i + 1 });
                              } else if (e.detail === 1) {
                                clickTimeoutRef.current = setTimeout(() => {
                                  onDayClick?.(d);
                                }, 250);
                              }
                            }}
                            style={{ cursor: onDayClick ? "pointer" : "default", position: "relative" }}
                          >
                            <div className={styles.dayCellHeader}>{d.getDate()}</div>
                            {hiddenTasksInSlot[i].length > 0 && (() => {
                              const hiddenList = hiddenTasksInSlot[i];
                              const statuses = Array.from(new Set(hiddenList.map(t => t.status || "open")));
                              return (
                                <div 
                                  className={styles.moreTasksLabel}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDayClick?.(d);
                                  }}
                                >
                                  <span>+{hiddenList.length} mais</span>
                                  <div className={styles.moreTasksDots}>
                                    {statuses.map(s => (
                                      <div key={s} className={styles.moreTaskDot} data-status={s} />
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        );
                      })}
                    </div>
                    <div className={styles.monthWeekTasksGrid}>
                      {quickAddCell && quickAddCell.date >= week[0] && quickAddCell.date <= week[6] && (
                        <div style={{ gridColumn: quickAddCell.col, gridRow: 1, zIndex: 100 }}>
                           <CronogramaQuickAdd date={quickAddCell.date} onClose={() => setQuickAddCell(null)} />
                        </div>
                      )}
                      {visibleSpanning.map((item) => {
                        let visualStartIdx = item.startIdx;
                        let visualEndIdx = item.endIdx;
                        
                        if (draggingTask && draggingTask.taskId === item.task.id) {
                          if (draggingTask.edge === "start") {
                            visualStartIdx += draggingTask.daysDelta;
                            if (visualStartIdx > visualEndIdx) visualStartIdx = visualEndIdx;
                            if (visualStartIdx < 0) visualStartIdx = 0;
                          } else {
                            visualEndIdx += draggingTask.daysDelta;
                            if (visualEndIdx < visualStartIdx) visualEndIdx = visualStartIdx;
                            if (visualEndIdx > 6) visualEndIdx = 6;
                          }
                        }

                        return (
                          <div
                            key={item.task.id}
                            className={styles.monthTask}
                            data-status={item.task.status || "open"}
                            style={{
                              gridColumn: `${visualStartIdx + 1} / ${visualEndIdx + 2}`,
                              gridRow: item.slot + 1,
                              opacity: draggingTask?.taskId === item.task.id ? 0.7 : 1,
                              zIndex: draggingTask?.taskId === item.task.id ? 10 : 1,
                            }}
                            onClick={(e) => { e.stopPropagation(); onTaskClick(item.task.id); }}
                            title={item.task.name}
                          >
                            <div 
                              className={styles.resizeHandleLeft}
                              onPointerDown={(e) => handlePointerDown(e, item.task, "start")}
                            />
                            
                            {item.task.priority === "critical" && <div className={styles.criticalDot} />}
                            {item.task.assigneeInitials && (
                              <div className={styles.assigneeAvatar}>{item.task.assigneeInitials}</div>
                            )}
                            <span className={styles.monthTaskName}>{item.task.name}</span>

                            <div 
                              className={styles.resizeHandleRight}
                              onPointerDown={(e) => handlePointerDown(e, item.task, "end")}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {calendarMode === "week" && (
          <div className={styles.weekContainer}>
            <div className={styles.weekGridHeader}>
              {gridDates.map((d, i) => (
                <div key={i} className={`${styles.weekDayHeader} ${isSameDay(d, new Date()) ? styles.today : ""}`} onClick={() => onDayClick?.(d)} style={{ cursor: onDayClick ? "pointer" : "default" }}>
                  <div className={styles.dayName}>{weekDayFormatter.format(d)}</div>
                  <div className={styles.dayNum}>{d.getDate()}</div>
                </div>
              ))}
            </div>
            
            {weekMultiSpanning.length > 0 && (
              <div className={styles.weekMultiDayGrid}>
                <div className={styles.weekMultiDayBg}>
                  {gridDates.map((_, i) => <div key={i} className={styles.multiDayCol} />)}
                </div>
                <div className={styles.weekMultiDayTasks}>
                  {weekMultiSpanning.map((item) => (
                    <div
                      key={item.task.id}
                      className={styles.weekMultiBar}
                      data-priority={item.task.priority}
                      style={{
                        gridColumn: `${item.startIdx + 1} / ${item.endIdx + 2}`,
                        gridRow: item.slot + 1,
                      }}
                      onClick={() => onTaskClick(item.task.id)}
                      title={item.task.name}
                    >
                      {item.task.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.weekDaysGrid}>
              {gridDates.map((d, i) => {
                const dayTasks = weekSingleTasks.filter(t => isTaskOnDay(t, d));
                return (
                  <div key={i} className={styles.weekDayColumn} onClick={() => onDayClick?.(d)} style={{ cursor: onDayClick ? "pointer" : "default" }}>
                    {dayTasks.map(t => (
                      <div key={t.id} className={styles.weekSingleTask} onClick={(e) => { e.stopPropagation(); onTaskClick(t.id); }}>
                        <div className={styles.weekSingleTaskHeader}>
                          <div className={styles.priorityDot} data-priority={t.priority} />
                          <span className={styles.weekSingleTaskName}>{t.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};