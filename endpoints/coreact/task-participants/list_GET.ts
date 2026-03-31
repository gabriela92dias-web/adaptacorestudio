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
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}