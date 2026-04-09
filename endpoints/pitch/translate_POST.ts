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

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      const result: Record<string, typeof fields> = {};
      for (const lang of targetLangs) result[lang] = { ...fields };
      return new Response(JSON.stringify({ translations: result }));
    }

    const fieldsJson = JSON.stringify(fields, null, 2);
    const targets = targetLangs.map(l => '"' + l + '" (' + (LANG_NAMES[ l] ?? l) + ')').join(", ");

    const systemPrompt = "You are a professional translator for a corporate pitch deck.\nTranslate ONLY the text values in the JSON below from " + (LANG_NAMES[ sourceLang] ?? sourceLang) + " to the target languages.\nRules:\n- Keep all keys exactly the same.\n- Translate ONLY the string values (and string items in arrays).\n- Keep proper names, brand names (e.g. 'Adapta', 'CoreAct', 'CoreStudio'), and numbers unchanged.\n- Return a single JSON object with keys being the target language codes and values being the translated field objects.\n- No explanations, ONLY the JSON.\nTarget languages:\n"  + targets;

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt + "\n\nInput JSON:\n" + fieldsJson }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Gemini API error: " + response.status + " " + errorText);
    }

    const data = await response.json() as any;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error(\"No translation returned from Gemini\");
    
    const cleanJson = text.replace(/[`]+json/g, "").replace(/[`]+/g, "").trim();
    
    return new Response(JSON.stringify({ translations: JSON.parse(cleanJson) }));

  } catch (error: any) {
    console.error("[translate_POST] Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
