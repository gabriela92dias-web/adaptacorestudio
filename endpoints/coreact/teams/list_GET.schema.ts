import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { Teams } from "../../../helpers/schema";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type TeamMemberBasic = {
  id: string;
  name: string;
  initials: string | null;
};

export type TeamWithMembers = Selectable<Teams> & {
  sectorName: string | null;
  members: TeamMemberBasic[];
};

export type OutputType = {
  teams: TeamWithMembers[];
};

export const getCoreactTeamsList = async (init?: RequestInit): Promise<OutputType> => {
  const result = await fetch(`/_api/coreact/teams/list`, {
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