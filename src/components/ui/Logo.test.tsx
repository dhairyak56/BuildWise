import { render, screen } from '@testing-library/react'
import { Logo } from './Logo'

describe('Logo Component', () => {
    it('renders correctly with default props', () => {
        render(<Logo />)
        expect(screen.getByText('BuildWise')).toBeInTheDocument()
        expect(screen.getByAltText('BuildWise')).toBeInTheDocument()
    })

    it('renders without text when showText is false', () => {
        render(<Logo showText={false} />)
        expect(screen.queryByText('BuildWise')).not.toBeInTheDocument()
        expect(screen.getByAltText('BuildWise')).toBeInTheDocument()
    })

    it('applies custom className', () => {
        const { container } = render(<Logo className="custom-class" />)
        expect(container.firstChild).toHaveClass('custom-class')
    })
})
