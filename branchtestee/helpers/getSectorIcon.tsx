import {
  Heart,
  MessageCircle,
  Sprout,
  Truck,
  Wallet,
  Stethoscope,
  Scissors,
  Users,
  Monitor,
  Scale,
  Megaphone,
  ShoppingCart,
  Package,
  Factory,
  ShieldCheck,
  FlaskConical,
  Briefcase,
  GraduationCap,
  Headphones,
  Shield,
  ShoppingBag,
  PenTool,
  Settings,
  Lightbulb,
  Building2,
  CircleDot,
  Hexagon,
  Star,
  Zap,
  Gem,
  LucideIcon
} from "lucide-react";

export function getSectorSortWeight(name: string): number {
  const normalized = name.toLowerCase().trim();

  // Ordem definida pelo usuário: Financeiro > Cultivo > Núcleo Terapêutico > Comunicação > Acolhimento > Expedição > Trima
  if (normalized.includes("financeiro")) return 10;
  if (normalized.includes("cultivo")) return 20;
  if (
    normalized.includes("terapêutico") || 
    normalized.includes("terapeutico") || 
    normalized.includes("terapia") || 
    normalized.includes("saúde") || 
    normalized.includes("saude")
  ) return 30;
  if (normalized.includes("comunicação") || normalized.includes("comunicacao")) return 40;
  if (normalized.includes("acolhimento")) return 50;
  if (normalized.includes("expedição") || normalized.includes("expedicao")) return 60;
  if (normalized.includes("trima")) return 70;

  // Outros setores conhecidos
  if (normalized.includes("administrativo") || normalized.includes("admin")) return 75;
  if (normalized.includes("operações") || normalized.includes("operacoes")) return 76;
  if (normalized.includes("marketing")) return 77;
  if (normalized.includes("recursos humanos") || normalized.includes("rh") || normalized.includes("pessoas")) return 78;
  if (normalized.includes("educação") || normalized.includes("educacao") || normalized.includes("ensino") || normalized.includes("treinamento")) return 79;
  if (normalized.includes("jurídico") || normalized.includes("juridico") || normalized.includes("legal")) return 80;
  if (normalized.includes("segurança") || normalized.includes("seguranca")) return 81;
  if (normalized.includes("tecnologia") || normalized.includes("ti") || normalized.includes("dev")) return 82;
  if (normalized.includes("qualidade")) return 83;
  if (normalized.includes("pesquisa") || normalized.includes("p&d")) return 84;
  if (normalized.includes("produção") || normalized.includes("producao")) return 85;
  if (normalized.includes("design") || normalized.includes("criação") || normalized.includes("criacao")) return 86;
  if (normalized.includes("logística") || normalized.includes("logistica")) return 87;
  if (normalized.includes("vendas") || normalized.includes("comercial")) return 88;
  if (normalized.includes("compras") || normalized.includes("suprimentos")) return 89;
  if (normalized.includes("suporte") || normalized.includes("atendimento")) return 90;

  if (normalized.includes("exemplo")) return 100;

  return 95;
}

/**
 * Returns a specific Lucide icon based on keywords found in the sector name.
 * Falls back to a set of distinct icons depending on the provided index.
 */
export function getSectorIcon(name: string, index?: number): LucideIcon {
  const normalized = name.toLowerCase().trim();

  if (normalized.includes("acolhimento")) return Heart;
  if (normalized.includes("comunicação") || normalized.includes("comunicacao")) return MessageCircle;
  if (normalized.includes("cultivo")) return Sprout;
  if (normalized.includes("expedição") || normalized.includes("expedicao")) return Truck;
  if (normalized.includes("financeiro")) return Wallet;
  if (
    normalized.includes("terapêutico") || 
    normalized.includes("terapeutico") || 
    normalized.includes("terapia") || 
    normalized.includes("saúde") || 
    normalized.includes("saude")
  ) return Stethoscope;
  if (normalized.includes("trima")) return Scissors;
  if (normalized.includes("recursos humanos") || normalized.includes("rh") || normalized.includes("pessoas")) return Users;
  if (normalized.includes("tecnologia") || normalized.includes("ti") || normalized.includes("dev")) return Monitor;
  if (normalized.includes("jurídico") || normalized.includes("juridico") || normalized.includes("legal")) return Scale;
  if (normalized.includes("marketing")) return Megaphone;
  if (normalized.includes("vendas") || normalized.includes("comercial")) return ShoppingCart;
  if (normalized.includes("logística") || normalized.includes("logistica")) return Package;
  if (normalized.includes("produção") || normalized.includes("producao")) return Factory;
  if (normalized.includes("qualidade")) return ShieldCheck;
  if (normalized.includes("pesquisa") || normalized.includes("p&d")) return FlaskConical;
  if (normalized.includes("administrativo") || normalized.includes("admin")) return Briefcase;
  if (
    normalized.includes("educação") || 
    normalized.includes("educacao") || 
    normalized.includes("ensino") || 
    normalized.includes("treinamento")
  ) return GraduationCap;
  if (normalized.includes("suporte") || normalized.includes("atendimento")) return Headphones;
  if (normalized.includes("segurança") || normalized.includes("seguranca")) return Shield;
  if (normalized.includes("compras") || normalized.includes("suprimentos")) return ShoppingBag;
  if (normalized.includes("design") || normalized.includes("criação") || normalized.includes("criacao")) return PenTool;
  if (normalized.includes("operações") || normalized.includes("operacoes")) return Settings;
  if (normalized.includes("exemplo")) return Lightbulb;

  if (index !== undefined) {
    const fallbacks = [CircleDot, Hexagon, Star, Zap, Gem, Building2];
    return fallbacks[index % fallbacks.length];
  }

  return Building2;
}