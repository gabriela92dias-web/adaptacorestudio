import { useState, useRef, useEffect } from "react";
import { Package, Box, ShoppingBag, Tag, Disc, Bookmark, X } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { ExportToolbar } from "../export-toolbar";
import { LabelLibrary } from "./label-library"; // ✅ Nova biblioteca simplificada

type PackagingType = "box" | "bag" | "label" | "seal" | "tag";
type LabelType = "flores" | "oleo" | "gummie" | "mini-oleo" | "hash" | null;

interface PackagingGeneratorProps {
  selectedLabel?: LabelType; // ✅ Rótulo selecionado vindo da Biblioteca de Produtos
  selectedPackaging?: PackagingType | null; // ✅ Embalagem selecionada vindo da Biblioteca de Produtos
  onClearLabel?: () => void; // ✅ Callback para limpar o rótulo
  onClearPackaging?: () => void; // ✅ Callback para limpar a embalagem
  onAddToPedido?: (labelId: string) => void; // ✅ Callback para adicionar ao pedido
  selectedLabelIds?: string[]; // ✅ IDs dos rótulos selecionados
}

const PACKAGING_TYPES = [
  { id: "box", label: "Caixa", description: "Planificação completa", dimensions: "900×600px", icon: Box },
  { id: "bag", label: "Sacola", description: "Vista frontal com alças", dimensions: "400×500px", icon: ShoppingBag },
  { id: "label", label: "Etiqueta", description: "Rótulo retangular", dimensions: "400×200px", icon: Tag },
  { id: "seal", label: "Selo Circular", description: "Etiqueta redonda", dimensions: "300×300px", icon: Disc },
  { id: "tag", label: "Tag/Pendente", description: "Etiqueta com furo", dimensions: "200×350px", icon: Bookmark }
] as const;

const BRAND_DATA = {
  companyName: "ADAPTA",
  website: "www.adapta.com.br",
  primaryColor: "#666666"
};

interface ProductData {
  productName: string;
  productLine: string;
  description: string;
  weight: string;
  barcode: string;
  ingredients: string;
  tagline: string;
  batch: string;
}

// Layout Caixa (Planificação)
function BoxLayout({ data }: { data: ProductData }) {
  return (
    <div style={{ 
      width: "900px", 
      height: "600px",
      backgroundColor: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gridTemplateRows: "repeat(2, 1fr)",
      gap: "2px",
      padding: "20px",
      border: "2px solid #e0e0e0"
    }}>
      {/* Painel Superior */}
      <div style={{ 
        gridColumn: "1 / 4",
        backgroundColor: BRAND_DATA.primaryColor,
        padding: "30px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#ffffff"
      }}>
        <div style={{ 
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "8px"
        }}>
          {BRAND_DATA.companyName}
        </div>
        <div style={{ 
          fontSize: "24px",
          marginBottom: "12px"
        }}>
          {data.productName || "Nome do Produto"}
        </div>
        <div style={{ 
          fontSize: "14px",
          opacity: 0.9
        }}>
          {data.weight || "250g"}
        </div>
      </div>

      {/* Painel Frontal */}
      <div style={{ 
        backgroundColor: "#f9f9f9",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        border: `1px solid ${BRAND_DATA.primaryColor}33`
      }}>
        {/* Logo */}
        <div style={{ 
          width: "60px",
          height: "60px",
          backgroundColor: BRAND_DATA.primaryColor,
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "20px"
        }}>
          A
        </div>
        <div style={{ 
          fontSize: "28px",
          fontWeight: "bold",
          color: "#1a1a1a",
          marginBottom: "8px"
        }}>
          {data.productName || "PRODUTO"}
        </div>
        <div style={{ 
          fontSize: "14px",
          color: BRAND_DATA.primaryColor,
          marginBottom: "16px"
        }}>
          {data.productLine || "Linha Premium"}
        </div>
        <div style={{ 
          fontSize: "12px",
          color: "#666666",
          fontStyle: "italic"
        }}>
          "{data.tagline || "O melhor para você"}"
        </div>
      </div>

      {/* Painel Traseiro */}
      <div style={{ 
        backgroundColor: "#ffffff",
        padding: "30px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: `1px solid ${BRAND_DATA.primaryColor}33`
      }}>
        <div>
          <div style={{ 
            fontSize: "11px",
            color: "#1a1a1a",
            fontWeight: "600",
            marginBottom: "8px"
          }}>
            INGREDIENTES/COMPOSIÇÃO
          </div>
          <div style={{ 
            fontSize: "10px",
            color: "#666666",
            lineHeight: "1.4",
            marginBottom: "16px"
          }}>
            {data.ingredients || "100% ingredientes naturais selecionados"}
          </div>
        </div>

        <div>
          {/* Código de Barras Simulado */}
          <div style={{ 
            height: "40px",
            backgroundColor: "#1a1a1a",
            backgroundImage: "repeating-linear-gradient(90deg, #000 0px, #000 2px, #fff 2px, #fff 4px)",
            marginBottom: "8px"
          }} />
          <div style={{ 
            fontSize: "10px",
            color: "#666666",
            textAlign: "center"
          }}>
            {data.barcode || "7 891234 567890"}
          </div>
          
          <div style={{ 
            fontSize: "9px",
            color: "#999999",
            marginTop: "12px",
            textAlign: "center"
          }}>
            Lote: {data.batch || "2026/03-A"}
          </div>
          <div style={{ 
            fontSize: "9px",
            color: "#999999",
            textAlign: "center"
          }}>
            {BRAND_DATA.website}
          </div>
        </div>
      </div>

      {/* Painel Lateral */}
      <div style={{ 
        backgroundColor: BRAND_DATA.primaryColor,
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ 
          transform: "rotate(-90deg)",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#ffffff",
          whiteSpace: "nowrap"
        }}>
          {data.productName || "PRODUTO"}
        </div>
      </div>
    </div>
  );
}

