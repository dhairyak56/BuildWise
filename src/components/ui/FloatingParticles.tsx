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
}

export default function FloatingParticles() {
    const [particles, setParticles] = useState<Particle[]>([])

    useEffect(() => {
        // Create particles
        const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 60 + 20,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: ['teal', 'emerald', 'cyan', 'blue'][Math.floor(Math.random() * 4)],
        }))
        setParticles(newParticles)

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
