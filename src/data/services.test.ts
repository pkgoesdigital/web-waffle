import { getVisibleServices, getServiceBySlug, services } from './services'

describe('getVisibleServices', () => {
  it('returns only visible services', () => {
    const result = getVisibleServices()
    expect(result.every((s) => s.visible)).toBe(true)
  })

  it('returns services sorted by order', () => {
    const result = getVisibleServices()
    for (let i = 1; i < result.length; i++) {
      expect(result[i].order).toBeGreaterThan(result[i - 1].order)
    }
  })

  it('returns all currently visible services', () => {
    const visibleCount = services.filter((s) => s.visible).length
    expect(getVisibleServices()).toHaveLength(visibleCount)
  })
})

describe('getServiceBySlug', () => {
  it('returns the matching service', () => {
    const result = getServiceBySlug('ai-starter-pack')
    expect(result?.slug).toBe('ai-starter-pack')
    expect(result?.title).toBe('AI Starter Pack')
  })

  it('returns undefined for an unknown slug', () => {
    expect(getServiceBySlug('does-not-exist')).toBeUndefined()
  })

  it('finds services regardless of visibility', () => {
    const firstSlug = services[0].slug
    const result = getServiceBySlug(firstSlug)
    expect(result).toBeDefined()
  })
})

describe('Service data shape', () => {
  it('every service has required fields', () => {
    for (const s of services) {
      expect(s.slug).toBeTruthy()
      expect(s.title).toBeTruthy()
      expect(s.tagline).toBeTruthy()
      expect(s.primaryCTA.label).toBeTruthy()
      expect(s.primaryCTA.href).toBeTruthy()
      expect(Array.isArray(s.outcomes)).toBe(true)
      expect(Array.isArray(s.includes)).toBe(true)
    }
  })

  it('service slugs are unique', () => {
    const slugs = services.map((s) => s.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('service orders are unique', () => {
    const orders = services.map((s) => s.order)
    expect(new Set(orders).size).toBe(orders.length)
  })
})
