import { schema, OutputType, InitiativeProjectSummary, InitiativeWithDetails } from "./list_GET.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    const json = inputStr ? superjson.parse(inputStr) : {};
    const input = schema.parse(json);

    // Build initiative query
    let initiativeQuery = db.selectFrom("initiatives")
      .leftJoin("teamMembers", "initiatives.responsibleId", "teamMembers.id")
      .leftJoin("sectors", "initiatives.sectorId", "sectors.id")
      .leftJoin("teams", "initiatives.assignedTeamId", "teams.id")
      .leftJoin("teamMembers as solicitante", "initiatives.solicitanteId", "solicitante.id")
      .selectAll("initiatives")
      .select([
        "teamMembers.name as responsibleName",
        "teamMembers.initials as responsibleInitials",
        "sectors.name as sectorName",
        "teams.name as assignedTeamName",
        "solicitante.name as solicitanteName",
      ])
      .orderBy("initiatives.createdAt", "desc");

    if (input.status) {
      initiativeQuery = initiativeQuery.where("initiatives.status", "=", input.status);
    }

    // Fetch all data in parallel
    const [initiatives, projects, tasks] = await Promise.all([
      initiativeQuery.execute(),
      db.selectFrom("projects")
        .leftJoin("teamMembers", "projects.ownerId", "teamMembers.id")
        .selectAll("projects")
        .select(["teamMembers.name as ownerName"])
        .execute(),
      db.selectFrom("tasks")
        .select(["tasks.id", "tasks.projectId", "tasks.status"])
        .execute(),
    ]);

    // Build a map of projectId -> tasks for fast lookup
    const tasksByProjectId = new Map<string, typeof tasks>();
    for (const task of tasks) {
      const existing = tasksByProjectId.get(task.projectId);
      if (existing) {
        existing.push(task);
      } else {
        tasksByProjectId.set(task.projectId, [task]);
      }
    }

    // Build a map of initiativeId -> projects for fast lookup
    const projectsByInitiativeId = new Map<string, typeof projects>();
    for (const project of projects) {
      if (!project.initiativeId) continue;
      const existing = projectsByInitiativeId.get(project.initiativeId);
      if (existing) {
        existing.push(project);
      } else {
        projectsByInitiativeId.set(project.initiativeId, [project]);
      }
    }

    // Aggregate data per initiative
    const enrichedInitiatives: InitiativeWithDetails[] = initiatives.map((initiative) => {
      const linkedProjects = projectsByInitiativeId.get(initiative.id) ?? [];

      const projectSummaries: InitiativeProjectSummary[] = linkedProjects.map((project) => {
        const projectTasks = tasksByProjectId.get(project.id) ?? [];
        const taskCount = projectTasks.length;
        const completedTaskCount = projectTasks.filter(t => t.status === "completed").length;
        const progressPercent = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;

        return {
          id: project.id,
          name: project.name,
          status: project.status,
          priority: project.priority,
          category: project.category,
          startDate: project.startDate,
          endDate: project.endDate,
          ownerName: project.ownerName ?? null,
          taskCount,
          completedTaskCount,
          progressPercent,
        } satisfies InitiativeProjectSummary;
      });

      const totalTasks = projectSummaries.reduce((sum, p) => sum + p.taskCount, 0);
      const completedTasks = projectSummaries.reduce((sum, p) => sum + p.completedTaskCount, 0);
      const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        ...initiative,
        assignedTeamName: initiative.assignedTeamName ?? null,
        projectCount: linkedProjects.length,
        totalTasks,
        completedTasks,
        progressPercent,
        projects: projectSummaries,
      } satisfies InitiativeWithDetails;
    });

    return new Response(superjson.stringify({ initiatives: enrichedInitiatives } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching initiatives list:", error);
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}