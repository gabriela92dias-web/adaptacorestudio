import { schema, OutputType } from "./update_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    let updateQuery = db.updateTable("teams").where("id", "=", input.id);

    if (input.name !== undefined) {
      updateQuery = updateQuery.set({ name: input.name });
    }
    if (input.sectorId !== undefined) {
      updateQuery = updateQuery.set({ sectorId: input.sectorId });
    }

    const updatedTeam = await updateQuery.returningAll().executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ team: updatedTeam } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}