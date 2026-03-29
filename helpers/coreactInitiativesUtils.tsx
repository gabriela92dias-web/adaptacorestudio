import { z } from "zod";
import { InitiativeStatusArrayValues } from "./schema";

export const formatDate = (date: Date | string | null) => {
  if (!date) return "Não definido";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(date));
};

export const statusMap: Record<string, { label: string; variant: "primary" | "secondary" | "outline" | "destructive" | "success" | "warning" }> = {
  solicitada: { label: "Solicitada", variant: "warning" },
  aprovada: { label: "Aprovada", variant: "primary" },
  recusada: { label: "Recusada", variant: "destructive" },
  em_andamento: { label: "Em Andamento", variant: "success" },
  concluida: { label: "Concluída", variant: "secondary" },
};

export const initiativeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional().nullable(),
  status: z.enum(InitiativeStatusArrayValues).default("solicitada"),
  responsibleId: z.string().optional().nullable(),
  sectorId: z.string().optional().nullable(),
  solicitanteId: z.string().optional().nullable(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  type: z.string().optional().nullable(),
  context: z.string().optional().nullable(),
});

export type InitiativeFormData = z.infer<typeof initiativeSchema>;