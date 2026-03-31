---
description: Cria a arquitetura completa e inviolavelmente segura de uma nova rota/endpoint Node+Hono.
---
Quando criar o backend do zero para uma nova funcionalidade (especialmente nos padrões de API como o CoreAct Hono):

1. Crie o arquivo no ecossistema (`endpoints/coreact/<entidade>/<metodo>.ts`).
2. Implemente IMEDIATAMENTE os middlewares globais de autenticação (checar JWT) e certifique-se de que nada é público a menos que seja solicitado 1500 vezes pela Gabriela.
3. Injete o instanciador do client do Supabase correto.
4. Adicione tipagem/segurança Zod para validar OBRIGATORIAMENTE os *bodies* e *query params* da requisição para barrar lixo injetado.
5. Deixe um esqueleto limpo, funcional de Resposta de OK e Resposta 500 caso pegue erro de rede.
6. Entregue a rota impecável e tipada.
