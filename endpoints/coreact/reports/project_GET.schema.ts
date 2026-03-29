import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Projects, Tasks, TeamMembers, ActivityLogs } from "../../../helpers/schema";

export const schema = z.object({
  projectId: z.string(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  project: Selectable<Projects>;
  tasks: Array<Selectable<Tasks> & { assigneeName?: string | null }>;
  budget: {
    predictedTotal: number;
    contractedTotal: number;
    paidTotal: number;
  };
  teamMembers: Array<Selectable<TeamMembers>>;
  taskStatusBreakdown: Record<string, number>;
  recentActivities: Array<Selectable<ActivityLogs> & { performerName?: string | null }>;
};

export const getCoreactReportsProject = async (
  input: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(input);
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const url = new URL(`/_api/coreact/reports/project`, baseUrl);
  url.searchParams.set("input", superjson.stringify(validatedInput));

  const result = await fetch(url.toString(), {
    method: "GET",
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse<{ error: string }>(await result.text());
    throw new Error(errorObject.error);
  }
  return superjson.parse<OutputType>(await result.text());
};