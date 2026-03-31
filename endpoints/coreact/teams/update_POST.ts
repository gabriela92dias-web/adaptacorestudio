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
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}