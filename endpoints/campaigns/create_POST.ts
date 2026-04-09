import { schema, OutputType } from "./create_POST.schema";
import superjson from 'superjson';
import { supabase } from "../../helpers/supabase.js";
import { nanoid } from "nanoid";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const campaignId = nanoid();

    // ── 1. Insert campaign ────────────────────────────────────────────────
    const { data: newCampaign, error: campaignError } = await supabase
      .from("campaigns")
      .insert({
        id: campaignId,
        name: input.name,
        type: input.type,
        duration: input.duration,
        channels: input.channels,
        objective: input.objective ?? null,
        target_audience: input.targetAudience ?? null,
        status: input.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (campaignError) {
      console.error("[campaigns/create] Supabase error (campaign):", campaignError);
      return new Response(
        superjson.stringify({ error: campaignError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // ── 2. Auto-generate posts ─────────────────────────────────────────────
    const now = Date.now();
    const generatedPosts: object[] = [];

    if (input.suggestedPosts && input.suggestedPosts.length > 0) {
      for (const post of input.suggestedPosts) {
        generatedPosts.push({
          id: nanoid(),
          campaign_id: campaignId,
          channel: post.channel,
          title: post.title,
          content: post.content,
          scheduled_date: new Date(now + 86400000 * (generatedPosts.length + 1)).toISOString(),
          created_at: new Date().toISOString(),
        });
      }
    } else {
      const channelsToUse =
        input.channels.length > 0 ? input.channels : ["Instagram", "LinkedIn", "Facebook"];
      for (const channel of channelsToUse) {
        generatedPosts.push({
          id: nanoid(),
          campaign_id: campaignId,
          channel,
          title: `[Rascunho V8] Post para ${channel} - ${input.name}`,
          content: `Estrutura de conteúdo em construção para a campanha ${input.name} no canal ${channel}.`,
          scheduled_date: new Date(now + 86400000 * (generatedPosts.length + 1)).toISOString(),
          created_at: new Date().toISOString(),
        });
      }
    }

    let insertedPosts: object[] = [];
    if (generatedPosts.length > 0) {
      const { data: posts, error: postsError } = await supabase
        .from("campaign_posts")
        .insert(generatedPosts)
        .select();

      if (postsError) {
        // Não bloqueia — campanha já foi salva, só loga o erro de posts
        console.error("[campaigns/create] Supabase error (posts):", postsError);
      } else {
        insertedPosts = posts ?? [];
      }
    }

    return new Response(
      superjson.stringify({ campaign: { ...newCampaign, posts: insertedPosts } } as OutputType)
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[campaigns/create] Unexpected error:", message);
    return new Response(
      superjson.stringify({ error: message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}