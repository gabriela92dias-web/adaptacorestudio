---
description: Realiza a limpeza completa (faxina nuclear) removendo dependências quebradas, pastas de compilados e limpando caches.
---
Use este workflow apenas em momentos caóticos de erros "invisíveis" no terminal causados por ghost cache (por exemplo, erros aleatórios do Node ao tentar iniciar).

// turbo-all
1. Encerre qualquer terminal onde o projeto esteja rodando (pode requerer parar scripts manuais).
2. Apague a pasta de dependências: `rm -rf node_modules` (Unix) ou `Remove-Item -Recurse -Force node_modules` (PowerShell/Windows).
3. Apague pastas de artefatos de compilação como `dist`, `.next`, ou `.build`.
4. Exclua localmente o `package-lock.json` ou `pnpm-lock.yaml` SE for estritamente um problema drástico de versionamento (mas pergunte primeiro se não arriscará).
5. Limpe o cache: `npm cache clean --force`
6. Instale de novo gloriosamente: `npm install` ou `pnpm install`
7. Inicie o cenário de dev de volta: `npm run dev` (ou equivalente). Mostre que o ar está puro e livre de fantasmas!
