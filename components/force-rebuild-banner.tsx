import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Trash2, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

/**
 * Banner que detecta o erro específico do Figma Make cache
 * e oferece soluções diretas
 */
export function ForceRebuildBanner() {
  const [show, setShow] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Detecta o erro específico do hash 954d8e2c... OU QUALQUER hash em _components/v2/
    const checkForError = () => {
      const performanceEntries = performance.getEntriesByType("resource");
      const has404 = performanceEntries.some((entry: any) => 
        (entry.name.includes("_components/v2/") && 
         (entry.responseStatus === 404 || entry.transferSize === 0)) ||
        entry.name.includes("954d8e2cbc48ca65fd85d0da0f9728b575686a81") ||
        entry.name.includes("8b0c90bbb43516ed394c4652537dda2c46d63874")
      );

      if (has404) {
        console.error('[ADAPTA] ⚠️ Detected Figma Make cache error - showing modal');
        setShow(true);
      }
    };

    // Verifica imediatamente
    checkForError();

    // Verifica novamente após 2 segundos (para capturar requests tardias)
    const timer = setTimeout(checkForError, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (show && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [show, countdown]);

  const handleForceReload = () => {
    // Método 1: Service Worker (se existir)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach(reg => reg.unregister());
      });
    }

    // Método 2: Cache API
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach(name => caches.delete(name));
      });
    }

    // Método 3: Storage
    localStorage.clear();
    sessionStorage.clear();

    // Reload com timestamp para forçar bypass
    window.location.href = window.location.pathname + '?force_rebuild=' + Date.now();
  };

  const handleHardRefresh = () => {
    // Ctrl+Shift+R programmatically (não funciona, mas tentamos)
    location.reload();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <Card className="max-w-3xl w-full border-2 border-destructive shadow-2xl">
        <CardHeader className="border-b border-destructive/20 bg-destructive/10">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-destructive/20 p-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">⚠️ Cache do Figma Make Travado</CardTitle>
              <CardDescription className="text-base mt-2">
                Detectamos que o Figma Make está tentando carregar arquivos antigos que não existem mais
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Erro Técnico */}
          <Alert variant="destructive">
            <AlertTitle className="font-mono text-xs">❌ Erro Detectado:</AlertTitle>
            <AlertDescription className="font-mono text-xs mt-2 break-all">
              GET .../954d8e2cbc48ca65fd85d0da0f9728b575686a81.js → 404 (Not Found)
            </AlertDescription>
          </Alert>

          {/* Explicação */}
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              O que está acontecendo?
            </h3>
            <p className="text-sm text-muted-foreground">
              Fizemos atualizações no código que geraram novos arquivos. O Figma Make está 
              tentando carregar a versão antiga (hash <code className="text-xs bg-background px-1 rounded">954d8e2c...</code>) 
              que não existe mais no servidor.
            </p>
          </div>

          {/* Soluções */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">🔧 Soluções (tente nesta ordem):</h3>

            {/* Solução 1 - Recomendada */}
            <Button
              onClick={handleForceReload}
              size="lg"
              className="w-full justify-start gap-4 h-auto py-4 text-left"
              variant="destructive"
            >
              <div className="rounded-full bg-white/20 p-2">
                <Trash2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-base">1. Limpar Cache Completo (RECOMENDADO)</div>
                <div className="text-xs opacity-90 mt-1">
                  Apaga todos os caches, service workers e storage, depois recarrega
                </div>
              </div>
            </Button>

            {/* Solução 2 - Hard Refresh Manual */}
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <div className="flex items-start gap-3">
                <RefreshCw className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-semibold">2. Hard Refresh Manual</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Segure as teclas e recarregue:
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <kbd className="px-2 py-1 bg-background border border-border rounded text-xs font-mono">
                        Ctrl
                      </kbd>
                      <span>+</span>
                      <kbd className="px-2 py-1 bg-background border border-border rounded text-xs font-mono">
                        Shift
                      </kbd>
                      <span>+</span>
                      <kbd className="px-2 py-1 bg-background border border-border rounded text-xs font-mono">
                        R
                      </kbd>
                      <span className="text-muted-foreground">(Windows/Linux)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <kbd className="px-2 py-1 bg-background border border-border rounded text-xs font-mono">
                        Cmd
                      </kbd>
                      <span>+</span>
                      <kbd className="px-2 py-1 bg-background border border-border rounded text-xs font-mono">
                        Shift
                      </kbd>
                      <span>+</span>
                      <kbd className="px-2 py-1 bg-background border border-border rounded text-xs font-mono">
                        R
                      </kbd>
                      <span className="text-muted-foreground">(Mac)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Solução 3 - DevTools */}
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <div className="font-semibold mb-2">3. Limpar via DevTools (se nada funcionar)</div>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Abra DevTools: <kbd className="px-1 bg-background border rounded text-xs">F12</kbd></li>
                <li>Vá em <strong>Application</strong> (ou Aplicativo)</li>
                <li>No menu lateral, clique em <strong>Storage</strong></li>
                <li>Clique no botão <strong>"Clear site data"</strong></li>
                <li>Recarregue com <kbd className="px-1 bg-background border rounded text-xs">Ctrl+Shift+R</kbd></li>
              </ol>
            </div>
          </div>

          {/* Footer com info técnica */}
          <div className="text-xs text-muted-foreground border-t pt-4 space-y-1">
            <p><strong>Build atual:</strong> v2.0.0-rebuild-20260314-1850</p>
            <p><strong>Hash problemático:</strong> 954d8e2cbc48ca65fd85d0da0f9728b575686a81</p>
            <p><strong>Motivo:</strong> Refatoração do ColorControls gerou novos arquivos</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}