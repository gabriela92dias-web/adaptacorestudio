---
name: Ensaio de Versão (Static UI Snapshot) — Pré-Frontend
description: Gera snapshots estáticos (HTML único) independentes para validar arquitetura, fluxo e textos antes do frontend real. Suporta Wireframes, Text-Complete e Projeção de Front.
---

# ATUALIZAÇÃO DE REGRA — ENSAIO DE VERSÃO (Static UI Snapshot) — PRÉ-FRONTEND

**OBJETIVO GERAL**
Gerar snapshots estáticos (1 arquivo HTML) independentes e editáveis, para validar arquitetura, fluxo e conteúdo textual final antes do frontend real — com governança de versão e timelapse perfeito.

**GATILHOS**
Execute SOMENTE quando o usuário digitar exatamente:
- "ensaio de versão"
- "gera um ensaio"
- "snapshot visual"
- "subir para pré-frontend"
- "projeção de front"
- "subir para front"

---

### ESTÁGIOS (LIFECYCLE) — AGORA COM PRÉ-FRONTEND

**Estágio 1 — Wireframe Inteligente (Padrão)**
- Monocromático e funcional
- Lógica simulada (state + cenários + regras)
- Conteúdos editáveis (rascunho) permitidos

**Estágio 2 — Arquitetura Final Pré-Frontend (Text-Complete)**
Objetivo: validar e fechar TODOS os textos finais (copy) com microajustes, sem mudar layout.
- 2A: “Pacote de Textos Finais (Copy Registry)”
- 2B: “Brief de Design/Estética Final (Front Brief)” — apenas documentação, sem aplicar estética

**Estágio 3 — Projeção de Front (somente sob comando explícito)**
- Aplicar estética/UX final com base no Front Brief aprovado
- Só acontece quando o usuário digitar exatamente: “projeção de front” ou “subir para front”

**COMO O ESTÁGIO É ESCOLHIDO**
- Se o usuário não pedir estágio: sempre gerar **Estágio 1**.
- Se pedir “pré-frontend”, “arquitetura pré-frontend” ou “text-complete”: gerar **Estágio 2**.
- Estágio 3 só com “projeção de front” / “subir para front”.

---

### REGRA MESTRA — LAYOUT LOCKED (TIMELAPSE PERFEITO)
A partir da v001, layout e CSS base são **CONTRATO**.
- Não alterar grid, hierarquia de blocos, componentes base, espaçamentos e estilo estrutural entre versões.
- Entre versões, pode apenas:
  1. Editar textos contenteditable.
  2. Adicionar/ajustar cenários (mock data).
  3. Adicionar/ajustar regras do validador (SE→ENTÃO).
  4. Ligar/desligar componentes pré-declarados via flags.
- Qualquer mudança visual/estrutural só é permitida se for **EVOLUÇÃO PRÉ-MAPEADA**:
  - Registrar antes no EVOLUTION_MAP: versão alvo + o que muda + por quê.
  - Só então executar na versão indicada.

---

### ESTÁGIO 2 (PRÉ-FRONTEND) — REGRAS DETALHADAS

**2A — COPY REGISTRY (PACOTE DE TEXTOS FINAIS)**
- Seção fixa “COPY REGISTRY” (Obrigatório no Estágio 2; Opcional no 1).
- Lista de textos da UI editáveis com IDs estáveis (`data-copy="copy_key"`).
- Sincronização registry ↔ UI.
- Botão “Exportar Copy JSON” (gera JSON no HTML copiável).
- Status por item (rascunho / final / aprovado).
- Regra OK de Texto: Estágio 2 só "Text-Complete" se itens críticos=final.

**2B — FRONT BRIEF (DESIGN/ESTÉTICA FINAL)**
- Seção fixa “FRONT BRIEF” (Obrigatório no Estágio 2).
- Campos editáveis para registrar:
  - Direção visual
  - Regras de componentes
  - Tokens/variáveis (apenas listados, não aplicados no CSS do ensaio)
  - Regras hierarquia/densidade
  - Acessibilidade e Não-fazer
- Regra de Aprovação: Estágio 2 só aprovado se Front Brief = OK.
- *NÃO aplicar estética no Estágio 2. É apenas documentação!*

---

### ESTRUTURA FIXA DO ARQUIVO (SEMPRE PRESENTE)
O HTML deve conter no mínimo:
1. Header de Metadados (editável)
2. Seletor de Cenários (≥ 3)
3. Painel de Estado (JSON store)
4. UI principal (wireframe editável, linked ao Copy Registry via `data-copy` no Estágio 2)
5. Console de Eventos (log)
6. Validador (readiness + blockers)
7. EVOLUTION_MAP (editável)
8. COPY REGISTRY
9. FRONT BRIEF

**METADADOS OBRIGATÓRIOS:** Contexto, Escopo, Versão, Data/Hora, Origem, Estágio, O que mudou, O que testar, Limitações assumidas, Layout Signature (LOCKED-vX), Dependências externas (Padrão: “nenhuma”). Somente via CDN se essencial, declarado e com fallback offline.

### OUTPUT OBRIGATÓRIO (RESTRIÇÃO FINAL)
- 1 único HTML (HTML+CSS+JS Vanilla) offline-first.
- Em `arsenal_materiais/ensaios/` como `[Contexto]__[Escopo]__vNNN.html`.
- **NA RESPOSTA DO CHAT:** Entregar *somente* o caminho salvo (sem explicações longas).
