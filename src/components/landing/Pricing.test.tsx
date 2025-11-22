import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Pricing from './Pricing'

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
        h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
        p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    },
    useInView: () => true,
}))

// Mock next/link
jest.mock('next/link', () => {
    return ({ children, href }: any) => {
        return <a href={href}>{children}</a>
    }
})

describe('Pricing Component', () => {
    it('renders pricing section heading', () => {
        render(<Pricing />)
        expect(screen.getByText(/Simple, Transparent/i)).toBeInTheDocument()
        expect(screen.getByText(/Pricing/i)).toBeInTheDocument()
    })

    it('renders all three pricing plans', () => {
        render(<Pricing />)
        expect(screen.getByText('Starter')).toBeInTheDocument()
        expect(screen.getByText('Professional')).toBeInTheDocument()
        expect(screen.getByText('Enterprise')).toBeInTheDocument()
    })

    it('displays pricing for Starter and Professional plans', () => {
        render(<Pricing />)
        expect(screen.getByText('$49')).toBeInTheDocument()
        expect(screen.getByText('$99')).toBeInTheDocument()
        expect(screen.getByText('Custom')).toBeInTheDocument()
    })

    it('highlights the Professional plan as most popular', () => {
        render(<Pricing />)
        expect(screen.getByText('Most Popular')).toBeInTheDocument()
    })

    it('renders CTA buttons for each plan', () => {
        render(<Pricing />)
        const startTrialButtons = screen.getAllByText('Start Free Trial')
        expect(startTrialButtons).toHaveLength(2) // Starter and Professional
        expect(screen.getByText('Contact Sales')).toBeInTheDocument()
    })

    it('displays key features for each plan', () => {
        render(<Pricing />)
        expect(screen.getByText(/10 contracts per month/i)).toBeInTheDocument()
        expect(screen.getByText(/Unlimited contracts/i)).toBeInTheDocument()
        expect(screen.getByText(/AI contract generation/i)).toBeInTheDocument()
    })

    it('shows trust badge at the bottom', () => {
        render(<Pricing />)
        expect(screen.getByText(/All plans include a 14-day free trial/i)).toBeInTheDocument()
    })
})
