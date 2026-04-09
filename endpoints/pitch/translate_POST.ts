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

    const API_KEY = process.env.OPENAI_API_KEY;
    if (!API_KEY) {
      const result: Record<string, typeof fields> = {};
      for (const lang of targetLangs) result[lang] = { ...fields };
      return new Response(JSON.stringify({ translations: result }));
    }

    const openai = new OpenAI({ apiKey: API_KEY });
    const fieldsJson = JSON.stringify(fields, null, 2);
    const targets = targetLangs.map(l => '"' + l + '" (' + (LANG_NAMES[l] ?? l) + ')').join(", ");

    const systemPrompt = "You are a professional translator for a corporate pitch deck.\\nTranslate ONLY the text values in the JSON below from " + (LANG_NAMES[sourceLang] ?? sourceLang) + " to the target languages.\\nRules:\\n- Keep all keys exactly the same.\\n- Translate ONLY the string values (and string items in arrays).\\n- Keep proper names, brand names (e.g. 'Adapta', 'CoreAct', 'CoreStudio'), and numbers unchanged.\\n- Return a single JSON object with keys being the target language codes and values being the translated field objects.\\n- No explanations, ONLY the JSON.\\nTarget languages:\\n" + targets;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: fieldsJson },
      ],
      response_format: { type: "json_object" },
    });

    const translatedJson = completion.choices[0].message.content;
    if (!translatedJson) throw new Error("No translation returned from OpenAI");

    return new Response(JSON.stringify({ translations: JSON.parse(translatedJson) }));

  } catch (error: any) {
    console.error("[translate_POST] Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
