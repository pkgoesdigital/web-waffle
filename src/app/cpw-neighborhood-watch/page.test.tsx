import { render, screen } from '@testing-library/react'

jest.mock('@/lib/content', () => ({
  getPage: jest.fn(async () => ({
    id: 'cpw-nw-01',
    title: 'City Park West Neighborhood Watch',
    slug: 'cpw-neighborhood-watch',
    date: '2026-04-22',
    status: 'publish',
    featured: false,
    content: '## About\n\nSome content here.',
  })),
}))

jest.mock('@/lib/markdown', () => ({
  markdownToHtml: jest.fn(async (md: string) => `<h2>About</h2><p>${md}</p>`),
}))

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

describe('NeighborhoodWatchPage', () => {
  it('renders the page title', async () => {
    const { default: Page } = await import('./page')
    render(await Page())
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'City Park West Neighborhood Watch'
    )
  })

  it('renders the calendar CTA link', async () => {
    const { default: Page } = await import('./page')
    render(await Page())
    const link = screen.getByRole('link', { name: /View the event calendar/ })
    expect(link).toHaveAttribute('href', '/cpw-neighborhood-watch/calendar')
  })

  it('renders the newsletter CTA link', async () => {
    const { default: Page } = await import('./page')
    render(await Page())
    const link = screen.getByRole('link', { name: /Read the newsletter/ })
    expect(link).toHaveAttribute('href', '/cpw-neighborhood-watch/newsletter')
  })
})
