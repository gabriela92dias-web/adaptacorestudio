import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { Initiatives, InitiativeStatusArrayValues, Projects } from "../../../helpers/schema";

export const schema = z.object({
  status: z.enum(InitiativeStatusArrayValues).optional().nullable(),
});

export type InputType = z.infer<typeof schema>;

export type InitiativeProjectSummary = {
  id: string;
  name: string;
  status: Selectable<Projects>["status"];
  priority: Selectable<Projects>["priority"];
  category: Selectable<Projects>["category"];
  startDate: Selectable<Projects>["startDate"];
  endDate: Selectable<Projects>["endDate"];
  ownerName: string | null;
  taskCount: number;
  completedTaskCount: number;
  progressPercent: number;
};

export type InitiativeWithDetails = Selectable<Initiatives> & {
  responsibleName?: string | null;
  responsibleInitials?: string | null;
  sectorName?: string | null;
  assignedTeamName?: string | null;
  solicitanteName?: string | null;
  projectCount: number;
  totalTasks: number;
  completedTasks: number;
  progressPercent: number;
  projects: InitiativeProjectSummary[];
};

export type OutputType = {
  initiatives: InitiativeWithDetails[];
};

export const getCoreactInitiativesList = async (input: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(input);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const url = new URL(`/_api/coreact/initiatives/list`, baseUrl);
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