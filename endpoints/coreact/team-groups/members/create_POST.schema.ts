import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { TeamGroupMembers } from "../../../../helpers/schema";

export const schema = z.object({
  teamId: z.string().min(1),
  memberId: z.string().min(1),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  member: Selectable<TeamGroupMembers>;
};

export const postCoreactTeamGroupsMembersCreate = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/team-groups/members/create`, {
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