import { schema, OutputType } from "./toggle_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const now = new Date();
    
    const updated = await db
      .updateTable("taskChecklistItems")
      .set({
        isCompleted: input.isCompleted,
        completedAt: input.isCompleted ? now : null,
        completedBy: input.isCompleted ? (input.completedBy || null) : null,
        updatedAt: now,
      })
      .where("id", "=", input.id)
      .returningAll()
      .executeTakeFirst();

    if (!updated) {
      return new Response(superjson.stringify({ error: "Task checklist item not found" }), { status: 404 });
    }

    return new Response(superjson.stringify({ checklistItem: updated } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}