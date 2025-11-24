'use client'

import Image from 'next/image'

interface Logo {
    name: string
    src: string
}

interface LogoCarouselProps {
    logos: Logo[]
}

export function LogoCarousel({ logos }: LogoCarouselProps) {
    return (
        <div className="w-full py-8">
            {/* Static grid layout */}
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                {logos.map((logo, index) => (
                    <div
                        key={`${logo.name}-${index}`}
                        className="flex-shrink-0 w-60 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                    >
                        <Image
                            src={logo.src}
                            alt={logo.name}
                            width={240}
                            height={80}
                            className="max-w-full max-h-full object-contain"
                            unoptimized
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
