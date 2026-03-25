import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCoreactSectorMembersUpdate } from "../endpoints/coreact/sector-members/update_POST.schema";
import { SECTOR_MEMBERS_QUERY_KEY, MY_ROLE_QUERY_KEY } from "./useSectorMembers";

export const useUpdateSectorMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: postCoreactSectorMembersUpdate,
    onSuccess: () => {
      // Invalidate the sector members list so the UI updates
      queryClient.invalidateQueries({ queryKey: SECTOR_MEMBERS_QUERY_KEY });
      // Invalidate the active user's role to refresh their own permissions
      queryClient.invalidateQueries({ queryKey: MY_ROLE_QUERY_KEY });
    },
  });
};