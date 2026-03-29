import { supabase } from "../../helpers/supabase.js";

export async function handle(request: Request) {
  try {
    const body = await request.json();
    const { id, ok, artifact } = body;

    if (id === undefined) throw new Error("id obrigatório");
    if (ok  === undefined) throw new Error("ok obrigatório");

    const values: Record<string, any> = { ok };
    if (artifact !== undefined) values.artifact = artifact;

    const { error } = await supabase
      .from("v8_gates")
      .update(values)
      .eq("id", id);

    if (error) throw new Error(error.message);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
