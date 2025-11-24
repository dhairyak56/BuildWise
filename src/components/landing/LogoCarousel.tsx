'use client'

import { motion } from 'framer-motion'

interface Logo {
    name: string
    src: string
}

interface LogoCarouselProps {
    logos: Logo[]
    speed?: number
}

export function LogoCarousel({ logos, speed = 30 }: LogoCarouselProps) {
    // Duplicate logos for seamless infinite scroll
    const duplicatedLogos = [...logos, ...logos]

    return (
        <div className="relative overflow-hidden py-8">
            {/* Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

            {/* Scrolling container */}
            <motion.div
                className="flex gap-12 items-center"
                animate={{
                    x: [0, -50 * logos.length + '%']
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: speed,
                        ease: "linear"
                    }
                }}
            >
                {duplicatedLogos.map((logo, index) => (
                    <div
                        key={`${logo.name}-${index}`}
                        className="flex-shrink-0 w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                    >
                        <img
                            src={logo.src}
                            alt={logo.name}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    )
}
