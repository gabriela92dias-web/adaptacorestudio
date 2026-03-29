import postgres from 'postgres';
import fs from 'fs';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');

let config;
try {
  config = JSON.parse(fs.readFileSync('env.json', 'utf8'));
} catch (e) {
  console.log("no env.json");
}
const sql = postgres({
  host: 'aws-1-sa-east-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.kshybgeyetkkufkmjugz',
  pass: 'TOZcqRzSI5YgmRQU',
  ssl: 'require',
  max: 1
});

async function run() {
  try {
    const rawSql = fs.readFileSync('db-v8.sql', 'utf8');
    await sql.unsafe(rawSql);
    console.log("V8 SCHEMA OK");
  } catch (e) {
    console.error("Migration failed:", e.message || e);
  } finally {
    await sql.end();
  }
}
run();
