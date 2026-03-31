import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { camelizeKeys } from "../../../helpers/dataUtils.js";
import { supabase } from "../../../helpers/supabase.js";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    const json = inputStr ? superjson.parse(inputStr) : {};
    const input = schema.parse(json);

    let query = supabase
      .from("budget_items")
      .select(`
        *,
        projects ( name )
      `);

    if (input.projectId) {
      query = query.eq("project_id", input.projectId);
    }

    const { data: rawData, error } = await query;

    if (error) {
       throw error;
    }

    const budgetItems = (rawData || []).map(item => {
      const camelItem = camelizeKeys(item);
      camelItem.projectName = item.projects?.name || null;
      delete camelItem.projects;
      return camelItem;
    });

    return new Response(superjson.stringify({ budgetItems } satisfies OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}