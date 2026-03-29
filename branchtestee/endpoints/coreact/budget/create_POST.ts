import { schema, OutputType } from "./create_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";
import { nanoid } from "nanoid";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const newBudgetItem = await db.insertInto("budgetItems")
      .values({
        id: nanoid(),
        projectId: input.projectId,
        category: input.category,
        description: input.description ?? null,
        vendor: input.vendor ?? null,
        predictedAmount: input.predictedAmount ?? null,
        contractedAmount: input.contractedAmount ?? null,
        paidAmount: input.paidAmount ?? null,
        status: input.status,
        dueDate: input.dueDate ?? null,
        createdAt: new Date()
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ budgetItem: newBudgetItem } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}