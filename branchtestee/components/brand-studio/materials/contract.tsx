import { useState, useRef } from "react";
import { FileText } from "lucide-react";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { ExportToolbar } from "../export-toolbar";

const BRAND_DATA = {
  companyName: "ADAPTA",
  primaryColor: "#666666"
};

interface ContractData {
  title: string;
  content: string;
  party1: string;
  party2: string;
}

function ContractLayout({ data }: { data: ContractData }) {
  return (
    <div style={{ 
      width: "595px", 
      minHeight: "842px",
      backgroundColor: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "50px 60px"
    }}>
      {/* Header */}
      <div style={{ 
        borderBottom: `3px solid ${BRAND_DATA.primaryColor}`,
        paddingBottom: "20px",
        marginBottom: "30px"
      }}>
        <div style={{ 
          fontSize: "28px", 
          fontWeight: "bold",
          color: "#1a1a1a",
          marginBottom: "8px"
        }}>
          {BRAND_DATA.companyName}
        </div>
        <div style={{ 
          fontSize: "18px",
          fontWeight: "600",
          color: BRAND_DATA.primaryColor
        }}>
          {data.title || "Contrato de Prestação de Serviços"}
        </div>
      </div>

      {/* Corpo do Contrato */}
      <div style={{ 
        fontSize: "13px", 
        lineHeight: "1.8",
        color: "#333333",
        marginBottom: "60px",
        whiteSpace: "pre-wrap"
      }}>
        {data.content || `CLÁUSULA 1 - DO OBJETO

O presente contrato tem por objeto a prestação de serviços conforme descrito neste documento.

CLÁUSULA 2 - DAS OBRIGAÇÕES DO CONTRATANTE

São obrigações do contratante:
a) Fornecer todas as informações necessárias;
b) Efetuar o pagamento conforme acordado;
c) Cumprir os prazos estabelecidos.

CLÁUSULA 3 - DAS OBRIGAÇÕES DA CONTRATADA

São obrigações da contratada:
a) Prestar os serviços com qualidade;
b) Cumprir os prazos estabelecidos;
c) Manter sigilo das informações.

CLÁUSULA 4 - DO VALOR E FORMA DE PAGAMENTO

O valor dos serviços será definido conforme proposta comercial apresentada.

CLÁUSULA 5 - DO PRAZO

O prazo de vigência deste contrato será conforme acordado entre as partes.

CLÁUSULA 6 - DA RESCISÃO

Este contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de 30 dias.`}
      </div>

      {/* Assinaturas */}
      <div style={{ 
        borderTop: `2px solid ${BRAND_DATA.primaryColor}33`,
        paddingTop: "40px"
      }}>
        <div style={{ 
          fontSize: "16px",
          fontWeight: "600",
          color: "#1a1a1a",
          marginBottom: "30px"
        }}>
          ASSINATURAS
        </div>

        <div style={{ 
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px"
        }}>
          {/* Parte 1 */}
          <div>
            <div style={{ 
              borderTop: `2px solid ${BRAND_DATA.primaryColor}`,
              paddingTop: "8px",
              textAlign: "center"
            }}>
              <div style={{ 
                fontSize: "13px",
                fontWeight: "600",
                color: "#1a1a1a",
                marginBottom: "4px"
              }}>
                {data.party1 || "CONTRATANTE"}
              </div>
              <div style={{ 
                fontSize: "11px",
                color: "#666666"
              }}>
                Nome / CPF ou CNPJ
              </div>
            </div>
          </div>

          {/* Parte 2 */}
          <div>
            <div style={{ 
              borderTop: `2px solid ${BRAND_DATA.primaryColor}`,
              paddingTop: "8px",
              textAlign: "center"
            }}>
              <div style={{ 
                fontSize: "13px",
                fontWeight: "600",
                color: "#1a1a1a",
                marginBottom: "4px"
              }}>
                {data.party2 || "CONTRATADA"}
              </div>
              <div style={{ 
                fontSize: "11px",
                color: "#666666"
              }}>
                Nome / CPF ou CNPJ
              </div>
            </div>
          </div>
        </div>

        {/* Data */}
        <div style={{ 
          marginTop: "40px",
          textAlign: "center",
          fontSize: "12px",
          color: "#666666"
        }}>
          São Paulo, 8 de março de 2026
        </div>
      </div>
    </div>
  );
}

// Componente Principal
export function Contract() {
  const [data, setData] = useState<ContractData>({
    title: "Contrato de Prestação de Serviços",
    content: `CLÁUSULA 1 - DO OBJETO

O presente contrato tem por objeto a prestação de serviços conforme descrito neste documento.

CLÁUSULA 2 - DAS OBRIGAÇÕES DO CONTRATANTE

São obrigações do contratante:
a) Fornecer todas as informações necessárias;
b) Efetuar o pagamento conforme acordado;
c) Cumprir os prazos estabelecidos.

CLÁUSULA 3 - DAS OBRIGAÇÕES DA CONTRATADA

São obrigações da contratada:
a) Prestar os serviços com qualidade;
b) Cumprir os prazos estabelecidos;
c) Manter sigilo das informações.

CLÁUSULA 4 - DO VALOR E FORMA DE PAGAMENTO

O valor dos serviços será definido conforme proposta comercial apresentada.

CLÁUSULA 5 - DO PRAZO

O prazo de vigência deste contrato será conforme acordado entre as partes.

CLÁUSULA 6 - DA RESCISÃO

Este contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de 30 dias.`,
    party1: "CONTRATANTE",
    party2: "CONTRATADA"
  });
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Contrato</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Formato A4 vertical (595×842px) · Personalize o conteúdo e exporte em PDF
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-1 space-y-4">
          <div>
            <Label htmlFor="title">Título do Contrato</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="Contrato de Prestação de Serviços"
            />
          </div>

          <div>
            <Label htmlFor="content">Corpo do Contrato</Label>
            <Textarea
              id="content"
              value={data.content}
              onChange={(e) => setData({ ...data, content: e.target.value })}
              placeholder="Digite o conteúdo do contrato..."
              rows={16}
              className="font-mono text-xs"
            />
          </div>

          <div>
            <Label htmlFor="party1">Primeira Parte</Label>
            <Input
              id="party1"
              value={data.party1}
              onChange={(e) => setData({ ...data, party1: e.target.value })}
              placeholder="CONTRATANTE"
            />
          </div>

          <div>
            <Label htmlFor="party2">Segunda Parte</Label>
            <Input
              id="party2"
              value={data.party2}
              onChange={(e) => setData({ ...data, party2: e.target.value })}
              placeholder="CONTRATADA"
            />
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
              <ContractLayout data={data} />
            </div>
          </div>

          {/* Export Toolbar */}
          <ExportToolbar
            targetRef={previewRef}
            filename="contrato"
            scale={2}
          />
        </div>
      </div>
    </div>
  );
}
