import { schema, OutputType } from "./delete_POST.schema";
import superjson from 'superjson';
import { db } from "../../helpers/db";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const { id } = schema.parse(json);

    await db.transaction().execute(async (trx) => {
      // Delete posts first due to FK constraints
      await trx.deleteFrom("campaignPosts")
        .where("campaignId", "=", id)
        .execute();

      await trx.deleteFrom("campaigns")
        .where("id", "=", id)
        .executeTakeFirstOrThrow();
    });

    return new Response(superjson.stringify({ success: true } satisfies OutputType));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: message }), { status: 400 });
  }
}