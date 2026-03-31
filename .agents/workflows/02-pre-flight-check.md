---
description: Roda todas as checagens críticas de build e linter antes do código ir para produção (Pre-Flight Check).
---
// turbo-all
Sempre que for solicitado um pre-flight check, execute estes passos:
1. Execute `npm run build` ou `npx vite build` para checar se o build de produção gera arquivos corretamente ou se explode com erros.
2. Execute `npx tsc --noEmit` para validar toda a tipagem do TypeScript.
3. Se algum desses passos falhar, analise os erros e avise a Gabriela imediatamente e aguarde antes de tentar aplicar um commit.
