import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { Teams } from "../../../helpers/schema";

export const schema = z.object({
  name: z.string().min(1),
  sectorId: z.string().optional().nullable(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  team: Selectable<Teams>;
};

export const postCoreactTeamsCreate = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/teams/create`, {
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