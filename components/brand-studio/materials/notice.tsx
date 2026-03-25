import { useState, useRef } from "react";
import { Megaphone } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { ExportToolbar } from "../export-toolbar";

type LayoutType = "formal" | "modern";
type NoticeType = "interno" | "externo" | "aviso" | "circular";

const LAYOUTS = [
  { id: "formal", label: "Formal", description: "Estilo memorando oficial" },
  { id: "modern", label: "Moderno", description: "Card com ícone visual" }
] as const;

const NOTICE_TYPES: Record<NoticeType, string> = {
  interno: "Comunicado Interno",
  externo: "Comunicado Externo",
  aviso: "Aviso",
  circular: "Circular"
};

const BRAND_DATA = {
  companyName: "ADAPTA",
  website: "www.adapta.com.br",
  primaryColor: "#666666"
};

interface NoticeData {
  type: NoticeType;
  reference: string;
  date: string;
  content: string;
  signatoryName: string;
  signatoryRole: string;
}

// Layout Formal
function FormalLayout({ data }: { data: NoticeData }) {
  return (
    <div style={{ 
      width: "595px", 
      minHeight: "500px",
      backgroundColor: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "40px 50px"
    }}>
      {/* Header */}
      <div style={{ 
        borderBottom: `3px solid ${BRAND_DATA.primaryColor}`,
        paddingBottom: "16px",
        marginBottom: "30px"
      }}>
        <div style={{ 
          fontSize: "24px", 
          fontWeight: "bold",
          color: "#1a1a1a",
          marginBottom: "4px"
        }}>
          {BRAND_DATA.companyName}
        </div>
      </div>

      {/* Título do Comunicado */}
      <div style={{ 
        borderBottom: `1px solid ${BRAND_DATA.primaryColor}33`,
        paddingBottom: "20px",
        marginBottom: "30px"
      }}>
        <div style={{ 
          fontSize: "20px",
          fontWeight: "bold",
          color: BRAND_DATA.primaryColor,
          marginBottom: "12px"
        }}>
          {NOTICE_TYPES[data.type]}
        </div>
        <div style={{ 
          fontSize: "13px",
          color: "#666666",
          lineHeight: "1.6"
        }}>
          <div><strong>Ref:</strong> {data.reference || "Assunto do comunicado"}</div>
          <div><strong>Data:</strong> {data.date || "8 de março de 2026"}</div>
        </div>
      </div>

      {/* Corpo */}
      <div style={{ 
        fontSize: "14px", 
        lineHeight: "1.8",
        color: "#333333",
        marginBottom: "40px",
        whiteSpace: "pre-wrap"
      }}>
        {data.content || `Prezados colaboradores,

Informamos que a partir do dia 15 de março de 2026, entrarão em vigor novas diretrizes operacionais conforme descrito neste comunicado.

Solicitamos a todos que tomem conhecimento das mudanças e ajustem seus procedimentos de acordo.

Para esclarecimentos adicionais, favor entrar em contato com o departamento responsável.`}
      </div>

      {/* Assinatura */}
      <div style={{ 
        marginTop: "60px"
      }}>
        <div style={{ 
          fontSize: "13px",
          color: "#333333",
          marginBottom: "4px"
        }}>
          Atenciosamente,
        </div>
        <div style={{ 
          fontSize: "15px",
          fontWeight: "600",
          color: "#1a1a1a",
          marginTop: "30px"
        }}>
          {data.signatoryName || "João Silva"}
        </div>
        <div style={{ 
          fontSize: "13px",
          color: "#666666"
        }}>
          {data.signatoryRole || "Diretor de Comunicação"}
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        borderTop: `1px solid ${BRAND_DATA.primaryColor}33`,
        marginTop: "40px",
        paddingTop: "16px",
        fontSize: "11px",
        color: "#999999",
        textAlign: "center"
      }}>
        {BRAND_DATA.companyName} • {BRAND_DATA.website}
      </div>
    </div>
  );
}

