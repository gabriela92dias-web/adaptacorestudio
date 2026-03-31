import { schema, OutputType } from "./activate_POST.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";
import { nanoid } from "nanoid";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const items = await db
      .selectFrom("planningBaseItems")
      .selectAll()
      .where("planningBaseId", "=", input.planningBaseId)
      .execute();

    if (items.length === 0) {
      return new Response(
        superjson.stringify({ initiativesCreated: 0, ids: [] } satisfies OutputType)
      );
    }

    const now = new Date();
    const initiativesToInsert = items.map((item) => ({
      id: nanoid(),
      name: input.namePrefix ? `${input.namePrefix} - ${item.name}` : item.name,
      description: item.description,
      status: "solicitada" as const,
      createdAt: now,
      updatedAt: now,
    }));

    await db.insertInto("initiatives").values(initiativesToInsert).execute();

    return new Response(
      superjson.stringify({
        initiativesCreated: initiativesToInsert.length,
        ids: initiativesToInsert.map((i) => i.id),
      } satisfies OutputType)
    );
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}