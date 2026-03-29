import { schema, OutputType } from "./list_GET.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    const json = inputStr ? superjson.parse(inputStr) : {};
    const input = schema.parse(json);

    let query = db
      .selectFrom("taskActions")
      .leftJoin("teamMembers as reqTeam", "taskActions.requestedBy", "reqTeam.id")
      .leftJoin("teamMembers as assTeam", "taskActions.assignedTo", "assTeam.id")
      .leftJoin("teamMembers as opTeam", "taskActions.operatorId", "opTeam.id")
      .selectAll("taskActions")
      .select([
        "reqTeam.name as requestedByName",
        "reqTeam.initials as requestedByInitials",
        "assTeam.name as assignedToName",
        "assTeam.initials as assignedToInitials",
        "opTeam.name as operatorName",
        "opTeam.initials as operatorInitials",
      ])
      .orderBy("taskActions.createdAt", "asc");

    if (input.taskId) {
      query = query.where("taskActions.taskId", "=", input.taskId);
    }
    if (input.assignedTo) {
      query = query.where("taskActions.assignedTo", "=", input.assignedTo);
    }
    if (input.status) {
      query = query.where("taskActions.status", "=", input.status);
    }

    const taskActions = await query.execute();

    return new Response(
      superjson.stringify({ taskActions } satisfies OutputType)
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}