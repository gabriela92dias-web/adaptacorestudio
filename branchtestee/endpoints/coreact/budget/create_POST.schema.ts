import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { BudgetItems, BudgetItemStatusArrayValues } from "../../../helpers/schema";

export const schema = z.object({
  projectId: z.string(),
  category: z.string().min(1),
  description: z.string().optional().nullable(),
  vendor: z.string().optional().nullable(),
  predictedAmount: z.number().optional().nullable(),
  contractedAmount: z.number().optional().nullable(),
  paidAmount: z.number().optional().nullable(),
  status: z.enum(BudgetItemStatusArrayValues).default("pending"),
  dueDate: z.date().optional().nullable(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  budgetItem: Selectable<BudgetItems>;
};

export const postCoreactBudgetCreate = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/budget/create`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse<{ error: string }>(await result.text());
    throw new Error(errorObject.error);
  }
  return superjson.parse<OutputType>(await result.text());
};