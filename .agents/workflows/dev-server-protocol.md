---
description: Coordenação Estrita de Portas e Infraestrutura de Servidor
---
# Protocolo de Inicialização e Deploy Local (Dev Server)

## ⛔ REGRA DE OURO (NÃO ULTRAPASSAR)
- **NENHUM AGENTE OU ASSISTENTE** tem permissão para alterar, sugerir alteração, ou re-escrever a porta de desenvolvimento (`port` e `strictPort` no `vite.config.ts`), a não ser que a usuária explicitamente envie um prompt dizendo: `MUDAR PORTA DE INFRAESTRUTURA PARA [NOVA PORTA]`.
- O Frontend é fixo em **5555**.
- O Proxy do Backend é obrigatoriamente **3334**.

## 1. Verificação Automática do Ambiente
Antes de rodar qualquer comando de `dev` ou analisar problemas de White Screen / ECONNREFUSED, o assistente DEVE:
1. Ler o conteúdo de `vite.config.ts`.
2. Assegurar-se de que a configuração `strictPort: true` está presente (para evitar ping-pong de portas).
3. Confirmar que a chave `proxy` reflete a porta do servidor Node/API que está rodando.

## 2. Início do Servidor e Gerenciamento do Ciclo de Vida (IMPORTANTE)
- **A usuária não tem familiaridade técnica com os comandos de terminal para iniciar/reiniciar os servidores (`pnpm dev`, bash, bash loops).**
- O assistente DEVE **SEMPRE** puxar para si a total responsabilidade de iniciar, detectar quedas e reiniciar o servidor local via comandos de bash assíncronos em background.
- O assistente **nunca** deve delegar a responsabilidade de "ir ao terminal e digitar `pnpm dev`" à usuária.
// turbo
1. Em caso de *EADDRINUSE*, utilizar apenas ferramentas seguras de bash script (Powershell/TaskManager) isoladas para limpar `5555` antes de realizar o comando `pnpm dev`.
2. Em NENHUMA hipótese o agente deve editar a porta no arquivo para "desviar" do problema de EADDRINUSE. Em vez disso, o agente deve isolar o processo que ocupou a porta, finalizá-lo, e manter a regra arquitetural intacta.

## 3. Comportamento e Retorno
Ao final de qualquer depuração de portas, o agente deve reportar: `[PORTAS ASSEGURADAS PELO PLUGIN DEV-SERVER-PROTOCOL]`, confirmando a aderência a esta regra e repassando o controle para a usuária.
