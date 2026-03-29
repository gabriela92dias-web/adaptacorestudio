import { schema, OutputType } from "./create_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";
import { nanoid } from "nanoid";
import { logActivity } from "../../../helpers/activityLogger";
import { projectChecklistTemplates } from "../../../helpers/projectChecklistTemplates";
import { ProjectCategory } from "../../../helpers/schema";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const newProject = await db.insertInto("projects")
      .values({
        id: nanoid(),
        name: input.name,
        description: input.description ?? null,
        startDate: input.startDate,
        endDate: input.endDate ?? null,
        budget: input.budget ? String(input.budget) : null,
        status: input.status,
        category: input.category,
        assignedTeamId: input.assignedTeamId ?? null,
        ownerId: input.ownerId ?? null,
        priority: input.priority ?? null,
        tags: input.tags ?? null,
        initiativeId: input.initiativeId,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    // Seed checklist items for the project's category
    const category: ProjectCategory = newProject.category ?? "custom";
    const templates = projectChecklistTemplates[category] ?? projectChecklistTemplates["custom"];

    if (templates.length > 0) {
      const checklistItems = templates.map((template) => ({
        id: crypto.randomUUID(),
        projectId: newProject.id,
        title: template.title,
        description: template.description || null,
        categoryKey: template.categoryKey,
        sortOrder: template.sortOrder,
        isCompleted: false as const,
        completedAt: null,
        completedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await db.insertInto("projectChecklistItems")
        .values(checklistItems)
        .execute();

      console.log(`Seeded ${checklistItems.length} checklist items for project ${newProject.id} (category: ${category})`);
    }

    logActivity({
      action: "created",
      entityId: newProject.id,
      entityType: "project",
      projectId: newProject.id,
      newValue: newProject.name,
    });

    return new Response(superjson.stringify({ project: newProject } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}