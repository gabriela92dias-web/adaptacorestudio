import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { Campaigns, CampaignStatusArrayValues, CampaignTypeArrayValues } from "../../helpers/schema";

export const schema = z.object({
  id: z.string(),
  name: z.string().optional(),
  type: z.enum(CampaignTypeArrayValues).optional(),
  duration: z.number().optional(),
  channels: z.array(z.string()).optional(),
  objective: z.string().optional().nullable(),
  targetAudience: z.string().optional().nullable(),
  status: z.enum(CampaignStatusArrayValues).optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  campaign: Selectable<Campaigns>;
};

export const postUpdateCampaign = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/campaigns/update`, {
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