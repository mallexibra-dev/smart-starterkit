import { describe, it, expect } from 'vitest'
import { cn } from '../src/lib/utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
    })

    it('should handle conditional classes', () => {
      expect(cn('base-class', true && 'active', false && 'hidden')).toBe('base-class active')
    })

    it('should handle undefined and null values', () => {
      expect(cn('base-class', undefined, null, 'additional')).toBe('base-class additional')
    })

    it('should handle empty strings', () => {
      expect(cn('base-class', '', 'additional')).toBe('base-class additional')
    })

    it('should handle conflicting tailwind classes', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4')
    })

    it('should handle arrays of classes', () => {
      expect(cn(['px-2', 'py-1'], 'mb-2')).toBe('px-2 py-1 mb-2')
    })

    it('should handle objects with boolean values', () => {
      expect(cn({
        'px-2': true,
        'py-1': false,
        'mb-2': true
      })).toBe('px-2 mb-2')
    })

    it('should handle complex combinations', () => {
      expect(cn(
        'base-class',
        {
          'active': true,
          'hidden': false
        },
        ['px-2', undefined, 'py-1'],
        null
      )).toBe('base-class active px-2 py-1')
    })

    it('should return empty string when no classes provided', () => {
      expect(cn()).toBe('')
    })

    it('should handle only falsy values', () => {
      expect(cn(false, null, undefined, '')).toBe('')
    })
  })
})