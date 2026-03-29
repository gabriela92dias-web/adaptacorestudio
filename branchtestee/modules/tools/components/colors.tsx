import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Input } from "../../../components/ui/input";
import { 
  Palette, 
  Copy, 
  Check,
  Download,
  Plus,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslations } from "../../../i18n/use-translations";

export function Colors() {
  const { tGroup, language } = useTranslations();
  const t = useMemo(() => tGroup('tools'), [tGroup, language]);
  const actions = useMemo(() => tGroup('actions'), [tGroup, language]);

  const colorPalettes = [
    {
      id: 1,
      name: t.neutralSystem,
      description: t.neutralSystemDescription,
      category: t.system,
      colors: [
        { name: t.pineMist, hex: "#FAFBFA", usage: t.ultraLightBackgrounds },
        { name: t.hempCanvas, hex: "#F7F9F8", usage: t.mainBackground },
        { name: t.sageWhisper, hex: "#EDF1EF", usage: t.neutralBackgrounds },
        { name: t.leafFrost, hex: "#DAE2DD", usage: t.bordersAndDividers },
        { name: t.forestDew, hex: "#B5C5BC", usage: t.tertiaryTexts },
        { name: t.greenSmoke, hex: "#8FA89B", usage: t.secondaryTexts },
        { name: t.emeraldHaze, hex: "#6A8A7A", usage: t.placeholdersMax20 },
        { name: t.deepPine, hex: "#455A4F", usage: t.mediumTexts },
        { name: t.forestShadow, hex: "#2E3D34", usage: t.primaryElements },
        { name: t.midnightGarden, hex: "#1F2A23", usage: t.cardsAndContainers },
        { name: t.darkForest, hex: "#1A231D", usage: t.darkBackgrounds },
        { name: t.blackEarth, hex: "#141A17", usage: t.mainBackgroundDark },
      ],
      updatedAt: "2026-03-09",
    },
  ];

  const recentColors = [
    { hex: "#141A17", name: t.blackEarth, timestamp: "2" },
    { hex: "#F7F9F8", name: t.hempCanvas, timestamp: "3" },
    { hex: "#6A8A7A", name: t.emeraldHaze, timestamp: "5" },
    { hex: "#1F2A23", name: t.midnightGarden, timestamp: t.yesterday },
  ];

  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState("#0a0a0a");

  const copyToClipboard = (text: string, name?: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(name || text);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t.colorPaletteTitle}</h1>
          <p className="text-muted-foreground mt-1">
            {t.colorSystemDescription}
          </p>
        </div>
        <Button className="gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          {t.newPalette}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardDescription>{t.totalPalettes}</CardDescription>
            <CardTitle className="text-2xl">{colorPalettes.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {t.organized}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardDescription>{t.totalColors}</CardDescription>
            <CardTitle className="text-2xl">
              {colorPalettes.reduce((acc, p) => acc + p.colors.length, 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {t.cataloged}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardDescription>{t.systemColors}</CardDescription>
            <CardTitle className="text-2xl">12</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {t.tealForest}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardDescription>{t.lastUpdate}</CardDescription>
            <CardTitle className="text-2xl">09 mar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              2026
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="palettes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="palettes">{t.palettes}</TabsTrigger>
          <TabsTrigger value="generator">{t.generator}</TabsTrigger>
          <TabsTrigger value="recent">{t.recent}</TabsTrigger>
        </TabsList>

        {/* Palettes Tab */}
        <TabsContent value="palettes" className="space-y-4">
          {colorPalettes.map((palette) => (
            <Card key={palette.id} className="border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-xl">{palette.name}</CardTitle>
                      <Badge variant="secondary">{palette.category}</Badge>
                    </div>
                    <CardDescription>{palette.description}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-3 h-3" />
                    {actions.export}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {palette.colors.map((color) => (
                    <Card key={color.hex} className="border-border overflow-hidden group">
                      <div
                        className="h-20 w-full cursor-pointer transition-all group-hover:h-24"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyToClipboard(color.hex, color.name)}
                      />
                      <CardContent className="p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium truncate">{color.name}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyToClipboard(color.hex, color.name)}
                          >
                            {copiedColor === color.name ? (
                              <Check className="w-3 h-3 text-neutral-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        <code className="text-[10px] font-mono text-muted-foreground block">
                          {color.hex}
                        </code>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {color.usage}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                  <span>{palette.colors.length} {t.colorsLowercase}</span>
                  <span>{t.updatedOn} {new Date(palette.updatedAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Generator Tab */}
        <TabsContent value="generator" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>{t.colorGenerator}</CardTitle>
              <CardDescription>
                {t.colorGeneratorDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Color Picker */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t.colorPicker}
                    </label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="h-12 w-20 rounded border border-border cursor-pointer"
                      />
                      <div className="flex-1">
                        <Input
                          value={customColor}
                          onChange={(e) => setCustomColor(e.target.value)}
                          placeholder="#000000"
                          className="font-mono"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(customColor)}
                      >
                        {copiedColor === customColor ? (
                          <Check className="w-4 h-4 text-neutral-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">{t.conversions}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-muted-foreground">HEX:</span>
                        <code className="font-mono">{customColor}</code>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-muted-foreground">RGB:</span>
                        <code className="font-mono">
                          {parseInt(customColor.slice(1, 3), 16)}, {parseInt(customColor.slice(3, 5), 16)}, {parseInt(customColor.slice(5, 7), 16)}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t.preview}
                    </label>
                    <div
                      className="h-32 rounded-lg border border-border"
                      style={{ backgroundColor: customColor }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      {actions.save}
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      {actions.share}
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      {t.add}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Tab */}
        <TabsContent value="recent" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>{t.recentColors}</CardTitle>
              <CardDescription>
                {t.recentColorsDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recentColors.map((color, index) => (
                  <Card key={index} className="border-border overflow-hidden group cursor-pointer" onClick={() => copyToClipboard(color.hex, color.name)}>
                    <div
                      className="h-24 w-full"
                      style={{ backgroundColor: color.hex }}
                    />
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium">{color.name}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(color.hex, color.name);
                          }}
                        >
                          {copiedColor === color.name ? (
                            <Check className="w-3 h-3 text-neutral-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                      <code className="text-[10px] font-mono text-muted-foreground block">
                        {color.hex}
                      </code>
                      <p className="text-[10px] text-muted-foreground">
                        {color.timestamp === t.yesterday ? color.timestamp : `Há ${color.timestamp} horas`}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}