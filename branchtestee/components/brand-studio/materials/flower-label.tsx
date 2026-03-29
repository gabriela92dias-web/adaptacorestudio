// Editor de Rótulos de Flores - ADAPTA CORE STUDIO
// ✅ ESTRUTURA FIXA DE LAYOUT - Grid bloqueado para impressão
import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { Package, AlertTriangle, Lock } from "lucide-react";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { ExportToolbar } from "../export-toolbar";
import { Skeleton } from "../../ui/skeleton";
import { Alert, AlertDescription } from "../../ui/alert";

// ✅ LAZY LOAD - Importar SVGs apenas quando necessário (otimização de performance)
const RotuloCBD = lazy(() => import("../../../../imports/Rotulos011"));
const RotuloTHC = lazy(() => import("../../../../imports/Rotulos021"));
const RotuloHibrido = lazy(() => import("../../../../imports/Rotulos031"));
const QRCodeComponent = lazy(() => import("../../../../imports/NovosRotulosAdaptaCann1-235-30"));

type FlowerType = "cbd" | "thc" | "hybrid";

interface FlowerData {
  productTitle: string;
  composition: string;
  weight: string;
  weightUnit: string;
  ingredients: string;
  companyInfo: string;
}

// ═══════════════════════════════════════════════════════════════════
// DIMENSÕES REAIS PARA IMPRESSÃO
// ═══════════════════════════════════════════════════════════════════
const LABEL_DIMENSIONS = {
  // Dimensões em mm (padrão real de impressão)
  widthMM: 80,
  heightMM: 50,
  
  // Conversão para pixels @ 300 DPI (padrão de impressão)
  widthPX: 302,  // 80mm @ 300dpi
  heightPX: 189, // 50mm @ 300dpi
  
  // Margens de segurança
  safeMargin: 2,   // 2mm de margem interna segura
  bleedMargin: 1,  // 1mm de sangra externa
  
  // DPI para exportação
  exportDPI: 300
};

// ═══════════════════════════════════════════════════════════════════
// CORES POR CATEGORIA (Sistema de tokens)
// ═══════════════════════════════════════════════════════════════════
const CATEGORY_COLORS = {
  cbd: {
    primary: "#789d61",    // Verde
    secondary: "#96b37d",
    accent: "#b5c99a"
  },
  thc: {
    primary: "#a97171",    // Vermelho/Rosa
    secondary: "#b88888",
    accent: "#c9a0a0"
  },
  hybrid: {
    primary: "#c4be7a",    // Amarelo/Dourado
    secondary: "#d4cf94",
    accent: "#e3dfad"
  }
} as const;

