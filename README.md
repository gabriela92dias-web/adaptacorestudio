# ADAPTA CORESTUDIO
        
- Estrutura de Arquivos  
  /src/app/  
  ├── context/  
  │   ├── brand-context.tsx          (estado global de marca e logo)  
  │   └── campaigns-context.tsx      (estado global de campanhas)  
  ├── components/brand-studio/  
  │   ├── layout.tsx                 (layout principal com sidebar + header)  
  │   ├── criar-campanha.tsx         (modal de criação de campanhas)  
  │   ├── logo-view-modes.tsx        (editor de logo – modo sidebar)  
  │   ├── color-controls.tsx         (controles de cor e opacidade)  
  │   ├── sample-logo.tsx            (componente SVG do logo)  
  │   ├── onboarding-tour.tsx        (tutorial interativo)  
  │   ├── info-note.tsx              (componente de notas informativas)  
  │   ├── copy-button.tsx            (botão copiar com feedback)  
  │   ├── criar-material.tsx         (home – grid de materiais)  
  │   ├── documentos-corporativos.tsx (página documentos)  
  │   ├── marketing-comunicacao.tsx   (página marketing)  
  │   ├── produtos-embalagens.tsx     (página produtos)  
  │   ├── comunicacao-visual.tsx      (página comunicação visual)  
  │   ├── saved-campaigns-page.tsx    (lista de campanhas salvas)  
  │   ├── configuracoes.tsx           (configurações da marca)  
  │   ├── routes.ts                  (configuração React Router)  
  │   └── index.ts                   (barrel exports)  
  └── App.tsx                        (entry point com providers)  

  /src/styles/  
  └── theme.css                      (variáveis CSS ColdFlora)  

---

## REGRA SOBERANA DE LAYOUT ADAPTATIVO (APLICAR SEMPRE EM TODA PÁGINA/COMPONENTE)

### Princípio
O conteúdo se ajusta ao espaço disponível. Nunca sobra espaço morto. Nunca há scroll vertical. A aplicação inteira respira com o container.

### Eixos de Variação
- **Largura**: sidebar aberta/fechada, tela menor, painéis lado a lado
- **Altura**: resolução vertical, presença de header/tabs/summaryBar
- **Densidade de dados**: quantidade de itens que o layout precisa exibir

Decisão de nível: **o maior constraint ganha**.

### Nível 0 — Confortável
**Condições**: container ≥500px largura E ≥400px altura E ≤11 itens E ≤9/grupo
- Títulos: `--font-size-3xl`, heading, weight 600
- Subtítulos: `--font-size-base`, visíveis
- Labels: `--font-size-sm` a `--font-size-base`
- KPI values: `--font-size-2xl` a `--font-size-3xl`
- Ícones: 16-20px
- Gaps: `--spacing-3` a `--spacing-4`
- Padding cards: `--spacing-4`
- Badges: texto descritivo completo
- Nav headers: ícone + label
- Elementos secundários: visíveis

### Nível 1 — Compacto
**Condições**: <500px largura OU <400px altura OU >11 itens OU >9/grupo
- Títulos: `--font-size-2xl`
- Subtítulos: `--font-size-xs`, truncar se necessário
- Labels: `--font-size-xs`, abreviar
- KPI values: `--font-size-xl`
- Ícones: 14px
- Gaps: `--spacing-2`
- Padding cards: `--spacing-3`
- Badges: texto reduzido (primeiro nome, sigla)
- Nav headers: ícone + label (font menor)

### Nível 2 — Micro
**Condições**: <400px largura OU <350px altura OU >14 itens OU >14/grupo
- Títulos: `--font-size-xl`
- Subtítulos: **ocultos**
- Labels: `--font-size-2xs` ou ocultos
- KPI values: `--font-size-lg`
- Ícones: 12px
- Gaps: `--spacing-1`
- Padding cards: `--spacing-2`
- Badges: **somente ícone ou iniciais**
- Nav headers: **somente ícone**
- Grids 2col → 1col

### Nível 3 — Reestruturado
**Condições**: <300px largura OU <300px altura OU >20 itens OU >25/grupo
- **Reestruturar completamente** — trocar grid por stack, painéis por tabs/acordeões
- Títulos: `--font-size-lg`
- KPI values: `--font-size-md`
- Gaps: `--spacing-1` ou 0
- Padding: `--spacing-1` a `--spacing-2`
- Badges: dots de cor ou números puros
- Ocultar seções de menor prioridade
- Overflow-x com drag horizontal se necessário (nunca scroll vertical)

