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
      .from("tasks")
      .select(`
        *,
        assignee:team_members!tasks_assignee_id_fkey ( id, name, initials ),
        project:projects ( id, name )
      `)
      .order("created_at", { ascending: false });

    if (projectId) query = (query as any).eq("project_id", projectId);

    const { data: tasks, error } = await query;
    if (error) throw new Error(error.message);

    const mapped = (tasks ?? []).map((t: any) => ({
      ...camelizeKeys(t),
      assigneeName: t.assignee?.name ?? null,
      assigneeInitials: t.assignee?.initials ?? null,
      projectName: t.project?.name ?? null,
    }));

    return new Response(
      superjson.stringify({ tasks: mapped }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}