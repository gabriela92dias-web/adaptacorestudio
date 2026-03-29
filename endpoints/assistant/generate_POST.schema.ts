import { z } from "zod";
import superjson from 'superjson';

export const schema = z.object({
  magicInput: z.string(),
});

export type InputType = z.infer<typeof schema>;

export type DnaBlock = {
  direcao: "interna" | "externa" | "hibrida";
  experiencia: "fisica" | "digital" | "hibrida";
  objetivo_primario: string;
  segmento_publico: string;
};

export type Gate = {
  id: string;
  name: string;
  critical: boolean;
  ok: boolean;
};

export type Modulo = {
  id: string;
  bloco: number;
  nome: string;
  descricao: string;
  status: "on" | "off";
  owner: string; 
  cost: number; 
  due: string;  
  ok: boolean;
  okTrigger: string;
};

export type OutputType = {
  dna: DnaBlock;
  modulos: Modulo[];
  gates: Gate[];
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
