import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { TaskChecklistItems } from "../../../helpers/schema";

export const schema = z.object({
  taskId: z.string(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  checklistItems: Selectable<TaskChecklistItems>[];
};

export const postCoreactTaskChecklistSeed = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/task-checklist/seed`, {
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