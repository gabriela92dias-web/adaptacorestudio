import { useState, useRef } from "react";
import { 
  Mail, 
  Plus, 
  GripVertical, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  Type,
  Image as ImageIcon,
  Columns as ColumnsIcon,
  Minus,
  MousePointerClick
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { ExportToolbar } from "../export-toolbar";
import { Badge } from "../../ui/badge";

const BRAND_DATA = {
  companyName: "ADAPTA",
  website: "www.adapta.com.br",
  primaryColor: "#666666"
};

// Tipos de blocos
type BlockType = "header" | "text" | "image" | "imageText" | "cta" | "divider" | "columns";

interface BaseBlock {
  id: string;
  type: BlockType;
}

interface HeaderBlock extends BaseBlock {
  type: "header";
  title: string;
  subtitle: string;
}

interface TextBlock extends BaseBlock {
  type: "text";
  content: string;
}

interface ImageBlock extends BaseBlock {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
}

interface ImageTextBlock extends BaseBlock {
  type: "imageText";
  src: string;
  title: string;
  text: string;
  position: "left" | "right";
}

interface CTABlock extends BaseBlock {
  type: "cta";
  label: string;
  url: string;
}

interface DividerBlock extends BaseBlock {
  type: "divider";
}

interface ColumnsBlock extends BaseBlock {
  type: "columns";
  col1Title: string;
  col1Text: string;
  col2Title: string;
  col2Text: string;
  col3Title: string;
  col3Text: string;
}

type Block = HeaderBlock | TextBlock | ImageBlock | ImageTextBlock | CTABlock | DividerBlock | ColumnsBlock;

// Template padrão
const INITIAL_BLOCKS: Block[] = [
  {
    id: "1",
    type: "header",
    title: "Newsletter Mensal",
    subtitle: "Edição de Março de 2026 • Tendências em Branding"
  },
  {
    id: "2",
    type: "image",
    src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=300&fit=crop",
    alt: "Equipe em reunião"
  },
  {
    id: "3",
    type: "text",
    content: "Olá! Bem-vindo à nossa newsletter mensal. Este mês trazemos insights exclusivos sobre branding estratégico e tendências do mercado."
  },
  {
    id: "4",
    type: "imageText",
    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&h=200&fit=crop",
    title: "Tendências em Branding",
    text: "Descubra as principais tendências que estão moldando o futuro da identidade visual corporativa.",
    position: "right"
  },
  {
    id: "5",
    type: "columns",
    col1Title: "Identidade Visual",
    col1Text: "Crie uma marca memorável",
    col2Title: "Comunicação",
    col2Text: "Conecte-se com seu público",
    col3Title: "Estratégia",
    col3Text: "Planeje o futuro da marca"
  },
  {
    id: "6",
    type: "cta",
    label: "Confira o artigo completo",
    url: "https://adapta.com.br/blog"
  },
  {
    id: "7",
    type: "divider"
  },
  {
    id: "8",
    type: "text",
    content: "Não perca nossas próximas edições! Até o próximo mês."
  }
];

// Renderizadores de blocos (HTML para newsletter)
function renderHeaderBlock(block: HeaderBlock): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${BRAND_DATA.primaryColor}; padding: 40px 20px;">
      <tr>
        <td align="center">
          <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 8px 0; font-family: Arial, sans-serif;">
            ${block.title}
          </h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; font-family: Arial, sans-serif;">
            ${block.subtitle}
          </p>
        </td>
      </tr>
    </table>
  `;
}

function renderTextBlock(block: TextBlock): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 20px;">
      <tr>
        <td style="color: #333333; font-size: 14px; line-height: 1.6; font-family: Arial, sans-serif;">
          ${block.content.replace(/\n/g, '<br>')}
        </td>
      </tr>
    </table>
  `;
}

