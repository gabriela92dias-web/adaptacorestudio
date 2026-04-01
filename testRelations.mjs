import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || "https://kshybgeyetkkufkmjugz.supabase.co";
const key = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzaHliZ2V5ZXRra3Vma21qdWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjU1OTQsImV4cCI6MjA4OTg0MTU5NH0.bs6pHfjKnPAACxz9fVPR3sGw-2IsjQc4DrrW584wXiY";

const supabase = createClient(url, key);

async function test() {
  const { error: iErr } = await supabase
      .from("initiatives")
      .select(`
        *,
        responsible:team_members!initiatives_responsible_id_fkey ( id, name, initials ),
        sector:sectors!initiatives_sector_id_fkey ( id, name ),
        team:teams!initiatives_assigned_team_id_fkey ( id, name ),
        solicitante:team_members!initiatives_solicitante_id_fkey ( id, name )
      `)
      .order("created_at", { ascending: false });
  console.log("iErr:", iErr?.message || "OK");

  const { error: pErr } = await supabase.from("projects").select("id, name, status, priority, category, start_date, end_date, initiative_id, team_members!projects_owner_id_fkey(name)");
  console.log("pErr:", pErr?.message || "OK");

  const { error: tErr } = await supabase.from("tasks").select("id, project_id, status");
  console.log("tErr:", tErr?.message || "OK");
}
test();
