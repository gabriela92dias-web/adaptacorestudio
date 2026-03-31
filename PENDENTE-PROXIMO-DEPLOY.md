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

---

## 🔲 A Fazer (próximas tasks)

_(adicione aqui conforme surgir)_

---

> Quando fizer o deploy, apague ou mova os itens para uma seção "Deployado em [data]".
