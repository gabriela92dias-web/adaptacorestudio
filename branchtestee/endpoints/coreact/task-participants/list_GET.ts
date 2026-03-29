import { schema, OutputType } from "./list_GET.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    const json = inputStr ? superjson.parse(inputStr) : {};
    const input = schema.parse(json);

    const taskParticipants = await db
      .selectFrom("taskParticipants")
      .leftJoin("teamMembers", "taskParticipants.memberId", "teamMembers.id")
      .where("taskParticipants.taskId", "=", input.taskId)
      .selectAll("taskParticipants")
      .select([
        "teamMembers.name as memberName",
        "teamMembers.initials as memberInitials",
      ])
      .execute();

    return new Response(
      superjson.stringify({ taskParticipants } satisfies OutputType)
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}