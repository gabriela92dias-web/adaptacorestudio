import { useQuery } from "@tanstack/react-query";
import { getCoreactAgenda } from "../endpoints/coreact/agenda_GET.schema";

export const AGENDA_QUERY_KEY = ["coreact", "agenda"] as const;

export const useAgendaTasks = (month: number, year: number) => {
  return useQuery({
    queryKey: [...AGENDA_QUERY_KEY, month, year],
    queryFn: async () => {
      const res = await getCoreactAgenda({ month, year });
      return res;
    },
    // Keep data fresh for longer to avoid layout jumping on calendar nav
    staleTime: 5 * 60 * 1000,
  });
};