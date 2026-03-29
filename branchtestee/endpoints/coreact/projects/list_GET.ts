import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const projects = await db.selectFrom("projects")
      .leftJoin("teamMembers", "projects.ownerId", "teamMembers.id")
      .leftJoin("initiatives", "projects.initiativeId", "initiatives.id")
      .selectAll("projects")
      .select([
        "teamMembers.name as ownerName",
        "initiatives.name as initiativeName",
      ])
      .execute();

    const tasks = await db.selectFrom("tasks")
      .leftJoin("teamMembers", "tasks.assigneeId", "teamMembers.id")
      .selectAll("tasks")
      .select([
        "teamMembers.name as assigneeName",
        "teamMembers.initials as assigneeInitials"
      ])
      .execute();

    const projectsWithTasks = projects.map(p => ({
      ...p,
      tasks: tasks.filter(t => t.projectId === p.id)
    }));

    return new Response(superjson.stringify({ projects: projectsWithTasks } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}