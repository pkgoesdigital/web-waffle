import { render, screen } from '@testing-library/react'
import LoginForm from './LoginForm'

describe('LoginForm', () => {
  it('renders password input and submit button', () => {
    render(<LoginForm error={false} />)
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Enter' })).toBeInTheDocument()
  })

  it('shows error message when error prop is true', () => {
    render(<LoginForm error={true} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Incorrect password')
  })

  it('does not show error message when error prop is false', () => {
    render(<LoginForm error={false} />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders a hidden "from" field when from prop is provided', () => {
    render(<LoginForm error={false} from="/cpw-neighborhood-watch/calendar" />)
    const hiddenInput = document.querySelector('input[name="from"]') as HTMLInputElement
    expect(hiddenInput).toBeInTheDocument()
    expect(hiddenInput.value).toBe('/cpw-neighborhood-watch/calendar')
  })

  it('does not render a "from" field when from prop is absent', () => {
    render(<LoginForm error={false} />)
    expect(document.querySelector('input[name="from"]')).not.toBeInTheDocument()
  })

  it('form posts to /api/cpw-auth', () => {
    render(<LoginForm error={false} />)
    const form = document.querySelector('form')
    expect(form?.action).toContain('/api/cpw-auth')
    expect(form?.method).toBe('post')
  })
})
