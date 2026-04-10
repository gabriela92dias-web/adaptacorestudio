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

export const aiActionPlanSchema = z.object({
  governanca_risco: z.array(z.string()).optional().default([]),
  producao_fisica: z.array(z.string()).optional().default([]),
  evento_logistica: z.array(z.string()).optional().default([]),
  digital_distribuicao: z.array(z.string()).optional().default([]),
});
