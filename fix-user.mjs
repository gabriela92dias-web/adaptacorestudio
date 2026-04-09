import postgres from 'postgres';
import fs from 'fs';

const envText = fs.readFileSync('env.json', 'utf8');
const env = JSON.parse(envText);

const sql = postgres(env.FLOOT_DATABASE_URL, { max: 1 });

async function run() {
  try {
    console.log("Confirming user and setting admin rights...");
    
    // Auto-confirm user in auth.users
    const authRes = await sql`
      UPDATE auth.users 
      SET 
        email_confirmed_at = NOW()
      WHERE email = 'gabriela92dias@gmail.com'
      RETURNING id, email, email_confirmed_at;
    `;
    console.log("Auth Confirmation:", authRes);

    // Upsert into team_members to ensure the user exists as an admin
    if (authRes.length > 0) {
      const teamRes = await sql`
        INSERT INTO team_members (id, email, name, role)
        VALUES (${authRes[0].id}, 'gabriela92dias@gmail.com', 'Gabriela Dias', 'admin')
        ON CONFLICT (id) DO UPDATE 
        SET role = 'admin', name = 'Gabriela Dias'
        RETURNING id, name, role;
      `;
      console.log("Team Member Upsert:", teamRes);
    }

    console.log("ALL PATCHES APPLIED SUCCESSFULLY");
  } catch (e) {
    console.error("Patch failed:", e);
  } finally {
    await sql.end();
  }
}

run();
