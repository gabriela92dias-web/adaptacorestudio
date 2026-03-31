---
name: Quem Pode o Quê (@quempodeoque)
description: Mapa completo de permissões, papéis, isolamento de dados e segurança do CoreStudio. Consulte antes de implementar qualquer feature que envolva quem vê o quê.
---

# 🔐 Governança de Acesso — CoreStudio / CoreAct

Esta skill contém o mapeamento completo do modelo de permissões e segurança do CoreStudio.
Consulte este documento **antes de implementar qualquer feature** que envolva acesso a dados, papéis de usuário ou visibilidade de informações.

---

## 🏗️ Arquitetura de Identidade

O CoreStudio usa **dois sistemas de identidade em paralelo**:

| Sistema | Onde vive | Para quê |
|---------|-----------|---------|
| **Supabase Auth** (`auth.users`) | Supabase | Login, JWT, sessão |
| **TeamMembers** (`teamMembers`) | Banco do app | Perfil operacional, nome, cargo, equipe |
| **Users** (legado) | Banco do app | Tabela antiga com `role: admin/user` |

> ⚠️ **Gap atual:** O `TeamMember` e o `auth.users` não estão explicitamente vinculados no banco. A conexão está no campo `teamMembers.userId` (número inteiro que aponta para a tabela `users`), mas `users` não tem FK direto com `auth.users` do Supabase.

---

## 👥 Papéis de Usuário (Roles)

### 1. Papel Global (`users.role`)
Definido na tabela `users`. Pouco usado atualmente.

| Valor | Significado Atual |
|-------|-----------------|
| `admin` | Acesso irrestrito (não aplicado via middleware, ainda) |
| `user` | Papel padrão |

### 2. Papel por Setor (`sectorMembers.role`)
Definido na tabela `sectorMembers`. É o papel operacional real do CoreAct.

| Valor | Significado |
|-------|-------------|
| `responsavel` | Gestor do setor. Acesso total ao módulo CoreAct (conforme `usePermissions`). |
| `agente` | Membro operacional. Acesso controlado por `permissions` JSON. |

> **Regra atual (linha 52-53 de `usePermissions.tsx`):**
> Se o usuário for `responsavel` em **qualquer** setor → acesso total ao CoreAct.
> Se for `agente` → acesso controlado pelo campo `sectorMembers.permissions` (JSON).

---

## 🗝️ Permissões de Frontend (`PERMISSION_KEYS`)

Definidas em `helpers/usePermissions.tsx`. Controlam **visibilidade de rotas e componentes**.

### Módulos (acesso ao aplicativo)
| Chave | Módulo |
|-------|--------|
| `moduleCoreact` | CoreAct |
| `moduleBrand` | Brand Studio |
| `moduleMarketing` | Marketing |
| `moduleTools` | Ferramentas |

### CoreAct (acesso por sub-módulo)
| Chave | Tela/Recurso |
|-------|-------------|
| `coreactIniciativas` | `/coreact/iniciativas` |
| `coreactProjetos` | `/coreact/projetos` |
| `coreactEtapas` | `/coreact/etapas` |
| `coreactTarefas` | `/coreact/tarefas` |
| `coreactAcoes` | `/coreact/acoes` |
| `coreactCronograma` | `/coreact/cronograma` |
| `coreactVisaoDiaria` | Visão Diária (agenda) |
| `coreactExecucoes` | Execuções de tarefas |
| `coreactOrcamento` | `/coreact/orcamento` |
| `coreactTime` | `/coreact/time` |
| `coreactSetores` | `/coreact/setores` |

> ⚠️ **Status atual:** `hasPermission()` retorna `true` para todos (linha 76 de `usePermissions.tsx`). As permissões estão MOCKADAS. Ninguém está bloqueado no frontend ainda.

---

## 🔒 Segurança de Backend (API)

### Middleware Global de Autenticação
**Arquivo:** `server.ts` (linhas 14–34)

