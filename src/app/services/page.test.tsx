import { render, screen } from '@testing-library/react'

jest.mock('@/data/services', () => ({
  getVisibleServices: jest.fn(() => [
    {
      slug: 'ai-starter-pack',
      title: 'AI Starter Pack',
      tagline: 'Get from we should leverage AI to a plan.',
      forWho: 'Teams that know AI matters but do not know where to start.',
      stage: 'pre-adoption',
      outcomes: ['Outcome one', 'Outcome two', 'Outcome three'],
      includes: ['Item one'],
      format: '3–4 week engagement',
      pricing: 'Contact for pricing',
      primaryCTA: { label: 'Book a call', href: 'https://example.com' },
      visible: true,
      order: 1,
    },
  ]),
}))

jest.mock('@/lib/colors', () => ({
  getShuffledCardColors: jest.fn(() => ['hsl(200, 60%, 82%)']),
}))

jest.mock('next/link', () => {
  const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  )
  MockLink.displayName = 'Link'
  return MockLink
})

describe('ServicesPage', () => {
  it('renders the page heading', async () => {
    const { default: Page } = await import('./page')
    render(<Page />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Services')
  })

  it('renders service cards from data', async () => {
    const { default: Page } = await import('./page')
    render(<Page />)
    expect(screen.getByText('AI Starter Pack')).toBeInTheDocument()
  })

  it('renders the decision helper section', async () => {
    const { default: Page } = await import('./page')
    render(<Page />)
    expect(screen.getByRole('region', { name: 'Which service is right for you' })).toBeInTheDocument()
  })

  it('renders links to each service detail page', async () => {
    const { default: Page } = await import('./page')
    render(<Page />)
    const links = screen.getAllByRole('link', { name: /AI Starter Pack/ })
    expect(links.length).toBeGreaterThan(0)
    expect(links[0]).toHaveAttribute('href', '/services/ai-starter-pack')
  })

  it('renders the outro CTA section', async () => {
    const { default: Page } = await import('./page')
    render(<Page />)
    expect(screen.getByRole('region', { name: 'Other engagements' })).toBeInTheDocument()
  })

  it('renders the "Get in touch" link', async () => {
    const { default: Page } = await import('./page')
    render(<Page />)
    expect(screen.getByRole('link', { name: 'Get in touch' })).toBeInTheDocument()
  })
})
