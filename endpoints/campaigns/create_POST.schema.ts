import { z } from "zod";
import superjson from 'superjson';
import { CampaignStatusArrayValues, CampaignTypeArrayValues } from "../../helpers/schema";
import { CampaignWithPosts } from "./list_GET.schema";

export const schema = z.object({
  name: z.string().min(1),
  type: z.enum(CampaignTypeArrayValues),
  duration: z.number().default(30),
  channels: z.array(z.string()).default([]),
  objective: z.string().optional(),
  targetAudience: z.string().optional(),
  status: z.enum(CampaignStatusArrayValues).default("draft"),
  dna_direcao: z.string().optional().nullable(),
  dna_experiencia: z.string().optional().nullable(),
  dna_modulos: z.any().optional().nullable(),
  suggestedPosts: z.array(z.object({
    channel: z.string(),
    title: z.string(),
    content: z.string()
  })).optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  campaign: CampaignWithPosts;
};

export const postCreateCampaign = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/campaigns/create`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse<{ error: string }>(await result.text());
    throw new Error(errorObject.error);
  }
  return superjson.parse<OutputType>(await result.text());
};