import { schema, OutputType } from "./create_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";
import { nanoid } from "nanoid";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const newMember = await db.insertInto("teamMembers")
      .values({
        id: nanoid(),
        name: input.name,
        email: input.email ?? null,
        status: input.email ? "pending_registration" : "active",
        fullName: input.fullName ?? null,
        nickname: input.nickname ?? null,
        phone: input.phone ?? null,
        role: input.role ?? null,
        initials: input.initials ?? null,
        capacityHours: input.capacityHours,
        employmentType: input.employmentType,
        createdAt: new Date()
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ teamMember: newMember } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}