---
name: Auditoria Real — UX/UI Completa
description: Protocolo completo de auditoria de interface: estimativa inicial, execução página a página, teste prático de todos os botões e elementos clicáveis, e relatório final estruturado com priorização executiva. Ao final, preenche o template wireframe técnico de auditoria.
---

# SKILL: Auditoria Real — UX/UI Completa

## GATILHO

Esta skill é ativada quando a Gabriela usar:
- `>auditoriareal [URL]`
- `/auditoriareal [URL]`
- "audita o site [URL]"
- "faz a auditoria completa do [URL]"

Se a URL não for fornecida, pergunte antes de iniciar qualquer etapa.

---

## O QUE ESTA SKILL FAZ

Executa uma auditoria completa e prática de um site ou sistema web, cobrindo:
1. **Estimativa inicial** — antes de começar, prevê tempo e riscos
2. **Execução navegando pelo site** — rota por rota, tela por tela
3. **Teste de todos os elementos clicáveis** — botões, links, tabs, dropdowns, modais, toggles, FABs, chips, paginação, ícones acionáveis
4. **Diagnóstico por problema** — formato padronizado e acionável
5. **Relatório final** — resumo executivo, padrões quebrados, priorização dos top 10 em cada categoria
6. **Preenchimento do template wireframe técnico** — `arsenal_materiais/template_auditoria_wireframe_tecnico.html`

A auditoria é considerada **incompleta** se qualquer uma dessas etapas estiver ausente.

---

## REGRAS OBRIGATÓRIAS DA SKILL

- **Não parar na primeira camada.** Explorar modais, drawers, dropdowns, estados de loading, estados de erro, estados vazios.
- **Não entregar observações genéricas.** Todo problema deve ser reproduzível, com causa provável e correção recomendada.
- **Não dizer que está bonito ou parece funcional.** Comprovar funcionamento antes de afirmar.
- **Diferenciar claramente:** bug funcional / falha de UX / inconsistência visual / melhoria opcional.
- **Não implementar nada durante a auditoria.** Só diagnóstico e relatório.
- **Se o escopo real for maior que o previsto:** atualizar a estimativa no meio do processo e explicar por quê.

---

## ETAPA 1 — ESTIMATIVA INICIAL (obrigatória antes de começar)

Entregue este bloco antes de qualquer execução:

```
Estimativa inicial
──────────────────
Tempo total previsto: [ex: 2h30]

Etapas previstas:
  - mapeamento das rotas:         [ex: 20 min]
  - revisão visual / layout:      [ex: 40 min]
  - teste de botões e interações: [ex: 45 min]
  - revisão responsiva:           [ex: 20 min]
  - consolidação do relatório:    [ex: 25 min]

Confiança da estimativa: [Alta / Média / Baixa]

Riscos que podem ampliar o prazo:
  - [ex: site com muitos estados condicionais]
  - [ex: modais encadeados]
  - [ex: autenticação bloqueia rotas]

Premissas consideradas:
  - [ex: acesso total sem login necessário]
  - [ex: funcionalidades carregam normalmente]
```

---

## ETAPA 2 — EXECUÇÃO DA AUDITORIA

### O que considerar como "botão" para teste:
- Botões primários e secundários
- Botões de ícone
- Links com aparência de botão
- CTAs
- Tabs
- Toggles
- Chips acionáveis
- Botões flutuantes (FAB)
- Paginação
- Botões dentro de tabelas, cards, formulários, modais e menus

### O que revisar no layout:
- Alinhamento, espaçamento e respiro visual
- Hierarquia entre ações principais, secundárias e destrutivas
- Consistência de tamanho, padding, altura, raio, tipografia e ícones
- Contraste e legibilidade
- Proximidade excessiva entre ações
- Botões espremidos, cortados, desalinhados ou fora da grade
- Excesso de botões competindo na mesma área
- Elementos flutuantes atrapalhando conteúdo ou interação
- Comportamento responsivo em larguras menores
- Estados visuais coerentes com a importância da ação
- Clareza de rótulos: nomes vagos, duplicados ou ambíguos
- Coerência entre posição do botão e expectativa do usuário

### O que revisar sobre Integridade de Brand e Alucinações de IA:
- Identificar distorções graves ou sutis em assets visuais (ex: mascotes com proporções erradas, membros extras, ou formas geométricas inventadas que não existem no `arsenal_materiais`).
- Caçar textos ou placeholders tipicamente alucinados por IA ("Lorem Ipsum", texto em inglês onde deveria ser português, ou jargões fora do tom de voz da marca).
- Checar fidelidade de paleta nas imagens geradas (qualquer cor que fuja do Brand Book original ou SVGs fornecidos).
- Denunciar imediatamente peças gráficas/mockups que pareçam ter violado a Regra Soberana de Fidelidade de Mockup (AESTHETIC_RULES.md).
### O que revisar no funcionamento:
- Clique/tap efetivo
- Navegação correta acionada
- Ação correta sendo disparada
- Ausência de dead click
- Ausência de dupla ação involuntária
- Feedback visual ao clicar
- Estados: hover, focus, active, disabled, loading
- Persistência de estado após ação
- Fechamento e abertura corretos de modal/dropdown/drawer
- Confirmação em ações destrutivas
- Prevenção de clique duplicado em salvar/criar/excluir
- Comportamento com erro, lentidão ou ausência de resposta
- Ordem lógica de tabulação por teclado
- Foco visível
- Área de clique adequada
- Texto do botão compatível com a ação real

---

## FORMATO DE REGISTRO DE CADA PROBLEMA

Use este bloco para cada problema encontrado:

