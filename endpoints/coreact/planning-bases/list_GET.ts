import { OutputType } from "./list_GET.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const bases = await db.selectFrom("planningBases").selectAll().execute();
    const items = await db.selectFrom("planningBaseItems").selectAll().execute();

    const nestedBases = bases.map((base) => ({
      ...base,
      items: items
        .filter((item) => item.planningBaseId === base.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }));

    return new Response(
      superjson.stringify({ planningBases: nestedBases } satisfies OutputType)
    );
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}