import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { ProjectDetailsView } from '@/components/projects/ProjectDetailsView'

// Mock next/link
jest.mock('next/link', () => {
    return ({ children, href }: any) => {
        return <a href={href}>{children}</a>
    }
})

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>
    },
    AnimatePresence: ({ children }: any) => <>{children}</>
}))

// Mock EditProjectModal
jest.mock('@/components/projects/EditProjectModal', () => ({
    EditProjectModal: () => <div>Edit Project Modal</div>
}))

// Mock PaymentsTab
jest.mock('@/components/payments/PaymentsTab', () => ({
    __esModule: true,
    default: () => <div>Payments Tab Content</div>
}))

const mockProject = {
    id: 'test-project-1',
    name: 'Test Construction Project',
    client_name: 'John Doe',
    address: '123 Test Street, Sydney NSW 2000',
    job_type: 'Residential Construction',
    scope: 'Full house renovation including kitchen and bathroom',
    contract_value: 150000,
    start_date: '2024-01-01',
    end_date: '2024-06-30',
    status: 'Active',
    progress: 45,
    payment_type: 'Progress Payments'
}

const mockContract = {
    status: 'Draft'
}

describe('ProjectDetailsView', () => {
    it('renders project information correctly', () => {
        render(<ProjectDetailsView initialProject={mockProject} contract={mockContract} />)

        expect(screen.getByText('Test Construction Project')).toBeInTheDocument()
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        const addresses = screen.getAllByText('123 Test Street, Sydney NSW 2000')
        expect(addresses.length).toBeGreaterThan(0)
        expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('displays contract value and budget information', () => {
        render(<ProjectDetailsView initialProject={mockProject} contract={mockContract} />)

        expect(screen.getByText('$150,000')).toBeInTheDocument()
        expect(screen.getByText('Total contract value')).toBeInTheDocument()
    })

    it('shows project timeline', () => {
        render(<ProjectDetailsView initialProject={mockProject} contract={mockContract} />)

        // Dates should be formatted and displayed
        expect(screen.getByText(/1\/1\/2024/)).toBeInTheDocument()
        expect(screen.getByText(/6\/30\/2024/)).toBeInTheDocument()
    })

    it('displays progress percentage correctly', () => {
        render(<ProjectDetailsView initialProject={mockProject} contract={mockContract} />)

        expect(screen.getByText('45%')).toBeInTheDocument()
        expect(screen.getByText('Overall completion')).toBeInTheDocument()
    })

    it('switches between overview and payments tabs', async () => {
        render(<ProjectDetailsView initialProject={mockProject} contract={mockContract} />)

        // Initially on Overview tab
        expect(screen.getByText('Project Information')).toBeInTheDocument()

        // Click Payments tab (get all and click the one in the tab switcher)
        const paymentsTabs = screen.getAllByText('Payments')
        fireEvent.click(paymentsTabs[0])

        await waitFor(() => {
            expect(screen.getByText('Payments Tab Content')).toBeInTheDocument()
        })

        // Click back to Overview
        const overviewTabs = screen.getAllByText('Overview')
        fireEvent.click(overviewTabs[0])

        await waitFor(() => {
            expect(screen.getByText('Project Information')).toBeInTheDocument()
        })
    })

    it('shows contract status', () => {
        render(<ProjectDetailsView initialProject={mockProject} contract={mockContract} />)

        expect(screen.getByText('Draft')).toBeInTheDocument()
    })

    it('displays job type and payment type', () => {
        render(<ProjectDetailsView initialProject={mockProject} contract={mockContract} />)

        expect(screen.getByText('Residential Construction')).toBeInTheDocument()
        expect(screen.getByText('Progress Payments')).toBeInTheDocument()
    })

    it('shows scope of work', () => {
        render(<ProjectDetailsView initialProject={mockProject} contract={mockContract} />)

        expect(screen.getByText('Full house renovation including kitchen and bathroom')).toBeInTheDocument()
    })

    it('opens edit modal when edit button is clicked', () => {
        render(<ProjectDetailsView initialProject={mockProject} contract={mockContract} />)

        const editButton = screen.getByText('Edit Details')
        fireEvent.click(editButton)

        expect(screen.getByText('Edit Project Modal')).toBeInTheDocument()
    })

    it('renders quick action links', () => {
        render(<ProjectDetailsView initialProject={mockProject} contract={mockContract} />)

        const viewContractLinks = screen.getAllByText(/View Contract/)
        const generateVariationLinks = screen.getAllByText(/Generate Variation/)

        expect(viewContractLinks.length).toBeGreaterThan(0)
        expect(generateVariationLinks.length).toBeGreaterThan(0)
    })

    it('handles missing contract gracefully', () => {
        render(<ProjectDetailsView initialProject={mockProject} contract={null} />)

        expect(screen.getByText('Not Generated')).toBeInTheDocument()
    })

    it('handles missing optional fields gracefully', () => {
        const projectWithMissingFields = {
            ...mockProject,
            payment_type: null as any,
            scope: null as any
        }

        render(<ProjectDetailsView initialProject={projectWithMissingFields} contract={mockContract} />)

        expect(screen.getByText('Not specified')).toBeInTheDocument()
        expect(screen.getByText('No scope defined')).toBeInTheDocument()
    })
})
