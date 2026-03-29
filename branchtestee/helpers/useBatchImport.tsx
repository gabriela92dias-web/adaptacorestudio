import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postCoreactImportBatch,
  InputType,
} from "../endpoints/coreact/import/batch_POST.schema";

export function useBatchImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InputType) => postCoreactImportBatch(data),
    onSuccess: () => {
      // Invalidate all coreact queries to ensure the UI is fully synchronized
      queryClient.invalidateQueries({ queryKey: ["coreact"] });
    },
  });
}