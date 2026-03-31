---
description: Como criar um git worktree limpo para um hotfix urgente sem perder o contexto atual.
---
Quando a Gabriela pedir para resolver um bug urgente enquanto estiver no meio de outra tarefa, inicie este workflow.

1. Identifique o nome da branch de hotfix desejada (ou pergunte).
2. Peça o nome da pasta onde o worktree será criado (ex: `../hotfix-urgente`).
// turbo
3. Execute `git fetch origin`
// turbo
4. Execute `git worktree add <pasta-destino> <branch>` (ou crie a branch se não existir com `-b`).
5. Lembre a Gabriela que ela deve abrir essa nova pasta em uma nova janela do editor.
