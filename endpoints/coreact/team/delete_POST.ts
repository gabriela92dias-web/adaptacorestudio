import { schema, OutputType } from "./delete_POST.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    await db.transaction().execute(async (trx) => {
      // Unassign tasks from this team member
      await trx.updateTable("tasks")
        .set({ assigneeId: null })
        .where("assigneeId", "=", input.id)
        .execute();

      // Delete the team member
      const deletedMember = await trx.deleteFrom("teamMembers")
        .where("id", "=", input.id)
        .executeTakeFirst();
        
      if (deletedMember.numDeletedRows === 0n) {
        throw new Error("Team member not found");
      }
    });

    return new Response(superjson.stringify({ success: true } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}