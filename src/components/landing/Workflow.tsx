'use client'

import { CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

// Custom workflow illustrations
const WorkflowIllustrations = {
    Onboarding: () => (
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
            <rect x="40" y="60" width="120" height="80" rx="8" fill="currentColor" opacity="0.1" />
            <rect x="40" y="60" width="120" height="80" rx="8" stroke="currentColor" strokeWidth="3" />
            <circle cx="70" cy="90" r="12" fill="currentColor" opacity="0.3" />
            <circle cx="70" cy="90" r="12" stroke="currentColor" strokeWidth="2" />
            <line x1="90" y1="85" x2="140" y2="85" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="90" y1="95" x2="130" y2="95" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="115" x2="150" y2="115" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="125" x2="140" y2="125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    Generation: () => (
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
            <path d="M100 40L120 80L160 80L130 105L145 145L100 120L55 145L70 105L40 80L80 80L100 40Z" fill="currentColor" opacity="0.2" />
            <path d="M100 40L120 80L160 80L130 105L145 145L100 120L55 145L70 105L40 80L80 80L100 40Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
            <circle cx="170" cy="50" r="4" fill="currentColor" />
            <circle cx="30" cy="150" r="4" fill="currentColor" />
            <circle cx="180" cy="140" r="3" fill="currentColor" />
            <path d="M90 100L95 105L110 90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Analysis: () => (
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
            <circle cx="100" cy="100" r="60" fill="currentColor" opacity="0.1" />
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="3" />
            <path d="M70 100L90 120L130 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
            <circle cx="100" cy="100" r="20" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" opacity="0.3" />
        </svg>
    ),
}

const workflows = [
    {
        title: 'Client Onboarding',
        description: 'Transform scattered client information into structured case files in minutes. Combine meetings, emails, messages, and documents into organized, searchable files your team can access instantly.',
        icon: WorkflowIllustrations.Onboarding,
        bgColor: 'bg-blue-100/50',
        iconColor: 'text-[#4A90E2]',
    },
    {
        title: 'Smart Generation',
        description: 'AI analyzes your project details and generates compliant contracts in under 2 minutes. Every clause is tailored to Australian construction law and your specific trade.',
        icon: WorkflowIllustrations.Generation,
        bgColor: 'bg-blue-100/50',
        iconColor: 'text-[#4A90E2]',
    },
    {
        title: 'Risk Analysis',
        description: 'Analyze thousands of documents and extract key terms with relative accuracy. Pinpoint entire case folders in minutes, identifying critical information and patterns across hundreds of files.',
        icon: WorkflowIllustrations.Analysis,
        bgColor: 'bg-blue-100/50',
        iconColor: 'text-[#4A90E2]',
    },
]

export default function Workflow() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section ref={ref} className="py-24 bg-gray-50 font-poppins">
            <div className="section-container">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Built for{' '}
                        <span className="bg-gradient-to-r from-[#4A90E2] via-[#357ABD] to-[#4A90E2] bg-clip-text text-transparent">
                            Every Stage
                        </span>
                        {' '}of Your Workflow
                    </h2>
                    <p className="text-xl text-gray-600">
                        From client onboarding to contract signing, we have got you covered
                    </p>
                </motion.div>

                {/* Workflow Steps */}
                <div className="space-y-24">
                    {workflows.map((workflow, index) => (
                        <motion.div
                            key={index}
                            className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                                }`}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                        >
                            {/* Visual */}
                            <motion.div
                                className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className={`relative rounded-2xl ${workflow.bgColor} p-12 border border-white/50 shadow-lg`}>
                                    <div className="text-center">
                                        {/* Custom Icon */}
                                        <motion.div
                                            className={`inline-flex items-center justify-center w-32 h-32 rounded-2xl bg-white/80 backdrop-blur-sm mb-8 shadow-lg ${workflow.iconColor}`}
                                            whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <div className="w-24 h-24">
                                                <workflow.icon />
                                            </div>
                                        </motion.div>

                                        {/* Progress Steps */}
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                                    transition={{ delay: index * 0.2 + (i * 0.1), duration: 0.5 }}
                                                >
                                                    <CheckCircle2 className="h-5 w-5 text-[#4A90E2] flex-shrink-0" />
                                                    <div className="flex-1 flex items-center gap-2">
                                                        <motion.div
                                                            className="h-2 bg-[#4A90E2] rounded-full"
                                                            initial={{ width: 0 }}
                                                            animate={isInView ? { width: `${100 - (i * 20)}%` } : { width: 0 }}
                                                            transition={{ delay: index * 0.2 + (i * 0.1) + 0.3, duration: 0.8 }}
                                                        />
                                                        <div className="h-2 bg-gray-200 rounded-full flex-1"></div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Content */}
                            <motion.div
                                className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}
                                initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
                                transition={{ duration: 0.8, delay: index * 0.2 + 0.2 }}
                            >
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                    {workflow.title}
                                </h3>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {workflow.description}
                                </p>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
