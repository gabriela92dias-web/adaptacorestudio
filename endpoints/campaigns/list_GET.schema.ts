import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { Campaigns, CampaignPosts, CampaignStatusArrayValues, CampaignTypeArrayValues } from "../../helpers/schema";

export const schema = z.object({
  status: z.enum(CampaignStatusArrayValues).optional().nullable(),
  type: z.enum(CampaignTypeArrayValues).optional().nullable(),
});

export type InputType = z.infer<typeof schema>;

export type CampaignWithPosts = Selectable<Campaigns> & {
  posts: Selectable<CampaignPosts>[];
};

export type OutputType = {
  campaigns: CampaignWithPosts[];
};

export const getCampaignsList = async (input: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(input);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const url = new URL(`/_api/campaigns/list`, baseUrl);
  url.searchParams.set("input", superjson.stringify(validatedInput));

  const result = await fetch(url.toString(), {
    method: "GET",
    ...init,
    headers: {
      "Accept": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse<{ error: string }>(await result.text());
    throw new Error(errorObject.error);
  }
  return superjson.parse<OutputType>(await result.text());
};