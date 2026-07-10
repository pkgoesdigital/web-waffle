// Pure validation for guestbook submissions. Visitor input is fully
// untrusted: every field is sanitized, length-capped, and checked before it
// may reach the database, and error messages never echo submitted content.
import type { GuestbookSubmission } from './types'
import { sanitizeText } from './music-sync'

export const NAME_MAX_LENGTH = 50
export const MESSAGE_MAX_LENGTH = 280
export const MESSAGE_MIN_LENGTH = 2
export const VISITING_FROM_MAX_LENGTH = 50

/** Raised for invalid submissions; messages are fixed, self-authored strings
 *  that are safe to return to the client verbatim. */
export class GuestbookValidationError extends Error {}

// Kills most spam's purpose: notes may not contain links.
const URL_PATTERN = /https?:\/\/|www\./i

function parseField(
  value: unknown,
  field: string,
  maxLength: number,
  required: boolean
): string | undefined {
  if (value === undefined || value === null || value === '') {
    if (required) throw new GuestbookValidationError(`Please fill in the ${field} field.`)
    return undefined
  }
  if (typeof value !== 'string') {
    throw new GuestbookValidationError(`The ${field} field must be text.`)
  }
  if (value.length > maxLength * 4) {
    // Reject grossly oversized payloads before doing any further work.
    throw new GuestbookValidationError(`The ${field} field is too long.`)
  }
  const clean = sanitizeText(value, maxLength)
  if (!clean) {
    if (required) throw new GuestbookValidationError(`Please fill in the ${field} field.`)
    return undefined
  }
  if (URL_PATTERN.test(clean)) {
    throw new GuestbookValidationError('Links are not allowed in guestbook notes.')
  }
  return clean
}

export function parseGuestbookSubmission(raw: unknown): GuestbookSubmission {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new GuestbookValidationError('Invalid submission.')
  }
  const record = raw as Record<string, unknown>

  const name = parseField(record.name, 'name', NAME_MAX_LENGTH, true) as string
  const message = parseField(record.message, 'message', MESSAGE_MAX_LENGTH, true) as string
  const visitingFrom = parseField(
    record.visitingFrom,
    'visiting from',
    VISITING_FROM_MAX_LENGTH,
    false
  )

  if (message.length < MESSAGE_MIN_LENGTH) {
    throw new GuestbookValidationError('The message is too short.')
  }

  return visitingFrom ? { name, message, visitingFrom } : { name, message }
}
