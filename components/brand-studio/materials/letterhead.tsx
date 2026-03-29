import { useState, useRef } from "react";
import { FileText } from "lucide-react";
import { Button } from "../../ui/button";
import { ExportToolbar } from "../export-toolbar";
import { Label } from "../../ui/label";

type LayoutType = "classic" | "modern" | "centered";

const LAYOUTS = [
  { id: "classic", label: "Clássico", description: "Header + linha colorida" },
  { id: "modern", label: "Moderno", description: "Barra vertical lateral" },
  { id: "centered", label: "Centralizado", description: "Logo centralizado" }
] as const;

// Dados de exemplo (depois virá do BrandContext)
const BRAND_DATA = {
  companyName: "ADAPTA",
  website: "www.adapta.com.br",
  phone: "(11) 99999-9999",
  email: "contato@adapta.com.br",
  address: "Rua Exemplo, 123",
  city: "São Paulo - SP",
  zip: "01000-000",
  primaryColor: "#666666"
};

// Layout Clássico
function ClassicLayout() {
  return (
    <div 
      style={{ 
        width: "595px", 
        minHeight: "780px",
        backgroundColor: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "40px",
        position: "relative"
      }}
    >
      {/* Header */}
      <div style={{ 
        borderBottom: `3px solid ${BRAND_DATA.primaryColor}`,
        paddingBottom: "20px",
        marginBottom: "40px"
      }}>
        <div style={{ 
          fontSize: "32px", 
          fontWeight: "bold",
          color: "#1a1a1a",
          marginBottom: "4px"
        }}>
          {BRAND_DATA.companyName}
        </div>
        <div style={{ 
          fontSize: "14px", 
          color: "#666666"
        }}>
          {BRAND_DATA.website}
        </div>
      </div>

      {/* Corpo da Carta */}
      <div style={{ 
        fontSize: "14px", 
        lineHeight: "1.6",
        color: "#333333",
        marginBottom: "60px",
        minHeight: "480px"
      }}>
        <p style={{ marginBottom: "16px" }}>
          São Paulo, 8 de março de 2026
        </p>
        
        <p style={{ marginBottom: "16px" }}>
          Prezado(a) Senhor(a),
        </p>
        
        <p style={{ marginBottom: "16px" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        
        <p style={{ marginBottom: "16px" }}>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        
        <p style={{ marginTop: "40px" }}>
          Atenciosamente,
        </p>
        
        <p style={{ marginTop: "60px", fontWeight: "600" }}>
          {BRAND_DATA.companyName}
        </p>
      </div>

      {/* Footer */}
      <div style={{ 
        borderTop: `2px solid ${BRAND_DATA.primaryColor}33`,
        paddingTop: "16px",
        fontSize: "12px",
        color: "#666666",
        textAlign: "center"
      }}>
        <div style={{ marginBottom: "4px" }}>
          {BRAND_DATA.address} · {BRAND_DATA.city} · {BRAND_DATA.zip}
        </div>
        <div>
          {BRAND_DATA.phone} · {BRAND_DATA.email}
        </div>
      </div>
    </div>
  );
}

// Layout Moderno
function ModernLayout() {
  return (
    <div style={{ 
      width: "595px", 
      minHeight: "780px",
      backgroundColor: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      display: "flex",
      position: "relative"
    }}>
      {/* Barra Lateral */}
      <div style={{ 
        width: "80px",
        backgroundColor: BRAND_DATA.primaryColor,
        padding: "40px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ 
          transform: "rotate(-90deg)",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#ffffff",
          whiteSpace: "nowrap"
        }}>
          {BRAND_DATA.companyName}
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, padding: "40px" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ 
            fontSize: "14px", 
            color: "#666666"
          }}>
            {BRAND_DATA.website}
          </div>
        </div>

        {/* Corpo */}
        <div style={{ 
          fontSize: "14px", 
          lineHeight: "1.6",
          color: "#333333"
        }}>
          <p style={{ marginBottom: "16px" }}>
            São Paulo, 8 de março de 2026
          </p>
          
          <p style={{ marginBottom: "16px" }}>
            Prezado(a) Senhor(a),
          </p>
          
          <p style={{ marginBottom: "16px" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua.
          </p>
          
          <p style={{ marginBottom: "16px" }}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
            fugiat nulla pariatur.
          </p>
          
          <p style={{ marginTop: "40px" }}>
            Atenciosamente,
          </p>
          
          <p style={{ marginTop: "60px", fontWeight: "600" }}>
            {BRAND_DATA.companyName}
          </p>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: "auto",
          paddingTop: "40px",
          fontSize: "11px",
          color: "#999999"
        }}>
          <div>{BRAND_DATA.address}</div>
          <div>{BRAND_DATA.city} · {BRAND_DATA.zip}</div>
          <div>{BRAND_DATA.phone} · {BRAND_DATA.email}</div>
        </div>
      </div>
    </div>
  );
}

