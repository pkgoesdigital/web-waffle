import { render, screen } from '@testing-library/react'

jest.mock('@/lib/content', () => ({
  getSocialLinks: jest.fn(() => []),
}))

jest.mock('@/components/Guestbook/Guestbook', () => {
  const MockGuestbook = () => <div data-testid="guestbook" />
  MockGuestbook.displayName = 'Guestbook'
  return MockGuestbook
})

describe('ContactPage', () => {
  it('renders the page heading', async () => {
    const { default: Page } = await import('./page')
    render(<Page />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Contact')
  })

  it('renders the guestbook section with its anchor', async () => {
    const { default: Page } = await import('./page')
    const { container } = render(<Page />)

    expect(screen.getByRole('heading', { name: 'Guestbook' })).toBeInTheDocument()
    expect(container.querySelector('section#guestbook')).not.toBeNull()
    expect(screen.getByTestId('guestbook')).toBeInTheDocument()
  })

  it('explains the moderation and privacy posture', async () => {
    const { default: Page } = await import('./page')
    render(<Page />)
    expect(screen.getByText(/appears after I approve it/i)).toBeInTheDocument()
    expect(screen.getByText(/no account, no email/i)).toBeInTheDocument()
  })
})
