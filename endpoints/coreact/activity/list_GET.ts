import { schema, OutputType } from "./list_GET.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    const json = inputStr ? superjson.parse(inputStr) : {};
    const input = schema.parse(json);

    let query = db
      .selectFrom("activityLogs")
      .leftJoin("teamMembers", "activityLogs.performedBy", "teamMembers.id")
      .selectAll("activityLogs")
      .select(["teamMembers.name as performerName"])
      .orderBy("activityLogs.performedAt", "desc");

    if (input.projectId) {
      query = query.where("activityLogs.projectId", "=", input.projectId);
    }
    if (input.entityType) {
      query = query.where("activityLogs.entityType", "=", input.entityType);
    }
    if (input.entityId) {
      query = query.where("activityLogs.entityId", "=", input.entityId);
    }

    const limit = input.limit ?? 50;
    query = query.limit(limit);

    const activityLogs = await query.execute();

    return new Response(
      superjson.stringify({ activityLogs } satisfies OutputType)
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}