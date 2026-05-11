import { render, screen } from '@testing-library/react'
import ServicePage from './ServicePage'

jest.mock('next/link', () => {
  const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  )
  MockLink.displayName = 'Link'
  return MockLink
})

describe('ServicePage', () => {
  it('renders the service title', () => {
    render(<ServicePage slug="ai-starter-pack"><p>Content</p></ServicePage>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('AI Starter Pack')
  })

  it('renders the tagline', () => {
    render(<ServicePage slug="ai-starter-pack"><p>Content</p></ServicePage>)
    expect(screen.getByText(/Get from 'we should leverage AI'/)).toBeInTheDocument()
  })

  it('renders the stage eyebrow label', () => {
    render(<ServicePage slug="ai-starter-pack"><p>Content</p></ServicePage>)
    expect(screen.getByText('Pre-adoption')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(<ServicePage slug="ai-starter-pack"><p>Custom pitch content</p></ServicePage>)
    expect(screen.getByText('Custom pitch content')).toBeInTheDocument()
  })

  it('renders outcomes section', () => {
    render(<ServicePage slug="ai-starter-pack"><p>Content</p></ServicePage>)
    expect(screen.getByRole('region', { name: 'What you walk away with' })).toBeInTheDocument()
  })

  it('renders includes section', () => {
    render(<ServicePage slug="ai-starter-pack"><p>Content</p></ServicePage>)
    expect(screen.getByRole('region', { name: "What's included" })).toBeInTheDocument()
  })

  it('renders the CTA link with correct label', () => {
    render(<ServicePage slug="ai-starter-pack"><p>Content</p></ServicePage>)
    expect(screen.getByRole('link', { name: 'Book a discovery call' })).toBeInTheDocument()
  })

  it('renders FAQ section when service has FAQs', () => {
    render(<ServicePage slug="ai-starter-pack"><p>Content</p></ServicePage>)
    expect(screen.getByRole('region', { name: 'Frequently asked questions' })).toBeInTheDocument()
  })

  it('renders back link to /services', () => {
    render(<ServicePage slug="ai-starter-pack"><p>Content</p></ServicePage>)
    const backLink = screen.getByRole('link', { name: /Services/ })
    expect(backLink).toHaveAttribute('href', '/services')
  })

  it('renders next pagination link for first service', () => {
    render(<ServicePage slug="ai-starter-pack"><p>Content</p></ServicePage>)
    expect(screen.getByRole('link', { name: /AI Build Partner/ })).toBeInTheDocument()
  })

  it('renders prev pagination link for middle service', () => {
    render(<ServicePage slug="ai-build-partner"><p>Content</p></ServicePage>)
    expect(screen.getByRole('link', { name: /AI Starter Pack/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /AI Overseer/ })).toBeInTheDocument()
  })

  it('renders nothing for an unknown slug', () => {
    const { container } = render(<ServicePage slug="nonexistent"><p>Content</p></ServicePage>)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders in-flight eyebrow for ai-build-partner', () => {
    render(<ServicePage slug="ai-build-partner"><p>Content</p></ServicePage>)
    expect(screen.getByText('In-flight')).toBeInTheDocument()
  })

  it('renders post-adoption eyebrow for ai-overseer', () => {
    render(<ServicePage slug="ai-overseer"><p>Content</p></ServicePage>)
    expect(screen.getByText('Post-adoption')).toBeInTheDocument()
  })
})
