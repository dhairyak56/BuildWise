import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
    className?: string
    textClassName?: string
    variant?: 'default' | 'dark' | 'light'
    showText?: boolean
}

export function Logo({
    className,
    textClassName,
    variant = 'default',
    showText = true
}: LogoProps) {
    const colors = {
        default: 'text-slate-900',
        dark: 'text-white',
        light: 'text-white'
    }

    return (
        <div className={cn("flex items-center gap-2.5", className)}>
            <div className="relative w-8 h-8 transition-transform hover:scale-105">
                <Image
                    src="/Buildwise.svg"
                    alt="BuildWise"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            {showText && (
                <span className={cn(
                    "font-bold text-xl tracking-tight",
                    colors[variant],
                    textClassName
                )}>
                    BuildWise
                </span>
            )}
        </div>
    )
}
