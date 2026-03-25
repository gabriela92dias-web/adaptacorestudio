import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { TaskDependencies, DependencyTypeArrayValues } from "../../../helpers/schema";

export const schema = z.object({
  taskId: z.string(),
  dependsOnTaskId: z.string(),
  dependencyType: z.enum(DependencyTypeArrayValues),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  dependency: Selectable<TaskDependencies>;
};

export const postCoreactDependenciesCreate = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/dependencies/create`, {
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