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
    let projectId: string | null = null;
    if (inputStr) {
      try { projectId = (superjson.parse(inputStr) as any)?.projectId ?? null; } catch {}
    }

    let query = supabase
      .from("project_stages")
      .select(`
        *,
        project:projects ( id, name )
      `)
      .order("position", { ascending: true });

    if (projectId) query = (query as any).eq("project_id", projectId);

    const { data: stages, error } = await query;
    if (error) throw new Error(error.message);

    return new Response(
      superjson.stringify({ stages: camelizeKeys(stages ?? []) }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}