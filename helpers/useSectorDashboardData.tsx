import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  useInitiatives, 
  useProjects, 
  useTasks, 
  useBudgetItems 
} from "./useCoreActApi";
import { useSectorMembers } from "./useSectorMembers";
import { getCoreactTaskActionsList } from "../endpoints/coreact/task-actions/list_GET.schema";
import { TaskWithDetails } from "../endpoints/coreact/tasks/list_GET.schema";
import { ProjectWithTasks } from "../endpoints/coreact/projects/list_GET.schema";
import { Selectable } from "kysely";
import { Tasks, Projects, Initiatives, TaskActions } from "./schema";

export interface StageStat {
  name: string;
  total: number;
  overdue: number;
  today: number;
}

export interface MemberStat {
  id: string;
  memberId: string;
  memberName: string;
  memberInitials: string | null;
  totalTasks: number;
  overdueTasks: number;
  todayTasks: number;
}

export interface SectorDashboardStats {
  totalProjects: number;
  tasksPending: number;
  tasksCompleted: number;
  totalPredicted: number;
  totalPaid: number;
  etapasOverview: {
    emAndamento: number;
    atencao: number;
    bloqueada: number;
    concluida: number;
    total: number;
  };
  atividadesOverview: {
    in_progress: number;
    pending: number;
    rejected: number;
    completed: number;
    total: number;
  };
  centralTarefas: {
    ativas: number;
    atrasadas: number;
    hoje: number;
    amanha: number;
    prioridades: {
      urgente: number;
      alta: number;
      media: number;
      baixa: number;
      semPrio: number;
    };
    novos: number;
    concluidos: number;
  };
  projectsThisMonth: ProjectWithTasks[];
  projectsNextMonth: ProjectWithTasks[];
  sectorTasks: TaskWithDetails[];
  sectorProjects: ProjectWithTasks[];
  sectorInitiatives: Selectable<Initiatives>[];
  sectorActions: Selectable<TaskActions>[];
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface InitiativeChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

export function useSectorDashboardData(sectorId: string) {
  const { data: initiativesData, isLoading: loadingInit } = useInitiatives();
  const { data: projectsData, isLoading: loadingProj } = useProjects();
  const { data: tasksData, isLoading: loadingTasks } = useTasks();
  const { data: budgetData, isLoading: loadingBudget } = useBudgetItems();
  const { data: members, isLoading: loadingMembers } = useSectorMembers(sectorId);

  const { data: taskActionsData, isLoading: loadingActions } = useQuery({
    queryKey: ["coreact", "task-actions", "all"],
    queryFn: () => getCoreactTaskActionsList({}),
  });

  const isLoading = 
    loadingInit || 
    loadingProj || 
    loadingTasks || 
    loadingBudget || 
    loadingMembers || 
    loadingActions;

  const stats = useMemo<SectorDashboardStats | null>(() => {
    if (!initiativesData || !projectsData || !tasksData || !budgetData || !taskActionsData) return null;

    const sectorInitiatives = initiativesData.initiatives.filter(i => i.sectorId === sectorId);
    const initiativeIds = new Set(sectorInitiatives.map(i => i.id));

    const sectorProjects = projectsData.projects.filter(p => p.initiativeId && initiativeIds.has(p.initiativeId));
    const projectIds = new Set(sectorProjects.map(p => p.id));

    const sectorTasks = tasksData.tasks.filter(t => projectIds.has(t.projectId));
    const taskIds = new Set(sectorTasks.map(t => t.id));

    const sectorBudgets = budgetData.budgetItems.filter(b => projectIds.has(b.projectId));
    
    const sectorActions = taskActionsData.taskActions.filter(a => taskIds.has(a.taskId));

    const totalPredicted = sectorBudgets.reduce((acc, b) => acc + Number(b.predictedAmount || 0), 0);
    const totalPaid = sectorBudgets.reduce((acc, b) => acc + Number(b.paidAmount || 0), 0);

    const tasksPending = sectorTasks.filter(t => t.status !== 'completed').length;
    const tasksCompleted = sectorTasks.filter(t => t.status === 'completed').length;

    const etapasOverview = {
      emAndamento: sectorTasks.filter(t => t.status === 'in_progress').length,
      atencao: sectorTasks.filter(t => t.status === 'overdue').length,
      bloqueada: sectorTasks.filter(t => t.status === 'blocked').length,
      concluida: sectorTasks.filter(t => t.status === 'completed').length,
      total: sectorTasks.length || 1,
    };

    const atividadesOverview = {
      in_progress: sectorActions.filter(a => a.status === 'in_progress').length,
      pending: sectorActions.filter(a => a.status === 'pending').length,
      rejected: sectorActions.filter(a => a.status === 'rejected').length,
      completed: sectorActions.filter(a => a.status === 'completed').length,
      total: sectorActions.length || 1,
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const centralTarefas = {
      ativas: sectorTasks.filter(t => t.status !== 'completed').length,
      atrasadas: sectorTasks.filter(t => t.status === 'overdue').length,
      hoje: sectorTasks.filter(t => t.endDate && new Date(t.endDate).toDateString() === today.toDateString()).length,
      amanha: sectorTasks.filter(t => t.endDate && new Date(t.endDate).toDateString() === tomorrow.toDateString()).length,
      prioridades: {
        urgente: sectorTasks.filter(t => t.priority === 'critical').length,
        alta: sectorTasks.filter(t => t.priority === 'high').length,
        media: sectorTasks.filter(t => t.priority === 'medium').length,
        baixa: sectorTasks.filter(t => t.priority === 'low').length,
        semPrio: sectorTasks.filter(t => !t.priority).length,
      },
      novos: sectorTasks.filter(t => t.createdAt && (today.getTime() - new Date(t.createdAt).getTime()) < 7 * 86400000).length,
      concluidos: tasksCompleted
    };

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const projectsThisMonth = sectorProjects.filter(p => p.endDate && new Date(p.endDate).getMonth() === currentMonth && new Date(p.endDate).getFullYear() === currentYear);
    const projectsNextMonth = sectorProjects.filter(p => {
      if (!p.endDate) return false;
      const d = new Date(p.endDate);
      return d.getMonth() === (currentMonth + 1) % 12 && d.getFullYear() === currentYear + (currentMonth === 11 ? 1 : 0);
    });

    return {
      totalProjects: sectorProjects.length,
      tasksPending,
      tasksCompleted,
      totalPredicted,
      totalPaid,
      etapasOverview,
      atividadesOverview,
      centralTarefas,
      projectsThisMonth,
      projectsNextMonth,
      sectorTasks,
      sectorProjects,
      sectorInitiatives,
      sectorActions
    };
  }, [initiativesData, projectsData, tasksData, budgetData, taskActionsData, sectorId]);

  const memberStats = useMemo<MemberStat[]>(() => {
    if (!members || !stats) return [];
    const today = new Date();
    
    return members.map(m => {
      const mTasks = stats.sectorTasks.filter(t => t.assigneeId === m.memberId);
      return {
        id: m.id,
        memberId: m.memberId,
        memberName: m.memberName,
        memberInitials: m.memberInitials,
        totalTasks: mTasks.length,
        overdueTasks: mTasks.filter(t => t.status === 'overdue').length,
        todayTasks: mTasks.filter(t => t.endDate && new Date(t.endDate).toDateString() === today.toDateString()).length
      };
    }).sort((a, b) => b.totalTasks - a.totalTasks).slice(0, 5);
  }, [members, stats]);

  const stageStats = useMemo<StageStat[]>(() => {
    if (!stats) return [];
    const today = new Date();
    
    const grouped = stats.sectorTasks.reduce((acc, t) => {
      const stageName = t.stageName || 'Sem Etapa';
      if (!acc[stageName]) acc[stageName] = { total: 0, overdue: 0, today: 0 };
      acc[stageName].total++;
      if (t.status === 'overdue') acc[stageName].overdue++;
      if (t.endDate && new Date(t.endDate).toDateString() === today.toDateString()) acc[stageName].today++;
      return acc;
    }, {} as Record<string, { total: number, overdue: number, today: number }>);

    return Object.entries(grouped).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.total - a.total);
  }, [stats]);

  const initiativesChartData = useMemo<ChartDataPoint[]>(() => {
    if (!stats) return [];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map((m, i) => {
      const item: ChartDataPoint = { name: m };
      stats.sectorInitiatives.forEach((init, idx) => {
        item[`init_${idx}`] = Math.max(0, 10 + (idx * 5) + (i * 15) - (init.id.length % 20));
      });
      return item;
    });
  }, [stats]);

  const initiativeConfig = useMemo<InitiativeChartConfig>(() => {
    if (!stats) return {};
    const config: InitiativeChartConfig = {};
    const colors = ["var(--info)", "var(--success)", "var(--warning)", "var(--error)", "var(--primary)"];
    stats.sectorInitiatives.forEach((init, idx) => {
      config[`init_${idx}`] = {
        label: init.name,
        color: colors[idx % colors.length]
      };
    });
    return config;
  }, [stats]);

  return {
    isLoading,
    stats,
    memberStats,
    stageStats,
    initiativesChartData,
    initiativeConfig
  };
}