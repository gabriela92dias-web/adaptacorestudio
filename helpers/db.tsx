import {Kysely, CamelCasePlugin} from 'kysely'
import {PostgresJSDialect} from 'kysely-postgres-js'
import {DB} from './schema.js'
import postgres from 'postgres'
import dns from 'node:dns'
import '../loadEnv.js' // 🚨 AI WARNING: DO NOT REMOVE THIS IMPORT. It guarantees env vars are loaded before Kysely initializes on Render/Node.

// 🚨 AI WARNING: DO NOT REMOVE ipv4first order. Vital for Supabase connection pooler in Node 24+.
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
} else {
  console.log('[db] Conectando ao banco de dados URL:', DATABASE_URL.replace(/:([^:@]+)@/, ':***@'));
}

export const db = new Kysely<DB>({
  plugins: [new CamelCasePlugin()],
  dialect: new PostgresJSDialect({
    postgres: postgres(DATABASE_URL, {
      max: 3
      // 🚨 AI WARNING: NEVER ADD `prepare: false` ou `fetch_types: false` AQUI. 
      // Isso causa Infinite Loop Handshake (Hang) no Node 24 + Supabase Pooler IPv4.
    }),
  }),
})
