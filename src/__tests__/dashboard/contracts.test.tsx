import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import React from 'react'

// Mock next/navigation before imports that might use it
jest.mock('next/navigation', () => ({
    __esModule: true,
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
        refresh: jest.fn(),
    }),
    usePathname: () => '/dashboard/contracts',
    useSearchParams: () => new URLSearchParams(),
}))

import ContractsPage from '@/app/dashboard/contracts/page'
import { createBrowserClient } from '@/lib/supabase'

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
    createBrowserClient: jest.fn()
}))

// Mock jsPDF
jest.mock('jspdf', () => {
    return jest.fn().mockImplementation(() => ({
        setFontSize: jest.fn(),
        text: jest.fn(),
        save: jest.fn()
    }))
})

// Mock EmailContractModal
jest.mock('@/components/contracts/EmailContractModal', () => ({
    EmailContractModal: () => <div>Email Modal</div>
}))

const mockSupabase = {
    from: jest.fn()
}

describe('ContractsPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (createBrowserClient as jest.Mock).mockReturnValue(mockSupabase)
    })

    const mockContracts = [
        {
            id: '1',
            created_at: '2023-01-01T00:00:00Z',
            status: 'Draft',
            content: {},
            projects: { name: 'Project A', client_name: 'Client A' }
        },
        {
            id: '2',
            created_at: '2023-01-02T00:00:00Z',
            status: 'Signed',
            content: {},
            projects: { name: 'Project B', client_name: 'Client B' }
        }
    ]

    it('renders loading state initially', () => {
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: [], error: null })
        })

        render(<ContractsPage />)
        // Check for loading spinner or text if applicable, or just ensure page structure exists
        expect(screen.getByText('Contracts')).toBeInTheDocument()
    })

    it('renders contracts list', async () => {
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: mockContracts, error: null })
        })

        render(<ContractsPage />)

        await waitFor(() => {
            expect(screen.getByText('Project A')).toBeInTheDocument()
            expect(screen.getByText('Project B')).toBeInTheDocument()
        })
    })

    it('filters contracts by status', async () => {
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: mockContracts, error: null })
        })

        render(<ContractsPage />)

        await waitFor(() => {
            expect(screen.getByText('Project A')).toBeInTheDocument()
        })

        // Find filter button specifically (it's in the filter bar, not the status badge or stats)
        const signedButtons = screen.getAllByText('Signed')
        // The filter button is the first one (in the filter bar)
        const filterButton = signedButtons.find(el =>
            el.tagName === 'P' && el.className.includes('text-sm font-medium')
        )
        fireEvent.click(filterButton!)

        await waitFor(() => {
            expect(screen.queryByText('Project A')).not.toBeInTheDocument()
            expect(screen.getByText('Project B')).toBeInTheDocument()
        })
    })

    it('filters contracts by search query', async () => {
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: mockContracts, error: null })
        })

        render(<ContractsPage />)

        await waitFor(() => {
            expect(screen.getByText('Project A')).toBeInTheDocument()
        })

        const searchInput = screen.getByPlaceholderText('Search by contract name or client...')
        fireEvent.change(searchInput, { target: { value: 'Client B' } })

        await waitFor(() => {
            expect(screen.queryByText('Project A')).not.toBeInTheDocument()
            expect(screen.getByText('Project B')).toBeInTheDocument()
        })
    })
})
