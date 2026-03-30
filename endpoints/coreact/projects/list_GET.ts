import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { supabase } from "../../../helpers/supabase";

export async function handle(request: Request) {
  try {
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select(`
        *,
        teamMembers:team_members(id, name),
        initiatives(id, name)
      `);

    if (projectsError) throw projectsError;

    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select(`
        *,
        teamMembers:team_members(id, name, initials)
      `);

    if (tasksError) throw tasksError;

    const projectsWithTasks = (projects ?? []).map(p => ({
      ...p,
      tasks: (tasks ?? []).filter(t => t.project_id === p.id)
    }));

    return new Response(superjson.stringify({ projects: projectsWithTasks } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}
