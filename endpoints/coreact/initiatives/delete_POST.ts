import { schema, OutputType } from "./delete_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";
import { logActivity } from "../../../helpers/activityLogger";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const oldInitiative = await db.selectFrom("initiatives")
      .selectAll()
      .where("id", "=", input.id)
      .executeTakeFirstOrThrow();

    await db.deleteFrom("initiatives")
      .where("id", "=", input.id)
      .execute();

    await logActivity({
      action: "deleted",
      entityId: input.id,
      entityType: "initiative",
      oldValue: oldInitiative.name,
    });

    return new Response(superjson.stringify({ success: true } satisfies OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}