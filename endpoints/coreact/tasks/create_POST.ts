import { schema, OutputType } from "./create_POST.schema";
import superjson from 'superjson';
import { supabase } from "../../../helpers/supabase.js";
import { nanoid } from "nanoid";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const newId = nanoid();

    const { data: newTask, error } = await supabase
      .from("tasks")
      .insert({
        id: newId,
        project_id: input.projectId,
        name: input.name,
        assignee_id: input.assigneeId ?? null,
        status: input.status,
        priority: input.priority,
        start_date: input.startDate ? input.startDate.toISOString().split('T')[0] : null,
        end_date: input.endDate ? input.endDate.toISOString().split('T')[0] : null,
        progress: input.progress,
        assigned_team_id: input.assignedTeamId ?? null,
        stage_id: input.stageId,
        shift: input.shift,
      })
      .select()
      .single();

    if (error) {
      console.error("[tasks/create] Supabase error:", error);
      return new Response(
        superjson.stringify({ error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Log activity (fire and forget — não bloqueia resposta)
    supabase.from("activity_logs").insert({
      id: nanoid(),
      action: "created",
      entity_id: newId,
      entity_type: "task",
      project_id: input.projectId,
      new_value: input.name,
      performed_at: new Date().toISOString(),
    }).then(({ error: logErr }) => {
      if (logErr) console.error("[tasks/create] Activity log error:", logErr);
    });

    return new Response(superjson.stringify({ task: newTask } as OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact/tasks/create:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}