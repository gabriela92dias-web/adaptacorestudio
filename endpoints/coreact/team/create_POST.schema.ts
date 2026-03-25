import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { TeamMembers, EmploymentTypeArrayValues } from "../../../helpers/schema";

export const schema = z.object({
  name: z.string().min(1),
  fullName: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  initials: z.string().optional().nullable(),
  capacityHours: z.number().default(40),
  employmentType: z.enum(EmploymentTypeArrayValues).default('clt'),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  teamMember: Selectable<TeamMembers>;
};

export const postCoreactTeamCreate = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/team/create`, {
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