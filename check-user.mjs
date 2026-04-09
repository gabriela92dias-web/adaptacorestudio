import postgres from 'postgres';
import fs from 'fs';

const envText = fs.readFileSync('env.json', 'utf8');
const env = JSON.parse(envText);

const sql = postgres(env.FLOOT_DATABASE_URL, { max: 1 });

async function run() {
  try {
    const authRes = await sql`
      SELECT id, email, confirmed_at, created_at
      FROM auth.users 
      WHERE email LIKE '%gabriela%';
    `;
    console.log("Auth Record:", authRes);
  } catch (e) {
    console.error("error", e);
  } finally {
    await sql.end();
  }
}

run();
