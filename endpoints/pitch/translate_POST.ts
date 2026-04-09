import OpenAI from "openai";

const LANG_NAMES: Record<string, string> = {
  pt: "Portuguese (Brazil)",
  en: "English",
  de: "German",
};

export async function handle(request: Request) {
  try {
    const body = await request.json() as {
      fields: Record<string, string | string[]>;
      sourceLang: string;
      targetLangs: string[];
    };

    const { fields, sourceLang, targetLangs } = body;

    if (!fields || !sourceLang || !targetLangs?.length) {
      return new Response(JSON.stringify({ error: "Missing fields/sourceLang/targetLangs" }), { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      // Fallback sem OpenAI: retorna os campos sem alteração para todos os idiomas
      const result: Record<string, typeof fields> = {};
      for (const lang of targetLangs) result[lang] = { ...fields };
      return new Response(JSON.stringify({ translations: result }));
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const fieldsJson = JSON.stringify(fields, null, 2);
    const targets = targetLangs.map(l => `"${l}" (${LANG_NAMES[l] ?? l})`).join(", ");

    const systemPrompt = `You are a professional translator for a corporate pitch deck.
Translate ONLY the text values in the JSON below from ${LANG_NAMES[sourceLang] ?? sourceLang} to the target languages.
Rules:
- Keep all keys exactly the same.
- Translate ONLY the string values (and string items in arrays).
- Keep proper names, brand names (e.g. "Adapta", "CoreAct", "CoreStudio"), and numbers unchanged.
- Return a single JSON object with keys being the target language codes and values being the translated field objects.
- No explanations, ONLY the JSON.

Target languages:
${targets}

Fields to translate:
${fieldsJson}
`;

    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: systemPrompt }],
      response_format: { type: "json_object" },
    });

    const raw = chat.choices[0].message.content ?? "{}";
    const parsed = JSON.parse(raw);

    // O modelo pode devolver { translations: {...} } ou direto { en: {...}, de: {...} }
    const translations = parsed.translations ?? parsed;

    return new Response(JSON.stringify({ translations }));
  } catch (error: any) {
    console.error("[pitch/translate] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
