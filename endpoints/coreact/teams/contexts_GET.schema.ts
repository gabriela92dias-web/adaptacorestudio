import { z } from "zod";
import superjson from 'superjson';

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type TeamContext = {
  entityType: "initiative" | "project" | "stage" | "task";
  entityId: string;
  entityName: string;
  parentId?: string | null;
  parentName?: string | null;
};

export type TeamWithContexts = {
  id: string;
  name: string;
  sectorId: string | null;
  sectorName: string | null;
  members: { id: string; name: string; initials: string | null }[];
  contexts: TeamContext[];
};

export type OutputType = {
  teams: TeamWithContexts[];
};

export const getCoreactTeamsContexts = async (init?: RequestInit): Promise<OutputType> => {
  const result = await fetch(`/_api/coreact/teams/contexts`, {
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