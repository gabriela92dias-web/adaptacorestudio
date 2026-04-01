import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    const json = inputStr ? superjson.parse(inputStr) : {};
    const input = schema.parse(json);

    let query = db.selectFrom("taskDependencies")
      .innerJoin("tasks as t1", "taskDependencies.taskId", "t1.id")
      .innerJoin("tasks as t2", "taskDependencies.dependsOnTaskId", "t2.id")
      .select([
        "taskDependencies.id",
        "taskDependencies.taskId",
        "taskDependencies.dependsOnTaskId",
        "taskDependencies.dependencyType",
        "taskDependencies.createdAt",
        "t1.name as taskName",
        "t2.name as dependsOnTaskName",
        "t1.projectId as projectId"
      ]);

    if (input.projectId) {
      query = query.where("t1.projectId", "=", input.projectId);
    }
    
    if (input.taskId) {
      query = query.where((eb) => eb.or([
        eb("taskDependencies.taskId", "=", input.taskId as string),
        eb("taskDependencies.dependsOnTaskId", "=", input.taskId as string)
      ]));
    }

    const dependencies = await query.execute();

    return new Response(superjson.stringify({ dependencies } satisfies OutputType));
  } catch (error: any) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: error?.message || String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}