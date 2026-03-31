import { schema, OutputType } from "./create_POST.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";
import { nanoid } from "nanoid";
import { logActivity } from "../../../helpers/activityLogger";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const newAction = await db
      .insertInto("taskActions")
      .values({
        id: nanoid(),
        taskId: input.taskId,
        type: input.type,
        title: input.title,
        description: input.description ?? null,
        requestedBy: input.requestedBy ?? null,
        assignedTo: input.assignedTo ?? null,
        dueDate: input.dueDate ?? null,
        operatorId: input.operatorId ?? null,
        estimatedHours: input.estimatedHours != null ? String(input.estimatedHours) : null,
        status: "pending",
        createdAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    // Log the creation activity
    await logActivity({
      action: "created",
      entityId: newAction.id,
      entityType: "task_action",
      performedBy: input.requestedBy,
      metadata: { title: newAction.title, taskId: newAction.taskId },
    });

    return new Response(
      superjson.stringify({ taskAction: newAction } satisfies OutputType)
    );
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}