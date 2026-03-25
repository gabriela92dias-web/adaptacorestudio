# 🌍 Sistema de Tradução ADAPTA

Sistema completo de internacionalização (i18n) PT/EN para ADAPTA CORE STUDIO.

## ⚡ Uso Rápido

### Método 1: Hook `useTranslations`

```tsx
import { useTranslations } from '@/i18n';

function MyComponent() {
  const { t } = useTranslations();
  
  return (
    <div>
      <h1>{t('global.welcome')}</h1>
      <button>{t('global.save')}</button>
    </div>
  );
}
```

### Método 2: Hook `useTranslationGroup`

Para componentes que usam muito um grupo específico:

```tsx
import { useTranslationGroup } from '@/i18n';

function Navigation() {
  const nav = useTranslationGroup('navigation');
  
  return (
    <nav>
      <a href="/brand">{nav.brand}</a>
      <a href="/marketing">{nav.marketing}</a>
      <a href="/tools">{nav.tools}</a>
    </nav>
  );
}
```

### Método 3: Tradução inline (compatibilidade)

Para manter compatibilidade com código existente:

```tsx
import { useLanguage } from '@/contexts/language-context';

function Component() {
  const { t } = useLanguage();
  
  return (
    <h1>
      {t('title', { 
        pt: 'Título', 
        en: 'Title' 
      })}
    </h1>
  );
}
```

## 📚 Grupos de Tradução Disponíveis

- **`global`** - Textos comuns (salvar, cancelar, editar, etc.)
- **`navigation`** - Menu e navegação
- **`status`** - Status e badges
- **`dashboard`** - Dashboard central
- **`brand`** - Módulo Brand
- **`marketing`** - Módulo Marketing
- **`tools`** - Módulo Tools
- **`forms`** - Formulários e validação
- **`messages`** - Mensagens e notificações
- **`time`** - Datas e tempo
- **`errors`** - Páginas de erro

## 🎯 Exemplos Práticos

### Navegação Completa

```tsx
import { useTranslationGroup } from '@/i18n';

function Sidebar() {
  const nav = useTranslationGroup('navigation');
  
  return (
    <aside>
      <h2>{nav.navigation}</h2>
      <ul>
        <li><a href="/">{nav.dashboard}</a></li>
        <li><a href="/brand">{nav.brand}</a></li>
        <li><a href="/marketing">{nav.marketing}</a></li>
        <li><a href="/tools">{nav.tools}</a></li>
      </ul>
    </aside>
  );
}
```

### Formulário com Validação

```tsx
import { useTranslations } from '@/i18n';

function CampaignForm() {
  const { t } = useTranslations();
  
  return (
    <form>
      <label>{t('forms.name')}</label>
      <input required />
      <span>{t('forms.required')}</span>
      
      <button type="submit">{t('global.save')}</button>
      <button type="button">{t('global.cancel')}</button>
    </form>
  );
}
```

### Status e Badges

```tsx
import { useTranslationGroup } from '@/i18n';

function CampaignCard({ status }) {
  const statusTexts = useTranslationGroup('status');
  
  return (
    <div>
      <span className="badge">
        {statusTexts[status]}
      </span>
    </div>
  );
}
```

## 🔧 Como Adicionar Novas Traduções

1. Abra `/src/app/i18n/translations.ts`
2. Adicione sua tradução no grupo apropriado:

```typescript
export const translations = {
  // ... outros grupos
  
  myNewGroup: {
    myKey: { pt: 'Meu Texto', en: 'My Text' },
    anotherKey: { pt: 'Outro Texto', en: 'Another Text' },
  },
};
```

3. Use no componente:

```tsx
const { t } = useTranslations();
console.log(t('myNewGroup.myKey')); // 'Meu Texto' (PT) | 'My Text' (EN)
```

## 🎨 Trocar Idioma

O idioma é controlado pelo `LanguageProvider` (já configurado no App.tsx):

```tsx
import { useLanguage } from '@/contexts/language-context';

function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div>
      <button onClick={() => setLanguage('pt')}>PT</button>
      <button onClick={() => setLanguage('en')}>EN</button>
      <p>Idioma atual: {language}</p>
    </div>
  );
}
```

## ⚠️ Regras Importantes

1. **NÃO altere a estrutura de `translations.ts`** - apenas adicione novas chaves
2. **Sempre forneça PT e EN** para cada tradução
3. **Use grupos semânticos** - não crie grupos aleatórios
4. **Mantenha consistência** - reutilize traduções existentes quando possível
5. **Textos curtos** - traduções devem ser concisas

## 📋 Checklist para Apresentação Bilíngue

- ✅ Sistema de tradução centralizado criado
- ✅ Hooks `useTranslations` e `useTranslationGroup` disponíveis
- ✅ Dicionário completo PT/EN com 200+ termos
- ✅ Compatibilidade mantida com código existente
- ✅ TypeScript com autocomplete completo
- ✅ Documentação completa

## 🚀 Próximos Passos

Para aplicar as traduções em componentes existentes, use os hooks e substitua textos fixos pelas chaves do dicionário. Exemplo:

**Antes:**
```tsx
<h1>Bem-vindo</h1>
```

**Depois:**
```tsx
const { t } = useTranslations();
<h1>{t('global.welcome')}</h1>
```

Agora `<h1>` mostrará "Bem-vindo" (PT) ou "Welcome" (EN) automaticamente!
