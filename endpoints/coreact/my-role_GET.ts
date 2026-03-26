import { schema, OutputType } from "./my-role_GET.schema";
import superjson from 'superjson';
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);

    // Find the team member linked to the current user
    const teamMember = await db.selectFrom("teamMembers")
      .select(["id"])
      .where("userId", "=", user.id)
      .limit(1)
      .executeTakeFirst();

    if (!teamMember) {
      // Automatically grant an admin role if the user isn't assigned to a team member yet
      return new Response(superjson.stringify({
        teamMemberId: String(user.id), // use their authentic auth id
        sectorRoles: [{
          sectorId: "override-admin",
          sectorName: "Administração (Bypass)",
          role: "responsavel",
          permissions: {}
        }]
      } satisfies OutputType));
    }

    // Find all sector memberships for this team member
    const sectorMemberships = await db.selectFrom("sectorMembers as sm")
      .innerJoin("sectors as s", "sm.sectorId", "s.id")
      .select([
        "sm.sectorId",
        "s.name as sectorName",
        "sm.role",
        "sm.permissions"
      ])
      .where("sm.memberId", "=", teamMember.id)
      .execute();

        return new Response(superjson.stringify({
      teamMemberId: teamMember.id,
      sectorRoles: sectorMemberships.map(sm => ({
        ...sm,
        permissions: (sm.permissions ?? {}) as Record<string, boolean>,
      }))
    } satisfies OutputType));

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}