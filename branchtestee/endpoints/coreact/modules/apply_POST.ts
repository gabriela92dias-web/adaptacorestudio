import { schema, OutputType } from "./apply_POST.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";
import { nanoid } from "nanoid";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const project = await db
      .selectFrom("projects")
      .select(["id", "initiativeId"])
      .where("id", "=", input.projectId)
      .executeTakeFirstOrThrow();

    const moduleStages = await db
      .selectFrom("moduleStages")
      .selectAll()
      .where("moduleId", "=", input.moduleId)
      .execute();

    if (moduleStages.length === 0) {
      return new Response(
        superjson.stringify({ stagesCreated: 0, tasksCreated: 0 } satisfies OutputType)
      );
    }

    const stageIds = moduleStages.map((s) => s.id);
    const moduleTasks = await db
      .selectFrom("moduleTasks")
      .selectAll()
      .where("moduleStageId", "in", stageIds)
      .execute();

    const newStages: any[] = [];
    const newTasks: any[] = [];
    const stageIdMap = new Map<string, string>();
    const now = new Date();

    moduleStages.forEach((oldStage) => {
      const newStageId = nanoid();
      stageIdMap.set(oldStage.id, newStageId);
      newStages.push({
        id: newStageId,
        projectId: project.id,
        name: oldStage.name,
        description: oldStage.description,
        status: "pending",
        sortOrder: oldStage.sortOrder,
        createdAt: now,
        updatedAt: now,
      });
    });

    moduleTasks.forEach((oldTask) => {
      const mappedStageId = stageIdMap.get(oldTask.moduleStageId);
      if (mappedStageId) {
        newTasks.push({
          id: nanoid(),
          projectId: project.id,
          stageId: mappedStageId,
          name: oldTask.name,
          priority: oldTask.priority,
          status: "open",
          progress: 0,
          shift: "morning",
          createdAt: now,
          updatedAt: now,
        });
      }
    });

    await db.transaction().execute(async (trx) => {
      if (newStages.length > 0) {
        await trx.insertInto("projectStages").values(newStages).execute();
      }
      if (newTasks.length > 0) {
        await trx.insertInto("tasks").values(newTasks).execute();
      }
    });

    return new Response(
      superjson.stringify({
        stagesCreated: newStages.length,
        tasksCreated: newTasks.length,
      } satisfies OutputType)
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}