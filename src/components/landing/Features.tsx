'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

// Custom SVG illustrations
const CustomIcons = {
    Lightning: () => (
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <path d="M32 4L20 28H32L28 52L44 28H32L32 4Z" fill="currentColor" opacity="0.2" />
            <path d="M32 4L20 28H32L28 52" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M32 28H44L32 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="32" cy="28" r="3" fill="currentColor" />
        </svg>
    ),
    Shield: () => (
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <path d="M32 8L12 16V28C12 42 20 52 32 56C44 52 52 42 52 28V16L32 8Z" fill="currentColor" opacity="0.2" />
            <path d="M32 8L12 16V28C12 42 20 52 32 56C44 52 52 42 52 28V16L32 8Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 30L28 36L42 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Document: () => (
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <path d="M16 8H38L48 18V56H16V8Z" fill="currentColor" opacity="0.2" />
            <path d="M16 8H38L48 18V56H16V8Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M38 8V18H48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="24" y1="28" x2="40" y2="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="24" y1="36" x2="40" y2="36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="24" y1="44" x2="32" y2="44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
    ),
    Clock: () => (
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="20" fill="currentColor" opacity="0.2" />
            <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="3" />
            <path d="M32 20V32L40 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="32" cy="32" r="2" fill="currentColor" />
        </svg>
    ),
    Stars: () => (
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <path d="M32 12L36 24H48L38 32L42 44L32 36L22 44L26 32L16 24H28L32 12Z" fill="currentColor" opacity="0.2" />
            <path d="M32 12L36 24H48L38 32L42 44L32 36L22 44L26 32L16 24H28L32 12Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="48" cy="16" r="2" fill="currentColor" />
            <circle cx="16" cy="48" r="2" fill="currentColor" />
            <circle cx="52" cy="48" r="1.5" fill="currentColor" />
        </svg>
    ),
    Growth: () => (
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <path d="M12 52L20 40L28 44L36 28L44 36L52 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M42 20H52V30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="20" cy="40" r="3" fill="currentColor" />
            <circle cx="28" cy="44" r="3" fill="currentColor" />
            <circle cx="36" cy="28" r="3" fill="currentColor" />
            <circle cx="44" cy="36" r="3" fill="currentColor" />
            <circle cx="52" cy="20" r="3" fill="currentColor" />
        </svg>
    ),
}

const features = [
    {
        icon: CustomIcons.Lightning,
        title: 'Lightning Fast',
        description: 'Generate professional contracts in under 2 minutes. What used to take 8 hours now takes 20 minutes.',
        color: 'text-blue-600',
        bg: 'bg-teal-50',
        gradient: 'from-blue-600 to-indigo-600',
    },
    {
        icon: CustomIcons.Shield,
        title: 'Risk Protection',
        description: 'AI scans every clause for risks, missing terms, and compliance issues before you sign.',
        color: 'text-blue-500',
        bg: 'bg-emerald-50',
        gradient: 'from-blue-500 to-blue-600',
    },
    {
        icon: CustomIcons.Document,
        title: 'Instant Variations',
        description: 'Generate variation orders on the fly when project scope changes. Keep clients informed.',
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        gradient: 'from-blue-500 to-indigo-600',
    },
    {
        icon: CustomIcons.Clock,
        title: 'Save 15+ Hours Weekly',
        description: 'Automate documentation and focus on building. Take on 40% more projects without hiring.',
        color: 'text-amber-500',
        bg: 'bg-amber-50',
        gradient: 'from-amber-500 to-orange-500',
    },
    {
        icon: CustomIcons.Stars,
        title: 'Australian Compliance',
        description: 'Built-in templates comply with Australian construction law across all trades and states.',
        color: 'text-purple-500',
        bg: 'bg-purple-50',
        gradient: 'from-purple-500 to-pink-500',
    },
    {
        icon: CustomIcons.Growth,
        title: 'Scale Profitably',
        description: 'Grow your business without overhead. Track performance and optimize your workflow.',
        color: 'text-rose-500',
        bg: 'bg-rose-50',
        gradient: 'from-rose-500 to-pink-500',
    },
]

function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
            {/* Animated gradient background on hover */}
            <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                initial={false}
            />

            {/* Custom animated icon */}
            <motion.div
                className={`inline-flex p-4 rounded-xl ${feature.bg} mb-5 relative z-10 ${feature.color}`}
                whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="w-8 h-8">
                    <feature.icon />
                </div>
            </motion.div>

            {/* Content */}
            <h3 className="text-xl font-semibold text-slate-900 mb-3 relative z-10">
                {feature.title}
            </h3>
            <p className="text-slate-600 leading-relaxed relative z-10">
                {feature.description}
            </p>

            {/* Animated corner decoration */}
            <motion.div
                className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-400/20 to-transparent rounded-bl-full"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    )
}

export default function Features() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section ref={ref} className="py-24 bg-white relative overflow-hidden">
            {/* Animated background elements */}
            <motion.div
                className="absolute top-1/4 left-0 w-96 h-96 bg-teal-200/10 rounded-full blur-3xl"
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <div className="section-container relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h2
                        className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Everything You Need to{' '}
                        <motion.span
                            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent"
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{ backgroundSize: '200% 200%' }}
                        >
                            Build Better
                        </motion.span>
                    </motion.h2>
                    <motion.p
                        className="text-xl text-slate-600"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Powerful features designed specifically for Australian builders and contractors
                    </motion.p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}
