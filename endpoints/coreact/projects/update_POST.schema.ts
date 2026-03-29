import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { Projects, ProjectStatusArrayValues, ProjectCategoryArrayValues, TaskPriorityArrayValues } from "../../../helpers/schema";

export const schema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  startDate: z.date().optional(),
  endDate: z.date().optional().nullable(),
  budget: z.number().optional().nullable(),
  status: z.enum(ProjectStatusArrayValues).optional(),
  category: z.enum(ProjectCategoryArrayValues).optional(),
  assignedTeamId: z.string().optional().nullable(),
  ownerId: z.string().optional().nullable(),
  priority: z.enum(TaskPriorityArrayValues).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  initiativeId: z.string().optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  project: Selectable<Projects>;
};

export const postCoreactProjectsUpdate = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/projects/update`, {
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