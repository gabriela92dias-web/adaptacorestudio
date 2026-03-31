import { schema, OutputType } from "./delete_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";
import { logActivity } from "../../../helpers/activityLogger";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const dep = await db.selectFrom("taskDependencies")
      .selectAll()
      .where("id", "=", input.id)
      .executeTakeFirstOrThrow();

    const task = await db.selectFrom("tasks").select("projectId").where("id", "=", dep.taskId).executeTakeFirstOrThrow();

    await db.deleteFrom("taskDependencies")
      .where("id", "=", input.id)
      .execute();

    await logActivity({
      action: "deleted",
      entityId: input.id,
      entityType: "task_dependency",
      projectId: task.projectId,
    });

    return new Response(superjson.stringify({ success: true } satisfies OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}