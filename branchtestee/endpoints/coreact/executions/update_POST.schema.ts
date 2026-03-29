import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { Executions, ExecutionStatusArrayValues } from "../../../helpers/schema";

export const schema = z.object({
  id: z.string(),
  endedAt: z.date().optional().nullable(),
  durationMinutes: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(ExecutionStatusArrayValues).optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  execution: Selectable<Executions>;
};

export const postCoreactExecutionsUpdate = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/executions/update`, {
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