# 🚀 PENDENTE — Próximo Deployment

> Arquivo de rastreamento de mudanças prontas aguardando deploy.
> Atualizado em: 2026-03-30

---

## ✅ Pronto para Deploy

### [BIBLIOTECA] Menu + Filtro por Setor
**Data:** 2026-03-30  
**Arquivos alterados:**
- `components/AppSidebar.tsx` — Biblioteca movida para fora do grupo Marketing, agora é item independente no menu com ícone próprio (BookOpen)
- `pages/marketing-comunicacao.tsx` — Adicionado campo `setor` nos documentos + barra de filtro por setor (Marketing, Comunicação, Financeiro, Administrativo, Jurídico, RH)
- `pages/marketing-comunicacao.module.css` — CSS da barra de setores

**O que muda na UI:**
- Menu lateral: "Biblioteca" aparece como item solto, fora do grupo Marketing
- Página da Biblioteca: filtro de setor no topo, acima dos filtros de categoria

**Risco:** Baixo — sem alterações de DB, sem novos endpoints, só UI.

## 🚀 Status de Deployments Anteriores

### Deployado em 10/04/2026

**[CAMPANHAS] Refatoração UI e Implementação Motor V8 Operacional**
**Arquivos alterados:**
- `components/brand-studio/criar-campanha.tsx` — Transformação das labels técnicas em perguntas executivas (Ex: "Qual seu público alvo?"). Integração de parâmetros de tempo/público. Adição do Hexágono V8 no estado vazio (canvas). Interface da "Notinha" orçamentária 100% interativa.
- `components/brand-studio/useCampaignWizard.ts` — Lógica das requests de IA revisada. Abandono do viés puramente digital integrando regras logísticas determinísticas (coffee break para mais de 3h, checagem estrutural, infra presencial) no fallback e prompts da V8 (geração de funil longo).
- `pages/v8-dashboard.tsx` — Painel reescrito de "backend" para "C-level", abolindo CSS modules, melhorando a UI com ColdFlora, e traduzindo jargões (P0/OFF-SPEC) para termos gerenciais e claros.
- `components/brand-studio/wizard-schemas.ts` — Adaptação das interfaces de output para os planos táticos de evento (records dinâmicos).

---

## 🔲 A Fazer (próximas tasks)

_(adicione aqui conforme surgir)_
