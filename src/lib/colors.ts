const CARD_HUES = [350, 25, 45, 160, 200, 270, 330, 90]
const SATURATION = 65
const LIGHTNESS = 82

export function getCardColor(index: number): string {
  const hue = CARD_HUES[index % CARD_HUES.length]
  return `hsl(${hue}, ${SATURATION}%, ${LIGHTNESS}%)`
}

export function getCardColorFromSlug(slug: string): string {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = CARD_HUES[Math.abs(hash) % CARD_HUES.length]
  return `hsl(${hue}, ${SATURATION}%, ${LIGHTNESS}%)`
}
