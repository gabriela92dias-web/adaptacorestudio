import { schema, OutputType } from "./create_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";
import { nanoid } from "nanoid";
import { logActivity } from "../../../helpers/activityLogger";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const task = await db.selectFrom("tasks").select("projectId").where("id", "=", input.taskId).executeTakeFirstOrThrow();

    const newDependency = await db.insertInto("taskDependencies")
      .values({
        id: nanoid(),
        taskId: input.taskId,
        dependsOnTaskId: input.dependsOnTaskId,
        dependencyType: input.dependencyType,
        createdAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    await logActivity({
      action: "created",
      entityId: newDependency.id,
      entityType: "task_dependency",
      projectId: task.projectId,
      metadata: { taskId: input.taskId, dependsOnTaskId: input.dependsOnTaskId },
    });

    return new Response(superjson.stringify({ dependency: newDependency } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}