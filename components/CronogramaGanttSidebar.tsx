import React from "react";
import { ChevronDown, ChevronRight as ChevronRightIcon, ChevronsUpDown, ChevronsDownUp, Lock, Circle, Play, CheckCircle2 } from "lucide-react";
import { Button } from "./Button";
import { ComputedTaskState } from "./CronogramaGantt";
import styles from "./CronogramaGantt.module.css";

export interface CronogramaGanttSidebarProps {
  flatRows: any[];
  collapsedGroups: Set<string>;
  toggleCollapse: (id: string, e: React.MouseEvent) => void;
  onTaskClick: (taskId: string) => void;
  hoveredTaskId: string | null;
  onTaskHover: (taskId: string) => void;
  onTaskLeave: () => void;
  expandAll: () => void;
  collapseAll: () => void;
  taskStatusMap: Map<string, ComputedTaskState>;
}

export function CronogramaGanttSidebar({
  flatRows,
  collapsedGroups,
  toggleCollapse,
  onTaskClick,
  hoveredTaskId,
  onTaskHover,
  onTaskLeave,
  expandAll,
  collapseAll,
  taskStatusMap,
}: CronogramaGanttSidebarProps) {
  return (
    <div className={styles.ganttSidebar}>
      <div className={styles.ganttSidebarHeader}>
        <span className={styles.sidebarHeaderTitle}>Estrutura</span>
        <div className={styles.sidebarHeaderActions}>
          <Button variant="ghost" size="icon-sm" onClick={expandAll} title="Expandir Tudo">
            <ChevronsUpDown size={14} />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={collapseAll} title="Recolher Tudo">
            <ChevronsDownUp size={14} />
          </Button>
        </div>
      </div>
      <div className={styles.ganttSidebarContent}>
        {flatRows.map((row) => {
          const paddingLeft = (row.depth || 0) * 16 + 12;
          const isGroup = row.type !== "task";
          const actuallyHasChildren = row.childrenArray && row.childrenArray.length > 0;
          const isCollapsed = collapsedGroups.has(row.id);

          return (
            <div
              key={row.id}
              className={`${styles.sidebarRow} ${row.type === "task" ? styles.sidebarTaskRow : styles.sidebarGroupRow} ${
                hoveredTaskId === row.taskData?.id ? styles.hoveredRow : ""
              }`}
              onClick={() => (row.type === "task" && row.taskData ? onTaskClick(row.taskData.id) : null)}
              onMouseEnter={() => {
                if (row.taskData) onTaskHover(row.taskData.id);
              }}
              onMouseLeave={() => {
                onTaskLeave();
              }}
            >
              <div className={styles.indentationLines}>
                {Array.from({ length: row.depth || 0 }).map((_, i) => (
                  <div key={i} className={styles.indentLine} style={{ left: i * 16 + 12 + 7 }} />
                ))}
              </div>
              <div style={{ paddingLeft, display: "flex", alignItems: "center", flex: 1, overflow: "hidden" }}>
                {isGroup && actuallyHasChildren && (
                  <button className={styles.collapseToggle} onClick={(e) => toggleCollapse(row.id, e)}>
                    {isCollapsed ? <ChevronRightIcon size={14} /> : <ChevronDown size={14} />}
                  </button>
                )}
                {isGroup && !actuallyHasChildren && (
                  <div className={styles.collapseToggle} style={{ cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Circle size={6} fill="currentColor" opacity={0.4} />
                  </div>
                )}
                {!isGroup && <div className={styles.collapseTogglePlaceholder} />}
                {!isGroup && row.taskData && (
                  (() => {
                    const computedState = taskStatusMap.get(row.taskData.id) || "ready";
                    let StateIcon = Circle;
                    if (computedState === "blocked") StateIcon = Lock;
                    else if (computedState === "in_progress") StateIcon = Play;
                    else if (computedState === "completed") StateIcon = CheckCircle2;
                    return <StateIcon size={12} className={styles.sidebarStateIcon} style={{ marginRight: '4px', flexShrink: 0, opacity: 0.7 }} aria-label={`Status: ${computedState}`} />;
                  })()
                )}
                <span className={`${styles.sidebarLabel} ${row.taskData && taskStatusMap.get(row.taskData.id) === 'completed' ? styles.sidebarLabelCompleted : ''}`} title={row.label}>
                  {row.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}