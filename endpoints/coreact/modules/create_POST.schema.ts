import { z } from "zod";
import superjson from "superjson";
import { TaskPriorityArrayValues } from "../../../helpers/schema";

export const schema = z.object({
  name: z.string().min(1, "Nome do módulo é obrigatório"),
  description: z.string().optional().nullable(),
  stages: z.array(
    z.object({
      name: z.string().min(1, "Nome da etapa é obrigatório"),
      description: z.string().optional().nullable(),
      tasks: z.array(
        z.object({
          name: z.string().min(1, "Nome da tarefa é obrigatório"),
          description: z.string().optional().nullable(),
          priority: z.enum(TaskPriorityArrayValues).default("medium"),
        })
      ),
    })
  ),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  id: string;
};

export const postCoreactModulesCreate = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/modules/create`, {
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