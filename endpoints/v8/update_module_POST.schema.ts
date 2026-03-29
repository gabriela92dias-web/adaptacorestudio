import { z } from "zod";

export const schema = z.object({
  id: z.string().uuid(),
  owner: z.string().nullable().optional(),
  cost: z.number().nullable().optional(),
  dueDate: z.string().nullable().optional(), // Date in ISO string
  ok: z.boolean().nullable().optional(),
  status: z.string().nullable().optional(),
});

export type InputType = z.infer<typeof schema>;
export type OutputType = { success: boolean };
