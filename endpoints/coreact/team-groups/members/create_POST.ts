import { schema, OutputType } from "./create_POST.schema";
import superjson from 'superjson';
import { db } from "../../../../helpers/db";
import { nanoid } from "nanoid";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    // Prevent duplicate entries
    const existing = await db
      .selectFrom("teamGroupMembers")
      .where("teamId", "=", input.teamId)
      .where("memberId", "=", input.memberId)
      .executeTakeFirst();

    if (existing) {
      throw new Error("Member is already in this team.");
    }

    const newMember = await db
      .insertInto("teamGroupMembers")
      .values({
        id: nanoid(),
        teamId: input.teamId,
        memberId: input.memberId,
        createdAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ member: newMember } satisfies OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}