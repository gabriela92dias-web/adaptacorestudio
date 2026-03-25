# ADAPTA CORE STUDIO - CONTEXTS & PROVIDERS

## 📦 Build: v0.0.12-PHASE-3

---

## 🎯 ARCHITECTURE OVERVIEW

A ADAPTA CORE STUDIO utiliza um sistema hierárquico de Contexts/Providers para orquestrar os três módulos principais (BRAND, MARKETING, TOOLS) enquanto mantém-os intactos.

### **Hierarquia de Providers (App.tsx):**

```tsx
<ThemeProvider>
  <LanguageProvider>
    <ModulesProvider>
      <BrandProvider>
        <CampaignsProvider>
          <RouterProvider />
        </CampaignsProvider>
      </BrandProvider>
    </ModulesProvider>
  </LanguageProvider>
</ThemeProvider>
```

---

## 📂 AVAILABLE CONTEXTS

### 1️⃣ **LanguageProvider** (`language-context.tsx`)

**Responsabilidade:** Gerencia idioma da aplicação (PT/EN)

**Hook:** `useLanguage()`

**Estado:**
```typescript
{
  language: 'pt' | 'en';
  setLanguage: (lang: 'pt' | 'en') => void;
}
```

**Uso:**
```tsx
const { language, setLanguage } = useLanguage();
setLanguage('en');
```

---

### 2️⃣ **ModulesProvider** (`modules-context.tsx`)

**Responsabilidade:** Orquestra os 3 módulos (BRAND, MARKETING, TOOLS)

**Hook:** `useModules()`

**Estado:**
```typescript
{
  modules: Record<ModuleType, ModuleConfig>;
  activeModule: ModuleType | null;
  isLoading: boolean;
  error: string | null;
}
```

**Métodos:**
- `setActiveModule(moduleId)` - Ativa um módulo
- `toggleModule(moduleId)` - Liga/desliga módulo
- `updateModuleStatus(moduleId, status)` - Atualiza status
- `syncModule(moduleId)` - Sincroniza módulo (async)
- `hasPermission(moduleId, permission)` - Verifica permissão

**Uso:**
```tsx
const { state, setActiveModule, hasPermission } = useModules();

// Ativar módulo BRAND
setActiveModule('brand');

// Verificar permissão
if (hasPermission('brand', 'edit')) {
  // Usuário pode editar
}

// Sincronizar módulo
await syncModule('marketing');
```

---

### 3️⃣ **BrandProvider** (`brand-context.tsx`)

**Responsabilidade:** Gerencia identidades visuais, cores, tipografia e assets

**Hook:** `useBrand()`

**Estado:**
```typescript
{
  brands: Brand[];
  currentBrand: Brand | null;
  isLoading: boolean;
  error: string | null;
}
```

**Tipos principais:**
```typescript
interface Brand {
  id: string;
  name: string;
  colors: BrandColor[];
  typography: BrandTypography[];
  assets: BrandAsset[];
  status: 'active' | 'archived' | 'draft';
}
```

**Métodos:**
- `setCurrentBrand(brandId)` - Define marca ativa
- `createBrand(brand)` - Cria nova marca
- `updateBrand(brandId, updates)` - Atualiza marca
- `deleteBrand(brandId)` - Remove marca
- `addColor(brandId, color)` - Adiciona cor
- `addAsset(brandId, asset)` - Adiciona asset

**Uso:**
```tsx
const { state, createBrand, addColor } = useBrand();

// Criar nova marca
createBrand({
  name: 'Nova Marca',
  slug: 'nova-marca',
  description: 'Descrição',
  colors: [],
  typography: [],
  assets: [],
  status: 'draft',
});

// Adicionar cor
addColor('brand-id', {
  name: 'Primary Blue',
  hex: '#0066FF',
  rgb: 'rgb(0, 102, 255)',
  usage: 'primary',
});
```

---

### 4️⃣ **CampaignsProvider** (`campaigns-context.tsx`)

