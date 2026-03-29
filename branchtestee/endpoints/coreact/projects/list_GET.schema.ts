import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { Projects, Tasks } from "../../../helpers/schema";


export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type ProjectTaskWithAssignee = Selectable<Tasks> & {
  assigneeName?: string | null;
  assigneeInitials?: string | null;
};

export type ProjectWithTasks = Selectable<Projects> & {
  tasks: ProjectTaskWithAssignee[];
  ownerName: string | null;
  initiativeName: string | null;
};

export type OutputType = {
  projects: ProjectWithTasks[];
};

export const getCoreactProjectsList = async (init?: RequestInit): Promise<OutputType> => {
  const result = await fetch(`/_api/coreact/projects/list`, {
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