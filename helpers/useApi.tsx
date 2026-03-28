import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBrand } from "../endpoints/brand_GET.schema";
import { postUpdateBrand, InputType as UpdateBrandInput } from "../endpoints/brand/update_POST.schema";
import { getCampaignsList, InputType as ListCampaignsInput } from "../endpoints/campaigns/list_GET.schema";
import { postCreateCampaign, InputType as CreateCampaignInput } from "../endpoints/campaigns/create_POST.schema";
import { postUpdateCampaign, InputType as UpdateCampaignInput } from "../endpoints/campaigns/update_POST.schema";
import { postDeleteCampaign, InputType as DeleteCampaignInput } from "../endpoints/campaigns/delete_POST.schema";
import { postGenerateBlueprint, InputType as GenerateBlueprintInput } from "../endpoints/assistant/generate_POST.schema";

export function useBrand() {
  return useQuery({
    queryKey: ["brand"],
    queryFn: () => getBrand(),
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBrandInput) => postUpdateBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brand"] });
    },
  });
}

export function useCampaigns(filters: ListCampaignsInput = {}) {
  return useQuery({
    queryKey: ["campaigns", filters],
    queryFn: () => getCampaignsList(filters),
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCampaignInput) => postCreateCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCampaignInput) => postUpdateCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteCampaignInput) => postDeleteCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useGenerateBlueprint() {
  return useMutation({
    mutationFn: (data: { magicInput: string; phase?: string; selectedScenario?: string; activeLevers?: any[] }) => postGenerateBlueprint(data as any),
  });
}