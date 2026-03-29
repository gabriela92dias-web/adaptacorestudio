import React, { useMemo } from "react";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import type { TaskWithDetails } from "../endpoints/coreact/tasks/list_GET.schema";
import styles from "./CronogramaProcessos.module.css";

interface ViewProps {
  level?: 0 | 1 | 2 | 3;
  tasks: TaskWithDetails[];
  projects: { id: string; name: string; initiativeId?: string | null }[];
  initiatives?: { id: string; name: string }[];
  onTaskClick: (taskId: string) => void;
}

export const CronogramaProcessos = ({ tasks, projects, initiatives = [], onTaskClick }: ViewProps) => {
  const groupedData = useMemo(() => {
    const initMap = new Map<string, string>();
    initiatives.forEach(i => initMap.set(i.id, i.name));

    const projMap = new Map<string, any>();
    projects.forEach(p => projMap.set(p.id, p));

    const tasksByProj: Record<string, TaskWithDetails[]> = {};
    projects.forEach(p => tasksByProj[p.id] = []);
    
    tasks.forEach(task => {
      const pid = task.projectId || "unassigned";
      if (!tasksByProj[pid]) tasksByProj[pid] = [];
      tasksByProj[pid].push(task);
    });

    const projectsByInit: Record<string, any[]> = {};
    initiatives.forEach(i => projectsByInit[i.id] = []);
    
    Object.keys(tasksByProj).forEach(pid => {
      const list = tasksByProj[pid];
      list.sort((a, b) => {
        const aTime = a.startDate ? new Date(a.startDate).getTime() : Infinity;
        const bTime = b.startDate ? new Date(b.startDate).getTime() : Infinity;
        return aTime - bTime;
      });

      const proj = projMap.get(pid);
      const initId = proj?.initiativeId || "unassigned";
      
      if (!projectsByInit[initId]) projectsByInit[initId] = [];

      if (pid === "unassigned" && list.length === 0) return;

      projectsByInit[initId].push({
        projectId: pid,
        projectName: pid === "unassigned" ? "Outros Processos" : proj?.name || "Desconhecido",
        tasks: list
      });
    });

    const sections = Object.keys(projectsByInit).map(initId => {
      return {
        initiativeId: initId,
        initiativeName: initId === "unassigned" ? "Outras Iniciativas" : initMap.get(initId) || "Desconhecido",
        projects: projectsByInit[initId]
      };
    });

    return sections.sort((a, b) => {
      if (a.initiativeId === "unassigned") return 1;
      if (b.initiativeId === "unassigned") return -1;
      return a.initiativeName.localeCompare(b.initiativeName);
    }).filter(c => c.initiativeId !== "unassigned" || c.projects.length > 0)
      .filter(c => c.projects.length > 0);
  }, [tasks, projects, initiatives]);

  const formatDateLabel = (task: TaskWithDetails) => {
    if (!task.startDate) return "-";
    const start = new Date(task.startDate);
    const end = task.endDate ? new Date(task.endDate) : null;

    let timeFormat = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(start);
    if (end) {
      const endTime = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(end);
      if (timeFormat !== "00:00" || endTime !== "00:00") {
        return `${timeFormat} - ${endTime}`;
      }
    }
    
    return new Intl.DateTimeFormat("pt-BR", { month: "short", day: "numeric" }).format(start).toUpperCase();
  };

  const getDayLabel = (date: string | Date | null | undefined) => {
    if (!date) return "--";
    const d = new Date(date);
    return d.getDate().toString().padStart(2, "0");
  };

  const [expandedInitiatives, setExpandedInitiatives] = React.useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    
    // Accordion Mode: Inicializa apenas a primeira coluna como aberta
    if (groupedData.length > 0) {
      initialState[groupedData[0].initiativeId] = true;
    }
    
    return initialState;
  });

  const [expandedProjects, setExpandedProjects] = React.useState<Record<string, boolean>>({});

  const toggleInitiative = (initId: string) => {
    setExpandedInitiatives((prev: Record<string, boolean>) => {
      if (prev[initId]) {
        // Se já está aberta, fecha
        return { [initId]: false };
      }
      // Se clicar numa nova, ela recebe true e todo o resto do objeto é subscrito (sanfona limpa os outros cases)
      return { [initId]: true };
    });
  };

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev: Record<string, boolean>) => ({
      ...prev,
      [projectId]: prev[projectId] === undefined ? false : !prev[projectId] // Default is true, so first click makes it false
    }));
  };

  const defaultOpenId = groupedData[0]?.initiativeId;

  return (
    <div className={styles.container}>
      {groupedData.length === 0 ? (
        <div className={styles.emptyState}>Nenhum dado encontrado para Processos.</div>
      ) : (
        groupedData.map(initiative => {
          // Accordion explicit mode: if state is empty, default open the first one!
          const isExpanded = Object.keys(expandedInitiatives).length === 0 
            ? initiative.initiativeId === defaultOpenId 
            : !!expandedInitiatives[initiative.initiativeId];

          return (
            <div 
              key={initiative.initiativeId} 
              className={`${styles.initiativeColumn} ${!isExpanded ? styles.collapsed : ''}`}
              onClick={() => {
                if (!isExpanded) toggleInitiative(initiative.initiativeId);
              }}
            >
              {!isExpanded ? (
                <div className={styles.collapsedHeader}>
                  <span className={styles.verticalTitle}>{initiative.initiativeName}</span>
                </div>
              ) : (
                <>
                  <div className={styles.initiativeHeader}>
                    <span className={styles.initiativeTitleText}>{initiative.initiativeName}</span>
                    <button 
                      className={styles.collapseInitBtn}
                      onClick={() => toggleInitiative(initiative.initiativeId)}
                      title="Colapsar Iniciativa"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  
                  <div className={styles.initiativeScrollArea}>
                    {initiative.projects.map((section: { projectId: string; projectName: string; tasks: TaskWithDetails[] }) => {
                      // Projects are expanded by default unless explicitly set to false
                      const isProjExpanded = expandedProjects[section.projectId] !== false;

                      return (
                        <div key={section.projectId} className={styles.projectSection}>
                          <div 
                            className={styles.projectHeader}
                            onClick={() => toggleProject(section.projectId)}
                            style={{ cursor: 'pointer' }}
                          >
                            {isProjExpanded ? <ChevronDown size={18} style={{ marginRight: 8 }} /> : <ChevronRight size={18} style={{ marginRight: 8 }} />}
                            {section.projectName}
                            <span className={styles.projectCountBadge}>{section.tasks.length}</span>
                          </div>
                          
                          {isProjExpanded && (
                            <div className={styles.timelineWrap}>
                              {section.tasks.map((task: TaskWithDetails) => (
                                <div
                                  key={task.id}
                                  className={styles.node}
                                  onClick={() => onTaskClick(task.id)}
                                >
                                  <div className={styles.nodeCircleWrapper}>
                                    <div className={styles.nodeCircle}>
                                      <span className={styles.nodeNumber}>{getDayLabel(task.startDate)}</span>
                                    </div>
                                  </div>
                                  <div className={styles.nodeCard}>
                                    <div className={styles.cardHeader}>
                                      <div className={styles.badge}>{formatDateLabel(task)}</div>
                                    </div>
                                    <div className={styles.cardTitle}>{task.name}</div>
                                    {task.stageName && (
                                      <div className={styles.cardSubtitle}>{task.stageName}</div>
                                    )}
                                  </div>
                                </div>
                              ))}

                              <div className={styles.addBtnWrapper}>
                                <button className={styles.addBtn} onClick={() => onTaskClick("new")} title="Adicionar processo ao projeto">
                                  <Plus size={20} strokeWidth={2.5} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
