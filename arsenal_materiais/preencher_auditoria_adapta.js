// ============================================================
// SCRIPT DE PREENCHIMENTO AUTOMÁTICO — Auditoria ADAPTA CoreStudio
// Data: 2026-03-29
// Como usar:
//   1. Abra o arquivo template_auditoria_wireframe_tecnico.html no navegador
//   2. Pressione F12 para abrir o console
//   3. Cole TODO este script e pressione Enter
// ============================================================

const setVal = (id, val) => {
  const el = document.getElementById(id);
  if (el) {
    el.value = val;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
  }
};

// --- BLOCO 3: Dados da auditoria ---
setVal('siteName', 'ADAPTA CoreStudio — CoreAct');
setVal('siteUrl', 'https://adaptacorestudio.onrender.com/');
setVal('auditOwner', 'Antigravity / Gabriela');
setVal('auditDate', '2026-03-29');
document.getElementById('scopeType').value = 'Site completo';
document.getElementById('scopeType').dispatchEvent(new Event('change'));
setVal('versionName', 'Auditoria Geral v01 — CoreAct');

// --- BLOCO 4: Estimativa ---
setVal('timeTotal', '2h15');
document.getElementById('timeConfidence').value = 'Média';
document.getElementById('timeConfidence').dispatchEvent(new Event('change'));
document.getElementById('timeComplexity').value = 'Alta';
document.getElementById('timeComplexity').dispatchEvent(new Event('change'));
setVal('timeBreakdown', `- mapeamento das rotas: 20 min\n- revisão visual / layout: 35 min\n- teste de botões e interações: 45 min\n- revisão responsiva: 15 min\n- consolidação do relatório: 20 min`);
setVal('timeRisks', `Riscos:\n- Site em Render com cold start potencial\n- Possível autenticação bloqueando rotas\n- Número de módulos maior que o previsto\n\nPremissas:\n- Acesso total sem login (Dev Mode ativo)\n- Funcionalidades carregam normalmente`);

// --- BLOCO 5: Mapeamento de rotas ---
setVal('routesMap', `/coreact — Dashboard principal\n/coreact/setores — Módulo de setores\n/coreact/iniciativas — Agrupamentos estratégicos (abas: Operacional, Mapa Mental, Documentação)\n/coreact/projetos — Cards de projetos\n/coreact/etapas — Milestones / Etapas\n/coreact/cronograma — Cronograma (estado vazio)\n/coreact/tarefas — Kanban de tarefas\n/coreact/acoes — Checklists e tracker de ações\n/coreact/orcamento — Orçamento (skeleton infinito — bug)\n/configuracoes — Dados institucionais da marca\nModal: Nova Iniciativa (painel lateral)\nModal: Novo Setor\nModal: Importar em Lote\nDropdown global: + Ações (4 opções CRUD + Importar)`);

// --- BLOCO 6: Panorama geral ---
setVal('generalQuality', `Visual: 8/10 — Design system sólido, dark theme bem executado, tipografia e ícones consistentes, hierarquia de informação clara.\n\nFuncional: 3/10 — Maioria dos fluxos de trabalho core não está conectada. 15 dead clicks confirmados nos CTAs mais proeminentes.\n\nO sistema comunica maturidade visual de produto pronto, mas não executa suas funções centrais. Padrão de "maquete funcional".`);

setVal('generalRisk', `RISCO ALTO — Sistema não apto para uso confiável por usuários reais.\n\nO que representa risco hoje:\n- Funções core inacessíveis (criar tarefas, editar projetos, checkboxes)\n- 15 dead clicks confirmados incluindo o CTA principal (dropdown + Ações)\n- 2 módulos inteiros inacessíveis (Orçamento: skeleton infinito / Cronograma: vazio)\n- Sem feedback positivo/negativo em nenhuma ação\n- Usuário não tem como saber se suas ações foram executadas`);

// --- BLOCO 8: Botões e interações ---
setVal('buttonSummary', `Dead clicks confirmados (15 total):\n1. Ícone ? (ajuda) — sidebar\n2. Ícone livro/docs — sidebar\n3. Avatar GA — sem menu de perfil ou logout\n4. Card Brand Studio Expansion — /projetos (dead click)\n5. Todos os cards do Kanban — /tarefas\n6. Botão Criar Tarefa — /tarefas\n7. Nova Etapa (Virtualizada) — /etapas\n8. Badge On Track — /etapas\n9. Badge At Risk — /etapas\n10. Novo Checklist — /acoes\n11. Checkboxes do checklist — /acoes\n12. Nova Iniciativa (dropdown + Ações)\n13. Novo Projeto (dropdown + Ações)\n14. Nova Tarefa (dropdown + Ações)\n15. Item Equipe — topbar sem rota\n\nBotões funcionais confirmados:\n✅ Toggle de tema (sol/lua)\n✅ Collapse da sidebar\n✅ Tabs de Iniciativas (3 abas)\n✅ Abre modal Nova Iniciativa (com bug no X)\n✅ Abre modal Novo Setor\n✅ Abre modal Importar em Lote\n✅ Dropdown Responsável em Iniciativas\n✅ Navigação principal (todas as tabs)`);

