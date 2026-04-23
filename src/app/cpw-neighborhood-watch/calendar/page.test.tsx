import { render, screen } from '@testing-library/react'

jest.mock('@/lib/events', () => ({
  getEventsForMonth: jest.fn(() => [
    {
      id: '1',
      title: 'Test Meeting',
      slug: '2026-04-28-test-meeting',
      date: '2026-04-28',
      type: 'meeting',
      status: 'confirmed',
      description: 'A test meeting.',
    },
  ]),
}))

async function renderPage(monthParam?: string) {
  const { default: CalendarPage } = await import('./page')
  const searchParams = Promise.resolve(monthParam ? { month: monthParam } : {})
  const jsx = await CalendarPage({ searchParams })
  return render(jsx)
}

describe('CalendarPage', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-04-22').getTime())
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('defaults to the current month', async () => {
    await renderPage()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('April 2026')
  })

  it('shows the month from ?month= param', async () => {
    await renderPage('2026-05')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('May 2026')
  })

  it('renders the calendar grid section', async () => {
    await renderPage()
    expect(screen.getByRole('region', { name: 'April 2026 calendar' })).toBeInTheDocument()
  })

  it('renders the event details section', async () => {
    await renderPage()
    expect(screen.getByRole('heading', { name: 'Event Details' })).toBeInTheDocument()
  })

  it('includes a link back to the landing page', async () => {
    await renderPage()
    expect(screen.getByRole('link', { name: /About this group/ })).toHaveAttribute(
      'href',
      '/cpw-neighborhood-watch'
    )
  })

  it('renders previous month navigation link when within bounds', async () => {
    // April 22: minus30 = March 23 → prev of April (March) is within bounds
    await renderPage()
    expect(screen.getByRole('link', { name: /Previous/ })).toBeInTheDocument()
  })

  it('renders next month navigation link when within bounds', async () => {
    // April 22: plus30 = May 22 → next of April (May) is within bounds
    await renderPage()
    expect(screen.getByRole('link', { name: /Next/ })).toBeInTheDocument()
  })

  it('disables previous navigation when at the min bound month', async () => {
    // March is the min bound month; prev would be February which is out of range
    await renderPage('2026-03')
    expect(screen.queryByRole('link', { name: /Previous/ })).not.toBeInTheDocument()
  })

  it('disables next navigation when at the max bound month', async () => {
    // May is the max bound month; next would be June which is out of range
    await renderPage('2026-05')
    expect(screen.queryByRole('link', { name: /Next/ })).not.toBeInTheDocument()
  })
})
