import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { TaskActions, TaskActionStatusArrayValues } from "../../../helpers/schema";

export const schema = z.object({
  taskId: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
  status: z.enum(TaskActionStatusArrayValues).optional().nullable(),
});

export type InputType = z.infer<typeof schema>;

export type TaskActionWithDetails = Selectable<TaskActions> & {
  requestedByName?: string | null;
  requestedByInitials?: string | null;
  assignedToName?: string | null;
  assignedToInitials?: string | null;
  operatorName?: string | null;
  operatorInitials?: string | null;
};

export type OutputType = {
  taskActions: TaskActionWithDetails[];
};

export const getCoreactTaskActionsList = async (
  input: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(input);
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const url = new URL(`/_api/coreact/task-actions/list`, baseUrl);
  url.searchParams.set("input", superjson.stringify(validatedInput));

  const result = await fetch(url.toString(), {
    method: "GET",
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse<{ error: string }>(await result.text());
    throw new Error(errorObject.error);
  }
  return superjson.parse<OutputType>(await result.text());
};