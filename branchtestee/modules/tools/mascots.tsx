/*
 * ADAPTA Platform — Gerador de Mascotes
 * Rota: /tools/mascots
 * 
 * Interface profissional integrada ao design da plataforma
 * Modo: TELA CHEIA - ocupa toda a área de conteúdo mas mantém o sidebar principal visível
 */

import { MascotEditor } from "../../imports/MascotEditor";
import { Suspense, useMemo } from "react";
import { useTranslations } from "../../i18n/use-translations";

export function Mascots() {
  const { tGroup, language } = useTranslations();
  const global = useMemo(() => tGroup('global'), [tGroup, language]);

  return (
    <Suspense fallback={
      <div className="h-full w-full flex items-center justify-center" style={{ 
        backgroundColor: 'var(--background)' 
      }}>
        <div style={{ color: 'var(--muted-foreground)' }}>{global.loading}</div>
      </div>
    }>
      <div className="h-full w-full">
        {/* Editor em modo TELA CHEIA - integrado ao layout da plataforma */}
        <MascotEditor />
      </div>
    </Suspense>
  );
}