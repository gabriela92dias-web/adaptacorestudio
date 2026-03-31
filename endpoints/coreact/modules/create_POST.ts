import { schema, OutputType } from "./create_POST.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";
import { nanoid } from "nanoid";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const moduleId = nanoid();
    const now = new Date();

    const stagesToInsert: any[] = [];
    const tasksToInsert: any[] = [];

    input.stages.forEach((stage, stageIndex) => {
      const stageId = nanoid();
      stagesToInsert.push({
        id: stageId,
        moduleId,
        name: stage.name,
        description: stage.description ?? null,
        sortOrder: stageIndex,
        createdAt: now,
      });

      stage.tasks.forEach((task, taskIndex) => {
        tasksToInsert.push({
          id: nanoid(),
          moduleStageId: stageId,
          name: task.name,
          description: task.description ?? null,
          priority: task.priority,
          sortOrder: taskIndex,
          createdAt: now,
        });
      });
    });

    await db.transaction().execute(async (trx) => {
      await trx
        .insertInto("modules")
        .values({
          id: moduleId,
          name: input.name,
          description: input.description ?? null,
          createdAt: now,
          updatedAt: now,
        })
        .execute();

      if (stagesToInsert.length > 0) {
        await trx.insertInto("moduleStages").values(stagesToInsert).execute();
      }

      if (tasksToInsert.length > 0) {
        await trx.insertInto("moduleTasks").values(tasksToInsert).execute();
      }
    });

    return new Response(superjson.stringify({ id: moduleId } satisfies OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}