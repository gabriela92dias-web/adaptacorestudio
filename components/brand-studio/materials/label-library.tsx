// Biblioteca de Rótulos Prontos - ADAPTA CORE STUDIO
// Visualização, upload e seleção (sem edição)
import { lazy, Suspense, useState, useEffect, useRef } from "react";
import { Package, Check, Upload, X, FileText, Image as ImageIcon, Trash2, Plus, Box, Leaf, Sparkles, Folder } from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { toast } from "sonner";
import { ErrorBoundary } from "../../ui/error-boundary";

const RotuloCBD = lazy(() => import("../../../imports/Rotulos011"));
const RotuloTHC = lazy(() => import("../../../imports/Rotulos021"));
const RotuloHibrido = lazy(() => import("../../../imports/Rotulos031"));

// Tipos de arquivo aceitos
const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/svg+xml': ['.svg'],
} as const;

// Tipo de rótulo customizado (uploaded)
interface CustomLabel {
  id: string;
  nome: string;
  tipo: string;
  categoria: string;
  fileType: 'pdf' | 'png' | 'jpg' | 'svg';
  fileData: string; // base64
  uploadedAt: string;
  linkedToFigma?: string; // ID do rótulo do Figma que esse customiza
}

// Definição dos rótulos do Figma (pré-definidos)
const ROTULOS_FIGMA = [
  {
    id: "flores-cbd",
    nome: "Flores CBD",
    tipo: "cbd",
    composicao: "Ricas em CBD 0:1",
    peso: "2,5g",
    categoria: "CBD",
    cor: "#789d61",
    Component: RotuloCBD,
    source: "figma" as const
  },
  {
    id: "flores-thc",
    nome: "Flores THC",
    tipo: "thc",
    composicao: "Ricas em THC 1:0",
    peso: "2,5g",
    categoria: "THC",
    cor: "#a97171",
    Component: RotuloTHC,
    source: "figma" as const
  },
  {
    id: "flores-hibrida",
    nome: "Flores Híbrida",
    tipo: "hybrid",
    composicao: "Ricas em THC/CBD 1:1",
    peso: "2,5g",
    categoria: "Híbrida",
    cor: "#c4be7a",
    Component: RotuloHibrido,
    source: "figma" as const
  }
] as const;

interface LabelLibraryProps {
  onAddToPedido?: (rotuloId: string) => void;
  selectedIds?: string[];
}

// Storage key para localStorage
const STORAGE_KEY = "adapta_custom_labels";

