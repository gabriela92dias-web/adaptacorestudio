import { schema, OutputType } from "./seed_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";
import { projectChecklistTemplates } from "../../../helpers/projectChecklistTemplates";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    // Fetch the project to determine its category
    const project = await db
      .selectFrom("projects")
      .select("category")
      .where("id", "=", input.projectId)
      .executeTakeFirst();

    if (!project) {
      return new Response(superjson.stringify({ error: "Project not found" }), { status: 404 });
    }

    const category = project.category || "custom";

    // Check if items already exist
    const existingItems = await db
      .selectFrom("projectChecklistItems")
      .where("projectId", "=", input.projectId)
      .orderBy("sortOrder", "asc")
      .selectAll()
      .execute();

    if (existingItems.length > 0) {
      return new Response(superjson.stringify({ checklistItems: existingItems } satisfies OutputType));
    }

    // Load templates for this category
    const templates = projectChecklistTemplates[category] || projectChecklistTemplates.custom;

    if (!templates || templates.length === 0) {
      return new Response(superjson.stringify({ checklistItems: [] } satisfies OutputType));
    }

    const now = new Date();
    
    // Using crypto.randomUUID() instead of nanoid per the guidelines preference for UUID
    const insertValues = templates.map((t) => ({
      id: crypto.randomUUID(),
      projectId: input.projectId,
      title: t.title,
      description: t.description || null,
      categoryKey: t.categoryKey,
      sortOrder: t.sortOrder,
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
    }));

    // Insert templates
    await db
      .insertInto("projectChecklistItems")
      .values(insertValues)
      .execute();

    // Fetch and return the newly created records
    const newItems = await db
      .selectFrom("projectChecklistItems")
      .where("projectId", "=", input.projectId)
      .orderBy("sortOrder", "asc")
      .selectAll()
      .execute();

    return new Response(superjson.stringify({ checklistItems: newItems } satisfies OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}