import { schema, OutputType } from "./create_POST.schema";
import superjson from 'superjson';
import { supabase } from "../../../helpers/supabase.js";
import { nanoid } from "nanoid";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const resolvedStatus =
      !input.solicitanteId || input.solicitanteId === input.responsibleId
        ? "aprovada"
        : "solicitada";

    const { data: newInitiative, error } = await supabase
      .from("initiatives")
      .insert({
        id: nanoid(),
        name: input.name,
        description: input.description ?? null,
        responsible_id: input.responsibleId ?? null,
        sector_id: input.sectorId ?? null,
        assigned_team_id: input.assignedTeamId ?? null,
        solicitante_id: input.solicitanteId ?? null,
        type: input.type ?? null,
        context: input.context ?? null,
        status: resolvedStatus,
        start_date: input.startDate ?? null,
        end_date: input.endDate ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return new Response(superjson.stringify({ initiative: newInitiative } satisfies OutputType));
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact/initiatives/create:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}