import { z } from "zod";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export interface OutputType {
  campaigns: any[]; // we'll use raw kysely objects
}
