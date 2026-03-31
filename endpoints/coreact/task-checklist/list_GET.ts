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
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}