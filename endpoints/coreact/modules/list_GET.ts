import { OutputType } from "./list_GET.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const modules = await db.selectFrom("modules").selectAll().execute();
    const stages = await db.selectFrom("moduleStages").selectAll().execute();
    const tasks = await db.selectFrom("moduleTasks").selectAll().execute();

    const modulesWithStages = modules.map((m) => {
      const moduleStages = stages
        .filter((s) => s.moduleId === m.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((s) => ({
          ...s,
          tasks: tasks
            .filter((t) => t.moduleStageId === s.id)
            .sort((a, b) => a.sortOrder - b.sortOrder),
        }));

      return {
        ...m,
        stages: moduleStages,
      };
    });

    return new Response(
      superjson.stringify({ modules: modulesWithStages } satisfies OutputType)
    );
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}