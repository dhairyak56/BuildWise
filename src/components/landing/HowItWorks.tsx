'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

// Custom Realistic 3D Icon Components
const CreateProjectIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 200 200" fill="none" className={className}>
        <defs>
            <linearGradient id="docGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4A90E2" />
                <stop offset="100%" stopColor="#357ABD" />
            </linearGradient>
            <filter id="shadow1">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3" />
            </filter>
        </defs>

        {/* Document with 3D effect */}
        <rect x="45" y="25" width="110" height="150" rx="12" fill="white" filter="url(#shadow1)" />
        <rect x="45" y="25" width="110" height="150" rx="12" fill="url(#docGrad)" opacity="0.1" />
        <rect x="45" y="25" width="110" height="20" rx="12" fill="url(#docGrad)" opacity="0.8" />

        {/* Form fields */}
        <rect x="60" y="55" width="80" height="8" rx="4" fill="#E5E7EB" />
        <rect x="60" y="70" width="60" height="8" rx="4" fill="#E5E7EB" />
        <rect x="60" y="90" width="80" height="8" rx="4" fill="#E5E7EB" />
        <rect x="60" y="105" width="50" height="8" rx="4" fill="#E5E7EB" />

        {/* Location pin with gradient */}
        <circle cx="100" cy="135" r="18" fill="url(#docGrad)" opacity="0.2" />
        <path d="M100 120 C88 120 82 127 82 137 C82 152 100 165 100 165 C100 165 118 152 118 137 C118 127 112 120 100 120Z"
            fill="url(#docGrad)" />
        <circle cx="100" cy="137" r="5" fill="white" />
    </svg>
)

const AIGenerateIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 200 200" fill="none" className={className}>
        <defs>
            <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4A90E2" />
                <stop offset="100%" stopColor="#357ABD" />
            </linearGradient>
            <radialGradient id="glowGrad">
                <stop offset="0%" stopColor="#4A90E2" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#4A90E2" stopOpacity="0" />
            </radialGradient>
            <filter id="shadow2">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3" />
            </filter>
        </defs>

        {/* Glowing AI brain */}
        <circle cx="100" cy="75" r="45" fill="url(#glowGrad)" />
        <circle cx="100" cy="75" r="38" fill="url(#aiGrad)" filter="url(#shadow2)" />

        {/* Neural network pattern */}
        <circle cx="85" cy="65" r="5" fill="white" opacity="0.9" />
        <circle cx="115" cy="65" r="5" fill="white" opacity="0.9" />
        <circle cx="100" cy="85" r="5" fill="white" opacity="0.9" />
        <circle cx="90" cy="75" r="3" fill="white" opacity="0.7" />
        <circle cx="110" cy="75" r="3" fill="white" opacity="0.7" />

        <line x1="85" y1="65" x2="100" y2="85" stroke="white" strokeWidth="2" opacity="0.5" />
        <line x1="115" y1="65" x2="100" y2="85" stroke="white" strokeWidth="2" opacity="0.5" />

        {/* Sparkle effects */}
        <path d="M145 55 L148 62 L155 65 L148 68 L145 75 L142 68 L135 65 L142 62 Z" fill="#FFD700" opacity="0.8" />
        <path d="M55 45 L57 50 L62 52 L57 54 L55 59 L53 54 L48 52 L53 50 Z" fill="#FFD700" opacity="0.6" />

        {/* Document being created with 3D effect */}
        <rect x="65" y="130" width="70" height="55" rx="8" fill="white" filter="url(#shadow2)" />
        <rect x="65" y="130" width="70" height="12" rx="8" fill="url(#aiGrad)" opacity="0.3" />
        <line x1="75" y1="150" x2="125" y2="150" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
        <line x1="75" y1="160" x2="115" y2="160" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
        <line x1="75" y1="170" x2="120" y2="170" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />

        {/* Animated arrow */}
        <path d="M100 115 L100 128" stroke="url(#aiGrad)" strokeWidth="3" strokeLinecap="round" />
        <path d="M95 123 L100 128 L105 123" stroke="url(#aiGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
)

const ReviewRefineIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 200 200" fill="none" className={className}>
        <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4A06A" />
                <stop offset="100%" stopColor="#b88650" />
            </linearGradient>
            <filter id="shadow3">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3" />
            </filter>
        </defs>

        {/* Document with 3D effect */}
        <rect x="55" y="45" width="90" height="110" rx="10" fill="white" filter="url(#shadow3)" />
        <rect x="55" y="45" width="90" height="15" rx="10" fill="url(#goldGrad)" opacity="0.2" />

        {/* Text lines */}
        <line x1="70" y1="75" x2="130" y2="75" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
        <line x1="70" y1="90" x2="120" y2="90" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
        <line x1="70" y1="105" x2="125" y2="105" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
        <line x1="70" y1="120" x2="115" y2="120" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />

        {/* Checkmarks with glow */}
        <circle cx="65" cy="75" r="6" fill="#10b981" opacity="0.2" />
        <path d="M62 75 L64 77 L68 73" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="65" cy="90" r="6" fill="#10b981" opacity="0.2" />
        <path d="M62 90 L64 92 L68 88" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Realistic magnifying glass with 3D effect */}
        <circle cx="135" cy="125" r="28" fill="url(#goldGrad)" opacity="0.1" filter="url(#shadow3)" />
        <circle cx="135" cy="125" r="24" fill="white" stroke="url(#goldGrad)" strokeWidth="4" />
        <circle cx="135" cy="125" r="16" stroke="url(#goldGrad)" strokeWidth="2" opacity="0.3" />

        {/* Handle with gradient */}
        <line x1="152" y1="142" x2="168" y2="158" stroke="url(#goldGrad)" strokeWidth="6" strokeLinecap="round" />
        <line x1="152" y1="142" x2="168" y2="158" stroke="#b88650" strokeWidth="4" strokeLinecap="round" />
    </svg>
)

const SignTrackIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 200 200" fill="none" className={className}>
        <defs>
            <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="shadow4">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3" />
            </filter>
        </defs>

        {/* Document with 3D effect */}
        <rect x="45" y="35" width="110" height="130" rx="12" fill="white" filter="url(#shadow4)" />
        <rect x="45" y="35" width="110" height="18" rx="12" fill="#10b981" opacity="0.1" />

        {/* Document content lines */}
        <line x1="60" y1="65" x2="140" y2="65" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="80" x2="130" y2="80" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="95" x2="135" y2="95" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" />

        {/* Signature line */}
        <line x1="60" y1="130" x2="140" y2="130" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />

        {/* Realistic handwritten signature */}
        <path d="M65 125 Q75 118 85 125 Q95 132 105 125 Q112 120 120 125"
            stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />

        {/* 3D checkmark badge with glow */}
        <circle cx="145" cy="55" r="30" fill="url(#greenGrad)" opacity="0.2" />
        <circle cx="145" cy="55" r="26" fill="url(#greenGrad)" filter="url(#shadow4)" />
        <path d="M132 55 L141 64 L158 47" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Progress tracker with 3D dots */}
        <circle cx="70" cy="110" r="5" fill="url(#greenGrad)" />
        <circle cx="88" cy="110" r="5" fill="url(#greenGrad)" />
        <circle cx="106" cy="110" r="5" fill="url(#greenGrad)" />
        <circle cx="124" cy="110" r="5" fill="#CBD5E1" />

        <line x1="70" y1="110" x2="124" y2="110" stroke="#E5E7EB" strokeWidth="2" />
    </svg>
)

const steps = [
    {
        number: '01',
        title: 'Create Your Project',
        description: 'Enter basic project details like location, scope, and timeline. Our smart forms guide you through the process.',
        icon: CreateProjectIcon,
        color: 'from-[#4A90E2] to-[#357ABD]'
    },
    {
        number: '02',
        title: 'AI Generates Contract',
        description: 'Our AI analyzes your project and generates a fully compliant contract in under 2 minutes, tailored to your trade.',
        icon: AIGenerateIcon,
        color: 'from-[#4A90E2] to-[#357ABD]'
    },
    {
        number: '03',
        title: 'Review & Refine',
        description: 'Review the contract with AI-powered risk analysis. Make edits, add clauses, or request refinements with one click.',
        icon: ReviewRefineIcon,
        color: 'from-[#D4A06A] to-[#b88650]'
    },
    {
        number: '04',
        title: 'Sign & Track',
        description: 'Send for e-signature, track progress, and manage variations. Everything in one place, always up to date.',
        icon: SignTrackIcon,
        color: 'from-green-500 to-green-600'
    }
]

export default function HowItWorks() {
    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234A90E2' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        From Project to Contract in{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#357ABD]">
                            4 Simple Steps
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600">
                        Get started in minutes, not hours. No training required.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="max-w-5xl mx-auto">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="relative mb-16 last:mb-0"
                        >
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                {/* Content - alternates sides */}
                                <div className={`${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${step.color} opacity-30`}>
                                            {step.number}
                                        </span>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {step.title}
                                        </h3>
                                    </div>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Icon - alternates sides */}
                                <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'} flex justify-center`}>
                                    <motion.div
                                        whileHover={{ scale: 1.05, rotate: 5 }}
                                        className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl`}
                                    >
                                        <step.icon className="w-16 h-16 text-white" />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Connecting Line (except for last item) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute left-1/2 top-32 w-0.5 h-16 bg-gradient-to-b from-gray-300 to-transparent transform -translate-x-1/2"></div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <a
                        href="/signup"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-[#4A90E2] rounded-xl hover:bg-[#357ABD] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Try It Free for 14 Days
                    </a>
                    <p className="mt-4 text-sm text-gray-500">No credit card required • Cancel anytime</p>
                </motion.div>
            </div>
        </section>
    )
}
