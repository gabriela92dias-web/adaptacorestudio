import { schema, OutputType } from "./delete_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";
import { logActivity } from "../../../helpers/activityLogger";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const oldStage = await db.selectFrom("projectStages")
      .selectAll()
      .where("id", "=", input.id)
      .executeTakeFirstOrThrow();

    await db.deleteFrom("projectStages")
      .where("id", "=", input.id)
      .execute();

    await logActivity({
      action: "deleted",
      entityId: input.id,
      entityType: "project_stage",
      projectId: oldStage.projectId,
      oldValue: oldStage.name,
    });

    return new Response(superjson.stringify({ success: true } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}