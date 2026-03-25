import { schema, OutputType } from "./create_POST.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";
import { nanoid } from "nanoid";
import { logActivity } from "../../../helpers/activityLogger";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const newParticipant = await db
      .insertInto("taskParticipants")
      .values({
        id: nanoid(),
        taskId: input.taskId,
        memberId: input.memberId,
        role: input.role,
        createdAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    await logActivity({
      action: "assigned",
      entityId: newParticipant.taskId,
      entityType: "task",
      newValue: input.memberId,
      metadata: { participantId: newParticipant.id, role: input.role },
    });

    return new Response(
      superjson.stringify({ taskParticipant: newParticipant } satisfies OutputType)
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}