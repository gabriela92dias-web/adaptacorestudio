import { schema, OutputType } from "./contexts_GET.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    // 1. Fetch all teams with their sector names
    const teams = await db
      .selectFrom("teams")
      .leftJoin("sectors", "teams.sectorId", "sectors.id")
      .select([
        "teams.id",
        "teams.name",
        "teams.sectorId",
        "sectors.name as sectorName"
      ])
      .orderBy("teams.createdAt", "asc")
      .execute();

    // 2. Fetch team members
    const groupMembers = await db
      .selectFrom("teamGroupMembers")
      .innerJoin("teamMembers", "teamGroupMembers.memberId", "teamMembers.id")
      .select([
        "teamGroupMembers.teamId",
        "teamMembers.id",
        "teamMembers.name",
        "teamMembers.initials",
      ])
      .execute();

    // 3. Fetch contexts (initiatives, projects, stages, tasks) assigned to any team
    const initiatives = await db
      .selectFrom("initiatives")
      .select(["id", "name", "assignedTeamId"])
      .where("assignedTeamId", "is not", null)
      .execute();

    const projects = await db
      .selectFrom("projects")
      .select(["id", "name", "assignedTeamId"])
      .where("assignedTeamId", "is not", null)
      .execute();

    const stages = await db
      .selectFrom("projectStages")
      .innerJoin("projects", "projectStages.projectId", "projects.id")
      .select([
        "projectStages.id",
        "projectStages.name",
        "projectStages.projectId",
        "projects.name as projectName",
        "projectStages.assignedTeamId"
      ])
      .where("projectStages.assignedTeamId", "is not", null)
      .execute();

    const tasks = await db
      .selectFrom("tasks")
      .innerJoin("projects", "tasks.projectId", "projects.id")
      .select([
        "tasks.id",
        "tasks.name",
        "tasks.projectId",
        "projects.name as projectName",
        "tasks.assignedTeamId"
      ])
      .where("tasks.assignedTeamId", "is not", null)
      .execute();

    // 4. Assemble the enriched payload
    const resultTeams = teams.map((team) => {
      const members = groupMembers
        .filter((gm) => gm.teamId === team.id)
        .map((gm) => ({
          id: gm.id,
          name: gm.name,
          initials: gm.initials,
        }));

      const contexts: OutputType["teams"][number]["contexts"] = [];

      // Attach Initiatives
      initiatives
        .filter((i) => i.assignedTeamId === team.id)
        .forEach((i) => {
          contexts.push({
            entityType: "initiative",
            entityId: i.id,
            entityName: i.name,
          });
        });

      // Attach Projects
      projects
        .filter((p) => p.assignedTeamId === team.id)
        .forEach((p) => {
          contexts.push({
            entityType: "project",
            entityId: p.id,
            entityName: p.name,
          });
        });

      // Attach Stages
      stages
        .filter((s) => s.assignedTeamId === team.id)
        .forEach((s) => {
          contexts.push({
            entityType: "stage",
            entityId: s.id,
            entityName: s.name,
            parentId: s.projectId,
            parentName: s.projectName,
          });
        });

      // Attach Tasks
      tasks
        .filter((t) => t.assignedTeamId === team.id)
        .forEach((t) => {
          contexts.push({
            entityType: "task",
            entityId: t.id,
            entityName: t.name,
            parentId: t.projectId,
            parentName: t.projectName,
          });
        });

      return {
        id: team.id,
        name: team.name,
        sectorId: team.sectorId,
        sectorName: team.sectorName,
        members,
        contexts,
      };
    });

    return new Response(superjson.stringify({ teams: resultTeams } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}