import superjson from 'superjson';
import { camelizeKeys } from "../../../helpers/dataUtils.js";
import { supabase } from "../../../helpers/supabase.js";



export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const inputStr = url.searchParams.get("input");
    let sectorIdFilter: string | null = null;
    if (inputStr) {
      try { sectorIdFilter = (superjson.parse(inputStr) as any)?.sectorId ?? null; } catch {}
    }

    let query = supabase
      .from("sector_members")
      .select(`
        id,
        sector_id,
        member_id,
        role,
        permissions,
        created_at,
        sectors ( name ),
        team_members ( name, initials, email, status )
      `)
      .order("created_at", { ascending: false });

    if (sectorIdFilter) query = (query as any).eq("sector_id", sectorIdFilter);

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);

    const sectorMembers = (rows ?? []).map((sm: any) => {
      const rawPerms = sm.permissions;
      const permissions = typeof rawPerms === "string" ? JSON.parse(rawPerms) : (rawPerms ?? {});
      return {
        id: sm.id,
        sectorId: sm.sector_id,
        sectorName: sm.sectors?.name ?? null,
        memberId: sm.member_id,
        memberName: sm.team_members?.name ?? null,
        memberInitials: sm.team_members?.initials ?? null,
        memberEmail: sm.team_members?.email ?? null,
        memberStatus: sm.team_members?.status ?? null,
        role: sm.role,
        permissions,
        createdAt: sm.created_at,
      };
    });

    return new Response(
      superjson.stringify({ sectorMembers }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}