import { render, screen, waitFor } from '@testing-library/react'
import RecentActivityWidget from '@/components/dashboard/RecentActivityWidget'
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

describe('RecentActivityWidget', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (createBrowserClient as jest.Mock).mockReturnValue(mockSupabase)
    })

    it('renders loading state initially', async () => {
        // Mock getUser to return a user so fetch proceeds
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null })
        // Mock empty data return to prevent errors during initial render
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue({ data: [], error: null })
        })

        render(<RecentActivityWidget />)
        expect(screen.getByText('Recent Activity')).toBeInTheDocument()

        // Wait for the async operation to complete to avoid "act" warning
        await waitFor(() => {
            expect(screen.getByText('No recent activity')).toBeInTheDocument()
        })
    })

    it('renders activities correctly', async () => {
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null })

        const mockSelect = jest.fn().mockReturnThis()
        const mockEq = jest.fn().mockReturnThis()
        const mockOrder = jest.fn().mockReturnThis()
        // const mockLimit = jest.fn() // This is no longer needed as limit is mocked within mockImplementation

        // Mock specific returns based on the table name
        mockSupabase.from.mockImplementation((table) => {
            if (table === 'contracts') {
                return {
                    select: mockSelect,
                    eq: mockEq,
                    order: mockOrder,
                    limit: jest.fn().mockResolvedValue({
                        data: [{ id: '1', status: 'Signed', project_name: 'Project A', created_at: new Date().toISOString() }],
                        error: null
                    })
                }
            }
            if (table === 'projects') {
                return {
                    select: mockSelect,
                    eq: mockEq,
                    order: mockOrder,
                    limit: jest.fn().mockResolvedValue({
                        data: [{ id: 'p1', name: 'Project A', created_at: new Date().toISOString() }],
                        error: null
                    })
                }
            }
            // Default empty return for other tables (payments, documents)
            return {
                select: mockSelect,
                eq: mockEq,
                order: mockOrder,
                limit: jest.fn().mockResolvedValue({ data: [], error: null })
            }
        })

        render(<RecentActivityWidget />)

        await waitFor(() => {
            expect(screen.getByText('Contract Signed')).toBeInTheDocument()
            expect(screen.getByText('Project A')).toBeInTheDocument() // This is for the contract's project_name
            expect(screen.getByText('Project Created')).toBeInTheDocument() // This is for the project activity
        })
    })

    it('handles empty state', async () => {
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null })
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue({ data: [], error: null })
        })

        render(<RecentActivityWidget />)

        await waitFor(() => {
            expect(screen.getByText('No recent activity')).toBeInTheDocument()
        })
    })
})
