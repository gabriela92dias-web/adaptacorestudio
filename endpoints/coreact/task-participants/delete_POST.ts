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
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}