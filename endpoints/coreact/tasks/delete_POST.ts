import { schema, OutputType } from "./delete_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const deletedTask = await db.deleteFrom("tasks")
      .where("id", "=", input.id)
      .returningAll()
      .executeTakeFirst();

    if (!deletedTask) {
      return new Response(superjson.stringify({ error: "Task not found" }), { status: 404 });
    }

    return new Response(superjson.stringify({ success: true } satisfies OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}