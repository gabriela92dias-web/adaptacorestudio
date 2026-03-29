import { schema, OutputType } from "./update_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";
import { logActivity } from "../../../helpers/activityLogger";
import { ActivityAction } from "../../../helpers/schema";

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

    const updates: Record<string, any> = {
      updatedAt: new Date()
    };

    if (input.name !== undefined) updates.name = input.name;
    if (input.description !== undefined) updates.description = input.description;
    if (input.startDate !== undefined) updates.startDate = input.startDate;
    if (input.endDate !== undefined) updates.endDate = input.endDate;
    if (input.budget !== undefined) updates.budget = input.budget !== null ? String(input.budget) : null;
    if (input.status !== undefined) updates.status = input.status;
    if (input.category !== undefined) updates.category = input.category;
    if (input.assignedTeamId !== undefined) updates.assignedTeamId = input.assignedTeamId;
    if (input.ownerId !== undefined) updates.ownerId = input.ownerId;
    if (input.priority !== undefined) updates.priority = input.priority;
    if (input.tags !== undefined) updates.tags = input.tags;
    if (input.initiativeId !== undefined) updates.initiativeId = input.initiativeId ?? null;

    const updatedProject = await db.updateTable("projects")
      .set(updates)
      .where("id", "=", input.id)
      .returningAll()
      .executeTakeFirstOrThrow();

    // Log each changed field
    const keysToCheck = ["name", "description", "startDate", "endDate", "budget", "status", "category", "assignedTeamId", "ownerId", "priority", "tags", "initiativeId"] as const;
    
    for (const key of keysToCheck) {
      if (input[key] !== undefined) {
        const oldVal = oldProject[key as keyof typeof oldProject];
        const newVal = updatedProject[key as keyof typeof updatedProject];
        
        // Simple comparison for strings, numbers, and dates
        const oldStr = oldVal instanceof Date ? oldVal.toISOString() : (oldVal !== null ? String(oldVal) : null);
        const newStr = newVal instanceof Date ? newVal.toISOString() : (newVal !== null ? String(newVal) : null);

        if (oldStr !== newStr) {
          const action: ActivityAction = key === "status" ? "status_changed" : "updated";
          logActivity({
            action,
            entityId: input.id,
            entityType: "project",
            projectId: input.id,
            fieldChanged: key,
            oldValue: oldStr,
            newValue: newStr,
          });
        }
      }
    }

    return new Response(superjson.stringify({ project: updatedProject } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}