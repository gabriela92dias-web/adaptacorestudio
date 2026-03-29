import { db } from "./db";
import { nanoid } from "nanoid";
import {
  InitiativeStatus,
  ProjectStatus,
  TaskStatus,
  TaskPriority,
  StageStatus,
  EmploymentType,
  TaskActionType,
  TaskActionStatus,
  BudgetItemStatus,
} from "./schema";

// ---------------------------------------------------------------------------
// Numeric helpers
// ---------------------------------------------------------------------------

export function safeInt(val: unknown, fallback: number): number {
  if (val == null || String(val).trim() === "") return fallback;
  if (typeof val === "string" && val.includes("/")) return fallback;
  const n = Number(val);
  return isNaN(n) ? fallback : Math.round(n);
}

export function safeNumericStr(val: unknown): string | null {
  if (val == null || String(val).trim() === "") return null;
  const cleaned = String(val)
    .replace(/[^0-9.,\-]/g, "")
    .replace(",", ".");
  const n = Number(cleaned);
  return isNaN(n) ? null : String(n);
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

export function parseDate(val: unknown): Date | null {
  if (!val) return null;
  const s = String(val).trim();
  // DD/MM/YYYY
  const ddmmyyyy = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyy) {
    const d = new Date(
      `${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}T00:00:00Z`
    );
    return isNaN(d.getTime()) ? null : d;
  }
  // YYYY-MM-DD or ISO
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Scan all string values in a row for DD/MM/YYYY dates (year 2001-2099),
 * sort chronologically, return {start, end}.
 */
export function findDatesInRow(norm: Record<string, unknown>): {
  start: Date | null;
  end: Date | null;
} {
  const dates: Date[] = [];
  for (const v of Object.values(norm)) {
    if (typeof v !== "string") continue;
    const m = v.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) continue;
    const year = parseInt(m[3], 10);
    if (year < 2001 || year > 2099) continue;
    const d = new Date(`${m[3]}-${m[2]}-${m[1]}T00:00:00Z`);
    if (!isNaN(d.getTime())) dates.push(d);
  }
  dates.sort((a, b) => a.getTime() - b.getTime());
  return {
    start: dates[0] ?? null,
    end: dates[1] ?? null,
  };
}

// ---------------------------------------------------------------------------
// Row normaliser — lower-cases all keys, trims string values
// ---------------------------------------------------------------------------

export function normalizeName(name: string): string {
  if (!name) return "";
  let n = name.toLowerCase();
  n = n.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  n = n.replace(
    /\b(de|do|da|dos|das|o|a|os|as|e|em|no|na|nos|nas|para|por|com)\b/g,
    " "
  );
  n = n.replace(/\s+/g, " ").trim();
  return n;
}

