import { render, screen } from '@testing-library/react'
import { Logo } from './Logo'

describe('Logo Component', () => {
    it('renders correctly with default props', () => {
        render(<Logo />)
        const image = screen.getByAltText('BuildWise')
        expect(image).toBeInTheDocument()
        expect(image).toHaveAttribute('src', '/buildwise-logo.svg')
    })

    it('renders icon only when variant is icon', () => {
        render(<Logo variant="icon" />)
        // The text is part of the SVG in the default logo, but the icon variant loads a different SVG
        // We can check that the image source is correct
        const image = screen.getByAltText('BuildWise')
        expect(image).toHaveAttribute('src', '/buildwise-icon.svg')
    })

    it('applies custom className', () => {
        const { container } = render(<Logo className="custom-class" />)
        expect(container.firstChild).toHaveClass('custom-class')
    })
})
