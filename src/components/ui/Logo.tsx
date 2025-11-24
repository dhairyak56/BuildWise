import Image from 'next/image'

interface LogoProps {
    variant?: 'default' | 'white' | 'icon'
    className?: string
    width?: number
    height?: number
}

export function Logo({ variant = 'default', className = '', width, height }: LogoProps) {
    const logoSrc = variant === 'white'
        ? '/buildwise-logo-white.svg'
        : variant === 'icon'
            ? '/buildwise-icon.svg'
            : '/buildwise-logo.svg'

    const defaultWidth = variant === 'icon' ? 48 : 160
    const defaultHeight = variant === 'icon' ? 48 : 48

    return (
        <Image
            src={logoSrc}
            alt="BuildWise"
            width={width || defaultWidth}
            height={height || defaultHeight}
            className={className}
            priority
        />
    )
}
