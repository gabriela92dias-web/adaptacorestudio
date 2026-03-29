import React, { useState, useRef, useEffect } from "react";
import { FileText, Plus, Trash2, Download } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface PrintItem {
  id: string;
  productType: string;
  productName: string;
  quantity: number;
  material: string;
  finishing: string;
  dimensions: string;
  colors: string;
  fileFormat: string;
  notes: string;
}

interface SupplierData {
  name: string;
  contact: string;
  phone: string;
  email: string;
}

interface ClientData {
  companyName: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  responsiblePerson: string;
}

interface DeliveryData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactPerson: string;
  contactPhone: string;
  deliveryInstructions: string;
}

interface OrderData {
  orderNumber: string;
  orderDate: string;
  deliveryDate: string;
  budgetNumber: string;
  paymentTerms: string;
  client: ClientData;
  supplier: SupplierData;
  delivery: DeliveryData;
  items: PrintItem[];
  generalNotes: string;
  proofRequired: boolean;
  urgentOrder: boolean;
  technicalNotes: string;
}

const PRODUCT_TYPES = [
  "Rótulo Flores",
  "Rótulo Óleo", 
  "Rótulo Gummie",
  "Miniatura Óleo",
  "Rótulo Hash",
  "Caixa",
  "Sacola",
  "Etiqueta",
  "Selo Circular",
  "Tag/Pendente"
];

const MATERIALS = [
  "Papel Couché 170g",
  "Papel Couché 230g",
  "Papel Couché 300g",
  "Adesivo Vinil",
  "Adesivo BOPP",
  "Papel Kraft 200g",
  "Papel Offset 120g",
  "Papel Supremo 250g",
  "Cartão Triplex 300g"
];

const FINISHINGS = [
  "Sem acabamento",
  "Laminação fosca",
  "Laminação brilho",
  "Verniz UV total",
  "Verniz UV localizado",
  "Corte especial",
  "Hot stamping",
  "Relevo seco"
];

interface OrderGeneratorProps {
  orderItems?: Array<{
    id: string;
    type: string;
    name: string;
    category: string;
  }>;
}

