import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCoreactProjectsCreate, InputType as ProjectCreateInput } from "../endpoints/coreact/projects/create_POST.schema";
import { postCoreactProjectsUpdate, InputType as ProjectUpdateInput } from "../endpoints/coreact/projects/update_POST.schema";
import { postCoreactProjectsDelete, InputType as ProjectDeleteInput } from "../endpoints/coreact/projects/delete_POST.schema";

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectCreateInput) => postCoreactProjectsCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "activities"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectUpdateInput) => postCoreactProjectsUpdate(data),
        onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "initiatives"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "activities"] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectDeleteInput) => postCoreactProjectsDelete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "budgetItems"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "activities"] });
    },
  });
}