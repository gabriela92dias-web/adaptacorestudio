import { db } from "./db";
import { nanoid } from "nanoid";
import { OutputType } from "../endpoints/coreact/import/batch_POST.schema";
import superjson from "superjson";
import { ProjectCategory } from "./schema";
import {
  safeInt,
  safeNumericStr,
  parseDate,
  findDatesInRow,
  normalizeRow,
  mapProjectStatus,
  mapTaskStatus,
  mapTaskPriority,
  mapStageStatus,
  mapTaskActionType,
  mapTaskActionStatus,
  mapBudgetItemStatus,
  logActivityBatch,
  resolveTeamMemberIdByName,
  resolveTeamIdByName,
        resolveInitiativeIdByName,
  resolveProjectIdByName,
  resolveStageIdByName,
  resolveTaskIdByName,
  isModule,
  normalizeModuleName,
  getOrCreateBacklogInitiativeId,
  getOrCreateBacklogStageId,
} from "./importUtils";

// Recognised type tags (normalised to lower-case)
const HIER_PROJECT_TAGS = new Set(["projeto", "project"]);
const HIER_STAGE_TAGS = new Set(["etapa", "stage"]);
const HIER_TASK_TAGS = new Set(["tarefa", "task"]);
const HIER_ACTION_TAGS = new Set(["acao", "action"]);
const HIER_BUDGET_TAGS = new Set(["orcamento", "budget"]);

function mapProjectCategory(raw: unknown): ProjectCategory {
  const s = String(raw ?? "").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  switch (s) {
    case "evento": case "event": return "event";
    case "implementacao": case "implementation": return "implementation";
    case "infraestrutura": case "infrastructure": return "infrastructure";
    case "manutencao": case "maintenance": return "maintenance";
    case "operacional": case "operational": return "operational";
    case "estrategico": case "strategic": return "strategic";
    case "viagem": case "travel": return "travel";
    default: return "custom";
  }
}

