import React from "react";
import { Megaphone } from "lucide-react";
import { CriarMaterialSimple } from "./criar-material-simple";
import { InfoNote } from "./info-note";

export function MarketingComunicacao() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Megaphone className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Marketing & Comunicação</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Produza materiais de comunicação visual com a identidade da marca
          </p>
        </div>

        {/* Info Note */}
        <InfoNote title="Dica">
          Crie newsletters modulares e comunicados multi-canal (Email, Stories, Feed, WhatsApp e E-mail Interno) com identidade visual da sua marca.
        </InfoNote>

        {/* Motor de Materiais */}
        <CriarMaterialSimple categoryFilter="marketing" />
      </div>
    </div>
  );
}