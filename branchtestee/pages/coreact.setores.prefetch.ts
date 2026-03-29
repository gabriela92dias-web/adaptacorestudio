import type { PagePrefetchFn } from "@floot/prefetch";
import { getCoreactSectorsList } from "../endpoints/coreact/sectors/list_GET.schema";

export const prefetch: PagePrefetchFn = async (ctx) => {
  const { qc } = ctx;
  await qc.prefetchQuery({
    queryKey: ["coreact", "sectors"],
    queryFn: async () => {
      const res = await getCoreactSectorsList({});
      return res.sectors;
    },
  });
};