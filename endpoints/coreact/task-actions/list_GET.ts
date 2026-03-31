import superjson from 'superjson';
import { camelizeKeys } from "../../../helpers/dataUtils.js";
import { supabase } from "../../../helpers/supabase.js";



export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    let taskId: string | null = null;
    if (inputStr) {
      try { taskId = (superjson.parse(inputStr) as any)?.taskId ?? null; } catch {}
    }

    let query = supabase
      .from("task_actions")
      .select("*, team_members(id, name, initials)")
      .order("created_at", { ascending: false });

    if (taskId) query = (query as any).eq("task_id", taskId);

    const { data: actions, error } = await query;
    if (error) throw new Error(error.message);

    const mapped = (actions ?? []).map((a: any) => ({
      ...camelizeKeys(a),
      memberName: a.team_members?.name ?? null,
      memberInitials: a.team_members?.initials ?? null,
    }));

    return new Response(
      superjson.stringify({ taskActions: mapped }),
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