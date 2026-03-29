import { useQuery } from "@tanstack/react-query";
import { getCoreactTeamsContexts } from "../endpoints/coreact/teams/contexts_GET.schema";

export const COREACT_TEAMS_CONTEXTS_QUERY_KEY = ["coreact", "teams", "contexts"] as const;

export function useCoreactTeamsContexts() {
  return useQuery({
    queryKey: COREACT_TEAMS_CONTEXTS_QUERY_KEY,
    queryFn: () => getCoreactTeamsContexts(),
    placeholderData: (previousData) => previousData,
  });
}