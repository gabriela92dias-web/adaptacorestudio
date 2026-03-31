import { schema, OutputType } from "./delete_POST.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    await db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom("planningBaseItems")
        .where("planningBaseId", "=", input.id)
        .execute();

      await trx
        .deleteFrom("planningBases")
        .where("id", "=", input.id)
        .execute();
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