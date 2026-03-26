import { useState, useEffect } from "react";
import { 
  FileText, 
  CreditCard, 
  Mail, 
  Award, 
  Megaphone, 
  Package,
  Palette,
  Shirt,
  Signpost,
  BookOpen,
  Box,
  ShoppingBag,
  Tag,
  Disc,
  Bookmark,
  UserCircle
} from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "../ui/badge";

// Importar componentes de materiais
import { 
  Letterhead,
  BusinessCard,
  EmailSignature,
  Certificate,
  Contract,
  Newsletter,
  Notice,
  NoticeGenerator,
  AvatarGenerator
} from "./materials";

import { FlowerLabel } from "./materials/flower-label";

// Tipos
interface MaterialItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description?: string;
  comingSoon?: boolean;
}

interface Category {
  id: string;
  label: string;
  items: MaterialItem[];
}

interface CriarMaterialSimpleProps {
  categoryFilter?: string;
  onLabelSelect?: (labelType: "flores" | "oleo" | "gummie" | "mini-oleo" | "hash") => void; // ✅ Callback para rótulos
  onPackagingSelect?: (packagingType: "box" | "bag" | "label" | "seal" | "tag") => void; // ✅ Callback para embalagens
  onAddToPedido?: (labelId: string) => void; // ✅ Callback para adicionar ao pedido
}

// Definição de todas as categorias e materiais
const CATEGORIES: Category[] = [
  {
    id: "documentos",
    label: "Documentos Corporativos",
    items: [
      { 
        id: "papel-timbrado", 
        label: "Papel Timbrado", 
        icon: FileText,
        description: "Cabeçalho e rodapé com identidade visual"
      },
      { 
        id: "cartao-visita", 
        label: "Cartão de Visita", 
        icon: CreditCard,
        description: "Frente e verso personalizados"
      },
      { 
        id: "assinatura-email", 
        label: "Assinatura de Email", 
        icon: Mail,
        description: "Template HTML responsivo"
      },
      { 
        id: "certificado", 
        label: "Certificado", 
        icon: Award,
        description: "Modelo para certificados e diplomas"
      },
      { 
        id: "contrato", 
        label: "Contrato", 
        icon: FileText,
        description: "Documento legal formatado"
      },
    ]
  },
  {
    id: "marketing",
    label: "Marketing & Comunicação",
    items: [
      { 
        id: "newsletter", 
        label: "Newsletter", 
        icon: Mail,
        description: "Sistema de blocos modulares"
      },
      { 
        id: "avatar-corporativo", 
        label: "Foto de Perfil", 
        icon: UserCircle,
        description: "Padronizador de avatares com identidade visual"
      },
      { 
        id: "comunicado", 
        label: "Comunicado", 
        icon: Megaphone,
        description: "5 formatos multi-canal (Email, Stories, Feed, WhatsApp, Interno)"
      },
    ]
  },
  {
    id: "produtos",
    label: "Produtos & Embalagens",
    items: [
      // Rótulos de Flores (UNIFICADO - 1 card com 3 abas internas)
      { id: "rotulo-flores", label: "Rótulo Flores", icon: Package, description: "CBD · THC · Híbrido (abas internas)" },
      
      // Rótulos de Óleo (UNIFICADO - 1 card com 3 abas internas)
      { id: "rotulo-oleo", label: "Rótulo Óleo", icon: Package, description: "CBD · THC · Híbrido (abas internas)", comingSoon: true },
      
      // Rótulos de Gummie (UNIFICADO - 1 card com 3 abas internas)
      { id: "rotulo-gummie", label: "Rótulo Gummie", icon: Package, description: "CBD · THC · Híbrido (abas internas)", comingSoon: true },
      
      // Miniaturas de Óleo (UNIFICADO - 1 card com 3 abas internas)
      { id: "rotulo-mini-oleo", label: "Miniatura Óleo", icon: Package, description: "CBD · THC · Híbrido (abas internas)", comingSoon: true },
      
      // Outros Rótulos
      { id: "rotulo-hash", label: "Rótulo Hash", icon: Package, comingSoon: true },
      
      // ✅ Tipos de Embalagens
      { id: "embalagem-caixa", label: "Caixa", icon: Box, description: "Planificação completa · 900×600px" },
      { id: "embalagem-sacola", label: "Sacola", icon: ShoppingBag, description: "Vista frontal com alças · 400×500px" },
      { id: "embalagem-etiqueta", label: "Etiqueta", icon: Tag, description: "Rótulo retangular · 400×200px" },
      { id: "embalagem-selo", label: "Selo Circular", icon: Disc, description: "Etiqueta redonda · 300×300px" },
      { id: "embalagem-tag", label: "Tag/Pendente", icon: Bookmark, description: "Etiqueta com furo · 200×350px" },
    ]
  },
  {
    id: "comunicacao",
    label: "Comunicação Visual",
    items: [
      { id: "placa-interna", label: "Placa Interna", icon: Signpost, comingSoon: true },
      { id: "placa-externa", label: "Placa Externa", icon: Signpost, comingSoon: true },
      { id: "camisa", label: "Camisa", icon: Shirt, comingSoon: true },
      { id: "calca-jardineira", label: "Calça Jardineira", icon: Shirt, comingSoon: true },
      { id: "bone", label: "Boné", icon: Shirt, comingSoon: true },
      { id: "jaleco", label: "Jaleco", icon: Shirt, comingSoon: true },
      { id: "manual-institucional", label: "Manual Institucional", icon: BookOpen, comingSoon: true },
    ]
  }
];

