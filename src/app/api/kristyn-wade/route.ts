import { NextRequest, NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { VALID_SLOT_KEYS, CALENDAR_DAYS } from '@/lib/kristyn-config'

type SignupRow = {
  slot_date: string
  slot_key: string
  full_name: string
}

function getTodayUTC(): Date {
  const d = new Date()
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
}

function isDateInWindow(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false
  const target = new Date(dateStr + 'T00:00:00Z')
  const today = getTodayUTC()
  const end = new Date(today)
  end.setUTCDate(today.getUTCDate() + CALENDAR_DAYS - 1)
  return target >= today && target <= end
}

export async function GET() {
  try {
    const today = getTodayUTC()
    const end = new Date(today)
    end.setUTCDate(today.getUTCDate() + CALENDAR_DAYS - 1)

    const todayStr = today.toISOString().slice(0, 10)
    const endStr = end.toISOString().slice(0, 10)

    const sql = getSql()
    const rows = (await sql`
      SELECT slot_date::text, slot_key, full_name
      FROM kristyn_signups
      WHERE slot_date >= ${todayStr}::date
        AND slot_date <= ${endStr}::date
      ORDER BY slot_date, slot_key, created_at
    `) as SignupRow[]

    const signups: Record<string, Record<string, { names: string[]; count: number }>> = {}

    for (const row of rows) {
      const date = row.slot_date.slice(0, 10)
      if (!signups[date]) signups[date] = {}
      if (!signups[date][row.slot_key]) signups[date][row.slot_key] = { names: [], count: 0 }
      signups[date][row.slot_key].names.push(row.full_name)
      signups[date][row.slot_key].count++
    }

    const response = NextResponse.json({ signups })
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch {
    return NextResponse.json({ error: 'Unable to load sign-ups. Please try again.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { slot_date, slot_key, full_name, email, phone } = body as Record<string, unknown>

  const name = typeof full_name === 'string' ? full_name.trim() : ''
  if (!name) {
    return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 })
  }

  const emailVal = typeof email === 'string' ? email.trim() : ''
  const phoneVal = typeof phone === 'string' ? phone.trim() : ''
  if (!emailVal && !phoneVal) {
    return NextResponse.json(
      { error: 'Please share an email or phone number so her family can reach you if plans change.' },
      { status: 400 }
    )
  }

  if (typeof slot_key !== 'string' || !VALID_SLOT_KEYS.has(slot_key)) {
    return NextResponse.json({ error: 'Invalid time slot.' }, { status: 400 })
  }

  if (typeof slot_date !== 'string' || !isDateInWindow(slot_date)) {
    return NextResponse.json({ error: 'Invalid or out-of-range date.' }, { status: 400 })
  }

  try {
    const sql = getSql()
    const result = await sql`
      INSERT INTO kristyn_signups (slot_date, slot_key, full_name, email, phone)
      VALUES (${slot_date}::date, ${slot_key}, ${name}, ${emailVal || null}, ${phoneVal || null})
      RETURNING id
    `

    const inserted = result as unknown as Array<{ id: number }>
    return NextResponse.json({ success: true, id: inserted[0].id }, { status: 201 })
  } catch (err: unknown) {
    const pgErr = err as { code?: string }
    if (pgErr?.code === '23505') {
      return NextResponse.json(
        { error: "It looks like you're already signed up for this slot." },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
