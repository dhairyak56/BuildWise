import { render, screen, waitFor } from '@testing-library/react'
import { UpcomingDeadlinesWidget } from '@/components/dashboard/UpcomingDeadlinesWidget'
import { createBrowserClient } from '@supabase/ssr'

// Mock Supabase client
jest.mock('@supabase/ssr', () => ({
    createBrowserClient: jest.fn()
}))

const mockSupabase = {
    auth: {
        getUser: jest.fn()
    },
    from: jest.fn()
}

describe('UpcomingDeadlinesWidget', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (createBrowserClient as jest.Mock).mockReturnValue(mockSupabase)
    })

    it('renders loading state initially', async () => {
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null })
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            in: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue({ data: [], error: null })
        })

        render(<UpcomingDeadlinesWidget />)
        expect(screen.getByText('Upcoming Deadlines')).toBeInTheDocument()

        // Wait for the async operation to complete to avoid "act" warning
        await waitFor(() => {
            expect(screen.getByText('No upcoming deadlines')).toBeInTheDocument()
        })
    })

    it('renders deadlines correctly', async () => {
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + 5)

        const mockProjects = [
            {
                id: '1',
                name: 'Project A',
                end_date: futureDate.toISOString(),
                status: 'Active'
            }
        ]

        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null })
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            in: jest.fn().mockReturnThis(), // Added .in() mock
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue({ data: mockProjects, error: null })
        })

        render(<UpcomingDeadlinesWidget />)

        await waitFor(() => {
            expect(screen.getByText('Project A')).toBeInTheDocument()
        })
    })

    it('handles empty state', async () => {
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null })
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            in: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue({ data: [], error: null })
        })

        render(<UpcomingDeadlinesWidget />)

        await waitFor(() => {
            expect(screen.getByText('No upcoming deadlines')).toBeInTheDocument()
        })
    })
})
