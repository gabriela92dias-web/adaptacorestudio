import { schema, OutputType } from "./delete_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const deletedBudgetItem = await db.deleteFrom("budgetItems")
      .where("id", "=", input.id)
      .returningAll()
      .executeTakeFirst();

    if (!deletedBudgetItem) {
      return new Response(superjson.stringify({ error: "Budget item not found" }), { status: 404 });
    }

    return new Response(superjson.stringify({ success: true } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}