import { schema, OutputType } from "./create_POST.schema";
import superjson from 'superjson';
import { supabase } from "../../../helpers/supabase.js";
import { nanoid } from "nanoid";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const { data: newSector, error } = await supabase
      .from("sectors")
      .insert({
        id: nanoid(),
        name: input.name,
        description: input.description ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return new Response(superjson.stringify({ sector: newSector } satisfies OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact/sectors/create:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}