import { render, screen } from '@testing-library/react'
import EventList from './EventList'
import type { EventMeta } from '@/lib/types'

const baseEvent: EventMeta = {
  id: '1',
  title: 'Community Meeting',
  slug: '2026-05-01-community-meeting',
  date: '2026-05-01',
  time: '6:00 PM',
  location: 'Community Center',
  type: 'meeting',
  status: 'confirmed',
  description: 'Monthly neighborhood meeting.',
  source: 'DPD email',
}

describe('EventList', () => {
  it('renders event title, date, time, and location', () => {
    render(<EventList events={[baseEvent]} />)
    expect(screen.getByText('Community Meeting')).toBeInTheDocument()
    expect(screen.getByText('6:00 PM')).toBeInTheDocument()
    expect(screen.getByText('Community Center')).toBeInTheDocument()
  })

  it('renders the type badge', () => {
    render(<EventList events={[baseEvent]} />)
    expect(screen.getByText('Meeting')).toBeInTheDocument()
  })

  it('renders description and source', () => {
    render(<EventList events={[baseEvent]} />)
    expect(screen.getByText('Monthly neighborhood meeting.')).toBeInTheDocument()
    expect(screen.getByText(/DPD email/)).toBeInTheDocument()
  })

  it('shows Cancelled badge for cancelled events', () => {
    const cancelled = { ...baseEvent, status: 'cancelled' as const }
    render(<EventList events={[cancelled]} />)
    expect(screen.getByText('Cancelled')).toBeInTheDocument()
  })

  it('shows Tentative badge for tentative events', () => {
    const tentative = { ...baseEvent, status: 'tentative' as const }
    render(<EventList events={[tentative]} />)
    expect(screen.getByText('Tentative')).toBeInTheDocument()
  })

  it('renders article with correct id anchor', () => {
    render(<EventList events={[baseEvent]} />)
    const article = document.getElementById('event-2026-05-01-community-meeting')
    expect(article).toBeInTheDocument()
  })

  it('renders multiple events', () => {
    const second = { ...baseEvent, id: '2', title: 'DPD Briefing', slug: '2026-05-10-dpd-briefing', date: '2026-05-10' }
    render(<EventList events={[baseEvent, second]} />)
    expect(screen.getByText('Community Meeting')).toBeInTheDocument()
    expect(screen.getByText('DPD Briefing')).toBeInTheDocument()
  })

  it('shows empty state message when no events', () => {
    render(<EventList events={[]} />)
    expect(screen.getByText(/No upcoming events/)).toBeInTheDocument()
  })
})
