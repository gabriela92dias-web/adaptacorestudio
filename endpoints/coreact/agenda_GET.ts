import { schema, OutputType } from "./agenda_GET.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);

    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    const json = inputStr ? superjson.parse(inputStr) : { month: new Date().getMonth() + 1, year: new Date().getFullYear() };
    const input = schema.parse(json);

    // Find the team member linked to the current user
    const teamMember = await db
      .selectFrom("teamMembers")
      .select(["id"])
      .where("userId", "=", user.id)
      .limit(1)
      .executeTakeFirst();

    if (!teamMember) {
      return new Response(
        superjson.stringify({
          tasks: [],
          teamMemberId: null,
        } satisfies OutputType)
      );
    }

    // Find user sectors and teams for complex visibility checks
    const sectorMemberships = await db
      .selectFrom("sectorMembers")
      .select("sectorId")
      .where("memberId", "=", teamMember.id)
      .execute();

    const sectorIds = sectorMemberships.map((sm) => sm.sectorId);
    let teamIds: string[] = [];

    if (sectorIds.length > 0) {
      const teams = await db
        .selectFrom("teams")
        .select("id")
        .where("sectorId", "in", sectorIds)
        .execute();
      teamIds = teams.map((t) => t.id);
    }

    // Determine the exact date boundaries for the requested month
    const startOfMonth = new Date(input.year, input.month - 1, 1);
    const endOfMonth = new Date(input.year, input.month, 0, 23, 59, 59, 999);

    let query = db
      .selectFrom("tasks as t")
      .leftJoin("projects as p", "t.projectId", "p.id")
      .leftJoin("teamMembers as tm", "t.assigneeId", "tm.id")
      .select([
        "t.id",
        "t.name",
        "t.startDate",
        "t.endDate",
        "t.status",
        "t.priority",
        "p.name as projectName",
        "tm.name as assigneeName",
      ]);

    // Apply date range overlap logic:
    // Include tasks where ANY date (startDate or endDate) falls within/overlaps the month.
    // Case 1: Task has a startDate that is on or before endOfMonth AND (endDate >= startOfMonth OR endDate is null)
    // Case 2: Task has no startDate but has an endDate that falls within the month (endDate >= startOfMonth)
    query = query.where((eb) =>
      eb.or([
        eb.and([
          eb("t.startDate", "is not", null),
          eb("t.startDate", "<=", endOfMonth),
          eb.or([
            eb("t.endDate", ">=", startOfMonth),
            eb("t.endDate", "is", null),
          ]),
        ]),
        eb.and([
          eb("t.startDate", "is", null),
          eb("t.endDate", "is not", null),
          eb("t.endDate", ">=", startOfMonth),
        ]),
      ])
    );

    // Apply authorization/visibility rules
    query = query.where((eb) =>
      eb.or([
        eb("t.assigneeId", "=", teamMember.id),
        eb(
          "t.id",
          "in",
          db
            .selectFrom("taskParticipants")
            .select("taskId")
            .where("memberId", "=", teamMember.id)
        ),
        ...(teamIds.length > 0 ? [eb("p.assignedTeamId", "in", teamIds)] : []),
        // Unassigned tasks on unassigned projects are visible to all team members
        eb.and([
          eb("t.assigneeId", "is", null),
          eb("p.assignedTeamId", "is", null),
        ]),
      ])
    );

    const tasks = await query.execute();

    return new Response(
      superjson.stringify({
        tasks,
        teamMemberId: teamMember.id,
      } satisfies OutputType)
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}