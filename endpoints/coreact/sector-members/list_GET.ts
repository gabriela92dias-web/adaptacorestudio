import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    const json = inputStr ? superjson.parse(inputStr) : {};
    const input = schema.parse(json);

    let query = db.selectFrom("sectorMembers as sm")
      .innerJoin("teamMembers as tm", "sm.memberId", "tm.id")
      .innerJoin("sectors as s", "sm.sectorId", "s.id")
      .select([
        "sm.id",
        "sm.sectorId",
        "s.name as sectorName",
        "sm.memberId",
        "tm.name as memberName",
        "tm.initials as memberInitials",
        "tm.email as memberEmail",
        "tm.status as memberStatus",
        "sm.role",
        "sm.permissions",
        "sm.createdAt"
      ]);

    if (input.sectorId) {
      query = query.where("sm.sectorId", "=", input.sectorId);
    }

    const sectorMembers = await query.orderBy("sm.createdAt", "desc").execute();

    const mapped = sectorMembers.map(sm => {
      const rawPerms = sm.permissions;
      const parsed = typeof rawPerms === "string" ? JSON.parse(rawPerms) : (rawPerms ?? {});
      return {
        ...sm,
        permissions: parsed as Record<string, boolean>,
      };
    });

    return new Response(superjson.stringify({ sectorMembers: mapped } satisfies OutputType));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Error listing sector members:", msg);
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}