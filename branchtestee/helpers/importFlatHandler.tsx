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
  mapInitiativeStatus,
  mapEmploymentType,
  logActivityBatch,
  resolveTeamMemberIdByName,
  resolveTeamIdByName,
        resolveInitiativeIdByName,
  resolveProjectIdByName,
  resolveStageIdByName,
  isModule,
  normalizeModuleName,
  getOrCreateBacklogInitiativeId,
  getOrCreateBacklogStageId,
} from "./importUtils";

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

export type FlatEntityType =
  | "teamMembers"
  | "initiatives"
  | "projects"
  | "stages"
  | "tasks";

export async function handleFlat(
  entityType: FlatEntityType,
  rows: Record<string, unknown>[],
  defaultProjectId?: string,
  defaultInitiativeId?: string
): Promise<Response> {
  const errors: string[] = [];
  let created = 0;

  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i];
    const norm = normalizeRow(raw);
    const rowLabel = `Row ${i + 1}`;

    try {
      if (entityType === "teamMembers") {
        const name = String(norm.name ?? norm.nome ?? "").trim();
        if (!name) {
          errors.push(`${rowLabel}: name is required`);
          continue;
        }
        const id = nanoid();
        await db
          .insertInto("teamMembers")
          .values({
            id,
            name,
            fullName: String(norm.fullname ?? norm.nomecompleto ?? name),
            email: norm.email ? String(norm.email) : null,
            phone:
              norm.phone ?? norm.telefone
                ? String(norm.phone ?? norm.telefone)
                : null,
            nickname:
              norm.nickname ?? norm.apelido
                ? String(norm.nickname ?? norm.apelido)
                : null,
            role:
              norm.role ?? norm.cargo
                ? String(norm.role ?? norm.cargo)
                : null,
            employmentType: mapEmploymentType(
              norm.employmenttype ?? norm.tipocontratacao
            ),
            capacityHours: safeInt(
              norm.capacityhours ?? norm.capacidade,
              40
            ).toString(),
            status: "active",
          })
          .execute();

        await logActivityBatch([
          { action: "created", entityId: id, entityType: "teamMember" },
        ]);
        created++;
      } else if (entityType === "initiatives") {
        const name = String(norm.name ?? norm.nome ?? "").trim();
        if (!name) {
          errors.push(`${rowLabel}: name is required`);
          continue;
        }
        const id = nanoid();
        const responsibleId = await resolveTeamMemberIdByName(
          String(norm.responsiblename ?? norm.responsavel ?? "")
        );
        await db
          .insertInto("initiatives")
          .values({
            id,
            name,
            description:
              norm.description ?? norm.descricao
                ? String(norm.description ?? norm.descricao)
                : null,
            status: mapInitiativeStatus(norm.status),
            startDate: parseDate(
              norm.startdate ?? norm.datainicio ?? norm.inicio
            ),
            endDate: parseDate(
              norm.enddate ?? norm.datafim ?? norm.fim
            ),
            responsibleId,
          })
          .execute();

        await logActivityBatch([
          { action: "created", entityId: id, entityType: "initiative" },
        ]);
        created++;
      } else if (entityType === "projects") {
        if (defaultProjectId) {
          errors.push(`${rowLabel}: Criação de projetos ignorada quando defaultProjectId está ativo`);
          continue;
        }
        const rawName = String(norm.name ?? norm.nome ?? "").trim();
        const name = normalizeModuleName(rawName);
        if (!name) {
          errors.push(`${rowLabel}: name is required`);
          continue;
        }
        const isMod = isModule(name);
        const id = nanoid();
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
            initiativeId = defaultInitiativeId ?? null;
          }
        }
        if (!initiativeId) {
          initiativeId = await getOrCreateBacklogInitiativeId();
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
        const resolvedStartDate = startDate ?? new Date();

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
            startDate: resolvedStartDate,
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
      } else if (entityType === "stages") {
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

        let stageStartDate = parseDate(
          norm.startdate ?? norm.datainicio ?? norm.inicio
        );
        let stageEndDate = parseDate(norm.enddate ?? norm.datafim ?? norm.fim);
        if (!stageStartDate || !stageEndDate) {
          const fallback = findDatesInRow(norm);
          if (!stageStartDate) stageStartDate = fallback.start;
          if (!stageEndDate) stageEndDate = fallback.end;
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
            startDate: stageStartDate,
            endDate: stageEndDate,
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
      } else if (entityType === "tasks") {
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
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${rowLabel}: ${msg}`);
      console.error(`Import flat ${entityType} row ${i + 1} error:`, err);
    }
  }

  return new Response(
    superjson.stringify({ created, errors } satisfies OutputType)
  );
}