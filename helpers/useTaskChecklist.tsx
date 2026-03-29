import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCoreactTaskChecklistList, InputType as ListInput } from "../endpoints/coreact/task-checklist/list_GET.schema";
import { postCoreactTaskChecklistToggle, InputType as ToggleInput } from "../endpoints/coreact/task-checklist/toggle_POST.schema";
import { postCoreactTaskChecklistSeed, InputType as SeedInput } from "../endpoints/coreact/task-checklist/seed_POST.schema";

export const TASK_CHECKLIST_QUERY_KEY = "taskChecklist";

export function useTaskChecklist(taskId: string) {
  return useQuery({
    queryKey: [TASK_CHECKLIST_QUERY_KEY, taskId],
    queryFn: () => getCoreactTaskChecklistList({ taskId }),
    enabled: !!taskId,
  });
}

export function useToggleTaskChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ToggleInput) => postCoreactTaskChecklistToggle(input),
    onSuccess: (data) => {
      // Invalidate the specific task's checklist list
      queryClient.invalidateQueries({ queryKey: [TASK_CHECKLIST_QUERY_KEY, data.checklistItem.taskId] });
    },
  });
}

export function useSeedTaskChecklist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SeedInput) => postCoreactTaskChecklistSeed(input),
    onSuccess: (data, variables) => {
      // Invalidate to refresh the cache with the seeded items
      queryClient.invalidateQueries({ queryKey: [TASK_CHECKLIST_QUERY_KEY, variables.taskId] });
      // Optimistically set data
      queryClient.setQueryData([TASK_CHECKLIST_QUERY_KEY, variables.taskId], { checklistItems: data.checklistItems });
    },
  });
}