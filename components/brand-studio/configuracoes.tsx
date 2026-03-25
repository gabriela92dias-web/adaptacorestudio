import { useState } from "react";
import { useBrandStudio } from "../../contexts/brand-context";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { InfoNote } from "./info-note";
import { Save } from "lucide-react";

export function Configuracoes() {
  const { brand, updateBrand } = useBrandStudio();

  const handleSave = () => {
    // Dados já são salvos automaticamente no context
    alert("Configurações salvas com sucesso!");
  };

  return (
    <div className="p-6">
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Configurações
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure as informações da sua marca
          </p>
        </div>

        <InfoNote title="Informação">
          Essas informações serão usadas em todos os materiais gerados automaticamente.
        </InfoNote>

        <div
          className="p-6 rounded-lg border space-y-6"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Informações da Empresa
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  value={brand.companyName}
                  onChange={(e) => updateBrand("companyName", e.target.value)}
                  placeholder="Adapta"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={brand.website}
                  onChange={(e) => updateBrand("website", e.target.value)}
                  placeholder="www.adapta.com.br"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={brand.email}
                  onChange={(e) => updateBrand("email", e.target.value)}
                  placeholder="contato@adapta.com.br"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={brand.phone}
                  onChange={(e) => updateBrand("phone", e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Contato Principal
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Nome</Label>
                <Input
                  id="contactName"
                  value={brand.contactName}
                  onChange={(e) => updateBrand("contactName", e.target.value)}
                  placeholder="João Silva"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Cargo</Label>
                <Input
                  id="role"
                  value={brand.role}
                  onChange={(e) => updateBrand("role", e.target.value)}
                  placeholder="Diretor de Comunicação"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Endereço
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={brand.address}
                  onChange={(e) => updateBrand("address", e.target.value)}
                  placeholder="Rua Exemplo, 123"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade/Estado</Label>
                  <Input
                    id="city"
                    value={brand.city}
                    onChange={(e) => updateBrand("city", e.target.value)}
                    placeholder="São Paulo - SP"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip">CEP</Label>
                  <Input
                    id="zip"
                    value={brand.zip}
                    onChange={(e) => updateBrand("zip", e.target.value)}
                    placeholder="01000-000"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              style={{
                backgroundColor: "var(--btn-primary-bg)",
                color: "var(--btn-primary-text)",
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
