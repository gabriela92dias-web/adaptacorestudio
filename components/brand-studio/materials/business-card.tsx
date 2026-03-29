import { useState, useRef } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "../../ui/button";
import { ExportToolbar } from "../export-toolbar";

type LayoutType = "gradient" | "minimal" | "dark" | "sidebar";

const LAYOUTS = [
  { id: "gradient", label: "Gradiente", description: "Fundo gradiente colorido" },
  { id: "minimal", label: "Minimalista", description: "Branco com borda" },
  { id: "dark", label: "Escuro", description: "Fundo escuro elegante" },
  { id: "sidebar", label: "Barra Lateral", description: "Faixa vertical colorida" }
] as const;

const BRAND_DATA = {
  companyName: "ADAPTA",
  contactName: "João Silva",
  role: "Diretor de Comunicação",
  phone: "(11) 99999-9999",
  email: "joao@adapta.com.br",
  website: "www.adapta.com.br",
  primaryColor: "#666666",
  secondaryColor: "#999999"
};

// Layout Gradiente
function GradientLayout() {
  return (
    <div style={{ 
      width: "540px", 
      height: "300px",
      background: `linear-gradient(135deg, ${BRAND_DATA.primaryColor} 0%, ${BRAND_DATA.secondaryColor} 100%)`,
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "30px",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      color: "#ffffff"
    }}>
      {/* Linha Superior */}
      <div style={{ 
        height: "4px",
        backgroundColor: "rgba(255,255,255,0.3)",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0
      }} />

      {/* Logo/Nome da Empresa */}
      <div>
        <div style={{ 
          fontSize: "28px", 
          fontWeight: "bold",
          marginBottom: "4px"
        }}>
          {BRAND_DATA.companyName}
        </div>
      </div>

      {/* Informações do Contato */}
      <div>
        <div style={{ 
          fontSize: "20px", 
          fontWeight: "600",
          marginBottom: "6px"
        }}>
          {BRAND_DATA.contactName}
        </div>
        <div style={{ 
          fontSize: "13px",
          opacity: 0.9,
          marginBottom: "16px",
          letterSpacing: "0.5px"
        }}>
          {BRAND_DATA.role.toUpperCase()}
        </div>
        <div style={{ 
          fontSize: "12px",
          opacity: 0.95,
          lineHeight: "1.6"
        }}>
          <div>{BRAND_DATA.phone} · {BRAND_DATA.email}</div>
          <div>{BRAND_DATA.website}</div>
        </div>
      </div>

      {/* Círculo Decorativo */}
      <div style={{ 
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.2)",
        position: "absolute",
        bottom: "30px",
        right: "30px"
      }} />
    </div>
  );
}

// Layout Minimalista
function MinimalLayout() {
  return (
    <div style={{ 
      width: "540px", 
      height: "300px",
      backgroundColor: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "30px",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      border: `1px solid ${BRAND_DATA.primaryColor}22`
    }}>
      {/* Borda Inferior Colorida */}
      <div style={{ 
        height: "4px",
        backgroundColor: BRAND_DATA.primaryColor,
        width: "100%",
        position: "absolute",
        bottom: 0,
        left: 0
      }} />

      {/* Logo/Nome da Empresa */}
      <div>
        <div style={{ 
          fontSize: "26px", 
          fontWeight: "bold",
          color: "#1a1a1a",
          marginBottom: "4px"
        }}>
          {BRAND_DATA.companyName}
        </div>
      </div>

      {/* Informações do Contato */}
      <div>
        <div style={{ 
          fontSize: "18px", 
          fontWeight: "600",
          color: "#1a1a1a",
          marginBottom: "6px"
        }}>
          {BRAND_DATA.contactName}
        </div>
        <div style={{ 
          fontSize: "12px",
          color: BRAND_DATA.primaryColor,
          marginBottom: "16px",
          letterSpacing: "0.5px"
        }}>
          {BRAND_DATA.role.toUpperCase()}
        </div>
        <div style={{ 
          fontSize: "11px",
          color: "#666666",
          lineHeight: "1.6"
        }}>
          <div>{BRAND_DATA.phone}</div>
          <div>{BRAND_DATA.email}</div>
          <div>{BRAND_DATA.website}</div>
        </div>
      </div>
    </div>
  );
}

