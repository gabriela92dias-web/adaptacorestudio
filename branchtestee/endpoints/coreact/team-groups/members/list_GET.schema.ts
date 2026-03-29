import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { TeamGroupMembers, EmploymentType } from "../../../../helpers/schema";

export const schema = z.object({
  teamId: z.string().min(1),
});

export type InputType = z.infer<typeof schema>;

export type TeamGroupMemberDetail = Selectable<TeamGroupMembers> & {
  name: string;
  initials: string | null;
  role: string | null;
  employmentType: EmploymentType;
};

export type OutputType = {
  members: TeamGroupMemberDetail[];
};

export const getCoreactTeamGroupsMembersList = async (input: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(input);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const url = new URL(`/_api/coreact/team-groups/members/list`, baseUrl);
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