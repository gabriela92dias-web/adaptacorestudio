import { db } from "./db";
import { nanoid } from "nanoid";
import { ActivityAction } from "./schema";

export const logActivity = async (params: {
  action: ActivityAction;
  entityId: string;
  entityType: string;
  fieldChanged?: string | null;
  metadata?: any;
  newValue?: string | null;
  oldValue?: string | null;
  performedBy?: string | null;
  projectId?: string | null;
}) => {
  try {
    await db
      .insertInto("activityLogs")
      .values({
        id: nanoid(),
        action: params.action,
        entityId: params.entityId,
        entityType: params.entityType,
        fieldChanged: params.fieldChanged ?? null,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
        newValue: params.newValue ?? null,
        oldValue: params.oldValue ?? null,
        performedBy: params.performedBy ?? null,
        projectId: params.projectId ?? null,
        performedAt: new Date(),
      })
      .execute();
  } catch (error) {
    // Fire and forget - just log to console
    console.error("Failed to log activity:", error);
  }
};