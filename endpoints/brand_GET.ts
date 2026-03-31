import { OutputType } from "./brand_GET.schema";
import superjson from 'superjson';
import { supabase } from "../helpers/supabase.js";

export async function handle(request: Request) {
  try {
    const { data: brand, error } = await supabase
      .from("brands")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return new Response(superjson.stringify({ brand: brand ?? null } satisfies OutputType));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: message }), { status: 400 });
  }
}