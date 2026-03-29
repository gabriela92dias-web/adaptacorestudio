import React, { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useProjects, useStages } from "../helpers/useCoreActApi";
import { useBatchCreateTasks } from "../helpers/useCoreactTaskQueries";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";
import { Skeleton } from "./Skeleton";
import { Badge } from "./Badge";
import { Switch } from "./Switch";
import { TaskPriority, TaskStatus } from "../helpers/schema";
import styles from "./ProjectModulesPanel.module.css";

interface ProjectModulesPanelProps {
  projectId: string;
  className?: string;
}

const normalize = (name: string) => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

export function ProjectModulesPanel({
  projectId,
  className,
}: ProjectModulesPanelProps) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useProjects();
  const { mutateAsync: batchCreate, isPending } = useBatchCreateTasks();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: stagesData } = useStages(projectId);

  const { level, ref, className: adaptiveClass } = useAdaptiveLevel();

  const { currentProject, modules } = useMemo(() => {
    if (!data?.projects) {
      return { currentProject: null, modules: [] };
    }

    const current = data.projects.find((p) => p.id === projectId) || null;
    const currentTaskNames = new Set(
      current?.tasks.map((t) => normalize(t.name)) || []
    );

    const availableModules = data.projects
      .filter((p) => p.id !== projectId && p.tasks.length > 0)
      .map((template) => {
        const templateTasks = template.tasks;
        const overlapCount = templateTasks.filter((t) =>
          currentTaskNames.has(normalize(t.name))
        ).length;

        const isApplied = overlapCount / templateTasks.length > 0.5;

        return {
          ...template,
          isApplied,
        };
      });

    return { currentProject: current, modules: availableModules };
  }, [data?.projects, projectId]);

  const handleApplyModule = async (templateId: string) => {
    if (!currentProject) return;

    const template = modules.find((m) => m.id === templateId);
    if (!template || template.isApplied) return;

    try {
      setProcessingId(templateId);

      const currentTaskNames = new Set(
        currentProject.tasks.map((t) => normalize(t.name))
      );

      const tasksToAdd = template.tasks
        .filter((t) => !currentTaskNames.has(normalize(t.name)))
        .map((t) => ({
          name: t.name,
          assigneeId: null,
          priority: (t.priority as TaskPriority) || "medium",
          status: (t.status as TaskStatus) || "standby",
        }));

      if (tasksToAdd.length === 0) {
        toast.info("Todas as tarefas deste módulo já existem no projeto.");
        return;
      }

      const stages = stagesData?.stages || [];
      if (stages.length === 0) {
        toast.error("Nenhuma etapa disponível no projeto.");
        return;
      }

      await batchCreate({
        projectId,
        stageId: stages[0].id,
        tasks: tasksToAdd,
      });

      // Manually invalidate projects since useBatchCreateTasks doesn't do it by default
      queryClient.invalidateQueries({ queryKey: ["coreact", "projects"] });
      
      toast.success(
        `${tasksToAdd.length} tarefa(s) adicionada(s) com sucesso!`
      );
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(`Falha ao aplicar módulo: ${msg}`);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className={`${styles.panel} ${className || ""}`}>
        <div className={styles.header}>
          <Skeleton style={{ width: "150px", height: "1.5rem" }} />
        </div>
        <div className={styles.list}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.row}>
              <Skeleton style={{ width: "120px", height: "1rem" }} />
              <Skeleton style={{ width: "42px", height: "24px", borderRadius: "99px" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`${styles.panel} ${adaptiveClass} ${className || ""}`}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>Módulos disponíveis</h3>
        <p className={styles.subtitle}>
          Adicione tarefas de outros projetos como base.
        </p>
      </div>

      <div className={styles.list}>
        {modules.length === 0 ? (
          <div className={styles.empty}>
            <p>Nenhum módulo disponível no momento.</p>
          </div>
        ) : (
          modules.map((mod) => {
            const isLoadingThis = processingId === mod.id || isPending;
            const disabled = mod.isApplied || isLoadingThis;

            return (
              <div key={mod.id} className={styles.row}>
                <div className={styles.info}>
                  <span className={styles.projectName}>{mod.name}</span>
                  <Badge variant="secondary" className={styles.badge}>
                    {mod.tasks.length} {mod.tasks.length === 1 ? "tarefa" : "tarefas"}
                  </Badge>
                </div>
                <div className={styles.actions}>
                  {mod.isApplied && (
                    <span className={styles.appliedLabel}>Aplicado</span>
                  )}
                  <Switch
                    id={`module-${mod.id}`}
                    checked={mod.isApplied}
                    disabled={disabled}
                    onCheckedChange={() => handleApplyModule(mod.id)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}