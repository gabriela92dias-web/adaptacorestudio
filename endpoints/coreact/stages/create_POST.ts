import { schema, OutputType } from "./create_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";
import { nanoid } from "nanoid";
import { logActivity } from "../../../helpers/activityLogger";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const newStage = await db.insertInto("projectStages")
      .values({
        id: nanoid(),
        projectId: input.projectId,
        name: input.name,
        description: input.description ?? null,
        assignedTeamId: input.assignedTeamId ?? null,
        sortOrder: input.sortOrder,
        status: input.status,
        startDate: input.startDate ?? null,
        endDate: input.endDate ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    await logActivity({
      action: "created",
      entityId: newStage.id,
      entityType: "project_stage",
      projectId: input.projectId,
      newValue: newStage.name,
    });

    return new Response(superjson.stringify({ stage: newStage } satisfies OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}