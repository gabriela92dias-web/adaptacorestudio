import { useState, useRef } from "react";
import { Mail } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { ExportToolbar } from "../export-toolbar";
import { useTeamMembers } from "../../../helpers/useCoreActApi";

type LayoutType = "horizontal" | "vertical";

const LAYOUTS = [
  { id: "horizontal", label: "Horizontal", description: "Logo à esquerda" },
  { id: "vertical", label: "Vertical", description: "Logo no topo" }
] as const;

interface BrandData {
  companyName: string;
  contactName: string;
  role: string;
  phone: string;
  email: string;
  website: string;
  primaryColor: string;
}

const DEFAULT_DATA: BrandData = {
  companyName: "ADAPTA",
  contactName: "João Silva",
  role: "Sócio Diretor",
  phone: "(11) 99999-9999",
  email: "contato@adapta.com.br",
  website: "www.adapta.com.br",
  primaryColor: "#0f172a" 
};

const HorizontalLayout = ({ data }: { data: BrandData }) => {
  const initial = data.companyName && data.companyName.length > 0 ? data.companyName.charAt(0).toUpperCase() : "A";
  
  const signatureHtml = `
    <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; line-height: 1.6;">
      <tr>
        <td style="padding-right: 20px; border-right: 2px solid ${data.primaryColor};">
          <div style="width: 48px; height: 48px; background-color: ${data.primaryColor}; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px; text-align: center; line-height: 48px;">
            ${initial}
          </div>
        </td>
        <td style="padding-left: 20px;">
          <div style="font-size: 16px; font-weight: bold; color: #1a1a1a; margin-bottom: 2px;">
            ${data.contactName}
          </div>
          <div style="font-size: 12px; color: ${data.primaryColor}; margin-bottom: 8px; font-weight: bold;">
            ${data.role}
          </div>
          <div style="font-size: 11px; color: #666666;">
            <div>${data.phone}</div>
            <div><a href="mailto:${data.email}" style="color: #666666; text-decoration: none;">${data.email}</a></div>
            <div><a href="https://${data.website}" style="color: #666666; text-decoration: none;">${data.website}</a></div>
          </div>
        </td>
      </tr>
    </table>
  `;

  return (
    <div 
      style={{ padding: "24px", backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif" }}
      dangerouslySetInnerHTML={{ __html: signatureHtml }}
    />
  );
};

const VerticalLayout = ({ data }: { data: BrandData }) => {
  const initial = data.companyName && data.companyName.length > 0 ? data.companyName.charAt(0).toUpperCase() : "A";

  const signatureHtml = `
    <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; text-align: center;">
      <tr>
        <td>
          <div style="width: 60px; height: 60px; background-color: ${data.primaryColor}; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px; margin: 0 auto 12px; text-align: center; line-height: 60px;">
            ${initial}
          </div>
          <div style="font-size: 16px; font-weight: bold; color: #1a1a1a; margin-bottom: 4px;">
            ${data.contactName}
          </div>
          <div style="font-size: 12px; color: ${data.primaryColor}; margin-bottom: 12px; font-weight: bold;">
            ${data.role}
          </div>
          <div style="width: 40px; height: 2px; background-color: ${data.primaryColor}; margin: 0 auto 12px;"></div>
          <div style="font-size: 11px; color: #666666; line-height: 1.8;">
            <div>${data.phone}</div>
            <div><a href="mailto:${data.email}" style="color: #666666; text-decoration: none;">${data.email}</a></div>
            <div><a href="https://${data.website}" style="color: #666666; text-decoration: none;">${data.website}</a></div>
          </div>
        </td>
      </tr>
    </table>
  `;

  return (
    <div 
      style={{ padding: "24px", backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif" }}
      dangerouslySetInnerHTML={{ __html: signatureHtml }}
    />
  );
};

export function EmailSignature() {
  const [layout, setLayout] = useState<LayoutType>("horizontal");
  const [brandData, setBrandData] = useState<BrandData>(DEFAULT_DATA);
  const previewRef = useRef<HTMLDivElement>(null);

  // Fetch team members from Supabase automatically
  const { data: teamData, isLoading: isLoadingTeam } = useTeamMembers();

  const handleMemberSelect = (memberId: string) => {
    if (!teamData?.teamMembers) return;
    
    if (memberId === "custom") {
      setBrandData(DEFAULT_DATA);
      return;
    }

    const member = teamData.teamMembers.find((m) => m.id === memberId);
    if (member) {
      setBrandData((prev) => ({
        ...prev,
        contactName: member.name || "",
        // @ts-ignore - Supabase members might not officially map email or role in this specific type abstraction, avoiding TS errors directly
        email: member.email || prev.email,
        // @ts-ignore 
        role: member.role || "Membro da Equipe", 
      }));
    }
  };

  const getHtml = () => {
    return previewRef.current?.innerHTML || "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="w-5 h-5 text-foreground" />
        <h2 className="text-xl font-semibold text-foreground">Gerador de Assinaturas (Dinâmico)</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        Selecione um membro da equipe cadastrado no banco de dados para autopreencher a assinatura, ou insira os dados manualmente. Exporte facilmente como HTML estruturado, compatível com Outlook, Gmail e Apple Mail.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Formulário Edge (Esquerda) */}
        <div className="col-span-1 lg:col-span-5 space-y-6 p-6 border border-border bg-background rounded-xl shadow-sm">
          
          <div className="space-y-4 border-b border-border pb-6">
            <Label className="uppercase text-xs tracking-wider text-muted-foreground font-semibold">Autopreencher Equipe</Label>
            <Select onValueChange={handleMemberSelect} disabled={isLoadingTeam}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoadingTeam ? "Carregando equipe..." : "Selecione um(a) colaborador(a)"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">-- Preencher Manualmente --</SelectItem>
                {teamData?.teamMembers?.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Configurações Base</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Colaborador</Label>
                <Input 
                  value={brandData.contactName} 
                  onChange={(e) => setBrandData(prev => ({ ...prev, contactName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Cargo / Função</Label>
                <Input 
                  value={brandData.role} 
                  onChange={(e) => setBrandData(prev => ({ ...prev, role: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>E-mail Corporativo</Label>
                <Input 
                  value={brandData.email} 
                  onChange={(e) => setBrandData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone Principal</Label>
                <Input 
                  value={brandData.phone} 
                  onChange={(e) => setBrandData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Site / Portal</Label>
                <Input 
                  value={brandData.website} 
                  onChange={(e) => setBrandData(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Cor Destaque (Hex)</Label>
                <Input 
                  value={brandData.primaryColor} 
                  onChange={(e) => setBrandData(prev => ({ ...prev, primaryColor: e.target.value }))}
                  type="color"
                  className="h-10 px-2 py-1 w-full"
                />
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-border">
               <Label className="uppercase text-xs tracking-wider text-muted-foreground font-semibold">Estrutura de Layout</Label>
               <div className="flex gap-2">
                {LAYOUTS.map((l) => (
                  <Button
                    key={l.id}
                    variant={layout === l.id ? "default" : "outline"}
                    className={layout === l.id ? "bg-foreground text-background" : "bg-transparent"}
                    size="sm"
                    onClick={() => setLayout(l.id as LayoutType)}
                  >
                    {l.label}
                  </Button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Live Preview (Direita) */}
        <div className="col-span-1 lg:col-span-7 space-y-4">
          <div className="border border-border rounded-xl p-8 bg-muted/20 flex flex-col items-center justify-center min-h-[450px]">
            <div className="mb-4 text-xs font-mono text-muted-foreground self-start pl-4">Live Preview Render</div>
            <div 
              ref={previewRef}
              style={{ 
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                display: "inline-block",
                border: "1px solid rgba(0,0,0,0.08)"
              }}
            >
              {layout === "horizontal" ? <HorizontalLayout data={brandData} /> : <VerticalLayout data={brandData} />}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            {/* Export Toolbar */}
            <ExportToolbar
              targetRef={previewRef}
              getHtml={getHtml}
              filename={`assinatura-${brandData.contactName.replace(/ /g, '-').toLowerCase()}`}
              scale={2}
              showHtml={true}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
