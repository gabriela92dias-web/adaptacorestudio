---
description: Menu centralizador de automações da CoreStudio. Disparado quando a usuária usar @processospadrões.
---
Quando a Gabriela mencionar o comando `@processospadrões` na nossa conversa, este workflow deve ser o seu ponto de referência principal:

1. Reconheça imediatamente que ela quer rodar uma automação.
2. Se ela apenas disse `@processospadrões`, mostre o menu rápido das opções disponíveis pra ela escolher pelo número:
   - 1. Worktree Hotfix
   - 2. Pre-Flight Check (Auditoria)
   - 3. Sincronizar Supabase Types
   - 4. Gerar Componente React
   - 5. Vercel Auto-deploy
   - 6. Nuclear Spring Cleaning (Faxina)
   - 7. Hono API Scaffold
   - 8. Varredura de Segurança
   - 9. Gerar Relatório/Changelog
   - 10. Limpeza de Dead Code

3. Se ela usar o comando junto com qual ela quer rodar (por exemplo: `@processospadrões 2` ou `@processospadrões faxina`), **pule a exibição do menu** e vá direto para a execução do workflow do arquivo correspondente dentro da pasta de workflows.
