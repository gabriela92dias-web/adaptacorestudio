export type StrategicDateType = "campaign" | "anchor" | "event" | "week";

export interface StrategicDate {
  start: string; // MM-DD
  end: string; // MM-DD
  type: StrategicDateType;
  label: string;
  description?: string;
}

export const STRATEGIC_DATES: StrategicDate[] = [
  { start: "01-01", end: "01-31", type: "campaign", label: "Janeiro Branco", description: "Paz, Equilíbrio e Saúde Mental" },
  { start: "02-01", end: "02-28", type: "campaign", label: "Fevereiro Roxo", description: "Alzheimer, Lúpus e Fibromialgia" },
  { start: "02-04", end: "02-04", type: "anchor", label: "Dia Mundial do Câncer" },
  { start: "03-26", end: "03-28", type: "event", label: "CONIME 2026" },
  { start: "03-30", end: "04-05", type: "week", label: "Semana do Autismo" },
  { start: "04-02", end: "04-02", type: "anchor", label: "Dia Mundial de Conscientiz. sobre o Autismo" },
  { start: "04-07", end: "04-07", type: "anchor", label: "Dia Mundial da Saúde" },
  { start: "04-11", end: "04-11", type: "anchor", label: "Dia Mund. de Conscientiz. da Doença de Parkinson" },
  { start: "04-20", end: "04-20", type: "event", label: "Marcha da Maconha Anápolis" },
  { start: "05-03", end: "05-03", type: "event", label: "Marcha da Maconha Rio de Janeiro" },
  { start: "05-04", end: "05-10", type: "week", label: "Semana do Dia das Mães" },
  { start: "05-10", end: "05-10", type: "anchor", label: "Dia das Mães" },
  { start: "05-11", end: "05-17", type: "week", label: "Semana da Dor Crônica" },
  { start: "05-18", end: "05-18", type: "anchor", label: "Dia Nacional da Luta Antimanicomial" },
  { start: "05-21", end: "05-23", type: "event", label: "Cannabis Fair 2026" },
  { start: "05-23", end: "05-23", type: "event", label: "Marcha da Maconha Belo Horizonte" },
  { start: "05-23", end: "05-23", type: "event", label: "Marcha da Maconha Campinas" },
  { start: "06-01", end: "06-01", type: "event", label: "WNTC 2026" },
  { start: "06-15", end: "06-21", type: "week", label: "Homenagem Suplicy" },
  { start: "06-21", end: "06-21", type: "event", label: "Marcha da Maconha São Paulo" },
  { start: "06-22", end: "06-28", type: "week", label: "Semana do Pride LGBTQIA+" },
  { start: "06-28", end: "06-28", type: "anchor", label: "Dia Internacional do Orgulho LGBTQIA+" },
  { start: "06-29", end: "07-05", type: "week", label: "Semana do Orgulho: Ser Paciente Medicinal" },
  { start: "08-12", end: "08-14", type: "event", label: "Cannabis Summit Brasil 2026" },
  { start: "08-15", end: "08-16", type: "event", label: "Expo Head Grow 2026" },
  { start: "09-01", end: "09-30", type: "campaign", label: "Setembro Amarelo", description: "Dia Mundial de Prevenção ao Suicídio em 10/09" },
  { start: "09-21", end: "09-21", type: "anchor", label: "Dia Nacional de Luta da Pessoa com Deficiência" },
  { start: "09-26", end: "09-26", type: "event", label: "Febre de Arte" },
  { start: "10-12", end: "10-12", type: "anchor", label: "Dia das Crianças" },
  { start: "11-20", end: "11-22", type: "event", label: "ExpoCannabis Brasil 2026" },
];
