import React, { useState } from "react";
import { Button } from "./Button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./DropdownMenu";
import { MoreVertical, FileText, DollarSign, Users } from "lucide-react";
import { useDocumentGenerator } from "../helpers/useDocumentGenerator";
import { getCoreactReportsProject } from "../endpoints/coreact/reports/project_GET.schema";
import { getCoreactBudgetList } from "../endpoints/coreact/budget/list_GET.schema";

export function CoreActProjectReportsMenu({ projectId, projectName }: { projectId: string, projectName: string }) {
  const { generateProjectReport, generateBudgetReport, generateWorkloadReport } = useDocumentGenerator();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleProjectReport = async () => {
    try {
      setIsGenerating(true);
      const data = await getCoreactReportsProject({ projectId });
      await generateProjectReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBudgetReport = async () => {
    try {
      setIsGenerating(true);
      const data = await getCoreactBudgetList({ projectId });
      await generateBudgetReport(projectName, data.budgetItems);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWorkloadReport = async () => {
    try {
      setIsGenerating(true);
      const data = await getCoreactReportsProject({ projectId });
      await generateWorkloadReport(data.teamMembers, data.tasks);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" disabled={isGenerating}>
          <MoreVertical size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleProjectReport} disabled={isGenerating}>
          <FileText size={14} style={{ marginRight: '8px' }} />
          Relatório do Projeto
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleBudgetReport} disabled={isGenerating}>
          <DollarSign size={14} style={{ marginRight: '8px' }} />
          Relatório de Orçamento
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWorkloadReport} disabled={isGenerating}>
          <Users size={14} style={{ marginRight: '8px' }} />
          Relatório de Carga
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}