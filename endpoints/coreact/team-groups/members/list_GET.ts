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
    let teamId: string | null = null;
    if (inputStr) {
      try { teamId = (superjson.parse(inputStr) as any)?.teamId ?? null; } catch {}
    }

    let query = supabase
      .from("team_group_members")
      .select("*, team_members(id, name, initials, email, status)")
      .order("created_at", { ascending: false });

    if (teamId) query = (query as any).eq("team_id", teamId);

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);

    const mapped = (rows ?? []).map((r: any) => ({
      ...camelizeKeys(r),
      memberName: r.team_members?.name ?? null,
      memberInitials: r.team_members?.initials ?? null,
      memberEmail: r.team_members?.email ?? null,
      memberStatus: r.team_members?.status ?? null,
    }));

    return new Response(
      superjson.stringify({ members: mapped }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}