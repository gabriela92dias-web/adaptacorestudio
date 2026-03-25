import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { PlanningBases, PlanningBaseItems } from "../../../helpers/schema";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type PlanningBaseWithItems = Selectable<PlanningBases> & {
  items: Selectable<PlanningBaseItems>[];
};

export type OutputType = {
  planningBases: PlanningBaseWithItems[];
};

export const getCoreactPlanningBasesList = async (
  init?: RequestInit
): Promise<OutputType> => {
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const url = new URL(`/_api/coreact/planning-bases/list`, baseUrl);

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