import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { supabase } from "../../../helpers/supabase.js";

function camelizeKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => camelizeKeys(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/([-_][a-z])/ig, ($1) => {
        return $1.toUpperCase()
          .replace('-', '')
          .replace('_', '');
      });
      result[camelKey] = camelizeKeys(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

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
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}