// Self-hosted proof-of-work bot gate for the guestbook. The browser must find
// a nonce whose SHA-256(salt:nonce) has DIFFICULTY leading zero bits before a
// submission is accepted; the server verifies with a single hash. Uses only
// the WebCrypto API, which exists in every modern browser and in Node 22, so
// this module is importable from client components, route handlers, and the
// offline scripts alike.

export const POW_DIFFICULTY = 16

/** How long a solved challenge stays valid before it expires server-side. */
export const CHALLENGE_TTL_MINUTES = 15

/** Submissions younger than this (measured from challenge creation, a
 *  server-side timestamp bots cannot forge) are rejected as non-human. */
export const MIN_CHALLENGE_AGE_MS = 3000

const MAX_SOLVE_ITERATIONS = 2_000_000

const encoder = new TextEncoder()

export async function sha256Hex(input: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', encoder.encode(input))
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export function countLeadingZeroBits(hex: string): number {
  let bits = 0
  for (const char of hex) {
    const nibble = parseInt(char, 16)
    if (Number.isNaN(nibble)) return bits
    if (nibble === 0) {
      bits += 4
      continue
    }
    // clz32 counts against a 32-bit word; a nibble occupies the low 4 bits.
    bits += Math.clz32(nibble) - 28
    break
  }
  return bits
}

export async function verifyPow(
  salt: string,
  nonce: number,
  difficulty: number
): Promise<boolean> {
  if (!Number.isInteger(nonce) || nonce < 0 || nonce > MAX_SOLVE_ITERATIONS) return false
  const hash = await sha256Hex(`${salt}:${nonce}`)
  return countLeadingZeroBits(hash) >= difficulty
}

/** Find a nonce satisfying the difficulty. At the production difficulty this
 *  takes a fraction of a second in a browser; bulk spam pays it per note. */
export async function solvePow(salt: string, difficulty: number): Promise<number> {
  for (let nonce = 0; nonce <= MAX_SOLVE_ITERATIONS; nonce++) {
    if (await verifyPow(salt, nonce, difficulty)) return nonce
  }
  throw new Error('proof-of-work: exhausted search space without a solution')
}
