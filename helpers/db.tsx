import fs from 'fs';
import path from 'path';
import {Kysely, CamelCasePlugin} from 'kysely'
import {PostgresJSDialect} from 'kysely-postgres-js'
import {DB} from './schema'
import postgres from 'postgres'
import dns from 'node:dns'

dns.setDefaultResultOrder('ipv4first')

let DATABASE_URL = 
  process.env.DATABASE_URL ||       // Padrão Render/Railway
  process.env.SUPABASE_DB_URL ||    // Supabase Transaction Pooler
  process.env.FLOOT_DATABASE_URL || // Legado
  '';

if (!DATABASE_URL) {
  try {
    const envPath = path.resolve(process.cwd(), 'env.json');
    if (fs.existsSync(envPath)) {
      const envConfig = JSON.parse(fs.readFileSync(envPath, 'utf8'));
      DATABASE_URL = envConfig.DATABASE_URL || envConfig.SUPABASE_DB_URL || envConfig.FLOOT_DATABASE_URL || '';
    }
  } catch (e) {
    console.error('[db] AVISO: Falha ao ler env.json', e);
  }
}

if (!DATABASE_URL) {
  console.error('[db] AVISO: Nenhuma variável de banco de dados encontrada. Configure DATABASE_URL no ambiente.');
}

export const db = new Kysely<DB>({
  plugins: [new CamelCasePlugin()],
  dialect: new PostgresJSDialect({
    postgres: postgres(DATABASE_URL, {
      prepare: false,
      idle_timeout: 10,
      max: 3,
      ssl: { rejectUnauthorized: false },
      fetch_types: false,
      connect_timeout: 15,
    }),
  }),
})
