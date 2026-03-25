import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCoreactTeamGroupsMembersList } from "../endpoints/coreact/team-groups/members/list_GET.schema";
import { postCoreactTeamGroupsMembersCreate } from "../endpoints/coreact/team-groups/members/create_POST.schema";
import { postCoreactTeamGroupsMembersDelete } from "../endpoints/coreact/team-groups/members/delete_POST.schema";
import { COREACT_TEAMS_QUERY_KEY } from "./useCoreactTeams";
import { COREACT_TEAMS_CONTEXTS_QUERY_KEY } from "./useCoreactTeamsContexts";

export const getCoreactTeamGroupMembersQueryKey = (teamId: string) => ["coreact", "team-groups", "members", teamId];

export function useCoreactTeamGroupMembers(teamId: string) {
  return useQuery({
    queryKey: getCoreactTeamGroupMembersQueryKey(teamId),
    queryFn: () => getCoreactTeamGroupsMembersList({ teamId }),
    enabled: !!teamId,
  });
}

export function useCreateCoreactTeamGroupMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactTeamGroupsMembersCreate,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getCoreactTeamGroupMembersQueryKey(variables.teamId) });
      queryClient.invalidateQueries({ queryKey: COREACT_TEAMS_QUERY_KEY }); // To update member lists shown in main team overview
      queryClient.invalidateQueries({ queryKey: COREACT_TEAMS_CONTEXTS_QUERY_KEY });
    },
  });
}

export function useDeleteCoreactTeamGroupMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactTeamGroupsMembersDelete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getCoreactTeamGroupMembersQueryKey(variables.teamId) });
      queryClient.invalidateQueries({ queryKey: COREACT_TEAMS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: COREACT_TEAMS_CONTEXTS_QUERY_KEY });
    },
  });
}