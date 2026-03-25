import { useState, useRef } from "react";
import { Award } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { ExportToolbar } from "../export-toolbar";

type LayoutType = "formal" | "modern";

const LAYOUTS = [
  { id: "formal", label: "Formal", description: "Bordas decorativas clássicas" },
  { id: "modern", label: "Moderno", description: "Design clean com barra lateral" }
] as const;

const BRAND_DATA = {
  companyName: "ADAPTA",
  primaryColor: "#666666"
};

interface CertificateData {
  participantName: string;
  courseName: string;
  workload: string;
  date: string;
  signatoryName: string;
  signatoryRole: string;
}

// Layout Formal
function FormalLayout({ data }: { data: CertificateData }) {
  return (
    <div style={{ 
      width: "842px", 
      height: "595px",
      backgroundColor: "#ffffff",
      fontFamily: "Georgia, serif",
      padding: "40px",
      position: "relative",
      border: `8px double ${BRAND_DATA.primaryColor}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center"
    }}>
      {/* Ornamentos nos cantos */}
      <div style={{ 
        position: "absolute",
        top: "30px",
        left: "30px",
        width: "40px",
        height: "40px",
        borderTop: `4px solid ${BRAND_DATA.primaryColor}`,
        borderLeft: `4px solid ${BRAND_DATA.primaryColor}`
      }} />
      <div style={{ 
        position: "absolute",
        top: "30px",
        right: "30px",
        width: "40px",
        height: "40px",
        borderTop: `4px solid ${BRAND_DATA.primaryColor}`,
        borderRight: `4px solid ${BRAND_DATA.primaryColor}`
      }} />
      <div style={{ 
        position: "absolute",
        bottom: "30px",
        left: "30px",
        width: "40px",
        height: "40px",
        borderBottom: `4px solid ${BRAND_DATA.primaryColor}`,
        borderLeft: `4px solid ${BRAND_DATA.primaryColor}`
      }} />
      <div style={{ 
        position: "absolute",
        bottom: "30px",
        right: "30px",
        width: "40px",
        height: "40px",
        borderBottom: `4px solid ${BRAND_DATA.primaryColor}`,
        borderRight: `4px solid ${BRAND_DATA.primaryColor}`
      }} />

      {/* Logo */}
      <div style={{ 
        width: "60px",
        height: "60px",
        backgroundColor: BRAND_DATA.primaryColor,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "30px"
      }}>
        A
      </div>

      {/* Título */}
      <div style={{ 
        fontSize: "36px",
        fontWeight: "bold",
        color: BRAND_DATA.primaryColor,
        marginBottom: "30px",
        letterSpacing: "2px"
      }}>
        CERTIFICADO
      </div>

      {/* Texto */}
      <div style={{ 
        fontSize: "16px",
        color: "#333333",
        maxWidth: "600px",
        lineHeight: "2"
      }}>
        <p style={{ marginBottom: "20px" }}>Certificamos que</p>
        
        <p style={{ 
          fontSize: "28px",
          fontWeight: "bold",
          color: "#1a1a1a",
          margin: "20px 0"
        }}>
          {data.participantName || "NOME DO PARTICIPANTE"}
        </p>
        
        <p style={{ marginBottom: "10px" }}>concluiu com êxito o curso</p>
        
        <p style={{ 
          fontSize: "20px",
          fontWeight: "600",
          color: BRAND_DATA.primaryColor,
          margin: "15px 0"
        }}>
          "{data.courseName || "Nome do Curso"}"
        </p>
        
        <p style={{ marginBottom: "30px" }}>
          com carga horária de {data.workload || "40"} horas
        </p>
        
        <p style={{ fontSize: "14px", color: "#666666" }}>
          {data.date || "São Paulo, 8 de março de 2026"}
        </p>
      </div>

      {/* Assinatura */}
      <div style={{ 
        marginTop: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{ 
          width: "200px",
          borderTop: `2px solid ${BRAND_DATA.primaryColor}`,
          marginBottom: "8px"
        }} />
        <div style={{ 
          fontSize: "14px",
          fontWeight: "600",
          color: "#1a1a1a"
        }}>
          {data.signatoryName || "João Silva"}
        </div>
        <div style={{ 
          fontSize: "12px",
          color: "#666666"
        }}>
          {data.signatoryRole || "Diretor Geral"}
        </div>
      </div>
    </div>
  );
}

// Layout Moderno
function ModernLayout({ data }: { data: CertificateData }) {
  return (
    <div style={{ 
      width: "842px", 
      height: "595px",
      backgroundColor: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      display: "flex",
      position: "relative"
    }}>
      {/* Barra Lateral */}
      <div style={{ 
        width: "100px",
        backgroundColor: BRAND_DATA.primaryColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px"
      }}>
        <div style={{ 
          transform: "rotate(-90deg)",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#ffffff",
          whiteSpace: "nowrap",
          letterSpacing: "4px"
        }}>
          CERTIFICADO
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ 
        flex: 1,
        padding: "60px 80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        {/* Logo */}
        <div style={{ 
          width: "50px",
          height: "50px",
          backgroundColor: BRAND_DATA.primaryColor,
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "30px"
        }}>
          A
        </div>

        <div style={{ 
          fontSize: "14px",
          color: "#666666",
          marginBottom: "20px"
        }}>
          Certificamos que
        </div>

        <div style={{ 
          fontSize: "32px",
          fontWeight: "bold",
          color: "#1a1a1a",
          marginBottom: "30px"
        }}>
          {data.participantName || "Nome do Participante"}
        </div>

        <div style={{ 
          fontSize: "15px",
          color: "#333333",
          lineHeight: "1.8",
          marginBottom: "30px"
        }}>
          <p>concluiu com êxito o curso</p>
          <p style={{ 
            fontSize: "20px",
            fontWeight: "600",
            color: BRAND_DATA.primaryColor,
            margin: "12px 0"
          }}>
            {data.courseName || "Nome do Curso"}
          </p>
          <p>com carga horária de {data.workload || "40"} horas</p>
        </div>

        <div style={{ 
          fontSize: "13px",
          color: "#999999",
          marginBottom: "40px"
        }}>
          {data.date || "São Paulo, 8 de março de 2026"}
        </div>

        {/* Assinatura */}
        <div>
          <div style={{ 
            width: "180px",
            borderTop: `2px solid ${BRAND_DATA.primaryColor}`,
            marginBottom: "8px"
          }} />
          <div style={{ 
            fontSize: "14px",
            fontWeight: "600",
            color: "#1a1a1a"
          }}>
            {data.signatoryName || "João Silva"}
          </div>
          <div style={{ 
            fontSize: "12px",
            color: "#666666"
          }}>
            {data.signatoryRole || "Diretor Geral"}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Principal
export function Certificate() {
  const [layout, setLayout] = useState<LayoutType>("formal");
  const [data, setData] = useState<CertificateData>({
    participantName: "Maria Oliveira",
    courseName: "Branding Estratégico",
    workload: "40",
    date: "São Paulo, 8 de março de 2026",
    signatoryName: "João Silva",
    signatoryRole: "Diretor Geral"
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
          <Award className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Certificado</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Formato A4 horizontal (842×595px) · Ideal para impressão
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
              <Label htmlFor="participant">Nome do Participante</Label>
              <Input
                id="participant"
                value={data.participantName}
                onChange={(e) => setData({ ...data, participantName: e.target.value })}
                placeholder="Maria Oliveira"
              />
            </div>

            <div>
              <Label htmlFor="course">Nome do Curso</Label>
              <Input
                id="course"
                value={data.courseName}
                onChange={(e) => setData({ ...data, courseName: e.target.value })}
                placeholder="Branding Estratégico"
              />
            </div>

            <div>
              <Label htmlFor="workload">Carga Horária (horas)</Label>
              <Input
                id="workload"
                value={data.workload}
                onChange={(e) => setData({ ...data, workload: e.target.value })}
                placeholder="40"
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
              <Label htmlFor="signatory">Signatário</Label>
              <Input
                id="signatory"
                value={data.signatoryName}
                onChange={(e) => setData({ ...data, signatoryName: e.target.value })}
                placeholder="João Silva"
              />
            </div>

            <div>
              <Label htmlFor="role">Cargo do Signatário</Label>
              <Input
                id="role"
                value={data.signatoryRole}
                onChange={(e) => setData({ ...data, signatoryRole: e.target.value })}
                placeholder="Diretor Geral"
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
            filename={`certificado-${layout}`}
            scale={2}
          />
        </div>
      </div>
    </div>
  );
}
