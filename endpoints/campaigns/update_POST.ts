import { schema, OutputType } from "./update_POST.schema";
import superjson from 'superjson';
import { db } from "../../helpers/db";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const { id, ...updateData } = schema.parse(json);

    if (Object.keys(updateData).length === 0) {
      const campaign = await db.selectFrom("campaigns").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
      return new Response(superjson.stringify({ campaign } satisfies OutputType));
    }

    const campaign = await db.updateTable("campaigns")
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ campaign } satisfies OutputType));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: message }), { status: 400 });
  }
}