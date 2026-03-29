# Ensaio de Versão (Static UI Snapshot) — Kit Genérico (Layout-Locked) v2

Este kit define um padrão **genérico** para gerar snapshots *HTML único* (HTML+CSS+JS) editáveis e offline, com:

- **Estágio 1**: Wireframe Inteligente (padrão)
- **Estágio 2**: Arquitetura Pré-Frontend (Text-Complete + Front Brief)
- **Layout-Locked**: timelapse perfeito (mesma estrutura/mesmo CSS base entre versões)

---

## 1) Regra de Ouro: Layout-Locked (timelapse perfeito)
**A partir da v001**, a estrutura e o CSS base são considerados **contrato**.

✅ Permitido entre versões (sem quebrar o timelapse):
- Atualizar textos `contenteditable` e/ou via **Copy Registry** (Estágio 2).
- Adicionar/remover **cenários** (mock data).
- Adicionar/remover **regras** do validador (SE→ENTÃO).
- Ligar/desligar componentes **pré-declarados** usando flags.

⛔ Não permitido (a menos que haja “evolução pré-mapeada”):
- Mover blocos, alterar grid/spacing base, trocar padrões de componentes.
- Reescrever CSS de layout.
- Introduzir novos tipos de componente “do nada”.

---

## 2) Evolução pré-mapeada (quando precisa mudar aparência)
Se for necessário alterar layout/estética, isso deve ser **planejado**:

1) Registrar no `EVOLUTION_MAP` (no próprio HTML):
   - Versão alvo
   - O que muda
   - Por que muda
2) Só então executar a mudança na versão indicada.

---

## 3) Estágios
### Estágio 1 — Wireframe Inteligente (padrão)
- Monocromático e funcional
- Mock store + cenários + eventos + validador
- Conteúdo editável diretamente na UI

### Estágio 2 — Arquitetura Pré-Frontend (Text-Complete)
**2A — Copy Registry**
- Registro único de todos os textos finais com `copy_key`
- Export JSON no próprio HTML
- Status por item: rascunho / final / aprovado
- “Text-Complete” quando todos os textos críticos estão final/aprovado

**2B — Front Brief**
- Documento editável com diretrizes de design/estética final (sem aplicar no CSS do ensaio)
- “Pre-Front OK” quando o brief estiver preenchido e marcado como OK

---

## 4) Como versionar
1) Copie o template:
   - `_template_ensaio_layoutlocked_v2.html`
2) Renomeie para:
   - `[Contexto]__[Escopo]__v001.html` (ou v002, v003...)
3) Edite no próprio HTML:
   - Metadados
   - Cenários e regras
   - Copy Registry (se Estágio 2)
   - Front Brief (se Estágio 2)

---

## 5) Independência total
- Offline-first (sem API real).
- Sem npm/build.
- Sem dependência de rede.