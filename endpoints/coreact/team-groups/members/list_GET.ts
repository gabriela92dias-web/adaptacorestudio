import superjson from 'superjson';
import { camelizeKeys } from "../../../../helpers/dataUtils.js";
import { supabase } from "../../../helpers/supabase.js";



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
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}