// Componente de Empty State
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Palette className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Selecione um material</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Escolha um material à esquerda para começar a criar
      </p>
    </div>
  );
}

// Componente de Coming Soon
function ComingSoonState({ itemLabel }: { itemLabel: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-neutral-500/10 flex items-center justify-center mb-4">
        <Package className="w-8 h-8 text-neutral-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{itemLabel}</h3>
      <Badge variant="outline" className="mb-4">Em breve</Badge>
      <p className="text-sm text-muted-foreground max-w-sm">
        Este material estará disponível em breve. Fique atento às atualizações!
      </p>
    </div>
  );
}

// Switcher de conteúdo
function MaterialContent({ 
  itemId, 
  itemLabel, 
  onLabelSelect,
  onPackagingSelect
}: { 
  itemId: string; 
  itemLabel: string;
  onLabelSelect?: (labelType: "flores" | "oleo" | "gummie" | "mini-oleo" | "hash") => void;
  onPackagingSelect?: (packagingType: "box" | "bag" | "label" | "seal" | "tag") => void;
}) {
  // Encontrar o item para verificar se é comingSoon
  const allItems = CATEGORIES.flatMap(cat => cat.items);
  const item = allItems.find(i => i.id === itemId);
  
  if (item?.comingSoon) {
    return <ComingSoonState itemLabel={itemLabel} />;
  }
  
  // ✅ Se for um rótulo e tem callback, chama o callback ao montar
  useEffect(() => {
    if (itemId.startsWith("rotulo-") && onLabelSelect) {
      const labelTypeMap: { [key: string]: "flores" | "oleo" | "gummie" | "mini-oleo" | "hash" } = {
        "rotulo-flores": "flores",
        "rotulo-oleo": "oleo",
        "rotulo-gummie": "gummie",
        "rotulo-mini-oleo": "mini-oleo",
        "rotulo-hash": "hash",
      };
      const labelType = labelTypeMap[itemId];
      if (labelType) {
        onLabelSelect(labelType);
      }
    }
  }, [itemId, onLabelSelect]);

  // ✅ Se for um rótulo, mostra mensagem de carregamento
  if (itemId.startsWith("rotulo-")) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Abrindo Editor de Rótulo...</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          O editor de {itemLabel} será aberto no Gerador de Embalagens
        </p>
      </div>
    );
  }
  
  // ✅ Se for uma embalagem e tem callback, chama o callback ao montar
  useEffect(() => {
    if (itemId.startsWith("embalagem-") && onPackagingSelect) {
      const packagingTypeMap: { [key: string]: "box" | "bag" | "label" | "seal" | "tag" } = {
        "embalagem-caixa": "box",
        "embalagem-sacola": "bag",
        "embalagem-etiqueta": "label",
        "embalagem-selo": "seal",
        "embalagem-tag": "tag",
      };
      const packagingType = packagingTypeMap[itemId];
      if (packagingType) {
        onPackagingSelect(packagingType);
      }
    }
  }, [itemId, onPackagingSelect]);

  // ✅ Se for uma embalagem, mostra mensagem de carregamento
  if (itemId.startsWith("embalagem-")) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Abrindo Editor de Embalagem...</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          O editor de {itemLabel} será aberto no Gerador de Embalagens
        </p>
      </div>
    );
  }
  
  // TODO: Implementar componentes específicos
  switch (itemId) {
    case "papel-timbrado":
      return <Letterhead />;
    case "cartao-visita":
      return <BusinessCard />;
    case "assinatura-email":
      return <EmailSignature />;
    case "certificado":
      return <Certificate />;
    case "contrato":
      return <Contract />;
    case "newsletter":
      return <Newsletter />;
    case "comunicado":
      return <NoticeGenerator />;
    case "avatar-corporativo":
      return <AvatarGenerator />;
    default:
      return <EmptyState />;
  }
}

