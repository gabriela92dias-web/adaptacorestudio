import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { ProjectChecklistItems } from "../../../helpers/schema";

export const schema = z.object({
  id: z.string(),
  isCompleted: z.boolean(),
  completedBy: z.string().optional().nullable(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  checklistItem: Selectable<ProjectChecklistItems>;
};

export const postCoreactChecklistToggle = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/checklist/toggle`, {
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