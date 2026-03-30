import { schema, OutputType } from "./update_POST.schema";
import superjson from "superjson";
import { supabase } from "../../../helpers/supabase";
import { logActivity } from "../../../helpers/activityLogger";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    let completedAt = input.completedAt;
    if (input.status === "completed" && !completedAt) {
      completedAt = new Date();
    }

    const updates: any = {
        updatedAt: new Date().toISOString()
    };
    if (input.status !== undefined) updates.status = input.status;
    if (input.assignedTo !== undefined) updates.assignedTo = input.assignedTo;
    if (input.title !== undefined) updates.title = input.title;
    if (input.description !== undefined) updates.description = input.description;
    if (completedAt !== undefined) updates.completedAt = completedAt ? completedAt.toISOString() : null;

    const { data: updatedAction, error } = await supabase
      .from("taskActions")
      .update(updates)
      .eq("id", input.id)
      .select()
      .single();

    if (error) throw error;

    if (input.status) {
      await logActivity({
        action: "status_changed",
        entityId: updatedAction.id,
        entityType: "task_action",
        fieldChanged: "status",
        newValue: input.status,
      });
    }

    return new Response(
      superjson.stringify({ taskAction: updatedAction } satisfies OutputType)
    );
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact task-actions/update:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}