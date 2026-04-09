import { z } from "zod";

export const aiTemaSchema = z.object({
  proposicoes: z.array(z.string()).min(3, "Mínimo de 3 teses exigido"),
});

export const aiProposicaoSchema = z.object({
  briefing: z.string(),
  channels: z.array(z.string()),
});

export const aiOrcamentoSchema = z.object({
  meta: z.string(),
  goal: z.string(),
});

export const aiBlueprintSchema = z.object({
  blueprint: z.string(),
});

export const aiActionPlanSchema = z.object({
  governanca: z.array(z.string()).optional().default([]),
  producao: z.array(z.string()).optional().default([]),
  distribuicao: z.array(z.string()).optional().default([]),
});
