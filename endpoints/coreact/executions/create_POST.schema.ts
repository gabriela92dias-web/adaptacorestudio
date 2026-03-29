import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { Executions, ExecutionStatusArrayValues } from "../../../helpers/schema";

export const schema = z.object({
  taskActionId: z.string(),
  operatorId: z.string(),
  startedAt: z.date(),
  notes: z.string().optional().nullable(),
  status: z.enum(ExecutionStatusArrayValues).default("in_progress"),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  execution: Selectable<Executions>;
};

export const postCoreactExecutionsCreate = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/executions/create`, {
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