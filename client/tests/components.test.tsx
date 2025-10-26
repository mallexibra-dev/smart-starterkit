import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

// Simple component example
const TestButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick}>{children}</button>
)

describe('Component Tests', () => {
  it('should render button correctly', () => {
    render(<TestButton onClick={() => {}}>Click me</TestButton>)

    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('should handle click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<TestButton onClick={handleClick}>Click me</TestButton>)

    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should render different content', () => {
    render(<TestButton onClick={() => {}}>Submit</TestButton>)

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })
})