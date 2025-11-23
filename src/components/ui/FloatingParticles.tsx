'use client'

import { useEffect, useState } from 'react'

interface Particle {
    id: number
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    color: string
    duration: number // New property
    delay: number // New property
}

export default function FloatingParticles() {
    const [particles, setParticles] = useState<Particle[]>([])

    useEffect(() => {
        // Initialize particles
        const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
            id: i, // Re-add id for key prop
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 10 + 5, // Changed size calculation
            speedX: (Math.random() - 0.5) * 0.5, // Keep speedX
            speedY: (Math.random() - 0.5) * 0.5, // Keep speedY
            duration: Math.random() * 20 + 10, // New property
            delay: Math.random() * 5, // New property
            delay: Math.random() * 5, // New property
            color: ['teal', 'emerald', 'cyan', 'blue'][Math.floor(Math.random() * 4)],
        }))

        // Use setTimeout to avoid synchronous state update warning
        const timer = setTimeout(() => {
            setParticles(newParticles)
        }, 0)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        // Animate particles
        const interval = setInterval(() => {
            setParticles(prev =>
                prev.map(p => ({
                    ...p,
                    x: (p.x + p.speedX + 100) % 100,
                    y: (p.y + p.speedY + 100) % 100,
                }))
            )
        }, 50)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className={`absolute rounded-full bg-${particle.color}-400/10 blur-xl transition-all duration-1000 ease-linear`}
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                    }}
                />
            ))}
        </div>
    )
}
