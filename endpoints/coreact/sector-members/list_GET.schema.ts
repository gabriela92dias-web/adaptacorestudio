import { z } from "zod";
import superjson from 'superjson';
import { SectorMemberRoleArrayValues, TeamMemberStatusArrayValues } from "../../../helpers/schema";

export const schema = z.object({
  sectorId: z.string().optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  sectorMembers: Array<{
    id: string;
    sectorId: string;
    sectorName: string;
    memberId: string;
    memberName: string;
    memberInitials: string | null;
    memberEmail: string | null;
    memberStatus: typeof TeamMemberStatusArrayValues[number];
    role: typeof SectorMemberRoleArrayValues[number];
    permissions: Record<string, boolean>;
    createdAt: Date;
  }>;
};

export const getCoreactSectorMembersList = async (input: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(input);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const url = new URL(`/_api/coreact/sector-members/list`, baseUrl);
  url.searchParams.set("input", superjson.stringify(validatedInput));

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