// Componente do Logo ADAPTA (SVG inline)
function LogoAdapta() {
  return (
    <svg width="30" height="34" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_5_203)">
        <path d="M23.9962 5.20564L15.3572 0.270251C14.726 -0.0900837 13.9464 -0.0900837 13.3156 0.270251L4.67652 5.20564C4.0445 5.56677 3.6555 6.23059 3.6555 6.94846V16.8324C3.6555 17.5507 4.0445 18.2145 4.67652 18.5757L12.1445 22.842L13.3156 23.5111C13.9464 23.8714 14.726 23.8714 15.3572 23.5111L16.5283 22.842L23.9962 18.5757C24.6283 18.2145 25.0169 17.5507 25.0169 16.8324V6.94846C25.0169 6.23059 24.6283 5.56677 23.9962 5.20564Z" fill="#789D61"/>
        <path d="M18.0569 6.29345H13.6658L10.2497 13.4873L9.63397 14.7841L8.35241 17.4822H10.7688L11.4721 15.9676H15.9276L16.6286 17.4822H18.461C21.9045 17.3313 23.9914 15.2478 23.9914 11.9015C23.9962 8.41142 21.7434 6.28464 18.0569 6.29345ZM12.3096 14.015L13.7021 11.0214L15.0901 14.015H12.3096ZM18.0708 15.253H17.9933L17.6793 14.5872L14.7941 8.52352H18.0484C20.3053 8.52352 21.6798 9.80151 21.6798 11.9015C21.6798 14.0014 20.3142 15.253 18.0708 15.253Z" fill="#BFBD5F"/>
        <path d="M10.2497 11.154V12.6377H8.04048V14.7841H6.55259V12.6377H4.34379V11.154H6.55259V8.98555H8.34058V11.154H10.2497Z" fill="#3F3C2F"/>
        <path d="M6.18479 30.5292L3.67222 25.3996H3.5923L1.09481 30.5292L1.04303 30.6353H1.94865L1.99595 30.5292L2.40452 29.6111H4.84614L5.25512 30.5292L5.30241 30.6353H6.23658L6.18479 30.5292ZM2.73072 28.8929L3.31014 27.6265L3.62859 26.915H3.64327L3.95479 27.6333L4.52768 28.8929H2.73072Z" fill="white"/>
        <path d="M10.2162 26.1543C9.78892 25.6562 9.03947 25.4072 7.96749 25.4072H6.6847V30.6353H8.01071C8.37076 30.6353 8.69492 30.6 8.98238 30.5292C9.24212 30.4659 9.4725 30.373 9.67312 30.2517C10.0955 29.9951 10.3989 29.6644 10.5824 29.2588C10.7659 28.8536 10.8576 28.4112 10.8576 27.932C10.8576 27.2445 10.6436 26.652 10.2162 26.1543ZM9.54998 29.3733C9.24824 29.7452 8.76383 29.9314 8.09756 29.9314H7.49613V26.1043H8.09756C8.75894 26.1043 9.24172 26.2776 9.5459 26.6239C9.85049 26.9699 10.003 27.4179 10.003 27.9676C10.003 28.5173 9.85171 29.001 9.54998 29.3733Z" fill="white"/>
        <path d="M16.1295 30.5292L13.6169 25.3996H13.537L11.0395 30.5292L10.9877 30.6353H11.8929L11.9402 30.5292L12.3492 29.6111H14.7908L15.1994 30.5292L15.2467 30.6353H16.1813L16.1295 30.5292ZM12.6754 28.8929L13.2548 27.6265L13.5733 26.915H13.588L13.8995 27.6333L14.472 28.8929H12.6754Z" fill="white"/>
        <path d="M19.2553 25.8232C18.9487 25.5457 18.4647 25.4072 17.8033 25.4072H16.6294V30.6353H17.4486V28.7003H17.7303C18.3872 28.7003 18.8822 28.5509 19.2153 28.2523C19.5489 27.9536 19.7157 27.5248 19.7157 26.9651C19.7157 26.4814 19.5619 26.1007 19.2553 25.8232ZM18.6429 27.7194C18.4741 27.9039 18.1772 27.996 17.7523 27.996H17.4486V26.1043H17.8245C18.2115 26.1043 18.4867 26.1923 18.6502 26.3681C18.8145 26.5431 18.8969 26.7705 18.8969 27.0503C18.8969 27.311 18.8121 27.534 18.6429 27.7194Z" fill="white"/>
        <path d="M23.6631 26.1043H22.2869V30.6353H21.4825V26.1043H20.121V25.4072H23.6631V26.1043Z" fill="white"/>
        <path d="M28.906 30.5292L26.3934 25.3996H26.3135L23.816 30.5292L23.7642 30.6353H24.6699L24.7172 30.5292L25.1261 29.6111H27.5673L27.9763 30.5292L28.0236 30.6353H28.9578L28.906 30.5292ZM25.4523 28.8929L26.0313 27.6265L26.3502 26.915H26.3645L26.6764 27.6333L27.2489 28.8929H25.4523Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip0_5_203">
          <rect width="30" height="34" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

// Componente de Preview do Rótulo
function FlowerLabelPreview({ type, data }: { type: FlowerType; data: FlowerData }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Selecionar componente SVG do Figma baseado no tipo
  const SVGComponent = type === "cbd" ? RotuloCBD : type === "thc" ? RotuloTHC : RotuloHibrido;

  // Simular carregamento do SVG e verificar erros
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("[FlowerLabel] Erro ao carregar rótulo:", error);
      setHasError(true);
      setIsLoading(false);
    }
  }, [type]);

  // Estilos dos textos baseados no design original (302x189px)
  const baseStyles = {
    fontFamily: "'Montserrat', sans-serif",
    position: "absolute" as const,
    color: "#2b3a1f",
    margin: 0,
    padding: 0,
    lineHeight: "1.2",
    userSelect: "none" as const,
    pointerEvents: "none" as const
  };

  const textStyles = {
    // ✅ Textos alinhados à esquerda na área de ingredientes
    // 🔤 USANDO TOKENS TIPOGRÁFICOS DO SISTEMA ADAPTA
    productTitle: {
      ...baseStyles,
      top: "111px",
      left: "214px",
      fontSize: "var(--label-title)",      /* 0.625rem ~7.5pt @ 300dpi */
      fontWeight: "var(--font-weight-semibold)",
      textAlign: "left" as const,
      width: "82px"
    },
    composition: {
      ...baseStyles,
      top: "124px",
      left: "214px",
      fontSize: "var(--label-subtitle)",   /* 0.458rem ~5.5pt @ 300dpi */
      fontWeight: "var(--font-weight-medium)",
      textAlign: "left" as const,
      width: "82px"
    },
    weight: {
      ...baseStyles,
      bottom: "40px",
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "var(--label-title)",      /* 0.625rem ~7.5pt @ 300dpi */
      fontWeight: "var(--font-weight-bold)",
      display: "flex",
      alignItems: "baseline",
      gap: "2px",
      justifyContent: "center"
    },
    weightUnit: {
      fontSize: "var(--label-title)",      /* 0.625rem ~7.5pt @ 300dpi */
      fontWeight: "var(--font-weight-medium)"
    },
    // ✅ Ingredientes no retângulo branco lateral direito
    ingredients: {
      ...baseStyles,
      top: "135px",
      left: "214px",
      fontSize: "var(--label-small)",      /* 0.333rem ~4pt @ 300dpi */
      fontWeight: "var(--font-weight-normal)",
      lineHeight: "1.3",
      width: "82px",
      textAlign: "left" as const
    },
    // ✅ CNPJ movido para área inferior do retângulo de ingredientes
    companyInfo: {
      ...baseStyles,
      bottom: "5px",
      left: "214px",
      fontSize: "var(--label-tiny)",       /* 0.292rem ~3.5pt @ 300dpi */
      fontWeight: "var(--font-weight-normal)",
      lineHeight: "1.3",
      textAlign: "left" as const,
      width: "82px"
    }
  };

  return (
    <div 
      style={{ 
        width: "302px", 
        height: "189px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* SVG Base do Figma com Suspense para lazy loading */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%"
        }}
      >
        <Suspense fallback={
          <div style={{ 
            width: "100%", 
            height: "100%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            backgroundColor: "#f5f5f5"
          }}>
            <div style={{ 
              fontSize: "10px", 
              color: "#999",
              fontFamily: "system-ui, sans-serif"
            }}>
              Carregando...
            </div>
          </div>
        }>
          <SVGComponent />
        </Suspense>
      </div>
      
      {/* ✅ Logo ADAPTA - Centralizado no topo (removida a corrompida) */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "48px",
          height: "54px",
          pointerEvents: "none"
        }}
      >
        <LogoAdapta />
      </div>

      {/* ✅ QR Code do Figma - Retângulo branco direito */}
      <div
        style={{
          position: "absolute",
          top: "111px",
          right: "8px",
          width: "15px",
          height: "17px",
          pointerEvents: "none"
        }}
      >
        <Suspense fallback={
          <div style={{ 
            width: "100%", 
            height: "100%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            backgroundColor: "#f5f5f5"
          }}>
            <div style={{ 
              fontSize: "10px", 
              color: "#999",
              fontFamily: "system-ui, sans-serif"
            }}>
              Carregando...
            </div>
          </div>
        }>
          <QRCodeComponent />
        </Suspense>
      </div>
      
      {/* Textos Editáveis Sobrepostos */}
      <div style={textStyles.productTitle}>{data.productTitle}</div>
      <div style={textStyles.composition}>{data.composition}</div>
      <div style={textStyles.weight}>
        {data.weight}
        <span style={textStyles.weightUnit}>{data.weightUnit}</span>
      </div>
      <div style={textStyles.ingredients}>{data.ingredients}</div>
      <div style={textStyles.companyInfo}>{data.companyInfo}</div>
    </div>
  );
}

