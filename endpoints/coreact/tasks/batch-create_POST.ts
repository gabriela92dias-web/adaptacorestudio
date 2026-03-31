import { schema, OutputType } from "./batch-create_POST.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";
import { nanoid } from "nanoid";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    if (input.tasks.length === 0) {
      return new Response(superjson.stringify({ tasks: [] } satisfies OutputType));
    }

    const tasksToInsert = input.tasks.map((t) => ({
      id: nanoid(),
      projectId: input.projectId,
      stageId: t.stageId ?? input.stageId,
      name: t.name,
      assigneeId: t.assigneeId ?? null,
      priority: t.priority,
      status: t.status,
      progress: 0,
      createdAt: new Date(),
    }));

    const newTasks = await db
      .insertInto("tasks")
      .values(tasksToInsert)
      .returningAll()
      .execute();

    return new Response(
      superjson.stringify({ tasks: newTasks } satisfies OutputType)
    );
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}