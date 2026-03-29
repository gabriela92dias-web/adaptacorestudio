import { useState } from "react";
import { Download, Printer, FileText, Code, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { toPng } from "html-to-image";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";

interface ExportToolbarProps {
  targetRef: React.RefObject<HTMLElement>;
  getHtml?: () => string;
  filename: string;
  scale?: number;
  showHtml?: boolean; // Para newsletters/assinaturas
}

export function ExportToolbar({ 
  targetRef, 
  getHtml, 
  filename, 
  scale = 2,
  showHtml = false 
}: ExportToolbarProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Exportar como PNG
  const handleExportPNG = async () => {
    if (!targetRef.current) {
      toast.error("Elemento não encontrado para exportação");
      return;
    }
    
    setIsExporting(true);
    try {
      // Aguarda um frame para garantir que o DOM está renderizado
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const dataUrl = await toPng(targetRef.current, {
        pixelRatio: scale,
        backgroundColor: "#ffffff",
        cacheBust: true
      });
      
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
      
      toast.success("PNG exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar PNG:", error);
      toast.error("Erro ao exportar PNG. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  // Exportar como PDF
  const handleExportPDF = async () => {
    if (!targetRef.current) {
      toast.error("Elemento não encontrado para exportação");
      return;
    }
    
    setIsExporting(true);
    try {
      // Aguarda um frame para garantir que o DOM está renderizado
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      // Gera PNG primeiro
      const dataUrl = await toPng(targetRef.current, {
        pixelRatio: scale,
        backgroundColor: "#ffffff",
        cacheBust: true
      });

      // Cria PDF
      const pdfDoc = await PDFDocument.create();
      
      // Detecta dimensões do elemento
      const width = targetRef.current.offsetWidth;
      const height = targetRef.current.offsetHeight;
      
      // Adiciona página com dimensões corretas
      const page = pdfDoc.addPage([width, height]);
      
      // Incorpora imagem
      const pngImageBytes = await fetch(dataUrl).then(res => res.arrayBuffer());
      const pngImage = await pdfDoc.embedPng(pngImageBytes);
      
      // Desenha imagem na página
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width,
        height,
      });

      // Salva PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.pdf`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast.success("PDF exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast.error("Erro ao exportar PDF");
    } finally {
      setIsExporting(false);
    }
  };

  // Imprimir
  const handlePrint = () => {
    if (!targetRef.current) return;
    
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup bloqueado pelo navegador");
      return;
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            @media print {
              @page { margin: 0; }
              body { margin: 0; }
            }
            body {
              font-family: system-ui, -apple-system, sans-serif;
            }
          </style>
        </head>
        <body>
          ${targetRef.current.outerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Aguarda carregamento e imprime
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  // Copiar HTML (para newsletters/assinaturas)
  const handleCopyHTML = async () => {
    if (!getHtml) return;
    
    try {
      const html = getHtml();
      await navigator.clipboard.writeText(html);
      setCopied(true);
      toast.success("HTML copiado para a área de transferência!");
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar HTML:", error);
      toast.error("Erro ao copiar HTML");
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg border">
      <div className="flex-1 text-sm text-muted-foreground">
        {isExporting ? "Exportando..." : "Ferramentas de exportação"}
      </div>
      
      <div className="flex items-center gap-2">
        {/* Exportar PNG */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPNG}
          disabled={isExporting}
        >
          <Download className="w-4 h-4 mr-2" />
          PNG
        </Button>

        {/* Exportar PDF */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPDF}
          disabled={isExporting}
        >
          <FileText className="w-4 h-4 mr-2" />
          PDF
        </Button>

        {/* Imprimir */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          disabled={isExporting}
        >
          <Printer className="w-4 h-4 mr-2" />
          Imprimir
        </Button>

        {/* Copiar HTML (opcional) */}
        {showHtml && getHtml && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyHTML}
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Copiado!
              </>
            ) : (
              <>
                <Code className="w-4 h-4 mr-2" />
                Copiar HTML
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}