import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { TeamMembers, EmploymentTypeArrayValues } from "../../../helpers/schema";

export const schema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  fullName: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  initials: z.string().optional().nullable(),
  capacityHours: z.number().optional(),
  employmentType: z.enum(EmploymentTypeArrayValues).optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  teamMember: Selectable<TeamMembers>;
};

export const postCoreactTeamUpdate = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/team/update`, {
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