// Layout Sacola
function BagLayout({ data }: { data: ProductData }) {
  return (
    <div style={{ 
      width: "400px", 
      height: "500px",
      backgroundColor: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      position: "relative",
      border: `2px solid ${BRAND_DATA.primaryColor}`,
      borderRadius: "0 0 8px 8px",
      overflow: "hidden"
    }}>
      {/* Alças */}
      <div style={{ 
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "80px"
      }}>
        <div style={{ 
          width: "60px",
          height: "80px",
          border: `3px solid ${BRAND_DATA.primaryColor}`,
          borderBottom: "none",
          borderRadius: "30px 30px 0 0"
        }} />
        <div style={{ 
          width: "60px",
          height: "80px",
          border: `3px solid ${BRAND_DATA.primaryColor}`,
          borderBottom: "none",
          borderRadius: "30px 30px 0 0"
        }} />
      </div>

      {/* Conteúdo */}
      <div style={{ 
        padding: "120px 40px 40px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
      }}>
        {/* Logo */}
        <div style={{ 
          width: "80px",
          height: "80px",
          backgroundColor: BRAND_DATA.primaryColor,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontSize: "36px",
          fontWeight: "bold",
          marginBottom: "30px"
        }}>
          A
        </div>

        <div style={{ 
          fontSize: "32px",
          fontWeight: "bold",
          color: "#1a1a1a",
          marginBottom: "12px"
        }}>
          {BRAND_DATA.companyName}
        </div>

        <div style={{ 
          fontSize: "18px",
          color: BRAND_DATA.primaryColor,
          marginBottom: "20px"
        }}>
          {data.productLine || "Linha Premium"}
        </div>

        <div style={{ 
          fontSize: "13px",
          color: "#666666",
          fontStyle: "italic",
          marginBottom: "30px"
        }}>
          "{data.tagline || "O melhor para você"}"
        </div>

        <div style={{ 
          fontSize: "11px",
          color: "#999999",
          marginTop: "auto"
        }}>
          {BRAND_DATA.website}
        </div>
      </div>
    </div>
  );
}

