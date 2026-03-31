# Auditoria CoreStudio - Backlog de Refatoração

| Item | Status Atual | O que foi feito |
| :--- | :--- | :--- |
| **[1/15] Tenant/auth context** | ✅ ENTREGUE | Refatorado para Supabase REST API (Bypass Pooler 6543) |
| **[2/15] Nova Iniciativa abre modal errado** | ✅ ENTREGUE | Criado `CoreActCreateInitiativeDialog.tsx` substituindo placeholder em `QuickActions` |
| **[3/15] /configuracoes skeleton permanente** | ✅ ENTREGUE | (Hoje) Kysely reestabelecido, resolve loop de retry React Query. |
| **[4/15] /cronograma tela preta** | ✅ ENTREGUE | (Hoje) Instalação de Safe Fallbacks e tratamento de arrays vazios. |
| **[5/15] Criar Setor erro de API** | ✅ ENTREGUE | Interceptador global injeta Token na API e garante inserção limpa |
| **[6/15] Criar Tarefa dead click** | ✅ ENTREGUE | `CoreActQuickActions.tsx` corrigido |
| **[7/15] Cards Kanban sem drawer** | ✅ ENTREGUE | `CronogramaKanban.tsx` → `CoreActTaskDetailSheet` |
| **[8/15] Cards Projeto sem drawer** | ✅ ENTREGUE | `coreact.projetos.tsx` → `CoreActProjectDetailSheet` |
| **[9/15] Dropdown dead clicks** | ✅ ENTREGUE | `e.preventDefault()` em todos os MenuItems |
| **[10/15] Checkboxes persistência** | ✅ ENTREGUE | `task-actions/update_POST.ts` → Supabase REST |
| **[11/15] /orcamento timeout** | ✅ ENTREGUE | (Hoje) Adicionado Empty State inteligente e Error Boundaries. |
| **[12/15] Erros brutos no DOM** | ✅ VERIFICADO | Varredura de Type/DOM concluída, hydration warnings mitigados pela injeção global de auth. |
| **[13/15] Badge etapas como seletor** | ✅ ENTREGUE | Status implementado e persistindo dados via useUpdateStage mutate. |
| **[14/15] Nova Etapa handler** | ✅ ENTREGUE | Criado modal `handleCreateStage` e `StageInlineForm` (ProjectStagesSection) ativos. |
| **[15/15] Novo Checklist handler** | ✅ ENTREGUE | Dead click resolvido no `coreact.acoes.tsx` → adicionado Modal Global que despacha `useCreateTaskAction`. |
