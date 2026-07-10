// One-time (idempotent) schema setup for the guestbook. Run with
// `npm run guestbook:setup`; needs DATABASE_URL in .env.local.
import { neon } from '@neondatabase/serverless'
import { GUESTBOOK_SCHEMA_STATEMENTS, resolveDatabaseUrl } from '../src/lib/guestbook-db.ts'

const url = resolveDatabaseUrl()
if (!url) {
  console.error(
    'guestbook:setup failed: no DATABASE_URL (or single *_DATABASE_URL) is set — see .env.example'
  )
  process.exit(1)
}

try {
  const sql = neon(url)
  for (const statement of GUESTBOOK_SCHEMA_STATEMENTS) {
    await sql.query(statement)
  }
  console.log('Guestbook schema is in place (tables + indexes, idempotent).')
} catch (error) {
  console.error(`guestbook:setup failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