**Responsabilidade:** Gerencia campanhas de marketing e templates

**Hook:** `useCampaigns()`

**Estado:**
```typescript
{
  campaigns: Campaign[];
  templates: CampaignTemplate[];
  currentCampaign: Campaign | null;
  filters: { status?, channel?, brandId? };
  isLoading: boolean;
  error: string | null;
}
```

**Tipos principais:**
```typescript
interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  channel: CampaignChannel;
  brandId: string;
  metrics: CampaignMetrics;
  startDate: string;
  endDate?: string;
}

type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
type CampaignChannel = 'email' | 'social' | 'web' | 'paid' | 'multi';
```

**Métodos:**
- `setCurrentCampaign(campaignId)` - Define campanha ativa
- `createCampaign(campaign)` - Cria nova campanha
- `updateCampaign(campaignId, updates)` - Atualiza campanha
- `deleteCampaign(campaignId)` - Remove campanha
- `updateCampaignStatus(campaignId, status)` - Atualiza status
- `setFilters(filters)` - Define filtros
- `getFilteredCampaigns()` - Retorna campanhas filtradas
- `createTemplate(template)` - Cria template

**Uso:**
```tsx
const { state, createCampaign, setFilters, getFilteredCampaigns } = useCampaigns();

// Criar campanha
createCampaign({
  name: 'Black Friday 2026',
  description: 'Campanha de BF',
  status: 'draft',
  channel: 'multi',
  brandId: 'adapta-main',
  startDate: '2026-11-25T00:00:00.000Z',
  tags: ['blackfriday', 'promo'],
});

// Filtrar campanhas ativas
setFilters({ status: 'active' });
const activeCampaigns = getFilteredCampaigns();
```

---

## 🔄 DATA FLOW

### **Exemplo: Criar campanha usando marca atual**

```tsx
function CreateCampaignButton() {
  const { state: brandState } = useBrand();
  const { createCampaign } = useCampaigns();
  const { hasPermission } = useModules();

  const handleCreate = () => {
    if (!hasPermission('marketing', 'create')) {
      alert('Sem permissão');
      return;
    }

    if (!brandState.currentBrand) {
      alert('Selecione uma marca');
      return;
    }

    createCampaign({
      name: 'Nova Campanha',
      description: `Campanha para ${brandState.currentBrand.name}`,
      status: 'draft',
      channel: 'email',
      brandId: brandState.currentBrand.id,
      startDate: new Date().toISOString(),
      tags: [],
    });
  };

  return <button onClick={handleCreate}>Criar Campanha</button>;
}
```

---

## 🧪 MOCK DATA

Todos os providers incluem **mock data** para desenvolvimento:

### **ModulesProvider:**
- 3 módulos (brand, marketing, tools) todos ativos
- Permissões padrão configuradas

### **BrandProvider:**
- 1 marca: "ADAPTA Core"
- Cores: Teal Primary (#00D9A3), Deep Teal (#141A17)
- Tipografia: Inter
- 1 asset: Logo ADAPTA

### **CampaignsProvider:**
- 2 campanhas: "Lançamento ADAPTA 2026", "Email Marketing - Q1"
- 2 templates: "Product Launch Email", "Social Media Post"
- Métricas simuladas

---

## 🚀 NEXT STEPS

### **Phase 4 (sugestões):**
- Persistência com localStorage/Supabase
- Sincronização real entre módulos
- Autenticação + permissões granulares
- Histórico de alterações (undo/redo)
- WebSockets para colaboração em tempo real

---

## 📝 NOTAS

- ✅ Todos os providers são **type-safe** (TypeScript)
- ✅ Hooks incluem **error boundaries** (throw se usado fora do provider)
- ✅ Estado inicial inclui **mock data** para desenvolvimento
- ✅ Métodos assíncronos retornam **Promises**
- ✅ Atualizações de estado são **imutáveis** (spread operators)

---

**Documentação gerada em:** 2026-03-14  
**Build:** v0.0.12-PHASE-3
