import { z } from "zod";

export const aiTemaSchema = z.object({
  proposicoes: z.array(z.string()).min(3, "Mínimo de 3 teses exigido"),
});

export const aiProposicaoSchema = z.object({
  trilha_interna: z.array(z.string()).optional().default([]),
  trilha_externa: z.array(z.string()).optional().default([]),
});

export const aiOrcamentoSchema = z.object({
  linhas: z.array(
    z.object({
      categoria: z.string(),
      valor_estimado: z.number(),
      motivo: z.string(),
    })
  ),
  total_estimado: z.number(),
});

export const aiBlueprintSchema = z.object({
  blueprint: z.string(),
});

export const aiActionPlanSchema = z.record(z.array(z.string()));

