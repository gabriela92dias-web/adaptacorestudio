import { useLanguage } from "../../../contexts/language-context";
import { useTranslations } from "../../../i18n/use-translations";
import { 
  Map, 
  Target,
  TrendingUp,
  Zap, 
  Package, 
  FileText, 
  Palette,
  ArrowRight,
  Circle,
  Users,
  Briefcase,
  Lightbulb,
  CheckCircle2,
  Clock,
  BarChart3,
  Languages,
  Shield,
  Database,
  Activity
} from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

type Language = "pt" | "en";

const content = {
  pt: {
    header: {
      title: "Mapa da Operação ADAPTA",
      subtitle: "Visão estratégica da gestão de marca integrada"
    },
    mission: {
      label: "O QUE É",
      title: "Plataforma integrada de visualização de projetos para centralizar marketing, branding e comunicação",
      description: ""
    },
    modules: {
      title: "OS 3 MÓDULOS",
      brand: {
        number: "1",
        title: "BRAND",
        subtitle: "Design System & Identidade",
        objectives: "Objetivos",
        items: [
          "Rebranding completo da marca",
          "Design system escalável e documentado",
          "Sistema de cores (Color Core) - 45 tons",
          "Identidade visual unificada e profissional"
        ],
        deliverable: "Entregável",
        deliverableText: "Identidade visual renovada + DS completo"
      },
      tools: {
        number: "2",
        title: "TOOLS",
        subtitle: "Produção & Automação",
        objectives: "Objetivos",
        items: [
          "Ferramentas de criação de conteúdo",
          "Templates automatizados com brand",
          "Gestão de pedidos integrada",
          "Workflow otimizado e centralizado"
        ],
        deliverable: "Entregável",
        deliverableText: "Ferramentas prontas para uso operacional"
      },
      marketing: {
        number: "3",
        title: "MARKETING",
        subtitle: "Distribuição & Performance",
        objectives: "Objetivos",
        items: [
          "Campanhas multi-canal integradas",
          "Analytics e métricas em tempo real",
          "Gestão de social media centralizada",
          "ROI medido e otimização contínua"
        ],
        deliverable: "Entregável",
        deliverableText: "Ecossistema de marketing completo"
      }
    },
    integration: {
      title: "ARQUITETURA DA INTEGRAÇÃO",
      subtitle: "Como a plataforma unifica a operação",
      governance: {
        title: "Governança Central",
        items: [
          "Single source of truth - Toda marca em 1 lugar",
          "Versionamento automático de todos os assets",
          "Aprovações e histórico rastreável",
          "Compliance automático com brand guidelines"
        ]
      },
      flow: {
        title: "Fluxo Operacional",
        step1: {
          label: "1. ESTRATÉGIA",
          title: "BRAND define diretrizes",
          text: "Design system, cores, tipografia, elementos visuais"
        },
        step2: {
          label: "2. PRODUÇÃO",
          title: "TOOLS aplica automaticamente",
          text: "Templates pré-aprovados com brand embarcado",
          metric: "-80% tempo de aprovação"
        },
        step3: {
          label: "3. ATIVAÇÃO",
          title: "MARKETING distribui e mede",
          text: "Campanhas consistentes com analytics integrado",
          metric: "+250% produtividade"
        }
      },
      benefits: {
        title: "Benefícios da Integração",
        items: [
          "Consistência visual 100% garantida",
          "Redução de 70% no retrabalho",
          "Aumento de 250% na produtividade",
          "Time-to-market reduzido em 80%"
        ]
      }
    },
    kpis: [
      { value: "-80%", label: "TEMPO APROVAÇÃO" },
      { value: "100%", label: "CONSISTÊNCIA" },
      { value: "-70%", label: "RETRABALHO" },
      { value: "+250%", label: "PRODUTIVIDADE" }
    ],
    results: {
      title: "RESULTADOS ENTREGUES",
      items: [
        "Plataforma funcional e integrada (CoreStudio)",
        "Identidade visual renovada e profissional",
        "Design system escalável e documentado",
        "Sistema de cores rico e versátil (45 tons)",
        "Ferramentas de marketing prontas para uso"
      ]
    }
  },
  en: {
    header: {
      title: "ADAPTA Operation Map",
      subtitle: "Strategic vision of integrated brand management"
    },
    mission: {
      label: "WHAT IT IS",
      title: "Integrated project visualization platform to centralize marketing, branding and communication",
      description: ""
    },
    modules: {
      title: "THE 3 MODULES",
      brand: {
        number: "1",
        title: "BRAND",
        subtitle: "Design System & Identity",
        objectives: "Objectives",
        items: [
          "Complete brand rebranding",
          "Scalable and documented design system",
          "Color system (Color Core) - 45 tones",
          "Unified and professional visual identity"
        ],
        deliverable: "Deliverable",
        deliverableText: "Renewed visual identity + Complete DS"
      },
      tools: {
        number: "2",
        title: "TOOLS",
        subtitle: "Production & Automation",
        objectives: "Objectives",
        items: [
          "Content creation tools",
          "Automated templates with brand",
          "Integrated order management",
          "Optimized and centralized workflow"
        ],
        deliverable: "Deliverable",
        deliverableText: "Ready-to-use operational tools"
      },
      marketing: {
        number: "3",
        title: "MARKETING",
        subtitle: "Distribution & Performance",
        objectives: "Objectives",
        items: [
          "Integrated multi-channel campaigns",
          "Real-time analytics and metrics",
          "Centralized social media management",
          "Measured ROI and continuous optimization"
        ],
        deliverable: "Deliverable",
        deliverableText: "Complete marketing ecosystem"
      }
    },
    integration: {
      title: "INTEGRATION ARCHITECTURE",
      subtitle: "How the platform unifies the operation",
      governance: {
        title: "Central Governance",
        items: [
          "Single source of truth - Entire brand in 1 place",
          "Automatic versioning of all assets",
          "Traceable approvals and history",
          "Automatic compliance with brand guidelines"
        ]
      },
      flow: {
        title: "Operational Flow",
        step1: {
          label: "1. STRATEGY",
          title: "BRAND defines guidelines",
          text: "Design system, colors, typography, visual elements"
        },
        step2: {
          label: "2. PRODUCTION",
          title: "TOOLS applies automatically",
          text: "Pre-approved templates with embedded brand",
          metric: "-80% approval time"
        },
        step3: {
          label: "3. ACTIVATION",
          title: "MARKETING distributes and measures",
          text: "Consistent campaigns with integrated analytics",
          metric: "+250% productivity"
        }
      },
      benefits: {
        title: "Integration Benefits",
        items: [
          "100% guaranteed visual consistency",
          "70% reduction in rework",
          "250% increase in productivity",
          "80% reduced time-to-market"
        ]
      }
    },
    kpis: [
      { value: "-80%", label: "APPROVAL TIME" },
      { value: "100%", label: "CONSISTENCY" },
      { value: "-70%", label: "REWORK" },
      { value: "+250%", label: "PRODUCTIVITY" }
    ],
    results: {
      title: "DELIVERED RESULTS",
      items: [
        "Functional and integrated platform (CoreStudio)",
        "Renewed and professional visual identity",
        "Scalable and documented design system",
        "Rich and versatile color system (45 tones)",
        "Ready-to-use marketing tools"
      ]
    }
  }
};