setVal('buttonPriority', `1. Conectar dropdown + Ações (os 4 handlers principais — Nova Iniciativa, Novo Projeto, Nova Tarefa, Nova Etapa)\n2. Implementar modal de Criar Tarefa em /tarefas\n3. Implementar drawer nos cards do Kanban\n4. Tornar checkboxes de ações funcionais com persistência\n5. Corrigir X do painel Nova Iniciativa (fechamento intermitente)\n6. Adicionar estado disabled + tooltip nos botões sem handler\n7. Implementar drawer de detalhes nos cards de /projetos`);

// --- BLOCO 9: Padrões quebrados ---
setVal('brokenPatterns', `1. Botão visível ≠ botão funcional — padrão sistêmico de CTAs sem handlers implementados\n2. Ícones decorativos sem tooltip — sidebar tem ícones que parecem acionáveis mas não são\n3. Empty states sem instrução — Cronograma, Timeline de Iniciativas, Setores\n4. Loading sem timeout ou fallback — Orçamento: skeleton infinito; Configurações: delay longo\n5. Idioma misto — "My Tasks Schedule" e dias da semana en inglês num sistema pt-BR\n6. <title> HTML estático — "Configurações da Marca" em todas as rotas\n7. Sem confirmação em ações destrutivas\n8. Badge de status visualmente interativo mas não funcional (On Track / At Risk)\n9. Drawer com fechamento intermitente — X do painel Nova Iniciativa\n10. Módulo inteiro inacessível sem indicação de erro — Orçamento parece travado`);

// --- BLOCO 10: Priorização ---
setVal('topCritical', `1. Dropdown + Ações — 4 opções principais são dead clicks (CTA mais acessível do sistema)\n2. Cards de projeto sem drawer (Projetos inacessíveis)\n3. Botão Criar Tarefa sem handler\n4. Cards do kanban sem drawer (kanban somente leitura)\n5. Checkboxes de ações não funcionam (módulo paralisa)\n6. Orçamento em skeleton infinito\n7. Botão de salvar não identificado em Configurações\n8. X do painel Nova Iniciativa intermitente (usuário preso)\n9. Equipe sem rota associada (parece sistema quebrado)\n10. Lista de Setores sem dados carregados`);

setVal('topVisual', `1. Tooltips nos ícones sem label da sidebar (ajuda, docs, engrenagem)\n2. Badge Em breve nos módulos futuros (Equipe, Cronograma)\n3. Hover distinto nos badges de status para indicar que são clicáveis\n4. Empty states com ícone + texto orientativo (Cronograma, Timeline de Iniciativas)\n5. Title dinâmico por rota (impacto em múltiplas abas)\n6. Locale pt-BR no componente de calendário (My Tasks Schedule)\n7. Estado disabled visual nos botões sem handler (esmaecido + cursor not-allowed)\n8. Esclarecer MILESTONE (TOTAL: 1500) com unidade de medida explicita\n9. Toast de feedback em ações de formulário em Configurações\n10. Botão Salvar sempre visível no formulário de Configurações`);

setVal('topFunctional', `1. Conectar handlers do dropdown + Ações (4 opções CRUD)\n2. Implementar drawer de detalhes de Projeto\n3. Implementar modal de Criar Tarefa\n4. Implementar drawer de detalhes dos cards do Kanban\n5. Tornar checkboxes funcionais com persistência\n6. Corrigir timeout + fallback do Orçamento\n7. Garantir botão salvar visível em Configurações\n8. Corrigir X do painel Nova Iniciativa\n9. Conectar handler em Nova Etapa (Virtualizada)\n10. Tornar badges de status em Etapas seletores funcionais`);

setVal('roadmapFixes', `IMEDIATO (esta semana):\n- Dropdown + Ações — conectar 4 handlers principais\n- Criar Tarefa — implementar modal mínimo funcional\n- Cards kanban — implementar drawer mínimo de detalhes\n- Checkboxes de ações — conectar estado com persistência\n- Orçamento — implementar timeout + empty state / error state\n- Configurações — verificar e fixar botão de salvar\n\nPRÓXIMA SPRINT:\n- Drawer de Projetos\n- X de Nova Iniciativa — corrigir\n- Equipe → badge Em breve + disable\n- Title dinâmico por rota\n- Empty states orientativos (Cronograma, Timeline)\n- Badges de status interativos em Etapas\n- Locale pt-BR no calendário\n- Nova Etapa (Virtualizada) — conectar handler\n- Novo Checklist — implementar\n- Ícones da sidebar — tooltips\n\nMELHORIA FUTURA:\n- Menu de usuário no avatar GA (perfil + logout)\n- Módulo Equipe completo\n- Módulo Cronograma\n- Formulário de Setor expandido (descrição, cor, responsável)`);

