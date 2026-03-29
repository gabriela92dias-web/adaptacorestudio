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

    const oldSector = await db.selectFrom("sectors")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirstOrThrow();

    const updatedSector = await db.updateTable("sectors")
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();

    for (const key of Object.keys(updateData) as (keyof typeof updateData)[]) {
      const oldVal = oldSector[key as keyof typeof oldSector];
      const newVal = updateData[key as keyof typeof updateData];

      if (oldVal === newVal) continue;

      await logActivity({
        action: "updated",
        entityId: id,
        entityType: "sector",
        fieldChanged: key,
        oldValue: oldVal != null ? String(oldVal) : null,
        newValue: newVal != null ? String(newVal) : null,
      });
    }

    return new Response(superjson.stringify({ sector: updatedSector } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}