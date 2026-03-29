import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { TaskDependencies } from "../../../helpers/schema";

export const schema = z.object({
  projectId: z.string().optional().nullable(),
  taskId: z.string().optional().nullable(),
});

export type InputType = z.infer<typeof schema>;

export type TaskDependencyWithDetails = Selectable<TaskDependencies> & {
  taskName: string;
  dependsOnTaskName: string;
  projectId: string;
};

export type OutputType = {
  dependencies: TaskDependencyWithDetails[];
};

export const getCoreactDependenciesList = async (input: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(input);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const url = new URL(`/_api/coreact/dependencies/list`, baseUrl);
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