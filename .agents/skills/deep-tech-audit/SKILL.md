---
name: deep-tech-audit
description: Executa a auditoria em nível mais extremo, denso e complexo possível do Antigravity. Abrange 10 dimensões completas do desenvolvimento de produto digital: desde a beleza da arquitetura base e segurança de ponta até a psicologia do UX, retenção cognitiva e inteligência generativa.
---

# 🌐 Deep Tech Audit Skill: Operação 360 Graus

Esta skill transforma a IA em um corpo de Curadores Especializados Simultâneos. Ela não aceita testes superficiais. O código e o produto devem agir perfeitamente em simbiose.

Ao ativar esta Skill (ex: "rode o deep-tech-audit no modulo X"), o Antigravity **deve obrigatoriamente** dissecar o módulo usando as seguintes 10 Dimensões de Avaliação:

## 1. 🏗️ Arquitetura e Estrutura de Código
- O código quebra Princípios SOLID (ex: SRP, Open/Closed)?
- Os componentes são 'God Components' (monolíticos) ou altamente granulares e reusáveis?
- Quão desacopladas estão a Lógica de Negócio (Services/Hooks), Gestão de Estado e UI (JSX)?

## 2. 🧠 Inteligência e Engenharia da Solução
- A solução para o problema é banal (força bruta com dezenas de `if/else`) ou elegante (state machines, mapas de estratégia, recursividade lógica)?
- Quão fluida é a engenharia construída para se conectar às APIs de I.A.?
- Existe inteligência no tratamento de falhas extremas (Graceful Degradation)?

## 3. 🔒 Segurança de Dados e Infraestrutura
- Há exposição de variáveis de ambiente/chaves de terceiros (ex: OpenAI, Supabase keys) no Client-side local?
- O payload está suscetível à Injeção (XSS/CSRF) ou ataques de Prompt Injection nas rotas generativas?
- Como está o fluxo de CORS, Autenticação de Header e tratamento de JWTs?

## 4. ⚡ Performance e Ciclo de Vida (Lifecycle)
- A árvore React (ou do framework vigente) suporta Virtual DOM Tearing ou causa repaints não-necessários (falta de `useMemo`/`React.memo`)?
- Análise de latência: a I.A./Bancos de dados trava a UI Thread?
- Como o sistema se comporta sob gargalos de memória (Memory Leaks em hooks não limpados)?

## 5. 🛡️ Resiliência e Type Safety
- O código exige retornos de I.A. perfeitamente formatados usando Validadores de Schema (Zod/Yup)?
- O uso de TypeScript emprega genéricos maduros e tipos estreitados (Narrowing) ou está mascarado com tipos frouxos (`any` ou validações `JSON.parse` arriscadas)?

## 6. 🎨 UI (Interface de Usuário) e Pureza Visual
- A topologia visual respira os Design Systems estabelecidos (ex: Tokens de ColdFlora)?
- O código abusa de CSS utilitário hardcodado gerando acúmulo visual ou gerencia classes encapsuladas (CSS Modules)?
- Radiografia do estilo: Espaçamento matemático, proporção áurea do grid, opacidade dinâmica?

## 7. 🧠 UX (Psicologia e Experiência do Usuário)
- Redução de Atrito: A carga cognitiva para o usuário cumprir a tarefa na tela é zero?
- Microinterações: O sistema sinaliza mudança de estado ativamente (hovers, disable, pulse, focus rings fluidos)?
- Recuperação de Erro: O estado de 'Empty' ou 'Failed' traz o usuário de volta para o *Happy Path* de forma natural?

## 8. 📝 Redação, Microcopy e Tom de Voz
- A nomenclatura dos botões, labels, e toasts reflete senioridade executiva (Clara, persuasiva, orientada à ação - sem jargão inútil de programador)?
- A gramática imposta nos *Prompts* generativos que criam o produto para a tela é incisiva e baseada em contexto empresarial robusto?

## 9. ♿ Acessibilidade Global (A11Y)
- Os componentes customizados (Funis, Pilares de DNA) gerenciam TAB index corretamente (`aria-expanded`, tags semânticas `main`, `section`)?
- Software é visualizável em alto contraste e sem depender cegamente do uso de mouses (Screen Readers)?

## 10. 📈 Escala de Manutenção de Times (DevEx)
- Um desenvolvedor Junior lendo isto amanhã saberá onde modificar sem quebrar toda a estrutura global? O código é auto-documentado por bons sub-nomes de métodos?

---
> **Instrução Final de Execução:** Ao completar a varredura das 10 dimensões, o output do Antigravity **DEVE** mapear pontuações/notas para cada dimensão e fornecer um Documento Formal de Retificação (um plano de guerra sobre o que consertar e como).
