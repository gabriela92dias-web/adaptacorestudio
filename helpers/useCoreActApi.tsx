import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCoreactActivityList } from "../endpoints/coreact/activity/list_GET.schema";
import { getCoreactProjectsList } from "../endpoints/coreact/projects/list_GET.schema";
import { getCoreactTasksList, InputType as TasksListInput } from "../endpoints/coreact/tasks/list_GET.schema";
import { postCoreactTasksCreate, InputType as TasksCreateInput } from "../endpoints/coreact/tasks/create_POST.schema";
import { postCoreactTasksUpdate, InputType as TasksUpdateInput } from "../endpoints/coreact/tasks/update_POST.schema";
import { postCoreactTasksDelete, InputType as TasksDeleteInput } from "../endpoints/coreact/tasks/delete_POST.schema";
import { getCoreactTeamList } from "../endpoints/coreact/team/list_GET.schema";
import { postCoreactTeamCreate, InputType as TeamCreateInput } from "../endpoints/coreact/team/create_POST.schema";
import { postCoreactTeamUpdate, InputType as TeamUpdateInput } from "../endpoints/coreact/team/update_POST.schema";
import { postCoreactTeamDelete, InputType as TeamDeleteInput } from "../endpoints/coreact/team/delete_POST.schema";
import { getCoreactBudgetList, InputType as BudgetListInput } from "../endpoints/coreact/budget/list_GET.schema";
import { postCoreactBudgetCreate, InputType as BudgetCreateInput } from "../endpoints/coreact/budget/create_POST.schema";
import { postCoreactBudgetUpdate, InputType as BudgetUpdateInput } from "../endpoints/coreact/budget/update_POST.schema";
import { postCoreactBudgetDelete, InputType as BudgetDeleteInput } from "../endpoints/coreact/budget/delete_POST.schema";

export function useProjects() {
  return useQuery({
    queryKey: ["coreact", "projects"],
    queryFn: () => getCoreactProjectsList(),
    placeholderData: (previousData) => previousData,
  });
}

export function useTasks(filters: TasksListInput = {}) {
  return useQuery({
    queryKey: ["coreact", "tasks", filters],
    queryFn: () => getCoreactTasksList(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useTasksWithDailyView(operatorId?: string, date?: Date) {
  const dateStr = date ? date.toISOString().split('T')[0] : "";
  
  let dateFrom: Date | undefined;
  let dateTo: Date | undefined;

  if (date) {
    dateFrom = new Date(date);
    dateFrom.setHours(0, 0, 0, 0);
    
    dateTo = new Date(date);
    dateTo.setHours(23, 59, 59, 999);
  }

  return useQuery({
    queryKey: ["coreact", "tasks", "daily", operatorId, dateStr],
    queryFn: () => getCoreactTasksList({
      operatorId,
      includeActions: true,
      dateFrom,
      dateTo
    }),
    enabled: !!operatorId && !!date,
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TasksCreateInput) => postCoreactTasksCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "tasks"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TasksUpdateInput) => postCoreactTasksUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "tasks"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TasksDeleteInput) => postCoreactTasksDelete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "teamMembers"] });
    },
  });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ["coreact", "teamMembers"],
    queryFn: () => getCoreactTeamList(),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TeamCreateInput) => postCoreactTeamCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "teamMembers"] });
    },
  });
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TeamUpdateInput) => postCoreactTeamUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "teamMembers"] });
    },
  });
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TeamDeleteInput) => postCoreactTeamDelete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "teamMembers"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "tasks"] });
    },
  });
}

export function useBudgetItems(filters: BudgetListInput = {}) {
  return useQuery({
    queryKey: ["coreact", "budgetItems", filters],
    queryFn: () => getCoreactBudgetList(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateBudgetItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BudgetCreateInput) => postCoreactBudgetCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "budgetItems"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "projects"] });
    },
  });
}

export function useUpdateBudgetItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BudgetUpdateInput) => postCoreactBudgetUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "budgetItems"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "projects"] });
    },
  });
}

export function useDeleteBudgetItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BudgetDeleteInput) => postCoreactBudgetDelete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "budgetItems"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "projects"] });
    },
  });
}

export function useAllActivities() {
  return useQuery({
    queryKey: ["coreact", "activities", "all"],
    queryFn: () => getCoreactActivityList({ limit: 20 }),
    placeholderData: (previousData) => previousData,
  });
}

export {
  useCoreactActivities,
  useCoreactTaskActions,
  useCreateTaskAction,
  useUpdateTaskAction,
  useCoreactTaskParticipants,
  useCreateTaskParticipant,
  useDeleteTaskParticipant,
  useBatchCreateTasks,
  useCoreactProjectReport
} from './useCoreactTaskQueries';

export { 
  useCreateProject, 
  useUpdateProject, 
  useDeleteProject 
} from './useProjectMutations';

export {
  useInitiatives,
  useCreateInitiative,
  useUpdateInitiative,
  useDeleteInitiative,
  useStages,
  useCreateStage,
  useUpdateStage,
  useDeleteStage,
  useDependencies,
  useCreateDependency,
  useDeleteDependency,
  useExecutions,
  useCreateExecution,
  useUpdateExecution,
} from './useCoreactHierarchyHooks';

export { useBatchImport } from './useBatchImport';

export {
  useSectors,
  useCreateSector,
  useUpdateSector,
  useDeleteSector,
} from './useSectors';

export {
  useCoreactTeams,
  useCreateCoreactTeam,
  useUpdateCoreactTeam,
  useDeleteCoreactTeam,
} from './useCoreactTeams';

export {
  useCoreactTeamGroupMembers,
  useCreateCoreactTeamGroupMember,
  useDeleteCoreactTeamGroupMember,
} from './useCoreactTeamGroupMembers';

export {
  useModules,
  useCreateModule,
  useDeleteModule,
  useApplyModule,
} from './useModulesApi';

export {
  usePlanningBases,
  useCreatePlanningBase,
  useDeletePlanningBase,
  useActivatePlanningBase,
} from './usePlanningBasesApi';