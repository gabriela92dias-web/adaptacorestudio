import { supabase } from './helpers/supabase.js';

async function main() {
  const query = supabase
    .from("initiatives")
    .select(`
      *,
      responsible:team_members!initiatives_responsible_id_fkey ( id, name, initials ),
      sector:sectors!initiatives_sector_id_fkey ( id, name ),
      team:teams!initiatives_assigned_team_id_fkey ( id, name ),
      solicitante:team_members!initiatives_solicitante_id_fkey ( id, name )
    `)
    .order("created_at", { ascending: false });

  const [{ data: initiatives, error: iErr }, { data: projects, error: pErr }, { data: tasks, error: tErr }] = await Promise.all([
    query,
    supabase.from("projects").select("id, name, status, priority, category, start_date, end_date, initiative_id, team_members!projects_owner_id_fkey(name)"),
    supabase.from("tasks").select("id, project_id, status"),
  ]);

  if (iErr) console.error("iErr:", iErr.message);
  if (pErr) console.error("pErr:", pErr.message);
  if (tErr) console.error("tErr:", tErr.message);
  
  console.log('Initiatives:', initiatives?.length);
  console.log('Projects:', projects?.length);
  console.log('Tasks:', tasks?.length);
}

main();
