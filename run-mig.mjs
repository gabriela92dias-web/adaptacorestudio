import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

const sql = postgres('postgresql://postgres.kshybgeyetkkufkmjugz:jm-MHJrd3kfS*f*@aws-1-sa-east-1.pooler.supabase.com:5432/postgres', { max: 1 });

async function run() {
  try {
    console.log("Running schema migration...");
    await sql.file(path.resolve('db-fixed.sql'));
    console.log("SCHEMA OK");
    console.log("Running seed inserts...");
    await sql.file(path.resolve('db-inserts.sql'));
    console.log("INSERTS OK");
  } catch (e) {
    console.error("Migration failed:", e);
  } finally {
    await sql.end();
  }
}
run();
