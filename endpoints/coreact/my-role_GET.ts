import { schema, OutputType } from "./my-role_GET.schema";
import superjson from 'superjson';
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);

    // Find the team member linked to the current user
    let teamMember = await db.selectFrom("teamMembers")
      .select(["id"])
      .where("userId", "=", user.id)
      .limit(1)
      .executeTakeFirst();

    if (!teamMember) {
      // Auto-provision a real teamMember record for this user
      const newTeamMemberId = crypto.randomUUID();
      const initials = user.displayName?.slice(0, 2).toUpperCase() || "NN";
      
      await db.insertInto("teamMembers").values({
        id: newTeamMemberId,
        userId: user.id,
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        initials,
        status: "active",
        createdAt: new Date(),
      }).execute();

      // If this is the owner (ID 1) or an admin, automatically assign them to ALL existing sectors
      if (user.id === 1 || user.role === "admin") {
        const allSectors = await db.selectFrom("sectors").select("id").execute();
        if (allSectors.length > 0) {
          await db.insertInto("sectorMembers").values(
            allSectors.map(s => ({
              id: crypto.randomUUID(),
              sectorId: s.id,
              memberId: newTeamMemberId,
              role: "responsavel" as const,
              permissions: {},
              createdAt: new Date(),
            }))
          ).execute();
        }
      }
      
      // Re-fetch the team member we just created
      const newMember = await db.selectFrom("teamMembers")
        .select(["id"])
        .where("userId", "=", user.id)
        .limit(1)
        .executeTakeFirst();
      
      if (!newMember) throw new Error("Auto-provisioning failed");
      teamMember = newMember;
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