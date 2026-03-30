import {Kysely, CamelCasePlugin} from 'kysely'
import {PostgresJSDialect} from 'kysely-postgres-js'
import {DB} from './schema'
import postgres from 'postgres'
import dns from 'node:dns'

// Force IPv4 — Render hangs on Supabase pooler via IPv6
dns.setDefaultResultOrder('ipv4first')

export const db = new Kysely<DB>({
  plugins: [new CamelCasePlugin()],
  dialect: new PostgresJSDialect({
    postgres: postgres(process.env.FLOOT_DATABASE_URL as string, {
      prepare: false,
      idle_timeout: 10,
      max: 3,
      ssl: { rejectUnauthorized: false },
      fetch_types: false,
    }),
  }),
})
