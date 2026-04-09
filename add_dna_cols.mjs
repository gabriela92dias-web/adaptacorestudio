import postgres from 'postgres';
import fs from 'fs';

let url = "";
try {
  const env = JSON.parse(fs.readFileSync('env.json', 'utf8'));
  url = env.FLOOT_DATABASE_URL;
} catch(e) {
  console.log(e);
}

const sql = postgres(url, { ssl: { rejectUnauthorized: false } });

async function run() {
  try {
    await sql`ALTER TABLE public.campaigns ADD COLUMN dna_direcao TEXT;`;
    console.log("Added dna_direcao");
  } catch(e) { console.log(e.message); }

  try {
    await sql`ALTER TABLE public.campaigns ADD COLUMN dna_experiencia TEXT;`;
    console.log("Added dna_experiencia");
  } catch(e) { console.log(e.message); }

  try {
    await sql`ALTER TABLE public.campaigns ADD COLUMN dna_modulos JSONB;`;
    console.log("Added dna_modulos");
  } catch(e) { console.log(e.message); }

  process.exit(0);
}

run();