// --- BLOCO 11: Tempo real ---
setVal('realPredicted', '2h00');
setVal('realSpent', '2h15');
setVal('realDifference', '+15 min');
setVal('realReason', 'Orçamento com skeleton permanente exigiu tempo extra para confirmar o bug. Configurações demorou para carregar. Dead clicks exigiram múltiplas tentativas por rota (necessário re-clicar em coordenadas diferentes para confirmar ausência de lógica vs erro de coordenada).');
setVal('realComplexity', 'O sistema é visualmente mais complexo do que funcionalmente. Muitas rotas têm estrutura visual completa mas sem dados ou lógica conectada. Isso sugere desenvolvimento em fase UI-first, antes de conectar backend. A etapa que consumiu mais tempo foi o teste de botões e interações — a maioria dos CTAs visíveis precisou ser testada 2x para confirmar que eram dead clicks.');

// --- BLOCO 12: Conclusão ---
setVal('finalConclusion', `O ADAPTA CoreStudio tem design system sólido e identidade visual profissional. A navegação funciona, a hierarquia visual está clara e o dark mode é bem executado. O produto comunica maturidade visual.\n\nO sistema NÃO está pronto para uso confiável. As funções core (criar/editar tarefas, projetos, checklists) não estão conectadas. 15 dead clicks confirmados, incluindo o CTA principal da interface (dropdown + Ações). Dois módulos (Orçamento, Cronograma) inacessíveis sem indicação de status.\n\nO que impede a confiança:\n→ Handlers não conectados nos CTAs principais\n→ Ausência de feedback visual em ações\n→ Módulos em skeleton infinito sem fallback\n→ Usuário não tem confirmação de que suas ações foram executadas\n\nSequência ideal de evolução:\n1. Sprint de conectividade funcional (handlers + modais mínimos)\n2. Sprint de empty states e estados de loading/error\n3. Sprint de completude de formulários\n4. Sprint de features avançadas (Cronograma, Equipe, Orçamento)\n5. Revisão de acessibilidade (foco teclado, aria-labels, contraste)`);

// --- Adicionar problemas ao container ---
// Limpa problemas exemplo e adiciona os da auditoria
const container = document.getElementById('problemsContainer');
const template = document.getElementById('problemTemplate');

