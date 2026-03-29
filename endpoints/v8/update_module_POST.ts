import { supabase } from "../../helpers/supabase.js";

export async function handle(request: Request) {
  try {
    const body = await request.json();
    const { id, owner, cost, dueDate, ok, status } = body;

    if (!id) throw new Error("id obrigatório");

    const values: Record<string, any> = {};
    if (owner   !== undefined) values.owner    = owner;
    if (cost    !== undefined) values.cost     = cost;
    if (dueDate !== undefined) values.due_date = dueDate || null;
    if (ok      !== undefined) values.ok       = ok;
    if (status  !== undefined) values.status   = status;

    if (Object.keys(values).length === 0) {
      return new Response(JSON.stringify({ success: true, noop: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { error } = await supabase
      .from("v8_modules")
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
