// Tradução via Gemini REST API (sem OpenAI)
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

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Sem chave: retorna os campos sem alteração (fallback silencioso)
      console.warn("[pitch/translate] GEMINI_API_KEY não configurada, usando fallback.");
      const result: Record<string, typeof fields> = {};
      for (const lang of targetLangs) result[lang] = { ...fields };
      return new Response(JSON.stringify({ translations: result }));
    }

    const fieldsJson = JSON.stringify(fields, null, 2);
    const targets = targetLangs.map(l => `"${l}" (${LANG_NAMES[l] ?? l})`).join(", ");

    const prompt = `You are a professional translator for a corporate pitch deck.
Translate ONLY the text values in the JSON below from ${LANG_NAMES[sourceLang] ?? sourceLang} to the target languages.
Rules:
- Keep all keys exactly the same.
- Translate ONLY the string values (and string items in arrays).
- Keep proper names and brand names (e.g. "Adapta", "CoreAct", "CoreStudio") unchanged.
- Return ONLY a JSON object with keys being the target language codes and values being the translated field objects.
- No explanations, ONLY the JSON.

Target languages: ${targets}

Fields to translate:
${fieldsJson}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("[pitch/translate] Gemini error:", errText);
      throw new Error(`Gemini HTTP ${geminiRes.status}: ${errText.slice(0, 200)}`);
    }

    const geminiData = await geminiRes.json() as {
      candidates?: Array<{ content: { parts: Array<{ text: string }> } }>;
    };

    const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const parsed = JSON.parse(raw);

    // O modelo pode devolver { translations: {...} } ou direto { en: {...}, de: {...} }
    const translations = parsed.translations ?? parsed;

    return new Response(JSON.stringify({ translations }));

  } catch (error: any) {
    console.error("[pitch/translate] Error:", error?.message ?? error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