// Layout Etiqueta
function LabelLayout({ data }: { data: ProductData }) {
  return (
    <div style={{ 
      width: "400px", 
      height: "200px",
      backgroundColor: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      border: `2px solid ${BRAND_DATA.primaryColor}`,
      borderRadius: "8px",
      padding: "20px",
      display: "flex",
      gap: "20px"
    }}>
      {/* Logo */}
      <div style={{ 
        width: "60px",
        height: "60px",
        backgroundColor: BRAND_DATA.primaryColor,
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontSize: "28px",
        fontWeight: "bold",
        flexShrink: 0
      }}>
        A
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ 
            fontSize: "20px",
            fontWeight: "bold",
            color: "#1a1a1a",
            marginBottom: "4px"
          }}>
            {data.productName || "Nome do Produto"}
          </div>
          <div style={{ 
            fontSize: "12px",
            color: BRAND_DATA.primaryColor,
            marginBottom: "8px"
          }}>
            {data.productLine || "Linha Premium"}
          </div>
          <div style={{ 
            fontSize: "11px",
            color: "#666666"
          }}>
            {data.description || "Descrição do produto"}
          </div>
        </div>
        <div style={{ 
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "10px",
          color: "#999999"
        }}>
          <span>{data.weight || "250g"}</span>
          <span>Lote: {data.batch || "2026/03-A"}</span>
        </div>
      </div>
    </div>
  );
}

// Layout Selo Circular
function SealLayout({ data }: { data: ProductData }) {
  return (
    <div style={{ 
      width: "300px", 
      height: "300px",
      backgroundColor: BRAND_DATA.primaryColor,
      fontFamily: "system-ui, -apple-system, sans-serif",
      borderRadius: "50%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      color: "#ffffff",
      padding: "40px",
      border: "4px solid #ffffff",
      boxShadow: "0 0 0 2px " + BRAND_DATA.primaryColor
    }}>
      <div style={{ 
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "12px"
      }}>
        {BRAND_DATA.companyName}
      </div>
      <div style={{ 
        fontSize: "18px",
        marginBottom: "8px"
      }}>
        {data.productName || "Produto"}
      </div>
      <div style={{ 
        fontSize: "12px",
        opacity: 0.9
      }}>
        {data.productLine || "Linha Premium"}
      </div>
      <div style={{ 
        width: "60px",
        height: "2px",
        backgroundColor: "rgba(255,255,255,0.5)",
        margin: "16px 0"
      }} />
      <div style={{ 
        fontSize: "11px",
        opacity: 0.8
      }}>
        {data.weight || "250g"}
      </div>
    </div>
  );
}

// Layout Tag/Pendente
function TagLayout({ data }: { data: ProductData }) {
  return (
    <div style={{ 
      width: "200px", 
      height: "350px",
      backgroundColor: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      border: `2px solid ${BRAND_DATA.primaryColor}`,
      borderRadius: "8px",
      padding: "30px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      position: "relative"
    }}>
      {/* Furo */}
      <div style={{ 
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "30px",
        height: "30px",
        border: `3px solid ${BRAND_DATA.primaryColor}`,
        borderRadius: "50%",
        backgroundColor: "#f9f9f9"
      }} />

      {/* Conteúdo */}
      <div style={{ marginTop: "40px" }}>
        <div style={{ 
          fontSize: "24px",
          fontWeight: "bold",
          color: "#1a1a1a",
          marginBottom: "8px"
        }}>
          {BRAND_DATA.companyName}
        </div>
        
        <div style={{ 
          width: "40px",
          height: "2px",
          backgroundColor: BRAND_DATA.primaryColor,
          margin: "16px auto"
        }} />

        <div style={{ 
          fontSize: "16px",
          fontWeight: "600",
          color: BRAND_DATA.primaryColor,
          marginBottom: "12px"
        }}>
          {data.productName || "Produto"}
        </div>

        <div style={{ 
          fontSize: "12px",
          color: "#666666",
          marginBottom: "20px"
        }}>
          {data.productLine || "Linha Premium"}
        </div>

        <div style={{ 
          fontSize: "11px",
          color: "#999999",
          marginBottom: "30px"
        }}>
          {data.description || "Descrição"}
        </div>

        <div style={{ 
          fontSize: "14px",
          fontWeight: "bold",
          color: "#1a1a1a"
        }}>
          {data.weight || "250g"}
        </div>

        <div style={{ 
          fontSize: "9px",
          color: "#999999",
          marginTop: "20px"
        }}>
          {BRAND_DATA.website}
        </div>
      </div>
    </div>
  );
}