// Componente Principal
export function FlowerLabel({ defaultType = "cbd" }: { defaultType?: FlowerType }) {
  const [type, setType] = useState<FlowerType>(defaultType);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<FlowerData>({
    productTitle: "Flores in natura",
    composition: "Ricas em THC/CBD 1:1",
    weight: "2,5",
    weightUnit: "g",
    ingredients: "Ingredientes: Flores desidratadas de cannabis sativa in natura. Conservar em local seco e fresco. Uso inalatório, e individual conforme prescrição médica. Manter fora do alcance de crianças, e em frasco hermeticamente selado ou embalagem original.",
    companyInfo: "ADAPTA-Associação de defesa e apoio à pacientes em tratamento com Cannabis · CNPJ: 54.851.457/0001-28"
  });
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Efeito de loading ao trocar tipo de rótulo
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [type]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Info de Layout Bloqueado */}
      <Alert className="mb-3 bg-primary/5 border-primary/20">
        <Lock className="h-3 w-3 text-primary" />
        <AlertDescription className="text-[10px] text-primary">
          <strong>Layout Bloqueado:</strong> As dimensões e posições são fixas ({LABEL_DIMENSIONS.widthMM}×{LABEL_DIMENSIONS.heightMM}mm @ {LABEL_DIMENSIONS.exportDPI} DPI). 
          Apenas o conteúdo textual pode ser editado para garantir a qualidade de impressão.
        </AlertDescription>
      </Alert>

      {/* Seletor de Tipo */}
      <div className="flex gap-1.5 mb-3 flex-shrink-0">
        {[
          { id: "cbd" as FlowerType, label: "Flores CBD", color: "#789d61" },
          { id: "thc" as FlowerType, label: "Flores THC", color: "#a97171" },
          { id: "hybrid" as FlowerType, label: "Flores Híbrida", color: "#c4be7a" }
        ].map((t) => {
          const isActive = type === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`
                flex-1 relative p-2 rounded border transition-all text-center
                hover:border-primary/50
                ${isActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border'
                }
              `}
            >
              <div className="flex items-center justify-center gap-1.5">
                <div 
                  style={{ 
                    width: "12px", 
                    height: "12px", 
                    borderRadius: "50%", 
                    backgroundColor: t.color 
                  }} 
                />
                <div className="text-[11px] font-medium">{t.label}</div>
              </div>
              {isActive && (
                <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Layout Principal - SEM SCROLL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 min-h-0">
        {/* Formulário de Edição - COM SCROLL INTERNO */}
        <div className="border rounded p-2.5 bg-card flex flex-col overflow-hidden">
          <div className="flex items-center gap-1.5 pb-2 border-b flex-shrink-0">
            <Package className="w-3 h-3 text-primary" />
            <div>
              <h3 className="font-semibold text-[11px]">Editor de Rótulo</h3>
              <p className="text-[9px] text-muted-foreground">302×189px · Montserrat</p>
            </div>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1 mt-2">
            {/* Tipo Strain */}
            <div>
              <Label htmlFor="productTitle" className="text-[10px] font-semibold mb-0.5 block">
                Tipo de Strain (itálico)
              </Label>
              <Input
                id="productTitle"
                value={data.productTitle}
                onChange={(e) => setData({ ...data, productTitle: e.target.value })}
                placeholder="Flores in natura"
                className="h-7 text-[11px] italic"
              />
            </div>

            {/* Linha 1 do Produto */}
            <div>
              <Label htmlFor="composition" className="text-[10px] font-semibold mb-0.5 block">
                Composição
              </Label>
              <Input
                id="composition"
                value={data.composition}
                onChange={(e) => setData({ ...data, composition: e.target.value })}
                placeholder="Ricas em THC/CBD 1:1"
                className="h-7 text-[11px]"
              />
            </div>

            {/* Peso */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="weight" className="text-[10px] font-semibold mb-0.5 block">
                  Peso
                </Label>
                <Input
                  id="weight"
                  value={data.weight}
                  onChange={(e) => setData({ ...data, weight: e.target.value })}
                  placeholder="2,5"
                  className="h-7 text-[11px]"
                />
              </div>
              <div>
                <Label htmlFor="weightUnit" className="text-[10px] font-semibold mb-0.5 block">
                  Unidade
                </Label>
                <Input
                  id="weightUnit"
                  value={data.weightUnit}
                  onChange={(e) => setData({ ...data, weightUnit: e.target.value })}
                  placeholder="g"
                  className="h-7 text-[11px]"
                />
              </div>
            </div>

            {/* Ingredientes */}
            <div>
              <Label htmlFor="ingredients" className="text-[10px] font-semibold mb-0.5 block">
                Ingredientes
              </Label>
              <Textarea
                id="ingredients"
                value={data.ingredients}
                onChange={(e) => setData({ ...data, ingredients: e.target.value })}
                placeholder="Ingredientes: Flores desidratadas de cannabis in natura."
                rows={3}
                className="text-[11px] resize-none"
              />
            </div>

            {/* Informações da Empresa */}
            <div>
              <Label htmlFor="companyInfo" className="text-[10px] font-semibold mb-0.5 block">
                Informações da Empresa
              </Label>
              <Textarea
                id="companyInfo"
                value={data.companyInfo}
                onChange={(e) => setData({ ...data, companyInfo: e.target.value })}
                placeholder="ADAPTA-Associação de defesa e apoio à pacientes..."
                rows={2}
                className="text-[11px] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Preview e Exportação - SEM SCROLL */}
        <div className="flex flex-col gap-2 overflow-hidden">
          <div className="border rounded p-2 bg-muted/30 flex justify-center items-center flex-1" style={{ minHeight: "200px" }}>
            {isLoading ? (
              <Skeleton style={{ width: "211px", height: "132px", borderRadius: "3px" }} />
            ) : (
              <div 
                ref={previewRef}
                style={{ 
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  borderRadius: "3px",
                  display: "inline-block",
                  transform: "scale(0.7)",
                  transformOrigin: "center"
                }}
              >
                <FlowerLabelPreview type={type} data={data} />
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <ExportToolbar
              targetRef={previewRef}
              filename={`rotulo-flores-${type}-${data.weight}${data.weightUnit}`}
              scale={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}