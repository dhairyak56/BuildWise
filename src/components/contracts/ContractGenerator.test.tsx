import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContractGenerator } from './ContractGenerator'

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, contract: 'Generated Contract Content' }),
    })
) as jest.Mock

describe('ContractGenerator', () => {
    it('renders form fields correctly', () => {
        render(<ContractGenerator onGenerate={() => { }} />)

        // Select a template first to show the form
        fireEvent.click(screen.getByText('Residential Construction Agreement'))

        expect(screen.getByLabelText(/Project Name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Client Name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Contract Value/i)).toBeInTheDocument()
    })

    it('submits form and calls onGenerate with result', async () => {
        const mockOnGenerate = jest.fn()
        render(<ContractGenerator onGenerate={mockOnGenerate} />)

        // Select a template first
        fireEvent.click(screen.getByText('Residential Construction Agreement'))

        // Fill out form
        fireEvent.change(screen.getByLabelText(/Project Name/i), { target: { value: 'Test Project' } })
        fireEvent.change(screen.getByLabelText(/Client Name/i), { target: { value: 'Test Client' } })
        fireEvent.change(screen.getByLabelText(/Contract Value/i), { target: { value: '10000' } })

        // Submit
        fireEvent.click(screen.getByText(/Generate Contract/i))

        // Check loading state
        expect(screen.getByText(/Generating with AI.../i)).toBeInTheDocument()

        // Wait for result
        await waitFor(() => {
            expect(mockOnGenerate).toHaveBeenCalledWith('Generated Contract Content')
        })
    })
})