const problemas = [
  { page: '/coreact — Dashboard', element: 'Ícones ? e Livro (sidebar)', type: 'Bug funcional', severity: 'Alta', current: 'Clique não dispara ação — dead click', expected: 'Abrir modal de ajuda ou documentação', impact: 'Usuário novo não consegue ajuda; sistema parece quebrado', cause: 'Handlers de onClick não conectados ao componente de ícone', fix: 'Conectar onClick ao modal de docs ou adicionar tooltip Em breve', priority: 'Próxima sprint' },
  { page: 'Global (todas as rotas)', element: '<title> da página', type: 'Consistência', severity: 'Média', current: 'Título HTML exibe "Configurações da Marca" em todas as rotas', expected: 'Título dinâmico por rota (ex: "Tarefas — CoreAct")', impact: 'Confusão com múltiplas abas abertas', cause: 'Componente de layout com title estático sem atualização por rota', fix: 'Usar react-helmet ou useEffect por rota', priority: 'Próxima sprint' },
  { page: '/coreact/iniciativas', element: 'Botão X do painel Nova Iniciativa', type: 'Bug funcional', severity: 'Alta', current: 'X tem falha intermitente — às vezes fecha, às vezes não', expected: 'Clique no X fecha o painel consistentemente', impact: 'Usuário preso com o painel aberto, precisa recarregar a página', cause: 'Conflito de z-index ou área de clique sobreposta', fix: 'Verificar z-index; garantir área de clique de 44x44px', priority: 'Imediata' },
  { page: '/coreact/projetos', element: 'Card de Projeto (Brand Studio Expansion)', type: 'Bug funcional', severity: 'Crítica', current: 'Clique no card não navega e não abre drawer — dead click', expected: 'Abre drawer com detalhes do projeto', impact: 'Impossível acessar detalhes de qualquer projeto', cause: 'Handler onClick ausente; drawer de projeto não implementado', fix: 'Implementar onClick no card → drawer de detalhes', priority: 'Imediata' },
  { page: '/coreact/tarefas', element: 'Botão Criar Tarefa', type: 'Bug funcional', severity: 'Crítica', current: 'Dead click confirmado — nenhuma ação disparada', expected: 'Abre modal de criação de tarefa', impact: 'Impossível criar novas tarefas. Funcionalidade core inacessível.', cause: 'Handler de onClick não conectado', fix: 'Implementar modal com: título, descrição, status, responsável, prazo', priority: 'Imediata' },
  { page: '/coreact/tarefas', element: 'Cards do Kanban', type: 'Bug funcional', severity: 'Crítica', current: 'Clique nos cards não abre drawer — dead click confirmado', expected: 'Clique abre drawer com campos editáveis da tarefa', impact: 'Kanban é somente leitura — impossível editar tarefas', cause: 'Drawer de detalhes da tarefa não implementado', fix: 'Implementar drawer de detalhes com edição inline', priority: 'Imediata' },
  { page: '/coreact/acoes', element: 'Checkboxes do checklist', type: 'Bug funcional', severity: 'Alta', current: 'Checkboxes não respondem ao clique', expected: 'Marcar/desmarcar item e atualizar progresso (2/4 → 3/4)', impact: 'Módulo de ações inutilizável', cause: 'Estado hardcoded sem handler de onChange', fix: 'Conectar estado ao componente checkbox com persistência', priority: 'Imediata' },
  { page: '/coreact/orcamento', element: 'Página inteira', type: 'Bug funcional', severity: 'Alta', current: 'Skeletons de loading que nunca resolvem — tela em branco permanente', expected: 'Carregar dados ou exibir empty state funcional', impact: 'Módulo completamente inacessível — parece travado', cause: 'Chamada de API sem resposta ou componente aguardando dados que não chegam', fix: 'Implementar timeout com fallback para estado de erro ou vazio', priority: 'Imediata' },
  { page: 'Global — Dropdown + Ações', element: 'Opções: Nova Iniciativa, Novo Projeto, Nova Tarefa, Nova Etapa', type: 'Bug funcional', severity: 'Crítica', current: '4 opções principais do dropdown global são dead clicks', expected: 'Cada opção abre o formulário de criação correspondente', impact: 'O CTA mais visível do sistema não executa as ações principais', cause: 'Opções do dropdown sem handlers implementados', fix: 'Conectar cada opção ao modal/drawer correspondente', priority: 'Imediata' },
  { page: 'Global — Topbar', element: 'Item Equipe', type: 'UX / Bug funcional', severity: 'Alta', current: '"Equipe" visível na navbar mas não clicável e sem rota', expected: 'Link funcional ou badge "Em breve" com tooltip', impact: 'Parece sistema quebrado para o usuário', cause: 'Link placeholder sem rota definida', fix: 'Adicionar disabled + tooltip "Em breve" ou implementar a rota', priority: 'Próxima sprint' },
  { page: '/coreact — Dashboard', element: 'My Tasks Schedule (calendário)', type: 'UX', severity: 'Baixa', current: 'Dias da semana exibidos em inglês (Sat, Sun, Mon, Tue)', expected: 'Locale pt-BR (Sáb, Dom, Seg, Ter)', impact: 'Inconsistência de idioma', cause: 'Componente usando locale padrão en-US', fix: 'Configurar locale pt-BR no componente de calendário', priority: 'Próxima sprint' },
  { page: '/coreact/etapas', element: 'Badges On Track / At Risk', type: 'Bug funcional', severity: 'Alta', current: 'Badges não são clicáveis — não permitem alterar status', expected: 'Clique abre dropdown de status', impact: 'Status de etapas não pode ser atualizado pela interface', cause: 'Badge renderizado como texto puro sem handler', fix: 'Converter badge em componente Select funcional', priority: 'Próxima sprint' },
];

container.innerHTML = '';
problemas.forEach((p, i) => {
  const clone = template.content.cloneNode(true);
  clone.querySelector('.problem-index').textContent = `#${i + 1}`;
  clone.querySelector('[data-key="page"]').value = p.page;
  clone.querySelector('[data-key="element"]').value = p.element;
  clone.querySelector('[data-key="type"]').value = p.type;
  clone.querySelector('[data-key="severity"]').value = p.severity;
  clone.querySelector('[data-key="current"]').value = p.current;
  clone.querySelector('[data-key="expected"]').value = p.expected;
  clone.querySelector('[data-key="impact"]').value = p.impact;
  clone.querySelector('[data-key="cause"]').value = p.cause;
  clone.querySelector('[data-key="fix"]').value = p.fix;
  clone.querySelector('[data-key="priority"]').value = p.priority;
  container.appendChild(clone);
});

console.log('✅ Template preenchido com sucesso! Clique em "Salvar nova versão" para salvar no localStorage.');
