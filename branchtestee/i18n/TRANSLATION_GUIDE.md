# 🌐 GUIA DE TRADUÇÃO - ADAPTA CORE STUDIO

## Como Usar o Sistema de Tradução

### 1. Import do Hook

```typescript
import { useTranslations } from '@/i18n/use-translations';
```

### 2. Dentro do Componente

```typescript
export function MeuComponente() {
  // Pegar grupos inteiros (mais eficiente)
  const { tGroup } = useTranslations();
  const actions = tGroup('actions');
  const forms = tGroup('forms');
  const messages = tGroup('messages');
  
  return (
    <div>
      <button>{actions.create}</button>  {/* "Criar" / "Create" */}
      <button>{actions.save}</button>    {/* "Salvar" / "Save" */}
      <input placeholder={forms.searchPlaceholder} />
    </div>
  );
}
```

### 3. Grupos Disponíveis

- `actions` - Botões e ações (create, edit, delete, save, cancel, etc.)
- `forms` - Formulários e campos (name, title, description, placeholders, etc.)
- `messages` - Mensagens de sucesso/erro
- `status` - Status e badges (active, pending, completed, etc.)
- `navigation` - Navegação e sidebar
- `global` - Textos globais
- `dashboard` - Dashboard específico
- `brand` - Módulo Brand
- `marketing` - Módulo Marketing
- `tools` - Módulo Tools
- `time` - Datas e tempo
- `errors` - Páginas de erro

### 4. Exemplos Práticos

#### Botões de Ação

```typescript
const actions = tGroup('actions');

<Button>{actions.create}</Button>
<Button>{actions.edit}</Button>
<Button>{actions.delete}</Button>
<Button>{actions.save}</Button>
<Button>{actions.cancel}</Button>
<Button>{actions.export}</Button>
<Button>{actions.download}</Button>
```

#### Formulários

```typescript
const forms = tGroup('forms');

<Input placeholder={forms.searchPlaceholder} />
<Input placeholder={forms.enterCampaignName} />
<Label>{forms.name}</Label>
<Label>{forms.description}</Label>
<Label>{forms.startDate}</Label>
<Label>{forms.endDate}</Label>
```

#### Toasts/Mensagens

```typescript
const messages = tGroup('messages');
const tools = tGroup('tools');

toast.success(messages.saveSuccess);
toast.error(messages.saveFailed);
toast.success(tools.svgExported);
```

#### Status e Badges

```typescript
const status = tGroup('status');

<Badge>{status.active}</Badge>
<Badge>{status.pending}</Badge>
<Badge>{status.completed}</Badge>
```

## 📝 Padrão de Uso

### ❌ NÃO FAZER (texto hardcoded):
```typescript
<Button>Criar Campanha</Button>
<Input placeholder="Buscar produtos..." />
<h1>Campanhas Ativas</h1>
```

### ✅ FAZER (usar traduções):
```typescript
const marketing = tGroup('marketing');
const actions = tGroup('actions');
const forms = tGroup('forms');

<Button>{actions.create} {marketing.campaignsTitle}</Button>
<Input placeholder={forms.searchProductsPlaceholder} />
<h1>{marketing.activeCampaignsTitle}</h1>
```

## 🎯 Componentes Prioritários para Traduzir

1. **Botões** - Sempre use `actions.create`, `actions.edit`, etc.
2. **Placeholders** - Use `forms.searchPlaceholder`, `forms.enterCampaignName`, etc.
3. **Títulos de Páginas** - Use `marketing.title`, `tools.title`, etc.
4. **Mensagens de Toast** - Use `messages.saveSuccess`, `tools.svgExported`, etc.
5. **Labels de Formulário** - Use `forms.name`, `forms.description`, etc.

## 🔄 Exemplo Completo de Migração

### ANTES (hardcoded):
```typescript
export function CampaignCreate() {
  return (
    <div>
      <h1>Criar Campanha</h1>
      <Input placeholder="Digite o nome da campanha" />
      <Input placeholder="Digite o objetivo" />
      <Button>Salvar Rascunho</Button>
      <Button>Criar Campanha</Button>
    </div>
  );
}
```

### DEPOIS (traduzido):
```typescript
import { useTranslations } from '@/i18n/use-translations';

export function CampaignCreate() {
  const { tGroup } = useTranslations();
  const marketing = tGroup('marketing');
  const actions = tGroup('actions');
  const forms = tGroup('forms');
  
  return (
    <div>
      <h1>{marketing.createCampaign}</h1>
      <Input placeholder={forms.enterCampaignName} />
      <Input placeholder={forms.enterObjective} />
      <Button>{actions.save} Rascunho</Button>
      <Button>{marketing.createCampaign}</Button>
    </div>
  );
}
```

## 🚀 Performance

- Use `tGroup()` no início do componente para pegar grupos inteiros
- Evite usar `t('group.key')` em loops - prefira pegar o grupo antes
- O sistema já está otimizado e não causa re-renders desnecessários
