import { cn } from './utils'

describe('cn utility', () => {
    it('merges class names correctly', () => {
        expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
    })

    it('handles conditional classes', () => {
        expect(cn('bg-red-500', true && 'text-white', false && 'hidden')).toBe('bg-red-500 text-white')
    })

    it('merges tailwind classes correctly (overrides)', () => {
        expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
        expect(cn('p-4', 'p-2')).toBe('p-2')
    })
})
