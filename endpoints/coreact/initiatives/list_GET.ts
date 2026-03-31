import superjson from 'superjson';
import { camelizeKeys } from "../../../helpers/dataUtils.js";
import { supabase } from "../../../helpers/supabase.js";



export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    let statusFilter: string | null = null;
    if (inputStr) {
      try { statusFilter = (superjson.parse(inputStr) as any)?.status ?? null; } catch {}
    }

    let query = supabase
      .from("initiatives")
      .select(`
        *,
        responsible:team_members!initiatives_responsible_id_fkey ( id, name, initials ),
        sector:sectors!initiatives_sector_id_fkey ( id, name ),
        team:teams!initiatives_assigned_team_id_fkey ( id, name ),
        solicitante:team_members!initiatives_solicitante_id_fkey ( id, name )
      `)
      .order("created_at", { ascending: false });

    if (statusFilter) query = (query as any).eq("status", statusFilter);

    const [{ data: initiatives, error: iErr }, { data: projects, error: pErr }, { data: tasks, error: tErr }] = await Promise.all([
      query,
      supabase.from("projects").select("id, name, status, priority, category, start_date, end_date, initiative_id, team_members!projects_owner_id_fkey(name)"),
      supabase.from("tasks").select("id, project_id, status"),
    ]);

    if (iErr) throw new Error(iErr.message);
    if (pErr) throw new Error(pErr.message);
    if (tErr) throw new Error(tErr.message);

    const tasksByProjectId = new Map<string, any[]>();
    for (const t of (tasks ?? [])) {
      if (!tasksByProjectId.has(t.project_id)) tasksByProjectId.set(t.project_id, []);
      tasksByProjectId.get(t.project_id)!.push(t);
    }

    const projectsByInitiativeId = new Map<string, any[]>();
    for (const p of (projects ?? [])) {
      if (!p.initiative_id) continue;
      if (!projectsByInitiativeId.has(p.initiative_id)) projectsByInitiativeId.set(p.initiative_id, []);
      projectsByInitiativeId.get(p.initiative_id)!.push(p);
    }

    const enrichedInitiatives = (initiatives ?? []).map((initiative: any) => {
      const linkedProjects = projectsByInitiativeId.get(initiative.id) ?? [];
      const projectSummaries = linkedProjects.map((p: any) => {
        const projectTasks = tasksByProjectId.get(p.id) ?? [];
        const taskCount = projectTasks.length;
        const completedTaskCount = projectTasks.filter((t: any) => t.status === "completed").length;
        const progressPercent = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;
        return {
          id: p.id, name: p.name, status: p.status, priority: p.priority, category: p.category,
          startDate: p.start_date ?? null, endDate: p.end_date ?? null,
          ownerName: (p as any).team_members?.name ?? null,
          taskCount, completedTaskCount, progressPercent,
        };
      });

      const totalTasks = projectSummaries.reduce((s: number, p: any) => s + p.taskCount, 0);
      const completedTasks = projectSummaries.reduce((s: number, p: any) => s + p.completedTaskCount, 0);
      const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const camel = camelizeKeys(initiative);

      return {
        ...camel,
        responsibleName: initiative.responsible?.name ?? null,
        responsibleInitials: initiative.responsible?.initials ?? null,
        sectorName: initiative.sector?.name ?? null,
        assignedTeamName: initiative.team?.name ?? null,
        solicitanteName: initiative.solicitante?.name ?? null,
        projectCount: linkedProjects.length,
        totalTasks, completedTasks, progressPercent,
        projects: projectSummaries,
      };
    });

    return new Response(
      superjson.stringify({ initiatives: enrichedInitiatives }),
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