import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { db } from "../../../../helpers/db";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    const json = inputStr ? superjson.parse(inputStr) : {};
    const input = schema.parse(json);

    const members = await db
      .selectFrom("teamGroupMembers")
      .innerJoin("teamMembers", "teamGroupMembers.memberId", "teamMembers.id")
      .where("teamGroupMembers.teamId", "=", input.teamId)
      .selectAll("teamGroupMembers")
      .select([
        "teamMembers.name",
        "teamMembers.initials",
        "teamMembers.role",
        "teamMembers.employmentType",
      ])
      .orderBy("teamMembers.name", "asc")
      .execute();

    return new Response(superjson.stringify({ members } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}