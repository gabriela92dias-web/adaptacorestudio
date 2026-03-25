import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";

/**
 * Componente que detecta erros de cache do Figma Make e oferece soluções
 */
export function CacheClearer() {
  const [showWarning, setShowWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    // Detecta erros de 404 ou import failures no console
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const message = args.join(" ");
      
      // Só mostra aviso para erros reais de cache, não erros de código
      if (
        (message.includes("404") || message.includes("Failed to fetch")) &&
        message.includes("figma.site") &&
        !message.includes("Failed to resolve import") // Ignora erros de import que são de código
      ) {
        setErrorMessage(message);
        setShowWarning(true);
      }
      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  const handleHardRefresh = () => {
    // Limpa todos os caches possíveis
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }

    // Limpa localStorage e sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Força reload com cache bypass
    window.location.reload();
  };

  const handleNormalRefresh = () => {
    window.location.reload();
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="max-w-2xl w-full border-destructive">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <div>
              <CardTitle>Cache do Figma Make Desatualizado</CardTitle>
              <CardDescription>
                Detectamos arquivos antigos sendo carregados
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-mono text-destructive">
              ❌ Erro: {errorMessage}
            </p>
            <p className="text-sm text-muted-foreground">
              Esse arquivo não existe mais - foi substituído na última atualização.
            </p>
          </div>

          <div className="space-y-3">
            <p className="font-semibold">🔧 Soluções Recomendadas:</p>
            
            <div className="space-y-2">
              <Button
                onClick={handleHardRefresh}
                className="w-full justify-start gap-3 h-auto py-4"
                variant="destructive"
              >
                <Trash2 className="h-5 w-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-semibold">1. Limpar Cache Completo (Recomendado)</div>
                  <div className="text-xs opacity-90">
                    Limpa todo o cache e recarrega a página
                  </div>
                </div>
              </Button>

              <Button
                onClick={handleNormalRefresh}
                className="w-full justify-start gap-3 h-auto py-4"
                variant="outline"
              >
                <RefreshCw className="h-5 w-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-semibold">2. Recarregar Página</div>
                  <div className="text-xs opacity-70">
                    Apenas recarrega sem limpar cache
                  </div>
                </div>
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground border-t pt-4">
            <p className="font-semibold mb-2">💡 Solução Manual (se o problema persistir):</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Abra DevTools (F12)</li>
              <li>Vá em Application → Storage</li>
              <li>Clique em "Clear site data"</li>
              <li>Recarregue a página (Ctrl/Cmd + Shift + R)</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}