// Layout Moderno
function ModernLayout({ data }: { data: NoticeData }) {
  return (
    <div style={{ 
      width: "595px", 
      minHeight: "500px",
      backgroundColor: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "40px"
    }}>
      {/* Card Principal */}
      <div style={{ 
        border: `2px solid ${BRAND_DATA.primaryColor}`,
        borderRadius: "8px",
        overflow: "hidden"
      }}>
        {/* Header Colorido */}
        <div style={{ 
          backgroundColor: BRAND_DATA.primaryColor,
          padding: "30px",
          textAlign: "center"
        }}>
          {/* Ícone */}
          <div style={{ 
            width: "60px",
            height: "60px",
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: "28px"
          }}>
            📢
          </div>
          <div style={{ 
            fontSize: "22px",
            fontWeight: "bold",
            color: "#ffffff",
            marginBottom: "8px"
          }}>
            {NOTICE_TYPES[data.type]}
          </div>
          <div style={{ 
            fontSize: "13px",
            color: "rgba(255,255,255,0.9)"
          }}>
            {BRAND_DATA.companyName}
          </div>
        </div>

        {/* Conteúdo */}
        <div style={{ padding: "30px" }}>
          {/* Metadados */}
          <div style={{ 
            backgroundColor: "#f9f9f9",
            padding: "16px",
            borderRadius: "6px",
            marginBottom: "24px",
            fontSize: "12px",
            color: "#666666"
          }}>
            <div style={{ marginBottom: "6px" }}>
              <strong>Assunto:</strong> {data.reference || "Assunto do comunicado"}
            </div>
            <div>
              <strong>Data:</strong> {data.date || "8 de março de 2026"}
            </div>
          </div>

          {/* Corpo */}
          <div style={{ 
            fontSize: "14px", 
            lineHeight: "1.8",
            color: "#333333",
            marginBottom: "30px",
            whiteSpace: "pre-wrap"
          }}>
            {data.content || `Prezados colaboradores,

Informamos que a partir do dia 15 de março de 2026, entrarão em vigor novas diretrizes operacionais.

Solicitamos a todos que tomem conhecimento das mudanças e ajustem seus procedimentos de acordo.

Para esclarecimentos adicionais, favor entrar em contato com o departamento responsável.`}
          </div>

          {/* Assinatura */}
          <div style={{ 
            borderTop: `1px solid ${BRAND_DATA.primaryColor}33`,
            paddingTop: "20px"
          }}>
            <div style={{ 
              fontSize: "14px",
              fontWeight: "600",
              color: "#1a1a1a",
              marginBottom: "4px"
            }}>
              {data.signatoryName || "João Silva"}
            </div>
            <div style={{ 
              fontSize: "12px",
              color: "#666666"
            }}>
              {data.signatoryRole || "Diretor de Comunicação"}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          backgroundColor: "#f9f9f9",
          padding: "16px",
          textAlign: "center",
          fontSize: "11px",
          color: "#999999",
          borderTop: `1px solid ${BRAND_DATA.primaryColor}22`
        }}>
          {BRAND_DATA.website}
        </div>
      </div>
    </div>
  );
}

// Componente Principal
export function Notice() {
  const [layout, setLayout] = useState<LayoutType>("formal");
  const [data, setData] = useState<NoticeData>({
    type: "interno",
    reference: "Atualização de Procedimentos",
    date: "São Paulo, 8 de março de 2026",
    content: `Prezados colaboradores,

Informamos que a partir do dia 15 de março de 2026, entrarão em vigor novas diretrizes operacionais conforme descrito neste comunicado.

Solicitamos a todos que tomem conhecimento das mudanças e ajustem seus procedimentos de acordo com as novas normas estabelecidas.

Para esclarecimentos adicionais, favor entrar em contato com o departamento de recursos humanos.`,
    signatoryName: "João Silva",
    signatoryRole: "Diretor de Comunicação"
  });
  const previewRef = useRef<HTMLDivElement>(null);

  const renderLayout = () => {
    switch (layout) {
      case "formal":
        return <FormalLayout data={data} />;
      case "modern":
        return <ModernLayout data={data} />;
      default:
        return <FormalLayout data={data} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Megaphone className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Comunicado</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Comunicados internos e externos · 2 layouts disponíveis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-1 space-y-4">
          {/* Seletor de Layout */}
          <div className="space-y-2">
            <Label>Layout</Label>
            <div className="grid grid-cols-2 gap-2">
              {LAYOUTS.map((l) => (
                <Button
                  key={l.id}
                  variant={layout === l.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLayout(l.id as LayoutType)}
                >
                  {l.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Formulário */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Tipo de Comunicado</Label>
              <Select
                value={data.type}
                onValueChange={(value: NoticeType) => setData({ ...data, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(NOTICE_TYPES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reference">Assunto/Referência</Label>
              <Input
                id="reference"
                value={data.reference}
                onChange={(e) => setData({ ...data, reference: e.target.value })}
                placeholder="Atualização de Procedimentos"
              />
            </div>

            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                value={data.date}
                onChange={(e) => setData({ ...data, date: e.target.value })}
                placeholder="São Paulo, 8 de março de 2026"
              />
            </div>

            <div>
              <Label htmlFor="content">Corpo do Comunicado</Label>
              <Textarea
                id="content"
                value={data.content}
                onChange={(e) => setData({ ...data, content: e.target.value })}
                placeholder="Digite o conteúdo..."
                rows={10}
                className="font-mono text-xs"
              />
            </div>

            <div>
              <Label htmlFor="signatory">Signatário</Label>
              <Input
                id="signatory"
                value={data.signatoryName}
                onChange={(e) => setData({ ...data, signatoryName: e.target.value })}
                placeholder="João Silva"
              />
            </div>

            <div>
              <Label htmlFor="role">Cargo</Label>
              <Input
                id="role"
                value={data.signatoryRole}
                onChange={(e) => setData({ ...data, signatoryRole: e.target.value })}
                placeholder="Diretor de Comunicação"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border rounded-lg p-6 bg-gray-50 overflow-auto">
            <div 
              ref={previewRef}
              style={{ 
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                borderRadius: "4px",
                display: "inline-block"
              }}
            >
              {renderLayout()}
            </div>
          </div>

          {/* Export Toolbar */}
          <ExportToolbar
            targetRef={previewRef}
            filename={`comunicado-${layout}`}
            scale={2}
          />
        </div>
      </div>
    </div>
  );
}
