import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Tasks, TaskStatusArrayValues, TaskPriorityArrayValues } from "../../helpers/schema";

export const schema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().int(),
});

export type InputType = z.infer<typeof schema>;

export type AgendaTaskDetail = {
  id: string;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  status: typeof TaskStatusArrayValues[number] | null;
  priority: typeof TaskPriorityArrayValues[number] | null;
  projectName: string | null;
  assigneeName: string | null;
};

export type OutputType = {
  tasks: AgendaTaskDetail[];
  teamMemberId: string | null;
};

export const getCoreactAgenda = async (input: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(input);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const url = new URL(`/_api/coreact/agenda`, baseUrl);
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