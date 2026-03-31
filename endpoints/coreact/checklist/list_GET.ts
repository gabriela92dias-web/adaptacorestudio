import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    const json = inputStr ? superjson.parse(inputStr) : {};
    const input = schema.parse(json);

    const checklistItems = await db
      .selectFrom("projectChecklistItems")
      .where("projectId", "=", input.projectId)
      .orderBy("sortOrder", "asc")
      .selectAll()
      .execute();

    return new Response(superjson.stringify({ checklistItems } satisfies OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}