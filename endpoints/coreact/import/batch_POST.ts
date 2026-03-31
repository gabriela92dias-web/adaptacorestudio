import { schema, OutputType } from "./batch_POST.schema";
import superjson from "superjson";
import { handleFlat, FlatEntityType } from "../../../helpers/importFlatHandler";
import { handleHierarchical } from "../../../helpers/importHierarchicalHandler";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    if (input.rows.length === 0) {
      return new Response(
        superjson.stringify({ created: 0, errors: [] } satisfies OutputType)
      );
    }

    if (input.entityType === "hierarchical") {
      return await handleHierarchical(input.rows, input.defaultProjectId, input.defaultInitiativeId);
    }

    return await handleFlat(input.entityType as FlatEntityType, input.rows, input.defaultProjectId, input.defaultInitiativeId);
  } catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}