export function OperationMap() {
  const { language } = useLanguage();
  const t = content[language];
  const translations = useTranslations(language);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header compacto */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        <div>
          <h1 className="text-xl font-bold text-foreground">{t.header.title}</h1>
          <p className="text-[10px] text-muted-foreground">{t.header.subtitle}</p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-hidden">
        <div className="h-full grid grid-rows-[auto,auto,1fr,auto] gap-4">
          
          {/* MISSÃO CENTRAL */}
          <Card className="p-4 border-2 border-primary/40 bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20 border border-primary/40">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <Badge className="mb-1.5 bg-primary/10 text-primary border-primary/40 text-[10px]">{t.mission.label}</Badge>
                <h2 className="text-sm font-bold text-foreground leading-tight">{t.mission.title}</h2>
              </div>
            </div>
          </Card>

          {/* OS 3 MÓDULOS - LADO A LADO */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-border">
              <Database className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">{t.modules.title}</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* BRAND */}
              <Card className="p-4 border-2 border-primary/40 bg-gradient-to-br from-primary/10 to-transparent">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary border-2 border-background flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold text-sm">{t.modules.brand.number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-foreground mb-0.5">{t.modules.brand.title}</h3>
                    <p className="text-[10px] text-muted-foreground">{t.modules.brand.subtitle}</p>
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  {t.modules.brand.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-[11px] text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-medium text-foreground">{t.modules.brand.deliverableText}</span>
                </div>
              </Card>

              {/* TOOLS */}
              <Card className="p-4 border-2 border-border bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center flex-shrink-0">
                    <span className="text-foreground font-bold text-sm">{t.modules.tools.number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-foreground mb-0.5">{t.modules.tools.title}</h3>
                    <p className="text-[10px] text-muted-foreground">{t.modules.tools.subtitle}</p>
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  {t.modules.tools.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                      <span className="text-[11px] text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <CheckCircle2 className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] font-medium text-foreground">{t.modules.tools.deliverableText}</span>
                </div>
              </Card>

              {/* MARKETING */}
              <Card className="p-4 border-2 border-border bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center flex-shrink-0">
                    <span className="text-foreground font-bold text-sm">{t.modules.marketing.number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-foreground mb-0.5">{t.modules.marketing.title}</h3>
                    <p className="text-[10px] text-muted-foreground">{t.modules.marketing.subtitle}</p>
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  {t.modules.marketing.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                      <span className="text-[11px] text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <CheckCircle2 className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] font-medium text-foreground">{t.modules.marketing.deliverableText}</span>
                </div>
              </Card>
            </div>
          </div>

          {/* ÁREA DE INTEGRAÇÃO */}
          <div className="grid grid-cols-2 gap-6 overflow-hidden">
            
            {/* COLUNA ESQUERDA - FLUXO + GOVERNANÇA */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Zap className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">{t.integration.title}</h3>
              </div>

              {/* FLUXO INTEGRADO */}
              <Card className="flex-1 p-4 border-2 border-primary/40 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
                <div className="mb-3">
                  <h4 className="text-xs font-bold text-foreground mb-1">{t.integration.flow.title}</h4>
                  <p className="text-[10px] text-muted-foreground">{t.integration.subtitle}</p>
                </div>

                <div className="space-y-2">
                  {/* Step 1 */}
                  <div className="flex items-start gap-2.5 p-2.5 bg-primary/10 rounded-lg border border-primary/30">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-bold text-xs">1</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge className="mb-1 bg-primary/20 text-primary border-primary/40 text-[9px] h-4 px-1.5">{t.integration.flow.step1.label}</Badge>
                      <h5 className="text-[11px] font-bold text-foreground mb-0.5">{t.integration.flow.step1.title}</h5>
                      <p className="text-[10px] text-muted-foreground">{t.integration.flow.step1.text}</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-4 h-4 text-primary rotate-90" />
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-2.5 p-2.5 bg-accent rounded-lg border border-border">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-foreground font-bold text-xs">2</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge className="mb-1 bg-muted text-foreground border-border text-[9px] h-4 px-1.5">{t.integration.flow.step2.label}</Badge>
                      <h5 className="text-[11px] font-bold text-foreground mb-0.5">{t.integration.flow.step2.title}</h5>
                      <p className="text-[10px] text-muted-foreground mb-1">{t.integration.flow.step2.text}</p>
                      <Badge className="bg-primary/20 text-primary border-primary/40 text-[9px] h-4 px-1.5">{t.integration.flow.step2.metric}</Badge>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-2.5 p-2.5 bg-accent rounded-lg border border-border">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-foreground font-bold text-xs">3</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge className="mb-1 bg-muted text-foreground border-border text-[9px] h-4 px-1.5">{t.integration.flow.step3.label}</Badge>
                      <h5 className="text-[11px] font-bold text-foreground mb-0.5">{t.integration.flow.step3.title}</h5>
                      <p className="text-[10px] text-muted-foreground mb-1">{t.integration.flow.step3.text}</p>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-[9px] h-4 px-1.5">{t.integration.flow.step3.metric}</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* COLUNA DIREITA - GOVERNANÇA + BENEFÍCIOS */}
            <div className="flex flex-col gap-3">
              <div className="h-[38px]"></div>

              {/* GOVERNANÇA */}
              <Card className="p-4 border border-border bg-card">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-primary" />
                  <h4 className="text-xs font-bold text-foreground">{t.integration.governance.title}</h4>
                </div>
                <div className="space-y-1.5">
                  {t.integration.governance.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-accent rounded border border-border">
                      <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-[10px] text-foreground leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* BENEFÍCIOS */}
              <Card className="flex-1 p-4 border border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h4 className="text-xs font-bold text-foreground">{t.integration.benefits.title}</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {t.integration.benefits.items.map((item, i) => (
                    <div key={i} className="p-2 bg-primary/10 rounded border border-primary/30 text-center">
                      <div className="text-[10px] font-medium text-foreground leading-tight">{item}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* FOOTER - KPIs da integração */}
          <div className="grid grid-cols-4 gap-3">
            {t.kpis.map((kpi, index) => (
              <Card key={index} className="p-3 border border-border bg-card text-center">
                <div className="text-xl font-bold text-primary mb-0.5">{kpi.value}</div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider">{kpi.label}</div>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}