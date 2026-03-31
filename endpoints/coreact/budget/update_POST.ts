import { schema, OutputType } from "./update_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const { id, ...updates } = input;

    if (Object.keys(updates).length === 0) {
      return new Response(superjson.stringify({ error: "No fields to update" }), { status: 400 });
    }

    const updatedBudgetItem = await db.updateTable("budgetItems")
      .set(updates)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    if (!updatedBudgetItem) {
      return new Response(superjson.stringify({ error: "Budget item not found" }), { status: 404 });
    }

    return new Response(superjson.stringify({ budgetItem: updatedBudgetItem } satisfies OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}