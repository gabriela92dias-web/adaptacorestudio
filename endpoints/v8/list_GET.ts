import { schema, OutputType } from "./list_GET.schema.js";
import { supabase } from "../../helpers/supabase.js";

export async function handle(request: Request) {
  try {
    // Buscar campanhas ordenadas por data desc
    const { data: campaigns, error: cErr } = await supabase
      .from("v8_campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (cErr) throw new Error(cErr.message);
    if (!campaigns || campaigns.length === 0) {
      return new Response(JSON.stringify({ campaigns: [] }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const campaignIds = campaigns.map((c) => c.id);

    // Módulos
    const { data: modules, error: mErr } = await supabase
      .from("v8_modules")
      .select("*")
      .in("campaign_id", campaignIds)
      .order("bloco", { ascending: true });

    if (mErr) throw new Error(mErr.message);

    // Gates
    const { data: gates, error: gErr } = await supabase
      .from("v8_gates")
      .select("*")
      .in("campaign_id", campaignIds);

    if (gErr) throw new Error(gErr.message);

    // Agrupar
    const fullCampaigns = campaigns.map((c) => ({
      ...c,
      modulos: (modules || []).filter((m) => m.campaign_id === c.id),
      gates: (gates || []).filter((g) => g.campaign_id === c.id),
    }));

    return new Response(JSON.stringify({ campaigns: fullCampaigns }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
