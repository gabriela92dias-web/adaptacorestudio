import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { Initiatives, InitiativeStatusArrayValues } from "../../../helpers/schema";

export const schema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional().nullable(),
  responsibleId: z.string().optional().nullable(),
  sectorId: z.string().optional().nullable(),
  assignedTeamId: z.string().optional().nullable(),
  solicitanteId: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  context: z.string().optional().nullable(),
  status: z.enum(InitiativeStatusArrayValues).optional(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  initiative: Selectable<Initiatives>;
};

export const postCoreactInitiativesUpdate = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/coreact/initiatives/update`, {
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