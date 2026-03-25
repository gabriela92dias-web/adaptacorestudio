import { z } from "zod";
import superjson from "superjson";

export const schema = z.object({
  entityType: z.enum(["teamMembers", "initiatives", "projects", "stages", "tasks", "hierarchical"]),
  rows: z.array(z.record(z.any())),
  defaultProjectId: z.string().optional(),
  defaultInitiativeId: z.string().optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  created: number;
  errors: string[];
};

export const postCoreactImportBatch = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/import/batch`, {
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