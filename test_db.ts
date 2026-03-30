import "./loadEnv.js";
import { db } from "./helpers/db.js";

async function run() {
  try {
    console.log("Connecting with FLOOT_DATABASE_URL:", process.env.FLOOT_DATABASE_URL);
    const authHeaders = await db.selectFrom("initiatives").selectAll().limit(1).execute();
    console.log("Success:", authHeaders);
  } catch (error) {
    if (error instanceof Error) {
      console.error("ERROR MESSAGE:", error.message);
      console.error("STACK:", error.stack);
    } else {
      console.error("UNKNOWN ERROR:", error);
    }
  } finally {
    process.exit(0);
  }
}

run();
