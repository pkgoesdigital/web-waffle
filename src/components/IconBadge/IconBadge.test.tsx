import { render, screen } from '@testing-library/react'
import IconBadge from './IconBadge'
import type { SimpleIcon } from 'simple-icons'

const mockIcon: SimpleIcon = {
  title: 'TypeScript',
  slug: 'typescript',
  hex: '3178C6',
  source: 'https://www.typescriptlang.org',
  svg: '<svg></svg>',
  path: 'M0 0h24v24H0z',
  guidelines: undefined,
}

describe('IconBadge', () => {
  it('renders the label text', () => {
    render(<IconBadge label="TypeScript" icon={mockIcon} />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders an SVG when icon is provided', () => {
    render(<IconBadge label="TypeScript" icon={mockIcon} />)
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('renders a placeholder instead of SVG when no icon is provided', () => {
    render(<IconBadge label="Java" />)
    expect(document.querySelector('svg')).not.toBeInTheDocument()
    expect(screen.getByText('Java')).toBeInTheDocument()
  })

  it('sets title attribute on the badge for tooltip', () => {
    render(<IconBadge label="TypeScript" icon={mockIcon} />)
    const badge = screen.getByTitle('TypeScript')
    expect(badge).toBeInTheDocument()
  })

  it('marks SVG as aria-hidden', () => {
    render(<IconBadge label="TypeScript" icon={mockIcon} />)
    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})
