import { render, screen } from '@testing-library/react'

jest.mock('@/lib/events', () => ({
  getUpcomingEvents: jest.fn(() => [
    {
      id: '1',
      title: 'Test Meeting',
      slug: '2026-05-06-test-meeting',
      date: '2026-05-06',
      type: 'meeting',
      status: 'confirmed',
      description: 'A test meeting.',
    },
  ]),
}))

describe('CalendarPage', () => {
  it('renders the page header with month and year', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-04-22').getTime())
    const { default: CalendarPage } = await import('./page')
    render(<CalendarPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('May 2026')
    jest.useRealTimers()
  })

  it('renders the calendar grid section', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-04-22').getTime())
    const { default: CalendarPage } = await import('./page')
    render(<CalendarPage />)
    expect(screen.getByRole('region', { name: 'May 2026 calendar' })).toBeInTheDocument()
    jest.useRealTimers()
  })

  it('renders the event details section', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-04-22').getTime())
    const { default: CalendarPage } = await import('./page')
    render(<CalendarPage />)
    expect(screen.getByRole('heading', { name: 'Event Details' })).toBeInTheDocument()
    jest.useRealTimers()
  })

  it('includes a link back to the landing page', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-04-22').getTime())
    const { default: CalendarPage } = await import('./page')
    render(<CalendarPage />)
    expect(screen.getByRole('link', { name: /About this group/ })).toHaveAttribute(
      'href',
      '/cpw-neighborhood-watch'
    )
    jest.useRealTimers()
  })
})
