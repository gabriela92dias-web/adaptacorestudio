import superjson from 'superjson';
import { supabase } from "../../../helpers/supabase.js";

export async function handle(request: Request) {
  try {
    const [
      { data: teams, error: tErr },
      { data: groupMembers, error: gmErr },
      { data: initiatives, error: iErr },
      { data: projects, error: pErr },
      { data: tasks, error: tkErr },
    ] = await Promise.all([
      supabase.from("teams").select("id, name, sector_id, sectors(name)").order("created_at", { ascending: true }),
      supabase.from("team_group_members").select("team_id, member_id, team_members(id, name, initials)"),
      supabase.from("initiatives").select("id, name, assigned_team_id").not("assigned_team_id", "is", null),
      supabase.from("projects").select("id, name, assigned_team_id").not("assigned_team_id", "is", null),
      supabase.from("tasks").select("id, name, project_id, assigned_team_id, projects(name)").not("assigned_team_id", "is", null),
    ]);

    if (tErr) throw new Error(tErr.message);
    if (gmErr) throw new Error(gmErr.message);

    const resultTeams = (teams ?? []).map((team: any) => {
      const members = (groupMembers ?? [])
        .filter((gm: any) => gm.team_id === team.id)
        .map((gm: any) => ({
          id: gm.team_members?.id ?? gm.member_id,
          name: gm.team_members?.name ?? null,
          initials: gm.team_members?.initials ?? null,
        }));

      const contexts: any[] = [];

      (initiatives ?? []).filter((i: any) => i.assigned_team_id === team.id)
        .forEach((i: any) => contexts.push({ entityType: "initiative", entityId: i.id, entityName: i.name }));

      (projects ?? []).filter((p: any) => p.assigned_team_id === team.id)
        .forEach((p: any) => contexts.push({ entityType: "project", entityId: p.id, entityName: p.name }));

      (tasks ?? []).filter((t: any) => t.assigned_team_id === team.id)
        .forEach((t: any) => contexts.push({
          entityType: "task", entityId: t.id, entityName: t.name,
          parentId: t.project_id, parentName: t.projects?.name ?? null
        }));

      return {
        id: team.id,
        name: team.name,
        sectorId: team.sector_id,
        sectorName: team.sectors?.name ?? null,
        members,
        contexts,
      };
    });

    return new Response(
      superjson.stringify({ teams: resultTeams }),
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