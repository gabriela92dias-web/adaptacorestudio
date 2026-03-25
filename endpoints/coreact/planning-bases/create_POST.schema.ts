import { z } from "zod";
import superjson from "superjson";
import { PlanningBaseTypeArrayValues } from "../../../helpers/schema";

export const schema = z.object({
  name: z.string().min(1, "Nome da base é obrigatório"),
  description: z.string().optional().nullable(),
  type: z.enum(PlanningBaseTypeArrayValues),
  items: z.array(
    z.object({
      name: z.string().min(1, "Nome do item é obrigatório"),
      description: z.string().optional().nullable(),
      projectIdea: z.string().optional().nullable(),
    })
  ),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  id: string;
};

export const postCoreactPlanningBasesCreate = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/planning-bases/create`, {
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