// Loading Skeleton para os rótulos
function LabelSkeleton() {
  return (
    <div 
      style={{ 
        width: "302px", 
        height: "189px",
        backgroundColor: "#f5f5f5",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div style={{ 
        fontSize: "12px", 
        color: "#999",
        fontFamily: "system-ui, sans-serif"
      }}>
        Carregando rótulo...
      </div>
    </div>
  );
}

// Card de Rótulo com Drag & Drop - Pode ser do Figma ou Customizado
function LabelCard({ 
  figmaRotulo,
  customLabel,
  isSelected, 
  onAddToPedido,
  onUploadToSlot,
  onRemoveCustom
}: { 
  figmaRotulo: typeof ROTULOS_FIGMA[number];
  customLabel?: CustomLabel | null;
  isSelected: boolean;
  onAddToPedido?: (id: string) => void;
  onUploadToSlot: (file: File, figmaId: string) => void;
  onRemoveCustom?: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const { Component } = figmaRotulo;

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      onUploadToSlot(file, figmaRotulo.id);
    }
  };

  const displayLabel = customLabel || figmaRotulo;
  const isCustom = !!customLabel;
  const getFileIcon = () => {
    if (!customLabel) return null;
    switch (customLabel.fileType) {
      case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
      case 'svg': return <ImageIcon className="w-4 h-4 text-purple-500" />;
      default: return <ImageIcon className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div 
      className={`
        border rounded-lg overflow-hidden bg-card transition-all relative group
        ${isDragging ? 'border-primary border-2 shadow-lg scale-105' : 'hover:border-primary/30'}
      `}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Overlay de Drag */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary/20 z-10 flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            <Upload className="w-12 h-12 text-primary mx-auto mb-2 animate-bounce" />
            <p className="text-sm font-semibold text-primary">
              {isCustom ? 'Solte para substituir' : 'Solte para adicionar'}
            </p>
          </div>
        </div>
      )}

      {/* Preview do Rótulo */}
      <div className="p-4 bg-muted/30 flex justify-center items-center relative" style={{ minHeight: "180px" }}>
        {isCustom ? (
          // Rótulo Customizado
          customLabel.fileType === 'pdf' ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <FileText className="w-16 h-16" />
              <span className="text-xs font-medium">Arquivo PDF</span>
            </div>
          ) : (
            <img 
              src={customLabel.fileData} 
              alt={customLabel.nome}
              className="max-w-full max-h-[140px] object-contain"
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            />
          )
        ) : (
          // Rótulo do Figma
          <div 
            style={{ 
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderRadius: "3px",
              display: "inline-block",
              transform: "scale(0.6)",
              transformOrigin: "center"
            }}
          >
            <Suspense fallback={<LabelSkeleton />}>
              <Component />
            </Suspense>
          </div>
        )}

        {/* Botão de remover customizado (hover) */}
        {isCustom && onRemoveCustom && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity z-20"
            onClick={onRemoveCustom}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}

        {/* Indicador de upload disponível */}
        {!isCustom && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="text-center text-white">
              <Upload className="w-8 h-8 mx-auto mb-1" />
              <p className="text-xs font-medium">Arraste seu rótulo aqui</p>
            </div>
          </div>
        )}
      </div>

      {/* Informações e Ações */}
      <div className="p-3 space-y-2">
        {/* Header com Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isCustom ? (
              getFileIcon()
            ) : (
              <div 
                style={{ 
                  width: "12px", 
                  height: "12px", 
                  borderRadius: "50%", 
                  backgroundColor: figmaRotulo.cor 
                }} 
              />
            )}
            <h3 className="font-semibold text-sm truncate">{isCustom ? customLabel.nome : figmaRotulo.nome}</h3>
          </div>
          <Badge variant="outline" className="text-[10px]">
            {isCustom ? customLabel.categoria : figmaRotulo.categoria}
          </Badge>
        </div>

        {/* Detalhes */}
        <div className="text-xs text-muted-foreground space-y-1">
          {isCustom ? (
            <>
              <div className="flex items-center gap-1.5"><Folder className="w-3 h-3" /> {customLabel.fileType.toUpperCase()}</div>
              <div className="text-[10px] opacity-60 flex items-center gap-1"><Upload className="w-3 h-3" /> Personalizado · <Sparkles className="w-3 h-3" /> Base: {figmaRotulo.nome}</div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5"><Box className="w-3 h-3" /> {figmaRotulo.peso}</div>
              <div className="flex items-center gap-1.5"><Leaf className="w-3 h-3" /> {figmaRotulo.composicao}</div>
              <div className="text-[10px] opacity-60 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Do Figma · Arraste para personalizar</div>
            </>
          )}
        </div>

        {/* Botão de Ação */}
        <Button
          onClick={() => onAddToPedido?.(figmaRotulo.id)}
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className="w-full text-xs"
        >
          {isSelected ? (
            <>
              <Check className="w-3 h-3 mr-1.5" />
              Adicionado ao Pedido
            </>
          ) : (
            <>
              <Package className="w-3 h-3 mr-1.5" />
              Adicionar ao Pedido
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Modal de Upload
function UploadModal({ 
  isOpen, 
  onClose, 
  onUpload 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onUpload: (label: Omit<CustomLabel, 'id' | 'uploadedAt'>) => void;
}) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (selectedFile: File) => {
    // Validar tipo
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/svg+xml'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Tipo de arquivo não suportado. Use PDF, PNG, JPG ou SVG.");
      return;
    }

    // Validar tamanho (máx 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 5MB.");
      return;
    }

    setFile(selectedFile);

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  // Drag & Drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleSubmit = () => {
    if (!nome || !categoria || !file || !preview) {
      toast.error("Preencha todos os campos e selecione um arquivo.");
      return;
    }

    const fileType = file.type.split('/')[1] as 'pdf' | 'png' | 'jpg' | 'svg';

    onUpload({
      nome,
      tipo: tipo || categoria,
      categoria,
      fileType: fileType,
      fileData: preview
    });

    // Reset
    setNome("");
    setTipo("");
    setCategoria("");
    setFile(null);
    setPreview(null);
    onClose();
    toast.success("Rótulo adicionado à biblioteca!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border rounded-lg max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Adicionar Rótulo Personalizado</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="nome" className="text-xs">Nome do Rótulo *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Flores CBD Premium"
              className="h-9 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="categoria" className="text-xs">Categoria *</Label>
              <Input
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Ex: CBD, THC"
                className="h-9 text-sm"
              />
            </div>

            <div>
              <Label htmlFor="tipo" className="text-xs">Tipo (opcional)</Label>
              <Input
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                placeholder="Ex: Flores, Óleo"
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="file" className="text-xs">Arquivo (PDF, PNG, JPG, SVG) *</Label>
            <div className="mt-1">
              <input
                ref={fileInputRef}
                type="file"
                id="file"
                accept=".pdf,.png,.jpg,.jpeg,.svg"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {/* Área de Drag & Drop */}
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
                  ${isDragging 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                  }
                `}
              >
                {file ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-primary">
                      {file.type === 'application/pdf' ? (
                        <FileText className="w-8 h-8" />
                      ) : (
                        <ImageIcon className="w-8 h-8" />
                      )}
                    </div>
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Clique ou arraste para trocar
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <Upload className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {isDragging ? 'Solte o arquivo aqui' : 'Arraste um arquivo'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ou clique para selecionar
                      </p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      PDF, PNG, JPG ou SVG · Máx 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {preview && (
            <div className="border rounded p-2 bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Preview:</p>
              {file?.type === 'application/pdf' ? (
                <div className="flex items-center gap-2 text-muted-foreground p-4">
                  <FileText className="w-8 h-8" />
                  <span className="text-xs">{file.name}</span>
                </div>
              ) : (
                <img src={preview} alt="Preview" className="max-h-32 mx-auto" />
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
}

// Componente Principal
export function LabelLibrary({ onAddToPedido, selectedIds = [] }: LabelLibraryProps) {
  const [customLabels, setCustomLabels] = useState<CustomLabel[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  console.log("[LabelLibrary] Componente montado!");

  // ✅ Carregar rótulos do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCustomLabels(parsed);
      }
    } catch (error) {
      // Silently fail
    }
  }, []);

  // Salvar no localStorage
  const saveToStorage = (labels: CustomLabel[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(labels));
    } catch (error) {
      console.error("Erro ao salvar rótulos:", error);
      toast.error("Erro ao salvar. Espaço insuficiente.");
    }
  };

  const handleUpload = (labelData: Omit<CustomLabel, 'id' | 'uploadedAt'>) => {
    const newLabel: CustomLabel = {
      ...labelData,
      id: `custom-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };

    const updated = [...customLabels, newLabel];
    setCustomLabels(updated);
    saveToStorage(updated);
  };

  const handleDelete = (id: string) => {
    const updated = customLabels.filter(l => l.id !== id);
    setCustomLabels(updated);
    saveToStorage(updated);
    toast.success("Rótulo removido da biblioteca");
  };

  // Upload vinculado a um slot específico (substitui ou adiciona)
  const handleUploadToSlot = (file: File, figmaId: string) => {
    // Validar tipo
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error("Tipo de arquivo não suportado. Use PDF, PNG, JPG ou SVG.");
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 5MB.");
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const rawType = file.type.split('/')[1];
      const fileType = rawType === 'jpeg' ? 'jpg' : rawType as 'pdf' | 'png' | 'jpg' | 'svg';
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extensão
      const figmaRotulo = ROTULOS_FIGMA.find(r => r.id === figmaId);
      
      // Verificar se já existe um customizado para esse slot
      const existing = customLabels.find(l => l.linkedToFigma === figmaId);
      
      if (existing) {
        // Atualizar existente
        const updated = customLabels.map(l => 
          l.linkedToFigma === figmaId
            ? {
                ...l,
                nome: fileName,
                fileType: fileType,
                fileData: reader.result as string,
                uploadedAt: new Date().toISOString()
              }
            : l
        );
        setCustomLabels(updated);
        saveToStorage(updated);
        toast.success(`${fileName} substituiu o rótulo anterior!`);
      } else {
        // Criar novo
        const newLabel: CustomLabel = {
          id: `custom-${Date.now()}`,
          nome: fileName,
          tipo: figmaRotulo?.tipo || "custom",
          categoria: figmaRotulo?.categoria || "Customizado",
          fileType: fileType === 'jpeg' ? 'jpg' : fileType as 'pdf' | 'png' | 'jpg' | 'svg',
          fileData: reader.result as string,
          uploadedAt: new Date().toISOString(),
          linkedToFigma: figmaId
        };
        
        const updated = [...customLabels, newLabel];
        setCustomLabels(updated);
        saveToStorage(updated);
        toast.success(`${fileName} adicionado como ${figmaRotulo?.nome}!`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Remover rótulo customizado de um slot
  const handleRemoveFromSlot = (figmaId: string) => {
    const updated = customLabels.filter(l => l.linkedToFigma !== figmaId);
    setCustomLabels(updated);
    saveToStorage(updated);
    toast.success("Rótulo personalizado removido. Voltando ao padrão do Figma.");
  };

  const totalLabels = ROTULOS_FIGMA.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Biblioteca de Rótulos</h2>
          <p className="text-xs text-muted-foreground">
            {totalLabels} rótulos disponíveis · Arraste seus arquivos para personalizar
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Badge variant="default" className="text-xs">
              {selectedIds.length} selecionado{selectedIds.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      {/* Grid de Rótulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Rótulos do Figma (com possibilidade de customização) */}
        {ROTULOS_FIGMA.map((rotulo) => {
          const customLabel = customLabels.find(l => l.linkedToFigma === rotulo.id);
          
          return (
            <ErrorBoundary key={rotulo.id}>
              <LabelCard
                figmaRotulo={rotulo}
                customLabel={customLabel}
                isSelected={selectedIds.includes(rotulo.id)}
                onAddToPedido={onAddToPedido}
                onUploadToSlot={handleUploadToSlot}
                onRemoveCustom={customLabel ? () => handleRemoveFromSlot(rotulo.id) : undefined}
              />
            </ErrorBoundary>
          );
        })}
      </div>

      {/* Info */}
      <div className="border rounded-lg p-3 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-2">
          <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-xs text-primary space-y-1">
            <div className="font-semibold">Rótulos Prontos para Produção</div>
            <div className="opacity-90">
              • <strong>Upload:</strong> Adicione PDFs, PNGs, SVGs ou JPGs (máx 5MB)<br />
              • <strong>Figma:</strong> Rótulos com dimensões 80×50mm @ 300 DPI<br />
              • Selecione e adicione ao Gerador de Pedidos
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Upload */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}