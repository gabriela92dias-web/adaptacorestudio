import { schema, OutputType } from "./delete_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";
import { logActivity } from "../../../helpers/activityLogger";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const oldProject = await db.selectFrom("projects")
      .where("id", "=", input.id)
      .selectAll()
      .executeTakeFirst();

    if (!oldProject) {
      return new Response(superjson.stringify({ error: "Project not found" }), { status: 404 });
    }

    // Use a transaction to ensure all or nothing deletion
    await db.transaction().execute(async (trx) => {
      // Delete tasks associated with the project
      await trx.deleteFrom("tasks")
        .where("projectId", "=", input.id)
        .execute();

      // Delete budget items associated with the project
      await trx.deleteFrom("budgetItems")
        .where("projectId", "=", input.id)
        .execute();

      // Delete the project itself
      await trx.deleteFrom("projects")
        .where("id", "=", input.id)
        .execute();
    });

    logActivity({
      action: "deleted",
      entityId: input.id,
      entityType: "project",
      projectId: input.id,
      oldValue: oldProject.name,
    });

    return new Response(superjson.stringify({ success: true } satisfies OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}