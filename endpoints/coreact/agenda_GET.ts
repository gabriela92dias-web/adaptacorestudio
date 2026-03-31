import { schema, OutputType } from "./agenda_GET.schema";
import superjson from 'superjson';
import { supabase } from "../../helpers/supabase";
import { getServerUserSession } from "../../helpers/getServerUserSession";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);

    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    const json = inputStr ? superjson.parse(inputStr) : { month: new Date().getMonth() + 1, year: new Date().getFullYear() };
    const input = schema.parse(json);

    const { data: teamMember } = await supabase
      .from("team_members")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!teamMember) {
      return new Response(superjson.stringify({ tasks: [], teamMemberId: null } satisfies OutputType));
    }

    const { data: tasks } = await supabase
      .from("tasks")
      .select("*, team_members(id, name, initials)")
      .eq("assignee_id", teamMember.id);

    return new Response(superjson.stringify({ tasks: tasks ?? [], teamMemberId: teamMember.id } satisfies OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
