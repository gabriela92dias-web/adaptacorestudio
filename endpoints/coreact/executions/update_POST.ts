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

    const oldExecution = await db.selectFrom("executions")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirstOrThrow();

    if (updateData.status === "completed" && updateData.endedAt && updateData.durationMinutes == null) {
      const diffMs = updateData.endedAt.getTime() - oldExecution.startedAt.getTime();
      updateData.durationMinutes = Math.max(0, Math.round(diffMs / 60000));
    }

    const updatedExecution = await db.updateTable("executions")
      .set({
        ...updateData,
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();

    for (const key of Object.keys(updateData) as (keyof typeof updateData)[]) {
      const oldVal = oldExecution[key];
      const newVal = updateData[key];

      if (oldVal === newVal) continue;

      const action = key === "status" ? "status_changed" : "updated";

      await logActivity({
        action,
        entityId: id,
        entityType: "execution",
        fieldChanged: key,
        oldValue: oldVal != null ? String(oldVal) : null,
        newValue: newVal != null ? String(newVal) : null,
      });
    }

    return new Response(superjson.stringify({ execution: updatedExecution } satisfies OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}