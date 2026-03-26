import postgres from 'postgres';

const sql = postgres('postgresql://postgres:TOZcqRzSI5YgmRQU@db.kshybgeyetkkufkmjugz.supabase.co:5432/postgres', { max: 1 });

async function run() {
  try {
    console.log("Applying admin upgrade patch...");
    
    // Elevate user 'gabriela'
    const res1 = await sql`
      UPDATE team_members 
      SET 
        name = 'Gabriela Dias',
        role = 'admin'
      WHERE email = 'gabriela92dias@gmail.com'
      RETURNING id, name, role;
    `;
    console.log("Team Member Update:", res1);

    // Assign to Marketing/Comunicacao sector if it exists
    const res2 = await sql`
      UPDATE sectors 
      SET manager_id = (SELECT id FROM team_members WHERE email = 'gabriela92dias@gmail.com')
      WHERE name ILIKE '%Comunica__o%' OR name ILIKE '%Marketing%'
      RETURNING id, name, manager_id;
    `;
    console.log("Sector Manager Update:", res2);

    console.log("PATCH APPLIED SUCCESSFULLY");
  } catch (e) {
    console.error("Patch failed:", e);
  } finally {
    await sql.end();
  }
}

run();
