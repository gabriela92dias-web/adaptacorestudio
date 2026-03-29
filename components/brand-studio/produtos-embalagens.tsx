import React, { useState, useEffect, useRef, useMemo } from "react";
import { Package, ChevronDown, Box, FileText } from "lucide-react";
import { CriarMaterialSimple } from "./criar-material-simple";
import { InfoNote } from "./info-note";
import { PackagingGenerator } from "./materials/packaging";
import { OrderGenerator } from "./materials/order-generator";
import { useTranslations } from "../../i18n/use-translations";

type ActiveSection = "produtos" | "gerador" | "pedido" | null;
type LabelType = "flores" | "oleo" | "gummie" | "mini-oleo" | "hash" | null;
type PackagingType = "box" | "bag" | "label" | "seal" | "tag" | null;

// Interface para itens do pedido
interface OrderItem {
  id: string;
  type: string;
  name: string;
  category: string;
}

export function ProdutosEmbalagens() {
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [selectedLabel, setSelectedLabel] = useState<LabelType>(null);
  const [selectedPackaging, setSelectedPackaging] = useState<PackagingType>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Função para adicionar rótulo ao pedido
  const handleAddToPedido = (rotuloId: string) => {
    // Verificar se já está no pedido
    const alreadyAdded = orderItems.some(item => item.id === rotuloId);
    
    if (alreadyAdded) {
      // Remover do pedido
      setOrderItems(prev => prev.filter(item => item.id !== rotuloId));
    } else {
      // Adicionar ao pedido
      const newItem: OrderItem = {
        id: rotuloId,
        type: "Rótulo",
        name: rotuloId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        category: rotuloId.includes('cbd') ? 'CBD' : rotuloId.includes('thc') ? 'THC' : 'Híbrida'
      };
      setOrderItems(prev => [...prev, newItem]);
    }
  };

  // ✅ Contadores reais da biblioteca de produtos
  const totalItems = 10; // 5 rótulos + 5 embalagens
  const availableItems = 6; // 1 rótulo (flores com 3 abas) + 5 embalagens
  const inDevelopmentItems = 4; // 4 rótulos em desenvolvimento (óleo, gummie, mini-óleo, hash)

  const toggleSection = (section: ActiveSection) => {
    // Se clicar no mesmo que está aberto, fecha tudo
    // Se clicar em outro, abre o novo (e fecha o anterior automaticamente)
    setActiveSection(activeSection === section ? null : section);
  };

  // ✅ Função para abrir o gerador com um rótulo específico
  const handleLabelSelect = (labelType: LabelType) => {
    setSelectedLabel(labelType);
    setSelectedPackaging(null); // Limpa embalagem se havia uma selecionada
    setActiveSection("gerador"); // Abre o acordeão de gerador
  };

  // ✅ Função para abrir o gerador com uma embalagem específica
  const handlePackagingSelect = (packagingType: PackagingType) => {
    setSelectedPackaging(packagingType);
    setSelectedLabel(null); // Limpa rótulo se havia um selecionado
    setActiveSection("gerador"); // Abre o acordeão de gerador
  };

  // ✅ Quando abre uma seção, limpa o rótulo selecionado se não for o gerador
  useEffect(() => {
    if (activeSection === "produtos") {
      setSelectedLabel(null); // Limpa rótulo ao abrir biblioteca de produtos
      setSelectedPackaging(null); // Limpa embalagem ao abrir biblioteca de produtos
    }
  }, [activeSection]);

  // Fecha acordeão ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveSection(null); // Fecha ao clicar fora
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const t = useTranslations();

  return (
    <div className="p-2 max-w-[1400px] mx-auto" ref={containerRef}>
      <div className="space-y-1.5">
        {/* Header Principal Compacto */}
        <div className="flex items-center gap-2 pb-1.5 border-b">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Produtos & Embalagens</h1>
            <p className="text-xs text-muted-foreground">
              Desenvolva designs de embalagens e materiais de produto
            </p>
          </div>
        </div>

        {/* Acordeão 1: Produtos (Rótulos) */}
        <div className="border rounded-lg overflow-hidden bg-card">
          <button
            onClick={() => toggleSection("produtos")}
            className="w-full flex items-center justify-between p-2.5 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded transition-colors ${
                activeSection === "produtos" 
                  ? "bg-primary/10 text-primary" 
                  : "bg-muted text-muted-foreground"
              }`}>
                <Package className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-bold">Biblioteca de Produtos</h2>
                <p className="text-[10px] text-muted-foreground">
                  5 rótulos + 5 embalagens · {availableItems} disponíveis · {inDevelopmentItems} em desenvolvimento
                </p>
              </div>
            </div>
            <ChevronDown 
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                activeSection === "produtos" ? "rotate-180" : ""
              }`}
            />
          </button>
          
          {activeSection === "produtos" && (
            <div className="p-3 border-t bg-muted/30 animate-in slide-in-from-top-2 duration-200">
              <InfoNote title="Dica" className="mb-3 text-xs">
                Rótulos especializados para diferentes produtos. Exportação em alta resolução.
              </InfoNote>
              <CriarMaterialSimple 
                categoryFilter="produtos" 
                onLabelSelect={handleLabelSelect}
                onPackagingSelect={handlePackagingSelect}
                onAddToPedido={handleAddToPedido}
              />
            </div>
          )}
        </div>

        {/* Acordeão 2: Gerador de Embalagens */}
        <div className="border rounded-lg overflow-hidden bg-card">
          <button
            onClick={() => toggleSection("gerador")}
            className="w-full flex items-center justify-between p-2.5 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded transition-colors ${
                activeSection === "gerador" 
                  ? "bg-primary/10 text-primary" 
                  : "bg-muted text-muted-foreground"
              }`}>
                <Box className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-bold">Gerador de Embalagens</h2>
                <p className="text-[10px] text-muted-foreground">
                  Editor e exportação em alta resolução para impressão
                </p>
              </div>
            </div>
            <ChevronDown 
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                activeSection === "gerador" ? "rotate-180" : ""
              }`}
            />
          </button>
          
          {activeSection === "gerador" && (
            <div className="p-3 border-t bg-muted/30 animate-in slide-in-from-top-2 duration-200">
              <PackagingGenerator 
                selectedLabel={selectedLabel}
                selectedPackaging={selectedPackaging}
                onClearLabel={() => setSelectedLabel(null)}
                onClearPackaging={() => setSelectedPackaging(null)}
                onAddToPedido={handleAddToPedido}
                selectedLabelIds={orderItems.map(item => item.id)}
              />
            </div>
          )}
        </div>

        {/* Acordeão 3: Gerador de Pedidos */}
        <div className="border rounded-lg overflow-hidden bg-card">
          <button
            onClick={() => toggleSection("pedido")}
            className="w-full flex items-center justify-between p-2.5 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded transition-colors ${
                activeSection === "pedido" 
                  ? "bg-primary/10 text-primary" 
                  : "bg-muted text-muted-foreground"
              }`}>
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-bold">Gerador de Pedidos</h2>
                <p className="text-[10px] text-muted-foreground">
                  Crie e exporte pedidos de produção
                </p>
              </div>
            </div>
            <ChevronDown 
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                activeSection === "pedido" ? "rotate-180" : ""
              }`}
            />
          </button>
          
          {activeSection === "pedido" && (
            <div className="p-3 border-t bg-muted/30 animate-in slide-in-from-top-2 duration-200">
              <OrderGenerator orderItems={orderItems} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}