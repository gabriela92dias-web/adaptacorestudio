import postgres from 'postgres';
import fs from 'fs';

// Load from env.json if it exists (local test)
if (fs.existsSync('./env.json')) {
  const env = JSON.parse(fs.readFileSync('./env.json', 'utf8'));
  Object.assign(process.env, env);
}

const sql = postgres(process.env.FLOOT_DATABASE_URL, { ssl: 'require' });

async function query() {
  try {
    console.log("Checking Users...");
    const users = await sql`SELECT id, email, display_name, role FROM public.users`;
    console.log("Users:", users);

    console.log("Checking Team Members...");
    const teamMembers = await sql`SELECT id, name, user_id, email FROM public.team_members`;
    console.log("Team Members:", teamMembers);

    console.log("Checking Sector Members...");
    const sectorMembers = await sql`SELECT id, sector_id, member_id, role FROM public.sector_members`;
    console.log("Sector Members:", sectorMembers);

  } catch (err) {
    console.error("Query failed:", err);
  } finally {
    await sql.end();
  }
}

query();