// Layout Escuro
function DarkLayout() {
  return (
    <div style={{ 
      width: "540px", 
      height: "300px",
      backgroundColor: "#1a1a2e",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "30px",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      {/* Linha Superior */}
      <div style={{ 
        height: "2px",
        background: `linear-gradient(90deg, ${BRAND_DATA.primaryColor} 0%, transparent 100%)`,
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0
      }} />

      {/* Logo/Nome da Empresa */}
      <div>
        <div style={{ 
          fontSize: "28px", 
          fontWeight: "bold",
          color: "#ffffff",
          marginBottom: "4px"
        }}>
          {BRAND_DATA.companyName}
        </div>
      </div>

      {/* Informações do Contato */}
      <div>
        <div style={{ 
          fontSize: "19px", 
          fontWeight: "600",
          color: "#ffffff",
          marginBottom: "6px"
        }}>
          {BRAND_DATA.contactName}
        </div>
        <div style={{ 
          fontSize: "12px",
          color: BRAND_DATA.secondaryColor,
          marginBottom: "16px",
          letterSpacing: "0.5px"
        }}>
          {BRAND_DATA.role.toUpperCase()}
        </div>
        <div style={{ 
          fontSize: "11px",
          color: "#aaaaaa",
          lineHeight: "1.6"
        }}>
          <div>{BRAND_DATA.phone} · {BRAND_DATA.email}</div>
          <div>{BRAND_DATA.website}</div>
        </div>
      </div>

      {/* Grid Decorativo */}
      <div style={{ 
        position: "absolute",
        bottom: "30px",
        right: "30px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 8px)",
        gap: "4px"
      }}>
        {[...Array(9)].map((_, i) => (
          <div key={i} style={{ 
            width: "8px",
            height: "8px",
            backgroundColor: `${BRAND_DATA.primaryColor}44`,
            borderRadius: "1px"
          }} />
        ))}
      </div>
    </div>
  );
}

// Layout Barra Lateral
function SidebarLayout() {
  return (
    <div style={{ 
      width: "540px", 
      height: "300px",
      backgroundColor: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      display: "flex",
      position: "relative"
    }}>
      {/* Barra Lateral */}
      <div style={{ 
        width: "120px",
        backgroundColor: BRAND_DATA.primaryColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}>
        <div style={{ 
          transform: "rotate(-90deg)",
          fontSize: "22px",
          fontWeight: "bold",
          color: "#ffffff",
          whiteSpace: "nowrap"
        }}>
          {BRAND_DATA.companyName}
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ 
        flex: 1,
        padding: "30px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}>
        <div style={{ 
          fontSize: "20px", 
          fontWeight: "600",
          color: "#1a1a1a",
          marginBottom: "6px"
        }}>
          {BRAND_DATA.contactName}
        </div>
        
        <div>
          <div style={{ 
            fontSize: "12px",
            color: BRAND_DATA.primaryColor,
            marginBottom: "20px",
            letterSpacing: "0.5px"
          }}>
            {BRAND_DATA.role.toUpperCase()}
          </div>
          <div style={{ 
            fontSize: "11px",
            color: "#666666",
            lineHeight: "1.8"
          }}>
            <div>{BRAND_DATA.phone}</div>
            <div>{BRAND_DATA.email}</div>
            <div>{BRAND_DATA.website}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Principal
export function BusinessCard() {
  const [layout, setLayout] = useState<LayoutType>("gradient");
  const previewRef = useRef<HTMLDivElement>(null);

  const renderLayout = () => {
    switch (layout) {
      case "gradient":
        return <GradientLayout />;
      case "minimal":
        return <MinimalLayout />;
      case "dark":
        return <DarkLayout />;
      case "sidebar":
        return <SidebarLayout />;
      default:
        return <GradientLayout />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Cartão de Visita</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          4 layouts profissionais · Dimensões 540×300px (9:5)
        </p>
      </div>

      {/* Seletor de Layout */}
      <div className="grid grid-cols-2 gap-2">
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
      <div className="border rounded-lg p-6 bg-gray-50 flex justify-center overflow-auto">
        <div 
          ref={previewRef}
          style={{ 
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            borderRadius: "4px"
          }}
        >
          {renderLayout()}
        </div>
      </div>

      {/* Export Toolbar */}
      <ExportToolbar
        targetRef={previewRef}
        filename={`cartao-${layout}`}
        scale={3}
      />
    </div>
  );
}
