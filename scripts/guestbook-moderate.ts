// Local moderation for guestbook entries — no admin UI ever ships on the
// site. Run with `npm run guestbook:moderate`; needs DATABASE_URL in
// .env.local.
//
//   npm run guestbook:moderate                    list pending entries
//   npm run guestbook:moderate -- --approve 3,7   approve by id
//   npm run guestbook:moderate -- --reject 5      reject by id
import {
  listPendingEntries,
  resolveDatabaseUrl,
  updateEntryStatus,
} from '../src/lib/guestbook-db.ts'

function parseIds(value: string | undefined): number[] {
  if (!value) return []
  return value
    .split(',')
    .map((part) => Number.parseInt(part.trim(), 10))
    .filter((id) => Number.isInteger(id) && id > 0)
}

const args = process.argv.slice(2)

function argValue(flag: string): string | undefined {
  const index = args.indexOf(flag)
  return index >= 0 ? args[index + 1] : undefined
}

if (!resolveDatabaseUrl()) {
  console.error(
    'guestbook:moderate failed: no DATABASE_URL (or single *_DATABASE_URL) is set — see .env.example'
  )
  process.exit(1)
}

try {
  const approveIds = parseIds(argValue('--approve'))
  const rejectIds = parseIds(argValue('--reject'))

  for (const id of approveIds) {
    const changed = await updateEntryStatus(id, 'approved')
    console.log(changed ? `#${id} approved` : `#${id} not found or not pending`)
  }
  for (const id of rejectIds) {
    const changed = await updateEntryStatus(id, 'rejected')
    console.log(changed ? `#${id} rejected` : `#${id} not found or not pending`)
  }

  const pending = await listPendingEntries()
  if (pending.length === 0) {
    console.log('No pending entries. All caught up!')
  } else {
    console.log(`\n${pending.length} pending entr${pending.length === 1 ? 'y' : 'ies'}:\n`)
    for (const entry of pending) {
      const from = entry.visitingFrom ? ` · from ${entry.visitingFrom}` : ''
      console.log(`#${entry.id} · ${entry.createdAt}${from}`)
      console.log(`  ${entry.name}: ${entry.message}\n`)
    }
    console.log('Approve or reject with:')
    console.log('  npm run guestbook:moderate -- --approve <id,id>')
    console.log('  npm run guestbook:moderate -- --reject <id,id>')
  }
} catch (error) {
  console.error(
    `guestbook:moderate failed: ${error instanceof Error ? error.message : String(error)}`
  )
  process.exit(1)
}
