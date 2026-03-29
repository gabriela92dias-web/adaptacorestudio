import { z } from "zod";

export const schema = z.object({
  id: z.string().uuid(),
  ok: z.boolean(),
  artifact: z.string().nullable().optional(),
});

export type InputType = z.infer<typeof schema>;
export type OutputType = { success: boolean };
