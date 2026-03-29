import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCoreactTeamsList } from "../endpoints/coreact/teams/list_GET.schema";
import { postCoreactTeamsCreate } from "../endpoints/coreact/teams/create_POST.schema";
import { postCoreactTeamsUpdate } from "../endpoints/coreact/teams/update_POST.schema";
import { postCoreactTeamsDelete } from "../endpoints/coreact/teams/delete_POST.schema";
import { COREACT_TEAMS_CONTEXTS_QUERY_KEY } from "./useCoreactTeamsContexts";

export const COREACT_TEAMS_QUERY_KEY = ["coreact", "teams"];

export function useCoreactTeams() {
  return useQuery({
    queryKey: COREACT_TEAMS_QUERY_KEY,
    queryFn: () => getCoreactTeamsList(),
  });
}

export function useCreateCoreactTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactTeamsCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COREACT_TEAMS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: COREACT_TEAMS_CONTEXTS_QUERY_KEY });
    },
  });
}

export function useUpdateCoreactTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactTeamsUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COREACT_TEAMS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: COREACT_TEAMS_CONTEXTS_QUERY_KEY });
    },
  });
}

export function useDeleteCoreactTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactTeamsDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COREACT_TEAMS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: COREACT_TEAMS_CONTEXTS_QUERY_KEY });
    },
  });
}