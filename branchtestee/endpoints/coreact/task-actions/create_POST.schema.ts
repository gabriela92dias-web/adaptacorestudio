import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { TaskActions, TaskActionTypeArrayValues } from "../../../helpers/schema";

export const schema = z.object({
  taskId: z.string(),
  type: z.enum(TaskActionTypeArrayValues),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  requestedBy: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
  dueDate: z.date().optional().nullable(),
  operatorId: z.string().optional().nullable(),
  estimatedHours: z.number().optional().nullable(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  taskAction: Selectable<TaskActions>;
};

export const postCoreactTaskActionsCreate = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/task-actions/create`, {
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