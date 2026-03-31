import { schema, OutputType } from "./list_GET.schema";
import superjson from 'superjson';
import { camelizeKeys } from "../../../helpers/dataUtils.js";
import { supabase } from "../../../helpers/supabase.js";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    
    // Parse input properly taking schema into account
    let parsedInput: any = {};
    if (inputStr) {
      try { parsedInput = superjson.parse(inputStr); } catch {}
    }
    
    const projectId = parsedInput?.projectId ?? null;
    const includeActions = parsedInput?.includeActions || parsedInput?.withActions || false;

    let selectQuery = `
      *,
      assignee:team_members!tasks_assignee_id_fkey ( id, name, initials ),
      project:projects ( id, name )
    `;
    
    if (includeActions) {
      selectQuery += ", actions:task_actions(*, executions(*))";
    }

    let query = supabase
      .from("tasks")
      .select(selectQuery)
      .order("created_at", { ascending: false });

    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    const { data: tasks, error } = await query;
    if (error) {
       throw error;
    }

    const mapped = (tasks ?? []).map((t: any) => {
      const camelT = camelizeKeys(t);
      camelT.assigneeName = t.assignee?.name ?? null;
      camelT.assigneeInitials = t.assignee?.initials ?? null;
      camelT.projectName = t.project?.name ?? null;
      delete camelT.assignee;
      delete camelT.project;
      return camelT;
    });

    return new Response(
      superjson.stringify({ tasks: mapped } satisfies OutputType),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("TASKS LIST GET ERROR:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}