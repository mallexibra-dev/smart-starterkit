import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useIsMobile } from '../src/hooks/use-mobile'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock window.innerWidth
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
})

describe('useIsMobile Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.innerWidth = 1024
  })

  it('should return false when window width is greater than mobile breakpoint', () => {
    window.innerWidth = 1024

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('should return true when window width is less than mobile breakpoint', () => {
    window.innerWidth = 500

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('should return true when window width equals mobile breakpoint', () => {
    window.innerWidth = 767

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('should return false when window width equals breakpoint', () => {
    window.innerWidth = 768

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('should set up event listener on mount', () => {
    const mockMatchMedia = vi.fn().mockReturnValue({
      matches: false,
      media: '(max-width: 767px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })

    window.matchMedia = mockMatchMedia

    renderHook(() => useIsMobile())

    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)')
    expect(mockMatchMedia().addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should clean up event listener on unmount', () => {
    const mockAddEventListener = vi.fn()
    const mockRemoveEventListener = vi.fn()

    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      media: '(max-width: 767px)',
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    })

    const { unmount } = renderHook(() => useIsMobile())

    unmount()

    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should handle undefined initial state correctly', () => {
    window.innerWidth = 300

    const { result } = renderHook(() => useIsMobile())

    // Hook should return boolean, not undefined
    expect(typeof result.current).toBe('boolean')
    expect(result.current).toBe(true)
  })

  it('should work with different breakpoints', () => {
    // Test desktop size
    window.innerWidth = 1200
    const { result: desktop } = renderHook(() => useIsMobile())
    expect(desktop.current).toBe(false)

    // Test mobile size
    window.innerWidth = 375
    const { result: mobile } = renderHook(() => useIsMobile())
    expect(mobile.current).toBe(true)
  })
})