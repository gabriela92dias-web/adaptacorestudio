import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { Tasks, TaskActions, Executions, TaskStatusArrayValues } from "../../../helpers/schema";

export const schema = z.object({
  projectId: z.string().optional().nullable(),
  status: z.enum(TaskStatusArrayValues).optional().nullable(),
  includeActions: z.boolean().optional(),
  operatorId: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
});

export type InputType = z.infer<typeof schema>;

export type TaskWithDetails = Selectable<Tasks> & {
  projectName?: string | null;
  assigneeName?: string | null;
  assigneeInitials?: string | null;
  stageName?: string | null;
};

export type TaskActionWithExecutions = Selectable<TaskActions> & {
  executions: Selectable<Executions>[];
};

export type TaskWithActions = TaskWithDetails & {
  actions?: TaskActionWithExecutions[];
};

export type OutputType = {
  tasks: TaskWithActions[];
  totalTimeLogged?: number;
};

export const getCoreactTasksList = async (input: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(input);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const url = new URL(`/_api/coreact/tasks/list`, baseUrl);
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