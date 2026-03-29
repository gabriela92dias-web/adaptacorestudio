import { schema, OutputType } from "./update_POST.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";
import { logActivity } from "../../../helpers/activityLogger";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    let completedAt = input.completedAt;
    if (input.status === "completed" && !completedAt) {
      completedAt = new Date();
    }

    const updatedAction = await db
      .updateTable("taskActions")
      .set({
        ...(input.status !== undefined && { status: input.status }),
        ...(input.assignedTo !== undefined && { assignedTo: input.assignedTo }),
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(completedAt !== undefined && { completedAt }),
        updatedAt: new Date(),
      })
      .where("id", "=", input.id)
      .returningAll()
      .executeTakeFirstOrThrow();

    if (input.status) {
      await logActivity({
        action: "status_changed",
        entityId: updatedAction.id,
        entityType: "task_action",
        fieldChanged: "status",
        newValue: input.status,
      });
    }

    return new Response(
      superjson.stringify({ taskAction: updatedAction } satisfies OutputType)
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}