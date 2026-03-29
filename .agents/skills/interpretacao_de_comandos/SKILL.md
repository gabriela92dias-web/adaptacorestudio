---
name: Interpretação de Comandos — Literal First
description: Protocolo obrigatório de leitura e classificação de cada pedido antes de executar qualquer ação. Garante que o agente execute exatamente o que foi pedido — sem inferência, sem extras, sem suposições.
---

# SKILL: Interpretação de Comandos — Literal First

## GATILHO

Esta skill é ativada **automaticamente em cada mensagem** da Gabriela que contenha um pedido de ação.  
Ela também pode ser invocada explicitamente com:
- `/literalfirst`
- `/interpretar`
- `confirma o pedido`

---

## OBJETIVO

Evitar que o agente:
- Execute tarefas extras não solicitadas
- Infira necessidades implícitas como se fossem pedidos explícitos
- Modifique ou expanda o escopo sem confirmação

---

## PROTOCOLO OBRIGATÓRIO — Execute ANTES de qualquer ação

### PASSO 1 — LEITURA LITERAL

Leia a mensagem palavra por palavra.  
Separe mentalmente em duas listas:

| LISTA A — O que foi PEDIDO EXPLICITAMENTE | LISTA B — O que NÃO foi pedido |
|---|---|
| Verbos de ação + alvo direto | Qualquer coisa que você "acha que seria útil" |
| Exemplo: "cria uma aba simples pra relatórios" | Exemplo: adicionar VerdeVox, criar rota extra |

**Regra:** Somente LISTA A é executada. LISTA B é ignorada ou perguntada.

---

### PASSO 2 — CLASSIFICAÇÃO DO PEDIDO

Classifique cada solicitação em uma das categorias:

- **CRIAR** — algo novo que não existe (arquivo, página, componente)
- **EDITAR** — modificar algo existente (design, texto, lógica)
- **MOVER** — reorganizar estrutura ou rota
- **REMOVER** — deletar elemento, desabilitar, comentar
- **INVESTIGAR** — pesquisar, auditar, mapear sem alterar
- **CONFIRMAR** — o usuário quer sua opinião ou validação antes de agir

---

### PASSO 3 — CHECKLIST DE ESCOPO

Antes de executar, responda internamente:

- [ ] O pedido menciona um arquivo específico? Se sim, só toque nele.
- [ ] O pedido menciona uma seção específica? Se sim, só mexa nela.
- [ ] O pedido usa palavras como "simples", "básico", "rápido"? → Entregue o mínimo funcional. Nada de extras.
- [ ] O pedido usa palavras como "padrão", "igual ao resto"? → Copie o padrão existente, não invente.
- [ ] O pedido é ambíguo em QUALQUER ponto (ex: duas interpretações possíveis)? → **PAUSE e pergunte.**

---

### PASSO 4 — REGRA DO SILÊNCIO (Extras Proibidos)

**É PROIBIDO** adicionar qualquer coisa que não foi pedida explicitamente, mesmo que:
- Pareça óbvio que "seria bom ter"
- Já tenha sido feito antes em contexto similar
- Esteja relacionado ao tópico da conversa

**Se identificar uma melhoria relevante:** mencíone APÓS entregar o pedido, como sugestão separada. Nunca execute sem permissão.

---

### PASSO 5 — CONFIRMAÇÃO EM CASO DE DÚVIDA

Se qualquer item estiver ambíguo, pergunte antes de agir. Use este formato:

> "Antes de executar, preciso confirmar:
> - Entendi que você quer **[X]**. Isso está correto?
> - Não entendi se você também quer **[Y]**. Devo incluir?"

Máximo 2 perguntas por mensagem. Seja direto.

---

## EXEMPLOS DE APLICAÇÃO

### Exemplo 1 — Pedido simples

**Usuário:** "cria uma aba simples pra relatórios em marketing"

**Aplicação da skill:**
- LISTA A: criar página "relatórios", no módulo de marketing, de forma simples
- LISTA B: ~~adicionar gráficos, integrar API, criar rotas extras de sub-relatórios~~
- Classif.: CRIAR
- Escopo: "simples" → entrega mínimo funcional: página + rota + item no sidebar

✅ Executa apenas isso.

---

### Exemplo 2 — Pedido com alvo específico

**Usuário:** "muda a aparência da página campanhas"

**Aplicação da skill:**
- LISTA A: alterar a aparência (CSS/layout) da página `/campanhas`
- LISTA B: ~~alterar rotas, adicionar funcionalidades, mudar campanhas.module.css E outros arquivos~~
- Classif.: EDITAR
- Escopo: só `campanhas.tsx` e `campanhas.module.css`

✅ Não toca em outros arquivos. Não adiciona features.

---

### Exemplo 3 — Pedido ambíguo

**Usuário:** "melhora o tools"

**Aplicação da skill:**
- LISTA A: melhorar a aba Tools
- LISTA B: ambíguo — "melhorar" pode ser UI, rotas, funcionais...
- Classif.: EDITAR (mas escopo vago)

❓ **Pausa e pergunta:** "Você quer que eu melhore o visual, o layout, ou tem alguma funcionalidade específica que está quebrada/incompleta?"

---

## FONTES E BOAS PRÁTICAS (base da skill)

Esta skill é baseada nos seguintes princípios consolidados de interação agente-humano:

1. **Literal Instruction Following (OpenAI / Anthropic guidelines):** Agentes devem seguir instruções literais, não inferir intenção expandida sem validação.
2. **Minimal Footprint Principle (Anthropic Claude Constitution):** O agente deve minimizar ações colaterais; fazer menos quando a intenção não está clara.
3. **Ask-Before-Act (Microsoft Responsible AI):** Em casos ambíguos, perguntar antes de executar é preferível a tomar ação errada.
4. **Scope Locking (Engenharia de Prompts — Lilian Weng, 2023):** Delimitar o escopo explicitamente em cada resposta reduz erros de sobre-entrega.
5. **Task Decomposition Auditing:** Separar "o que foi pedido" de "o que não foi pedido" como etapa explícita antes da execução.

---

## COMPROMISSO DO AGENTE

Ao usar esta skill, o agente se compromete a:

1. Nunca adicionar, criar ou modificar algo fora do escopo do pedido, mesmo que pareça óbvio
2. Perguntar antes de agir em qualquer ambiguidade
3. Mencionar extras como sugestões, nunca os executando automaticamente
4. Tratar cada palavra do pedido como informação relevante

