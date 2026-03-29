import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { Brands } from "../helpers/schema";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  brand: Selectable<Brands> | null;
};

export const getBrand = async (init?: RequestInit): Promise<OutputType> => {
  const result = await fetch(`/_api/brand`, {
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