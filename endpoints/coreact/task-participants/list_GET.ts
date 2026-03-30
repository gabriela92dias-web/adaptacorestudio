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
      .from("task_participants")
      .select("*, team_members(id, name, initials)")
      .order("created_at", { ascending: false });

    if (taskId) query = (query as any).eq("task_id", taskId);

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);

    const mapped = (rows ?? []).map((r: any) => ({
      ...camelizeKeys(r),
      memberName: r.team_members?.name ?? null,
      memberInitials: r.team_members?.initials ?? null,
    }));

    return new Response(
      superjson.stringify({ taskParticipants: mapped }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}