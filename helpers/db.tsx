import superjson from "superjson";
import { supabase } from "../../helpers/supabase.js";

const DEV_TEAM_MEMBER_ID = "membro-exemplo";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    if (inputStr) {
      try {
        const parsed = superjson.parse(inputStr) as any;
        if (parsed?.month) month = parsed.month;
        if (parsed?.year) year = parsed.year;
      } catch {}
    }

    const startOfMonth = new Date(year, month - 1, 1).toISOString();
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

    const { data: tasks, error: tErr } = await supabase
      .from("tasks")
      .select(`id, name, start_date, end_date, status, priority, projects(name), team_members!tasks_assignee_id_fkey(name)`)
      .or(`and(start_date.lte.${endOfMonth},end_date.gte.${startOfMonth}),and(start_date.lte.${endOfMonth},end_date.is.null),and(start_date.is.null,end_date.gte.${startOfMonth})`)
      .limit(200);

    if (tErr) throw new Error(tErr.message);

    const agendaTasks = (tasks ?? []).map((t: any) => ({
      id: t.id,
      name: t.name,
      startDate: t.start_date ? new Date(t.start_date) : null,
      endDate: t.end_date ? new Date(t.end_date) : null,
      status: t.status ?? null,
      priority: t.priority ?? null,
      projectName: t.projects?.name ?? null,
      assigneeName: t.team_members?.name ?? null,
    }));

    return new Response(
      superjson.stringify({ tasks: agendaTasks, teamMemberId: DEV_TEAM_MEMBER_ID }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}
