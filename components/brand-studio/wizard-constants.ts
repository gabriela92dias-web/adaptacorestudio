import {
  Target,
  HeartHandshake,
  Stethoscope,
  CalendarIcon,
  FileText,
} from "lucide-react";

export const ACTION_TYPES = [
  { id: "institucional", name: "Conscientização Institucional", icon: Target },
  { id: "acolhimento",   name: "Mutirão / Acolhimento",        icon: HeartHandshake },
  { id: "medicos",       name: "Educação Prescritora",          icon: Stethoscope },
  { id: "sazonal",       name: "Data da Saúde / Sazonal",       icon: CalendarIcon },
  { id: "pesquisa",      name: "Pesquisa / Ciência",            icon: FileText },
];

export const FUNNELS = [
  { id: "awareness",     name: "Conscientizar",  desc: "Opinião Pública",   pct: "100%" },
  { id: "consideration", name: "Educação Médica", desc: "Tabus Clínicos",   pct: "83%"  },
  { id: "conversion",    name: "Acolhimento",     desc: "Entrada Oficial",   pct: "66%"  },
  { id: "retention",     name: "Acompanhamento",  desc: "Zelo Contínuo",     pct: "83%"  },
  { id: "expansion",     name: "Apoio Social",    desc: "Rede de Indicação", pct: "100%" },
];

export const WIZARD_TYPE_TO_CAMPAIGN_TYPE: Record<string, "awareness" | "brand_engagement" | "corporate_event" | "product_launch" | "seasonal_promotion"> = {
  institucional: "awareness",
  acolhimento:   "corporate_event",
  medicos:       "product_launch",
  sazonal:       "seasonal_promotion",
  pesquisa:      "brand_engagement",
};
