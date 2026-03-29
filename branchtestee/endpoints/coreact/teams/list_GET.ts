import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    // Fetch teams with their sector names
    const teams = await db
      .selectFrom("teams")
      .leftJoin("sectors", "teams.sectorId", "sectors.id")
      .selectAll("teams")
      .select(["sectors.name as sectorName"])
      .orderBy("teams.createdAt", "asc")
      .execute();

    // Fetch all team group members with member details
    const groupMembers = await db
      .selectFrom("teamGroupMembers")
      .innerJoin("teamMembers", "teamGroupMembers.memberId", "teamMembers.id")
      .selectAll("teamGroupMembers")
      .select([
        "teamMembers.name",
        "teamMembers.initials",
      ])
      .execute();

    // Group members by team
    const resultTeams = teams.map((team) => {
      const members = groupMembers
        .filter((gm) => gm.teamId === team.id)
        .map((gm) => ({
          id: gm.memberId,
          name: gm.name,
          initials: gm.initials,
        }));

      return {
        ...team,
        members,
      };
    });

    return new Response(superjson.stringify({ teams: resultTeams } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}