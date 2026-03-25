import { useState, useCallback, useMemo } from "react";
// @ts-ignore
import * as pdfMake from "pdfmake/build/pdfmake";
// @ts-ignore
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { OutputType as ProjectReportData } from "../endpoints/coreact/reports/project_GET.schema";
import {
  generatePapelTimbrado, generateEnvelope, generatePastaApresentacao, generateBlocoNotas, generateCapaRelatorio
} from "./generatePapelariaDocuments";
import {
  generateCartaoHorizontal, generateCartaoVertical, generateCartaoQuadrado, generateCartaoDigital
} from "./generateCartoesDocuments";
import {
  generateContratoPrestacao, generatePropostaComercial, generateNDA, generateOrdemServico, generateBriefing
} from "./generateContratosDocuments";
import {
  generateCertificadoConclusao, generateCertificadoParticipacao, generateDiplomaExcelencia, generateDeclaracaoInstitucional
} from "./generateCertificadosDocuments";
import { BudgetItems, Tasks, TeamMembers } from "./schema";
import { Selectable } from "kysely";

(pdfMake as any).addVirtualFileSystem(pdfFonts);

const formatCurrency = (val: number | string | null | undefined) => {
  if (val == null) return "R$ 0,00";
  const num = typeof val === "string" ? parseFloat(val) : val;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num || 0);
};

const formatDate = (val: Date | string | null | undefined) => {
  if (!val) return "-";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(val));
};

const translateStatus = (status: string | null | undefined) => {
  const map: Record<string, string> = {
    active: "Ativo",
    cancelled: "Cancelado",
    completed: "Concluído",
    paused: "Pausado",
    blocked: "Bloqueado",
    in_progress: "Em Progresso",
    open: "Aberto",
    overdue: "Atrasado",
    standby: "Em Espera",
    contracted: "Contratado",
    paid: "Pago",
    pending: "Pendente",
  };
  return map[status as string] || status || "-";
};

