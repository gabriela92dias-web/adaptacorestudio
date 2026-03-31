import superjson from 'superjson';
import { camelizeKeys } from "../../../helpers/dataUtils.js";
import { supabase } from "../../../helpers/supabase.js";



export async function handle(request: Request) {
  try {
    const { data: teams, error } = await supabase
      .from("teams")
      .select("*, sectors(id, name)")
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    const mapped = (teams ?? []).map((t: any) => ({
      ...camelizeKeys(t),
      sectorName: t.sectors?.name ?? null,
    }));

    return new Response(
      superjson.stringify({ teams: mapped }),
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