import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import Hero from './Hero'

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: function MotionDiv({ children, ...props }: React.ComponentProps<'div'>) { return <div {...props}>{children}</div> },
        h1: function MotionH1({ children, ...props }: React.ComponentProps<'h1'>) { return <h1 {...props}>{children}</h1> },
        p: function MotionP({ children, ...props }: React.ComponentProps<'p'>) { return <p {...props}>{children}</p> },
        button: function MotionButton({ children, ...props }: React.ComponentProps<'button'>) { return <button {...props}>{children}</button> },
    },
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: () => ({ get: () => 0 }),
    useInView: () => true,
}))

// Mock next/link
jest.mock('next/link', () => {
    return ({ children, href }: any) => {
        return <a href={href}>{children}</a>
    }
})

describe('Hero Component', () => {
    it('renders the main heading', () => {
        render(<Hero />)
        expect(screen.getByText(/Professional Contracts/i)).toBeInTheDocument()
        expect(screen.getByText(/Generated in Minutes/i)).toBeInTheDocument()
    })

    it('renders the subheading', () => {
        render(<Hero />)
        expect(screen.getByText(/AI-powered contract generation for Australian builders/i)).toBeInTheDocument()
    })

    it('renders CTA buttons', () => {
        render(<Hero />)
        expect(screen.getByText('Start Free Trial')).toBeInTheDocument()
        expect(screen.getByText('View Demo')).toBeInTheDocument()
    })

    it('renders trust indicators', () => {
        render(<Hero />)
        expect(screen.getByText(/No credit card required/i)).toBeInTheDocument()
        expect(screen.getByText(/14-day free trial/i)).toBeInTheDocument()
        expect(screen.getByText(/Cancel anytime/i)).toBeInTheDocument()
    })

    it('renders dashboard preview', () => {
        render(<Hero />)
        expect(screen.getByText(/Active Projects/i)).toBeInTheDocument()
        expect(screen.getByText(/Contracts Generated/i)).toBeInTheDocument()
        expect(screen.getByText(/Time Saved/i)).toBeInTheDocument()
    })
})
