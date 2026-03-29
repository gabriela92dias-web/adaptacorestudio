import { schema, OutputType } from "./seed_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

const DEFAULT_TEMPLATES = [
  { title: "Definir escopo", description: "", categoryKey: "general", sortOrder: 1 },
  { title: "Alocar responsáveis", description: "", categoryKey: "general", sortOrder: 2 },
  { title: "Concluir entrega", description: "", categoryKey: "general", sortOrder: 3 },
  { title: "Validar resultado", description: "", categoryKey: "general", sortOrder: 4 },
];

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    // Check if items already exist
    const existingItems = await db
      .selectFrom("taskChecklistItems")
      .where("taskId", "=", input.taskId)
      .orderBy("sortOrder", "asc")
      .selectAll()
      .execute();

    if (existingItems.length > 0) {
      return new Response(superjson.stringify({ checklistItems: existingItems } satisfies OutputType));
    }

    const now = new Date();
    
    // Using crypto.randomUUID() instead of nanoid per the guidelines preference for UUID
    const insertValues = DEFAULT_TEMPLATES.map((t) => ({
      id: crypto.randomUUID(),
      taskId: input.taskId,
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
      .insertInto("taskChecklistItems")
      .values(insertValues)
      .execute();

    // Fetch and return the newly created records
    const newItems = await db
      .selectFrom("taskChecklistItems")
      .where("taskId", "=", input.taskId)
      .orderBy("sortOrder", "asc")
      .selectAll()
      .execute();

    return new Response(superjson.stringify({ checklistItems: newItems } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}