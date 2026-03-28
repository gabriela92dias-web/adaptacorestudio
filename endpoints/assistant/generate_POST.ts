import { schema, OutputType } from "./generate_POST.schema";
import superjson from 'superjson';
import OpenAI from "openai";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = json as any;

    if (!process.env.OPENAI_API_KEY) {
       console.warn("Fake OpenAI rodando devido a ausência de chave real (.env)");
       // Fallback Simulador
       if (input.phase === "scoping") {
          return new Response(superjson.stringify({
             scenarios: [
                { title: "Guerra de Guerrilha (Orgânico)", investmentMode: "Low Budget", description: "Esforço 100% focado no seu time base batendo na dor primária." },
                { title: "Matriz Mista Agressiva", investmentMode: "Mid Budget", description: "Híbrido de remarketing mais inbound para aceleração de conversão." },
                { title: "Dominação Total (Market Share)", investmentMode: "High Budget", description: "Injeção massiva em Meta Ads e Google para tracionar fundo de funil." }
             ]
          }));
       }
       if (input.phase === "blueprinting") {
          return new Response(superjson.stringify({
             category: "Lançamento Acelerado",
             coreValue: "Aumento de Lifetime Value",
             budgetSpeculation: "Baseado no Cenário Selecionado",
             dynamicLevers: [
                { id: "urgencia", type: "slider", label: "Peso da Urgência / Escassez", description: "Nível de agressividade para fechar o carrinho.", currentValue: 80 },
                { id: "whatsapp", type: "toggle", label: "Forçar WhatsApp no Checkout", description: "Coloca um SDR para quebrar objeções ativamente.", currentValue: true }
             ],
             dribbbleFunnel: [
                { id: "tofu", stage: "Atração", metricsPercent: "100%", metricsLabel: "Visitas Frias", tactic: "Ads Baseados em Dor Oculta", nuance: "Não falar a solução, vender o diagnóstico." },
                { id: "mofu", stage: "Consideração", metricsPercent: "35%", metricsLabel: "Leads Capturados", tactic: "Retargeting de Depoimentos", nuance: "Projeyar prova social para quem viu 50% do vídeo." },
                { id: "bofu", stage: "Conversão", metricsPercent: "8%", metricsLabel: "Vendas Geradas", tactic: "Condição Especial + Limitador", nuance: "Alavancar FOMO real com bônus finito." }
             ]
          }));
       }
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    let systemPrompt = "Você é um Cérebro V8.";
    
    if (input.phase === "scoping") {
       systemPrompt = `
       Você é o Doutor de Marketing Estratégico.
       Crie 3 cenários de guerra (scenarios: [{ title, investmentMode, description }]) para a missão: "${input.magicInput}".
       Invista no jargão tático e métrico. Responda APENAS JSON.
       `;
    } else {
       systemPrompt = `
       Você é a IA V8 final. Missão: "${input.magicInput}". Cenário escolhido: "${input.selectedScenario}".
       Crie o Blueprint.
       Formato JSON exigido:
       {
         "category": "String", "coreValue": "String", "budgetSpeculation": "String",
         "dynamicLevers": [ { "id":"string", "type":"slider|toggle", "label":"str", "description":"str", "currentValue": 50 } ],
         "dribbbleFunnel": [ { "id":"tofu", "stage":"string", "metricsPercent":"string", "metricsLabel":"string", "tactic":"str", "nuance":"str" }, { "id":"mofu", ...}, {"id":"bofu", ...} ]
       }
       `;
    }

    const chatCompletion = await openai.chat.completions.create({
      model: input.phase === "scoping" ? "gpt-4o-mini" : "gpt-4o",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: "INICIE" }],
      response_format: { type: "json_object" }
    });

    const parsedResponse = JSON.parse(chatCompletion.choices[0].message.content || "{}");
    return new Response(superjson.stringify(parsedResponse));
    
  } catch (error: any) {
    return new Response(superjson.stringify({ error: error.message }), { status: 400 });
  }
}
