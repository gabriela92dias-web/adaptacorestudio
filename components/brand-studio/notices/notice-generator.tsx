import { useState, useRef } from "react";
import { Megaphone, FileText, Instagram, MessageCircle, Mail, MailOpen, Sparkles } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Card } from "../../ui/card";
import { useBrandStudio } from "../../../contexts/brand-context";
import { ExportToolbar } from "../export-toolbar";
import { CopyButton } from "../copy-button";
import { SampleLogo } from "../sample-logo";

interface NoticeData {
  title: string;
  message: string;
  cta: string;
  link: string;
  validity: string;
}

type FormatId = "email" | "story" | "feed" | "whatsapp" | "internal";

const FORMATS = [
  { id: "email", label: "Template de E-mail", icon: Mail, description: "600px width" },
  { id: "story", label: "Stories (9:16)", icon: Instagram, description: "360x640px" },
  { id: "feed", label: "Feed (1:1)", icon: Instagram, description: "480x480px" },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, description: "Texto puro" },
  { id: "internal", label: "E-mail Interno", icon: MailOpen, description: "Texto puro" },
] as const;

// Template de E-mail (600px)
function EmailTemplate({ data, brand }: { data: NoticeData; brand: any }) {
  return (
    <table
      width="600"
      cellPadding="0"
      cellSpacing="0"
      style={{ fontFamily: "Arial, sans-serif", margin: "0 auto", backgroundColor: "#ffffff" }}
    >
      {/* Header */}
      <tbody>
        <tr>
          <td style={{ background: brand.primaryColor || "#1e293b", padding: "24px 32px", textAlign: "center" }}>
            <h1 style={{ color: "#fff", margin: 0, fontSize: "22px", fontWeight: "bold" }}>
              {brand.companyName || "ADAPTA"}
            </h1>
          </td>
        </tr>

        {/* Body */}
        <tr>
          <td style={{ padding: "32px", background: "#fff" }}>
            <h2 style={{ color: brand.primaryColor || "#1e293b", margin: "0 0 16px", fontSize: "20px" }}>
              {data.title}
            </h2>
            <p style={{ color: "#555", fontSize: "14px", lineHeight: "1.8", margin: "0 0 16px" }}>
              {data.message}
            </p>
            {data.validity && (
              <p style={{ color: "#999", fontSize: "12px", margin: "0 0 16px" }}>
                Válido até {data.validity}
              </p>
            )}
            {data.cta && (
              <a
                href={data.link || "#"}
                style={{
                  display: "inline-block",
                  marginTop: "16px",
                  padding: "12px 32px",
                  background: brand.secondaryColor || "#e2e8f0",
                  color: brand.primaryColor || "#1e293b",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                {data.cta}
              </a>
            )}
          </td>
        </tr>

        {/* Footer */}
        <tr>
          <td
            style={{
              background: "#f5f5f5",
              padding: "16px 32px",
              textAlign: "center",
              fontSize: "11px",
              color: "#999",
            }}
          >
            {brand.companyName} · {brand.phone} · {brand.email}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// Stories 9:16 (360x640px)
function StoryTemplate({ data, brand, layers }: { data: NoticeData; brand: any; layers: any }) {
  return (
    <div
      style={{
        width: "360px",
        height: "640px",
        background: `linear-gradient(135deg, ${brand.primaryColor || "#1e293b"} 0%, ${
          brand.primaryColor || "#1e293b"
        }cc 100%)`,
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Círculos decorativos */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: brand.secondaryColor || "#e2e8f0",
          opacity: 0.15,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "-40px",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background: brand.secondaryColor || "#e2e8f0",
          opacity: 0.1,
        }}
      />

      {/* Logo */}
      <div style={{ marginBottom: "32px", zIndex: 1 }}>
        <SampleLogo layers={layers} width={64} height={64} />
      </div>

      {/* Conteúdo */}
      <div style={{ textAlign: "center", color: "#fff", zIndex: 1, width: "100%" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", lineHeight: "1.2", marginBottom: "20px", margin: 0 }}>
          {data.title}
        </h2>
        <p
          style={{
            fontSize: "14px",
            lineHeight: "1.7",
            opacity: 0.9,
            marginBottom: "20px",
            margin: "0 0 20px 0",
          }}
        >
          {data.message}
        </p>
        {data.validity && (
          <p style={{ fontSize: "12px", opacity: 0.7, marginBottom: "24px", margin: "0 0 24px 0" }}>
            Até {data.validity}
          </p>
        )}
        {data.cta && (
          <div
            style={{
              display: "inline-block",
              padding: "14px 40px",
              background: brand.secondaryColor || "#e2e8f0",
              color: brand.primaryColor || "#1e293b",
              borderRadius: "30px",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {data.cta}
          </div>
        )}
      </div>
    </div>
  );
}

// Feed 1:1 (480x480px)
function FeedTemplate({ data, brand, layers }: { data: NoticeData; brand: any; layers: any }) {
  return (
    <div
      style={{
        width: "480px",
        height: "480px",
        background: "#fff",
        borderRadius: "16px",
        border: `1px solid ${brand.primaryColor || "#1e293b"}20`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Barra gradiente superior */}
      <div
        style={{
          height: "6px",
          background: `linear-gradient(90deg, ${brand.primaryColor || "#1e293b"} 0%, ${
            brand.secondaryColor || "#e2e8f0"
          } 100%)`,
        }}
      />

      {/* Conteúdo */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "16px" }}>
          <SampleLogo layers={layers} width={56} height={56} />
        </div>

        {/* Nome da empresa */}
        <div
          style={{
            fontSize: "13px",
            color: brand.primaryColor || "#1e293b",
            fontWeight: "600",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          {brand.companyName || "ADAPTA"}
        </div>

        {/* Título */}
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#222",
            lineHeight: "1.3",
            marginBottom: "16px",
            margin: "0 0 16px 0",
          }}
        >
          {data.title}
        </h2>

        {/* Mensagem */}
        <p
          style={{
            fontSize: "13px",
            color: "#666",
            lineHeight: "1.7",
            marginBottom: "24px",
            margin: "0 0 24px 0",
          }}
        >
          {data.message}
        </p>

        {/* CTA */}
        {data.cta && (
          <div
            style={{
              display: "inline-block",
              padding: "12px 36px",
              background: brand.primaryColor || "#1e293b",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "13px",
            }}
          >
            {data.cta}
          </div>
        )}
      </div>

      {/* Footer */}
      {data.validity && (
        <div
          style={{
            borderTop: "1px solid #e5e5e5",
            padding: "12px",
            textAlign: "center",
            fontSize: "11px",
            color: "#999",
          }}
        >
          Válido até {data.validity}
        </div>
      )}
    </div>
  );
}

// WhatsApp Preview
function WhatsAppPreview({ text }: { text: string }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "40px 20px",
        background: "#e5ddd5",
        borderRadius: "8px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          background: "#dcf8c6",
          padding: "12px 16px",
          borderRadius: "12px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#000",
          whiteSpace: "pre-wrap",
          maxWidth: "80%",
        }}
      >
        {text}
      </div>
    </div>
  );
}

// Internal Email Preview
function InternalEmailPreview({ text }: { text: string }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "700px",
        margin: "0 auto",
        padding: "24px",
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "13px",
        lineHeight: "1.8",
        color: "#333",
        whiteSpace: "pre-wrap",
      }}
    >
      {text}
    </div>
  );
}

export function NoticeGenerator() {
  const { brand, layers } = useBrandStudio();
  const [notice, setNotice] = useState<NoticeData>({
    title: "Promoção Relâmpago",
    message: "Aproveite condições exclusivas com até 30% de desconto em todos os nossos serviços. Oferta por tempo limitado!",
    cta: "Saiba mais",
    link: "https://adapta.com.br/promo",
    validity: "31/03/2026",
  });

  const [selectedFormats, setSelectedFormats] = useState<Set<FormatId>>(
    new Set(["email", "story", "feed"])
  );
  const [generated, setGenerated] = useState(false);

  const emailRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  // Cores com fallback para grayscale
  const primaryColor = brand.primaryColor || "#666666";
  const secondaryColor = brand.secondaryColor || "#e5e5e5";

  const updateNotice = (key: keyof NoticeData, value: string) => {
    setNotice((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFormat = (id: FormatId) => {
    setSelectedFormats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleGenerate = () => {
    setGenerated(true);
  };

  const whatsappText = () => {
    let text = `*${notice.title}*\n\n${notice.message}`;
    if (notice.validity) text += `\n\n_Válido até ${notice.validity}_`;
    if (notice.link) text += `\n\n${notice.link}`;
    if (notice.cta) text += `\n\n*${notice.cta}*`;
    return text;
  };

  // Texto E-mail Interno
  const internalText = () => {
    let text = `Assunto: ${notice.title}\n\n${notice.message}`;
    if (notice.validity) text += `\n\nVálido até: ${notice.validity}`;
    if (notice.link) text += `\nMais informações: ${notice.link}`;
    text += `\n\nAtt,\n${brand.contactName}\n${brand.companyName}`;
    return text;
  };

  const activeFormats = Array.from(selectedFormats);
  const firstFormat = activeFormats[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Megaphone className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Gerador de Avisos</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Crie avisos para múltiplos canais com identidade visual
        </p>
      </div>

      {/* Card de Entrada */}
      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Título do Aviso</Label>
            <Input
              id="title"
              value={notice.title}
              onChange={(e) => updateNotice("title", e.target.value)}
              placeholder="Título principal"
            />
          </div>
          <div>
            <Label htmlFor="cta">Call to Action</Label>
            <Input
              id="cta"
              value={notice.cta}
              onChange={(e) => updateNotice("cta", e.target.value)}
              placeholder="Saiba mais"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="message">Mensagem Principal</Label>
          <Textarea
            id="message"
            value={notice.message}
            onChange={(e) => updateNotice("message", e.target.value)}
            placeholder="Digite a mensagem..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="link">Link (opcional)</Label>
            <Input
              id="link"
              value={notice.link}
              onChange={(e) => updateNotice("link", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label htmlFor="validity">Validade (opcional)</Label>
            <Input
              id="validity"
              value={notice.validity}
              onChange={(e) => updateNotice("validity", e.target.value)}
              placeholder="DD/MM/AAAA"
            />
          </div>
        </div>

        {/* Seleção de Formatos */}
        <div className="border-t pt-4">
          <Label className="mb-3 block">Formatos desejados:</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FORMATS.map((format) => {
              const Icon = format.icon;
              const isSelected = selectedFormats.has(format.id as FormatId);
              
              return (
                <div
                  key={format.id}
                  onClick={() => toggleFormat(format.id as FormatId)}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleFormat(format.id as FormatId)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{format.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{format.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botão Gerar */}
        <Button
          onClick={handleGenerate}
          disabled={selectedFormats.size === 0}
          className="w-full gap-2"
          size="lg"
        >
          <Sparkles className="w-4 h-4" /> Gerar Visualizações
        </Button>
      </Card>

      {/* Tabs de Preview */}
      {generated && activeFormats.length > 0 && (
        <Card className="p-6">
          <Tabs defaultValue={firstFormat} className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-2 mb-6">
              {selectedFormats.has("email") && (
                <TabsTrigger value="email" className="gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </TabsTrigger>
              )}
              {selectedFormats.has("story") && (
                <TabsTrigger value="story" className="gap-2">
                  <Instagram className="w-4 h-4" />
                  Stories
                </TabsTrigger>
              )}
              {selectedFormats.has("feed") && (
                <TabsTrigger value="feed" className="gap-2">
                  <Instagram className="w-4 h-4" />
                  Feed
                </TabsTrigger>
              )}
              {selectedFormats.has("whatsapp") && (
                <TabsTrigger value="whatsapp" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </TabsTrigger>
              )}
              {selectedFormats.has("internal") && (
                <TabsTrigger value="internal" className="gap-2">
                  <MailOpen className="w-4 h-4" />
                  E-mail Interno
                </TabsTrigger>
              )}
            </TabsList>

            {/* Email Template */}
            {selectedFormats.has("email") && (
              <TabsContent value="email" className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6 overflow-auto">
                  <div ref={emailRef} style={{ display: "inline-block" }}>
                    <EmailTemplate data={notice} brand={brand} />
                  </div>
                </div>
                <ExportToolbar targetRef={emailRef} filename="aviso-email" scale={2} />
              </TabsContent>
            )}

            {/* Stories Template */}
            {selectedFormats.has("story") && (
              <TabsContent value="story" className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6 overflow-auto flex justify-center">
                  <div ref={storyRef} style={{ display: "inline-block" }}>
                    <StoryTemplate data={notice} brand={brand} layers={layers} />
                  </div>
                </div>
                <ExportToolbar targetRef={storyRef} filename="aviso-story" scale={2} />
              </TabsContent>
            )}

            {/* Feed Template */}
            {selectedFormats.has("feed") && (
              <TabsContent value="feed" className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6 overflow-auto flex justify-center">
                  <div ref={feedRef} style={{ display: "inline-block" }}>
                    <FeedTemplate data={notice} brand={brand} layers={layers} />
                  </div>
                </div>
                <ExportToolbar targetRef={feedRef} filename="aviso-feed" scale={2} />
              </TabsContent>
            )}

            {/* WhatsApp Template */}
            {selectedFormats.has("whatsapp") && (
              <TabsContent value="whatsapp" className="space-y-4">
                <WhatsAppPreview text={whatsappText()} />
                <div className="flex justify-center">
                  <CopyButton text={whatsappText()} label="Copiar texto" />
                </div>
              </TabsContent>
            )}

            {/* Internal Email Template */}
            {selectedFormats.has("internal") && (
              <TabsContent value="internal" className="space-y-4">
                <InternalEmailPreview text={internalText()} />
                <div className="flex justify-center">
                  <CopyButton text={internalText()} label="Copiar texto" />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </Card>
      )}
    </div>
  );
}
