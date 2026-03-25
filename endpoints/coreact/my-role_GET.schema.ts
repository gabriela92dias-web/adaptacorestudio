import { z } from "zod";
import superjson from 'superjson';
import { SectorMemberRoleArrayValues } from "../../helpers/schema";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  teamMemberId: string | null;
  sectorRoles: Array<{
    sectorId: string;
    sectorName: string;
    role: typeof SectorMemberRoleArrayValues[number];
    permissions: Record<string, boolean>;
  }>;
};

export const getCoreactMyRole = async (input: InputType = {}, init?: RequestInit): Promise<OutputType> => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const url = new URL(`/_api/coreact/my-role`, baseUrl);
  
  const result = await fetch(url.toString(), {
    method: "GET",
    ...init,
    headers: {
      "Accept": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse<{ error: string }>(await result.text());
    throw new Error(errorObject.error);
  }
  return superjson.parse<OutputType>(await result.text());
};