export async function handleHierarchical(
  rows: Record<string, unknown>[],
  defaultProjectId?: string,
  defaultInitiativeId?: string
): Promise<Response> {
  const errors: string[] = [];
  let created = 0;

  // ---- Pass 1: Projects ----
  const projectRows = rows.filter((r) => {
    const norm = normalizeRow(r);
    return HIER_PROJECT_TAGS.has(
      String(norm.tipo ?? norm.type ?? "").toLowerCase().trim()
    );
  });

  if (defaultProjectId) {
    console.log(`handleHierarchical: defaultProjectId set, skipping ${projectRows.length} project row(s).`);
  }

  for (let i = 0; i < projectRows.length; i++) {
    if (defaultProjectId) {
      // When a defaultProjectId is provided, skip project creation entirely
      continue;
    }
    const norm = normalizeRow(projectRows[i]);
    const rowLabel = `Project row ${i + 1}`;
    try {
      const rawName = String(norm.name ?? norm.nome ?? "").trim();
      const name = normalizeModuleName(rawName);
      if (!name) {
        errors.push(`${rowLabel}: name is required`);
        continue;
      }
      
      const isMod = isModule(name);

      const existingId = await resolveProjectIdByName(name);
      if (existingId) {
        console.log("Skipping existing project:", name, existingId);
        continue;
      }

      let startDate = parseDate(
        norm.startdate ?? norm.datainicio ?? norm.inicio
      );
      let endDate = parseDate(norm.enddate ?? norm.datafim ?? norm.fim);

      if (!startDate || !endDate) {
        const fallback = findDatesInRow(norm);
        if (!startDate) startDate = fallback.start;
        if (!endDate) endDate = fallback.end;
      }

      const ownerId = await resolveTeamMemberIdByName(
        String(norm.ownername ?? norm.responsavel ?? "")
      );
      const assignedTeamId = await resolveTeamIdByName(
        String(norm.teamname ?? norm.equipe ?? "")
      );

      let initiativeId: string | null = null;
      if (!isMod) {
        const csvInitiativa = String(norm.initiativename ?? norm.iniciativa ?? "").trim();
        if (csvInitiativa) {
          initiativeId = await resolveInitiativeIdByName(csvInitiativa);
        } else if (defaultInitiativeId) {
          initiativeId = defaultInitiativeId;
        }
      }
      if (!initiativeId) {
        initiativeId = await getOrCreateBacklogInitiativeId();
      }

      const id = nanoid();
      await db
        .insertInto("projects")
        .values({
          id,
          name,
          description:
            norm.description ?? norm.descricao
              ? String(norm.description ?? norm.descricao)
              : null,
          status: mapProjectStatus(norm.status),
          priority: mapTaskPriority(norm.priority ?? norm.prioridade),
          category: mapProjectCategory(norm.category ?? norm.categoria),
          startDate: startDate ?? new Date(),
          endDate,
          ownerId,
          assignedTeamId,
                              initiativeId,
        })
        .execute();

      await logActivityBatch([
        { action: "created", entityId: id, entityType: "project" },
      ]);
      created++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${rowLabel}: ${msg}`);
      console.error("Hierarchical project import error:", err);
    }
  }

  // ---- Pass 2: Stages ----
  const stageRows = rows.filter((r) => {
    const norm = normalizeRow(r);
    return HIER_STAGE_TAGS.has(
      String(norm.tipo ?? norm.type ?? "").toLowerCase().trim()
    );
  });

  for (let i = 0; i < stageRows.length; i++) {
    const norm = normalizeRow(stageRows[i]);
    const rowLabel = `Stage row ${i + 1}`;
    try {
      const name = String(norm.name ?? norm.nome ?? "").trim();
      if (!name) {
        errors.push(`${rowLabel}: name is required`);
        continue;
      }
      const projectName = String(
        norm.projectname ?? norm.projeto ?? ""
      ).trim();
      const resolvedFromCsv = await resolveProjectIdByName(projectName || null);
      const projectId = resolvedFromCsv ?? defaultProjectId ?? null;
      if (!projectId) {
        errors.push(`${rowLabel}: project "${projectName}" not found`);
        continue;
      }

      const existingId = await resolveStageIdByName(name, projectId);
      if (existingId) {
        console.log("Skipping existing stage:", name, existingId);
        continue;
      }

      let startDate = parseDate(
        norm.startdate ?? norm.datainicio ?? norm.inicio
      );
      let endDate = parseDate(norm.enddate ?? norm.datafim ?? norm.fim);

      if (!startDate || !endDate) {
        const fallback = findDatesInRow(norm);
        if (!startDate) startDate = fallback.start;
        if (!endDate) endDate = fallback.end;
      }

      const id = nanoid();
      await db
        .insertInto("projectStages")
        .values({
          id,
          name,
          description:
            norm.description ?? norm.descricao
              ? String(norm.description ?? norm.descricao)
              : null,
          projectId,
          status: mapStageStatus(norm.status),
          sortOrder: safeInt(norm.ordem ?? norm.sortorder, 0),
          startDate,
          endDate,
        })
        .execute();

      await logActivityBatch([
        {
          action: "created",
          entityId: id,
          entityType: "projectStage",
          projectId,
        },
      ]);
      created++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${rowLabel}: ${msg}`);
      console.error("Hierarchical stage import error:", err);
    }
  }

  // ---- Pass 3: Tasks ----
  const taskRows = rows.filter((r) => {
    const norm = normalizeRow(r);
    return HIER_TASK_TAGS.has(
      String(norm.tipo ?? norm.type ?? "").toLowerCase().trim()
    );
  });

  for (let i = 0; i < taskRows.length; i++) {
    const norm = normalizeRow(taskRows[i]);
    const rowLabel = `Task row ${i + 1}`;
    try {
      const name = String(norm.name ?? norm.nome ?? "").trim();
      if (!name) {
        errors.push(`${rowLabel}: name is required`);
        continue;
      }
      const projectName = String(
        norm.projectname ?? norm.projeto ?? ""
      ).trim();
      const resolvedFromCsv = await resolveProjectIdByName(projectName || null);
      const projectId = resolvedFromCsv ?? defaultProjectId ?? null;
      if (!projectId) {
        errors.push(`${rowLabel}: project "${projectName}" not found`);
        continue;
      }

      const existingId = await resolveTaskIdByName(name, projectId);
      if (existingId) {
        console.log("Skipping existing task:", name, existingId);
        continue;
      }

      let stageId = await resolveStageIdByName(
        String(norm.stagename ?? norm.etapa ?? ""),
        projectId
      );
      if (!stageId) {
        stageId = await getOrCreateBacklogStageId(projectId);
      }
      const assigneeId = await resolveTeamMemberIdByName(
        String(norm.assigneename ?? norm.responsavel ?? "")
      );

      let startDate = parseDate(
        norm.startdate ?? norm.datainicio ?? norm.inicio
      );
      let endDate = parseDate(norm.enddate ?? norm.datafim ?? norm.fim);

      if (!startDate || !endDate) {
        const fallback = findDatesInRow(norm);
        if (!startDate) startDate = fallback.start;
        if (!endDate) endDate = fallback.end;
      }

      const id = nanoid();
      await db
        .insertInto("tasks")
        .values({
          id,
          name,
          projectId,
          stageId,
          assigneeId,
          status: mapTaskStatus(norm.status),
          priority: mapTaskPriority(norm.priority ?? norm.prioridade),
          startDate,
          endDate,
        })
        .execute();

      await logActivityBatch([
        { action: "created", entityId: id, entityType: "task", projectId },
      ]);
      created++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${rowLabel}: ${msg}`);
      console.error("Hierarchical task import error:", err);
    }
  }

  // ---- Pass 4: Task Actions ----
  const actionRows = rows.filter((r) => {
    const norm = normalizeRow(r);
    return HIER_ACTION_TAGS.has(
      String(norm.tipo ?? norm.type ?? "").toLowerCase().trim()
    );
  });

  for (let i = 0; i < actionRows.length; i++) {
    const norm = normalizeRow(actionRows[i]);
    const rowLabel = `Action row ${i + 1}`;
    try {
      const title = String(
        norm.title ?? norm.titulo ?? norm.name ?? norm.nome ?? ""
      ).trim();
      if (!title) {
        errors.push(`${rowLabel}: title is required`);
        continue;
      }
      const taskName = String(norm.taskname ?? norm.tarefa ?? "").trim();
      const projectName = String(
        norm.projectname ?? norm.projeto ?? ""
      ).trim();
      const resolvedProjectFromCsv = await resolveProjectIdByName(projectName || null);
      const projectId = resolvedProjectFromCsv ?? defaultProjectId ?? null;
      const taskId = await resolveTaskIdByName(taskName || null, projectId);
      if (!taskId) {
        errors.push(`${rowLabel}: task "${taskName}" not found`);
        continue;
      }

      let dueDate = parseDate(
        norm.duedate ?? norm.prazo ?? norm.datavencimento
      );
      if (!dueDate) {
        const fallback = findDatesInRow(norm);
        dueDate = fallback.start;
      }

      const assignedTo = await resolveTeamMemberIdByName(
        String(norm.assignedtoname ?? norm.responsavel ?? "")
      );
      const id = nanoid();
      await db
        .insertInto("taskActions")
        .values({
          id,
          taskId,
          title,
          description:
            norm.description ?? norm.descricao
              ? String(norm.description ?? norm.descricao)
              : null,
          type: mapTaskActionType(norm.type ?? norm.tipo),
          status: mapTaskActionStatus(norm.status),
          dueDate,
          assignedTo,
        })
        .execute();

      await logActivityBatch([
        {
          action: "created",
          entityId: id,
          entityType: "taskAction",
          projectId,
        },
      ]);
      created++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${rowLabel}: ${msg}`);
      console.error("Hierarchical action import error:", err);
    }
  }

  // ---- Pass 5: Budget Items ----
  const budgetRows = rows.filter((r) => {
    const norm = normalizeRow(r);
    return HIER_BUDGET_TAGS.has(
      String(norm.tipo ?? norm.type ?? "").toLowerCase().trim()
    );
  });

  for (let i = 0; i < budgetRows.length; i++) {
    const norm = normalizeRow(budgetRows[i]);
    const rowLabel = `Budget row ${i + 1}`;
    try {
      const category = String(
        norm.category ?? norm.categoria ?? ""
      ).trim();
      if (!category) {
        errors.push(`${rowLabel}: category is required`);
        continue;
      }
      const projectName = String(
        norm.projectname ?? norm.projeto ?? ""
      ).trim();
      const resolvedFromCsv = await resolveProjectIdByName(projectName || null);
      const projectId = resolvedFromCsv ?? defaultProjectId ?? null;
      if (!projectId) {
        errors.push(`${rowLabel}: project "${projectName}" not found`);
        continue;
      }

      let dueDate = parseDate(
        norm.duedate ?? norm.prazo ?? norm.datavencimento
      );
      if (!dueDate) {
        const fallback = findDatesInRow(norm);
        dueDate = fallback.start;
      }

      const predictedAmount = safeNumericStr(
        norm.predictedamount ?? norm.valorprevisto
      );
      const contractedAmount = safeNumericStr(
        norm.contractedamount ?? norm.valorcontratado
      );
      const paidAmount = safeNumericStr(norm.paidamount ?? norm.valorpago);

      const id = nanoid();
      await db
        .insertInto("budgetItems")
        .values({
          id,
          projectId,
          category,
          description:
            norm.description ?? norm.descricao
              ? String(norm.description ?? norm.descricao)
              : null,
          vendor:
            norm.vendor ?? norm.fornecedor
              ? String(norm.vendor ?? norm.fornecedor)
              : null,
          status: mapBudgetItemStatus(norm.status),
          dueDate,
          predictedAmount,
          contractedAmount,
          paidAmount,
        })
        .execute();

      await logActivityBatch([
        {
          action: "created",
          entityId: id,
          entityType: "budgetItem",
          projectId,
        },
      ]);
      created++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${rowLabel}: ${msg}`);
      console.error("Hierarchical budget import error:", err);
    }
  }

  return new Response(
    superjson.stringify({ created, errors } satisfies OutputType)
  );
}