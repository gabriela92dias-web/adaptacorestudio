import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import superjson from 'superjson';
import { camelizeKeys } from './helpers/dataUtils.ts'; // wait, it says .js but we can try to import or just inline camelizeKeys

const envText = fs.readFileSync('env.json', 'utf8');
const env = JSON.parse(envText);

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

function camelizeKeysLocal(obj) {
  if (Array.isArray(obj)) {
    return obj.map(v => camelizeKeysLocal(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      result[camelKey] = camelizeKeysLocal(obj[key]);
      return result;
    }, {});
  }
  return obj;
}

async function test() {
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

    const tasksByProjectId = new Map();
    for (const t of (tasks ?? [])) {
      if (!tasksByProjectId.has(t.project_id)) tasksByProjectId.set(t.project_id, []);
      tasksByProjectId.get(t.project_id).push(t);
    }

    const projectsByInitiativeId = new Map();
    for (const p of (projects ?? [])) {
      if (!p.initiative_id) continue;
      if (!projectsByInitiativeId.has(p.initiative_id)) projectsByInitiativeId.set(p.initiative_id, []);
      projectsByInitiativeId.get(p.initiative_id).push(p);
    }

    const enrichedInitiatives = (initiatives ?? []).map((initiative) => {
      const linkedProjects = projectsByInitiativeId.get(initiative.id) ?? [];
      const projectSummaries = linkedProjects.map((p) => {
        const projectTasks = tasksByProjectId.get(p.id) ?? [];
        const taskCount = projectTasks.length;
        const completedTaskCount = projectTasks.filter((t) => t.status === "completed").length;
        const progressPercent = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;
        return {
          id: p.id, name: p.name, status: p.status, priority: p.priority, category: p.category,
          startDate: p.start_date ?? null, endDate: p.end_date ?? null,
          ownerName: p.team_members?.name ?? null,
          taskCount, completedTaskCount, progressPercent,
        };
      });

      const totalTasks = projectSummaries.reduce((s, p) => s + p.taskCount, 0);
      const completedTasks = projectSummaries.reduce((s, p) => s + p.completedTaskCount, 0);
      const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const camel = camelizeKeysLocal(initiative);

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
    
    console.log(superjson.stringify({ initiatives: enrichedInitiatives }).substring(0, 100));
    console.log("Success mapped");
}

test();
