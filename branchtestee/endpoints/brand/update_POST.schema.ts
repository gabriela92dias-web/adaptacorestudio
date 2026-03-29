import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { Brands } from "../../helpers/schema";

export const schema = z.object({
  companyName: z.string().optional(),
  contactName: z.string().optional(),
  role: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  logoBgColor: z.string().optional(),
  logoBgOpacity: z.number().optional(),
  logoPlusColor: z.string().optional(),
  logoPlusOpacity: z.number().optional(),
  logoAdColor: z.string().optional(),
  logoAdOpacity: z.number().optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  brand: Selectable<Brands>;
};

export const postUpdateBrand = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/brand/update`, {
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