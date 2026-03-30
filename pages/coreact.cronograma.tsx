import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Filter, Calendar as CalendarIcon, Layout, Columns, LayoutList, ChevronLeft, ChevronRight, CalendarCheck, GitCommit } from "lucide-react";
import { useTasks, useProjects, useTeamMembers, useDependencies, useInitiatives, useSectors, useUpdateTask } from "../helpers/useCoreActApi";
import { Skeleton } from "../components/Skeleton";
import { Button } from "../components/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/Select";
import { Popover, PopoverTrigger, PopoverContent } from "../components/Popover";
import { Badge } from "../components/Badge";
import { CoreActTaskDetailSheet } from "../components/CoreActTaskDetailSheet";
import { CreateTaskModal } from "../components/CoreActQuickActions";
import { useCronogramaState } from "../helpers/useCronogramaState";
import { filterTasksForDay } from "../helpers/cronogramaTaskUtils";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";
import { useGoogleTranslate } from "../helpers/useTranslation";
import { useSwipeNavigation } from "../helpers/useSwipeNavigation";
import { CronogramaGantt } from "../components/CronogramaGantt";
import { CronogramaKanban } from "../components/CronogramaKanban";
import { CronogramaLista } from "../components/CronogramaLista";
import { CronogramaProcessos } from "../components/CronogramaProcessos";
import styles from "./coreact.cronograma.module.css";

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

