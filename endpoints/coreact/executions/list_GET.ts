import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    const json = inputStr ? superjson.parse(inputStr) : {};
    const input = schema.parse(json);

    let query = db.selectFrom("executions")
      .innerJoin("taskActions", "executions.taskActionId", "taskActions.id")
      .innerJoin("tasks", "taskActions.taskId", "tasks.id")
      .leftJoin("projects", "tasks.projectId", "projects.id")
      .leftJoin("teamMembers", "executions.operatorId", "teamMembers.id")
      .selectAll("executions")
      .select([
        "taskActions.title as actionTitle",
        "tasks.name as taskName",
        "projects.name as projectName",
        "teamMembers.name as operatorName"
      ])
      .orderBy("executions.startedAt", "desc");

    if (input.operatorId) {
      query = query.where("executions.operatorId", "=", input.operatorId);
    }
    if (input.taskActionId) {
      query = query.where("executions.taskActionId", "=", input.taskActionId);
    }
    if (input.startDate) {
      query = query.where("executions.startedAt", ">=", input.startDate);
    }
    if (input.endDate) {
      query = query.where("executions.startedAt", "<=", input.endDate);
    }

    const executions = await query.execute();

    return new Response(superjson.stringify({ executions } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}