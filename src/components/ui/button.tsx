import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'primary' | 'secondary'
    size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'md', ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-50",
                    {
                        'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30': variant === 'primary',
                        'bg-gray-900 text-white hover:bg-gray-800': variant === 'default',
                        'border-2 border-gray-300 bg-transparent hover:bg-gray-50': variant === 'outline',
                        'hover:bg-gray-100 text-gray-700': variant === 'ghost',
                        'bg-accent-600 text-white hover:bg-accent-700': variant === 'secondary',
                    },
                    {
                        'h-9 px-4 text-sm': size === 'sm',
                        'h-11 px-6 text-base': size === 'md',
                        'h-14 px-8 text-lg': size === 'lg',
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }