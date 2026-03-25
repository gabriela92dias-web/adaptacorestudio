import { schema, OutputType } from "./create_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";
import { nanoid } from "nanoid";
import { logActivity } from "../../../helpers/activityLogger";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    // Auto-approve if no solicitante or solicitante is the same as responsible
    const resolvedStatus =
      !input.solicitanteId || input.solicitanteId === input.responsibleId
        ? "aprovada"
        : "solicitada";

    const newInitiative = await db.insertInto("initiatives")
      .values({
        id: nanoid(),
        name: input.name,
        description: input.description ?? null,
        responsibleId: input.responsibleId ?? null,
        sectorId: input.sectorId ?? null,
        assignedTeamId: input.assignedTeamId ?? null,
        solicitanteId: input.solicitanteId ?? null,
        type: input.type ?? null,
        context: input.context ?? null,
        status: resolvedStatus,
        startDate: input.startDate ?? null,
        endDate: input.endDate ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    await logActivity({
      action: "created",
      entityId: newInitiative.id,
      entityType: "initiative",
      performedBy: input.responsibleId,
      newValue: newInitiative.name,
    });

    return new Response(superjson.stringify({ initiative: newInitiative } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}