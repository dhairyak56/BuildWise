import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Stats from './Stats'

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    useInView: () => true,
}))

describe('Stats Component', () => {
    it('renders all four stats', () => {
        render(<Stats />)
        expect(screen.getByText('500+')).toBeInTheDocument()
        expect(screen.getByText('15k+')).toBeInTheDocument()
        expect(screen.getByText('40%')).toBeInTheDocument()
        expect(screen.getByText('99.8%')).toBeInTheDocument()
    })

    it('renders stat labels', () => {
        render(<Stats />)
        expect(screen.getByText(/Active Builders/i)).toBeInTheDocument()
        expect(screen.getByText(/Hours Saved/i)).toBeInTheDocument()
        expect(screen.getByText(/Growth Rate/i)).toBeInTheDocument()
        expect(screen.getByText(/Satisfaction/i)).toBeInTheDocument()
    })

    it('renders stat descriptions', () => {
        render(<Stats />)
        expect(screen.getByText(/Trust BuildWise daily/i)).toBeInTheDocument()
        expect(screen.getByText(/By our customers/i)).toBeInTheDocument()
        expect(screen.getByText(/Average capacity increase/i)).toBeInTheDocument()
        expect(screen.getByText(/Customer approval rating/i)).toBeInTheDocument()
    })
})
