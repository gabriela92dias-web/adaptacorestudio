import { Link } from "../../../components/ui/link";
import { 
  Wrench, 
  PenTool, 
  FileText, 
  Package, 
  Image, 
  Palette, 
  Wand2, 
  Instagram,
  BarChart3,
  ArrowRight,
  Sparkles,
  Mic,
  Map,
  Share2
} from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { useTranslations } from "../../../i18n/use-translations";
import { useMemo } from "react";

export function ToolsHome() {
  const { tGroup, language } = useTranslations();
  const t = useMemo(() => tGroup('tools'), [tGroup, language]);
  const status = useMemo(() => tGroup('status'), [tGroup, language]);

  const tools = [
    {
      titleKey: "logoColorsTitle" as const,
      descKey: "logoColorsDescription" as const,
      icon: PenTool,
      href: "/tools/logo-cores",
    },
    {
      titleKey: "documentsTitle" as const,
      descKey: "documentsDescription" as const,
      icon: FileText,
      href: "/tools/documentos",
    },
    {
      titleKey: "productsTitle" as const,
      descKey: "productsDescription" as const,
      icon: Package,
      href: "/tools/produtos",
    },
    {
      titleKey: "visualTitle" as const,
      descKey: "visualDescription" as const,
      icon: Image,
      href: "/tools/visual",
    },
    {
      titleKey: "colorsTitle" as const,
      descKey: "colorsDescription" as const,
      icon: Palette,
      href: "/tools/colors",
    },
    {
      titleKey: "gradientsTitle" as const,
      descKey: "gradientsDescription" as const,
      icon: Wand2,
      href: "/tools/gradients",
    },
    {
      titleKey: "mascotsTitle" as const,
      descKey: "mascotsDescription" as const,
      icon: Sparkles,
      href: "/tools/mascots",
    },
    {
      titleKey: "instagramTitle" as const,
      descKey: "instagramDescription" as const,
      icon: Instagram,
      href: "/tools/instagram-preview",
      badge: "comingSoon" as const,
    },
    {
      titleKey: "analysisTitle" as const,
      descKey: "analysisDescription" as const,
      icon: BarChart3,
      href: "/tools/analysis",
    },
    {
      titleKey: "verdeVoxTitle" as const,
      descKey: "verdeVoxDescription" as const,
      icon: Mic,
      href: "/tools/verdevox-core",
    },
    {
      titleKey: "operationMapTitle" as const,
      descKey: "operationMapDescription" as const,
      icon: Map,
      href: "/tools/operation-map",
    },
    {
      titleKey: "shareTitle" as const,
      descKey: "shareDescription" as const,
      icon: Share2,
      href: "/tools/timeline?view=mlabs-integration",
    },
  ];

  return (
    <div className="h-full p-8 overflow-auto bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted border">
              <Wrench className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
              <p className="text-muted-foreground">{t.homeSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link key={tool.href} to={tool.href}>
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border bg-card h-full group hover:border-primary/50">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-lg bg-muted border w-fit group-hover:bg-accent transition-colors">
                      <tool.icon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    {tool.badge && (
                      <Badge variant="outline" className="text-xs">
                        {status[tool.badge]}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-foreground/80 transition-colors">
                      {t[tool.titleKey]}
                    </h3>
                    <p className="text-sm text-muted-foreground">{t[tool.descKey]}</p>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground group-hover:gap-2 transition-all">
                    <span>{t.access}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}