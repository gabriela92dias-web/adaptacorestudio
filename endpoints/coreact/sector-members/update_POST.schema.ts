import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { SectorMembers, SectorMemberRoleArrayValues } from "../../../helpers/schema";

export const schema = z.object({
  id: z.string().min(1, "Sector Member ID is required"),
  role: z.enum(SectorMemberRoleArrayValues).optional(),
  permissions: z.record(z.string(), z.boolean()).optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  sectorMember: Selectable<SectorMembers>;
};

export const postCoreactSectorMembersUpdate = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/sector-members/update`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse<{ error: string }>(await result.text());
    throw new Error(errorObject.error);
  }
  return superjson.parse<OutputType>(await result.text());
};