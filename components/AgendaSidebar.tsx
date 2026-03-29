
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useAgendaTasks } from "../helpers/useAgenda";
import { useCallbackRef } from "../helpers/useCallbackRef";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";
import { CreateTaskModal } from "./CoreActQuickActions";
import styles from "./AgendaSidebar.module.css";

// Utility logic to generate 42-day calendar grids avoiding date-fns as requested
function getDaysInMonthCalendar(year: number, monthIndex: number): Date[] {
  const firstDay = new Date(year, monthIndex, 1);
  const startingDayOfWeek = firstDay.getDay();
  let currentDay = new Date(year, monthIndex, 1 - startingDayOfWeek);
  const days: Date[] = [];

  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }
  return days;
}

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

function isTaskOnDay(task: any, day: Date) {
  if (!task.startDate && !task.endDate) return false;
  const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);

  if (task.startDate && task.endDate) {
    return task.startDate <= dayEnd && task.endDate >= dayStart;
  }
  if (task.startDate) {
    return task.startDate >= dayStart && task.startDate <= dayEnd;
  }
  if (task.endDate) {
    return task.endDate >= dayStart && task.endDate <= dayEnd;
  }
  return false;
}

const MAX_VISIBLE_TASKS = 4;

export const AgendaSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Fetch data
  const { data, isLoading } = useAgendaTasks(
    currentMonth.getMonth() + 1,
    currentMonth.getFullYear()
  );

  const tasks = data?.tasks || [];

  // Click outside detection
  const handleClickOutside = useCallbackRef((event: MouseEvent) => {
    const path = event.composedPath();
    const isPortalClick = path.some((node) => {
      if (node instanceof Element) {
        return node.matches("[data-radix-popper-content-wrapper], [data-radix-menu-content], [data-radix-dropdown-menu-content], [role='menu'], [role='dialog'], [role='tooltip']");
      }
      return false;
    });

    if (isPortalClick) return;

    if (sidebarRef.current && !path.includes(sidebarRef.current)) {
      setIsExpanded(false);
    }
  });

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded, handleClickOutside]);

  // Calendar setup
  const calendarDays = useMemo(
    () => getDaysInMonthCalendar(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth]
  );

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  // Formatters
  const monthYearFormatter = useMemo(
    () => new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }),
    []
  );

  const timeFormatter = useMemo(
    () => new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    []
  );

  const monthYearStr = monthYearFormatter.format(currentMonth);
  const capitalizedMonthYear = monthYearStr.charAt(0).toUpperCase() + monthYearStr.slice(1);

  // Filter tasks for selected day
  const tasksOnSelectedDay = useMemo(() => {
    return tasks.filter((t) => isTaskOnDay(t, selectedDate));
  }, [tasks, selectedDate]);

  const visibleTasks = tasksOnSelectedDay.slice(0, MAX_VISIBLE_TASKS);
  const hiddenTaskCount = tasksOnSelectedDay.length - MAX_VISIBLE_TASKS;

  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  if (!isExpanded) {
    return (
      <div className={styles.collapsedSidebar} onClick={() => setIsExpanded(true)}>
        <Button variant="ghost" size="icon-md" className={styles.collapsedIcon}>
          <CalendarIcon size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div ref={sidebarRef} className={styles.expandedSidebar}>
      <div className={styles.calendarHeader}>
        <span className={styles.monthTitle}>{capitalizedMonthYear}</span>
        <div className={styles.navButtons}>
          <Button variant="ghost" size="icon-sm" onClick={handlePrevMonth}>
            <ChevronLeft size={16} />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={handleNextMonth}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div className={styles.calendarBody}>
        <div className={styles.weekRow}>
          {weekDays.map((wd, i) => (
            <div key={i} className={styles.weekDayLabel}>
              {wd}
            </div>
          ))}
        </div>
        <div className={styles.daysGrid}>
          {calendarDays.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const hasTask = tasks.some((t) => isTaskOnDay(t, day));

            return (
              <div
                key={i}
                className={`
                  ${styles.dayCell} 
                  ${isSelected ? styles.selected : ""} 
                  ${isToday ? styles.today : ""}
                  ${!isCurrentMonth ? styles.otherMonth : ""}
                `}
                onClick={() => handleDayClick(day)}
              >
                <span className={styles.dayNumber}>{day.getDate()}</span>
                {hasTask && !isLoading && <div className={styles.taskDotIndicator} />}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.selectedDaySection}>
        <h4 className={styles.selectedDayTitle}>
          {isSameDay(selectedDate, new Date())
            ? "Hoje"
            : new Intl.DateTimeFormat("pt-BR", {
              day: "numeric",
              month: "short",
            }).format(selectedDate)}
        </h4>

        <div className={styles.tasksList}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <Skeleton style={{ height: "40px", width: "100%" }} />
              <Skeleton style={{ height: "40px", width: "100%" }} />
            </div>
          ) : tasksOnSelectedDay.length === 0 ? (
            <div className={styles.emptyState} style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              <span>Agenda Livre</span>
              <Button variant="outline" size="sm" onClick={() => setIsCreateTaskOpen(true)}>
                Nova Tarefa
              </Button>
            </div>
          ) : (
            <>
              {visibleTasks.map((task) => (
                <div
                  key={task.id}
                  className={styles.taskItem}
                  data-priority={task.priority}
                >
                  <div className={styles.taskItemContent}>
                    <span className={styles.taskName}>{task.name}</span>
                    <span className={styles.taskTime}>
                      {task.startDate ? timeFormatter.format(new Date(task.startDate)) : task.endDate ? timeFormatter.format(new Date(task.endDate)) : "Sem hora"}
                      {task.projectName && ` • ${task.projectName}`}
                    </span>
                  </div>
                </div>
              ))}
              {hiddenTaskCount > 0 && (
                <div className={styles.moreTasksIndicator}>
                  +{hiddenTaskCount} mais
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <CreateTaskModal open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen} defaultDate={selectedDate} />
    </div>
  );
};