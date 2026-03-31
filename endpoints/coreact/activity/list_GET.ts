import superjson from 'superjson';
import { camelizeKeys } from "../../../helpers/dataUtils.js";
import { supabase } from "../../../helpers/supabase.js";



export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    let projectId: string | null = null;
    if (inputStr) {
      try { projectId = (superjson.parse(inputStr) as any)?.projectId ?? null; } catch {}
    }

    const { data: activity, error } = await supabase
      .from("activity_logs")
      .select("*, team_members(id, name, initials)")
      .eq(projectId ? "related_id" : "id", projectId ?? "")
      .order("created_at", { ascending: false })
      .limit(100);

    // If no projectId filter, get recent activity
    const { data: allActivity, error: aErr } = projectId
      ? { data: activity, error }
      : await supabase.from("activity_logs").select("*, team_members(id, name, initials)").order("created_at", { ascending: false }).limit(50);

    const finalError = projectId ? error : aErr;
    if (finalError) throw new Error(finalError.message);

    const mapped = (allActivity ?? []).map((a: any) => ({
      ...camelizeKeys(a),
      memberName: a.team_members?.name ?? null,
      memberInitials: a.team_members?.initials ?? null,
    }));

    return new Response(
      superjson.stringify({ activityLogs: mapped }),
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