export const useDocumentGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateProjectReport = useCallback(async (data: ProjectReportData) => {
    setIsGenerating(true);
    try {
      const docDefinition: any = {
        content: [
          { text: "Relatório de Projeto", style: "header" },
          { text: data.project.name, style: "subheader" },
          {
            columns: [
              {
                text: `Status: ${translateStatus(data.project.status)}`,
                style: "info",
              },
              {
                text: `Categoria: ${data.project.category || "-"}`,
                style: "info",
              },
              {
                text: `Início: ${formatDate(data.project.startDate)}`,
                style: "info",
              },
              {
                text: `Fim: ${formatDate(data.project.endDate)}`,
                style: "info",
              },
            ],
            margin: [0, 0, 0, 20],
          },
          { text: "Resumo do Orçamento", style: "sectionHeader" },
          {
            table: {
              headerRows: 1,
              widths: ["*", "*", "*"],
              body: [
                [
                  { text: "Previsto", style: "tableHeader" },
                  { text: "Contratado", style: "tableHeader" },
                  { text: "Pago", style: "tableHeader" },
                ],
                [
                  formatCurrency(data.budget.predictedTotal),
                  formatCurrency(data.budget.contractedTotal),
                  formatCurrency(data.budget.paidTotal),
                ],
              ],
            },
            margin: [0, 0, 0, 20],
          },
          { text: "Distribuição de Tarefas", style: "sectionHeader" },
          {
            ul: Object.entries(data.taskStatusBreakdown).map(
              ([status, count]) => `${translateStatus(status)}: ${count}`
            ),
            margin: [0, 0, 0, 20],
          },
          { text: "Equipe Envolvida", style: "sectionHeader" },
          {
            ul: data.teamMembers.map((m) => `${m.name} (${m.role || "Membro"})`),
            margin: [0, 0, 0, 20],
          },
          { text: "Atividades Recentes", style: "sectionHeader" },
          {
            table: {
              headerRows: 1,
              widths: ["auto", "auto", "*"],
              body: [
                [
                  { text: "Data", style: "tableHeader" },
                  { text: "Usuário", style: "tableHeader" },
                  { text: "Ação", style: "tableHeader" },
                ],
                ...data.recentActivities.map((a) => [
                  formatDate(a.performedAt),
                  a.performerName || "-",
                  `${a.action} - ${a.entityType}`,
                ]),
              ],
            },
          },
        ],
        styles: {
          header: {
            fontSize: 24,
            bold: true,
            margin: [0, 0, 0, 5],
            color: "#000000",
          },
          subheader: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 15],
            color: "#525252",
          },
          info: { fontSize: 10, color: "#525252" },
          sectionHeader: {
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 10],
            color: "#000000",
          },
          tableHeader: {
            bold: true,
            fontSize: 11,
            color: "#000000",
            fillColor: "#e5e5e5",
          },
        },
        defaultStyle: {
          fontSize: 10,
          color: "#171717",
        },
      };

      pdfMake
        .createPdf(docDefinition)
        .download(`relatorio-projeto-${data.project.id}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateBudgetReport = useCallback(
    async (
      projectName: string,
      budgetItems: Array<Selectable<BudgetItems>>
    ) => {
      setIsGenerating(true);
      try {
        let predictedTotal = 0;
        let contractedTotal = 0;
        let paidTotal = 0;

        const tableBody = budgetItems.map((item) => {
          predictedTotal += Number(item.predictedAmount || 0);
          contractedTotal += Number(item.contractedAmount || 0);
          paidTotal += Number(item.paidAmount || 0);

          return [
            item.description || "Sem descrição",
            item.category || "-",
            item.vendor || "-",
            formatCurrency(item.predictedAmount),
            formatCurrency(item.contractedAmount),
            formatCurrency(item.paidAmount),
            translateStatus(item.status),
          ];
        });

        const docDefinition: any = {
          content: [
            { text: "Relatório de Orçamento", style: "header" },
            { text: `Projeto: ${projectName}`, style: "subheader" },
            {
              table: {
                headerRows: 1,
                widths: ["*", "auto", "auto", "auto", "auto", "auto", "auto"],
                body: [
                  [
                    { text: "Item", style: "tableHeader" },
                    { text: "Categoria", style: "tableHeader" },
                    { text: "Fornecedor", style: "tableHeader" },
                    { text: "Previsto", style: "tableHeader" },
                    { text: "Contratado", style: "tableHeader" },
                    { text: "Pago", style: "tableHeader" },
                    { text: "Status", style: "tableHeader" },
                  ],
                  ...tableBody,
                  [
                    { text: "Total", style: "tableHeader", colSpan: 3 },
                    {},
                    {},
                    { text: formatCurrency(predictedTotal), style: "tableHeader" },
                    { text: formatCurrency(contractedTotal), style: "tableHeader" },
                    { text: formatCurrency(paidTotal), style: "tableHeader" },
                    { text: "-", style: "tableHeader" },
                  ],
                ],
              },
            },
          ],
          styles: {
            header: {
              fontSize: 24,
              bold: true,
              margin: [0, 0, 0, 5],
              color: "#000000",
            },
            subheader: {
              fontSize: 14,
              margin: [0, 0, 0, 20],
              color: "#525252",
            },
            tableHeader: {
              bold: true,
              fontSize: 10,
              color: "#000000",
              fillColor: "#e5e5e5",
            },
          },
          defaultStyle: {
            fontSize: 9,
            color: "#171717",
          },
          pageOrientation: "landscape",
        };

        pdfMake
          .createPdf(docDefinition)
          .download(
            `relatorio-orcamento-${projectName
              .toLowerCase()
              .replace(/\s+/g, "-")}.pdf`
          );
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const generateWorkloadReport = useCallback(
    async (
      teamMembers: Array<Selectable<TeamMembers>>,
      tasks: Array<Selectable<Tasks> & { assigneeName?: string | null }>
    ) => {
      setIsGenerating(true);
      try {
        const content: any[] = [
          { text: "Relatório de Carga de Trabalho", style: "header" },
        ];

        for (const member of teamMembers) {
          const memberTasks = tasks.filter((t) => t.assigneeId === member.id);

          content.push({
            text: `${member.name} (${member.role || "Membro"}) - ${memberTasks.length} tarefas`,
            style: "sectionHeader",
          });

          if (memberTasks.length > 0) {
            content.push({
              table: {
                headerRows: 1,
                widths: ["*", "auto", "auto", "auto"],
                body: [
                  [
                    { text: "Tarefa", style: "tableHeader" },
                    { text: "Status", style: "tableHeader" },
                    { text: "Prioridade", style: "tableHeader" },
                    { text: "Prazo", style: "tableHeader" },
                  ],
                  ...memberTasks.map((t) => [
                    t.name,
                    translateStatus(t.status),
                    translateStatus(t.priority) || "-",
                    formatDate(t.endDate),
                  ]),
                ],
              },
              margin: [0, 0, 0, 20],
            });
          } else {
            content.push({
              text: "Nenhuma tarefa atribuída.",
              italics: true,
              margin: [0, 0, 0, 20],
            });
          }
        }

        const docDefinition: any = {
          content,
          styles: {
            header: {
              fontSize: 24,
              bold: true,
              margin: [0, 0, 0, 20],
              color: "#000000",
            },
            sectionHeader: {
              fontSize: 14,
              bold: true,
              margin: [0, 10, 0, 5],
              color: "#000000",
            },
            tableHeader: {
              bold: true,
              fontSize: 10,
              color: "#000000",
              fillColor: "#e5e5e5",
            },
          },
          defaultStyle: {
            fontSize: 9,
            color: "#171717",
          },
        };

        pdfMake.createPdf(docDefinition).download(`relatorio-equipe.pdf`);
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return useMemo(
    () => ({
      generateProjectReport,
      generateBudgetReport,
      generateWorkloadReport,
      isGenerating,
      
      generatePapelTimbrado,
      generateEnvelope,
      generatePastaApresentacao,
      generateBlocoNotas,
      generateCapaRelatorio,
      
      generateCartaoHorizontal,
      generateCartaoVertical,
      generateCartaoQuadrado,
      generateCartaoDigital,
      
      generateContratoPrestacao,
      generatePropostaComercial,
      generateNDA,
      generateOrdemServico,
      generateBriefing,
      
      generateCertificadoConclusao,
      generateCertificadoParticipacao,
      generateDiplomaExcelencia,
      generateDeclaracaoInstitucional,
    }),
    [
      generateProjectReport,
      generateBudgetReport,
      generateWorkloadReport,
      isGenerating,
    ]
  );
};