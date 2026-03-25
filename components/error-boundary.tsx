import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <CardTitle>Erro na Aplicação</CardTitle>
                  <CardDescription>
                    Algo deu errado ao carregar esta página
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-mono text-destructive">
                  {this.state.error?.message || "Erro desconhecido"}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold mb-2">Possíveis soluções:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Recarregue a página (Ctrl + R ou Cmd + R)</li>
                  <li>Faça um Hard Refresh (Ctrl + Shift + R ou Cmd + Shift + R)</li>
                  <li>Limpe o cache do navegador</li>
                  <li>Verifique o console do navegador (F12) para mais detalhes</li>
                </ul>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Recarregar Página
              </button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
