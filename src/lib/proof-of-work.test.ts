/** @jest-environment node */
import {
  countLeadingZeroBits,
  POW_DIFFICULTY,
  sha256Hex,
  solvePow,
  verifyPow,
} from './proof-of-work'

// Low difficulty keeps the search fast in CI while exercising the same code
// path as the production difficulty.
const TEST_DIFFICULTY = 8

describe('sha256Hex', () => {
  it('produces the known digest for a known input', async () => {
    expect(await sha256Hex('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    )
  })
})

describe('countLeadingZeroBits', () => {
  it('counts zero bits across leading nibbles', () => {
    expect(countLeadingZeroBits('ffff')).toBe(0)
    expect(countLeadingZeroBits('7fff')).toBe(1)
    expect(countLeadingZeroBits('1fff')).toBe(3)
    expect(countLeadingZeroBits('0fff')).toBe(4)
    expect(countLeadingZeroBits('00ff')).toBe(8)
    expect(countLeadingZeroBits('0000')).toBe(16)
  })
})

describe('solvePow / verifyPow', () => {
  it('solves a challenge that then verifies', async () => {
    const nonce = await solvePow('test-salt', TEST_DIFFICULTY)
    expect(await verifyPow('test-salt', nonce, TEST_DIFFICULTY)).toBe(true)
  })

  it('rejects a wrong nonce at production difficulty', async () => {
    // Probability of a random nonce passing 16 bits is 1 in 65536; assert a
    // handful of fixed values that are known not to solve this salt.
    for (const nonce of [1, 2, 3]) {
      expect(await verifyPow('some-other-salt', nonce, POW_DIFFICULTY)).toBe(false)
    }
  })

  it('rejects non-integer, negative, and out-of-range nonces', async () => {
    expect(await verifyPow('s', 1.5, 0)).toBe(false)
    expect(await verifyPow('s', -1, 0)).toBe(false)
    expect(await verifyPow('s', Number.NaN, 0)).toBe(false)
    expect(await verifyPow('s', 10_000_000, 0)).toBe(false)
  })

  it('binds the solution to the salt', async () => {
    const nonce = await solvePow('salt-a', TEST_DIFFICULTY)
    expect(await verifyPow('salt-b', nonce, TEST_DIFFICULTY)).toBe(false)
  })
})
