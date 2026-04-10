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
        dna_direcao: input.dna_direcao ?? null,
        dna_experiencia: input.dna_experiencia ?? null,
        dna_modulos: input.dna_modulos ?? null,
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

    // ── 2. V8 Integration (Operationalize Blueprint 3D) ──────────────────
    // Se a campanha possui DNA V8, espelhamos nas tabelas do dashboard C-Level
    if (input.dna_direcao) {
      const { error: v8Error } = await supabase
        .from("v8_campaigns")
        .insert({
          id: campaignId,
          direcao: input.dna_direcao,
          experiencia: input.dna_experiencia,
          objetivo_primario: input.name,
          segmento_publico: input.targetAudience || "Comunidade Adapta",
          created_at: new Date().toISOString(),
        });

      if (!v8Error) {
        // Inicializar Módulos V8 baseados nos flags do DNA
        const v8Modules = [];
        const mods = input.dna_modulos as any;
        
        if (mods?.governanca) v8Modules.push({ campaign_id: campaignId, bloco: 1, nome: "Governança & Compliance", descricao: "Aprovação formal, LGPD e Risco", status: "on", ok_trigger: "Assinatura" });
        if (mods?.digital)    v8Modules.push({ campaign_id: campaignId, bloco: 2, nome: "Ativação Digital", descricao: "Landing pages, Ads e Social", status: "on", ok_trigger: "Link Ativo" });
        if (mods?.fisico)     v8Modules.push({ campaign_id: campaignId, bloco: 3, nome: "Produção Física", descricao: "Materiais, Brindes e Logística", status: "on", ok_trigger: "Foto" });
        if (mods?.evento)     v8Modules.push({ campaign_id: campaignId, bloco: 4, nome: "Evento/Ação Local", descricao: "Execução presencial e Check-in", status: "on", ok_trigger: "Relatório" });

        if (v8Modules.length > 0) {
          await supabase.from("v8_modules").insert(v8Modules);
        }

        // Inicializar Gates de Segurança V8 (Canônicos)
        const v8Gates = [
          { campaign_id: campaignId, name: "Aprovação Médica/Jurídica", critical: true, artifact: "Termo Assinado" },
          { campaign_id: campaignId, name: "Verificação LGPD", critical: true, artifact: "Política OK" },
          { campaign_id: campaignId, name: "Disponibilidade de Orçamento", critical: false, artifact: "Financeiro" },
        ];
        await supabase.from("v8_gates").insert(v8Gates);
      } else {
        console.error("[campaigns/create] Supabase error (v8_campaigns):", v8Error);
      }
    }

    // ── 3. Auto-generate posts ─────────────────────────────────────────────
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