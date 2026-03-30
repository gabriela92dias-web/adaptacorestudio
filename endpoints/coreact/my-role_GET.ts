import superjson from 'superjson';
import { supabase } from "../../helpers/supabase.js";

const ADMIN_TEAM_MEMBER_ID = "membro-exemplo";

export async function handle(request: Request) {
  try {
    const { data: sectorMemberships, error: smErr } = await supabase
      .from("sector_members")
      .select("sector_id, role, permissions, sectors(name)")
      .eq("member_id", ADMIN_TEAM_MEMBER_ID);

    if (smErr) throw new Error(smErr.message);

    const sectorRoles = (sectorMemberships ?? []).map((sm: any) => ({
      sectorId: sm.sector_id as string,
      sectorName: (sm.sectors?.name ?? "") as string,
      role: sm.role as string,
      permissions: (sm.permissions ?? {}) as Record<string, boolean>,
    }));

    return new Response(
      superjson.stringify({ teamMemberId: ADMIN_TEAM_MEMBER_ID, sectorRoles }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: msg }), { status: 400 });
  }
}