import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { db } from "../../helpers/db";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputParam = url.searchParams.get("input");
    const json = inputParam ? superjson.parse(inputParam) : {};
    const input = schema.parse(json);

    let query = db.selectFrom("campaigns").selectAll();

    if (input.status) {
      query = query.where("status", "=", input.status);
    }
    if (input.type) {
      query = query.where("type", "=", input.type);
    }

    const campaigns = await query.orderBy("createdAt", "desc").execute();
    const campaignIds = campaigns.map((c) => c.id);

    let posts = [] as typeof db extends import("kysely").Kysely<infer DB> ? import("kysely").Selectable<DB["campaignPosts"]>[] : any[];
    
    if (campaignIds.length > 0) {
      posts = await db.selectFrom("campaignPosts")
        .selectAll()
        .where("campaignId", "in", campaignIds)
        .orderBy("createdAt", "asc")
        .execute();
    }

    const campaignsWithPosts = campaigns.map((campaign) => ({
      ...campaign,
      posts: posts.filter((p) => p.campaignId === campaign.id),
    }));

    return new Response(superjson.stringify({ campaigns: campaignsWithPosts } satisfies OutputType));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[campaigns/list] Error:", message);
    return new Response(superjson.stringify({ error: message }), { status: 400 });
  }
}