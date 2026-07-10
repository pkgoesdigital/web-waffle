import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MusicPlayer from './MusicPlayer'
import type { Song } from '@/lib/types'

const songs: Song[] = [
  {
    videoId: 'AAAAAAAAAA1',
    title: 'Zebra Song',
    artist: 'Beta Band',
    genre: 'Rock',
    addedAt: '2026-07-01',
  },
  {
    videoId: 'AAAAAAAAAA2',
    title: 'Alpha Song',
    artist: 'Alpha Artist',
    genre: 'Pop',
    addedAt: '2026-07-02',
  },
  {
    videoId: 'AAAAAAAAAA3',
    title: 'Mid Song',
    artist: 'Gamma Group',
    genre: 'Rock',
    addedAt: '2026-07-03',
  },
]

describe('MusicPlayer', () => {
  it('groups songs by genre by default, genres alphabetical', () => {
    render(<MusicPlayer songs={songs} />)
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.map((h) => h.textContent)).toEqual(['Pop', 'Rock'])
  })

  it('orders songs newest first within a genre', () => {
    render(<MusicPlayer songs={songs} />)
    const rockHeading = screen.getByRole('heading', { name: 'Rock' })
    const rockSection = rockHeading.closest('section') as HTMLElement
    const titles = within(rockSection)
      .getAllByRole('listitem')
      .map((li) => li.textContent)
    expect(titles[0]).toContain('Mid Song')
    expect(titles[1]).toContain('Zebra Song')
  })

  it('switches to a flat artist-sorted list with genre chips', async () => {
    const user = userEvent.setup()
    render(<MusicPlayer songs={songs} />)

    await user.click(screen.getByRole('switch'))

    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
    const items = screen.getAllByRole('listitem').map((li) => li.textContent)
    expect(items[0]).toContain('Alpha Artist')
    expect(items[1]).toContain('Beta Band')
    expect(items[2]).toContain('Gamma Group')
    expect(items[0]).toContain('Pop')
  })

  it('reflects the view in the switch state', async () => {
    const user = userEvent.setup()
    render(<MusicPlayer songs={songs} />)

    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })

  it('loads a sandboxed nocookie iframe only after Play is clicked', async () => {
    const user = userEvent.setup()
    render(<MusicPlayer songs={songs} />)

    expect(document.querySelector('iframe')).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Play Zebra Song by Beta Band' }))

    const iframe = screen.getByTitle('YouTube player: Zebra Song by Beta Band')
    expect(iframe).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/AAAAAAAAAA1?autoplay=1'
    )
    expect(iframe).toHaveAttribute(
      'sandbox',
      'allow-scripts allow-same-origin allow-presentation'
    )
    expect(iframe).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin')
  })

  it('keeps at most one player mounted at a time', async () => {
    const user = userEvent.setup()
    render(<MusicPlayer songs={songs} />)

    await user.click(screen.getByRole('button', { name: 'Play Zebra Song by Beta Band' }))
    await user.click(screen.getByRole('button', { name: 'Play Alpha Song by Alpha Artist' }))

    expect(document.querySelectorAll('iframe')).toHaveLength(1)
    expect(screen.getByTitle('YouTube player: Alpha Song by Alpha Artist')).toBeInTheDocument()
  })

  it('stops playback when the active button is clicked again', async () => {
    const user = userEvent.setup()
    render(<MusicPlayer songs={songs} />)

    await user.click(screen.getByRole('button', { name: 'Play Zebra Song by Beta Band' }))
    await user.click(screen.getByRole('button', { name: 'Stop Zebra Song by Beta Band' }))

    expect(document.querySelector('iframe')).toBeNull()
  })

  it('stops playback on Escape', async () => {
    const user = userEvent.setup()
    render(<MusicPlayer songs={songs} />)

    await user.click(screen.getByRole('button', { name: 'Play Zebra Song by Beta Band' }))
    await user.keyboard('{Escape}')

    expect(document.querySelector('iframe')).toBeNull()
  })

  it('never renders a song with an invalid video ID', () => {
    const tampered: Song[] = [
      songs[0],
      { ...songs[1], videoId: '"><script>a' },
    ]
    render(<MusicPlayer songs={tampered} />)

    expect(screen.getByText('Zebra Song')).toBeInTheDocument()
    expect(screen.queryByText('Alpha Song')).not.toBeInTheDocument()
  })

  it('shows an empty state when no valid songs exist', () => {
    render(<MusicPlayer songs={[]} />)
    expect(screen.getByText(/nothing in rotation/i)).toBeInTheDocument()
  })
})
