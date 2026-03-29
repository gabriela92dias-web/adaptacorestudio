import { schema, OutputType } from "./delete_POST.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const deleted = await db
      .deleteFrom("taskParticipants")
      .where("id", "=", input.id)
      .returningAll()
      .executeTakeFirst();

    if (!deleted) {
      throw new Error("Participant not found");
    }

    return new Response(
      superjson.stringify({ success: true, deletedId: deleted.id } satisfies OutputType)
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}