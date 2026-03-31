---
description: Sincroniza as definições de tipo do banco de dados na nuvem (Supabase) para o projeto local.
---
Este workflow automatiza a sincronização do banco de dados quando novas tabelas ou colunas são adicionadas e precisamos do TypeScript 100% atualizado.

1. Certifique-se de que a Gabriela já conectou ao projeto no Supabase via CLI (ou pergunte o id do projeto supabase).
// turbo
2. Execute `npx supabase gen types typescript --linked > types/supabase.ts` (ou no caminho apropriado do projeto onde o arquivo DB vive, normalmente src/types ou supabase/).
3. Verifique rapidamente o arquivo modificado e avise a Gabriela que a ponta do banco e do código estão com os tipos 100% amarradinhos e seguros!
