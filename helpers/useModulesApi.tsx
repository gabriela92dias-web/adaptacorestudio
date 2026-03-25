import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCoreactModulesList } from "../endpoints/coreact/modules/list_GET.schema";
import {
  postCoreactModulesCreate,
  InputType as CreateModuleInput,
} from "../endpoints/coreact/modules/create_POST.schema";
import {
  postCoreactModulesDelete,
  InputType as DeleteModuleInput,
} from "../endpoints/coreact/modules/delete_POST.schema";
import {
  postCoreactModulesApply,
  InputType as ApplyModuleInput,
} from "../endpoints/coreact/modules/apply_POST.schema";

export function useModules() {
  return useQuery({
    queryKey: ["coreact", "modules"],
    queryFn: () => getCoreactModulesList(),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateModuleInput) => postCoreactModulesCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "modules"] });
    },
  });
}

export function useDeleteModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteModuleInput) => postCoreactModulesDelete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "modules"] });
    },
  });
}

export function useApplyModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ApplyModuleInput) => postCoreactModulesApply(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "modules"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "stages"] });
    },
  });
}