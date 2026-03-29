import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCoreactChecklistList, InputType as ListInput } from "../endpoints/coreact/checklist/list_GET.schema";
import { postCoreactChecklistToggle, InputType as ToggleInput } from "../endpoints/coreact/checklist/toggle_POST.schema";
import { postCoreactChecklistSeed, InputType as SeedInput } from "../endpoints/coreact/checklist/seed_POST.schema";

export const CHECKLIST_QUERY_KEY = "projectChecklist";

export function useProjectChecklist(projectId: string) {
  return useQuery({
    queryKey: [CHECKLIST_QUERY_KEY, projectId],
    queryFn: () => getCoreactChecklistList({ projectId }),
    enabled: !!projectId,
  });
}

export function useToggleChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ToggleInput) => postCoreactChecklistToggle(input),
    onSuccess: (data) => {
      // Invalidate the specific project's checklist list
      queryClient.invalidateQueries({ queryKey: [CHECKLIST_QUERY_KEY, data.checklistItem.projectId] });
    },
  });
}

export function useSeedProjectChecklist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SeedInput) => postCoreactChecklistSeed(input),
    onSuccess: (data, variables) => {
      // Invalidate to refresh the cache with the seeded items
      queryClient.invalidateQueries({ queryKey: [CHECKLIST_QUERY_KEY, variables.projectId] });
      // Optimistically set data
      queryClient.setQueryData([CHECKLIST_QUERY_KEY, variables.projectId], { checklistItems: data.checklistItems });
    },
  });
}