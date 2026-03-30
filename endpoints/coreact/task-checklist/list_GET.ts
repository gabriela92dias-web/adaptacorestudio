import superjson from 'superjson';
import { supabase } from "../../../helpers/supabase.js";

function toCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
function camelizeKeys(obj: any): any {
  if (Array.isArray(obj)) return obj.map(camelizeKeys);
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [toCamel(k), camelizeKeys(v)]));
  }
  return obj;
}

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    let taskId: string | null = null;
    if (inputStr) {
      try { taskId = (superjson.parse(inputStr) as any)?.taskId ?? null; } catch {}
    }

    let query = supabase
      .from("task_checklist_items")
      .select("*")
      .order("created_at", { ascending: true });

    if (taskId) query = (query as any).eq("task_id", taskId);

    const { data: items, error } = await query;
    if (error) throw new Error(error.message);

    return new Response(
      superjson.stringify({ checklistItems: camelizeKeys(items ?? []) }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}