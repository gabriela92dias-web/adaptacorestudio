import React, { useState, useMemo, useEffect, useRef } from "react";
import { useUpdateTask } from "../helpers/useCoreActApi";
import { toast } from "sonner";
import { TaskWithDetails } from "../endpoints/coreact/tasks/list_GET.schema";
import { TaskDependencyWithDetails } from "../endpoints/coreact/dependencies/list_GET.schema";
import { CronogramaGanttSidebar } from "./CronogramaGanttSidebar";
import { useResponsiveColumns, SOVEREIGN_MIN_COL_WIDTH } from "../helpers/useResponsiveColumns";
import {
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  ChevronsUpDown,
  ChevronsDownUp,
  Lock,
  Circle,
  Play,
  CheckCircle2,
} from "lucide-react";
import styles from "./CronogramaGantt.module.css";

export type GanttViewMode = "ano" | "semestre" | "trimestre" | "mes" | "quinzena1" | "quinzena2" | "semana" | "dia";

export type ComputedTaskState = "completed" | "in_progress" | "blocked" | "ready";

export interface CronogramaGanttProps {
  tasks: TaskWithDetails[];
  projects: { id: string; name: string; initiativeId?: string | null }[];
  dependencies?: TaskDependencyWithDetails[];
  initiatives?: { id: string; name: string; sectorId?: string | null; sectorName?: string | null }[];
  sectors?: { id: string; name: string }[];
  teamMembers?: { id: string; name: string }[];
  onTaskClick: (taskId: string) => void;
  level?: 0 | 1 | 2 | 3;
  ganttZoom: GanttViewMode;
  currentDate: Date;
  businessDaysOnly?: boolean;
  onNavigate?: (dir: 1 | -1) => void;
  onDayClick?: (date: Date) => void;
}

interface TreeNode {
  id: string;
  label: string;
  type: "sector" | "initiative" | "project" | "stage" | "task";
  children: Map<string, TreeNode>;
  tasks: any[];
  minStart: number;
  maxEnd: number;
  taskData?: TaskWithDetails;
  childrenArray?: TreeNode[];
  depth?: number;
}

