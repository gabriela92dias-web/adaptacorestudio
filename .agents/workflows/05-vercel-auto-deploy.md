---
description: Prepara, cria o commit e dispara o push para a branch Vercel fazer o Deploy (Push para Produção).
---
Quando a Gabriela solicitar mandar algo "para produção" via Vercel, aja com extrema atenção à qualidade:

1. Rode silenciosamente as travas do workflow de "Pre-Flight Check" (build e type check). Se quebrar, PARE e mostre o erro. NUNCA DEPLOYE CÓDIGO QUEBRADO.
// turbo
2. Se o build for verdinho, rode `git add .` ou só os arquivos combinados.
3. Elabore um commit enxuto, formal e em português com `git commit -m "feat/fix: [detalhe do impacto]..."`.
// turbo
4. Rode `git push origin main` (ou a branch de controle).
5. Gere uma mensagem visual/banner super animada indicando que o foguete do deploy Vercel subiu e tudo deu certo!
