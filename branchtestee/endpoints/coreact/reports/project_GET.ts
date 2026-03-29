import { schema, OutputType } from "./project_GET.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";
import { Selectable } from "kysely";
import { TeamMembers } from "../../../helpers/schema";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    const json = inputStr ? superjson.parse(inputStr) : {};
    const input = schema.parse(json);

    // 1. Project Details
    const project = await db
      .selectFrom("projects")
      .where("id", "=", input.projectId)
      .selectAll()
      .executeTakeFirstOrThrow();

    // 2. Tasks with Assignees
    const tasks = await db
      .selectFrom("tasks")
      .leftJoin("teamMembers", "tasks.assigneeId", "teamMembers.id")
      .where("tasks.projectId", "=", input.projectId)
      .selectAll("tasks")
      .select(["teamMembers.name as assigneeName"])
      .execute();

    // 3. Budget Summary
    const budgetItems = await db
      .selectFrom("budgetItems")
      .where("projectId", "=", input.projectId)
      .selectAll()
      .execute();

    let predictedTotal = 0;
    let contractedTotal = 0;
    let paidTotal = 0;
    for (const item of budgetItems) {
      predictedTotal += Number(item.predictedAmount || 0);
      contractedTotal += Number(item.contractedAmount || 0);
      paidTotal += Number(item.paidAmount || 0);
    }

    // 4. Team Members Involved (Task assignees + Participants)
    const participants = await db
      .selectFrom("taskParticipants")
      .innerJoin("tasks", "taskParticipants.taskId", "tasks.id")
      .where("tasks.projectId", "=", input.projectId)
      .select("taskParticipants.memberId")
      .execute();

    const assigneeIds = tasks.map((t) => t.assigneeId).filter(Boolean) as string[];
    const participantIds = participants.map((p) => p.memberId);
    const allMemberIds = Array.from(new Set([...assigneeIds, ...participantIds]));

    let fetchedMembers: Selectable<TeamMembers>[] = [];
    if (allMemberIds.length > 0) {
      fetchedMembers = await db
        .selectFrom("teamMembers")
        .where("id", "in", allMemberIds)
        .selectAll()
        .execute();
    }

    // 5. Task Status Breakdown
    const taskStatusBreakdown = tasks.reduce((acc, t) => {
      const status = t.status || "open";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 6. Recent Activity Logs (last 20)
    const recentActivities = await db
      .selectFrom("activityLogs")
      .leftJoin("teamMembers", "activityLogs.performedBy", "teamMembers.id")
      .where("activityLogs.projectId", "=", input.projectId)
      .selectAll("activityLogs")
      .select(["teamMembers.name as performerName"])
      .orderBy("activityLogs.performedAt", "desc")
      .limit(20)
      .execute();

    return new Response(
      superjson.stringify({
        project,
        tasks,
        budget: { predictedTotal, contractedTotal, paidTotal },
        teamMembers: fetchedMembers satisfies Selectable<TeamMembers>[],
        taskStatusBreakdown,
        recentActivities,
      } satisfies OutputType)
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}