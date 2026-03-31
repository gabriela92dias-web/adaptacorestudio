import superjson from 'superjson';
import { camelizeKeys } from "../../../helpers/dataUtils.js";
import { supabase } from "../../../helpers/supabase.js";



export async function handle(request: Request) {
  try {
    const { data: sectors, error } = await supabase
      .from("sectors")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);

    return new Response(
      superjson.stringify({ sectors: camelizeKeys(sectors ?? []) }),
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