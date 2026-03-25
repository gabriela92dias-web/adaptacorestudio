import { schema, OutputType } from "./delete_POST.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    await db.transaction().execute(async (trx) => {
      const stages = await trx
        .selectFrom("moduleStages")
        .select("id")
        .where("moduleId", "=", input.id)
        .execute();

      const stageIds = stages.map((s) => s.id);

      if (stageIds.length > 0) {
        await trx
          .deleteFrom("moduleTasks")
          .where("moduleStageId", "in", stageIds)
          .execute();
      }

      await trx
        .deleteFrom("moduleStages")
        .where("moduleId", "=", input.id)
        .execute();

      await trx
        .deleteFrom("modules")
        .where("id", "=", input.id)
        .execute();
    });

    return new Response(superjson.stringify({ success: true } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}