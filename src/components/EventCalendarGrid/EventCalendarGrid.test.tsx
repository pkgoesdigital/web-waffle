import { render, screen } from '@testing-library/react'
import EventCalendarGrid from './EventCalendarGrid'
import type { EventMeta } from '@/lib/types'

const mayEvent: EventMeta = {
  id: '1',
  title: 'Neighborhood Watch',
  slug: '2026-05-06-neighborhood-watch',
  date: '2026-05-06',
  type: 'meeting',
  status: 'confirmed',
}

const cancelledEvent: EventMeta = {
  id: '2',
  title: 'Cancelled Cleanup',
  slug: '2026-05-10-cancelled-cleanup',
  date: '2026-05-10',
  type: 'cleanup',
  status: 'cancelled',
}

describe('EventCalendarGrid', () => {
  it('renders weekday headers', () => {
    render(<EventCalendarGrid events={[]} year={2026} month={4} />)
    expect(screen.getByText('Sun')).toBeInTheDocument()
    expect(screen.getByText('Sat')).toBeInTheDocument()
  })

  it('renders event title as a link', () => {
    render(<EventCalendarGrid events={[mayEvent]} year={2026} month={4} />)
    const link = screen.getByRole('link', { name: /Neighborhood Watch — jump to details/ })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#event-2026-05-06-neighborhood-watch')
  })

  it('does not render events from other months', () => {
    const juneEvent: EventMeta = { ...mayEvent, date: '2026-06-01', slug: '2026-06-01-other' }
    render(<EventCalendarGrid events={[juneEvent]} year={2026} month={4} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders an empty grid with no events', () => {
    render(<EventCalendarGrid events={[]} year={2026} month={4} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('marks cancelled events with data-status attribute', () => {
    render(<EventCalendarGrid events={[cancelledEvent]} year={2026} month={4} />)
    const link = screen.getByRole('link', { name: /Cancelled Cleanup/ })
    expect(link).toHaveAttribute('data-status', 'cancelled')
  })

  it('has accessible section label', () => {
    render(<EventCalendarGrid events={[]} year={2026} month={4} />)
    expect(screen.getByRole('region', { name: 'May 2026 calendar' })).toBeInTheDocument()
  })
})
