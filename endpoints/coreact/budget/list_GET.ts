import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    const json = inputStr ? superjson.parse(inputStr) : {};
    const input = schema.parse(json);

    let query = db.selectFrom("budgetItems")
      .leftJoin("projects", "budgetItems.projectId", "projects.id")
      .selectAll("budgetItems")
      .select(["projects.name as projectName"]);

    if (input.projectId) {
      query = query.where("budgetItems.projectId", "=", input.projectId);
    }

    const budgetItems = await query.execute();

    return new Response(superjson.stringify({ budgetItems } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}