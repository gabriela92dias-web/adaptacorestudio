import { ProjectCategory } from "./schema";

export interface ChecklistTemplate {
  title: string;
  description: string;
  categoryKey: string;
  sortOrder: number;
}

export const projectChecklistTemplates: Record<ProjectCategory, ChecklistTemplate[]> = {
  event: [
    { title: "Local definido", description: "", categoryKey: "Logística", sortOrder: 1 },
    { title: "Fornecedores contratados", description: "", categoryKey: "Logística", sortOrder: 2 },
    { title: "Equipamentos reservados", description: "", categoryKey: "Logística", sortOrder: 3 },
    { title: "Transporte organizado", description: "", categoryKey: "Logística", sortOrder: 4 },
    
    { title: "Convites enviados", description: "", categoryKey: "Comunicação", sortOrder: 5 },
    { title: "Divulgação realizada", description: "", categoryKey: "Comunicação", sortOrder: 6 },
    { title: "Material gráfico pronto", description: "", categoryKey: "Comunicação", sortOrder: 7 },
    
    { title: "Cronograma do dia definido", description: "", categoryKey: "Operação", sortOrder: 8 },
    { title: "Equipe briefada", description: "", categoryKey: "Operação", sortOrder: 9 },
    { title: "Plano B definido", description: "", categoryKey: "Operação", sortOrder: 10 },
    
    { title: "Pesquisa de satisfação preparada", description: "", categoryKey: "Pós-evento", sortOrder: 11 },
    { title: "Relatório de resultados", description: "", categoryKey: "Pós-evento", sortOrder: 12 },
  ],
  travel: [
    { title: "Destino e datas confirmados", description: "", categoryKey: "Planejamento", sortOrder: 1 },
    { title: "Passagens compradas", description: "", categoryKey: "Planejamento", sortOrder: 2 },
    { title: "Hospedagem reservada", description: "", categoryKey: "Planejamento", sortOrder: 3 },
    { title: "Seguro viagem contratado", description: "", categoryKey: "Planejamento", sortOrder: 4 },
    
    { title: "Documentos verificados", description: "", categoryKey: "Documentação", sortOrder: 5 },
    { title: "Autorizações obtidas", description: "", categoryKey: "Documentação", sortOrder: 6 },
    
    { title: "Transfer organizado", description: "", categoryKey: "Logística", sortOrder: 7 },
    { title: "Roteiro definido", description: "", categoryKey: "Logística", sortOrder: 8 },
    { title: "Orçamento de despesas definido", description: "", categoryKey: "Logística", sortOrder: 9 },
  ],
  implementation: [
    { title: "Requisitos levantados", description: "", categoryKey: "Análise", sortOrder: 1 },
    { title: "Escopo definido", description: "", categoryKey: "Análise", sortOrder: 2 },
    { title: "Cronograma aprovado", description: "", categoryKey: "Análise", sortOrder: 3 },
    
    { title: "Recursos alocados", description: "", categoryKey: "Execução", sortOrder: 4 },
    { title: "Ambiente preparado", description: "", categoryKey: "Execução", sortOrder: 5 },
    { title: "Testes planejados", description: "", categoryKey: "Execução", sortOrder: 6 },
    
    { title: "Documentação técnica pronta", description: "", categoryKey: "Entrega", sortOrder: 7 },
    { title: "Treinamento planejado", description: "", categoryKey: "Entrega", sortOrder: 8 },
    { title: "Go-live agendado", description: "", categoryKey: "Entrega", sortOrder: 9 },
  ],
  infrastructure: [
    { title: "Projeto técnico aprovado", description: "", categoryKey: "Planejamento", sortOrder: 1 },
    { title: "Licenças obtidas", description: "", categoryKey: "Planejamento", sortOrder: 2 },
    { title: "Orçamento validado", description: "", categoryKey: "Planejamento", sortOrder: 3 },
    
    { title: "Fornecedores selecionados", description: "", categoryKey: "Execução", sortOrder: 4 },
    { title: "Materiais comprados", description: "", categoryKey: "Execução", sortOrder: 5 },
    { title: "Equipe técnica definida", description: "", categoryKey: "Execução", sortOrder: 6 },
    
    { title: "Vistoria realizada", description: "", categoryKey: "Finalização", sortOrder: 7 },
    { title: "Documentação as-built pronta", description: "", categoryKey: "Finalização", sortOrder: 8 },
  ],
  maintenance: [
    { title: "Problema identificado", description: "", categoryKey: "Diagnóstico", sortOrder: 1 },
    { title: "Impacto avaliado", description: "", categoryKey: "Diagnóstico", sortOrder: 2 },
    { title: "Prioridade definida", description: "", categoryKey: "Diagnóstico", sortOrder: 3 },
    
    { title: "Materiais disponíveis", description: "", categoryKey: "Execução", sortOrder: 4 },
    { title: "Equipe designada", description: "", categoryKey: "Execução", sortOrder: 5 },
    { title: "Prazo acordado", description: "", categoryKey: "Execução", sortOrder: 6 },
    
    { title: "Teste de funcionamento", description: "", categoryKey: "Conclusão", sortOrder: 7 },
    { title: "Registro de manutenção atualizado", description: "", categoryKey: "Conclusão", sortOrder: 8 },
  ],
  operational: [
    { title: "Processos mapeados", description: "", categoryKey: "Preparação", sortOrder: 1 },
    { title: "Equipe treinada", description: "", categoryKey: "Preparação", sortOrder: 2 },
    { title: "Ferramentas disponíveis", description: "", categoryKey: "Preparação", sortOrder: 3 },
    
    { title: "Indicadores definidos", description: "", categoryKey: "Execução", sortOrder: 4 },
    { title: "Rotina estabelecida", description: "", categoryKey: "Execução", sortOrder: 5 },
    
    { title: "Dashboard configurado", description: "", categoryKey: "Monitoramento", sortOrder: 6 },
    { title: "Relatório periódico definido", description: "", categoryKey: "Monitoramento", sortOrder: 7 },
  ],
  strategic: [
    { title: "Análise SWOT realizada", description: "", categoryKey: "Diagnóstico", sortOrder: 1 },
    { title: "Benchmarking concluído", description: "", categoryKey: "Diagnóstico", sortOrder: 2 },
    { title: "Stakeholders mapeados", description: "", categoryKey: "Diagnóstico", sortOrder: 3 },
    
    { title: "Metas SMART definidas", description: "", categoryKey: "Planejamento", sortOrder: 4 },
    { title: "KPIs estabelecidos", description: "", categoryKey: "Planejamento", sortOrder: 5 },
    { title: "Plano de ação detalhado", description: "", categoryKey: "Planejamento", sortOrder: 6 },
    
    { title: "Reuniões de acompanhamento agendadas", description: "", categoryKey: "Acompanhamento", sortOrder: 7 },
    { title: "Relatório de progresso definido", description: "", categoryKey: "Acompanhamento", sortOrder: 8 },
  ],
  custom: [
    { title: "Objetivos definidos", description: "", categoryKey: "Geral", sortOrder: 1 },
    { title: "Equipe alocada", description: "", categoryKey: "Geral", sortOrder: 2 },
    { title: "Cronograma criado", description: "", categoryKey: "Geral", sortOrder: 3 },
    { title: "Orçamento aprovado", description: "", categoryKey: "Geral", sortOrder: 4 },
  ],
};