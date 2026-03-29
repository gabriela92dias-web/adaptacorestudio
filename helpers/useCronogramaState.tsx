import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export type ViewMode = "gantt" | "kanban" | "list" | "process";
export type GanttZoom = "ano" | "semestre" | "trimestre" | "mes" | "quinzena1" | "quinzena2" | "semana" | "dia";
export type CalendarMode = "year" | "month" | "week";

export interface CronogramaFilters {
  projectId: string;
  assigneeId: string;
  statuses: string[];
  priorities: string[];
}

export function useCronogramaState() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse from URL, fallback to defaults
  const viewMode = (searchParams.get("viewMode") as ViewMode) || "gantt";
  const ganttZoom = (searchParams.get("ganttZoom") as GanttZoom) || "ano";

  const setViewMode = (newMode: ViewMode) => {
    setSearchParams(prev => {
      prev.set("viewMode", newMode);
      return prev;
    });
  };

  const setGanttZoom = (newZoom: GanttZoom) => {
    setSearchParams(prev => {
      prev.set("ganttZoom", newZoom);
      return prev;
    });
  };

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("month");
  
  const [filters, setFilters] = useState<CronogramaFilters>({
    projectId: "all",
    assigneeId: "all",
    statuses: [],
    priorities: []
  });

  const goToDay = useCallback((date: Date) => {
    setCurrentDate(date);
    setSearchParams(prev => {
      prev.set("viewMode", "gantt");
      prev.set("ganttZoom", "dia");
      return prev;
    });
  }, [setSearchParams]);

  const setToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const shiftDate = useCallback((dir: 1 | -1) => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === "gantt") {
        if (ganttZoom === "ano") d.setFullYear(d.getFullYear() + dir);
        else if (ganttZoom === "semestre") d.setMonth(d.getMonth() + dir * 6);
        else if (ganttZoom === "trimestre") d.setMonth(d.getMonth() + dir * 3);
        else if (ganttZoom === "mes") d.setMonth(d.getMonth() + dir);
        else if (ganttZoom === "semana") d.setDate(d.getDate() + dir * 7);
        else if (ganttZoom === "dia") d.setDate(d.getDate() + dir);
        else if (ganttZoom === "quinzena1") {
          if (dir === 1) {
            d.setDate(16);
            setGanttZoom("quinzena2");
          } else {
            d.setMonth(d.getMonth() - 1);
            d.setDate(16);
            setGanttZoom("quinzena2");
          }
        } else if (ganttZoom === "quinzena2") {
          if (dir === -1) {
            d.setDate(1);
            setGanttZoom("quinzena1");
          } else {
            d.setMonth(d.getMonth() + 1);
            d.setDate(1);
            setGanttZoom("quinzena1");
          }
        }
      }
      return d;
    });
  }, [viewMode, calendarMode, ganttZoom]);

  const clearFilters = useCallback(() => {
    setFilters({ projectId: "all", assigneeId: "all", statuses: [], priorities: [] });
  }, []);

  const activeFilterCount = useMemo(() => {
    return (filters.projectId !== "all" ? 1 : 0) + 
           (filters.assigneeId !== "all" ? 1 : 0) + 
           filters.statuses.length + 
           filters.priorities.length;
  }, [filters]);

  const toolbarTitle = useMemo(() => {
    if (viewMode === "gantt") {
      let startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0);

      if (ganttZoom === "dia") {
        return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" }).format(currentDate);
      } else if (ganttZoom === "semana") {
        const start = new Date(currentDate);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        const formatObj = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" });
        
        const weekOfMonth = Math.ceil(start.getDate() / 7);
        const ordinal = ["PRIMEIRA", "SEGUNDA", "TERCEIRA", "QUARTA", "QUINTA"][weekOfMonth - 1] || `${weekOfMonth}ª`;
        const monthName = start.toLocaleString("pt-BR", { month: "long" }).toUpperCase();
        
        return `Semana de ${formatObj.format(start)} a ${formatObj.format(end)} - ${ordinal} SEMANA DE ${monthName}`;
      } else if (ganttZoom === "ano") {
        return startDate.getFullYear().toString();
      } else if (ganttZoom === "semestre") {
        const sem = startDate.getMonth() < 6 ? 1 : 2;
        return `${sem}º Semestre ${startDate.getFullYear()}`;
      } else if (ganttZoom === "trimestre") {
        const tri = Math.floor(startDate.getMonth() / 3) + 1;
        return `${tri}º Tri ${startDate.getFullYear()}`;
      } else if (ganttZoom === "mes") {
        const m = startDate.toLocaleString("pt-BR", { month: "long" });
        return `${m.charAt(0).toUpperCase() + m.slice(1)} ${startDate.getFullYear()}`;
      } else if (ganttZoom === "quinzena1") {
        const m = startDate.toLocaleString("pt-BR", { month: "long" });
        return `1ª Quinz. — ${m.charAt(0).toUpperCase() + m.slice(1)} ${startDate.getFullYear()}`;
      } else if (ganttZoom === "quinzena2") {
        const m = startDate.toLocaleString("pt-BR", { month: "long" });
        return `2ª Quinz. — ${m.charAt(0).toUpperCase() + m.slice(1)} ${startDate.getFullYear()}`;
      }
    }
    
    return "";
  }, [viewMode, currentDate, calendarMode, ganttZoom]);

  const toolbarTitleShort = useMemo(() => {
    if (viewMode === "gantt" && ganttZoom === "semana") {
      const start = new Date(currentDate);
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      const formatObj = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" });
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      
      const weekOfMonth = Math.ceil(start.getDate() / 7);
      const weeksInMonth = Math.ceil(new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate() / 7);
      
      return `${formatObj.format(start)} a ${formatObj.format(end)} (${weekOfMonth}/${weeksInMonth})`;
    }
    return toolbarTitle;
  }, [viewMode, currentDate, ganttZoom, toolbarTitle]);

  return {
    viewMode,
    currentDate,
    setCurrentDate,
    ganttZoom,
    calendarMode,
    filters,
    goToDay,
    shiftDate,
    setToday,
    setViewMode,
    setGanttZoom,
    setCalendarMode,
    setFilters,
    clearFilters,
    activeFilterCount,
    toolbarTitle,
    toolbarTitleShort
  };
}