export function CronogramaGantt({
  tasks,
  projects,
  dependencies,
  initiatives = [],
  sectors = [],
  onTaskClick,
  level = 0,
  ganttZoom,
  currentDate,
  businessDaysOnly = false,
  onNavigate,
  onDayClick,
}: CronogramaGanttProps) {
  const updateTask = useUpdateTask();
  const updateTaskRef = useRef(updateTask);
  updateTaskRef.current = updateTask;

    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [hasAutoCollapsed, setHasAutoCollapsed] = useState(false);

  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);

  const { ref: timelineWrapperRef, containerWidth: rawContainerWidth } = useResponsiveColumns({ idealCount: 1 });
  // Round to nearest 8px to reduce recalculations and micro-oscillations
  const containerWidth = useMemo(() => Math.round(rawContainerWidth / 8) * 8, [rawContainerWidth]);

  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    taskId: string;
    action: "move" | "resize-left" | "resize-right";
    initialX: number;
    currentX: number;
    initialLeft: number;
    initialWidth: number;
  } | null>(null);

  const timelineContentRef = useRef<HTMLDivElement>(null);
  const panStart = useRef({ x: 0, y: 0 });
  const dragHasMovedRef = useRef(false);

    // timelineContentRef used for drag calculations only
  const latestGanttDataRef = useRef<any>(null);
  const latestZoomRef = useRef(ganttZoom);

  const handleTaskMouseDown = (e: React.MouseEvent, taskId: string, left: number, width: number) => {
        if (e.button !== undefined && e.button !== 0) return; // Only process left click if it's a mouse event

    e.stopPropagation();
    if (e.cancelable) e.preventDefault();

    document.body.style.userSelect = "none"; // CRITICAL: Prevent all text selection during task dragging

    dragHasMovedRef.current = false;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = ('touches' in e) ? (e as any).touches[0].clientX : (e as React.MouseEvent).clientX;
    const x = clientX - rect.left;

    let action: "move" | "resize-left" | "resize-right" = "move";
    const gripThreshold = Math.min(8, rect.width * 0.25);
    
    if (x < gripThreshold) action = "resize-left";
    else if (x > rect.width - gripThreshold) action = "resize-right";

    dragRef.current = {
      taskId,
      action,
      initialX: clientX,
      currentX: clientX,
      initialLeft: left,
      initialWidth: width,
    };
    setIsDragging(true);
  };

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };



  // Build Gantt Data
  const ganttData = useMemo(() => {
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
    const realTotalDuration = maxT - minT;

    const isDailyZoom = ["mes", "quinzena1", "quinzena2", "semana", "dia"].includes(ganttZoom);
    const applyBusinessDays = businessDaysOnly && isDailyZoom;

    let baseGranularity = "day";

    if (ganttZoom === "ano" || ganttZoom === "semestre") {
      baseGranularity = "month";
    } else if (ganttZoom === "trimestre") {
      if (level === 0) baseGranularity = "week";
      else if (level <= 2) baseGranularity = "month";
      else baseGranularity = "quarter";
    } else if (ganttZoom === "mes") {
      if (level === 0) baseGranularity = "day";
      else if (level <= 2) baseGranularity = "week";
      else baseGranularity = "biweek";
    } else if (ganttZoom === "quinzena1" || ganttZoom === "quinzena2") {
      baseGranularity = level <= 1 ? "day" : "week";
    } else if (ganttZoom === "semana") {
      baseGranularity = "day";
    } else if (ganttZoom === "dia") {
      baseGranularity = "hour";
    }

    const validDays: Date[] = [];
    let dCur = new Date(startDate);
    while (dCur <= endDate) {
      const dayOfWeek = dCur.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      if (!applyBusinessDays || !isWeekend) {
        validDays.push(new Date(dCur));
      }
      dCur.setDate(dCur.getDate() + 1);
    }

    const totalLogicalDuration = applyBusinessDays ? validDays.length * 86400000 : realTotalDuration;

    const dateToPercent = (t: number) => {
      if (!applyBusinessDays) {
        return ((t - minT) / realTotalDuration) * 100;
      }
      let d = new Date(t);
      d.setHours(0, 0, 0, 0);
      const timeInDay = t - d.getTime();
      let idx = validDays.findIndex((vd) => vd.getTime() === d.getTime());

      if (idx === -1) {
        let lastBefore = -1;
        for (let i = 0; i < validDays.length; i++) {
          if (validDays[i].getTime() < t) lastBefore = i;
        }
        if (lastBefore === -1) {
          idx = 0;
          return ((idx * 86400000) / totalLogicalDuration) * 100;
        }
        return ((lastBefore * 86400000 + 86399999) / totalLogicalDuration) * 100;
      }
      return ((idx * 86400000 + timeInDay) / totalLogicalDuration) * 100;
    };

    const percentToDate = (p: number) => {
      if (!applyBusinessDays) {
        return minT + (p / 100) * realTotalDuration;
      }
      const logicalMs = (p / 100) * totalLogicalDuration;
      let dayIndex = Math.floor(logicalMs / 86400000);
      const msInDay = logicalMs % 86400000;
      if (dayIndex < 0) dayIndex = 0;
      if (dayIndex >= validDays.length) dayIndex = validDays.length - 1;
      return validDays[dayIndex].getTime() + msInDay;
    };

    type ColumnDef = { 
      label: string; 
      fullLabel: string; 
      width: number; 
      isWeekend?: boolean; 
      date?: Date;
      granType: string;
      isMonth?: boolean;
      monthNumber?: number;
      monthName?: string;
      year?: number;
    };

    const generateColumns = (gran: string): ColumnDef[] => {
      const cols: ColumnDef[] = [];
      if (gran === "quarter") {
        let cur = new Date(startDate);
        while (cur <= endDate) {
          const q = Math.floor(cur.getMonth() / 3);
          const qStart = new Date(cur.getFullYear(), q * 3, 1);
          let qEnd = new Date(cur.getFullYear(), q * 3 + 3, 0);
          if (qEnd > endDate) qEnd = new Date(endDate);
          
          const startPct = dateToPercent(Math.max(qStart.getTime(), minT));
          const endPct = dateToPercent(Math.min(qEnd.getTime() + 86399999, maxT));
          
          if (endPct > startPct) {
            cols.push({
              label: `T${q + 1}`,
              fullLabel: `${q + 1}º Trimestre de ${cur.getFullYear()}`,
              width: endPct - startPct,
              granType: gran,
            });
          }
          cur = new Date(cur.getFullYear(), q * 3 + 3, 1);
        }
      } else if (gran === "month") {
        let cur = new Date(startDate);
        while (cur <= endDate) {
          const mStart = new Date(cur.getFullYear(), cur.getMonth(), 1);
          let mEnd = new Date(cur.getFullYear(), cur.getMonth() + 1, 0);
          if (mEnd > endDate) mEnd = new Date(endDate);
          
          const startPct = dateToPercent(Math.max(mStart.getTime(), minT));
          const endPct = dateToPercent(Math.min(mEnd.getTime() + 86399999, maxT));
          
          const monthName = cur.toLocaleString("pt-BR", { month: "long" });
          const shortName = cur.toLocaleString("pt-BR", { month: "short" }).replace(".", "").toUpperCase();
          
          if (endPct > startPct) {
            cols.push({
              label: shortName,
              fullLabel: `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} de ${cur.getFullYear()}`,
              width: endPct - startPct,
              granType: gran,
              isMonth: true,
              monthNumber: cur.getMonth() + 1,
              monthName: monthName,
              year: cur.getFullYear(),
            });
          }
          cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
        }
      } else if (gran === "biweek") {
        let cur = new Date(startDate);
        while (cur <= endDate) {
          const y = cur.getFullYear();
          const m = cur.getMonth();
          const q1Start = new Date(y, m, 1);
          const q1End = new Date(y, m, 15);
          const q2Start = new Date(y, m, 16);
          const q2End = new Date(y, m + 1, 0);

          if (q1Start <= endDate && q1End >= startDate) {
            const sPct = dateToPercent(Math.max(q1Start.getTime(), minT));
            const ePct = dateToPercent(Math.min(q1End.getTime() + 86399999, maxT));
            if (ePct > sPct) {
              cols.push({
                label: "1ª Quinz.",
                fullLabel: `1ª Quinzena, ${cur.toLocaleString("pt-BR", { month: "short" })} ${y}`,
                width: ePct - sPct,
                granType: gran,
              });
            }
          }
          if (q2Start <= endDate && q2End >= startDate) {
            const sPct = dateToPercent(Math.max(q2Start.getTime(), minT));
            const ePct = dateToPercent(Math.min(q2End.getTime() + 86399999, maxT));
            if (ePct > sPct) {
              cols.push({
                label: "2ª Quinz.",
                fullLabel: `2ª Quinzena, ${cur.toLocaleString("pt-BR", { month: "short" })} ${y}`,
                width: ePct - sPct,
                granType: gran,
              });
            }
          }
          cur = new Date(y, m + 1, 1);
        }
      } else if (gran === "week") {
        let cur = new Date(startDate);
        while (cur < endDate) {
          let nextW = new Date(cur.getTime() + 7 * 86400000);
          if (nextW > endDate) nextW = new Date(endDate.getTime() + 1);
          
          const startPct = dateToPercent(cur.getTime());
          const endPct = dateToPercent(nextW.getTime() - 1);
          
          if (endPct > startPct) {
            const endCur = new Date(nextW.getTime() - 1);
            const getWeekOfMonth = (d: Date) => Math.ceil(d.getDate() / 7);
            const getWeeksInMonth = (d: Date) => Math.ceil(new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() / 7);
            
            const weekOfMonth = getWeekOfMonth(cur);
            const weeksInMonth = getWeeksInMonth(cur);
            
            const sDate = `${cur.getDate().toString().padStart(2, '0')}/${(cur.getMonth() + 1).toString().padStart(2, '0')}`;
            const eDate = `${endCur.getDate().toString().padStart(2, '0')}/${(endCur.getMonth() + 1).toString().padStart(2, '0')}`;
            const monthName = cur.toLocaleString("pt-BR", { month: "long" }).toUpperCase();
            const ordinal = ["PRIMEIRA", "SEGUNDA", "TERCEIRA", "QUARTA", "QUINTA"][weekOfMonth - 1] || `${weekOfMonth}ª`;
            
            const verboseLabel = `Semana de ${sDate} a ${eDate} - ${ordinal} SEMANA DE ${monthName}`;
            
            // c.fullLabel will store the long label, c.label stores the super short one, c.monthName stores intermediate (Semana de XX a YY)
            cols.push({
              label: `(${weekOfMonth}/${weeksInMonth})`,
              fullLabel: verboseLabel,
              monthName: `Semana de ${sDate} a ${eDate}`,
              width: endPct - startPct,
              granType: gran,
            });
          }
          cur = nextW;
        }
      } else if (gran === "day") {
        let cur = new Date(startDate);
        while (cur <= endDate) {
          const dayOfWeek = cur.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          if (!applyBusinessDays || !isWeekend) {
            const startPct = dateToPercent(cur.getTime());
            const endPct = dateToPercent(cur.getTime() + 86399999);
            if (endPct > startPct) {
              cols.push({
                label: cur.getDate().toString(),
                fullLabel: cur.toLocaleDateString("pt-BR", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                }),
                width: endPct - startPct,
                granType: gran,
                isWeekend,
                date: new Date(cur),
              });
            }
          }
          cur.setDate(cur.getDate() + 1);
        }
      } else if (gran === "hour") {
        let cur = new Date(startDate);
        cur.setHours(0, 0, 0, 0);
        const endDay = new Date(cur);
        endDay.setHours(23, 59, 59, 999);
        while (cur <= endDay) {
          const startPct = dateToPercent(cur.getTime());
          const endPct = dateToPercent(cur.getTime() + 3599999);
          if (endPct > startPct) {
            cols.push({
              label: `${cur.getHours().toString().padStart(2, '0')}:00`,
              fullLabel: `${cur.getHours().toString().padStart(2, '0')}:00 às ${cur.getHours() + 1}:00`,
              width: endPct - startPct,
              granType: gran,
            });
          }
          cur.setTime(cur.getTime() + 3600000);
        }
      }
      return cols;
    };

    const escalateMap: Record<string, string> = {
      hour: "day",
      day: "week",
      week: "biweek",
      biweek: "month",
      month: "month",
      quarter: "quarter",
    };

    const GRANULARITY_MIN_PX: Record<string, number> = {
      hour: 45,
      day: 11,
      week: 24,
      biweek: 30,
      month: 15,
      quarter: 36,
    };

    let effectiveGranularity = baseGranularity;
    let columns = generateColumns(effectiveGranularity);

    if (containerWidth > 0) {
      while (
        columns.length > 0 &&
        effectiveGranularity !== "quarter"
      ) {
        const threshold = GRANULARITY_MIN_PX[effectiveGranularity] || 28;

        if ((containerWidth / columns.length) < threshold) {
          effectiveGranularity = escalateMap[effectiveGranularity];
          columns = generateColumns(effectiveGranularity);
        } else {
          break;
        }
      }
    }

    const taskStatusMap = new Map<string, ComputedTaskState>();
    tasks.forEach((t) => {
      if (t.progress === 100 || t.status === "completed") {
        taskStatusMap.set(t.id, "completed");
      } else if ((t.progress && t.progress > 0) || t.status === "in_progress") {
        taskStatusMap.set(t.id, "in_progress");
      } else {
        taskStatusMap.set(t.id, "ready");
      }
    });

    if (dependencies) {
      dependencies.forEach((dep) => {
        const targetStatus = taskStatusMap.get(dep.taskId);
        if (targetStatus === "completed") return;
        const sourceTask = tasks.find((t) => t.id === dep.dependsOnTaskId);
        const sourceComputedStatus = taskStatusMap.get(dep.dependsOnTaskId);

        if (dep.dependencyType === "finish_to_start" && sourceComputedStatus !== "completed") {
          taskStatusMap.set(dep.taskId, "blocked");
        } else if (dep.dependencyType === "start_to_start" && (sourceTask?.status === "open" || !sourceTask?.status)) {
          taskStatusMap.set(dep.taskId, "blocked");
        }
      });
    }

    const validTasks = tasks.filter((t) => t.startDate && t.endDate);

    const tree: TreeNode = {
      id: "root",
      label: "root",
      type: "sector",
      children: new Map(),
      tasks: [],
      minStart: Infinity,
      maxEnd: -Infinity,
    };
    const getOrCreate = (map: Map<string, TreeNode>, id: string, label: string, type: TreeNode["type"]) => {
      if (!map.has(id)) map.set(id, { id, label, type, children: new Map(), tasks: [], minStart: Infinity, maxEnd: -Infinity });
      return map.get(id)!;
    };

    // Pre-populate all initiatives so empty ones show up
    initiatives.forEach((init) => {
      const sectId = init.sectorId || "unassigned";
      const sect = sectors.find((s) => s.id === sectId);
      const sectName = (sect?.name || "Sem setor").toUpperCase();
      const secIdStr = `sec_${sectId}`;
      const iId = `${secIdStr}_i_${init.id}`;
      const node1 = getOrCreate(tree.children, secIdStr, sectName, "sector");
      getOrCreate(node1.children, iId, init.name.toUpperCase(), "initiative");
    });

    // Pre-populate all projects so empty ones show up
    projects.forEach((p) => {
      const initId = p.initiativeId || "unassigned";
      const init = initiatives.find((i) => i.id === initId);
      const initName = (init?.name || "Sem iniciativa").toUpperCase();
      const sectId = init?.sectorId || "unassigned";
      const sect = sectors.find((s) => s.id === sectId);
      const sectName = (sect?.name || "Sem setor").toUpperCase();
      const secIdStr = `sec_${sectId}`;
      const iId = `${secIdStr}_i_${initId}`;
      const pId = `${iId}_p_${p.id}`;

      const node1 = getOrCreate(tree.children, secIdStr, sectName, "sector");
      const node2 = getOrCreate(node1.children, iId, initName, "initiative");
      getOrCreate(node2.children, pId, p.name, "project");
    });

    validTasks.forEach((t) => {
      const p = projects.find((x) => x.id === t.projectId);

      const initId = p?.initiativeId || "unassigned";
      const init = initiatives.find((i) => i.id === initId);
      const initName = (init?.name || "Sem iniciativa").toUpperCase();

      const sectId = init?.sectorId || "unassigned";
      const sect = sectors.find((s) => s.id === sectId);
      const sectName = (init?.sectorName || sect?.name || "Sem setor").toUpperCase();

      const projId = t.projectId;
      const projName = t.projectName || p?.name || "Sem projeto";

      const stageId = t.stageId || "unassigned";
      const stageName = t.stageName || "Sem etapa";

      const secIdStr = `sec_${sectId}`;
      const iId = `${secIdStr}_i_${initId}`;
      const pId = `${iId}_p_${projId}`;
      const sId = `${pId}_s_${stageId}`;
      const tId = `${sId}_t_${t.id}`;

      const node1 = getOrCreate(tree.children, secIdStr, sectName, "sector");
      const node2 = getOrCreate(node1.children, iId, initName, "initiative");
      const node3 = getOrCreate(node2.children, pId, projName, "project");
      const node4 = getOrCreate(node3.children, sId, stageName, "stage");

      const startT = t.startDate ? new Date(t.startDate).getTime() : 0;
      const endT = t.endDate ? new Date(t.endDate).getTime() + 86400000 - 1 : 0;

      node4.tasks.push({
        id: tId,
        type: "task",
        label: t.name,
        taskData: t,
        minStart: startT,
        maxEnd: endT,
      });
    });

    const allGroupIds: string[] = [];
    const groupIdsByDepth: Record<number, string[]> = {};

    const processNode = (node: TreeNode, depth: number) => {
      node.depth = depth;
      if (node.type !== "task") {
        allGroupIds.push(node.id);
        if (!groupIdsByDepth[depth]) groupIdsByDepth[depth] = [];
        groupIdsByDepth[depth].push(node.id);
      }
      let childNodes = Array.from(node.children.values());
      for (let c of childNodes) {
        processNode(c, depth + 1);
        if (c.minStart < node.minStart) node.minStart = c.minStart;
        if (c.maxEnd > node.maxEnd) node.maxEnd = c.maxEnd;
      }
      for (let t of node.tasks) {
        if (t.minStart < node.minStart) node.minStart = t.minStart;
        if (t.maxEnd > node.maxEnd) node.maxEnd = t.maxEnd;
      }
      // Always keep sectors, initiatives, and projects. Only filter out empty stages if desired, but here we just keep everything that was inserted.
      node.childrenArray = [...childNodes, ...node.tasks.map((t) => ({ ...t, childrenArray: [], depth: depth + 1 }))];
    };

    Array.from(tree.children.values()).forEach((c) => processNode(c, 0));
    // Provide all root nodes (sectors)
    const rootNodes = Array.from(tree.children.values());

    const flatRows: TreeNode[] = [];
    const flatten = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        flatRows.push(node);
        if (!collapsedGroups.has(node.id) && node.childrenArray) {
          flatten(node.childrenArray);
        }
      }
    };
    flatten(rootNodes);

    const taskPositions: Record<string, { left: number; width: number; centerYPx: number }> = {};
    flatRows.forEach((row, i) => {
      if (row.type === "task" && row.taskData) {
        const left = dateToPercent(row.minStart);
        const width = Math.max(0.5, dateToPercent(row.maxEnd) - left);
        taskPositions[row.taskData.id] = { left, width, centerYPx: i * 28 + 14 };
      }
    });

        return {
      flatRows,
      minT,
      realTotalDuration,
      columns,
            // title is now managed by the parent page
      taskPositions,
      dateToPercent,
      percentToDate,
      allGroupIds,
      groupIdsByDepth,
      taskStatusMap,
    };
  }, [tasks, projects, initiatives, sectors, ganttZoom, currentDate, businessDaysOnly, collapsedGroups, containerWidth, level]);

  // Handle Initial Auto-collapse
  useEffect(() => {
    if (!hasAutoCollapsed && tasks.length > 0 && ganttData.allGroupIds.length > 0) {
      const toCollapse = new Set<string>();
      Object.entries(ganttData.groupIdsByDepth).forEach(([depthStr, ids]) => {
        if (parseInt(depthStr) >= 2) {
          ids.forEach((id) => toCollapse.add(id));
        }
      });
      setCollapsedGroups(toCollapse);
      setHasAutoCollapsed(true);
    }
  }, [tasks.length, ganttData.allGroupIds.length, hasAutoCollapsed, ganttData.groupIdsByDepth]);

  // Global Mouse Handlers for Drag
  useEffect(() => {
    const handleGlobalMouseUp = (e: MouseEvent | TouchEvent) => {
      if (dragRef.current) {
        const currentGanttData = latestGanttDataRef.current;
      if (dragRef.current && timelineContentRef.current && currentGanttData) {
        const taskEl = document.querySelector(`[data-task-id="${dragRef.current.taskId}"]`) as HTMLElement;
        const snappedLeft = dragRef.current.snappedLeft ?? dragRef.current.initialLeft;
        const snappedWidth = dragRef.current.snappedWidth ?? dragRef.current.initialWidth;

        const newStartT = currentGanttData.percentToDate(snappedLeft);
        const newEndT = currentGanttData.percentToDate(snappedLeft + snappedWidth);

        if (taskEl) {
          taskEl.style.left = `${snappedLeft}%`;
          taskEl.style.width = `${snappedWidth}%`;
          taskEl.dataset.dragging = "false";
          taskEl.classList.remove(styles.dragActive);
          const feedbackEl = taskEl.querySelector("[data-drag-feedback]") as HTMLElement;
          if (feedbackEl) {
            feedbackEl.style.display = "none";
            feedbackEl.style.opacity = "0";
          }
        }

        const guideEl = document.getElementById("dragGuideLine");
        if (guideEl) guideEl.style.display = "none";

        updateTaskRef.current.mutate(
          {
            id: dragRef.current.taskId,
            startDate: new Date(newStartT),
            endDate: new Date(newEndT),
          },
          {
            onSuccess: () => toast.success("Datas da tarefa salvas com sucesso!"),
            onError: (err) => toast.error("Erro ao atualizar datas da tarefa: " + String(err)),
          }
        );

        dragRef.current = null;
        setIsDragging(false);
        document.body.style.userSelect = ""; // Restore text selection
      }
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent | TouchEvent) => {
      const currentGanttData = latestGanttDataRef.current;
      if (dragRef.current && timelineContentRef.current && currentGanttData) {
        if (e.cancelable) e.preventDefault(); // Stop text selection during task dragging
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

        if (Math.abs(clientX - dragRef.current.initialX) > 3) {
          dragHasMovedRef.current = true;
        }
        dragRef.current.currentX = clientX;

        const dx = dragRef.current.currentX - dragRef.current.initialX;
        const timelineWidth = timelineContentRef.current.clientWidth;
        const dxPercent = (dx / timelineWidth) * 100;

        const snapUnitMs =
          latestZoomRef.current === "ano" || latestZoomRef.current === "semestre"
            ? 15 * 86400000
            : latestZoomRef.current === "trimestre"
            ? 7 * 86400000
            : latestZoomRef.current === "dia"
            ? 3600000 // 1 hour snapping for daily view
            : 86400000;

        let rawNewLeft = dragRef.current.initialLeft;
        let rawNewWidth = dragRef.current.initialWidth;

        if (dragRef.current.action === "move") {
          rawNewLeft += dxPercent;
        } else if (dragRef.current.action === "resize-left") {
          rawNewLeft += dxPercent;
          rawNewWidth -= dxPercent;
        } else if (dragRef.current.action === "resize-right") {
          rawNewWidth += dxPercent;
        }

        if (rawNewWidth < 0.5) rawNewWidth = 0.5;

        const originalStartT = currentGanttData.percentToDate(dragRef.current.initialLeft);
        const originalEndT = currentGanttData.percentToDate(dragRef.current.initialLeft + dragRef.current.initialWidth);
        const originalDuration = originalEndT - originalStartT;

        let rawStartT = currentGanttData.percentToDate(rawNewLeft);
        let snappedStartT = Math.round(rawStartT / snapUnitMs) * snapUnitMs;
        let snappedLeft = currentGanttData.dateToPercent(snappedStartT);

        let snappedWidth = rawNewWidth;
        if (dragRef.current.action === "move") {
          const snappedEndT = snappedStartT + originalDuration;
          snappedWidth = currentGanttData.dateToPercent(snappedEndT) - snappedLeft;
        } else if (dragRef.current.action === "resize-left") {
          const rawEndT = currentGanttData.percentToDate(dragRef.current.initialLeft + dragRef.current.initialWidth);
          snappedWidth = currentGanttData.dateToPercent(rawEndT) - snappedLeft;
        } else if (dragRef.current.action === "resize-right") {
          let rawEndT = currentGanttData.percentToDate(rawNewLeft + rawNewWidth);
          let snappedEndT = Math.round(rawEndT / snapUnitMs) * snapUnitMs;
          snappedWidth = currentGanttData.dateToPercent(snappedEndT) - snappedLeft;
          snappedLeft = dragRef.current.initialLeft;
        }

        if (snappedWidth < 0.5) snappedWidth = 0.5;

        if (dragRef.current.action === "resize-right") {
          rawNewLeft = dragRef.current.initialLeft;
        }

        // Update DOM visually fluidly (1:1 with mouse)
        const taskEl = document.querySelector(`[data-task-id="${dragRef.current.taskId}"]`) as HTMLElement;
        if (taskEl) {
          taskEl.classList.add(styles.dragActive);
          taskEl.style.left = `${rawNewLeft}%`;
          taskEl.style.width = `${rawNewWidth}%`;
          
          dragRef.current.snappedLeft = snappedLeft;
          dragRef.current.snappedWidth = snappedWidth;

          const guideEl = document.getElementById("dragGuideLine");
          if (guideEl) {
            guideEl.style.display = "block";
            guideEl.style.left = `${snappedLeft}%`;
          }

          const feedbackEl = taskEl.querySelector("[data-drag-feedback]") as HTMLElement;
          if (feedbackEl) {
            const nStart = currentGanttData.percentToDate(snappedLeft);
            const nEnd = currentGanttData.percentToDate(snappedLeft + snappedWidth);
            const sD = new Date(nStart);
            const eD = new Date(nEnd);
            const dragStartDateStr = `${sD.getDate().toString().padStart(2, "0")}/${(sD.getMonth() + 1)
              .toString()
              .padStart(2, "0")}`;
            const dragEndDateStr = `${eD.getDate().toString().padStart(2, "0")}/${(eD.getMonth() + 1)
              .toString()
              .padStart(2, "0")}`;
            feedbackEl.textContent = `${dragStartDateStr} → ${dragEndDateStr}`;
            feedbackEl.style.display = "block";
            feedbackEl.style.opacity = "1";
          }
        }

        const sourceLines = document.querySelectorAll(`[data-source-id="${dragRef.current.taskId}"]`);
        sourceLines.forEach((line) => {
          line.setAttribute("x1", `${snappedLeft + snappedWidth}%`);
        });

        const targetLines = document.querySelectorAll(`[data-target-id="${dragRef.current.taskId}"]`);
        targetLines.forEach((line) => {
          line.setAttribute("x2", `${snappedLeft}%`);
        });
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove, { passive: false });
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchmove", handleGlobalMouseMove, { passive: false });
    window.addEventListener("touchend", handleGlobalMouseUp);
    window.addEventListener("touchcancel", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchmove", handleGlobalMouseMove);
      window.removeEventListener("touchend", handleGlobalMouseUp);
      window.removeEventListener("touchcancel", handleGlobalMouseUp);
    };
  }, []);

  const todayT = new Date().getTime();
  const todayLeft = ganttData.dateToPercent(todayT);
  const isDraggingGlobal = isDragging;

  const handleSidebarTaskHover = (taskId: string) => {
    if (!dragRef.current) setHoveredTaskId(taskId);
  };

  const handleSidebarTaskLeave = () => {
    if (!dragRef.current) setHoveredTaskId(null);
  };

  const expandAll = () => setCollapsedGroups(new Set());
  const collapseAll = () => setCollapsedGroups(new Set(ganttData.allGroupIds));

  const calculatedTimelineWidth = Math.max(containerWidth, ganttData.columns.length * 60);

  return (
    <div className={`${styles.ganttContainer} ${styles[`level${level}`]} ${isDraggingGlobal ? styles.isDraggingGlobal : ""}`}>
      {/* Main Gantt Body */}
      <div className={styles.ganttLayout}>
        <CronogramaGanttSidebar
          flatRows={ganttData.flatRows}
          collapsedGroups={collapsedGroups}
          toggleCollapse={toggleCollapse}
          onTaskClick={onTaskClick}
          hoveredTaskId={hoveredTaskId}
          onTaskHover={handleSidebarTaskHover}
          onTaskLeave={handleSidebarTaskLeave}
          expandAll={expandAll}
          collapseAll={collapseAll}
          taskStatusMap={ganttData.taskStatusMap}
        />

        {/* Timeline */}
        <div
          ref={timelineWrapperRef}
          className={`${styles.ganttTimelineWrapper} ${styles.grab}`}
        >
          <div ref={timelineContentRef} className={styles.ganttTimelineContent} style={{ width: `${calculatedTimelineWidth}px`, minWidth: '100%' }}>
            <div className={styles.ganttTimelineHeader}>
              <div className={styles.columnsRow}>
                  {ganttData.columns.map((c, i) => {
                    const pxWidth = calculatedTimelineWidth * (c.width / 100);
                    let displayLabel = c.label;
                    
                    if (c.granType === "month") {
                      if (pxWidth > 150) displayLabel = c.fullLabel;
                      else if (pxWidth > 80) displayLabel = c.monthName?.toUpperCase() || c.label;
                      else if (pxWidth > 40) displayLabel = c.label;
                      else displayLabel = c.monthNumber ? c.monthNumber.toString() : c.label;
                    } 
                    else if (c.granType === "quarter") {
                      if (pxWidth > 140) displayLabel = c.fullLabel;
                      else displayLabel = c.label;
                    }
                    else if (c.granType === "biweek") {
                      if (pxWidth > 140) displayLabel = c.label.includes("1ª") ? `1ª Quinzena (${c.fullLabel.split(', ')[1]})` : `2ª Quinzena (${c.fullLabel.split(', ')[1]})`;
                      else if (pxWidth > 70) displayLabel = c.label;
                      else displayLabel = c.label.includes("1ª") ? "1Q" : "2Q";
                    }
                    else if (c.granType === "week") {
                      if (pxWidth > 320) displayLabel = c.fullLabel;
                      else if (pxWidth > 180) displayLabel = c.monthName || c.fullLabel; // Semana de 02/08 a 08/08
                      else if (pxWidth > 110) displayLabel = c.monthName?.replace("Semana de ", "") || c.fullLabel; // 02/08 a 08/08
                      else displayLabel = c.label; // (1/4)
                    }
                    else if (c.granType === "day") {
                      const isToday = c.date && c.date.toLocaleDateString() === new Date().toLocaleDateString();
                      if (pxWidth > 140) {
                         const prefix = isToday ? "Hoje - " : "";
                         displayLabel = prefix + c.fullLabel;
                      } else if (pxWidth > 70) {
                         const prefix = isToday ? "Hoje - " : "";
                         displayLabel = prefix + c.date?.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
                      } else if (pxWidth > 40) {
                         displayLabel = isToday ? "Hoje" : c.label;
                      } else {
                         displayLabel = c.label;
                      }
                    }
                    else if (c.granType === "hour") {
                      if (pxWidth > 90) displayLabel = c.fullLabel;
                      else displayLabel = c.label;
                    }

                    return (
                      <div
                        key={i}
                        title={c.fullLabel}
                        className={`${styles.columnCell} ${c.isWeekend ? styles.weekend : ""} ${c.date && onDayClick ? styles.clickableCol : ""}`}
                        style={{ width: `${c.width}%` }}
                        onClick={() => { if (c.date && onDayClick) onDayClick(c.date); }}
                      >
                        {displayLabel}
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className={styles.ganttTimelineGrid}>
              {/* Background Grid Lines */}
              <div className={styles.gridLinesRow}>
                {ganttData.columns.map((c, i) => (
                  <div key={i} className={`${styles.gridLineCell} ${c.isWeekend ? styles.weekend : ""}`} style={{ width: `${c.width}%` }}></div>
                ))}
              </div>

              {/* Today Line */}
              {todayLeft >= 0 && todayLeft <= 100 && <div className={styles.todayLine} style={{ left: `${todayLeft}%` }} />}

              {/* Drag guide line */}
              <div id="dragGuideLine" className={styles.dragGuide} style={{ display: "none" }}></div>

              {/* Task Bars Area */}
              <div className={styles.ganttBarsArea}>
                {dependencies && dependencies.length > 0 && (
                  <svg className={styles.dependenciesOverlay}>
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" className={styles.dependencyArrowMarker} />
                      </marker>
                    </defs>
                    {dependencies.map((dep) => {
                      const source = ganttData.taskPositions[dep.dependsOnTaskId];
                      const target = ganttData.taskPositions[dep.taskId];
                      if (!source || !target) return null;

                      let sLeft = source.left;
                      let sWidth = source.width;
                      let tLeft = target.left;

                      return (
                        <line
                          key={dep.id}
                          data-source-id={dep.dependsOnTaskId}
                          data-target-id={dep.taskId}
                          x1={`${sLeft + sWidth}%`}
                          y1={source.centerYPx}
                          x2={`${tLeft}%`}
                          y2={target.centerYPx}
                          className={styles.dependencyLine}
                          markerEnd="url(#arrow)"
                        />
                      );
                    })}
                  </svg>
                )}
                {ganttData.flatRows.map((row) => {
                  if (row.type !== "task") {
                    // Render Group Summary Bar
                    if (row.minStart === Infinity || row.maxEnd === -Infinity) {
                      return <div key={row.id} className={styles.barRow} />;
                    }
                    const left = ganttData.dateToPercent(row.minStart);
                    const width = Math.max(0.1, ganttData.dateToPercent(row.maxEnd) - left);

                    return (
                      <div key={row.id} className={`${styles.barRow} ${styles.groupBarRow}`}>
                        <summary className={styles.summaryBar} style={{ left: `${left}%`, width: `${width}%` }} />
                      </div>
                    );
                  }

                  // Render Task Bar
                  const task = row.taskData!;
                  const isDraggingThis = isDragging && dragRef.current?.taskId === task.id;

                  const computedState = ganttData.taskStatusMap.get(task.id) || "ready";

                  const stateClass = styles[`state-${computedState}`];

                  let StateIcon = Circle;
                  if (computedState === "blocked") StateIcon = Lock;
                  else if (computedState === "in_progress") StateIcon = Play;
                  else if (computedState === "completed") StateIcon = CheckCircle2;

                  let displayLeft = ganttData.taskPositions[task.id]?.left || 0;
                  let displayWidth = ganttData.taskPositions[task.id]?.width || 0;

                  return (
                    <div
                      key={row.id}
                      className={`${styles.barRow} ${stateClass} ${hoveredTaskId === task.id ? styles.hoveredRow : ""}`}
                      onMouseEnter={() => {
                        if (!dragRef.current) setHoveredTaskId(task.id);
                      }}
                      onMouseLeave={() => {
                        if (!dragRef.current) setHoveredTaskId(null);
                      }}
                    >
                      <div
                        data-task-id={task.id}
                        data-dragging={isDraggingThis ? "true" : "false"}
                        className={`${styles.taskBarContainer} ${isDraggingThis ? styles.dragging : ""}`}
                        style={{ left: `${displayLeft}%`, width: `${displayWidth}%` }}
                        onClick={(e) => {
                          if (dragHasMovedRef.current) {
                            if (e.cancelable) e.preventDefault();
                            e.stopPropagation();
                            return;
                          }
                          onTaskClick(task.id);
                        }}
                        onMouseDown={(e) => handleTaskMouseDown(e, task.id, displayLeft, displayWidth)}
                        onTouchStart={(e) => handleTaskMouseDown(e as any, task.id, displayLeft, displayWidth)}
                      >
                        <div data-drag-feedback className={styles.dragFeedbackLabel}></div>
                        <div
                          className={`${styles.taskBarBg} ${styles[`priority-${task.priority || "medium"}`]}`}
                          style={{
                            backgroundColor: task.color
                              ? `color-mix(in srgb, ${task.color} 30%, var(--card))`
                              : `color-mix(in srgb, var(--primary) 20%, var(--card))`,
                            borderColor: task.color
                              ? `color-mix(in srgb, ${task.color} 80%, transparent)`
                              : `color-mix(in srgb, var(--primary) 60%, transparent)`,
                          }}
                        >              <div className={styles.taskBarFill} style={{ width: `${task.progress || 0}%` }} />
                          <div className={styles.taskBarContent}>
                            <StateIcon size={10} className={styles.stateIcon} aria-label={`Status: ${computedState}`} />
                            {task.assigneeInitials && (
                              <div className={styles.assigneeAvatar}>{task.assigneeInitials.substring(0, 2).toUpperCase()}</div>
                            )}
                            <span className={styles.taskBarLabel}>
                              {task.name} {task.progress ? `(${task.progress}%)` : ""}
                            </span>
                          </div>
                        </div>

                        {/* Tooltip */}
                        <div className={styles.taskTooltip}>
                          <div className={styles.tooltipTitle}>{task.name}</div>
                          <div className={styles.tooltipRow}>
                            <span className={styles.tooltipLabel}>Responsável</span>
                            <span>{task.assigneeName || "Não atribuído"}</span>
                          </div>
                          <div className={styles.tooltipRow}>
                            <span className={styles.tooltipLabel}>Período</span>
                            <span>
                              {task.startDate ? new Date(task.startDate).toLocaleDateString("pt-BR") : "-"} a{" "}
                              {task.endDate ? new Date(task.endDate).toLocaleDateString("pt-BR") : "-"}
                            </span>
                          </div>
                          <div className={styles.tooltipRow}>
                            <span className={styles.tooltipLabel}>Progresso</span>
                            <span>{task.progress || 0}%</span>
                          </div>
                          <div className={styles.tooltipRow}>
                            <span className={styles.tooltipLabel}>Prioridade</span>
                            <span style={{ textTransform: "capitalize" }}>{task.priority || "Média"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}