import postgres from 'postgres';
import fs from 'fs';

const envText = fs.readFileSync('env.json', 'utf8');
const env = JSON.parse(envText);

const sql = postgres(env.FLOOT_DATABASE_URL, { max: 1 });

async function run() {
  try {
    const authRes = await sql`
      UPDATE auth.users 
      SET encrypted_password = crypt('CoreStudio!2026', gen_salt('bf'))
      WHERE email = 'gabriela92dias@gmail.com'
      RETURNING id, email;
    `;
    console.log("Password Updated:", authRes);
  } catch (e) {
    console.error("error", e);
  } finally {
    await sql.end();
  }
}

run();
