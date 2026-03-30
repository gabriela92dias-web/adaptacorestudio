import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getCoreactInitiativesList, InputType as InitiativeListInput } from "../endpoints/coreact/initiatives/list_GET.schema";
import { postCoreactInitiativesCreate } from "../endpoints/coreact/initiatives/create_POST.schema";
import { postCoreactInitiativesUpdate } from "../endpoints/coreact/initiatives/update_POST.schema";
import { postCoreactInitiativesDelete } from "../endpoints/coreact/initiatives/delete_POST.schema";

import { getCoreactStagesList } from "../endpoints/coreact/stages/list_GET.schema";
import { postCoreactStagesCreate } from "../endpoints/coreact/stages/create_POST.schema";
import { postCoreactStagesUpdate } from "../endpoints/coreact/stages/update_POST.schema";
import { postCoreactStagesDelete } from "../endpoints/coreact/stages/delete_POST.schema";

import { getCoreactDependenciesList, InputType as DependencyListInput } from "../endpoints/coreact/dependencies/list_GET.schema";
import { postCoreactDependenciesCreate } from "../endpoints/coreact/dependencies/create_POST.schema";
import { postCoreactDependenciesDelete } from "../endpoints/coreact/dependencies/delete_POST.schema";

import { getCoreactExecutionsList, InputType as ExecutionListInput } from "../endpoints/coreact/executions/list_GET.schema";
import { postCoreactExecutionsCreate } from "../endpoints/coreact/executions/create_POST.schema";
import { postCoreactExecutionsUpdate } from "../endpoints/coreact/executions/update_POST.schema";

// --- INITIATIVES ---

export function useInitiatives(statusFilter?: InitiativeListInput["status"]) {
  return useQuery({
    queryKey: ["coreact", "initiatives", statusFilter],
    queryFn: () => getCoreactInitiativesList({ status: statusFilter }),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateInitiative() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactInitiativesCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "initiatives"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "activities"] });
    },
  });
}

export function useUpdateInitiative() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactInitiativesUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "initiatives"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "activities"] });
    },
  });
}

export function useDeleteInitiative() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactInitiativesDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "initiatives"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "activities"] });
    },
  });
}

// --- STAGES ---

export function useStages(projectId?: string) {
  return useQuery({
    queryKey: ["coreact", "stages", projectId],
    queryFn: () => getCoreactStagesList({ projectId }),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactStagesCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "stages"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "activities"] });
    },
  });
}

export function useUpdateStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactStagesUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "stages"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "activities"] });
    },
  });
}

export function useDeleteStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactStagesDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "stages"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "activities"] });
    },
  });
}

// --- DEPENDENCIES ---

export function useDependencies(filters?: DependencyListInput) {
  return useQuery({
    queryKey: ["coreact", "dependencies", filters],
    queryFn: () => getCoreactDependenciesList(filters || {}),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateDependency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactDependenciesCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "dependencies"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "activities"] });
    },
  });
}

export function useDeleteDependency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactDependenciesDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "dependencies"] });
    },
  });
}

// --- EXECUTIONS ---

export function useExecutions(filters?: ExecutionListInput) {
  return useQuery({
    queryKey: ["coreact", "executions", filters],
    queryFn: () => getCoreactExecutionsList(filters || {}),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateExecution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactExecutionsCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "executions"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "activities"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "tasks"] });
    },
  });
}

export function useUpdateExecution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactExecutionsUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "executions"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "activities"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "tasks"] });
    },
  });
}