import superjson from 'superjson';
import { camelizeKeys } from "../../../helpers/dataUtils.js";
import { supabase } from "../../../helpers/supabase.js";



export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    let projectId: string | null = null;
    if (inputStr) {
      try {
        const parsed = superjson.parse(inputStr);
        if (parsed !== null && typeof parsed === 'object' && 'projectId' in parsed) {
          const pId = (parsed as { projectId?: unknown }).projectId;
          if (typeof pId === 'string' && pId.trim() !== '') {
            projectId = pId;
          }
        }
      } catch (error: unknown) {
        console.warn("Invalid input payload in map/stages/list_GET:", error);
      }
    }

    let query = supabase
      .from("project_stages")
      .select(`
        *,
        project:projects ( id, name )
      `)
      .order("sort_order", { ascending: true });

    if (projectId) query = (query as any).eq("project_id", projectId);

    const { data: stages, error } = await query;
    if (error) throw new Error(error.message);

    return new Response(
      superjson.stringify({ stages: camelizeKeys(stages ?? []) }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact/stages/list_GET:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}