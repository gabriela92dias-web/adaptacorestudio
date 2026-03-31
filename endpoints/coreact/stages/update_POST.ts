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

    const oldStage = await db.selectFrom("projectStages")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirstOrThrow();

    const updatedStage = await db.updateTable("projectStages")
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();

    for (const key of Object.keys(updateData) as (keyof typeof updateData)[]) {
      const oldVal = oldStage[key];
      const newVal = updateData[key];

      if (oldVal === newVal) continue;

      const action = key === "status" ? "status_changed" : "updated";

      await logActivity({
        action,
        entityId: id,
        entityType: "project_stage",
        projectId: oldStage.projectId,
        fieldChanged: key,
        oldValue: oldVal != null ? String(oldVal) : null,
        newValue: newVal != null ? String(newVal) : null,
      });
    }

    return new Response(superjson.stringify({ stage: updatedStage } satisfies OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}