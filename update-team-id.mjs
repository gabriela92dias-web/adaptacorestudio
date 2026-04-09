import postgres from 'postgres';
import fs from 'fs';

const envText = fs.readFileSync('env.json', 'utf8');
const env = JSON.parse(envText);

const sql = postgres(env.FLOOT_DATABASE_URL, { max: 1 });

async function run() {
  try {
    const res = await sql`
      UPDATE team_members 
      SET id = 'b7abfd4e-859b-4af7-8b98-3a1865452d47'
      WHERE id = 'membro-exemplo'
      RETURNING id, name, role;
    `;
    console.log("Team Member Updated:", res);
  } catch (e) {
    console.error("error", e);
  } finally {
    await sql.end();
  }
}

run();
