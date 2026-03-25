import { useState, useRef } from "react";
import { Droplet } from "lucide-react";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { ExportToolbar } from "../export-toolbar";

// Importar o QR Code SVG
import QRCode from "/src/imports/NOVOS_RÓTULOS_ADAPTA-CANN_.svg";

/*
 * ESPECIFICAÇÕES DOS RÓTULOS DE ÓLEO
 * 
 * Campos editáveis (Montserrat):
 * 1. Ingredientes: "Extrato concentrado à base de cannabis e, veículo MCT. Conservar ao abrigo da luz e em temperatura amena. 
 *    Consumir conforme orientações médicas, conservar longe do alcance de crianças. Validade 12 meses à partir da fabricação. 
 *    Agite antes de usar." - tamanho 2.9pt
 * 
 * 2. Info Empresa: "ADAPTA-Associação de defesa e apoio à pacientes em tratamento com Cannabis" - tamanho 2.9pt
 * 
 * 3. CNPJ: "CNPJ: 54.851.459/0001-28" - tamanho 2.9pt
 * 
 * 4. Call-to-action: "Acompanhe nossas atividades:" - tamanho 3.3pt
 * 
 * 5. Ratio THC: "THC 1:0" - tamanho 14.8pt, cor #afb570
 * 
 * 6. Tipo produto: "Óleo Full Spectrum" - tamanho 5.8pt, cor #fefefe (branco)
 * 
 * 7. Concentração total: "3000mg" - tamanho 5.8pt, cor #afb570
 * 
 * 8. Concentração por ml: "100mg/ml" - tamanho 5.8pt, cor #afb570
 * 
 * 9. QR Code: SVG fornecido em /src/imports/NOVOS_RÓTULOS_ADAPTA-CANN_.svg
 */

interface OilData {
  ingredients: string;
  companyInfo: string;
  cnpj: string;
  callToAction: string;
  thcRatio: string;
  productType: string;
  totalConcentration: string;
  mlConcentration: string;
}

// TODO: Implementar preview e formulário de edição
// Este componente será desenvolvido após finalização dos rótulos de flores

export function OilLabel() {
  const [data, setData] = useState<OilData>({
    ingredients: "Ingredientes: Extrato concentrado à base de cannabis e, veículo MCT. Conservar ao abrigo da luz e em temperatura amena. Consumir conforme orientações médicas, conservar longe do alcance de crianças. Validade 12 meses à partir da fabricação. Agite antes de usar.",
    companyInfo: "ADAPTA-Associação de defesa e apoio à pacientes em tratamento com Cannabis",
    cnpj: "CNPJ: 54.851.459/0001-28",
    callToAction: "Acompanhe nossas atividades:",
    thcRatio: "THC 1:0",
    productType: "Óleo Full Spectrum",
    totalConcentration: "3000mg",
    mlConcentration: "100mg/ml"
  });

  return (
    <div className="border rounded p-3 bg-card">
      <div className="flex items-center gap-2 mb-3">
        <Droplet className="w-4 h-4 text-primary" />
        <div>
          <h3 className="font-semibold text-[12px]">Rótulos de Óleo</h3>
          <p className="text-[10px] text-muted-foreground">
            Em desenvolvimento - Especificações salvas
          </p>
        </div>
      </div>
      
      <div className="text-[11px] text-muted-foreground space-y-1">
        <p>✅ Fonte: Montserrat</p>
        <p>✅ QR Code importado</p>
        <p>✅ Cores: #afb570 e #fefefe</p>
        <p>✅ 9 campos editáveis configurados</p>
        <p className="pt-2 text-primary">Aguardando finalização dos rótulos de flores...</p>
      </div>
    </div>
  );
}