function renderImageBlock(block: ImageBlock): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center">
          <img src="${block.src}" alt="${block.alt}" style="max-width: 100%; height: auto; display: block;" />
          ${block.caption ? `<p style="color: #999999; font-size: 12px; margin: 8px 0 0 0; font-family: Arial, sans-serif;">${block.caption}</p>` : ''}
        </td>
      </tr>
    </table>
  `;
}

function renderImageTextBlock(block: ImageTextBlock): string {
  const imageCell = `
    <td width="40%" valign="top">
      <img src="${block.src}" alt="${block.title}" style="max-width: 100%; height: auto; display: block;" />
    </td>
  `;
  
  const textCell = `
    <td width="60%" valign="top" style="padding: ${block.position === 'left' ? '0 0 0 20px' : '0 20px 0 0'};">
      <h3 style="color: #1a1a1a; font-size: 18px; margin: 0 0 12px 0; font-family: Arial, sans-serif;">
        ${block.title}
      </h3>
      <p style="color: #333333; font-size: 14px; line-height: 1.6; margin: 0; font-family: Arial, sans-serif;">
        ${block.text}
      </p>
    </td>
  `;
  
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 20px;">
      <tr>
        ${block.position === 'left' ? imageCell + textCell : textCell + imageCell}
      </tr>
    </table>
  `;
}

function renderCTABlock(block: CTABlock): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 30px 20px;">
      <tr>
        <td align="center">
          <a href="${block.url}" style="background-color: ${BRAND_DATA.primaryColor}; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600; display: inline-block; font-family: Arial, sans-serif;">
            ${block.label}
          </a>
        </td>
      </tr>
    </table>
  `;
}

function renderDividerBlock(): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 20px;">
      <tr>
        <td>
          <div style="border-top: 2px solid #eeeeee;"></div>
        </td>
      </tr>
    </table>
  `;
}