```
──────────────────────────────────────────────
Problema #[número]
──────────────────────────────────────────────
Página / rota:       [/rota ou nome da tela]
Elemento:            [botão, card, dropdown...]
Tipo:                [Bug funcional / Layout / UX / Acessibilidade / Consistência / Melhoria opcional]
Severidade:          [Crítica / Alta / Média / Baixa]
Comportamento atual: [o que acontece hoje]
Comportamento esperado: [o que deveria acontecer]
Impacto para o usuário: [por que isso importa na prática]
Causa provável:      [hipótese técnica ou de produto]
Correção recomendada: [ajuste recomendado]
Prioridade:          [Imediata / Próxima sprint / Melhoria futura]
```

---

## ETAPA 3 — RELATÓRIO FINAL (obrigatório)

### Bloco 1 — Resumo executivo
- Visão geral da qualidade do site
- Nível geral de risco da interface
- Principais fragilidades encontradas
- Impressão sobre maturidade visual e funcional

### Bloco 2 — Controle de tempo
```
Tempo previsto inicialmente: [xx]
Tempo real gasto:            [xx]
Diferença:                   [+/- xx]
Motivo da diferença:         [explicação]
Etapa que consumiu mais tempo: [nome da etapa]
Observações sobre complexidade real: [o que revela sobre o sistema]
```

### Bloco 3 — Diagnóstico por página
Liste os problemas agrupados por rota/tela.

### Bloco 4 — Botões e elementos clicáveis (consolidado)
- Hierarquia de CTAs
- Padronização visual
- Problemas de feedback
- Inconsistência de estados
- Problemas de clique
- Botões redundantes
- Rótulos confusos
- Conflitos entre ações

### Bloco 5 — Padrões quebrados no sistema
Exemplos a verificar:
- Botões com alturas diferentes
- Estilos inconsistentes entre áreas parecidas
- Ações destrutivas sem destaque adequado
- FABs competindo com conteúdo
- Dropdowns e modais com comportamentos divergentes
- Falta de padrão entre telas CRUD e dashboard

### Bloco 6 — Priorização executiva
Entregue em formato de lista:

**Top 10 — problemas mais graves**
**Top 10 — ajustes de maior impacto visual**
**Top 10 — ajustes de maior impacto funcional**

Sequência de correção:
- **Imediato (agora):** [lista]
- **Próxima sprint:** [lista]
- **Melhoria futura:** [lista]

### Bloco 7 — Conclusão final
- Avaliação geral do site
- Pronto ou não para uso confiável? Por quê?
- O que impede essa confiança hoje
- Sequência ideal de correções

---

## ETAPA 4 — PREENCHIMENTO DO TEMPLATE

Ao concluir o relatório, preencha o arquivo:
```
arsenal_materiais/template_auditoria_wireframe_tecnico.html
```

Este arquivo é um template HTML interativo com versionamento local. Ele deve ser **aberto no navegador** para preenchimento, ou preenchido programaticamente via JavaScript se o agente tiver acesso direto.

**Campos que devem ser preenchidos com os dados da auditoria:**
- `siteName` — nome do site/módulo
- `siteUrl` — URL auditada
- `auditOwner` — responsável (padrão: "Antigravity / Gabriela")
- `auditDate` — data da auditoria (hoje)
- `scopeType` — tipo de escopo
- `versionName` — nome da versão (ex: "Auditoria Geral v01")
- `timeTotal` — tempo total previsto
- `timeConfidence` — confiança da estimativa
- `timeComplexity` — complexidade esperada
- `timeBreakdown` — quebra por etapas
- `timeRisks` — riscos e premissas
- `routesMap` — mapeamento de rotas e telas
- `generalQuality` — qualidade geral da interface
- `generalRisk` — nível geral de risco
- `buttonSummary` — diagnóstico consolidado de botões
- `buttonPriority` — correções prioritárias de botões
- `brokenPatterns` — padrões quebrados
- `topCritical` — 10 problemas mais graves
- `topVisual` — 10 ajustes de maior impacto visual
- `topFunctional` — 10 ajustes de maior impacto funcional
- `roadmapFixes` — sequência ideal de correção
- `realPredicted` — tempo previsto
- `realSpent` — tempo real gasto
- `realDifference` — diferença
- `realReason` — motivo da diferença
- `realComplexity` — observações sobre complexidade real
- `finalConclusion` — conclusão final

**Para cada problema encontrado**, adicionar uma entrada em `problemsContainer` com:
- `page`, `element`, `type`, `severity`, `current`, `expected`, `impact`, `cause`, `fix`, `priority`

**Como preencher:**
O agente deve gerar um script JavaScript inline ou instrução de preenchimento que pré-popule os campos do template com os dados da auditoria. Alternativamente, apresentar o relatório de forma que a Gabriela possa copiar e colar nos campos do template com facilidade.

---

## CRITÉRIO DE QUALIDADE

A auditoria só está completa se:
- [x] Estimativa inicial foi entregue antes da execução
- [x] Todas as rotas principais foram percorridas
- [x] Todos os botões e elementos clicáveis foram testados
- [x] Cada problema tem: tipo, severidade, causa provável e correção recomendada
- [x] Relatório final tem os 7 blocos obrigatórios
- [x] Template wireframe técnico foi preenchido ou instruções de preenchimento foram fornecidas

---

## REFERÊNCIAS DE SKILL

Esta skill combina:
1. **Nielsen's 10 Heuristics** — base para classificação de problemas de UX
2. **WCAG 2.1 AA** — referência para itens de acessibilidade e contraste
3. **Google Material Design — Interaction States** — referência para estados de botão
4. **Brad Frost — Atomic Design** — referência para consistência de componentes
5. **Protocolo Literal First (SKILL: interpretacao_de_comandos)** — auditoria não implementa nada, só diagnóstica
