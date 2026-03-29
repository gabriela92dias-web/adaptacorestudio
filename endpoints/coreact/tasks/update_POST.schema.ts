import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { Tasks, TaskStatusArrayValues, TaskPriorityArrayValues, TaskShiftArrayValues } from "../../../helpers/schema";

export const schema = z.object({
  id: z.string(),
  name: z.string().optional(),
  assigneeId: z.string().optional().nullable(),
  status: z.enum(TaskStatusArrayValues).optional(),
  priority: z.enum(TaskPriorityArrayValues).optional(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  progress: z.number().min(0).max(100).optional(),
  assignedTeamId: z.string().optional().nullable(),
  stageId: z.string().optional(),
  shift: z.enum(TaskShiftArrayValues).optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  task: Selectable<Tasks>;
};

export const postCoreactTasksUpdate = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/tasks/update`, {
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