export function OrderGenerator({ orderItems = [] }: OrderGeneratorProps) {
  const [data, setData] = useState<OrderData>({
    orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: "",
    budgetNumber: "",
    paymentTerms: "30 dias após entrega",
    client: {
      companyName: "ADAPTA CORE STUDIO",
      cnpj: "00.000.000/0001-00",
      address: "Rua Exemplo, 123 - Centro",
      phone: "(11) 9999-9999",
      email: "contato@adapta.studio",
      responsiblePerson: "Responsável Técnico"
    },
    supplier: {
      name: "",
      contact: "",
      phone: "",
      email: ""
    },
    delivery: {
      address: "Rua Exemplo, 123 - Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "00000-000",
      contactPerson: "Recepção",
      contactPhone: "(11) 9999-9999",
      deliveryInstructions: ""
    },
    items: [],
    generalNotes: "",
    proofRequired: true,
    urgentOrder: false,
    technicalNotes: ""
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const addItem = () => {
    const newItem: PrintItem = {
      id: Date.now().toString(),
      productType: "",
      productName: "",
      quantity: 1000,
      material: "",
      finishing: "",
      dimensions: "",
      colors: "CMYK 4x0",
      fileFormat: "PDF",
      notes: ""
    };
    setData({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (id: string) => {
    setData({ ...data, items: data.items.filter(item => item.id !== id) });
  };

  const updateItem = (id: string, field: keyof PrintItem, value: string | number) => {
    setData({
      ...data,
      items: data.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const updateSupplier = (field: keyof SupplierData, value: string) => {
    setData({
      ...data,
      supplier: { ...data.supplier, [field]: value }
    });
  };

  const updateClient = (field: keyof ClientData, value: string) => {
    setData({
      ...data,
      client: { ...data.client, [field]: value }
    });
  };

  const updateDelivery = (field: keyof DeliveryData, value: string) => {
    setData({
      ...data,
      delivery: { ...data.delivery, [field]: value }
    });
  };

  const exportToPDF = () => {
    alert("Exportação de PDF será implementada em breve");
  };

  // ✅ Sincronizar itens do pedido com os itens do formulário
  useEffect(() => {
    if (orderItems.length > 0) {
      console.log("[OrderGenerator] Sincronizando orderItems:", orderItems);
      
      // Adicionar novos itens que não existem no formulário
      const newItems: PrintItem[] = orderItems
        .filter(orderItem => !data.items.some(item => item.id === orderItem.id))
        .map(orderItem => ({
          id: orderItem.id,
          productType: orderItem.type,
          productName: orderItem.name,
          quantity: 1000,
          material: "Adesivo BOPP",
          finishing: "Laminação fosca",
          dimensions: "10x15cm",
          colors: "CMYK 4x0",
          fileFormat: "PDF",
          notes: `Categoria: ${orderItem.category}`
        }));

      if (newItems.length > 0) {
        setData(prev => ({
          ...prev,
          items: [...prev.items, ...newItems]
        }));
      }

      // Remover itens que foram removidos dos orderItems
      const updatedItems = data.items.filter(item => 
        orderItems.some(orderItem => orderItem.id === item.id)
      );

      if (updatedItems.length !== data.items.length) {
        setData(prev => ({
          ...prev,
          items: updatedItems
        }));
      }
    } else if (data.items.length > 0) {
      // Se não houver orderItems mas houver itens, limpar somente os que vieram dos rótulos
      // (manter os adicionados manualmente)
    }
  }, [orderItems]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-3">
      {/* Formulário */}
      <div className="border rounded p-3 bg-card space-y-3 h-fit max-h-[700px] overflow-y-auto">
        <div className="flex items-center gap-2 pb-2 border-b">
          <FileText className="w-4 h-4 text-primary" />
          <div>
            <h3 className="font-semibold text-sm">Ordem de Compra/Serviço</h3>
            <p className="text-[10px] text-muted-foreground">Especificações para fornecedor</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="orderNumber" className="text-[11px]">Nº Pedido</Label>
              <Input
                id="orderNumber"
                value={data.orderNumber}
                onChange={(e) => setData({ ...data, orderNumber: e.target.value })}
                className="h-8 text-xs"
              />
            </div>

            <div>
              <Label htmlFor="orderDate" className="text-[11px]">Data (auto)</Label>
              <Input
                id="orderDate"
                type="date"
                value={data.orderDate}
                disabled
                className="h-8 text-xs bg-muted"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="deliveryDate" className="text-[11px]">Prazo de Entrega</Label>
            <Input
              id="deliveryDate"
              type="date"
              value={data.deliveryDate}
              onChange={(e) => setData({ ...data, deliveryDate: e.target.value })}
              className="h-8 text-xs"
            />
          </div>

          <div>
            <Label htmlFor="budgetNumber" className="text-[11px]">Nº Orçamento</Label>
            <Input
              id="budgetNumber"
              value={data.budgetNumber}
              onChange={(e) => setData({ ...data, budgetNumber: e.target.value })}
              className="h-8 text-xs"
            />
          </div>

          <div>
            <Label htmlFor="paymentTerms" className="text-[11px]">Condições de Pagamento</Label>
            <Input
              id="paymentTerms"
              value={data.paymentTerms}
              onChange={(e) => setData({ ...data, paymentTerms: e.target.value })}
              className="h-8 text-xs"
            />
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <Label className="text-[11px] font-semibold">Fornecedor</Label>

          <div>
            <Label htmlFor="supplierName" className="text-[10px]">Nome</Label>
            <Input
              id="supplierName"
              value={data.supplier.name}
              onChange={(e) => updateSupplier("name", e.target.value)}
              placeholder="Gráfica XYZ"
              className="h-7 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="supplierContact" className="text-[10px]">Contato</Label>
              <Input
                id="supplierContact"
                value={data.supplier.contact}
                onChange={(e) => updateSupplier("contact", e.target.value)}
                placeholder="Nome"
                className="h-7 text-xs"
              />
            </div>

            <div>
              <Label htmlFor="supplierPhone" className="text-[10px]">Telefone</Label>
              <Input
                id="supplierPhone"
                value={data.supplier.phone}
                onChange={(e) => updateSupplier("phone", e.target.value)}
                placeholder="(00) 0000-0000"
                className="h-7 text-xs"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="supplierEmail" className="text-[10px]">E-mail</Label>
            <Input
              id="supplierEmail"
              type="email"
              value={data.supplier.email}
              onChange={(e) => updateSupplier("email", e.target.value)}
              placeholder="contato@grafica.com"
              className="h-7 text-xs"
            />
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <Label className="text-[11px] font-semibold">Cliente</Label>

          <div>
            <Label htmlFor="clientCompanyName" className="text-[10px]">Empresa</Label>
            <Input
              id="clientCompanyName"
              value={data.client.companyName}
              onChange={(e) => updateClient("companyName", e.target.value)}
              placeholder="Nome da empresa"
              className="h-7 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="clientCnpj" className="text-[10px]">CNPJ</Label>
              <Input
                id="clientCnpj"
                value={data.client.cnpj}
                onChange={(e) => updateClient("cnpj", e.target.value)}
                placeholder="00.000.000/0000-00"
                className="h-7 text-xs"
              />
            </div>

            <div>
              <Label htmlFor="clientPhone" className="text-[10px]">Telefone</Label>
              <Input
                id="clientPhone"
                value={data.client.phone}
                onChange={(e) => updateClient("phone", e.target.value)}
                placeholder="(00) 0000-0000"
                className="h-7 text-xs"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="clientEmail" className="text-[10px]">E-mail</Label>
            <Input
              id="clientEmail"
              type="email"
              value={data.client.email}
              onChange={(e) => updateClient("email", e.target.value)}
              placeholder="contato@empresa.com"
              className="h-7 text-xs"
            />
          </div>

          <div>
            <Label htmlFor="clientAddress" className="text-[10px]">Endereço</Label>
            <Input
              id="clientAddress"
              value={data.client.address}
              onChange={(e) => updateClient("address", e.target.value)}
              placeholder="Rua, nº - Bairro"
              className="h-7 text-xs"
            />
          </div>

          <div>
            <Label htmlFor="clientResponsiblePerson" className="text-[10px]">Responsável</Label>
            <Input
              id="clientResponsiblePerson"
              value={data.client.responsiblePerson}
              onChange={(e) => updateClient("responsiblePerson", e.target.value)}
              placeholder="Nome"
              className="h-7 text-xs"
            />
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <Label className="text-[11px] font-semibold">Entrega</Label>

          <div>
            <Label htmlFor="deliveryAddress" className="text-[10px]">Endereço</Label>
            <Input
              id="deliveryAddress"
              value={data.delivery.address}
              onChange={(e) => updateDelivery("address", e.target.value)}
              placeholder="Rua, nº - Bairro"
              className="h-7 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="deliveryCity" className="text-[10px]">Cidade</Label>
              <Input
                id="deliveryCity"
                value={data.delivery.city}
                onChange={(e) => updateDelivery("city", e.target.value)}
                placeholder="Cidade"
                className="h-7 text-xs"
              />
            </div>

            <div>
              <Label htmlFor="deliveryState" className="text-[10px]">UF</Label>
              <Input
                id="deliveryState"
                value={data.delivery.state}
                onChange={(e) => updateDelivery("state", e.target.value)}
                placeholder="SP"
                className="h-7 text-xs"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="deliveryZipCode" className="text-[10px]">CEP</Label>
            <Input
              id="deliveryZipCode"
              value={data.delivery.zipCode}
              onChange={(e) => updateDelivery("zipCode", e.target.value)}
              placeholder="00000-000"
              className="h-7 text-xs"
            />
          </div>

          <div>
            <Label htmlFor="deliveryContactPerson" className="text-[10px]">Contato</Label>
            <Input
              id="deliveryContactPerson"
              value={data.delivery.contactPerson}
              onChange={(e) => updateDelivery("contactPerson", e.target.value)}
              placeholder="Nome"
              className="h-7 text-xs"
            />
          </div>

          <div>
            <Label htmlFor="deliveryContactPhone" className="text-[10px]">Telefone</Label>
            <Input
              id="deliveryContactPhone"
              value={data.delivery.contactPhone}
              onChange={(e) => updateDelivery("contactPhone", e.target.value)}
              placeholder="(00) 0000-0000"
              className="h-7 text-xs"
            />
          </div>

          <div>
            <Label htmlFor="deliveryInstructions" className="text-[10px]">Instruções</Label>
            <Textarea
              id="deliveryInstructions"
              value={data.delivery.deliveryInstructions}
              onChange={(e) => updateDelivery("deliveryInstructions", e.target.value)}
              placeholder="Instruções especiais"
              rows={2}
              className="text-xs resize-none"
            />
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] font-semibold">Itens</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={addItem}
              className="h-6 text-[10px] gap-1"
            >
              <Plus className="w-3 h-3" />
              Item
            </Button>
          </div>

          <div className="space-y-2">
            {data.items.map((item, index) => (
              <div key={item.id} className="border rounded p-2.5 bg-muted/30 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-primary">Item {index + 1}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeItem(item.id)}
                    className="h-5 w-5 p-0"
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>

                <div>
                  <Label className="text-[10px]">Tipo</Label>
                  <Select
                    value={item.productType}
                    onValueChange={(value) => updateItem(item.id, "productType", value)}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_TYPES.map((type) => (
                        <SelectItem key={type} value={type} className="text-xs">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-[10px]">Descrição</Label>
                  <Input
                    value={item.productName}
                    onChange={(e) => updateItem(item.id, "productName", e.target.value)}
                    placeholder="Nome do produto"
                    className="h-7 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px]">Qtd</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                      placeholder="1000"
                      className="h-7 text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-[10px]">Cores</Label>
                    <Input
                      value={item.colors}
                      onChange={(e) => updateItem(item.id, "colors", e.target.value)}
                      placeholder="CMYK 4x0"
                      className="h-7 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-[10px]">Material</Label>
                  <Select
                    value={item.material}
                    onValueChange={(value) => updateItem(item.id, "material", value)}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {MATERIALS.map((material) => (
                        <SelectItem key={material} value={material} className="text-xs">
                          {material}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-[10px]">Acabamento</Label>
                  <Select
                    value={item.finishing}
                    onValueChange={(value) => updateItem(item.id, "finishing", value)}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {FINISHINGS.map((finishing) => (
                        <SelectItem key={finishing} value={finishing} className="text-xs">
                          {finishing}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-[10px]">Dimensões</Label>
                  <Input
                    value={item.dimensions}
                    onChange={(e) => updateItem(item.id, "dimensions", e.target.value)}
                    placeholder="10x15cm"
                    className="h-7 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-[10px]">Formato</Label>
                  <Select
                    value={item.fileFormat}
                    onValueChange={(value) => updateItem(item.id, "fileFormat", value)}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF" className="text-xs">PDF</SelectItem>
                      <SelectItem value="AI" className="text-xs">AI</SelectItem>
                      <SelectItem value="INDD" className="text-xs">INDD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-[10px]">Obs</Label>
                  <Textarea
                    value={item.notes}
                    onChange={(e) => updateItem(item.id, "notes", e.target.value)}
                    placeholder="Observações"
                    rows={2}
                    className="text-xs resize-none"
                  />
                </div>
              </div>
            ))}

            {data.items.length === 0 && (
              <div className="text-center py-6 text-xs text-muted-foreground border-2 border-dashed rounded">
                Nenhum item adicionado
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 border-t">
          <Label htmlFor="generalNotes" className="text-[11px]">Observações</Label>
          <Textarea
            id="generalNotes"
            value={data.generalNotes}
            onChange={(e) => setData({ ...data, generalNotes: e.target.value })}
            placeholder="Informações adicionais"
            rows={3}
            className="text-xs resize-none"
          />
        </div>
      </div>

      {/* Preview Técnico */}
      <div className="space-y-2">
        <div className="bg-white border border-gray-300 min-h-[700px] relative overflow-hidden" ref={previewRef} style={{ fontFamily: 'monospace', fontSize: '11px' }}>
          
          {/* Barra Vertical Direita - Número do Pedido (inicia na linha entre checklist e assinaturas) */}
          <div className="absolute right-0 bottom-0 w-5 bg-gray-100 flex items-end justify-center pb-12" style={{ height: '240px' }}>
            <div className="transform -rotate-90 whitespace-nowrap text-gray-700 font-bold text-[8px]" style={{ letterSpacing: '1.2em', transformOrigin: 'center' }}>
              {data.orderNumber} · {new Date(data.orderDate).toLocaleDateString('pt-BR')}
            </div>
          </div>

          {/* Conteúdo Principal com Margem para Barra Direita */}
          <div className="mr-5 p-6">
          
          {/* Cabeçalho Compacto */}
          <div className="flex items-start justify-between mb-3 pb-2 border-b border-gray-900">
            <div>
              <div className="text-xl font-bold tracking-wider" style={{ color: '#10b981' }}>ADAPTA</div>
              <div className="text-[8px] text-gray-500 uppercase tracking-widest">Core Studio</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900 tracking-wide">ORDEM DE COMPRA/SERVIÇO</div>
            </div>
          </div>

          {/* Grid Compacto */}
          <div className="grid grid-cols-4 gap-0 mb-3 border border-gray-300 text-[10px]">
            <div className="border-r border-gray-300 p-1.5">
              <div className="text-gray-500 uppercase text-[8px]">Pedido</div>
              <div className="font-bold text-gray-900">{data.orderNumber}</div>
            </div>
            <div className="border-r border-gray-300 p-1.5">
              <div className="text-gray-500 uppercase text-[8px]">Emissão</div>
              <div className="text-gray-900">{new Date(data.orderDate).toLocaleDateString('pt-BR')}</div>
            </div>
            <div className="border-r border-gray-300 p-1.5">
              <div className="text-gray-500 uppercase text-[8px]">Entrega</div>
              <div className="font-bold text-gray-900">
                {data.deliveryDate ? new Date(data.deliveryDate).toLocaleDateString('pt-BR') : 'A definir'}
              </div>
            </div>
            <div className="p-1.5">
              <div className="text-gray-500 uppercase text-[8px]">Orçamento</div>
              <div className="text-gray-900">{data.budgetNumber || '-'}</div>
            </div>
          </div>

          {data.paymentTerms && (
            <div className="border-l-2 border-gray-900 pl-2 py-1 mb-3 text-[10px]">
              <span className="font-bold text-gray-900 uppercase text-[8px]">Pagamento: </span>
              <span className="text-gray-700">{data.paymentTerms}</span>
            </div>
          )}

          {/* Partes - Layout Compacto */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="border border-gray-300 p-2">
              <div className="text-[8px] font-bold text-gray-900 uppercase mb-1.5 pb-1 border-b border-gray-300">Cliente</div>
              <div className="space-y-1 text-[9px]">
                <div><span className="text-gray-500 uppercase text-[7px]">Empresa:</span> <span className="font-bold">{data.client.companyName || '-'}</span></div>
                <div><span className="text-gray-500 uppercase text-[7px]">CNPJ:</span> {data.client.cnpj || '-'}</div>
                <div><span className="text-gray-500 uppercase text-[7px]">Tel:</span> {data.client.phone || '-'}</div>
                <div><span className="text-gray-500 uppercase text-[7px]">Email:</span> {data.client.email || '-'}</div>
                <div><span className="text-gray-500 uppercase text-[7px]">End:</span> {data.client.address || '-'}</div>
                <div><span className="text-gray-500 uppercase text-[7px]">Resp:</span> {data.client.responsiblePerson || '-'}</div>
              </div>
            </div>

            <div className="border border-gray-300 p-2">
              <div className="text-[8px] font-bold text-gray-900 uppercase mb-1.5 pb-1 border-b border-gray-300">Fornecedor</div>
              <div className="space-y-1 text-[9px]">
                <div><span className="text-gray-500 uppercase text-[7px]">Empresa:</span> <span className="font-bold">{data.supplier.name || '-'}</span></div>
                <div><span className="text-gray-500 uppercase text-[7px]">Contato:</span> {data.supplier.contact || '-'}</div>
                <div><span className="text-gray-500 uppercase text-[7px]">Tel:</span> {data.supplier.phone || '-'}</div>
                <div><span className="text-gray-500 uppercase text-[7px]">Email:</span> {data.supplier.email || '-'}</div>
              </div>
            </div>
          </div>

          {/* Entrega */}
          {(data.delivery.address || data.delivery.city) && (
            <div className="border border-gray-300 p-2 mb-3">
              <div className="text-[8px] font-bold text-gray-900 uppercase mb-1.5 pb-1 border-b border-gray-300">Entrega</div>
              <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[9px]">
                <div className="col-span-2"><span className="text-gray-500 uppercase text-[7px]">End:</span> {data.delivery.address || '-'}</div>
                <div><span className="text-gray-500 uppercase text-[7px]">CEP:</span> {data.delivery.zipCode || '-'}</div>
                <div><span className="text-gray-500 uppercase text-[7px]">Cidade:</span> {data.delivery.city || '-'}</div>
                <div><span className="text-gray-500 uppercase text-[7px]">UF:</span> {data.delivery.state || '-'}</div>
                <div><span className="text-gray-500 uppercase text-[7px]">Contato:</span> {data.delivery.contactPerson || '-'} · {data.delivery.contactPhone || '-'}</div>
              </div>
              {data.delivery.deliveryInstructions && (
                <div className="mt-1.5 pt-1.5 border-t border-gray-200 text-[9px] italic text-gray-600">
                  {data.delivery.deliveryInstructions}
                </div>
              )}
            </div>
          )}

          {/* Tabela de Itens - Super Compacta */}
          <div className="mb-3">
            <div className="bg-gray-900 text-white px-2 py-1 text-[9px] font-bold uppercase">Especificações</div>
            
            {data.items.length > 0 ? (
              <table className="w-full border border-gray-900 border-t-0 text-[9px]">
                <thead>
                  <tr className="bg-gray-200 border-b border-gray-400">
                    <th className="text-left p-1 text-[8px] font-bold uppercase border-r border-gray-300">#</th>
                    <th className="text-left p-1 text-[8px] font-bold uppercase border-r border-gray-300">Produto</th>
                    <th className="text-left p-1 text-[8px] font-bold uppercase border-r border-gray-300">Material</th>
                    <th className="text-left p-1 text-[8px] font-bold uppercase border-r border-gray-300">Acabamento</th>
                    <th className="text-center p-1 text-[8px] font-bold uppercase border-r border-gray-300">Qtd</th>
                    <th className="text-center p-1 text-[8px] font-bold uppercase border-r border-gray-300">Cor</th>
                    <th className="text-left p-1 text-[8px] font-bold uppercase">Dim</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <tr className="border-b border-gray-200">
                        <td className="p-1 font-bold border-r border-gray-200">{index + 1}</td>
                        <td className="p-1 border-r border-gray-200">
                          <div className="font-bold">{item.productType || "-"}</div>
                          {item.productName && <div className="text-[8px] text-gray-600">{item.productName}</div>}
                        </td>
                        <td className="p-1 border-r border-gray-200 text-[8px]">{item.material || '-'}</td>
                        <td className="p-1 border-r border-gray-200 text-[8px]">{item.finishing || '-'}</td>
                        <td className="p-1 text-center font-bold border-r border-gray-200">{item.quantity.toLocaleString('pt-BR')}</td>
                        <td className="p-1 text-center text-[8px] border-r border-gray-200">{item.colors || '-'}</td>
                        <td className="p-1 text-[8px]">{item.dimensions || '-'}</td>
                      </tr>
                      {item.notes && (
                        <tr className="bg-gray-100 border-b border-gray-200">
                          <td colSpan={7} className="p-1 text-[8px]">
                            <span className="font-bold">Obs:</span> {item.notes}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-900 text-white">
                    <td colSpan={7} className="p-1.5 text-[9px] font-bold">
                      Total: {data.items.length} itens · {data.items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString('pt-BR')} un
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <div className="border border-gray-900 border-t-0 p-4 text-center text-[9px] text-gray-400">
                Nenhum item
              </div>
            )}
          </div>

          {/* Observações */}
          {data.generalNotes && (
            <div className="border-l-2 border-gray-900 pl-2 py-1.5 mb-3 text-[9px]">
              <div className="font-bold text-gray-900 uppercase text-[8px] mb-0.5">Observações</div>
              <div className="text-gray-700 whitespace-pre-wrap">{data.generalNotes}</div>
            </div>
          )}

          {/* Checklist */}
          <div className="border border-gray-300 p-2 mb-3">
            <div className="text-[8px] font-bold text-gray-900 uppercase mb-1.5">Checklist</div>
            <div className="grid grid-cols-2 gap-1 text-[9px]">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border border-gray-400"></div>
                <span>Arquivos conferidos</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border border-gray-400"></div>
                <span>Prova aprovada</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border border-gray-400"></div>
                <span>Material confirmado</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border border-gray-400"></div>
                <span>Prazo acordado</span>
              </div>
            </div>
          </div>

          {/* Assinaturas */}
          <div className="border-t border-gray-900 pt-3 mt-4">
            <div className="grid grid-cols-2 gap-6 text-[9px]">
              <div>
                <div className="font-bold text-gray-900 uppercase text-[8px] mb-1">Solicitante</div>
                <div className="text-gray-700 mb-4">ADAPTA CORE STUDIO</div>
                <div className="border-t border-gray-400 pt-1">
                  <div className="text-[8px] text-gray-500">Assinatura / Data: ___/___/___</div>
                </div>
              </div>
              <div>
                <div className="font-bold text-gray-900 uppercase text-[8px] mb-1">Fornecedor</div>
                <div className="text-gray-700 mb-4">{data.supplier.name || '_______________________'}</div>
                <div className="border-t border-gray-400 pt-1">
                  <div className="text-[8px] text-gray-500">Assinatura / Data: ___/___/___</div>
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="mt-4 pt-2 border-t border-gray-200 text-center text-[7px] text-gray-400">
            ADAPTA CORE STUDIO · Gerado em {new Date().toLocaleDateString('pt-BR')}
          </div>
        </div>
        </div>

        <div className="flex items-center justify-between border rounded p-2 bg-card">
          <div className="text-xs text-muted-foreground">
            Exportar PDF
          </div>
          <Button
            size="sm"
            onClick={exportToPDF}
            className="gap-2 h-7 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </Button>
        </div>
      </div>
    </div>
  );
}