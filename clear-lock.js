import fs from "fs";
import postgres from "postgres";

const env = JSON.parse(fs.readFileSync("./env.json", "utf-8"));
const sql = postgres(env.FLOOT_DATABASE_URL);

async function clearLocks() {
  await sql`DELETE FROM login_attempts`;
  console.log("All login rate limit locks cleared!");
  process.exit(0);
}

clearLocks();