Todas as rotas `_api/coreact/*` exigem token JWT válido via header `Authorization: Bearer <token>`.
Se inválido → `401 Unauthorized`.

```
✅ IMPLEMENTADO — Fase 2 do plano de segurança concluída.
```

### Isolamento de Dados (Multi-tenancy)
**Status: ❌ NÃO IMPLEMENTADO**

Atualmente **todos os usuários autenticados veem todos os dados** do banco.
Não existe filtro por `sectorId`, `teamId` ou `userId` nos endpoints de listagem.

**O que precisa ser decidido antes de implementar:**

> **Pergunta aberta para Gabriela:** Os dados do CoreAct são compartilhados por toda a organização Adapta (modelo colaborativo), ou cada setor/usuário deve ver apenas seus próprios dados (modelo isolado/multi-tenant)?

**Modelo A — Colaborativo (atual de fato):**
- Toda a equipe vê tudo
- Ideal para times pequenos e operação centralizada
- Risco: dados de um projeto vazam para membros de outros setores

**Modelo B — Isolado por Setor:**
- Cada `sectorMember` só vê iniciativas/projetos/tarefas do seu `sectorId`
- Requer filtros em todos os `list_GET.ts` + ativação de RLS no Supabase
- Campo de ancoragem: `initiatives.sectorId` → `projects.initiativeId` → `tasks.projectId`

---

## 📋 Pendências de Segurança (Backlog Pós-Demo)

### Fase 3 — Validação de Input (Esforço Médio)
- **Problema:** 50+ endpoints usam `superjson.parse(await request.text())` sem validação Zod antes do `.schema.parse()`
- **Risco:** Dados malformados quebram o servidor silenciosamente (erro 500)
- **Solução:** Envolver o `superjson.parse()` em `try/catch` com fallback Zod explícito
- **Prioridade:** Alta (antes de exposição pública)

### Fase 3b — RLS no Supabase (Esforço Alto)
- **Problema:** Banco sem Row-Level Security ativado
- **Risco:** Qualquer usuário autenticado com o token pode acessar qualquer dado via API do Supabase diretamente
- **Solução:** Ativar RLS no painel Supabase + criar políticas por `user_id` ou `sector_id`
- **Prioridade:** Crítica se a plataforma for acessada por múltiplos clientes / setores independentes
- **Bloqueio:** Aguarda decisão do Modelo A vs B acima

### Fase 4 — Refatoração `dataUtils.ts` (Esforço Baixo)
- **Problema:** Funções de transformação de dados (ex: `toCamel`, `camelizeKeys`) duplicadas em múltiplos endpoints
- **Solução:** Centralizar em `helpers/dataUtils.ts` (arquivo já existe mas está vazio)
- **Prioridade:** Baixa (qualidade de código, não segurança)

---

## 🗺️ Mapa de Entidades e Acesso

```
Setor (Sectors)
  └─ SectorMembers [role: responsavel | agente] [permissions: JSON]
       └─ TeamMember (quem opera)
            └─ User (conta de login)

Setor
  └─ Iniciativa (sectorId)
       └─ Projeto (initiativeId)
            ├─ Tarefa (projectId)
            │    ├─ TaskAction (taskId) — ações/checklists
            │    ├─ TaskParticipant (taskId) — quem participa
            │    └─ TaskDependency (taskId) — dependências
            ├─ Orçamento (projectId)
            └─ Etapa/Stage (projectId)
```

---

## ✅ O Que Está Feito

| Item | Status |
|------|--------|
| Credenciais em variáveis de ambiente | ✅ Concluído |
| Middleware JWT global (`_api/coreact/*`) | ✅ Concluído |
| Permissões de frontend (rotas visíveis) | ⚠️ Mockadas (todo mundo vê tudo) |
| Validação de input com Zod nos endpoints | ❌ Pendente |
| Isolamento por setor/tenant | ❌ Pendente (aguarda decisão de modelo) |
| RLS no Supabase | ❌ Pendente |
