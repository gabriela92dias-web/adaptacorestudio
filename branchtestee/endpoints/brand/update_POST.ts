import { schema, OutputType } from "./update_POST.schema";
import superjson from 'superjson';
import { db } from "../../helpers/db";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    // We only have one brand config logically, usually id=1
    let brand = await db.selectFrom("brands").selectAll().limit(1).executeTakeFirst();
    
    if (brand) {
      brand = await db.updateTable("brands")
        .set({
          ...input,
          updatedAt: new Date()
        })
        .where("id", "=", brand.id)
        .returningAll()
        .executeTakeFirstOrThrow();
    } else {
      // In case it's completely empty
      brand = await db.insertInto("brands")
        .values({
          companyName: input.companyName ?? "Minha Marca",
          ...input,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    }

    return new Response(superjson.stringify({ brand } satisfies OutputType));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: message }), { status: 400 });
  }
}