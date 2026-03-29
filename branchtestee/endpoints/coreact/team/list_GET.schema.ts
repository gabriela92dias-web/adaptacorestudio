import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { TeamMembers } from "../../../helpers/schema";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type TeamMemberTask = {
  id: string;
  name: string;
  projectName?: string | null;
};

export type TeamMemberWithStats = Selectable<TeamMembers> & {
  totalAllocatedHours: number;
  taskCount: number;
  assignedTasks: TeamMemberTask[];
};

export type OutputType = {
  teamMembers: TeamMemberWithStats[];
};

export const getCoreactTeamList = async (init?: RequestInit): Promise<OutputType> => {
  const result = await fetch(`/_api/coreact/team/list`, {
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