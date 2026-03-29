import { schema, OutputType } from "./create_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";
import { nanoid } from "nanoid";
import { logActivity } from "../../../helpers/activityLogger";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const newExecution = await db.insertInto("executions")
      .values({
        id: nanoid(),
        taskActionId: input.taskActionId,
        operatorId: input.operatorId,
        startedAt: input.startedAt,
        notes: input.notes ?? null,
        status: input.status,
        createdAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    await logActivity({
      action: "created",
      entityId: newExecution.id,
      entityType: "execution",
      performedBy: input.operatorId,
    });

    return new Response(superjson.stringify({ execution: newExecution } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}