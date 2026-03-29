import { schema, OutputType } from "./delete_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    await db.transaction().execute(async (trx) => {
      // Cascade delete members
      await trx
        .deleteFrom("teamGroupMembers")
        .where("teamId", "=", input.id)
        .execute();

      // Delete the team itself
      await trx
        .deleteFrom("teams")
        .where("id", "=", input.id)
        .executeTakeFirstOrThrow();
    });

    return new Response(superjson.stringify({ success: true } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}