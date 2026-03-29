import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { Executions } from "../../../helpers/schema";

export const schema = z.object({
  operatorId: z.string().optional().nullable(),
  taskActionId: z.string().optional().nullable(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
});

export type InputType = z.infer<typeof schema>;

export type ExecutionWithDetails = Selectable<Executions> & {
  actionTitle?: string;
  taskName?: string;
  projectName?: string | null;
  operatorName?: string | null;
};

export type OutputType = {
  executions: ExecutionWithDetails[];
};

export const getCoreactExecutionsList = async (input: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(input);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const url = new URL(`/_api/coreact/executions/list`, baseUrl);
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