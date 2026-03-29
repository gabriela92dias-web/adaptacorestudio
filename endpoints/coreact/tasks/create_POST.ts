import { schema, OutputType } from "./create_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";
import { nanoid } from "nanoid";
import { logActivity } from "../../../helpers/activityLogger";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const newTask = await db.insertInto("tasks")
      .values({
        id: nanoid(),
        projectId: input.projectId,
        name: input.name,
        assigneeId: input.assigneeId ?? null,
        status: input.status,
        priority: input.priority,
        startDate: input.startDate ?? null,
        endDate: input.endDate ?? null,
        progress: input.progress,
        assignedTeamId: input.assignedTeamId ?? null,
        stageId: input.stageId,
        shift: input.shift,
        createdAt: new Date()
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    logActivity({
      action: "created",
      entityId: newTask.id,
      entityType: "task",
      projectId: input.projectId,
      newValue: newTask.name,
    });

    return new Response(superjson.stringify({ task: newTask } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}