import { schema, OutputType } from "./update_POST.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";
import { getServerUserSession } from "../../../helpers/getServerUserSession";

export async function handle(request: Request) {
  try {
    // Ensure the request is authenticated
    await getServerUserSession(request);

    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const updateData: any = {};
    if (input.role !== undefined) {
      updateData.role = input.role;
    }
    if (input.permissions !== undefined) {
      updateData.permissions = input.permissions;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error("No valid fields provided for update");
    }

    const updatedSectorMember = await db
      .updateTable("sectorMembers")
      .set(updateData)
      .where("id", "=", input.id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(
      superjson.stringify({ sectorMember: updatedSectorMember } satisfies OutputType)
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}