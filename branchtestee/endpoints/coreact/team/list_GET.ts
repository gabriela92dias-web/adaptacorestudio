import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

function getBusinessDays(startDate: Date, endDate: Date) {
  let count = 0;
  const curDate = new Date(startDate.getTime());
  curDate.setHours(0, 0, 0, 0);
  const end = new Date(endDate.getTime());
  end.setHours(0, 0, 0, 0);
  
  while (curDate <= end) {
    const dayOfWeek = curDate.getDay();
    // Exclude Sunday (0) and Saturday (6)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
}

export async function handle(request: Request) {
  try {
    const members = await db.selectFrom("teamMembers").selectAll().execute();
    
    const tasks = await db.selectFrom("tasks")
      .leftJoin("projects", "tasks.projectId", "projects.id")
      .where("tasks.assigneeId", "is not", null)
      .selectAll("tasks")
      .select(["projects.name as projectName"])
      .execute();

    const teamMembersWithStats = members.map(member => {
      const memberTasks = tasks.filter(t => t.assigneeId === member.id);
      let allocatedHours = 0;
      const assignedTasks = [];

      for (const t of memberTasks) {
        assignedTasks.push({
          id: t.id,
          name: t.name,
          projectName: t.projectName
        });
        
        if (t.startDate && t.endDate && t.startDate <= t.endDate) {
          const days = getBusinessDays(t.startDate, t.endDate);
          allocatedHours += days * 8;
        }
      }

      return {
        ...member,
        totalAllocatedHours: allocatedHours,
        taskCount: memberTasks.length,
        assignedTasks
      };
    });

    return new Response(superjson.stringify({ teamMembers: teamMembersWithStats } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}