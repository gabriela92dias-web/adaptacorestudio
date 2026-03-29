import { useState, useRef } from "react";
import { Mail } from "lucide-react";
import { Button } from "../../ui/button";
import { ExportToolbar } from "../export-toolbar";

type LayoutType = "horizontal" | "vertical";

const LAYOUTS = [
  { id: "horizontal", label: "Horizontal", description: "Logo à esquerda" },
  { id: "vertical", label: "Vertical", description: "Logo no topo" }
] as const;

const BRAND_DATA = {
  companyName: "ADAPTA",
  contactName: "João Silva",
  role: "Diretor de Comunicação",
  phone: "(11) 99999-9999",
  email: "joao@adapta.com.br",
  website: "www.adapta.com.br",
  primaryColor: "#666666"
};

// Layout Horizontal
function HorizontalLayout() {
  const signatureHtml = `
    <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; line-height: 1.6;">
      <tr>
        <td style="padding-right: 20px; border-right: 2px solid ${BRAND_DATA.primaryColor};">
          <div style="width: 48px; height: 48px; background-color: ${BRAND_DATA.primaryColor}; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px;">
            A
          </div>
        </td>
        <td style="padding-left: 20px;">
          <div style="font-size: 16px; font-weight: bold; color: #1a1a1a; margin-bottom: 2px;">
            ${BRAND_DATA.contactName}
          </div>
          <div style="font-size: 12px; color: ${BRAND_DATA.primaryColor}; margin-bottom: 8px;">
            ${BRAND_DATA.role}
          </div>
          <div style="font-size: 11px; color: #666666;">
            <div>${BRAND_DATA.phone}</div>
            <div><a href="mailto:${BRAND_DATA.email}" style="color: #666666; text-decoration: none;">${BRAND_DATA.email}</a></div>
            <div><a href="https://${BRAND_DATA.website}" style="color: #666666; text-decoration: none;">${BRAND_DATA.website}</a></div>
          </div>
        </td>
      </tr>
    </table>
  `;

  return (
    <div 
      style={{ 
        padding: "20px",
        backgroundColor: "#ffffff",
        fontFamily: "Arial, sans-serif"
      }}
      dangerouslySetInnerHTML={{ __html: signatureHtml }}
    />
  );
}

// Layout Vertical
function VerticalLayout() {
  const signatureHtml = `
    <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; text-align: center;">
      <tr>
        <td>
          <div style="width: 60px; height: 60px; background-color: ${BRAND_DATA.primaryColor}; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px; margin: 0 auto 12px;">
            A
          </div>
          <div style="font-size: 16px; font-weight: bold; color: #1a1a1a; margin-bottom: 4px;">
            ${BRAND_DATA.contactName}
          </div>
          <div style="font-size: 12px; color: ${BRAND_DATA.primaryColor}; margin-bottom: 12px;">
            ${BRAND_DATA.role}
          </div>
          <div style="width: 40px; height: 2px; background-color: ${BRAND_DATA.primaryColor}; margin: 0 auto 12px;"></div>
          <div style="font-size: 11px; color: #666666; line-height: 1.8;">
            <div>${BRAND_DATA.phone}</div>
            <div><a href="mailto:${BRAND_DATA.email}" style="color: #666666; text-decoration: none;">${BRAND_DATA.email}</a></div>
            <div><a href="https://${BRAND_DATA.website}" style="color: #666666; text-decoration: none;">${BRAND_DATA.website}</a></div>
          </div>
        </td>
      </tr>
    </table>
  `;

  return (
    <div 
      style={{ 
        padding: "20px",
        backgroundColor: "#ffffff",
        fontFamily: "Arial, sans-serif"
      }}
      dangerouslySetInnerHTML={{ __html: signatureHtml }}
    />
  );
}

// Componente Principal
export function EmailSignature() {
  const [layout, setLayout] = useState<LayoutType>("horizontal");
  const previewRef = useRef<HTMLDivElement>(null);

  const getHtml = () => {
    return previewRef.current?.innerHTML || "";
  };

  const renderLayout = () => {
    switch (layout) {
      case "horizontal":
        return <HorizontalLayout />;
      case "vertical":
        return <VerticalLayout />;
      default:
        return <HorizontalLayout />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Assinatura de Email</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Template HTML pronto para Gmail, Outlook e Apple Mail
        </p>
      </div>

      {/* Seletor de Layout */}
      <div className="flex gap-2">
        {LAYOUTS.map((l) => (
          <Button
            key={l.id}
            variant={layout === l.id ? "default" : "outline"}
            size="sm"
            onClick={() => setLayout(l.id as LayoutType)}
          >
            <div className="text-left">
              <div className="font-medium">{l.label}</div>
              <div className="text-xs opacity-70">{l.description}</div>
            </div>
          </Button>
        ))}
      </div>

      {/* Preview */}
      <div className="border rounded-lg p-6 bg-gray-50">
        <div 
          ref={previewRef}
          style={{ 
            backgroundColor: "#ffffff",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "inline-block"
          }}
        >
          {renderLayout()}
        </div>
      </div>

      {/* Export Toolbar - com botão de copiar HTML */}
      <ExportToolbar
        targetRef={previewRef}
        getHtml={getHtml}
        filename={`assinatura-${layout}`}
        scale={2}
        showHtml={true}
      />
    </div>
  );
}
