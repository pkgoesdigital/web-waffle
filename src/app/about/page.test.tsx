import { render, screen } from '@testing-library/react'

jest.mock('@/lib/music', () => {
  const actual = jest.requireActual('@/lib/music')
  return {
    ...actual,
    getMusicData: jest.fn(() => ({
      updatedAt: '2026-07-09',
      songs: [
        {
          videoId: 'AAAAAAAAAA1',
          title: 'Test Song',
          artist: 'Test Artist',
          genre: 'Test Genre',
          addedAt: '2026-07-01',
        },
      ],
    })),
  }
})

describe('AboutPage', () => {
  it('renders the page heading', async () => {
    const { default: Page } = await import('./page')
    render(<Page />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About')
  })

  it('renders the listening section with the music player', async () => {
    const { default: Page } = await import('./page')
    render(<Page />)
    expect(
      screen.getByRole('heading', { name: /what i.ve been listening to/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('switch')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Play Test Song by Test Artist' })
    ).toBeInTheDocument()
  })

  it('does not load any YouTube iframe on initial render', async () => {
    const { default: Page } = await import('./page')
    render(<Page />)
    expect(document.querySelector('iframe')).toBeNull()
  })
})
