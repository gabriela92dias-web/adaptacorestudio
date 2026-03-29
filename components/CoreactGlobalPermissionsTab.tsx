import React, { useState } from "react";
import { ShieldAlert, Building2 } from "lucide-react";
import { useSectors } from "../helpers/useSectors";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { CoreactSectorPermissions } from "./CoreactSectorPermissions";

export function CoreactGlobalPermissionsTab() {
  const { data: sectorsData, isLoading } = useSectors();
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);

  if (isLoading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Carregando setores...</div>;
  }

  const sortedSectors = sectorsData ? [...sectorsData].sort((a, b) => a.name.localeCompare(b.name)) : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", padding: "1rem 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ShieldAlert size={20} />
          Central de Permissões
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "800px" }}>
          As permissões no CoreAct são divididas por <strong>Setor</strong>. Selecione um departamento abaixo para configurar exatamente o que cada membro daquele setor pode ver ou fazer.
        </p>
      </div>

      <div style={{ maxWidth: "400px" }}>
        <Select
          value={selectedSectorId || undefined}
          onValueChange={(val) => setSelectedSectorId(val)}
        >
          <SelectTrigger>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Building2 size={16} />
              <SelectValue placeholder="Selecione um Setor..." />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {sortedSectors.map((sector) => (
                <SelectItem key={sector.id} value={sector.id}>
                  {sector.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div style={{ 
        backgroundColor: "var(--bg-secondary)", 
        borderRadius: "var(--radius-lg)", 
        border: "1px solid var(--border)",
        minHeight: "400px",
        padding: selectedSectorId ? "0" : "4rem 2rem",
        display: "flex",
        flexDirection: "column"
      }}>
        {selectedSectorId ? (
          <div style={{ padding: "1.5rem" }}>
            <CoreactSectorPermissions sectorId={selectedSectorId} />
          </div>
        ) : (
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center",
            gap: "1rem",
            color: "var(--text-tertiary)",
            margin: "auto",
            textAlign: "center"
          }}>
            <Building2 size={48} opacity={0.5} />
            <p>Selecione um setor acima para carregar a Matriz de Permissões.</p>
          </div>
        )}
      </div>
    </div>
  );
}
