import { schema, OutputType } from "./update_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";
import { logActivity } from "../../../helpers/activityLogger";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const { id, ...updateData } = input;

    if (Object.keys(updateData).length === 0) {
      throw new Error("No data provided to update.");
    }

    const oldTask = await db.selectFrom("tasks")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirstOrThrow();

    const updatedTask = await db.updateTable("tasks")
      .set({
        name: updateData.name,
        assigneeId: updateData.assigneeId,
        status: updateData.status,
        priority: updateData.priority,
        startDate: updateData.startDate,
        endDate: updateData.endDate,
        progress: updateData.progress,
        assignedTeamId: updateData.assignedTeamId,
        stageId: updateData.stageId,
        shift: updateData.shift,
        updatedAt: new Date(),
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();

    // Log activity for each changed field
    for (const key of Object.keys(updateData) as (keyof typeof updateData)[]) {
      const oldVal = oldTask[key];
      const newVal = updateData[key];

      // Skip if value didn't actually change
      if (oldVal === newVal) continue;

      const oldValueStr = oldVal != null ? String(oldVal) : null;
      const newValueStr = newVal != null ? String(newVal) : null;

      const action = key === "status" ? "status_changed" : "updated";

      logActivity({
        action,
        entityId: id,
        entityType: "task",
        projectId: oldTask.projectId,
        fieldChanged: key,
        oldValue: oldValueStr,
        newValue: newValueStr,
      });
    }

    return new Response(superjson.stringify({ task: updatedTask } satisfies OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}