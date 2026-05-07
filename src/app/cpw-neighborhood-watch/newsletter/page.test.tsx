import { render, screen } from '@testing-library/react'

jest.mock('@/lib/newsletters', () => ({
  getPublishedNewsletters: jest.fn(() => [
    {
      id: 'nl-1',
      title: 'City Park West Neighborhood Watch — April 2026 Recap',
      slug: '2026-04-cpw-recap',
      date: '2026-04-30',
      period: 'April 2026',
      status: 'published',
    },
  ]),
}))

describe('NewsletterPage', () => {
  it('renders the page heading', async () => {
    const { default: Page } = await import('./page')
    render(<Page />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Newsletter')
  })

  it('renders a link for each newsletter', async () => {
    const { default: Page } = await import('./page')
    render(<Page />)
    const link = screen.getByRole('link', {
      name: /April 2026.*April 2026 Recap/i,
    })
    expect(link).toHaveAttribute('href', '/cpw-neighborhood-watch/newsletter/2026-04-cpw-recap')
  })

  it('shows the period label', async () => {
    const { default: Page } = await import('./page')
    render(<Page />)
    expect(screen.getByText('April 2026')).toBeInTheDocument()
  })

  it('shows empty state when no newsletters exist', async () => {
    const { getPublishedNewsletters } = await import('@/lib/newsletters')
    jest.mocked(getPublishedNewsletters).mockReturnValueOnce([])
    const { default: Page } = await import('./page')
    render(<Page />)
    expect(screen.getByText(/No newsletters published yet/i)).toBeInTheDocument()
  })
})
