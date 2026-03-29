import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { TaskActions, TaskActionStatusArrayValues } from "../../../helpers/schema";

export const schema = z.object({
  id: z.string(),
  status: z.enum(TaskActionStatusArrayValues).optional(),
  assignedTo: z.string().optional().nullable(),
  title: z.string().optional(),
  description: z.string().optional().nullable(),
  completedAt: z.date().optional().nullable(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  taskAction: Selectable<TaskActions>;
};

export const postCoreactTaskActionsUpdate = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/task-actions/update`, {
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