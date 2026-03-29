import { db } from "../../helpers/db";
import { schema } from "./register_with_password_POST.schema";
import { randomBytes } from "crypto";
import {
  setServerSession,
  SessionExpirationSeconds,
} from "../../helpers/getSetServerSession";
import { generatePasswordHash } from "../../helpers/generatePasswordHash";

export async function handle(request: Request) {
  try {
    const json = await request.json();
    const { email, password, displayName } = schema.parse(json);

    // Check if email already exists
    const existingUser = await db
      .selectFrom("users")
      .select("id")
      .where("email", "=", email)
      .limit(1)
      .execute();

    if (existingUser.length > 0) {
      return Response.json(
        { message: "email already in use" },
        { status: 409 }
      );
    }

    const passwordHash = await generatePasswordHash(password);

    // Create new user
    const newUser = await db.transaction().execute(async (trx) => {
      // Insert the user
      const [user] = await trx
        .insertInto("users")
        .values({
          email,
          displayName,
          role: "user",
        })
        .returning(["id", "email", "displayName", "createdAt"])
        .execute();

      // Store the password hash
      await trx
        .insertInto("userPasswords")
        .values({
          userId: user.id,
          passwordHash,
        })
        .execute();

      const initials = displayName.slice(0, 2).toUpperCase();

      // Check for an existing pending teamMember with matching email and no userId
      const pendingTeamMember = await trx
        .selectFrom("teamMembers")
        .select(["id"])
        .where("email", "=", email)
        .where("status", "=", "pending_registration")
        .where("userId", "is", null)
        .limit(1)
        .executeTakeFirst();

      if (pendingTeamMember) {
        // Upgrade the pending teamMember to active
        console.log(`Upgrading pending teamMember ${pendingTeamMember.id} for email ${email} to active user ${user.id}`);
        await trx
          .updateTable("teamMembers")
          .set({
            userId: user.id,
            name: displayName,
            initials,
            status: "active",
          })
          .where("id", "=", pendingTeamMember.id)
          .execute();
      } else {
        // Create a new teamMember linked to this user
        console.log(`Creating new teamMember for user ${user.id} with email ${email}`);
        await trx
          .insertInto("teamMembers")
          .values({
            id: crypto.randomUUID(),
            name: displayName,
            email,
            userId: user.id,
            initials,
            status: "active",
          })
          .execute();
      }

      return user;
    });

    // Create a new session
    const sessionId = randomBytes(32).toString("hex");
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SessionExpirationSeconds * 1000);

    await db
      .insertInto("sessions")
      .values({
        id: sessionId,
        userId: newUser.id,
        createdAt: now,
        lastAccessed: now,
        expiresAt,
      })
      .execute();

    // Create response with user data
    const response = Response.json({
      user: {
        ...newUser,
        role: "user" as const,
      },
    });

    // Set session cookie
    await setServerSession(response, {
      id: sessionId,
      createdAt: now.getTime(),
      lastAccessed: now.getTime(),
    });

    return response;
  } catch (error: unknown) {
    console.error("Registration error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Registration failed";
    return Response.json({ message: errorMessage }, { status: 400 });
  }
}