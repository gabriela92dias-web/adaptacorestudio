import React, { useState, useMemo } from "react";
import { Search, ArrowDown, ArrowUp, Plus } from "lucide-react";
import { toast } from "sonner";
import type { TaskWithDetails } from "../endpoints/coreact/tasks/list_GET.schema";
import { useBatchCreateTasks, useStages } from "../helpers/useCoreActApi";
import { Badge } from "./Badge";
import { Progress } from "./Progress";
import { Avatar, AvatarFallback } from "./Avatar";
import styles from "./CronogramaLista.module.css";

interface ViewProps {
  level?: 0 | 1 | 2 | 3;
  tasks: TaskWithDetails[];
  projects: { id: string; name: string }[];
  onTaskClick: (taskId: string) => void;
}

type SortKey = keyof TaskWithDetails | "projectName" | "assigneeName";
type SortDirection = "asc" | "desc";

const STATUS_MAP: Record<
  string,
  { label: string; variant: "outline" | "primary" | "destructive" | "warning" | "success" | "secondary" }
> = {
  standby: { label: "Standby", variant: "secondary" },
  open: { label: "Aberto", variant: "outline" },
  in_progress: { label: "Em Andamento", variant: "primary" },
  blocked: { label: "Bloqueado", variant: "destructive" },
  overdue: { label: "Atrasado", variant: "warning" },
  completed: { label: "Concluído", variant: "success" },
};

const PRIORITY_MAP: Record<
  string,
  { label: string; variant: "destructive" | "warning" | "secondary" | "outline" }
> = {
  low: { label: "Baixa", variant: "outline" },
  medium: { label: "Média", variant: "secondary" },
  high: { label: "Alta", variant: "warning" },
  critical: { label: "Crítica", variant: "destructive" },
};

export const CronogramaLista = ({ tasks, projects, onTaskClick }: ViewProps) => {
  const [search, setSearch] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [quickAddText, setQuickAddText] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  } | null>({ key: "endDate", direction: "asc" });

  const batchCreateTasks = useBatchCreateTasks();

  const targetProjectId = selectedProjectId || (projects.length > 0 ? projects[0].id : "");
  const { data: stagesData } = useStages(targetProjectId);

  const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    return dateFormatter.format(new Date(date));
  };

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const handleQuickAdd = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!quickAddText.trim()) return;
      
      const projectId = targetProjectId;
      if (!projectId) {
        toast.error("Nenhum projeto disponível para adicionar a tarefa.");
        return;
      }

      const stages = stagesData?.stages || [];
      if (stages.length === 0) {
        toast.error("Nenhuma etapa disponível.");
        return;
      }
      const stageId = stages[0].id;

      const lines = quickAddText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const tasksToCreate = lines.map(name => ({
        name,
        status: "standby" as const,
        priority: "medium" as const,
      }));

      try {
        await batchCreateTasks.mutateAsync({
          projectId,
          stageId,
          tasks: tasksToCreate
        });
        toast.success(`${tasksToCreate.length} tarefa(s) criada(s) com sucesso.`);
        setQuickAddText("");
      } catch (error) {
        toast.error("Erro ao criar tarefa(s).");
      }
    }
  };

  const sortedAndFilteredTasks = useMemo(() => {
    let result = [...tasks];

    // Filter by project
    if (selectedProjectId) {
      result = result.filter((t) => t.projectId === selectedProjectId);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.projectName?.toLowerCase().includes(q),
      );
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal === bVal) return 0;

        // Handle nulls
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        const comparison = aVal < bVal ? -1 : 1;
        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [tasks, search, selectedProjectId, sortConfig]);

  const renderSortIcon = (key: SortKey) => {
    if (sortConfig?.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.projectFilter}>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className={styles.selectInput}
          >
            <option value="">Todos os projetos</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.searchInput}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por tarefa ou projeto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <div className={styles.headerRow}>
          <div className={styles.headerCell} onClick={() => handleSort("name")}>
            Tarefa {renderSortIcon("name")}
          </div>
          <div
            className={styles.headerCell}
            onClick={() => handleSort("projectName")}
          >
            Projeto {renderSortIcon("projectName")}
          </div>
          <div
            className={styles.headerCell}
            onClick={() => handleSort("stageName")}
          >
            Etapa {renderSortIcon("stageName")}
          </div>
          <div
            className={styles.headerCell}
            onClick={() => handleSort("assigneeName")}
          >
            Responsável {renderSortIcon("assigneeName")}
          </div>
          <div className={styles.headerCell} onClick={() => handleSort("status")}>
            Status {renderSortIcon("status")}
          </div>
          <div
            className={styles.headerCell}
            onClick={() => handleSort("priority")}
          >
            Prioridade {renderSortIcon("priority")}
          </div>
          <div
            className={styles.headerCell}
            onClick={() => handleSort("progress")}
          >
            Progresso {renderSortIcon("progress")}
          </div>
          <div
            className={styles.headerCell}
            onClick={() => handleSort("startDate")}
          >
            Data Início {renderSortIcon("startDate")}
          </div>
          <div
            className={styles.headerCell}
            onClick={() => handleSort("endDate")}
          >
            Data Término {renderSortIcon("endDate")}
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.quickAddRow}>
            <Plus size={16} className={styles.quickAddIcon} />
            <textarea
              rows={1}
              placeholder="Adicionar tarefa rápida... (Enter para criar)"
              value={quickAddText}
              onChange={(e) => setQuickAddText(e.target.value)}
              onKeyDown={handleQuickAdd}
              className={styles.quickAddInput}
              disabled={batchCreateTasks.isPending}
            />
          </div>

          {sortedAndFilteredTasks.length > 0 ? (
            sortedAndFilteredTasks.map((task) => {
              const statusConfig =
                STATUS_MAP[task.status || "open"] || STATUS_MAP.open;
              const priorityConfig =
                PRIORITY_MAP[task.priority || "medium"] || PRIORITY_MAP.medium;

              return (
                <div
                  key={task.id}
                  className={styles.dataRow}
                  onClick={() => onTaskClick(task.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onTaskClick(task.id);
                    }
                  }}
                >
                  <div className={styles.cellTitle} title={task.name}>
                    {task.name}
                  </div>
                  <div className={styles.cellText} title={task.projectName || "-"}>
                    {task.projectName || "-"}
                  </div>
                  <div className={styles.cellText} title={task.stageName || "-"}>
                    {task.stageName || "-"}
                  </div>
                  <div className={styles.cellAssignee}>
                    {task.assigneeInitials ? (
                      <>
                        <Avatar className={styles.avatar}>
                          <AvatarFallback>{task.assigneeInitials}</AvatarFallback>
                        </Avatar>
                        <span className={styles.assigneeName}>
                          {task.assigneeName}
                        </span>
                      </>
                    ) : (
                      <span className={styles.mutedText}>-</span>
                    )}
                  </div>
                  <div>
                    <Badge variant={statusConfig.variant}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <div>
                    <Badge variant={priorityConfig.variant}>
                      {priorityConfig.label}
                    </Badge>
                  </div>
                  <div className={styles.cellProgress}>
                    <Progress value={task.progress ?? 0} />
                    <span>{task.progress ?? 0}%</span>
                  </div>
                  <div className={styles.cellText}>
                    {formatDate(task.startDate)}
                  </div>
                  <div className={styles.cellText}>
                    {formatDate(task.endDate)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>Nenhuma tarefa encontrada.</div>
          )}
        </div>
      </div>
    </div>
  );
};