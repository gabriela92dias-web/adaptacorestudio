import {Kysely, CamelCasePlugin} from 'kysely'
import {PostgresJSDialect} from 'kysely-postgres-js'
import {DB} from './schema'
import postgres from 'postgres'
import dns from 'node:dns'

dns.setDefaultResultOrder('ipv4first')

// Suporta múltiplas env vars de connection string para compatibilidade com 
// diferentes ambientes (Render, Railway, Supabase, local, etc.)
const DATABASE_URL = 
  process.env.DATABASE_URL ||       // Padrão Render/Railway
  process.env.SUPABASE_DB_URL ||    // Supabase Transaction Pooler
  process.env.FLOOT_DATABASE_URL || // Legado
  '';

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
