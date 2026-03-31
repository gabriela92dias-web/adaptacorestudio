import { schema, OutputType } from "./create_POST.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";
import { nanoid } from "nanoid";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const baseId = nanoid();
    const now = new Date();

    const itemsToInsert = input.items.map((item, index) => ({
      id: nanoid(),
      planningBaseId: baseId,
      name: item.name,
      description: item.description ?? null,
      projectIdea: item.projectIdea ?? null,
      sortOrder: index,
      createdAt: now,
    }));

    await db.transaction().execute(async (trx) => {
      await trx
        .insertInto("planningBases")
        .values({
          id: baseId,
          name: input.name,
          description: input.description ?? null,
          type: input.type,
          createdAt: now,
          updatedAt: now,
        })
        .execute();

      if (itemsToInsert.length > 0) {
        await trx.insertInto("planningBaseItems").values(itemsToInsert).execute();
      }
    });

    return new Response(superjson.stringify({ id: baseId } satisfies OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}