import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCoreactSectorMembersList } from "../endpoints/coreact/sector-members/list_GET.schema";
import { postCoreactSectorMembersCreate } from "../endpoints/coreact/sector-members/create_POST.schema";
import { postCoreactSectorMembersDelete } from "../endpoints/coreact/sector-members/delete_POST.schema";
import { getCoreactMyRole } from "../endpoints/coreact/my-role_GET.schema";

export const SECTOR_MEMBERS_QUERY_KEY = ["coreact", "sectorMembers"] as const;
export const MY_ROLE_QUERY_KEY = ["coreact", "myRole"] as const;

export const useSectorMembers = (sectorId?: string) => {
  return useQuery({
    queryKey: [...SECTOR_MEMBERS_QUERY_KEY, sectorId],
    queryFn: async () => {
      const res = await getCoreactSectorMembersList({ sectorId });
      return res.sectorMembers;
    },
  });
};

export const useCreateSectorMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactSectorMembersCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SECTOR_MEMBERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["coreact", "teamMembers"] });
    },
  });
};

export const useDeleteSectorMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactSectorMembersDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SECTOR_MEMBERS_QUERY_KEY });
    },
  });
};

export const useMyRole = () => {
  return useQuery({
    queryKey: MY_ROLE_QUERY_KEY,
    queryFn: async () => {
      return await getCoreactMyRole({});
    },
    staleTime: Infinity,
  });
};