export function normalizeRow(
  row: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    // Lowercase, strip accents, and remove whitespace for robust key matching
    const normalizedKey = k
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");
    out[normalizedKey] =
      typeof v === "string" ? v.trim() : v;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Enum mappers
// ---------------------------------------------------------------------------

export function mapProjectStatus(raw: unknown): ProjectStatus {
  switch (String(raw ?? "").toLowerCase().trim()) {
    case "ativo":
    case "active":
    case "em andamento":
    case "em_andamento":
      return "active";
    case "concluído":
    case "concluido":
    case "completed":
      return "completed";
    case "pausado":
    case "paused":
      return "paused";
    case "cancelado":
    case "cancelled":
      return "cancelled";
    default:
      return "active";
  }
}

export function mapTaskStatus(raw: unknown): TaskStatus {
  switch (String(raw ?? "").toLowerCase().trim()) {
    case "aberta":
    case "aberto":
    case "open":
      return "open";
    case "em andamento":
    case "em_andamento":
    case "in_progress":
      return "in_progress";
    case "concluída":
    case "concluido":
    case "concluida":
    case "completed":
      return "completed";
    case "bloqueada":
    case "bloqueado":
    case "blocked":
      return "blocked";
    case "standby":
    case "em espera":
      return "standby";
    case "atrasada":
    case "overdue":
      return "overdue";
    default:
      return "open";
  }
}

export function mapTaskPriority(raw: unknown): TaskPriority {
  switch (String(raw ?? "").toLowerCase().trim()) {
    case "alta":
    case "high":
      return "high";
    case "crítica":
    case "critica":
    case "critical":
      return "critical";
    case "baixa":
    case "low":
      return "low";
    default:
      return "medium";
  }
}

export function mapStageStatus(raw: unknown): StageStatus {
  switch (String(raw ?? "").toLowerCase().trim()) {
    case "concluída":
    case "concluida":
    case "concluído":
    case "completed":
      return "completed";
    case "em andamento":
    case "em_andamento":
    case "in_progress":
      return "in_progress";
    default:
      return "pending";
  }
}

export function mapInitiativeStatus(raw: unknown): InitiativeStatus {
  switch (String(raw ?? "").toLowerCase().trim()) {
    case "ativa":
    case "ativo":
    case "em andamento":
    case "em_andamento":
      return "em_andamento";
    case "concluída":
    case "concluido":
    case "concluida":
      return "concluida";
    case "cancelada":
    case "cancelado":
    case "recusada":
      return "recusada";
    case "aprovada":
    case "approved":
      return "aprovada";
    default:
      return "solicitada";
  }
}

export function mapEmploymentType(raw: unknown): EmploymentType {
  switch (String(raw ?? "").toLowerCase().trim()) {
    case "clt":
      return "clt";
    case "contrato de serviço":
    case "contract_service":
    case "contract":
      return "contract_service";
    case "hora":
    case "hourly":
    case "hourly_contractor":
      return "hourly_contractor";
    default:
      return "clt";
  }
}

export function mapTaskActionType(raw: unknown): TaskActionType {
  switch (String(raw ?? "").toLowerCase().trim()) {
    case "aprovação":
    case "aprovacao":
    case "approve":
      return "approve";
    case "revisão":
    case "revisao":
    case "review":
      return "review";
    case "pagamento":
    case "make_payment":
      return "make_payment";
    case "assinar documento":
    case "sign_document":
      return "sign_document";
    case "confirmar conclusão":
    case "confirmar conclusao":
    case "confirm_completion":
      return "confirm_completion";
    default:
      return "custom";
  }
}

export function mapTaskActionStatus(raw: unknown): TaskActionStatus {
  switch (String(raw ?? "").toLowerCase().trim()) {
    case "concluída":
    case "concluido":
    case "concluida":
    case "completed":
      return "completed";
    case "em andamento":
    case "em_andamento":
    case "in_progress":
      return "in_progress";
    case "recusada":
    case "rejected":
      return "rejected";
    default:
      return "pending";
  }
}

export function mapBudgetItemStatus(raw: unknown): BudgetItemStatus {
  switch (String(raw ?? "").toLowerCase().trim()) {
    case "contratado":
    case "contracted":
      return "contracted";
    case "pago":
    case "paid":
      return "paid";
    default:
      return "pending";
  }
}

// ---------------------------------------------------------------------------
// Module detection & name normalization
// ---------------------------------------------------------------------------

export function isModule(name: string): boolean {
  return /^\[?MODULO\]?\s/i.test(name);
}

export function normalizeModuleName(name: string): string {
  if (isModule(name) && !name.startsWith('[MODULO]')) {
    return `[MODULO] ${name.replace(/^\[?MODULO\]?\s*/i, '')}`;
  }
  return name;
}

// ---------------------------------------------------------------------------
// Activity logging helper
// ---------------------------------------------------------------------------

export async function logActivityBatch(
  entries: Array<{
    action: "created";
    entityId: string;
    entityType: string;
    projectId?: string | null;
  }>
): Promise<void> {
  if (entries.length === 0) return;
  try {
    await db
      .insertInto("activityLogs")
      .values(
        entries.map((e) => ({
          id: nanoid(),
          action: e.action as "created",
          entityId: e.entityId,
          entityType: e.entityType,
          projectId: e.projectId ?? null,
          performedAt: new Date(),
        }))
      )
      .execute();
  } catch (err) {
    console.error("logActivityBatch failed:", err);
  }
}

// ---------------------------------------------------------------------------
// Reference resolution helpers
// ---------------------------------------------------------------------------

export async function resolveTeamMemberIdByName(
  name: string | null | undefined
): Promise<string | null> {
  if (!name) return null;
  const row = await db
    .selectFrom("teamMembers")
    .select("id")
    .where("name", "ilike", name.trim())
    .limit(1)
    .executeTakeFirst();
  if (row) return row.id;

  const normalizedInput = normalizeName(name);
  if (!normalizedInput) return null;
  const allRows = await db.selectFrom("teamMembers").select(["id", "name"]).execute();
  const match = allRows.find((r) => normalizeName(r.name) === normalizedInput);
  return match?.id ?? null;
}

export async function resolveTeamIdByName(
  name: string | null | undefined
): Promise<string | null> {
  if (!name) return null;
  const row = await db
    .selectFrom("teams")
    .select("id")
    .where("name", "ilike", name.trim())
    .limit(1)
    .executeTakeFirst();
  if (row) return row.id;

  const normalizedInput = normalizeName(name);
  if (!normalizedInput) return null;
  const allRows = await db.selectFrom("teams").select(["id", "name"]).execute();
  const match = allRows.find((r) => normalizeName(r.name) === normalizedInput);
  return match?.id ?? null;
}

export async function resolveInitiativeIdByName(
  name: string | null | undefined
): Promise<string | null> {
  if (!name) return null;
  const row = await db
    .selectFrom("initiatives")
    .select("id")
    .where("name", "ilike", name.trim())
    .limit(1)
    .executeTakeFirst();
  if (row) return row.id;

  const normalizedInput = normalizeName(name);
  if (!normalizedInput) return null;
  const allRows = await db.selectFrom("initiatives").select(["id", "name"]).execute();
  const match = allRows.find((r) => normalizeName(r.name) === normalizedInput);
  return match?.id ?? null;
}

export async function resolveProjectIdByName(
  name: string | null | undefined
): Promise<string | null> {
  if (!name) return null;
  const row = await db
    .selectFrom("projects")
    .select("id")
    .where("name", "ilike", name.trim())
    .limit(1)
    .executeTakeFirst();
  if (row) return row.id;

  const normalizedInput = normalizeName(name);
  if (!normalizedInput) return null;
  const allRows = await db.selectFrom("projects").select(["id", "name"]).execute();
  const match = allRows.find((r) => normalizeName(r.name) === normalizedInput);
  return match?.id ?? null;
}

export async function resolveStageIdByName(
  name: string | null | undefined,
  projectId: string | null
): Promise<string | null> {
  if (!name) return null;
  let q = db
    .selectFrom("projectStages")
    .select("id")
    .where("name", "ilike", name.trim());
  if (projectId) q = q.where("projectId", "=", projectId);
  const row = await q.limit(1).executeTakeFirst();
  if (row) return row.id;

  const normalizedInput = normalizeName(name);
  if (!normalizedInput) return null;
  
  let allQ = db.selectFrom("projectStages").select(["id", "name"]);
  if (projectId) allQ = allQ.where("projectId", "=", projectId);
  const allRows = await allQ.execute();
  
  const match = allRows.find((r) => normalizeName(r.name) === normalizedInput);
  return match?.id ?? null;
}

export async function getOrCreateBacklogInitiativeId(): Promise<string> {
  const existing = await db
    .selectFrom("initiatives")
    .select("id")
    .where("name", "=", "Backlog")
    .limit(1)
    .executeTakeFirst();
  if (existing) return existing.id;

  const id = nanoid();
  await db
    .insertInto("initiatives")
    .values({
      id,
      name: "Backlog",
      status: "solicitada",
      startDate: new Date(),
    })
    .execute();
  return id;
}

export async function getOrCreateBacklogStageId(projectId: string): Promise<string> {
  const existing = await db
    .selectFrom("projectStages")
    .select("id")
    .where("name", "=", "Backlog")
    .where("projectId", "=", projectId)
    .limit(1)
    .executeTakeFirst();
  if (existing) return existing.id;

  const id = nanoid();
  await db
    .insertInto("projectStages")
    .values({
      id,
      name: "Backlog",
      projectId,
      status: "pending",
      sortOrder: 0,
    })
    .execute();
  return id;
}

export async function resolveTaskIdByName(
  name: string | null | undefined,
  projectId: string | null
): Promise<string | null> {
  if (!name) return null;
  let q = db
    .selectFrom("tasks")
    .select("id")
    .where("name", "ilike", name.trim());
  if (projectId) q = q.where("projectId", "=", projectId);
  const row = await q.limit(1).executeTakeFirst();
  if (row) return row.id;

  const normalizedInput = normalizeName(name);
  if (!normalizedInput) return null;
  
  let allQ = db.selectFrom("tasks").select(["id", "name"]);
  if (projectId) allQ = allQ.where("projectId", "=", projectId);
  const allRows = await allQ.execute();
  
  const match = allRows.find((r) => normalizeName(r.name) === normalizedInput);
  return match?.id ?? null;
}