import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCoreactSectorsList } from "../endpoints/coreact/sectors/list_GET.schema";
import { postCoreactSectorsCreate } from "../endpoints/coreact/sectors/create_POST.schema";
import { postCoreactSectorsUpdate } from "../endpoints/coreact/sectors/update_POST.schema";
import { postCoreactSectorsDelete } from "../endpoints/coreact/sectors/delete_POST.schema";

export const SECTORS_QUERY_KEY = ["coreact", "sectors"] as const;

export const useSectors = () => {
  return useQuery({
    queryKey: SECTORS_QUERY_KEY,
    queryFn: async () => {
      const res = await getCoreactSectorsList({});
      return res.sectors;
    },
  });
};

export const useCreateSector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactSectorsCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SECTORS_QUERY_KEY });
    },
  });
};

export const useUpdateSector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactSectorsUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SECTORS_QUERY_KEY });
    },
  });
};

export const useDeleteSector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactSectorsDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SECTORS_QUERY_KEY });
    },
  });
};