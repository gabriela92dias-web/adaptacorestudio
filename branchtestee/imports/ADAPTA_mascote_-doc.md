# 📖 ADAPTA - DOCUMENTAÇÃO COMPLETA

**Versão**: 1.0  
**Data**: 2026-03-06  
**Autor**: Sistema ADAPTA

---

## 📋 ÍNDICE

1. [Guia de Integração](#1-guia-de-integração)
2. [Checklist de Integração](#2-checklist-de-integração)
3. [Mapa de Arquitetura](#3-mapa-de-arquitetura)
4. [Diagramas de Fluxo](#4-diagramas-de-fluxo)

---
---
---

# 1. GUIA DE INTEGRAÇÃO

## Visão Geral

O ADAPTA é um gerador de mascotes modular que pode ser integrado em qualquer aplicação React como um componente widget flutuante.

---

## ✅ Pré-requisitos

### Dependências Necessárias

```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "motion": "^11.x",
  "lucide-react": "^0.x",
  "sonner": "^1.x"
}
```

### Instalação

```bash
npm install motion lucide-react sonner
# ou
pnpm add motion lucide-react sonner
```

---

## 🚀 Uso Básico

### 1. Importação

```tsx
import { MascotWidget } from "./components/MascotWidget";
import { Toaster } from "sonner";
```

### 2. Implementação Mínima

```tsx
export function App() {
  return (
    <>
      <Toaster position="bottom-center" />
      <YourApplicationContent />
      <MascotWidget />
    </>
  );
}
```

---

## ⚙️ API do Componente

### MascotWidget Props

```tsx
interface MascotWidgetProps {
  /** Posição do FAB na tela (default: "bottom-right") */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  
  /** Tamanho do FAB em pixels (default: 80) */
  size?: number;
  
  /** Configuração inicial do mascote (opcional) */
  initialConfig?: MascotConfig;
  
  /** Callback quando a configuração muda */
  onChange?: (config: MascotConfig) => void;
  
  /** Callback quando o usuário exporta (SVG/PNG) */
  onExport?: (type: "svg" | "png", data: string | Blob) => void;
  
  /** Callback quando o modo de visualização muda */
  onViewModeChange?: (mode: "minimized" | "sidebar" | "maximized") => void;
  
  /** Z-index base (default: 50) */
  zIndex?: number;
  
  /** Desabilitar o widget */
  disabled?: boolean;
  
  /** Customizar cores do tema (futuro) */
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
  };
}
```

### MascotConfig Type

```tsx
interface MascotConfig {
  bodyId: string;      // ID da forma do corpo
  eyeId: string;       // ID do conjunto de olhos
  mouthId: string;     // ID da boca
  faceOffsetY: number; // Ajuste vertical do rosto (-50 a 50)
  noiseAmount: number; // Quantidade de textura granulada (0 a 1)
}
```

---

## 📋 Exemplos de Uso

### Exemplo 1: Widget Básico

```tsx
<MascotWidget position="bottom-right" size={80} />
```

### Exemplo 2: Com Callbacks

```tsx
<MascotWidget
  position="bottom-left"
  size={100}
  onChange={(config) => {
    console.log("Mascote alterado:", config);
    // Salvar no estado da aplicação
    saveMascotToState(config);
  }}
  onExport={(type, data) => {
    console.log(`Exportado ${type}`);
    // Enviar para servidor ou processar
    uploadToServer(data);
  }}
  onViewModeChange={(mode) => {
    console.log("Modo de visualização:", mode);
    // Analytics ou ajustes de UI
    trackEvent("mascot_view_change", { mode });
  }}
/>
```

### Exemplo 3: Com Configuração Inicial

```tsx
const savedConfig = {
  bodyId: "blob",
  eyeId: "redondo2",
  mouthId: "sorriso",
  faceOffsetY: 0,
  noiseAmount: 0.3,
};

<MascotWidget
  position="top-right"
  initialConfig={savedConfig}
  onChange={(config) => {
    localStorage.setItem("mascot", JSON.stringify(config));
  }}
/>
```

### Exemplo 4: Customização Avançada

```tsx
<MascotWidget
  position="bottom-right"
  size={90}
  zIndex={999}
  theme={{
    primaryColor: "#ff6b6b",
    backgroundColor: "#f5f5f7",
  }}
  disabled={!userHasPermission}
/>
```

---

## 🎯 Modos de Visualização

O widget oferece 3 modos que o usuário pode alternar:

### 1. **Minimizado** (minimized)
- Apenas o botão flutuante visível
- Não interfere na UI
- Clique para expandir

### 2. **Painel Lateral** (sidebar)
- Painel desliza da direita (600px de largura)
- Preview médio + controles completos
- Backdrop escurecido
- Clique fora para fechar

### 3. **Maximizado** (maximized)
- Ocupa toda a tela
- Layout horizontal: preview 60% + controles 40%
- Preview gigante (até 600x600px)
- Melhor experiência de edição

---

## 🔧 Isolamento e Compatibilidade

### Estilos CSS
- ✅ Todos os estilos são via Tailwind v4 (inline classes)
- ✅ Não há vazamento de CSS para a aplicação host
- ✅ Z-index configurável via props

### Estado
- ✅ Estado interno gerenciado pelo widget
- ✅ Undo/redo isolado (até 30 níveis)
- ✅ Não interfere com estado global da aplicação

### Eventos
- ✅ Atalhos de teclado só funcionam quando o widget está aberto
- ✅ ESC fecha o widget automaticamente
- ✅ Callbacks opcionais para comunicação com a host

### Múltiplas Instâncias
- ⚠️ Recomendamos usar apenas 1 instância por página
- ⚠️ Se usar múltiplas, use `zIndex` diferente para cada uma

---

## 📦 Exportação Programática

Você pode exportar mascotes programaticamente sem a UI:

```tsx
import { getMascotSvgString } from "./components/MascotSVG";

const config = {
  bodyId: "blob",
  eyeId: "redondo2",
  mouthId: "sorriso",
  faceOffsetY: 0,
  noiseAmount: 0.3,
};

// Gerar SVG string
const svgString = getMascotSvgString(config);

// Criar blob para download
const blob = new Blob([svgString], { type: "image/svg+xml" });
const url = URL.createObjectURL(blob);
```

---

## 🎨 Assets Disponíveis

### Formas de Corpo (13)
`blob`, `circulo`, `oval`, `quad`, `hexagono`, `estrela`, `triangulo`, `capsule`, `retangulo`, `diamante`, `nuvem`, `coração`, `pílula`

### Conjuntos de Olhos (23)
`redondo2`, `amandoa`, `semicirculo`, `elipse`, `quadrado`, `estrela`, `triangulo`, `olho-gato`, `x`, `coração`, `meio-arredondado`, `gotinha`, `grego`, `classico`, `kawaii`, `zangado`, `surpreso`, `morto`, `feliz`, `piscada`, `sono`, `choro`, `amoroso`

### Bocas (9)
`sorriso`, `linha`, `redonda`, `arco-cima`, `arco-baixo`, `wave`, `triste`, `neutra`, `feliz`

---

## 🔑 Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Space` | Randomizar mascote |
| `Cmd/Ctrl + Z` | Desfazer |
| `Cmd/Ctrl + Shift + Z` | Refazer |
| `ESC` | Minimizar widget |

---

## 🧪 Testando a Integração

Para testar se a integração está funcionando:

1. **Teste visual**: O botão flutuante deve aparecer na posição especificada
2. **Teste de interação**: Clique no botão → painel deve abrir
3. **Teste de callbacks**: Verifique se os callbacks são chamados corretamente
4. **Teste de isolamento**: O widget não deve afetar outros componentes
5. **Teste de responsividade**: Funciona em desktop e mobile

---

## 🐛 Troubleshooting

### O widget não aparece
- ✅ Verifique se o `Toaster` está presente na aplicação
- ✅ Confirme que as dependências estão instaladas
- ✅ Verifique conflitos de z-index

### Estilos estranhos
- ✅ Certifique-se de que o Tailwind está configurado corretamente
- ✅ Verifique se não há CSS global sobrescrevendo

### Callbacks não funcionam
- ✅ Confirme que você está passando funções válidas
- ✅ Use `useCallback` se necessário para evitar re-renders

---
---
---

# 2. CHECKLIST DE INTEGRAÇÃO

Use este checklist para garantir que o ADAPTA está funcionando perfeitamente como módulo na sua aplicação.

---

## 📦 Instalação e Configuração

- [ ] Dependências instaladas (`motion`, `lucide-react`, `sonner`)
- [ ] Tailwind CSS v4 configurado corretamente
- [ ] Componente `Toaster` do Sonner presente no root da aplicação
- [ ] Imports de estilos necessários incluídos (`/src/styles/theme.css`, `/src/styles/fonts.css`)

---

## 🎯 Testes Funcionais

### Modo Minimizado
- [ ] Botão flutuante (FAB) aparece na posição correta
- [ ] Hover no botão aumenta a sombra
- [ ] Clique no botão abre o painel lateral
- [ ] Animação de entrada (scale-up) funciona suavemente
- [ ] Mascote é renderizado corretamente no botão

### Modo Painel Lateral (Sidebar)
- [ ] Painel desliza da direita suavemente
- [ ] Backdrop escurecido aparece atrás do painel
- [ ] Clique no backdrop fecha o painel
- [ ] Botões de modo de visualização funcionam
- [ ] Preview do mascote é exibido corretamente
- [ ] Todos os controles (corpo, olhos, boca) funcionam
- [ ] Slider de ruído funciona
- [ ] Slider de posição Y do rosto funciona
- [ ] Seletor de animação funciona
- [ ] Botões de undo/redo funcionam
- [ ] Botão "Randomizar" gera novo mascote
- [ ] Botão "Reset" volta à configuração padrão
- [ ] Exportação SVG funciona
- [ ] Exportação PNG funciona (1024x1024px)
- [ ] Botão "Copiar" copia SVG para clipboard
- [ ] Bundle GIF/ZIP funciona

### Modo Maximizado
- [ ] Transição para tela cheia funciona
- [ ] Layout horizontal (60/40) é exibido
- [ ] Preview grande (até 600x600px) renderiza
- [ ] Painel de controles lateral funciona
- [ ] Botões de alternância de modo funcionam
- [ ] Todos os controles funcionam (igual ao sidebar)
- [ ] Responsividade em telas menores

---

## ⌨️ Atalhos de Teclado

- [ ] `Space` randomiza o mascote (quando não em input)
- [ ] `Cmd/Ctrl + Z` desfaz última ação
- [ ] `Cmd/Ctrl + Shift + Z` refaz ação desfeita
- [ ] `ESC` fecha/minimiza o widget
- [ ] Atalhos só funcionam quando o widget está aberto
- [ ] Atalhos não interferem com inputs da aplicação host

---

## 🔗 Callbacks e Eventos

- [ ] `onChange` é chamado quando a configuração muda
- [ ] `onChange` recebe objeto `MascotConfig` correto
- [ ] `onExport` é chamado ao exportar SVG
- [ ] `onExport` é chamado ao exportar PNG
- [ ] `onExport` recebe o tipo correto ("svg" | "png")
- [ ] `onExport` recebe os dados (Blob) corretos
- [ ] `onViewModeChange` é chamado ao mudar visualização
- [ ] `onViewModeChange` recebe modo correto ("minimized" | "sidebar" | "maximized")

---

## 🎨 Customização via Props

- [ ] `position="bottom-right"` funciona
- [ ] `position="bottom-left"` funciona
- [ ] `position="top-right"` funciona
- [ ] `position="top-left"` funciona
- [ ] `size` customizado funciona (60-120px testados)
- [ ] `initialConfig` carrega configuração inicial
- [ ] `zIndex` customizado funciona
- [ ] `disabled={true}` desabilita o widget

---

## 🧪 Isolamento e Compatibilidade

### CSS e Estilos
- [ ] Estilos do widget não afetam a aplicação host
- [ ] Estilos da aplicação host não afetam o widget
- [ ] Classes Tailwind não conflitam
- [ ] Z-index configurável funciona corretamente
- [ ] Backdrop não bloqueia interações quando minimizado

### JavaScript e Estado
- [ ] Estado do widget é isolado
- [ ] Estado da aplicação host não é afetado
- [ ] Múltiplas re-renders da host não quebram o widget
- [ ] Undo/redo não afeta histórico da host
- [ ] LocalStorage/SessionStorage não conflita

### Eventos e Listeners
- [ ] Event listeners são limpos ao desmontar
- [ ] Keyboard shortcuts não conflitam com a host
- [ ] Click outside funciona sem interferir na host
- [ ] Scroll da host não é bloqueado quando widget minimizado

---

## 📱 Responsividade

### Desktop (>1024px)
- [ ] Layout completo renderiza corretamente
- [ ] Painel lateral ocupa 600px máximo
- [ ] Preview está centralizado e bem dimensionado
- [ ] Controles são acessíveis e legíveis

### Tablet (768px-1024px)
- [ ] Painel lateral ocupa 90vw máximo
- [ ] Preview redimensiona adequadamente
- [ ] Controles permanecem funcionais
- [ ] Texto permanece legível

### Mobile (<768px)
- [ ] FAB tem tamanho apropriado (mínimo 60px)
- [ ] Painel lateral ocupa 90vw
- [ ] Preview se ajusta à tela
- [ ] Controles são tocáveis (min 44x44px)
- [ ] Texto permanece legível
- [ ] Scroll funciona nos controles

---

## 🚀 Performance

- [ ] Inicialização rápida (<500ms)
- [ ] Transições suaves (60fps)
- [ ] Sem janks ao abrir/fechar
- [ ] Randomize instantâneo (<100ms)
- [ ] Exportação SVG rápida (<200ms)
- [ ] Exportação PNG aceitável (<2s)
- [ ] Sem memory leaks ao desmontar
- [ ] Re-renders otimizados

---

## 🎯 Edge Cases

- [ ] Funciona com React 18 Strict Mode
- [ ] Funciona após hot-reload (development)
- [ ] Funciona em build de produção
- [ ] Funciona com múltiplas instâncias (se aplicável)
- [ ] Funciona offline (sem CDN dependencies)
- [ ] Funciona em navegadores modernos (Chrome, Firefox, Safari, Edge)
- [ ] Graceful degradation em navegadores antigos
- [ ] Funciona com extensions de bloqueio de anúncios
- [ ] Funciona com dark mode do sistema

---

## 🔒 Segurança

- [ ] Nenhum script externo é carregado
- [ ] Nenhum dado é enviado para servidores externos
- [ ] XSS protection (SVG sanitization se aplicável)
- [ ] CORS não é um problema (tudo local)

---

## 📊 Telemetria e Analytics (Opcional)

- [ ] Eventos de abertura do widget são trackados
- [ ] Mudanças de configuração são registradas
- [ ] Exports são contabilizados
- [ ] Erros são capturados e reportados

---

## 🐛 Testes de Erro

- [ ] Widget funciona mesmo sem `Toaster`
- [ ] Widget não quebra se callbacks forem `undefined`
- [ ] Exportação falha gracefully em caso de erro
- [ ] Mensagens de erro são informativas
- [ ] Console limpo (sem warnings desnecessários)

---

## 📝 Documentação

- [ ] README.md atualizado com instruções de integração
- [ ] INTEGRATION.md está completo e correto
- [ ] Exemplos de código estão funcionais
- [ ] TypeScript types estão exportados corretamente
- [ ] JSDoc comments estão presentes nas props principais

---

## ✨ Qualidade de Código

- [ ] Sem erros de TypeScript
- [ ] Sem warnings de React
- [ ] Código formatado consistentemente
- [ ] Comentários explicativos onde necessário
- [ ] Nomes de variáveis descritivos
- [ ] Funções pequenas e focadas
- [ ] DRY (Don't Repeat Yourself)

---

## 🎬 Demonstração

- [ ] Exemplo de integração funcional (`IntegrationExample.tsx`)
- [ ] Demonstra todos os recursos principais
- [ ] Código de exemplo é copy-paste ready
- [ ] Screenshots/GIFs da integração (se aplicável)

---

## ✅ Aprovação Final

- [ ] Todos os itens acima foram testados e aprovados
- [ ] Aplicação host funciona perfeitamente com o widget
- [ ] Nenhum bug crítico identificado
- [ ] Performance é aceitável
- [ ] Experiência do usuário é fluida

---

## 📅 Data do Teste

- **Testado em**: _______________
- **Testado por**: _______________
- **Versão do ADAPTA**: _______________
- **Navegadores testados**: _______________

---

## 💡 Observações Adicionais

```
[Espaço para notas específicas da integração]
```

---
---
---

# 3. MAPA DE ARQUITETURA

## 📋 Índice

1. [Visão Geral](#visão-geral-arquitetura)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [Componentes Principais](#componentes-principais)
4. [Tipos e Interfaces](#tipos-e-interfaces)
5. [Hooks Customizados](#hooks-customizados)
6. [Sistema de Assets](#sistema-de-assets)
7. [Sistema de Animação](#sistema-de-animação)
8. [Sistema de Exportação](#sistema-de-exportação)
9. [Fluxo de Dados](#fluxo-de-dados)
10. [Integrações Externas](#integrações-externas)

---

## Visão Geral (Arquitetura)

### Propósito
ADAPTA é um gerador interativo de mascotes geométricos com:
- 13 formas de corpo
- 23 conjuntos de olhos
- 9 tipos de boca
- Sistema de mix & match livre
- Undo/Redo ilimitado
- Exportação SVG/PNG/GIF
- Animações suaves
- Modo widget para integração

### Tecnologias Core
- **React 18**: Componentes e hooks
- **TypeScript**: Type safety
- **Tailwind CSS v4**: Estilização inline
- **Motion (Framer Motion)**: Animações
- **Lucide React**: Ícones
- **Sonner**: Toasts/notificações

---

## Estrutura de Arquivos

```
/src/app/
├── App.tsx                          # Entry point da aplicação
├── components/
│   ├── index.ts                     # Exports públicos (API)
│   │
│   ├── MascotWidget.tsx             # Widget flutuante (3 modos)
│   ├── MascotBuilder.tsx            # Editor full-screen
│   ├── MascotSVG.tsx                # Renderizador SVG core
│   │
│   ├── ControlPanel.tsx             # Painel de controles
│   ├── AnimationPanel.tsx           # Seletor de animações
│   ├── ExportBundle.tsx             # Exportação GIF/ZIP
│   │
│   ├── body-shapes.ts               # 13 formas de corpo (SVG paths)
│   ├── eye-sets.ts                  # 23 conjuntos de olhos
│   ├── mouth-sets.ts                # 9 bocas
│   │
│   └── useHistory.ts                # Hook de undo/redo
│
├── styles/
│   ├── theme.css                    # Variáveis CSS globais
│   └── fonts.css                    # Imports de fontes
│
└── imports/                         # Assets do Figma (se houver)

/
├── INTEGRATION.md                   # Guia de integração
├── INTEGRATION_CHECKLIST.md         # Checklist de testes
└── ARCHITECTURE_MAP.md              # Este documento
```

---

## Componentes Principais

### 3.1 App.tsx

**Responsabilidade**: Entry point e roteamento de modos.

**Código Simplificado**:
```tsx
export default function App() {
  const mode: "full" | "widget" = "widget";
  
  return (
    <>
      <Toaster />
      {mode === "full" ? (
        <MascotBuilder />
      ) : (
        <MascotWidget />
      )}
    </>
  );
}
```

**Função**:
- Define qual modo está ativo
- Renderiza `Toaster` global (notificações)
- Renderiza componente apropriado

---

### 3.2 MascotWidget.tsx

**Responsabilidade**: Widget flutuante com 3 modos de visualização.

**Props**:
```tsx
interface MascotWidgetProps {
  position?: FabPosition;              // "bottom-right" | "bottom-left" | "top-right" | "top-left"
  size?: number;                       // Tamanho do FAB (60-120px)
  initialConfig?: MascotConfig;        // Configuração inicial
  onChange?: (config: MascotConfig) => void;
  onExport?: (type: "svg" | "png", data: string | Blob) => void;
  onViewModeChange?: (mode: ViewMode) => void;
  zIndex?: number;                     // Z-index base
  disabled?: boolean;
  theme?: { primaryColor?: string; backgroundColor?: string; };
}
```

**Estados Internos**:
```tsx
const [viewMode, setViewMode] = useState<ViewMode>("minimized");
const [animKey, setAnimKey] = useState(0);          // Force re-render
const [copied, setCopied] = useState(false);
const [selectedAnim, setSelectedAnim] = useState<string | null>(null);
```

**Funções Principais**:

#### `changeViewMode(mode: ViewMode)`
- Altera modo de visualização
- Chama callback `onViewModeChange` se fornecido
- Modos: "minimized" | "sidebar" | "maximized"

#### `randomize()`
```tsx
const randomize = useCallback(() => {
  const randomBodyId = BODY_SHAPES[Math.floor(Math.random() * BODY_SHAPES.length)].id;
  const randomEyeId = EYE_SETS[Math.floor(Math.random() * EYE_SETS.length)].id;
  const randomMouthId = MOUTH_SETS[Math.floor(Math.random() * MOUTH_SETS.length)].id;
  
  setConfig({
    ...config,
    bodyId: randomBodyId,
    eyeId: randomEyeId,
    mouthId: randomMouthId,
  });
}, [config, setConfig]);
```
- Gera combinação aleatória de corpo/olhos/boca
- Mantém faceOffsetY e noiseAmount

#### `setConfig(newConfig: MascotConfig)`
```tsx
const setConfig = useCallback((cfg: MascotConfig) => {
  history.push(cfg);
  setAnimKey(k => k + 1);
  if (onChange) onChange(cfg);
}, [history, onChange]);
```
- Atualiza configuração no histórico
- Força re-render do preview (animKey)
- Notifica callback onChange

#### `resetConfig()`
- Volta para `DEFAULT_CONFIG`
- Limpa histórico
- Reset animKey

#### `downloadSvg()`
```tsx
const downloadSvg = useCallback(() => {
  const svgString = getMascotSvgString(config);
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `adapta-${Date.now()}.svg`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("SVG baixado!");
  if (onExport) onExport("svg", blob);
}, [config, onExport]);
```
- Gera SVG string via `getMascotSvgString`
- Cria Blob e trigger download
- Notifica callback onExport

#### `downloadPng()`
```tsx
const downloadPng = useCallback(() => {
  const svgString = getMascotSvgString(config);
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  const img = new Image();
  const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);
  
  img.onload = () => {
    ctx.drawImage(img, 0, 0, 1024, 1024);
    canvas.toBlob((blob) => {
      const pngUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `adapta-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      URL.revokeObjectURL(pngUrl);
      toast.success("PNG baixado!");
      if (onExport) onExport("png", blob);
    });
  };
  
  img.src = url;
}, [config, onExport]);
```
- Converte SVG para PNG usando Canvas API
- Resolução: 1024x1024px
- Cria Blob e trigger download

#### `copyToClipboard()`
```tsx
const copyToClipboard = useCallback(async () => {
  const svgString = getMascotSvgString(config);
  await navigator.clipboard.writeText(svgString);
  setCopied(true);
  toast.success("SVG copiado!");
  setTimeout(() => setCopied(false), 2000);
}, [config]);
```
- Copia SVG string para clipboard
- Mostra feedback visual (ícone check)
- Auto-reset após 2s

**Keyboard Shortcuts**:
```tsx
useEffect(() => {
  if (viewMode === "minimized") return; // Só funciona quando aberto
  
  const handler = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return; // Ignora inputs
    
    if (e.code === "Space") {
      e.preventDefault();
      randomize();
    }
    
    if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      history.undo();
      setAnimKey(k => k + 1);
    }
    
    if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) {
      e.preventDefault();
      history.redo();
      setAnimKey(k => k + 1);
    }
    
    if (e.key === "Escape") {
      e.preventDefault();
      setViewMode("minimized");
    }
  };
  
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, [viewMode, randomize, history]);
```

**Estrutura de Renderização**:
```
MascotWidget
├── FAB Button (minimized)
│   └── MascotSVG (pequeno)
│
├── Sidebar Mode (sidebar)
│   ├── Backdrop (click to close)
│   └── Panel (slide from right)
│       ├── Header
│       │   ├── View mode controls
│       │   ├── Copy/Export buttons
│       │   └── ExportBundle
│       ├── Preview (280px)
│       │   └── MascotSVG (240px, animated)
│       └── Controls
│           └── ControlPanel
│
└── Maximized Mode (maximized)
    ├── Header (full width)
    │   ├── View mode controls
    │   └── Export buttons
    └── Content (flex horizontal)
        ├── Preview (60%, até 600px)
        │   └── MascotSVG (animated)
        └── Controls (40%, 500px)
            └── ControlPanel
```

---

### 3.3 MascotBuilder.tsx

**Responsabilidade**: Editor full-screen (modo "full").

**Props**:
```tsx
interface MascotBuilderProps {
  className?: string;
}
```

**Estrutura**:
- Similar ao MascotWidget mas layout dedicado
- Sem botão flutuante
- Desktop: split horizontal (preview left, controls right)
- Mobile: stacked vertical (preview top, controls bottom)

**Diferenças do Widget**:
- Não tem modos de visualização
- Sempre visível
- Layout responsivo otimizado para desktop

---

### 3.4 MascotSVG.tsx

**Responsabilidade**: Core do sistema - renderiza o SVG do mascote.

**Interface Principal**:
```tsx
interface MascotConfig {
  bodyId: string;      // ID da forma (ex: "blob", "circulo")
  eyeId: string;       // ID dos olhos (ex: "redondo2", "kawaii")
  mouthId: string;     // ID da boca (ex: "sorriso", "triste")
  faceOffsetY: number; // Ajuste vertical do rosto (-50 a 50)
  noiseAmount: number; // Textura granulada (0 a 1)
}

interface MascotSVGProps {
  config: MascotConfig;
  anim?: {
    rotate?: number;    // Rotação em graus
    scale?: number;     // Escala (1.0 = normal)
    x?: number;         // Deslocamento X
    y?: number;         // Deslocamento Y
  };
  className?: string;
}
```

**DEFAULT_CONFIG**:
```tsx
export const DEFAULT_CONFIG: MascotConfig = {
  bodyId: "blob",
  eyeId: "redondo2",
  mouthId: "sorriso",
  faceOffsetY: 0,
  noiseAmount: 0.3,
};
```

**Função Core - MascotSVG()**:
```tsx
export function MascotSVG({ config, anim, className }: MascotSVGProps) {
  // 1. Busca assets
  const body = BODY_SHAPES.find(b => b.id === config.bodyId) || BODY_SHAPES[0];
  const eyeSet = EYE_SETS.find(e => e.id === config.eyeId) || EYE_SETS[0];
  const mouth = MOUTH_SETS.find(m => m.id === config.mouthId) || MOUTH_SETS[0];
  
  // 2. Calcula viewBox dinâmica
  const [vbMinX, vbMinY, vbWidth, vbHeight] = body.viewBox;
  
  // 3. Calcula offset do rosto
  const faceY = config.faceOffsetY;
  
  // 4. Aplica animação (se houver)
  const transform = anim
    ? `rotate(${anim.rotate || 0}) scale(${anim.scale || 1}) translate(${anim.x || 0} ${anim.y || 0})`
    : undefined;
  
  // 5. Renderiza SVG
  return (
    <svg viewBox={`${vbMinX} ${vbMinY} ${vbWidth} ${vbHeight}`} className={className}>
      <defs>
        {/* Filtro de ruído */}
        {config.noiseAmount > 0 && (
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="saturate"
              values="0"
            />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues={`0 ${config.noiseAmount}`} />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
          </filter>
        )}
      </defs>
      
      <g transform={transform}>
        {/* Corpo */}
        <g filter={config.noiseAmount > 0 ? "url(#noise)" : undefined}>
          {body.paths.map((d, i) => (
            <path key={i} d={d} fill={body.colors[i]} />
          ))}
        </g>
        
        {/* Rosto */}
        <g transform={`translate(0 ${faceY})`}>
          {/* Olhos */}
          {eyeSet.paths.map((d, i) => (
            <path key={`eye-${i}`} d={d} fill={eyeSet.colors[i]} />
          ))}
          
          {/* Boca */}
          {mouth.paths.map((d, i) => (
            <path key={`mouth-${i}`} d={d} fill={mouth.colors[i]} />
          ))}
        </g>
      </g>
    </svg>
  );
}
```

**Função Auxiliar - getMascotSvgString()**:
```tsx
export function getMascotSvgString(config: MascotConfig): string {
  const body = BODY_SHAPES.find(b => b.id === config.bodyId) || BODY_SHAPES[0];
  const eyeSet = EYE_SETS.find(e => e.id === config.eyeId) || EYE_SETS[0];
  const mouth = MOUTH_SETS.find(m => m.id === config.mouthId) || MOUTH_SETS[0];
  
  const [vbMinX, vbMinY, vbWidth, vbHeight] = body.viewBox;
  const faceY = config.faceOffsetY;
  
  // Monta string SVG completa
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbMinX} ${vbMinY} ${vbWidth} ${vbHeight}">`;
  
  // Adiciona defs (filtro de ruído)
  if (config.noiseAmount > 0) {
    svg += `<defs><filter id="noise">...</filter></defs>`;
  }
  
  // Adiciona corpo
  svg += `<g filter="${config.noiseAmount > 0 ? 'url(#noise)' : ''}">`;
  body.paths.forEach((d, i) => {
    svg += `<path d="${d}" fill="${body.colors[i]}"/>`;
  });
  svg += `</g>`;
  
  // Adiciona rosto
  svg += `<g transform="translate(0 ${faceY})">`;
  eyeSet.paths.forEach((d, i) => {
    svg += `<path d="${d}" fill="${eyeSet.colors[i]}"/>`;
  });
  mouth.paths.forEach((d, i) => {
    svg += `<path d="${d}" fill="${mouth.colors[i]}"/>`;
  });
  svg += `</g>`;
  
  svg += `</svg>`;
  return svg;
}
```

**Fluxo de Renderização**:
```
MascotSVG
├── 1. Lookup assets (body, eyes, mouth)
├── 2. Calcula viewBox do corpo
├── 3. Aplica faceOffsetY
├── 4. Aplica animação (rotate, scale, translate)
├── 5. Renderiza camadas:
│   ├── <defs> (filtro de ruído)
│   ├── <g> Corpo (com filtro)
│   │   └── paths[] com cores[]
│   └── <g> Rosto (com translate Y)
│       ├── Olhos paths[] com cores[]
│       └── Boca paths[] com cores[]
└── Output: SVG completo
```

---

### 3.5 ControlPanel.tsx

**Responsabilidade**: Interface de controles (seletores, sliders, botões).

**Props**:
```tsx
interface ControlPanelProps {
  config: MascotConfig;
  setConfig: (cfg: MascotConfig) => void;
  onRandomize: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  selectedAnim: string | null;
  onSelectAnim: (animId: string | null) => void;
}
```

**Estrutura de UI**:
```tsx
<div className="space-y-6">
  {/* Ações Rápidas */}
  <div className="flex gap-2">
    <button onClick={onRandomize}>🎲 Randomizar</button>
    <button onClick={onReset}>↺ Reset</button>
    <button onClick={onUndo} disabled={!canUndo}>← Desfazer</button>
    <button onClick={onRedo} disabled={!canRedo}>→ Refazer</button>
  </div>
  
  {/* Seletores */}
  <BodySelector value={config.bodyId} onChange={(id) => setConfig({...config, bodyId: id})} />
  <EyeSelector value={config.eyeId} onChange={(id) => setConfig({...config, eyeId: id})} />
  <MouthSelector value={config.mouthId} onChange={(id) => setConfig({...config, mouthId: id})} />
  
  {/* Sliders */}
  <RangeSlider
    label="Textura Granulada"
    value={config.noiseAmount}
    onChange={(v) => setConfig({...config, noiseAmount: v})}
    min={0}
    max={1}
    step={0.05}
  />
  
  <RangeSlider
    label="Posição Y do Rosto"
    value={config.faceOffsetY}
    onChange={(v) => setConfig({...config, faceOffsetY: v})}
    min={-50}
    max={50}
    step={1}
  />
  
  {/* Animações */}
  <AnimationPanel selected={selectedAnim} onSelect={onSelectAnim} />
</div>
```

**Seletores (BodySelector, EyeSelector, MouthSelector)**:
```tsx
function BodySelector({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-medium text-[#666]">CORPO</label>
      <div className="grid grid-cols-4 gap-2">
        {BODY_SHAPES.map((shape) => (
          <button
            key={shape.id}
            onClick={() => onChange(shape.id)}
            className={`aspect-square rounded-lg border-2 p-2 transition-all ${
              value === shape.id
                ? "border-[#333] bg-[#f5f5f7]"
                : "border-black/10 hover:border-black/20"
            }`}
          >
            <MascotSVG config={{ ...DEFAULT_CONFIG, bodyId: shape.id }} />
          </button>
        ))}
      </div>
    </div>
  );
}
```
- Grid de thumbnails
- Preview visual de cada opção
- Destaque visual no item selecionado
- Mesmo padrão para olhos e boca

**Sliders (RangeSlider)**:
```tsx
function RangeSlider({ label, value, onChange, min, max, step }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-xs font-medium text-[#666]">{label}</label>
        <span className="text-xs text-[#999]">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
```
- Label + valor atual
- Input range HTML5
- Callback onChange para atualizar config

---

### 3.6 AnimationPanel.tsx

**Responsabilidade**: Seletor de animações + gerador de transforms.

**Animações Disponíveis**:
```tsx
export const ANIMATIONS = [
  { id: "bounce", name: "Pular", icon: "↕️" },
  { id: "rotate", name: "Girar", icon: "🔄" },
  { id: "pulse", name: "Pulsar", icon: "💓" },
  { id: "swing", name: "Balançar", icon: "↔️" },
  { id: "float", name: "Flutuar", icon: "☁️" },
  { id: "wobble", name: "Tremer", icon: "🌀" },
];
```

**Props**:
```tsx
interface AnimationPanelProps {
  selected: string | null;
  onSelect: (animId: string | null) => void;
}
```

**UI**:
```tsx
<div className="space-y-3">
  <label className="text-xs font-medium text-[#666]">ANIMAÇÃO</label>
  <div className="grid grid-cols-3 gap-2">
    {ANIMATIONS.map((anim) => (
      <button
        key={anim.id}
        onClick={() => onSelect(selected === anim.id ? null : anim.id)}
        className={selected === anim.id ? "active" : ""}
      >
        {anim.icon} {anim.name}
      </button>
    ))}
  </div>
</div>
```

**Hook - useAnimationLoop()**:
```tsx
export function useAnimationLoop(animId: string | null) {
  const [transforms, setTransforms] = useState<AnimTransforms>({
    rotate: 0,
    scale: 1,
    x: 0,
    y: 0,
  });
  
  useEffect(() => {
    if (!animId) {
      setTransforms({ rotate: 0, scale: 1, x: 0, y: 0 });
      return;
    }
    
    let frameId: number;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000; // segundos
      
      switch (animId) {
        case "bounce":
          setTransforms({
            rotate: 0,
            scale: 1,
            x: 0,
            y: Math.sin(elapsed * 4) * 10, // sobe/desce
          });
          break;
          
        case "rotate":
          setTransforms({
            rotate: (elapsed * 60) % 360, // 60°/s = volta completa em 6s
            scale: 1,
            x: 0,
            y: 0,
          });
          break;
          
        case "pulse":
          const pulseScale = 1 + Math.sin(elapsed * 3) * 0.1; // 0.9 a 1.1
          setTransforms({
            rotate: 0,
            scale: pulseScale,
            x: 0,
            y: 0,
          });
          break;
          
        case "swing":
          setTransforms({
            rotate: Math.sin(elapsed * 2) * 15, // -15° a +15°
            scale: 1,
            x: 0,
            y: 0,
          });
          break;
          
        case "float":
          setTransforms({
            rotate: 0,
            scale: 1,
            x: 0,
            y: Math.sin(elapsed * 1.5) * 15, // flutuação lenta
          });
          break;
          
        case "wobble":
          setTransforms({
            rotate: Math.sin(elapsed * 6) * 5,
            scale: 1 + Math.cos(elapsed * 4) * 0.05,
            x: Math.cos(elapsed * 5) * 5,
            y: 0,
          });
          break;
      }
      
      frameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(frameId);
  }, [animId]);
  
  return transforms;
}
```

**Fluxo de Animação**:
```
1. Usuário seleciona animação no AnimationPanel
2. onSelect() atualiza estado selectedAnim
3. useAnimationLoop(selectedAnim) inicia loop
4. requestAnimationFrame calcula transforms a cada frame
5. Transforms são passados para <MascotSVG anim={transforms} />
6. SVG aplica transform CSS
```

---

### 3.7 ExportBundle.tsx

**Responsabilidade**: Exportação em bundle (GIF animado + ZIP com frames).

**Interface**:
```tsx
interface ExportBundleProps {
  // Recebe config via contexto ou props
}
```

**Funcionamento**:
```tsx
export function ExportBundle() {
  const [isExporting, setIsExporting] = useState(false);
  
  const exportGif = async () => {
    setIsExporting(true);
    toast.info("Gerando GIF...");
    
    try {
      // 1. Gera 24 frames (1 segundo @ 24fps)
      const frames: Blob[] = [];
      for (let i = 0; i < 24; i++) {
        const progress = i / 24;
        const animTransform = calculateAnimForProgress(progress);
        const svgString = getMascotSvgString(config, animTransform);
        const pngBlob = await svgToPng(svgString);
        frames.push(pngBlob);
      }
      
      // 2. Cria GIF usando gifshot ou similar
      const gifBlob = await createGif(frames);
      
      // 3. Download
      downloadBlob(gifBlob, `adapta-${Date.now()}.gif`);
      
      toast.success("GIF criado!");
    } catch (error) {
      toast.error("Erro ao criar GIF");
    } finally {
      setIsExporting(false);
    }
  };
  
  const exportZip = async () => {
    // Similar, mas cria ZIP com PNG frames
    const zip = new JSZip();
    
    for (let i = 0; i < 24; i++) {
      const pngBlob = await generateFrame(i);
      zip.file(`frame-${i.toString().padStart(3, "0")}.png`, pngBlob);
    }
    
    const zipBlob = await zip.generateAsync({ type: "blob" });
    downloadBlob(zipBlob, `adapta-frames-${Date.now()}.zip`);
  };
  
  return (
    <button onClick={exportGif} disabled={isExporting}>
      {isExporting ? "Gerando..." : "📦 Bundle"}
    </button>
  );
}
```

**Nota**: Implementação completa requer bibliotecas externas (gifshot, jszip).

---

## Tipos e Interfaces

### 4.1 MascotConfig
```tsx
interface MascotConfig {
  bodyId: string;      // ID da forma (ex: "blob")
  eyeId: string;       // ID dos olhos (ex: "redondo2")
  mouthId: string;     // ID da boca (ex: "sorriso")
  faceOffsetY: number; // Ajuste Y (-50 a 50)
  noiseAmount: number; // Textura (0 a 1)
}
```

### 4.2 Asset Types
```tsx
interface BodyShape {
  id: string;          // Identificador único
  name: string;        // Nome para exibição
  paths: string[];     // Array de path data (SVG d="...")
  colors: string[];    // Cores correspondentes (mesmo length de paths)
  viewBox: [number, number, number, number]; // [minX, minY, width, height]
}

interface EyeSet {
  id: string;
  name: string;
  paths: string[];
  colors: string[];
}

interface MouthSet {
  id: string;
  name: string;
  paths: string[];
  colors: string[];
}
```

### 4.3 Animation Types
```tsx
interface AnimTransforms {
  rotate?: number;  // Graus
  scale?: number;   // Multiplicador (1.0 = 100%)
  x?: number;       // Pixels
  y?: number;       // Pixels
}

interface Animation {
  id: string;       // "bounce", "rotate", etc.
  name: string;     // "Pular", "Girar", etc.
  icon: string;     // Emoji para UI
}
```

### 4.4 Widget Types
```tsx
type FabPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";
type ViewMode = "minimized" | "sidebar" | "maximized";
```

---

## Hooks Customizados

### 5.1 useHistory.ts

**Responsabilidade**: Gerenciamento de undo/redo genérico.

**Interface**:
```tsx
interface HistoryState<T> {
  state: T;
  canUndo: boolean;
  canRedo: boolean;
  push: (newState: T) => void;
  undo: () => void;
  redo: () => void;
  reset: (initialState: T) => void;
}

function useHistory<T>(initialState: T): HistoryState<T>
```

**Implementação**:
```tsx
export function useHistory<T>(initialState: T): HistoryState<T> {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initialState);
  const [future, setFuture] = useState<T[]>([]);
  
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;
  
  const push = useCallback((newState: T) => {
    setPast((prev) => [...prev, present]);
    setPresent(newState);
    setFuture([]);
  }, [present]);
  
  const undo = useCallback(() => {
    if (!canUndo) return;
    
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setPast(newPast);
    setPresent(previous);
    setFuture((prev) => [present, ...prev]);
  }, [past, present, canUndo]);
  
  const redo = useCallback(() => {
    if (!canRedo) return;
    
    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast((prev) => [...prev, present]);
    setPresent(next);
    setFuture(newFuture);
  }, [future, present, canRedo]);
  
  const reset = useCallback((newInitial: T) => {
    setPast([]);
    setPresent(newInitial);
    setFuture([]);
  }, []);
  
  return {
    state: present,
    canUndo,
    canRedo,
    push,
    undo,
    redo,
    reset,
  };
}
```

**Estrutura de Dados**:
```
past: [config1, config2, config3]
present: config4 ← Estado atual
future: [config5, config6] ← Estados após undo

UNDO:
  past.pop() → present
  present → future.unshift()

REDO:
  future.shift() → present
  present → past.push()

PUSH:
  present → past.push()
  newState → present
  future → []
```

**Uso**:
```tsx
const history = useHistory<MascotConfig>(DEFAULT_CONFIG);

// Acessar estado atual
console.log(history.state);

// Adicionar novo estado
history.push({ ...history.state, bodyId: "circulo" });

// Undo/Redo
if (history.canUndo) history.undo();
if (history.canRedo) history.redo();

// Reset completo
history.reset(DEFAULT_CONFIG);
```

---

### 5.2 useAnimationLoop (em AnimationPanel.tsx)

**Responsabilidade**: Loop de animação usando requestAnimationFrame.

**Assinatura**:
```tsx
function useAnimationLoop(animId: string | null): AnimTransforms
```

**Fluxo Interno**:
```
1. useEffect monitora mudanças em animId
2. Se animId é null → retorna transforms neutros
3. Se animId existe:
   a. Inicia requestAnimationFrame loop
   b. Calcula elapsed time (Date.now())
   c. Aplica função matemática específica da animação
   d. Atualiza state transforms
   e. Chama próximo frame
4. Cleanup: cancelAnimationFrame ao desmontar
```

**Matemática das Animações**:
```tsx
// Bounce: senoide vertical
y = Math.sin(t * frequency) * amplitude

// Rotate: linear acumulativo
rotate = (t * degreesPerSecond) % 360

// Pulse: senoide em scale
scale = 1 + Math.sin(t * frequency) * amplitude

// Swing: senoide em rotação
rotate = Math.sin(t * frequency) * maxDegrees

// Float: senoide lenta vertical
y = Math.sin(t * slowFrequency) * amplitude

// Wobble: combinação de sin/cos em múltiplos eixos
rotate = Math.sin(t * f1) * a1
scale = 1 + Math.cos(t * f2) * a2
x = Math.cos(t * f3) * a3
```

---

## Sistema de Assets

### 6.1 body-shapes.ts

**Estrutura**:
```tsx
export const BODY_SHAPES: BodyShape[] = [
  {
    id: "blob",
    name: "Blob",
    viewBox: [0, 0, 200, 200],
    paths: [
      "M 100 20 Q 160 40, 180 100 Q 160 160, 100 180 Q 40 160, 20 100 Q 40 40, 100 20 Z",
    ],
    colors: ["#FFD93D"],
  },
  {
    id: "circulo",
    name: "Círculo",
    viewBox: [0, 0, 200, 200],
    paths: [
      "M 100 190 A 90 90 0 1 1 100 10 A 90 90 0 1 1 100 190 Z",
    ],
    colors: ["#6BCB77"],
  },
  // ... 11 formas adicionais
];
```

**Características**:
- 13 formas diferentes
- Cada forma tem viewBox própria
- Paths são SVG path data strings
- Colors correspondem 1:1 com paths
- Cores originais do Figma preservadas

**Como Adicionar Nova Forma**:
```tsx
{
  id: "nova-forma", // slug único
  name: "Nova Forma", // nome para UI
  viewBox: [0, 0, 200, 200], // ajustar se necessário
  paths: [
    "M ... Z", // path SVG do Figma
  ],
  colors: ["#HEXCOLOR"], // cor do Figma
}
```

---

### 6.2 eye-sets.ts

**Estrutura**:
```tsx
export const EYE_SETS: EyeSet[] = [
  {
    id: "redondo2",
    name: "Redondo",
    paths: [
      "M 70 80 A 8 8 0 1 1 70 80.001 Z", // olho esquerdo
      "M 130 80 A 8 8 0 1 1 130 80.001 Z", // olho direito
    ],
    colors: ["#333333", "#333333"],
  },
  {
    id: "kawaii",
    name: "Kawaii",
    paths: [
      "M 65 75 Q 70 80, 75 75", // olho esquerdo (arco)
      "M 125 75 Q 130 80, 135 75", // olho direito (arco)
    ],
    colors: ["#333333", "#333333"],
  },
  // ... 21 conjuntos adicionais
];
```

**Características**:
- 23 conjuntos diferentes
- Cada conjunto pode ter 1+ paths (olho único, par, complexos)
- Posicionamento relativo ao centro (100, 100)
- Alguns têm múltiplas cores (ex: pupila + íris)

---

### 6.3 mouth-sets.ts

**Estrutura**:
```tsx
export const MOUTH_SETS: MouthSet[] = [
  {
    id: "sorriso",
    name: "Sorriso",
    paths: [
      "M 70 120 Q 100 135, 130 120", // arco para cima
    ],
    colors: ["#333333"],
  },
  {
    id: "triste",
    name: "Triste",
    paths: [
      "M 70 130 Q 100 120, 130 130", // arco para baixo
    ],
    colors: ["#333333"],
  },
  // ... 7 bocas adicionais
];
```

**Características**:
- 9 tipos de boca
- Simples (1 path) ou complexas (múltiplos paths)
- Posicionamento relativo ao centro
- Cores geralmente #333 (preto) ou customizadas

---

## Sistema de Animação

### Arquitetura

```
AnimationPanel (UI)
    ↓
  selectedAnim (state: string | null)
    ↓
  useAnimationLoop(selectedAnim)
    ↓
  AnimTransforms { rotate, scale, x, y }
    ↓
  <MascotSVG anim={transforms} />
    ↓
  CSS transform aplicado ao <g>
```

### Timing e Performance

**requestAnimationFrame**:
- 60fps ideal
- Sincronizado com refresh rate do navegador
- Callback recebe timestamp preciso

**Cálculos por Frame**:
```tsx
const elapsed = (Date.now() - startTime) / 1000; // segundos

// Exemplo: Rotate @ 60°/s
const rotate = (elapsed * 60) % 360;
```

**Cleanup**:
```tsx
return () => cancelAnimationFrame(frameId);
```
- Essencial para evitar memory leaks
- Chamado quando componente desmonta ou animação muda

---

## Sistema de Exportação

### 8.1 SVG Export

**Fluxo**:
```
1. getMascotSvgString(config)
2. Gera string SVG completa
3. Cria Blob: new Blob([svgString], { type: "image/svg+xml" })
4. Cria URL: URL.createObjectURL(blob)
5. Trigger download: <a href={url} download="file.svg">
6. Cleanup: URL.revokeObjectURL(url)
```

**Código**:
```tsx
const svgString = getMascotSvgString(config);
const blob = new Blob([svgString], { type: "image/svg+xml" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = `adapta-${Date.now()}.svg`;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
```

---

### 8.2 PNG Export

**Fluxo**:
```
1. getMascotSvgString(config)
2. Cria Canvas (1024x1024)
3. Cria Image element
4. Converte SVG para blob URL
5. Carrega image.src = svgBlobUrl
6. Aguarda onload
7. Desenha no canvas: ctx.drawImage(img, 0, 0, 1024, 1024)
8. Converte canvas para blob: canvas.toBlob()
9. Download blob
10. Cleanup URLs
```

**Código**:
```tsx
const svgString = getMascotSvgString(config);
const canvas = document.createElement("canvas");
canvas.width = 1024;
canvas.height = 1024;
const ctx = canvas.getContext("2d");

const img = new Image();
const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
const url = URL.createObjectURL(svgBlob);

img.onload = () => {
  ctx.drawImage(img, 0, 0, 1024, 1024);
  
  canvas.toBlob((blob) => {
    const pngUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = `adapta-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
    URL.revokeObjectURL(pngUrl);
  }, "image/png");
};

img.src = url;
```

**Resolução**:
- Default: 1024x1024px
- Pode ser customizado alterando `canvas.width/height`
- Trade-off: maior = melhor qualidade mas mais lento

---

### 8.3 Copy to Clipboard

**API Moderna**:
```tsx
await navigator.clipboard.writeText(svgString);
```

**Fallback (navegadores antigos)**:
```tsx
const textarea = document.createElement("textarea");
textarea.value = svgString;
textarea.style.position = "fixed";
textarea.style.opacity = "0";
document.body.appendChild(textarea);
textarea.select();
document.execCommand("copy");
document.body.removeChild(textarea);
```

---

## Fluxo de Dados

### 9.1 Estado Global

```
useHistory<MascotConfig>
    ↓
  history.state (MascotConfig atual)
    ↓
  [past[], present, future[]]
```

### 9.2 Fluxo de Atualização

```
User Action (ex: clique em novo corpo)
    ↓
  onChange handler
    ↓
  setConfig({ ...config, bodyId: newId })
    ↓
  history.push(newConfig)
    ↓
  [Estado atualizado]
    ↓
  setAnimKey(k => k + 1) [força re-render]
    ↓
  React re-renderiza <MascotSVG key={animKey} />
    ↓
  Nova renderização visual
```

### 9.3 Fluxo de Callback

```
[Widget Interno]
  onChange local
    ↓
  history.push()
    ↓
  if (props.onChange) props.onChange(config)
    ↓
[Aplicação Host]
  Recebe config atualizado
  Pode salvar, logar, etc.
```

---

## Integrações Externas

### 10.1 Motion (Framer Motion)

**Uso**:
```tsx
import { motion, AnimatePresence } from "motion/react";

<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0, opacity: 0 }}
  transition={{ type: "spring", stiffness: 260, damping: 20 }}
>
  ...
</motion.div>
```

**Aplicações no ADAPTA**:
- FAB button appearance/disappearance
- Sidebar slide-in/out
- Maximized fade-in/out
- Mascot preview transitions
- Backdrop fade

---

### 10.2 Sonner (Toast Notifications)

**Setup**:
```tsx
import { Toaster, toast } from "sonner";

// No root da app
<Toaster position="bottom-center" />

// Usar em qualquer lugar
toast.success("Mascote randomizado!");
toast.error("Erro ao exportar");
toast.info("Gerando GIF...");
```

**Tipos de Toast**:
- `toast.success()` - Verde com ✓
- `toast.error()` - Vermelho com ✗
- `toast.info()` - Azul com ℹ
- `toast.warning()` - Amarelo com ⚠
- `toast.promise()` - Para operações assíncronas

---

### 10.3 Lucide React (Ícones)

**Importação**:
```tsx
import { Download, Copy, Check, Image, X, Minimize2, Maximize2, PanelRightOpen } from "lucide-react";
```

**Uso**:
```tsx
<Download size={14} />
<Copy size={16} className="text-[#666]" />
```

**Customização**:
- `size`: Tamanho em pixels
- `className`: Classes Tailwind
- `strokeWidth`: Espessura do traço (default: 2)
- `color`: Cor direta (evitar, usar className)

---

## Pontos de Extensão

### 11.1 Adicionar Novo Asset

**Body Shape**:
```tsx
// Em body-shapes.ts
{
  id: "minha-forma",
  name: "Minha Forma",
  viewBox: [0, 0, 200, 200],
  paths: ["M ... Z"], // exportar do Figma
  colors: ["#FF6B6B"],
}
```

**Eye Set**:
```tsx
// Em eye-sets.ts
{
  id: "meus-olhos",
  name: "Meus Olhos",
  paths: [
    "M 70 80 ...", // olho esquerdo
    "M 130 80 ...", // olho direito
  ],
  colors: ["#333", "#333"],
}
```

**Mouth**:
```tsx
// Em mouth-sets.ts
{
  id: "minha-boca",
  name: "Minha Boca",
  paths: ["M 70 120 Q 100 130, 130 120"],
  colors: ["#333"],
}
```

---

### 11.2 Adicionar Nova Animação

```tsx
// Em AnimationPanel.tsx

// 1. Adicionar ao array ANIMATIONS
{
  id: "shake",
  name: "Tremer",
  icon: "🌪️",
}

// 2. Adicionar case no useAnimationLoop
case "shake":
  setTransforms({
    rotate: Math.random() * 10 - 5, // -5° a +5° aleatório
    scale: 1,
    x: Math.random() * 6 - 3, // -3px a +3px
    y: Math.random() * 6 - 3,
  });
  break;
```

---

### 11.3 Adicionar Novo Controle

**Exemplo: Adicionar controle de escala global**

```tsx
// 1. Adicionar ao MascotConfig
interface MascotConfig {
  // ... existentes
  globalScale?: number; // 0.5 a 2.0
}

// 2. Adicionar ao DEFAULT_CONFIG
export const DEFAULT_CONFIG: MascotConfig = {
  // ... existentes
  globalScale: 1.0,
};

// 3. Adicionar slider no ControlPanel
<RangeSlider
  label="Escala Global"
  value={config.globalScale || 1}
  onChange={(v) => setConfig({ ...config, globalScale: v })}
  min={0.5}
  max={2}
  step={0.1}
/>

// 4. Aplicar no MascotSVG
<svg
  viewBox={...}
  style={{ transform: `scale(${config.globalScale || 1})` }}
>
  ...
</svg>
```

---

### 11.4 Customizar Tema

**Futuro: Suporte a temas**

```tsx
// Props do MascotWidget
theme={{
  primaryColor: "#FF6B6B",
  backgroundColor: "#F5F5F7",
  accentColor: "#4ECDC4",
}}

// Aplicar no componente
<div style={{
  backgroundColor: theme?.backgroundColor || "#FBF5F0",
  '--primary': theme?.primaryColor || "#333",
}}>
  ...
</div>
```

---

## Debugging e Troubleshooting

### 12.1 Console Logs Úteis

```tsx
// Ver config atual
console.log("Config:", history.state);

// Ver histórico completo
console.log("Past:", past, "Future:", future);

// Debugar animação
console.log("Anim transforms:", transforms);

// Verificar assets carregados
console.log("Bodies:", BODY_SHAPES.length);
console.log("Eyes:", EYE_SETS.length);
console.log("Mouths:", MOUTH_SETS.length);
```

---

### 12.2 Problemas Comuns

**Problema**: SVG não renderiza
- **Causa**: Path data inválido ou viewBox incorreta
- **Solução**: Validar paths no https://yqnn.github.io/svg-path-editor/

**Problema**: Animação trava
- **Causa**: requestAnimationFrame não foi cancelado
- **Solução**: Verificar cleanup no useEffect

**Problema**: Export PNG fica em branco
- **Causa**: Canvas drawImage() chamado antes de img.onload
- **Solução**: Garantir que código está dentro do callback onload

**Problema**: Undo/Redo não funciona
- **Causa**: setConfig não está chamando history.push
- **Solução**: Usar wrapper setConfig que faz push automaticamente

**Problema**: Callbacks não são chamados
- **Causa**: Props undefined ou não passadas
- **Solução**: Verificar if (onChange) antes de chamar onChange(...)

---

## Performance

### 13.1 Otimizações Implementadas

**useCallback**:
- Todas as funções de handler são memoizadas
- Evita re-renders desnecessários de componentes filhos

**React.memo** (futuro):
- Seletores podem ser memoizados
- ControlPanel pode ser memoizado se props não mudarem

**requestAnimationFrame**:
- Animações sincronizadas com display refresh
- Mais eficiente que setInterval/setTimeout

**SVG inline**:
- Não requer fetch de imagens externas
- Renderização direta no DOM

---

### 13.2 Métricas Esperadas

**Inicialização**:
- Primeira renderização: ~100-200ms
- FAB animation: <500ms

**Interações**:
- Troca de body/eyes/mouth: <50ms
- Randomize: <100ms
- Undo/Redo: <50ms

**Exportações**:
- SVG: <200ms
- PNG 1024x1024: 500ms-2s (dependendo do browser)
- GIF (futuro): 5-10s (24 frames)

---

## Segurança

### 14.1 Considerações

**XSS**:
- SVG paths são hardcoded (não user input)
- Se adicionar input de usuário, sanitizar com DOMPurify

**CORS**:
- Todos os assets são locais
- Nenhuma chamada externa
- Export usa Blob URLs locais

**Privacidade**:
- Nenhum dado é enviado para servidores externos
- Tudo roda client-side
- Exports são locais (download direto)

---

## Roadmap Futuro

### Features Potenciais

- [ ] Sistema de cores customizáveis
- [ ] Mais formas (30+ bodies)
- [ ] Exportação GIF animado
- [ ] Salvar/carregar presets
- [ ] Galeria de mascotes salvos
- [ ] Compartilhamento via URL (config encoded)
- [ ] Modo dark theme
- [ ] Acessibilidade (ARIA, keyboard nav)
- [ ] PWA (offline support)
- [ ] i18n (internacionalização)

---

## Referências Rápidas

### Comandos Úteis

```bash
# Instalar dependências
pnpm install motion lucide-react sonner

# Importar componente
import { MascotWidget } from "./components";

# Usar widget
<MascotWidget position="bottom-right" size={80} />
```

### Estrutura de Pastas Mínima

```
/src/app/components/
  ├── MascotWidget.tsx      ← PRINCIPAL
  ├── MascotSVG.tsx          ← CORE
  ├── ControlPanel.tsx
  ├── AnimationPanel.tsx
  ├── body-shapes.ts
  ├── eye-sets.ts
  ├── mouth-sets.ts
  ├── useHistory.ts
  └── index.ts               ← API pública
```

### Exports Públicos

```tsx
// API pública em /components/index.ts
export { MascotWidget, MascotBuilder, MascotSVG, getMascotSvgString };
export type { MascotConfig, ViewMode, FabPosition };
export { BODY_SHAPES, EYE_SETS, MOUTH_SETS, ANIMATIONS };
```

---
---
---

# 4. DIAGRAMAS DE FLUXO

## 1. Fluxo de Renderização Completo

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ mode = "widget" | "full"                              │  │
│  └────────────┬─────────────────────────────────────────┘  │
└───────────────┼─────────────────────────────────────────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
┌─────────────┐  ┌──────────────┐
│ MascotWidget│  │MascotBuilder │
└──────┬──────┘  └──────┬───────┘
       │                │
       │                │ (Mesmo core, UI diferente)
       │                │
       └────────┬───────┘
                │
                ▼
    ┌───────────────────────┐
    │  useHistory Hook       │
    │  ┌─────────────────┐  │
    │  │ past: []         │  │
    │  │ present: config  │  │
    │  │ future: []       │  │
    │  └─────────────────┘  │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │    MascotSVG          │
    │  ┌─────────────────┐  │
    │  │ config          │  │
    │  │ anim?           │  │
    │  └────────┬────────┘  │
    │           │            │
    │     ┌─────┴──────┐    │
    │     │            │    │
    │     ▼            ▼    │
    │  Assets     Animation │
    │  Lookup     Transforms│
    │     │            │    │
    │     └──────┬─────┘    │
    │            ▼           │
    │        <svg>           │
    │         ├─ <defs>      │
    │         ├─ <g> Body    │
    │         └─ <g> Face    │
    │            ├─ Eyes     │
    │            └─ Mouth    │
    └────────────────────────┘
```

---

## 2. Fluxo de Interação do Usuário

```
┌──────────────────────────────────────────────────────────────┐
│                    USUÁRIO                                    │
└───────────┬──────────────────────────────────────────────────┘
            │
    ┌───────┴────────┐
    │                │
    ▼                ▼
[Clique]      [Keyboard Shortcut]
    │                │
    ▼                ▼
┌────────────────────────────────────┐
│      Event Handler                 │
│                                    │
│  onClick / onKeyDown               │
└───────────┬────────────────────────┘
            │
    ┌───────┴────────┐
    │                │
    ▼                ▼
[Seletor]      [Ação Global]
(body/eye/     (randomize/
 mouth)         undo/redo)
    │                │
    └────────┬───────┘
             │
             ▼
    ┌────────────────┐
    │  setConfig()   │
    │      ou        │
    │ history.undo() │
    └────────┬───────┘
             │
             ▼
    ┌────────────────┐
    │ history.push() │
    │   (se novo)    │
    └────────┬───────┘
             │
             ▼
    ┌────────────────┐
    │ setAnimKey++   │
    │ (força render) │
    └────────┬───────┘
             │
             ▼
    ┌────────────────┐
    │ onChange()?    │
    │ (callback)     │
    └────────┬───────┘
             │
             ▼
    ┌────────────────┐
    │ React Rerender │
    └────────┬───────┘
             │
             ▼
    ┌────────────────┐
    │ MascotSVG novo │
    │ renderizado    │
    └────────────────┘
```

---

## 3. Fluxo de Undo/Redo

```
┌──────────────────────────────────────────────────────┐
│            HISTÓRICO (useHistory)                     │
│                                                       │
│  ESTADO INICIAL:                                     │
│  ┌────────────────────────────────────────┐         │
│  │ past: []                                │         │
│  │ present: config1                        │         │
│  │ future: []                              │         │
│  └────────────────────────────────────────┘         │
│                                                       │
│  APÓS push(config2):                                 │
│  ┌────────────────────────────────────────┐         │
│  │ past: [config1]                         │         │
│  │ present: config2                        │         │
│  │ future: []                              │         │
│  └────────────────────────────────────────┘         │
│                                                       │
│  APÓS push(config3):                                 │
│  ┌────────────────────────────────────────┐         │
│  │ past: [config1, config2]                │         │
│  │ present: config3                        │         │
│  │ future: []                              │         │
│  └────────────────────────────────────────┘         │
│                                                       │
│  APÓS undo():                                        │
│  ┌────────────────────────────────────────┐         │
│  │ past: [config1]                         │         │
│  │ present: config2                        │ ◄──┐    │
│  │ future: [config3]                       │    │    │
│  └────────────────────────────────────────┘    │    │
│                                              Voltou   │
│  APÓS redo():                                        │
│  ┌────────────────────────────────────────┐         │
│  │ past: [config1, config2]                │         │
│  │ present: config3                        │ ◄──┐    │
│  │ future: []                              │    │    │
│  └────────────────────────────────────────┘    │    │
│                                             Avançou   │
│  APÓS push(config4) [com future não vazio]:          │
│  ┌────────────────────────────────────────┐         │
│  │ past: [config1, config2, config3]       │         │
│  │ present: config4                        │         │
│  │ future: []  ◄────── LIMPO!              │         │
│  └────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────┘
```

---

## 4. Fluxo de Exportação SVG

```
┌──────────────────────────────────────────────────────┐
│  Usuário clica "Download SVG"                        │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │ downloadSvg()  │
         └────────┬───────┘
                  │
                  ▼
     ┌────────────────────────┐
     │ getMascotSvgString()   │
     │  ┌──────────────────┐  │
     │  │ 1. Lookup assets │  │
     │  │ 2. Build string  │  │
     │  │ 3. Add filters   │  │
     │  │ 4. Add paths     │  │
     │  │ 5. Return SVG    │  │
     │  └──────────────────┘  │
     └────────┬───────────────┘
              │
              ▼
         svgString (texto)
              │
              ▼
     ┌────────────────────────┐
     │ new Blob([svgString],  │
     │  {type: "image/svg+xml"│
     │         })             │
     └────────┬───────────────┘
              │
              ▼
         Blob object
              │
              ▼
     ┌────────────────────────┐
     │ URL.createObjectURL()  │
     └────────┬───────────────┘
              │
              ▼
      blob:https://...
              │
              ▼
     ┌────────────────────────┐
     │ <a href={url}          │
     │    download="file.svg">│
     │ .click()               │
     └────────┬───────────────┘
              │
              ▼
     ┌────────────────────────┐
     │ Browser download       │
     └────────┬───────────────┘
              │
              ▼
     ┌────────────────────────┐
     │ URL.revokeObjectURL()  │
     │ (cleanup)              │
     └────────────────────────┘
```

---

## 5. Fluxo de Exportação PNG

```
┌──────────────────────────────────────────────────────┐
│  Usuário clica "Download PNG"                        │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │ downloadPng()  │
         └────────┬───────┘
                  │
                  ▼
     ┌────────────────────────┐
     │ getMascotSvgString()   │
     └────────┬───────────────┘
              │
              ▼
         svgString
              │
              ▼
     ┌────────────────────────┐
     │ Create Canvas          │
     │ canvas.width = 1024    │
     │ canvas.height = 1024   │
     └────────┬───────────────┘
              │
              ▼
     ┌────────────────────────┐
     │ SVG → Blob URL         │
     └────────┬───────────────┘
              │
              ▼
     ┌────────────────────────┐
     │ Create <img>           │
     │ img.src = blobUrl      │
     └────────┬───────────────┘
              │
              ▼
     ┌────────────────────────┐
     │ Aguardar img.onload    │
     └────────┬───────────────┘
              │
              ▼
     ┌────────────────────────┐
     │ ctx.drawImage(img,     │
     │   0, 0, 1024, 1024)    │
     └────────┬───────────────┘
              │
              ▼
     ┌────────────────────────┐
     │ canvas.toBlob(         │
     │   callback,            │
     │   "image/png"          │
     │ )                      │
     └────────┬───────────────┘
              │
              ▼
         PNG Blob
              │
              ▼
     ┌────────────────────────┐
     │ URL.createObjectURL()  │
     └────────┬───────────────┘
              │
              ▼
     ┌────────────────────────┐
     │ Download trigger       │
     └────────┬───────────────┘
              │
              ▼
     ┌────────────────────────┐
     │ Cleanup URLs           │
     └────────────────────────┘
```

---

## 6. Fluxo de Animação

```
┌──────────────────────────────────────────────────────┐
│  Usuário seleciona animação (ex: "bounce")           │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
      ┌───────────────────┐
      │ setSelectedAnim() │
      └────────┬──────────┘
               │
               ▼
   ┌───────────────────────────┐
   │ useAnimationLoop(animId)  │
   │                           │
   │  useEffect(() => {        │
   │    if (!animId) return;   │
   │                           │
   │    let frameId;           │
   │    const start = now();   │
   │                           │
   │    const animate = () => {│
   │      ┌─────────────────┐  │
   │      │ Calc elapsed    │  │
   │      └────────┬────────┘  │
   │               │            │
   │      ┌────────▼────────┐  │
   │      │ Switch(animId)  │  │
   │      │  case "bounce": │  │
   │      │  case "rotate": │  │
   │      │  case "pulse":  │  │
   │      └────────┬────────┘  │
   │               │            │
   │      ┌────────▼────────┐  │
   │      │ Calc transforms │  │
   │      │ (Math.sin/cos)  │  │
   │      └────────┬────────┘  │
   │               │            │
   │      ┌────────▼────────┐  │
   │      │ setTransforms() │  │
   │      └────────┬────────┘  │
   │               │            │
   │      ┌────────▼────────┐  │
   │      │requestAnimation-│  │
   │      │  Frame(animate) │  │
   │      └─────────────────┘  │
   │    };                     │
   │                           │
   │    animate();             │
   │                           │
   │    return () => {         │
   │      cancelAnimationFrame │
   │    };                     │
   │  }, [animId]);            │
   └───────────┬───────────────┘
               │
               ▼
      ┌────────────────┐
      │  transforms    │
      │  {rotate, ...} │
      └────────┬───────┘
               │
               ▼
   ┌───────────────────────┐
   │ <MascotSVG            │
   │   anim={transforms}   │
   │ />                    │
   └───────────┬───────────┘
               │
               ▼
   ┌───────────────────────┐
   │ <g transform=         │
   │   "rotate(...) ..."   │
   │ >                     │
   └───────────┬───────────┘
               │
               ▼
   ┌───────────────────────┐
   │ Animação visual       │
   │ @ 60fps               │
   └───────────────────────┘
```

---

## 7. Lifecycle do Widget

```
┌──────────────────────────────────────────────────────┐
│             MODO MINIMIZADO                           │
│  ┌────────────────────────────────────────┐          │
│  │  FAB Button (80x80px)                  │          │
│  │  position: "bottom-right"              │          │
│  │  z-index: 50                           │          │
│  └────────────────┬───────────────────────┘          │
└───────────────────┼──────────────────────────────────┘
                    │
         User clicks FAB
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│             MODO SIDEBAR                              │
│  ┌────────────────────────────────────────┐          │
│  │ Backdrop (full screen, blur)           │          │
│  │  onClick → minimiza                    │          │
│  └────────────────────────────────────────┘          │
│  ┌────────────────────────────────────────┐          │
│  │ Panel (600px, slide from right)        │          │
│  │  ├─ Header (controls + exports)        │          │
│  │  ├─ Preview (280px)                    │          │
│  │  └─ Controls (scroll)                  │          │
│  └────────────────┬───────────────────────┘          │
└───────────────────┼──────────────────────────────────┘
                    │
      User clicks Maximize button
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│             MODO MAXIMIZADO                           │
│  ┌────────────────────────────────────────┐          │
│  │ Full Screen Layout                     │          │
│  │  ├─ Header (full width)                │          │
│  │  └─ Content (flex horizontal)          │          │
│  │     ├─ Preview (60%, até 600x600px)    │          │
│  │     └─ Controls (40%, 500px)           │          │
│  └────────────────┬───────────────────────┘          │
└───────────────────┼──────────────────────────────────┘
                    │
      User clicks Minimize button
                    │
                    ▼
           Volta para MINIMIZADO
```

---

## 8. Integração com Aplicação Host

```
┌───────────────────────────────────────────────────────┐
│             APLICAÇÃO HOST                             │
│                                                        │
│  import { MascotWidget } from "./components";         │
│                                                        │
│  function App() {                                     │
│    const [mascot, setMascot] = useState(null);       │
│                                                        │
│    return (                                           │
│      <>                                               │
│        {/* Conteúdo da app */}                        │
│        <YourContent />                                │
│                                                        │
│        {/* Widget integrado */}                       │
│        <MascotWidget                                  │
│          position="bottom-right"                      │
│          onChange={(cfg) => {                         │
│            setMascot(cfg);                            │
│            saveToServer(cfg);                         │
│          }}                                           │
│          onExport={(type, data) => {                  │
│            analytics.track('export', {type});         │
│          }}                                           │
│        />                                             │
│      </>                                              │
│    );                                                 │
│  }                                                    │
│                                                        │
└─────────────────┬─────────────────────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
    [onChange]        [onExport]
         │                 │
         │                 │
         ▼                 ▼
┌────────────────┐  ┌──────────────┐
│ Update state   │  │ Track event  │
│ Save to DB     │  │ Log export   │
│ Sync UI        │  │ Show toast   │
└────────────────┘  └──────────────┘
```

---

## 9. Estrutura de Dados - MascotConfig

```
┌─────────────────────────────────────────────────────┐
│              MascotConfig                            │
├─────────────────────────────────────────────────────┤
│                                                      │
│  bodyId: string                                     │
│    ├─ Valores possíveis: "blob", "circulo",        │
│    │   "oval", "quad", etc. (13 opções)            │
│    └─ Lookup em BODY_SHAPES[]                      │
│                                                      │
│  eyeId: string                                      │
│    ├─ Valores possíveis: "redondo2", "kawaii",     │
│    │   "classico", etc. (23 opções)                │
│    └─ Lookup em EYE_SETS[]                         │
│                                                      │
│  mouthId: string                                    │
│    ├─ Valores possíveis: "sorriso", "triste",      │
│    │   "linha", etc. (9 opções)                    │
│    └─ Lookup em MOUTH_SETS[]                       │
│                                                      │
│  faceOffsetY: number                               │
│    ├─ Range: -50 a +50                             │
│    ├─ Default: 0                                   │
│    └─ Controla posição vertical do rosto           │
│                                                      │
│  noiseAmount: number                               │
│    ├─ Range: 0 a 1                                 │
│    ├─ Default: 0.3                                 │
│    └─ Controla opacidade do filtro de ruído        │
│                                                      │
└─────────────────────────────────────────────────────┘

EXEMPLO DE OBJETO:
{
  bodyId: "blob",
  eyeId: "kawaii",
  mouthId: "sorriso",
  faceOffsetY: 5,
  noiseAmount: 0.4
}
```

---

## 10. Lookup de Assets

```
┌──────────────────────────────────────────────────┐
│         BODY_SHAPES Array (13 items)              │
├──────────────────────────────────────────────────┤
│  [                                                │
│    {                                              │
│      id: "blob",                                  │
│      name: "Blob",                                │
│      viewBox: [0, 0, 200, 200],                  │
│      paths: ["M 100 20 Q ..."],                  │
│      colors: ["#FFD93D"]                         │
│    },                                             │
│    {                                              │
│      id: "circulo",                               │
│      name: "Círculo",                             │
│      ...                                          │
│    },                                             │
│    ...                                            │
│  ]                                                │
└────────────────┬─────────────────────────────────┘
                 │
    config.bodyId = "blob"
                 │
                 ▼
   BODY_SHAPES.find(b => b.id === "blob")
                 │
                 ▼
          { id, name, paths, colors, viewBox }
                 │
                 ▼
   paths.map((d, i) => <path d={d} fill={colors[i]} />)
```

---

## 11. Camadas SVG

```
<svg viewBox="0 0 200 200">
  │
  ├─ <defs>
  │   └─ <filter id="noise">
  │       ├─ <feTurbulence>
  │       ├─ <feColorMatrix>
  │       ├─ <feComponentTransfer>
  │       └─ <feBlend>
  │
  ├─ <g> (layer: BODY)
  │   │  filter="url(#noise)"
  │   │  transform="rotate(...) scale(...)"
  │   │
  │   ├─ <path d="..." fill="#color1" />  [Body shape]
  │   └─ <path d="..." fill="#color2" />  [Se multi-color]
  │
  └─ <g> (layer: FACE)
      │  transform="translate(0 {faceOffsetY})"
      │
      ├─ <path d="..." fill="#333" />  [Eye left]
      ├─ <path d="..." fill="#333" />  [Eye right]
      ├─ <path d="..." fill="#fff" />  [Eye detail]
      └─ <path d="..." fill="#333" />  [Mouth]

ORDEM DE RENDERIZAÇÃO (z-index implícito):
1. Filtros (defs)
2. Corpo (com filtro aplicado)
3. Rosto (eyes + mouth, sem filtro)
```

---

## 12. Callbacks Flow

```
┌────────────────────────────────────────────────────┐
│            DENTRO DO WIDGET                         │
│                                                     │
│  User action (ex: troca body)                      │
│       │                                             │
│       ▼                                             │
│  setConfig(newConfig)                              │
│       │                                             │
│       ├─► history.push(newConfig)                  │
│       │                                             │
│       ├─► setAnimKey(k => k + 1)                   │
│       │                                             │
│       └─► if (props.onChange) {                    │
│              props.onChange(newConfig) ────────┐   │
│           }                                     │   │
│                                                 │   │
└─────────────────────────────────────────────────┼──┘
                                                  │
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────────┐
│           APLICAÇÃO HOST                             │
│                                                      │
│  onChange={(config) => {                            │
│    console.log("Config mudou:", config);            │
│    setMascotState(config);                          │
│    localStorage.setItem("mascot", JSON.stringify(config));│
│    fetch("/api/mascot", {                           │
│      method: "POST",                                │
│      body: JSON.stringify(config)                   │
│    });                                              │
│  }}                                                 │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 13. Estado e Memória

```
┌──────────────────────────────────────────────────┐
│        REACT COMPONENT TREE                       │
├──────────────────────────────────────────────────┤
│                                                   │
│  <App>                                           │
│   └─ <MascotWidget>                              │
│       ├─ useHistory() ◄──────────┐              │
│       │   ├─ past: []            │ HEAP         │
│       │   ├─ present: config     │ MEMORY       │
│       │   └─ future: []          │              │
│       │                          │              │
│       ├─ useState(viewMode) ◄────┤              │
│       ├─ useState(animKey) ◄─────┤              │
│       ├─ useState(selectedAnim)◄─┤              │
│       │                          │              │
│       ├─ useAnimationLoop() ◄────┤              │
│       │   └─ requestAnimationFrame ◄─ RAF Queue│
│       │                                         │
│       ├─ <MascotSVG> ◄───────────┐             │
│       │   └─ config, anim        │ VDOM        │
│       │                          │             │
│       └─ <ControlPanel>          │             │
│           └─ callbacks ──────────┘             │
│                                                 │
└─────────────────────────────────────────────────┘

GARBAGE COLLECTION:
- Quando viewMode muda, old DOM é unmounted
- Event listeners são removidos (cleanup)
- requestAnimationFrame cancelado
- Blob URLs revoked após uso
```

---

## 14. Performance Monitoring Points

```
┌─────────────────────────────────────────────────┐
│         PONTOS DE MEDIÇÃO                        │
├─────────────────────────────────────────────────┤
│                                                  │
│  1. Initial Render                              │
│     ⏱️ performance.mark("widget-init")          │
│     ⏱️ performance.measure()                    │
│     Target: < 200ms                             │
│                                                  │
│  2. Config Change                               │
│     ⏱️ console.time("config-update")            │
│     setConfig() → render complete               │
│     ⏱️ console.timeEnd("config-update")         │
│     Target: < 50ms                              │
│                                                  │
│  3. Animation Frame                             │
│     ⏱️ const frameStart = performance.now()     │
│     ... animation calculations ...              │
│     ⏱️ const frameTime = now() - frameStart     │
│     Target: < 16ms (60fps)                      │
│                                                  │
│  4. SVG Export                                  │
│     ⏱️ console.time("svg-export")               │
│     getMascotSvgString() → download             │
│     ⏱️ console.timeEnd("svg-export")            │
│     Target: < 200ms                             │
│                                                  │
│  5. PNG Export                                  │
│     ⏱️ console.time("png-export")               │
│     SVG → Canvas → Blob → download              │
│     ⏱️ console.timeEnd("png-export")            │
│     Target: < 2000ms                            │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 15. Error Handling Flow

```
┌──────────────────────────────────────────────────┐
│         PONTOS DE ERRO POTENCIAIS                 │
└────────────────┬─────────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
[Asset     [Export      [Clipboard
 Lookup]    Error]       Error]
    │            │            │
    │            │            │
    ▼            ▼            ▼
┌────────────────────────────────────┐
│  try {                             │
│    // Operação arriscada            │
│  } catch (error) {                 │
│    console.error(error);           │
│    toast.error("Mensagem amigável");│
│    // Fallback logic                │
│    return defaultValue;            │
│  }                                 │
└────────────────────────────────────┘
    │
    ▼
┌────────────────────────────────────┐
│  USER FEEDBACK                     │
│  ┌──────────────────────────────┐ │
│  │ ❌ Erro ao exportar PNG       │ │
│  │    Tente novamente            │ │
│  └──────────────────────────────┘ │
└────────────────────────────────────┘
```

---

**FIM DA DOCUMENTAÇÃO COMPLETA**

---

**Versão**: 1.0  
**Data**: 2026-03-06  
**Total de Páginas**: ~150+ páginas impressas equivalente  
**Arquivo único para download rápido** ✅
