// Data layer for the guestbook, backed by Neon Postgres. Server-only: used by
// the API routes and the local setup/moderation scripts, never by client
// components. All queries go through the neon() tagged template, which
// parameterizes every interpolation — no string-built SQL anywhere.
import { neon } from '@neondatabase/serverless'
import type { GuestbookEntry } from './types'
// Explicit .ts extension so plain Node (the local scripts) can resolve this
// module too, not just the bundler and jest.
import { CHALLENGE_TTL_MINUTES, sha256Hex } from './proof-of-work.ts'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type SqlClient = ReturnType<typeof neon>

let cachedSql: SqlClient | null = null

export function isGuestbookConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

function getSql(): SqlClient {
  if (!cachedSql) {
    const url = process.env.DATABASE_URL
    if (!url) {
      throw new Error('DATABASE_URL is not configured')
    }
    cachedSql = neon(url)
  }
  return cachedSql
}

/** For tests only: drop the cached client so env changes take effect. */
export function resetGuestbookDbForTests(): void {
  cachedSql = null
}

/** Salted hash so raw visitor IPs are never stored anywhere. */
export async function hashIp(ip: string): Promise<string> {
  const salt = process.env.GUESTBOOK_IP_SALT ?? 'guestbook-dev-salt'
  return sha256Hex(`${salt}:${ip}`)
}

type EntryRow = {
  id: number
  name: string
  message: string
  visiting_from: string | null
  created_at: string | Date
}

function toPublicEntry(row: EntryRow): GuestbookEntry {
  return {
    id: Number(row.id),
    name: row.name,
    message: row.message,
    ...(row.visiting_from ? { visitingFrom: row.visiting_from } : {}),
    createdAt: new Date(row.created_at).toISOString(),
  }
}

export async function getApprovedEntries(limit = 50): Promise<GuestbookEntry[]> {
  const sql = getSql()
  const rows = (await sql`
    SELECT id, name, message, visiting_from, created_at
    FROM guestbook_entries
    WHERE status = 'approved'
    ORDER BY created_at DESC
    LIMIT ${limit}
  `) as EntryRow[]
  return rows.map(toPublicEntry)
}

export async function createChallenge(salt: string): Promise<{ id: string }> {
  const sql = getSql()
  // Opportunistic hygiene: expired challenges have no value, drop them.
  await sql`
    DELETE FROM guestbook_challenges
    WHERE created_at < now() - make_interval(mins => ${CHALLENGE_TTL_MINUTES * 4})
  `
  const rows = (await sql`
    INSERT INTO guestbook_challenges (salt) VALUES (${salt}) RETURNING id
  `) as { id: string }[]
  return { id: rows[0].id }
}

/** Atomically claim an unused, unexpired challenge. Returns its salt and
 *  creation time, or null if it never existed, expired, or was already spent. */
export async function consumeChallenge(
  id: string
): Promise<{ salt: string; createdAt: Date } | null> {
  if (!UUID_PATTERN.test(id)) return null
  const sql = getSql()
  const rows = (await sql`
    UPDATE guestbook_challenges
    SET used_at = now()
    WHERE id = ${id}
      AND used_at IS NULL
      AND created_at > now() - make_interval(mins => ${CHALLENGE_TTL_MINUTES})
    RETURNING salt, created_at
  `) as { salt: string; created_at: string | Date }[]
  if (rows.length === 0) return null
  return { salt: rows[0].salt, createdAt: new Date(rows[0].created_at) }
}

export async function countRecentByIp(ipHash: string, minutes: number): Promise<number> {
  const sql = getSql()
  const rows = (await sql`
    SELECT count(*)::int AS count FROM guestbook_entries
    WHERE ip_hash = ${ipHash} AND created_at > now() - make_interval(mins => ${minutes})
  `) as { count: number }[]
  return rows[0]?.count ?? 0
}

export async function countRecentTotal(minutes: number): Promise<number> {
  const sql = getSql()
  const rows = (await sql`
    SELECT count(*)::int AS count FROM guestbook_entries
    WHERE created_at > now() - make_interval(mins => ${minutes})
  `) as { count: number }[]
  return rows[0]?.count ?? 0
}

export async function insertPendingEntry(entry: {
  name: string
  message: string
  visitingFrom?: string
  ipHash: string
}): Promise<void> {
  const sql = getSql()
  await sql`
    INSERT INTO guestbook_entries (name, message, visiting_from, status, ip_hash)
    VALUES (${entry.name}, ${entry.message}, ${entry.visitingFrom ?? null}, 'pending', ${entry.ipHash})
  `
}

// ── Moderation (local scripts only) ─────────────────────────────────────────

export type PendingEntry = GuestbookEntry & { status: string }

export async function listPendingEntries(): Promise<PendingEntry[]> {
  const sql = getSql()
  const rows = (await sql`
    SELECT id, name, message, visiting_from, created_at, status
    FROM guestbook_entries
    WHERE status = 'pending'
    ORDER BY created_at ASC
  `) as (EntryRow & { status: string })[]
  return rows.map((row) => ({ ...toPublicEntry(row), status: row.status }))
}

export async function updateEntryStatus(
  id: number,
  status: 'approved' | 'rejected'
): Promise<boolean> {
  if (!Number.isInteger(id) || id <= 0) return false
  const sql = getSql()
  const rows = (await sql`
    UPDATE guestbook_entries
    SET status = ${status}, reviewed_at = now()
    WHERE id = ${id} AND status = 'pending'
    RETURNING id
  `) as { id: number }[]
  return rows.length > 0
}

// ── Schema (applied by scripts/guestbook-setup.ts) ──────────────────────────

export const GUESTBOOK_SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS guestbook_entries (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    visiting_from TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    ip_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMPTZ
  )`,
  `CREATE INDEX IF NOT EXISTS guestbook_entries_status_created_idx
    ON guestbook_entries (status, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS guestbook_entries_ip_created_idx
    ON guestbook_entries (ip_hash, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS guestbook_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salt TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    used_at TIMESTAMPTZ
  )`,
  `CREATE INDEX IF NOT EXISTS guestbook_challenges_created_idx
    ON guestbook_challenges (created_at)`,
]
