---
description: Faz uma varredura rigorosa em busca de chaves expostas e URLs abertas antes de um commit ou encerramento do dia.
---
Uma verificação de "sanity check" contra vazamentos que poderiam causar danos.

1. Identifique quais foram as modificações pendentes no git rodando `git diff` ou inspecionando o projeto com `grep_search`.
2. Analise se há URLs confidenciais de banco de dados (`postgresql://...`) esquecidas em formato de string.
3. Analise se há chaves gigantescas (ex: que começam com `eyJ` padrão JWT ou tokens de Service Role Supabase) colocadas no código limpo ao invés de estarem nos arquivos `.env`.
4. Confira as rotas vitais (se há alguma desprotegida da checagem de Token) – não confie no programador!
5. Entregue um diagnóstico: "Seguro. Nenhuma chave exposta detectada." ou solte um alerta vermelho se achar algo.
