import { schema, OutputType } from "./update_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const { id, ...updates } = input;

    if (Object.keys(updates).length === 0) {
      return new Response(superjson.stringify({ error: "No fields to update" }), { status: 400 });
    }

    const updatedMember = await db.updateTable("teamMembers")
      .set(updates)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    if (!updatedMember) {
      return new Response(superjson.stringify({ error: "Team member not found" }), { status: 404 });
    }

    return new Response(superjson.stringify({ teamMember: updatedMember } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}