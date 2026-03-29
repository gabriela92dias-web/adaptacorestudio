import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCoreactPlanningBasesList } from "../endpoints/coreact/planning-bases/list_GET.schema";
import {
  postCoreactPlanningBasesCreate,
  InputType as CreatePlanningBaseInput,
} from "../endpoints/coreact/planning-bases/create_POST.schema";
import {
  postCoreactPlanningBasesDelete,
  InputType as DeletePlanningBaseInput,
} from "../endpoints/coreact/planning-bases/delete_POST.schema";
import {
  postCoreactPlanningBasesActivate,
  InputType as ActivatePlanningBaseInput,
} from "../endpoints/coreact/planning-bases/activate_POST.schema";

export function usePlanningBases() {
  return useQuery({
    queryKey: ["coreact", "planningBases"],
    queryFn: () => getCoreactPlanningBasesList(),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreatePlanningBase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePlanningBaseInput) =>
      postCoreactPlanningBasesCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "planningBases"] });
    },
  });
}

export function useDeletePlanningBase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeletePlanningBaseInput) =>
      postCoreactPlanningBasesDelete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "planningBases"] });
    },
  });
}

export function useActivatePlanningBase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ActivatePlanningBaseInput) =>
      postCoreactPlanningBasesActivate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "planningBases"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "initiatives"] });
    },
  });
}