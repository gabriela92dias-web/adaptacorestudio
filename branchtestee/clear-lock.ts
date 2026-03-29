import fs from "fs";
const env = JSON.parse(fs.readFileSync("./env.json", "utf-8"));
process.env.FLOOT_DATABASE_URL = env.FLOOT_DATABASE_URL;

import { db } from "./helpers/db.js";

async function clearLocks() {
  await db.deleteFrom("loginAttempts").execute();
  console.log("All login rate limit locks cleared!");
  process.exit(0);
}

clearLocks();