function renderColumnsBlock(block: ColumnsBlock): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 20px;">
      <tr>
        <td width="33%" valign="top" style="padding-right: 10px;">
          <h4 style="color: ${BRAND_DATA.primaryColor}; font-size: 14px; margin: 0 0 8px 0; font-family: Arial, sans-serif;">
            ${block.col1Title}
          </h4>
          <p style="color: #666666; font-size: 13px; line-height: 1.5; margin: 0; font-family: Arial, sans-serif;">
            ${block.col1Text}
          </p>
        </td>
        <td width="33%" valign="top" style="padding: 0 10px;">
          <h4 style="color: ${BRAND_DATA.primaryColor}; font-size: 14px; margin: 0 0 8px 0; font-family: Arial, sans-serif;">
            ${block.col2Title}
          </h4>
          <p style="color: #666666; font-size: 13px; line-height: 1.5; margin: 0; font-family: Arial, sans-serif;">
            ${block.col2Text}
          </p>
        </td>
        <td width="33%" valign="top" style="padding-left: 10px;">
          <h4 style="color: ${BRAND_DATA.primaryColor}; font-size: 14px; margin: 0 0 8px 0; font-family: Arial, sans-serif;">
            ${block.col3Title}
          </h4>
          <p style="color: #666666; font-size: 13px; line-height: 1.5; margin: 0; font-family: Arial, sans-serif;">
            ${block.col3Text}
          </p>
        </td>
      </tr>
    </table>
  `;
}

function renderBlock(block: Block): string {
  switch (block.type) {
    case "header":
      return renderHeaderBlock(block);
    case "text":
      return renderTextBlock(block);
    case "image":
      return renderImageBlock(block);
    case "imageText":
      return renderImageTextBlock(block);
    case "cta":
      return renderCTABlock(block);
    case "divider":
      return renderDividerBlock();
    case "columns":
      return renderColumnsBlock(block);
    default:
      return "";
  }
}

// Componente de Editor de Bloco
function BlockEditor({ 
  block, 
  onUpdate, 
  onDelete, 
  onMoveUp, 
  onMoveDown,
  isFirst,
  isLast
}: { 
  block: Block; 
  onUpdate: (block: Block) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const blockTypeLabels: Record<BlockType, string> = {
    header: "Cabeçalho",
    text: "Texto",
    image: "Imagem",
    imageText: "Imagem + Texto",
    cta: "Botão CTA",
    divider: "Divisor",
    columns: "3 Colunas"
  };

  return (
    <div className="border rounded-lg p-4 bg-background">
      {/* Header do Bloco */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <Badge variant="outline">{blockTypeLabels[block.type]}</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveUp}
            disabled={isFirst}
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveDown}
            disabled={isLast}
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      {/* Campos do Bloco */}
      <div className="space-y-3">
        {block.type === "header" && (
          <>
            <div>
              <Label>Título</Label>
              <Input
                value={block.title}
                onChange={(e) => onUpdate({ ...block, title: e.target.value })}
                placeholder="Newsletter Mensal"
              />
            </div>
            <div>
              <Label>Subtítulo</Label>
              <Input
                value={block.subtitle}
                onChange={(e) => onUpdate({ ...block, subtitle: e.target.value })}
                placeholder="Edição de Março..."
              />
            </div>
          </>
        )}

        {block.type === "text" && (
          <div>
            <Label>Conteúdo</Label>
            <Textarea
              value={block.content}
              onChange={(e) => onUpdate({ ...block, content: e.target.value })}
              placeholder="Digite o texto..."
              rows={4}
            />
          </div>
        )}

        {block.type === "image" && (
          <>
            <div>
              <Label>URL da Imagem</Label>
              <Input
                value={block.src}
                onChange={(e) => onUpdate({ ...block, src: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Texto Alternativo</Label>
              <Input
                value={block.alt}
                onChange={(e) => onUpdate({ ...block, alt: e.target.value })}
                placeholder="Descrição da imagem"
              />
            </div>
            <div>
              <Label>Legenda (opcional)</Label>
              <Input
                value={block.caption || ""}
                onChange={(e) => onUpdate({ ...block, caption: e.target.value })}
                placeholder="Legenda da imagem"
              />
            </div>
          </>
        )}

        {block.type === "imageText" && (
          <>
            <div>
              <Label>URL da Imagem</Label>
              <Input
                value={block.src}
                onChange={(e) => onUpdate({ ...block, src: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Título</Label>
              <Input
                value={block.title}
                onChange={(e) => onUpdate({ ...block, title: e.target.value })}
                placeholder="Título do conteúdo"
              />
            </div>
            <div>
              <Label>Texto</Label>
              <Textarea
                value={block.text}
                onChange={(e) => onUpdate({ ...block, text: e.target.value })}
                placeholder="Descrição..."
                rows={3}
              />
            </div>
            <div>
              <Label>Posição da Imagem</Label>
              <Select
                value={block.position}
                onValueChange={(value: "left" | "right") => onUpdate({ ...block, position: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Esquerda</SelectItem>
                  <SelectItem value="right">Direita</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {block.type === "cta" && (
          <>
            <div>
              <Label>Texto do Botão</Label>
              <Input
                value={block.label}
                onChange={(e) => onUpdate({ ...block, label: e.target.value })}
                placeholder="Saiba mais"
              />
            </div>
            <div>
              <Label>URL</Label>
              <Input
                value={block.url}
                onChange={(e) => onUpdate({ ...block, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </>
        )}

        {block.type === "columns" && (
          <>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>Coluna 1 - Título</Label>
                <Input
                  value={block.col1Title}
                  onChange={(e) => onUpdate({ ...block, col1Title: e.target.value })}
                  placeholder="Título"
                />
              </div>
              <div>
                <Label>Coluna 2 - Título</Label>
                <Input
                  value={block.col2Title}
                  onChange={(e) => onUpdate({ ...block, col2Title: e.target.value })}
                  placeholder="Título"
                />
              </div>
              <div>
                <Label>Coluna 3 - Título</Label>
                <Input
                  value={block.col3Title}
                  onChange={(e) => onUpdate({ ...block, col3Title: e.target.value })}
                  placeholder="Título"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Textarea
                  value={block.col1Text}
                  onChange={(e) => onUpdate({ ...block, col1Text: e.target.value })}
                  placeholder="Texto da coluna 1"
                  rows={2}
                />
              </div>
              <div>
                <Textarea
                  value={block.col2Text}
                  onChange={(e) => onUpdate({ ...block, col2Text: e.target.value })}
                  placeholder="Texto da coluna 2"
                  rows={2}
                />
              </div>
              <div>
                <Textarea
                  value={block.col3Text}
                  onChange={(e) => onUpdate({ ...block, col3Text: e.target.value })}
                  placeholder="Texto da coluna 3"
                  rows={2}
                />
              </div>
            </div>
          </>
        )}

        {block.type === "divider" && (
          <p className="text-sm text-muted-foreground">
            Este bloco não possui campos editáveis.
          </p>
        )}
      </div>
    </div>
  );
}

// Componente Principal
export function Newsletter() {
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const addBlock = (type: BlockType) => {
    const newBlock: Block = (() => {
      const id = Date.now().toString();
      switch (type) {
        case "header":
          return { id, type, title: "Novo Cabeçalho", subtitle: "Subtítulo" };
        case "text":
          return { id, type, content: "Novo parágrafo de texto..." };
        case "image":
          return { id, type, src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=300&fit=crop", alt: "Imagem" };
        case "imageText":
          return { id, type, src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop", title: "Título", text: "Texto...", position: "right" };
        case "cta":
          return { id, type, label: "Clique aqui", url: "https://" };
        case "divider":
          return { id, type };
        case "columns":
          return { 
            id, 
            type, 
            col1Title: "Coluna 1", 
            col1Text: "Texto 1",
            col2Title: "Coluna 2",
            col2Text: "Texto 2",
            col3Title: "Coluna 3",
            col3Text: "Texto 3"
          };
        default:
          return { id, type: "text", content: "" };
      }
    })();
    
    setBlocks([...blocks, newBlock as Block]);
    setShowAddMenu(false);
  };

  const updateBlock = (index: number, updatedBlock: Block) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    setBlocks(newBlocks);
  };

  const deleteBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const generateHTML = () => {
    const blocksHTML = blocks.map(renderBlock).join("");
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter - ${BRAND_DATA.companyName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          ${blocksHTML}
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9f9f9; padding: 20px; border-top: 1px solid #eeeeee;">
            <tr>
              <td align="center" style="color: #999999; font-size: 12px; font-family: Arial, sans-serif;">
                <p style="margin: 0 0 8px 0;">${BRAND_DATA.companyName} • ${BRAND_DATA.website}</p>
                <p style="margin: 0;">Você está recebendo este email porque se inscreveu em nossa newsletter.</p>
              </td>
            </tr>
          </table>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  };

  const getHtml = () => generateHTML();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Newsletter Generator</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Sistema de blocos modulares · Layout responsivo para email
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Blocos ({blocks.length})</h3>
            <Button
              size="sm"
              onClick={() => setShowAddMenu(!showAddMenu)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Bloco
            </Button>
          </div>

          {/* Menu de Adicionar */}
          {showAddMenu && (
            <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg">
              <Button variant="outline" size="sm" onClick={() => addBlock("header")}>
                <Type className="w-4 h-4 mr-2" />
                Cabeçalho
              </Button>
              <Button variant="outline" size="sm" onClick={() => addBlock("text")}>
                <Type className="w-4 h-4 mr-2" />
                Texto
              </Button>
              <Button variant="outline" size="sm" onClick={() => addBlock("image")}>
                <ImageIcon className="w-4 h-4 mr-2" />
                Imagem
              </Button>
              <Button variant="outline" size="sm" onClick={() => addBlock("imageText")}>
                <ImageIcon className="w-4 h-4 mr-2" />
                Imagem + Texto
              </Button>
              <Button variant="outline" size="sm" onClick={() => addBlock("cta")}>
                <MousePointerClick className="w-4 h-4 mr-2" />
                Botão CTA
              </Button>
              <Button variant="outline" size="sm" onClick={() => addBlock("divider")}>
                <Minus className="w-4 h-4 mr-2" />
                Divisor
              </Button>
              <Button variant="outline" size="sm" onClick={() => addBlock("columns")} className="col-span-2">
                <ColumnsIcon className="w-4 h-4 mr-2" />
                3 Colunas
              </Button>
            </div>
          )}

          {/* Lista de Blocos */}
          <div className="space-y-3 overflow-y-auto pr-2" style={{ maxHeight: "calc(100vh - 400px)" }}>
            {blocks.map((block, index) => (
              <BlockEditor
                key={block.id}
                block={block}
                onUpdate={(updated) => updateBlock(index, updated)}
                onDelete={() => deleteBlock(index)}
                onMoveUp={() => moveBlock(index, "up")}
                onMoveDown={() => moveBlock(index, "down")}
                isFirst={index === 0}
                isLast={index === blocks.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4 overflow-hidden">
          <h3 className="font-semibold">Preview</h3>
          <div className="border rounded-lg bg-gray-50 overflow-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
            <div className="p-4">
              <div 
                ref={previewRef}
                dangerouslySetInnerHTML={{ __html: generateHTML() }}
                style={{ 
                  maxWidth: "600px",
                  margin: "0 auto",
                  backgroundColor: "#ffffff"
                }}
              />
            </div>
          </div>

          {/* Export Toolbar */}
          <ExportToolbar
            targetRef={previewRef}
            getHtml={getHtml}
            filename="newsletter"
            scale={2}
            showHtml={true}
          />
        </div>
      </div>
    </div>
  );
}