### Regras Absolutas (TODOS os Níveis)
1. **Zero espaço morto** — Container flex com `flex: 1` cujos filhos não preenchem → filhos usam `justify-content: center`, `space-evenly` ou `space-between`. JAMAIS flex-start com vazio.
2. **Zero scroll vertical** — `overflow: hidden` em containers principais. Excedeu → reestruturar (tabs, acordeão, ocultar), nunca scroll.
3. **Seções vazias se auto-colapsam** — Sem dados = `display: none`. Nunca "Nenhum item" ocupando espaço.
4. **Nível é do container, não da viewport** — Dois componentes na mesma tela podem ter níveis diferentes.
5. **Transições instantâneas** — Sem animação ao mudar de nível.
6. **Maior constraint ganha** — Dados exigem nível 2 mas espaço permitiria 0 → aplica nível 2.

### Implementação
- Hook `useAdaptiveLevel` em todo layout principal
- Alimentar com `itemCount` e `maxPerGroup` reais
- `ref` aponta para container real do conteúdo
- Cada `.module.css` deve implementar overrides para `.level0` a `.level3`

---

## Paleta ColdFlora — Neutral Core Scale (Monocromático Verde-Sálvia)
Matiz base: ~152.7° | Saturação: ~24.4%
Todas as cores controladas por variáveis CSS em `base.css`.

| Passo | Hex       | HSL (aprox.)         | Classificação     |
|-------|-----------|----------------------|-------------------|
| 0     | #F7F9F2   | 77°, 37%, 96%        | Ultra Claro       |
| 1     | #EBEFE8   | 94°, 18%, 92%        | Ultra Claro       |
| 2     | #DCE4D6   | 94°, 21%, 87%        | Claro             |
| 3     | #C8D5C2   | 101°, 18%, 80%       | Claro             |
| 4     | #B4C5AD   | 103°, 17%, 73%       | Médio-Claro       |
| 5     | #9FB499   | 107°, 15%, 65%       | Médio             |
| 6     | #889B84   | 110°, 10%, 56%       | Médio             |
| 7     | #6F826D   | 114°, 9%, 47%        | Médio-Escuro      |
| 8     | #566958   | 126°, 10%, 38%       | Escuro            |
| 9     | #3D5043   | 139°, 14%, 28%       | Escuro            |
| 10    | #22382E   | 153°, 24%, 18%       | Ultra Escuro      |
| 11    | #14201A   | 153°, 24%, 10%       | Ultra Escuro      |
| 12    | #0A100D   | 153°, 24%, 5%        | Quase Preto       |

Tons intermediários:
| Passo   | Hex       | Uso                             |
|---------|-----------|----------------------------------|
| 10.5    | #1B2C24   | Dark: secondary, accent          |
| bg-dark | #0E1612   | Dark: background (~L=7.5%)       |
| sf-dark | #121B17   | Dark: surface/cards (~L=8.5%)    |
| pp-dark | #151F1B   | Dark: popup (~L=9.5%)            |

## Cores Semânticas Adapta (oficiais)
| Semântica | Hex       | Descrição                        |
|-----------|-----------|----------------------------------|
| Error     | #F48E72   | Salmão/coral                     |
| Warning   | #FFD375   | Dourado quente                   |
| Success   | #D1E8B5   | Verde-sálvia suave (ColdFlora)   |
| Info      | #9EA0ED   | Lavanda/periwinkle               |

Light mode: cores acima como background, foreground escuro para contraste.
Dark mode: tons rebaixados como background, cores acima como foreground/texto.

### Regras de Uso da Paleta
- **Light Mode**: grandes áreas usam steps 0-1. Steps 2-6 em bordas, ícones, badges e hovers. Steps 7-10 para textos e botões primários.
- **Dark Mode**: grandes áreas usam steps 11-12 e tons intermediários. Verde ColdFlora apenas em textos (steps 5-6), bordas finas (step 10), accents (step 9). Nunca em superfícies grandes.
- **Cores semânticas** usam a paleta Adapta oficial.
- Sempre use variáveis CSS — nunca hard-code cores.

### Layout Global
- `AppLayout.contentWrapper` fornece `padding: var(--spacing-6)` em todas as páginas.
- Páginas NÃO devem adicionar padding externo próprio.
- Layouts internos (como CoreActLayout) adicionam seu próprio padding de conteúdo.

- Notas Importantes  
  – Sempre use variáveis CSS para cores (nunca hard‑code)  
  – O tour de onboarding aparece na primeira visita  
  – Sistema Undo/Redo mantém 50 estados

Made with Floot.

# Instructions

For security reasons, the `env.json` file is not pre-populated — you will need to generate or retrieve the values yourself.  

For **JWT secrets**, generate a value with:  

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then paste the generated value into the appropriate field.  

For the **Floot Database**, download your database content as a pg_dump from the cog icon in the database view (right pane -> data -> floot data base -> cog icon on the left of the name), upload it to your own PostgreSQL database, and then fill in the connection string value.  

**Note:** Floot OAuth will not work in self-hosted environments.  

For other external services, retrieve your API keys and fill in the corresponding values.  

Once everything is configured, you can build and start the service with:  

```
npm install -g pnpm
pnpm install
pnpm vite build
pnpm tsx server.ts
```
