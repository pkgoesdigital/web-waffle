const CARD_HUES = [350, 25, 45, 160, 200, 270, 330, 90]
const SATURATION = 65

/** Fisher-Yates shuffle (returns a new array). */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Returns an HSL color string that uses the --card-lightness CSS variable,
 * allowing automatic adaptation between light and dark themes.
 * Color assignment is deterministic (cycles through hues in order).
 */
export function getCardColor(index: number): string {
  const hue = CARD_HUES[index % CARD_HUES.length]
  return `hsl(${hue}, ${SATURATION}%, var(--card-lightness))`
}

/**
 * Returns an array of `count` HSL color strings with the hue order
 * randomized. Call once per render to get a fresh shuffle.
 */
export function getShuffledCardColors(count: number): string[] {
  const shuffled = shuffle(CARD_HUES)
  return Array.from({ length: count }, (_, i) => {
    const hue = shuffled[i % shuffled.length]
    return `hsl(${hue}, ${SATURATION}%, var(--card-lightness))`
  })
}

export function getCardColorFromSlug(slug: string): string {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = CARD_HUES[Math.abs(hash) % CARD_HUES.length]
  return `hsl(${hue}, ${SATURATION}%, var(--card-lightness))`
}
