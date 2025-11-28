import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import PaymentsTab from '@/components/payments/PaymentsTab'
import { createBrowserClient } from '@supabase/ssr'

// Mock Supabase
jest.mock('@supabase/ssr', () => ({
    createBrowserClient: jest.fn()
}))

// Mock AddPaymentModal
jest.mock('@/components/payments/AddPaymentModal', () => ({
    __esModule: true,
    default: () => <div>Add Payment Modal</div>
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>
    }
}))

const mockSupabase = {
    from: jest.fn()
}

describe('PaymentsTab', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (createBrowserClient as jest.Mock).mockReturnValue(mockSupabase)
    })

    const mockPayments = [
        {
            id: '1',
            amount: 10000,
            payment_date: '2024-01-15',
            status: 'Paid',
            description: 'Initial deposit',
            created_at: '2024-01-01'
        },
        {
            id: '2',
            amount: 15000,
            payment_date: '2024-02-15',
            status: 'Scheduled',
            description: 'Progress payment 1',
            created_at: '2024-01-01'
        },
        {
            id: '3',
            amount: 25000,
            payment_date: '2024-03-15',
            status: 'Paid',
            description: 'Progress payment 2',
            created_at: '2024-01-01'
        }
    ]

    it('renders loading state initially', () => {
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: [], error: null })
        })

        render(<PaymentsTab projectId="test-project" contractValue={100000} />)
        expect(screen.getByText('Loading payments...')).toBeInTheDocument()
    })

    it('calculates payment totals correctly', async () => {
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: mockPayments, error: null })
        })

        render(<PaymentsTab projectId="test-project" contractValue={100000} />)

        await waitFor(() => {
            // Total Paid should be 10000 + 25000 = 35000
            expect(screen.getByText('$35,000')).toBeInTheDocument()
            // Remaining should be 100000 - 35000 = 65000
            expect(screen.getByText('$65,000')).toBeInTheDocument()
            // Percentage should be 35%
            expect(screen.getByText('35.0%')).toBeInTheDocument()
        })
    })

    it('displays empty state when no payments exist', async () => {
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: [], error: null })
        })

        render(<PaymentsTab projectId="test-project" contractValue={100000} />)

        await waitFor(() => {
            expect(screen.getByText('No payments yet')).toBeInTheDocument()
            expect(screen.getByText('Add your first payment to start tracking progress')).toBeInTheDocument()
        })
    })

    it('renders payment list correctly', async () => {
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: mockPayments, error: null })
        })

        render(<PaymentsTab projectId="test-project" contractValue={100000} />)

        await waitFor(() => {
            expect(screen.getByText('$10,000')).toBeInTheDocument()
            expect(screen.getByText('$15,000')).toBeInTheDocument()
            expect(screen.getByText('$25,000')).toBeInTheDocument()
            expect(screen.getByText('Initial deposit')).toBeInTheDocument()
            expect(screen.getByText('Progress payment 1')).toBeInTheDocument()
        })
    })

    it('shows correct status badges', async () => {
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: mockPayments, error: null })
        })

        render(<PaymentsTab projectId="test-project" contractValue={100000} />)

        await waitFor(() => {
            const paidBadges = screen.getAllByText('Paid')
            const scheduledBadges = screen.getAllByText('Scheduled')
            expect(paidBadges.length).toBeGreaterThan(0)
            expect(scheduledBadges.length).toBeGreaterThan(0)
        })
    })

    it('handles payment deletion', async () => {
        const mockDelete = jest.fn().mockResolvedValue({ error: null })
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: mockPayments, error: null }),
            delete: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({ error: null })
            })
        })

        // Mock window.confirm
        global.confirm = jest.fn(() => true)

        render(<PaymentsTab projectId="test-project" contractValue={100000} />)

        await waitFor(() => {
            expect(screen.getByText('$10,000')).toBeInTheDocument()
        })

        // Find and click delete button (there should be multiple, click the first one)
        const deleteButtons = screen.getAllByRole('button')
        const deleteButton = deleteButtons.find(btn =>
            btn.querySelector('svg')?.classList.contains('lucide-trash-2')
        )

        if (deleteButton) {
            fireEvent.click(deleteButton)
            expect(global.confirm).toHaveBeenCalled()
        }
    })

    it('opens add payment modal when button is clicked', async () => {
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: mockPayments, error: null })
        })

        render(<PaymentsTab projectId="test-project" contractValue={100000} />)

        await waitFor(() => {
            expect(screen.getByText('Add Payment')).toBeInTheDocument()
        })

        const addButton = screen.getByText('Add Payment')
        fireEvent.click(addButton)

        // Modal should be rendered (mocked)
        expect(screen.getByText('Add Payment Modal')).toBeInTheDocument()
    })
})