export default function CoreActCronograma() {
  const { locale } = useGoogleTranslate();
  const { data: tasksData, isLoading: isLoadingTasks } = useTasks();
  const { data: projectsData, isLoading: isLoadingProjects } = useProjects();
  const { data: teamData } = useTeamMembers();
  const { data: dependenciesData } = useDependencies({});
  const { data: initiativesData } = useInitiatives();
  const { data: sectorsData } = useSectors();

  const updateTaskMutation = useUpdateTask();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  const {
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
    toolbarTitleShort,
  } = useCronogramaState();

  const filteredTasks = tasksData?.tasks.filter(t => {
    if (filters.projectId !== "all" && t.projectId !== filters.projectId) return false;
    if (filters.assigneeId !== "all" && t.assigneeId !== filters.assigneeId) return false;
    if (filters.statuses.length > 0 && (!t.status || !filters.statuses.includes(t.status))) return false;
    if (filters.priorities.length > 0 && (!t.priority || !filters.priorities.includes(t.priority))) return false;
    return true;
  }) || [];

  const isLoading = isLoadingTasks || isLoadingProjects;

  const { ref, level, className: adaptiveClass } = useAdaptiveLevel({ 
    itemCount: isLoading ? 0 : filteredTasks.length 
  });

  const viewModes = [
    { id: 'gantt', label: 'Cronograma / Gráficos', icon: Layout },
    { id: 'kanban', label: 'Kanban', icon: Columns },
    { id: 'list', label: 'Lista', icon: LayoutList },
    { id: 'process', label: 'Timeline', icon: GitCommit },
  ];

  const handleViewChange = (id: string) => {
    setViewMode(id as any);
  };

  const needsDateNav = viewMode === "gantt" || viewMode === "kanban";

  const swipeNavRef = useSwipeNavigation(
    (dir) => {
      shiftDate(dir);
    },
    { threshold: 120, enabled: needsDateNav }
  );

  const handleNavigateWithFeedback = (dir: 1 | -1) => {
    shiftDate(dir);
    if ((swipeNavRef as any).current) {
      const el = (swipeNavRef as any).current as HTMLElement;
      // Start slightly pushed
      el.style.transition = 'none';
      el.style.transform = `translateX(${dir === 1 ? '-30px' : '30px'}) scale(0.98)`;
      el.style.filter = dir === 1 
        ? 'saturate(140%) brightness(105%) hue-rotate(-15deg)'
        : 'sepia(40%) grayscale(20%)';
      
      // trigger reflow
      void el.offsetHeight;
      
      // snap back
      el.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.4s ease';
      el.style.transform = 'translateX(0) scale(1)';
      el.style.filter = 'none';

      setTimeout(() => {
        el.style.transition = '';
      }, 400);
    }
  };

  if (isLoading) {
    return (
      <div ref={ref} className={`${styles.container} ${adaptiveClass} ${styles[`level${level}`]}`}>
         <div className={styles.toolbar}>
            <Skeleton style={{ width: 300, height: 40 }} />
         </div>
         <Skeleton style={{ flex: 1, height: '100%', minHeight: 400 }} />
      </div>
    );
  }



  return (
    <div ref={ref} className={`${styles.container} ${adaptiveClass} ${styles[`level${level}`]}`}>
      <Helmet><title>CoreStudio | Cronograma</title></Helmet>
      <header className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.viewPills}>
            {viewModes.map(mode => (
              <button
                key={mode.id}
                className={`${styles.viewPill} ${mode.id === viewMode ? styles.viewPillActive : ''}`}
                onClick={() => handleViewChange(mode.id)}
                title={mode.label}
              >
                <mode.icon size={16} />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.toolbarCenter}>
          {needsDateNav && (
            <div className={styles.dateNav}>
              <button className={styles.actionIcon} onClick={() => handleNavigateWithFeedback(-1)}>
                <ChevronLeft size={16} />
              </button>
              <span className={styles.dateTitleContainer} style={{ ... (ganttZoom === 'dia' ? { minWidth: '180px' } : {}) }}>
                <span className={styles.dateTitleFull}>{toolbarTitle}</span>
                <span className={styles.dateTitleShort}>{toolbarTitleShort}</span>
              </span>
              <button className={styles.actionIcon} onClick={() => handleNavigateWithFeedback(1)}>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        <div className={styles.toolbarRight}>
          {(viewMode === 'gantt' || viewMode === 'kanban') && (
            <>
              <div className={styles.zoomPills}>
                {[
                  { id: 'ano', label: locale === 'en' ? 'Year' : 'Ano', short: 'A' },
                  { id: 'semestre', label: locale === 'en' ? 'Half' : 'Sem.', short: 'S' },
                  { id: 'trimestre', label: locale === 'en' ? 'Qtr.' : 'Tri.', short: 'T' },
                  { id: 'mes', label: locale === 'en' ? 'Month' : 'Mês', short: 'M' },
                  { id: 'semana', label: locale === 'en' ? 'Wk.' : 'Sem.', short: 'W' },
                  { id: 'dia', label: locale === 'en' ? 'Day' : 'Dia', short: 'D' }
                ].map(zoom => (
                  <button
                    key={zoom.id}
                    className={`${styles.zoomPill} ${zoom.id === ganttZoom ? styles.zoomPillActive : ''} notranslate`}
                    onClick={() => setGanttZoom(zoom.id as any)}
                    title={zoom.label}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {zoom.label}
                  </button>
                ))}
              </div>
              
              <button 
                className={styles.actionIcon} 
                onClick={setToday}
                title="Hoje"
                style={{ width: 'auto', padding: '0 8px', fontSize: '12px', fontWeight: 600, marginLeft: '8px' }}
              >
                Hoje
              </button>
            </>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <button className={styles.actionIcon} title="Filtros">
                <Filter size={16} />
                {activeFilterCount > 0 && <span className={styles.filterDot} />}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" side="bottom" sideOffset={8}>
              <div className={styles.filterPanel}>
                <div className={styles.filterSection}>
                  <span className={styles.filterSectionTitle}>Projeto</span>
                  <Select value={filters.projectId} onValueChange={v => setFilters(p => ({...p, projectId: v}))}>
                    <SelectTrigger><SelectValue placeholder="Todos os projetos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {projectsData?.projects.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className={styles.filterSection}>
                  <span className={styles.filterSectionTitle}>Status</span>
                  <div className={styles.filterBadges}>
                    {Object.keys(statusMap).map(st => {
                      const isSelected = filters.statuses.includes(st);
                      return (
                        <Badge 
                          key={st} 
                          variant={isSelected ? "primary" : "outline"}
                          className={styles.filterBadge}
                          onClick={() => setFilters(p => ({
                            ...p, 
                            statuses: isSelected ? p.statuses.filter(s => s !== st) : [...p.statuses, st]
                          }))}
                        >
                          {statusMap[st]}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.filterSection}>
                  <span className={styles.filterSectionTitle}>Prioridade</span>
                  <div className={styles.filterBadges}>
                    {Object.keys(priorityMap).map(pr => {
                      const isSelected = filters.priorities.includes(pr);
                      return (
                        <Badge 
                          key={pr} 
                          variant={isSelected ? "primary" : "outline"}
                          className={styles.filterBadge}
                          onClick={() => setFilters(p => ({
                            ...p, 
                            priorities: isSelected ? p.priorities.filter(s => s !== pr) : [...p.priorities, pr]
                          }))}
                        >
                          {priorityMap[pr]}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.filterSection}>
                  <span className={styles.filterSectionTitle}>Responsável</span>
                  <Select value={filters.assigneeId} onValueChange={v => setFilters(p => ({...p, assigneeId: v}))}>
                    <SelectTrigger><SelectValue placeholder="Todos os responsáveis" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {teamData?.teamMembers.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className={styles.filterFooter}>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>Limpar filtros</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      <div ref={swipeNavRef as any} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {viewMode === 'gantt' && (
          <CronogramaGantt 
            tasks={filteredTasks}
            projects={projectsData?.projects || []}
            initiatives={initiativesData?.initiatives || []}
            sectors={sectorsData || []}
            dependencies={dependenciesData?.dependencies || []}
            teamMembers={teamData?.teamMembers || []}
            onTaskClick={(id) => setSelectedTaskId(id)}
            ganttZoom={ganttZoom}
            currentDate={currentDate}
            level={level as any}
          />
        )}
        {viewMode === 'kanban' && (
          <CronogramaKanban 
            tasks={filteredTasks}
            projects={projectsData?.projects || []}
            onTaskClick={(id) => setSelectedTaskId(id)}
            level={level as any}
            ganttZoom={ganttZoom}
            currentDate={currentDate}
          />
        )}
        {viewMode === 'list' && (
          <CronogramaLista 
            tasks={filteredTasks}
            projects={projectsData?.projects || []}
            onTaskClick={(id) => setSelectedTaskId(id)}
            level={level as any}
          />
        )}
        {viewMode === 'process' && (
          <CronogramaProcessos 
            tasks={filteredTasks}
            projects={projectsData?.projects || []}
            onTaskClick={(id) => setSelectedTaskId(id)}
          />
        )}

      <CreateTaskModal 
        open={selectedTaskId === "new"} 
        onOpenChange={(val) => { if (!val) setSelectedTaskId(null); }} 
        defaultDate={currentDate} 
      />
        <CoreActTaskDetailSheet 
          taskId={selectedTaskId && selectedTaskId !== "new" ? selectedTaskId : null} 
          onClose={() => setSelectedTaskId(null)} 
        />
      </div>
    </div>
  );
}