import { schema, OutputType, DnaBlock, Modulo, Gate } from "./generate_POST.schema";
import superjson from 'superjson';
import OpenAI from "openai";
import { supabase } from "../../helpers/supabase.js";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = json as any;

    let extractedDna: DnaBlock = { direcao: "hibrida", experiencia: "hibrida", objetivo_primario: "Objetivo Mockado", segmento_publico: "Geral" };

    if (process.env.OPENAI_API_KEY) {
       const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
       const systemPrompt = `Você é o Extrator Base do Motor V8 Adapta. 
Sua única função é ler a intenção e retornar EXATAMENTE este JSON puro:
{
  "direcao": "interna" | "externa" | "hibrida",
  "experiencia": "fisica" | "digital" | "hibrida",
  "objetivo_primario": "Resumo de 5 palavras do foco principal",
  "segmento_publico": "Resumo de 5 palavras de quem é o alvo"
}`;
       const chatCompletion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: input.magicInput || "campanha genérica" }],
          response_format: { type: "json_object" }
       });
       extractedDna = JSON.parse(chatCompletion.choices[0].message.content || "{}");
    } else {
       console.warn("Fake OpenAI rodando devido a ausência de chave real (.env)");
       const text = (input.magicInput || "").toLowerCase();
       extractedDna.experiencia = text.includes("presencial") || text.includes("fisic") ? "fisica" : "digital";
       extractedDna.direcao = "hibrida"; 
       extractedDna.objetivo_primario = "Campanha Offline (Mock)";
       extractedDna.segmento_publico = "Público Frio";
    }

    const generatedModules: Modulo[] = [];
    const generatedGates: Gate[] = [];

    // Soft Gates Globais (Layer 1 - Macro Governança)
    generatedGates.push(
      { id: "legal", name: "Jurídico (Termos e Riscos)", critical: true, ok: false },
      { id: "finance", name: "Financeiro (Verba e Pix)", critical: true, ok: false }
    );

    // Motor de Regras Locais (Módulos Baseados no DNA)
    if (extractedDna.direcao === "hibrida" || extractedDna.direcao === "interna") {
       generatedModules.push({
          id: "trilha_a", bloco: 3, nome: "Trilha Interna (Lado A)", descricao: "Preparo da casa: Cartilha de acolhimento e FAQs para a base.", status: "on",
          owner: "", cost: 0, due: "", ok: false, okTrigger: "Leitura e Check-in da equipe ativa" // Atributos vazios aguardando painel
       });
       generatedGates.push({ id: "training", name: "Treinamento Interno", critical: false, ok: false }); // Gate opcional/contextual
    }

    if (extractedDna.experiencia === "fisica" || extractedDna.experiencia === "hibrida") {
       generatedModules.push({
         id: "mod_evento", bloco: 4, nome: "Módulo Dinâmico: Evento Presencial", descricao: "Locação, recepção, e alvarás obrigatórios.", status: "on",
         owner: "", cost: 0, due: "", ok: false, okTrigger: "Upload Alvará de Funcionamento Aprovado"
       });
    }

    generatedModules.push({
        id: "trilha_b", bloco: 5, nome: "Trilha Externa (Lado B)", descricao: "Tudo o que o lead vê: Landing Pages, E-mail, Tráfego Pago.", status: "on",
        owner: "", cost: 0, due: "", ok: false, okTrigger: "Check de Q/A no ambiente Produção"
    });

    // ----------------------------------------------------
    // INÍCIO DA PERSISTÊNCIA NO BANCO (Motor V8 via REST)
    // ----------------------------------------------------
    const { data: campaignData, error: campaignError } = await supabase
      .from("v8_campaigns")
      .insert({
        direcao: extractedDna.direcao,
        experiencia: extractedDna.experiencia,
        objetivo_primario: extractedDna.objetivo_primario,
        segmento_publico: extractedDna.segmento_publico,
      })
      .select("id")
      .single();

    if (campaignError) throw new Error("Erro ao salvar campanha: " + campaignError.message);
    const campaignId = campaignData.id;

    if (generatedGates.length > 0) {
      const { error: gatesError } = await supabase
        .from("v8_gates")
        .insert(generatedGates.map((g) => ({
          campaign_id: campaignId,
          name: g.name,
          critical: g.critical,
          ok: g.ok,
          artifact: "",
        })));
      if (gatesError) throw new Error("Erro ao salvar gates: " + gatesError.message);
    }

    if (generatedModules.length > 0) {
      const { error: modulesError } = await supabase
        .from("v8_modules")
        .insert(generatedModules.map((m) => ({
          campaign_id: campaignId,
          bloco: m.bloco,
          nome: m.nome,
          descricao: m.descricao,
          status: m.status,
          owner: m.owner || "",
          cost: m.cost || 0,
          due_date: null,
          ok: m.ok,
          ok_trigger: m.okTrigger,
        })));
      if (modulesError) throw new Error("Erro ao salvar módulos: " + modulesError.message);
    }

    const finalPayload: OutputType = {
      dna: extractedDna,
      modulos: generatedModules,
      gates: generatedGates
    };

    return new Response(superjson.stringify(finalPayload));
    
  } catch (error: any) {
    return new Response(superjson.stringify({ error: error.message }), { status: 400 });
  }
}
