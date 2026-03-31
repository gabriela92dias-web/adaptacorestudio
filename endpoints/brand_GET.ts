import { OutputType } from "./brand_GET.schema";
import superjson from 'superjson';
import { db } from "../helpers/db";

export async function handle(request: Request) {
  try {
    const brand = await db
      .selectFrom("brands")
      .selectAll()
      .limit(1)
      .executeTakeFirst();

    return new Response(superjson.stringify({ brand: brand ?? null } satisfies OutputType));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: message }), { status: 400 });
  }
}