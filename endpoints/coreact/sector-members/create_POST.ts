import { schema, OutputType } from "./create_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";
import { nanoid } from "nanoid";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const permissions = input.permissions ?? {};

    // Step 1: Look for an existing user by email
    const existingUser = await db
      .selectFrom("users")
      .select(["id"])
      .where("email", "=", input.email)
      .limit(1)
      .executeTakeFirst();

    let teamMemberId: string;

    if (existingUser) {
      // Step 2: Find the teamMember for this user
      const teamMember = await db
        .selectFrom("teamMembers")
        .select(["id"])
        .where("userId", "=", existingUser.id)
        .limit(1)
        .executeTakeFirst();

      if (!teamMember) {
        return new Response(
          superjson.stringify({ error: "User exists but has no associated team member." }),
          { status: 400 }
        );
      }

      // Step 3: Check if this teamMember is already a sector member for this sector
      const existingSectorMember = await db
        .selectFrom("sectorMembers")
        .select(["id"])
        .where("memberId", "=", teamMember.id)
        .where("sectorId", "=", input.sectorId)
        .limit(1)
        .executeTakeFirst();

      if (existingSectorMember) {
        return new Response(
          superjson.stringify({ error: "This team member is already assigned to this sector." }),
          { status: 400 }
        );
      }

      teamMemberId = teamMember.id;
    } else {
      // Step 4: No user found — look for an existing teamMember by email (pending case)
      const pendingTeamMember = await db
        .selectFrom("teamMembers")
        .select(["id"])
        .where("email", "=", input.email)
        .limit(1)
        .executeTakeFirst();

      if (pendingTeamMember) {
        // Check if this pending teamMember is already a sector member for this sector
        const existingSectorMember = await db
          .selectFrom("sectorMembers")
          .select(["id"])
          .where("memberId", "=", pendingTeamMember.id)
          .where("sectorId", "=", input.sectorId)
          .limit(1)
          .executeTakeFirst();

        if (existingSectorMember) {
          return new Response(
            superjson.stringify({ error: "This team member is already assigned to this sector." }),
            { status: 400 }
          );
        }

        teamMemberId = pendingTeamMember.id;
      } else {
        // Step 5: Create a new pending teamMember
        const emailPrefix = input.email.split("@")[0];
        const name = emailPrefix ?? input.email;
        const initials = name.slice(0, 2).toUpperCase();

        const newTeamMember = await db
          .insertInto("teamMembers")
          .values({
                                    id: nanoid(),
            name,
            email: input.email,
            initials,
            status: "pending_registration",
          })
          .returning(["id"])
          .executeTakeFirstOrThrow();

        console.log(`Created pending teamMember for email ${input.email} with id ${newTeamMember.id}`);
        teamMemberId = newTeamMember.id;
      }
    }

    // Step 6: Create the sectorMember record
    const newSectorMember = await db
      .insertInto("sectorMembers")
      .values({
        id: crypto.randomUUID(),
        sectorId: input.sectorId,
        memberId: teamMemberId,
        role: input.role,
        permissions: permissions,
        createdAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    console.log(`Created sectorMember ${newSectorMember.id} for teamMember ${teamMemberId} in sector ${input.sectorId}`);

    return new Response(superjson.stringify({ sectorMember: newSectorMember } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating sector member:", msg);
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}