import postgres from 'postgres';
import './loadEnv.js';

async function run() {
  console.log('Connecting to DB with connection string:', process.env.DATABASE_URL);
  
  const sql = postgres(process.env.DATABASE_URL, {
    connect_timeout: 3,
    idle_timeout: 3,
    max_lifetime: 3
  });

  try {
    console.log('Connected! Checking query...');
    const res = await sql`SELECT NOW()`;
    console.log(res);
  } catch (err) {
    console.error('Connection error', err.message);
  } finally {
    await sql.end();
  }
}

run();
