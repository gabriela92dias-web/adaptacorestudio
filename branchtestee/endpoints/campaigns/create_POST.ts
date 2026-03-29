import { schema, OutputType } from "./create_POST.schema";
import superjson from 'superjson';
import { db } from "../../helpers/db";
import { nanoid } from "nanoid";
import { Selectable } from "kysely";
import { CampaignPosts } from "../../helpers/schema";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const result = await db.transaction().execute(async (trx) => {
      const campaignId = nanoid();
      
      const newCampaign = await trx.insertInto("campaigns")
        .values({
          id: campaignId,
          name: input.name,
          type: input.type,
          duration: input.duration,
          channels: input.channels,
          objective: input.objective,
          targetAudience: input.targetAudience,
          status: input.status,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      // Auto-generate posts based on channels
      const generatedPosts = [];
      const channelsToUse = input.channels.length > 0 ? input.channels : ["Instagram", "LinkedIn", "Facebook"];
      
      for (const channel of channelsToUse) {
        generatedPosts.push({
          id: nanoid(),
          campaignId: campaignId,
          channel: channel,
          title: `Post para ${channel} - ${input.name}`,
          content: `Conteúdo gerado automaticamente para o canal ${channel} visando a campanha ${input.name}.`,
          scheduledDate: new Date(Date.now() + 86400000 * (generatedPosts.length + 1)), // plus some days
          createdAt: new Date(),
        });
      }

      let insertedPosts: Selectable<CampaignPosts>[] = [];
      if (generatedPosts.length > 0) {
        insertedPosts = await trx.insertInto("campaignPosts")
          .values(generatedPosts)
          .returningAll()
          .execute();
      }

      return {
        ...newCampaign,
        posts: insertedPosts,
      };
    });

    return new Response(superjson.stringify({ campaign: result } satisfies OutputType));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: message }), { status: 400 });
  }
}