// Card de Material
function MaterialCard({ 
  item, 
  isActive, 
  onClick 
}: { 
  item: MaterialItem; 
  isActive: boolean; 
  onClick: () => void;
}) {
  const Icon = item.icon;
  
  return (
    <motion.button
      onClick={onClick}
      disabled={item.comingSoon}
      className={`p-4 rounded-xl border-2 text-left transition-all ${
        isActive 
          ? "border-primary bg-primary/5" 
          : "border-border bg-background hover:border-primary/50"
      } ${item.comingSoon ? "opacity-60 cursor-default" : "cursor-pointer"}`}
      whileHover={!item.comingSoon ? { scale: 1.02, y: -2 } : {}}
      whileTap={!item.comingSoon ? { scale: 0.98 } : {}}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${isActive ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm truncate">{item.label}</h3>
            {item.comingSoon && (
              <Badge variant="outline" className="text-xs">Em breve</Badge>
            )}
          </div>
          {item.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// Componente Principal
export function CriarMaterialSimple({ categoryFilter, onLabelSelect, onPackagingSelect, onAddToPedido }: CriarMaterialSimpleProps) {
  // Filtrar categorias se houver filtro
  const filteredCategories = categoryFilter 
    ? CATEGORIES.filter(cat => cat.id === categoryFilter)
    : CATEGORIES;
  
  // Pegar todos os itens das categorias filtradas
  const allItems = filteredCategories.flatMap(cat => cat.items);
  
  // ✅ NÃO selecionar nada por padrão - deixar vazio
  const [activeItem, setActiveItem] = useState<string>("");
  
  // Encontrar o item ativo
  const activeItemData = allItems.find(item => item.id === activeItem);
  
  return (
    <div className="space-y-6">
      {/* Grid de seleção de materiais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allItems.map((item) => (
          <MaterialCard
            key={item.id}
            item={item}
            isActive={activeItem === item.id}
            onClick={() => setActiveItem(item.id)}
          />
        ))}
      </div>
      
      {/* Conteúdo do material ativo */}
      {activeItem && (
        <div className="border-2 border-border rounded-xl p-6 bg-background">
          <MaterialContent 
            itemId={activeItem} 
            itemLabel={activeItemData?.label || ""} 
            onLabelSelect={onLabelSelect}
            onPackagingSelect={onPackagingSelect}
          />
        </div>
      )}
    </div>
  );
}