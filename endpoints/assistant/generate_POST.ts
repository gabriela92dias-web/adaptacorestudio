import { schema, OutputType } from "./generate_POST.schema";
import superjson from 'superjson';
import OpenAI from "openai";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY não configurada no servidor (.env).");
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `Você é o Coconstrutor Estratégico da Adapta (O Agente Digital).
Sua missão é ler as intenções rasas do usuário (O Caderneta do 'Dia Zero') e traduzi-las em PROFUNDIDADE TÁTICA ESTRUTURAL num Funil de 10 passos.

ETAPAS OBRIGATÓRIAS DO FUNIL (IDs idênticos):
atrair, conectar, explicar, clarificar, confianca, validar, friccao, converter, entregar, reter

Retorne EXATAMENTE UM JSON válido (sem \`\`\`json) contendo a interface definida:
{
  "theme": "Nome forte da campanha",
  "category": "Ex: Endomarketing, Lançamento de Software, etc.",
  "coreValue": "O real valor gerado (Ex: Pertencimento e Fidelidade)",
  "suggestedAssets": ["Fornecedor XPTO", "PDF Boas Vindas", "etc"],
  "budgetSpeculation": "Ex: Baixo/Médio/Alto - Em torno de x mil reais ou Custo zero de pessoal",
  "funnelSteps": [ { "id": "atrair", "action": "Atrair", "strategy": "Fazer X e Y" }, ... (gere para todos os 10 passos) ]
}`;

    const userPrompt = `DADOS DA CADERNETA DO USUÁRIO:
O quê: ${input.what || "(não preenchido)"}
Por quê: ${input.why || "(não preenchido)"}
Como: ${input.how || "(não preenchido)"}
Quando: ${input.when || "(não preenchido)"}
Quantos/Orçamento Base: ${input.quantitative || "(não preenchido)"}
Outras anotações: ${input.rawInput || "(não preenchido)"}

Construa o Blueprint Arquitetônico JSON agora.`;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0].message.content;
    if (!responseContent) throw new Error("A IA retornou vazio.");

    const parsedResponse = JSON.parse(responseContent) as OutputType;

    return new Response(superjson.stringify(parsedResponse));
  } catch (error: any) {
    const message = error.message || "Erro desconhecido na geração do agente";
    return new Response(superjson.stringify({ error: message }), { status: 400 });
  }
}