// Componente Principal
export function Packaging({ selectedLabel, selectedPackaging, onClearLabel, onClearPackaging, onAddToPedido, selectedLabelIds }: PackagingGeneratorProps) {
  const [data, setData] = useState<ProductData>({
    productName: "Café Premium",
    productLine: "Linha Especial",
    description: "Grãos selecionados do melhor café brasileiro",
    weight: "250g",
    barcode: "7 891234 567890",
    ingredients: "100% café arábica premium torrado e moído",
    tagline: "O sabor que inspira",
    batch: "2026/03-A"
  });
  const previewRef = useRef<HTMLDivElement>(null);

  console.log("[DEBUG] PackagingGenerator - selectedLabel:", selectedLabel, "selectedPackaging:", selectedPackaging);

  // ✅ Se há um rótulo selecionado, mostrar o editor de rótulos ao invés do gerador de embalagens
  if (selectedLabel) {
    return (
      <div className="space-y-3">
        {/* Header com botão para voltar */}
        <div className="flex items-center justify-between pb-2 border-b">
          <div>
            <h3 className="font-semibold text-sm">Editor de Rótulo: {selectedLabel.charAt(0).toUpperCase() + selectedLabel.slice(1)}</h3>
            <p className="text-xs text-muted-foreground">Personalize e exporte seu rótulo em alta resolução</p>
          </div>
          {onClearLabel && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearLabel}
              className="gap-2"
            >
              <X className="w-3.5 h-3.5" />
              Fechar Editor
            </Button>
          )}
        </div>

        {/* Renderizar o editor apropriado baseado no tipo */}
        {selectedLabel === "flores" && (
          <LabelLibrary 
            onAddToPedido={onAddToPedido}
            selectedIds={selectedLabelIds}
          />
        )}
        {selectedLabel === "oleo" && <div className="p-12 text-center text-muted-foreground">Editor de Rótulo Óleo (em breve)</div>}
        {selectedLabel === "gummie" && <div className="p-12 text-center text-muted-foreground">Editor de Rótulo Gummie (em breve)</div>}
        {selectedLabel === "mini-oleo" && <div className="p-12 text-center text-muted-foreground">Editor de Miniatura Óleo (em breve)</div>}
        {selectedLabel === "hash" && <div className="p-12 text-center text-muted-foreground">Editor de Rótulo Hash (em breve)</div>}
      </div>
    );
  }

  // ��� Estado vazio - Nenhuma embalagem selecionada
  if (!selectedPackaging) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-border rounded-lg bg-muted/20">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <Package className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Selecione um produto ou embalagem</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Abra a Biblioteca de Produtos e escolha um rótulo ou tipo de embalagem para começar
        </p>
      </div>
    );
  }

  // ✅ Renderização do gerador de embalagens (quando há embalagem selecionada)

  const renderLayout = () => {
    switch (selectedPackaging) {
      case "box":
        return <BoxLayout data={data} />;
      case "bag":
        return <BagLayout data={data} />;
      case "label":
        return <LabelLayout data={data} />;
      case "seal":
        return <SealLayout data={data} />;
      case "tag":
        return <TagLayout data={data} />;
      default:
        return null;
    }
  };

  const selectedType = PACKAGING_TYPES.find(t => t.id === selectedPackaging);

  const getPreviewScale = () => {
    switch (selectedPackaging) {
      case "box":
        return "scale(0.65)"; // 900×600 → 585×390px - aproveita melhor o espaço
      case "bag":
        return "scale(0.95)"; // 400×500 → 380×475px - quase altura total
      case "label":
        return "scale(1.3)"; // 400×200 → 520×260px - usa bem a largura
      case "seal":
        return "scale(1.5)"; // 300×300 → 450×450px - quadrado grande
      case "tag":
        return "scale(1.3)"; // 200×350 → 260×455px - aproveita altura
      default:
        return "scale(0.65)";
    }
  };

  return (
    <div className="space-y-2">
      {/* Header com botão para fechar */}
      <div className="flex items-center justify-between pb-2 border-b">
        <div>
          <h3 className="font-semibold text-sm">Editor de Embalagem: {selectedType?.label}</h3>
          <p className="text-xs text-muted-foreground">{selectedType?.dimensions} · Alta resolução para impressão</p>
        </div>
        {onClearPackaging && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearPackaging}
            className="gap-2"
          >
            <X className="w-3.5 h-3.5" />
            Fechar Editor
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-3">
        {/* Formulário Ultra-Compacto */}
        <div className="border rounded p-2.5 bg-card space-y-2 h-fit">
          <div className="flex items-center gap-1.5 pb-1.5 border-b">
            {selectedType && <selectedType.icon className="w-3 h-3 text-primary" />}
            <div>
              <h3 className="font-semibold text-[11px]">{selectedType?.label}</h3>
              <p className="text-[9px] text-muted-foreground">{selectedType?.dimensions}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <Label htmlFor="productName" className="text-[10px]">Nome do Produto</Label>
              <Input
                id="productName"
                value={data.productName}
                onChange={(e) => setData({ ...data, productName: e.target.value })}
                placeholder="Café Premium"
                className="h-7 text-[11px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <Label htmlFor="productLine" className="text-[10px]">Linha</Label>
                <Input
                  id="productLine"
                  value={data.productLine}
                  onChange={(e) => setData({ ...data, productLine: e.target.value })}
                  placeholder="Linha Especial"
                  className="h-7 text-[11px]"
                />
              </div>

              <div>
                <Label htmlFor="weight" className="text-[10px]">Peso</Label>
                <Input
                  id="weight"
                  value={data.weight}
                  onChange={(e) => setData({ ...data, weight: e.target.value })}
                  placeholder="250g"
                  className="h-7 text-[11px]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-[10px]">Descrição</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                placeholder="Descrição..."
                rows={1}
                className="text-[11px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <Label htmlFor="tagline" className="text-[10px]">Slogan</Label>
                <Input
                  id="tagline"
                  value={data.tagline}
                  onChange={(e) => setData({ ...data, tagline: e.target.value })}
                  placeholder="O sabor que inspira"
                  className="h-7 text-[11px]"
                />
              </div>

              <div>
                <Label htmlFor="batch" className="text-[10px]">Lote</Label>
                <Input
                  id="batch"
                  value={data.batch}
                  onChange={(e) => setData({ ...data, batch: e.target.value })}
                  placeholder="2026/03-A"
                  className="h-7 text-[11px]"
                />
              </div>
            </div>

            {selectedPackaging === "box" && (
              <>
                <div>
                  <Label htmlFor="barcode" className="text-[10px]">Código de Barras</Label>
                  <Input
                    id="barcode"
                    value={data.barcode}
                    onChange={(e) => setData({ ...data, barcode: e.target.value })}
                    placeholder="7 891234 567890"
                    className="h-7 text-[11px]"
                  />
                </div>

                <div>
                  <Label htmlFor="ingredients" className="text-[10px]">Ingredientes</Label>
                  <Textarea
                    id="ingredients"
                    value={data.ingredients}
                    onChange={(e) => setData({ ...data, ingredients: e.target.value })}
                    placeholder="Ingredientes..."
                    rows={1}
                    className="text-[11px] resize-none"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Preview + Export */}
        <div className="space-y-2">
          <div className="border rounded p-2 bg-muted/30 flex justify-center items-center overflow-hidden" style={{ height: "480px" }}>
            <div 
              ref={previewRef}
              style={{ 
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                borderRadius: "4px",
                display: "inline-block",
                transform: getPreviewScale(),
                maxWidth: "100%",
                maxHeight: "100%"
              }}
            >
              {renderLayout()}
            </div>
          </div>

          {/* Export Toolbar Ultra-Compacto */}
          <ExportToolbar
            targetRef={previewRef}
            filename={`embalagem-${selectedPackaging}`}
            scale={3}
          />
        </div>
      </div>
    </div>
  );
}

// Alias para compatibilidade
export const PackagingGenerator = Packaging;