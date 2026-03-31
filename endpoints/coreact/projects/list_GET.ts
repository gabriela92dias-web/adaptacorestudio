import superjson from 'superjson';
import { camelizeKeys } from "../../../helpers/dataUtils.js";
import { supabase } from "../../../helpers/supabase.js";

export async function handle(request: Request) {
  try {
    const { data: projects, error: pErr } = await supabase
      .from("projects")
      .select(`*, teamMember:team_members!projects_owner_id_fkey ( id, name ), initiative:initiatives!projects_initiative_id_fkey ( id, name )`);

    if (pErr) throw new Error(pErr.message);

    const { data: tasks, error: tErr } = await supabase
      .from("tasks")
      .select(`*, assignee:team_members!tasks_assignee_id_fkey ( id, name, initials )`);

    if (tErr) throw new Error(tErr.message);

    const projectsWithTasks = (projects ?? []).map((p: any) => {
      const camelP = camelizeKeys(p);
      const projectTasks = (tasks ?? [])
        .filter((t: any) => t.project_id === p.id)
        .map((t: any) => {
          const camelT = camelizeKeys(t);
          return { ...camelT, assigneeName: t.assignee?.name ?? null, assigneeInitials: t.assignee?.initials ?? null };
        });
      return { ...camelP, ownerName: p.teamMember?.name ?? null, initiativeName: p.initiative?.name ?? null, tasks: projectTasks };
    });

    return new Response(
      superjson.stringify({ projects: projectsWithTasks }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact/projects/list_GET:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