// Layout Centralizado
function CenteredLayout() {
  return (
    <div style={{ 
      width: "595px", 
      minHeight: "780px",
      backgroundColor: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "40px",
      textAlign: "center"
    }}>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ 
          fontSize: "36px", 
          fontWeight: "bold",
          color: "#1a1a1a",
          marginBottom: "8px"
        }}>
          {BRAND_DATA.companyName}
        </div>
        <div style={{ 
          width: "80px",
          height: "3px",
          backgroundColor: BRAND_DATA.primaryColor,
          margin: "0 auto 8px"
        }} />
        <div style={{ 
          fontSize: "13px", 
          color: "#666666"
        }}>
          {BRAND_DATA.website}
        </div>
      </div>

      {/* Corpo */}
      <div style={{ 
        fontSize: "14px", 
        lineHeight: "1.6",
        color: "#333333",
        textAlign: "left",
        marginBottom: "60px"
      }}>
        <p style={{ marginBottom: "16px" }}>
          São Paulo, 8 de março de 2026
        </p>
        
        <p style={{ marginBottom: "16px" }}>
          Prezado(a) Senhor(a),
        </p>
        
        <p style={{ marginBottom: "16px" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
        </p>
        
        <p style={{ marginBottom: "16px" }}>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.
        </p>
        
        <p style={{ marginTop: "40px" }}>
          Atenciosamente,
        </p>
        
        <p style={{ marginTop: "60px", fontWeight: "600" }}>
          {BRAND_DATA.companyName}
        </p>
      </div>

      {/* Footer */}
      <div style={{ 
        borderTop: `1px solid ${BRAND_DATA.primaryColor}33`,
        paddingTop: "20px",
        fontSize: "11px",
        color: "#666666"
      }}>
        <div>{BRAND_DATA.address} · {BRAND_DATA.city} · {BRAND_DATA.zip}</div>
        <div style={{ marginTop: "4px" }}>
          {BRAND_DATA.phone} · {BRAND_DATA.email}
        </div>
      </div>
    </div>
  );
}

// Componente Principal
export function Letterhead() {
  const [layout, setLayout] = useState<LayoutType>("classic");
  const previewRef = useRef<HTMLDivElement>(null);

  const renderLayout = () => {
    switch (layout) {
      case "classic":
        return <ClassicLayout />;
      case "modern":
        return <ModernLayout />;
      case "centered":
        return <CenteredLayout />;
      default:
        return <ClassicLayout />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Papel Timbrado</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          3 layouts disponíveis · Tamanho A4 (595×842px)
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Seletor de Layout */}
        <div className="xl:col-span-1 space-y-2">
          <Label>Escolha o layout</Label>
          <div className="grid grid-cols-1 gap-2">
            {LAYOUTS.map((l) => (
              <Button
                key={l.id}
                variant={layout === l.id ? "default" : "outline"}
                size="sm"
                onClick={() => setLayout(l.id as LayoutType)}
                className="justify-start"
              >
                <div className="text-left">
                  <div className="font-medium">{l.label}</div>
                  <div className="text-xs opacity-70">{l.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="xl:col-span-2 space-y-4">
          <div className="border rounded-lg bg-gray-50 overflow-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
            <div className="p-6 flex justify-center">
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
          </div>

          {/* Export Toolbar */}
          <ExportToolbar
            targetRef={previewRef}
            filename={`papel-timbrado-${layout}`}
            scale={2}
          />
        </div>
      </div>
    </div>
  );
}