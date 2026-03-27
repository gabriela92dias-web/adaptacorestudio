import { z } from "zod";
import superjson from 'superjson';

export const schema = z.object({
  what: z.string().optional(),
  why: z.string().optional(),
  how: z.string().optional(),
  when: z.string().optional(),
  quantitative: z.string().optional(),
  rawInput: z.string().optional()
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  theme: string;
  category: string;
  coreValue: string;
  suggestedAssets: string[];
  budgetSpeculation: string;
  funnelSteps: Array<{
    id: string; // atrair, conectar, explicar, clarificar, confianca, validar, friccao, converter, entregar, reter
    action: string;
    strategy: string;
  }>;
};

export const postGenerateBlueprint = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/assistant/generate`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse<{ error: string }>(await result.text());
    throw new Error(errorObject.error);
  }
  return superjson.parse<OutputType>(await result.text());
};
