import postgres from 'postgres';
import fs from 'fs';

const envText = fs.readFileSync('env.json', 'utf8');
const env = JSON.parse(envText);

const sql = postgres(env.FLOOT_DATABASE_URL, { max: 1 });

async function run() {
  try {
    // Check if the user is in team_members
    const teamRes = await sql`
      SELECT id, email, name, role
      FROM team_members 
      WHERE id = 'b7abfd4e-859b-4af7-8b98-3a1865452d47' OR email LIKE '%gabriela%';
    `;
    console.log("Team Record:", teamRes);
  } catch (e) {
    console.error("error", e);
  } finally {
    await sql.end();
  }
}

run();
