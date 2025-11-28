'use client'

import { motion } from 'framer-motion'
import { Clock, DollarSign, Shield, CheckCircle2 } from 'lucide-react'

const benefits = [
    {
        icon: Clock,
        title: 'Save 20+ Hours Per Week',
        description: 'Automate contract generation, risk analysis, and compliance checks. Spend less time on paperwork, more time building.',
        stat: '95%',
        statLabel: 'Time Saved',
        color: 'bg-blue-50',
        iconColor: 'text-blue-600'
    },
    {
        icon: DollarSign,
        title: 'Reduce Costs by 40%',
        description: 'Cut legal fees, avoid costly disputes, and minimize project delays with AI-powered contract analysis.',
        stat: '$12k',
        statLabel: 'Avg. Savings',
        color: 'bg-green-50',
        iconColor: 'text-green-600'
    },
    {
        icon: Shield,
        title: 'Mitigate Risk Proactively',
        description: 'Identify potential issues before they become expensive problems. Our AI scans every clause for red flags.',
        stat: '99%',
        statLabel: 'Risk Detection',
        color: 'bg-orange-50',
        iconColor: 'text-orange-600'
    },
    {
        icon: CheckCircle2,
        title: '100% Compliance Guaranteed',
        description: 'Stay compliant with Australian construction law. All templates are reviewed by legal experts and updated regularly.',
        stat: '100%',
        statLabel: 'Compliant',
        color: 'bg-purple-50',
        iconColor: 'text-purple-600'
    }
]

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
}

export default function Benefits() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-30 -z-10"></div>

            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Why Australian Builders Choose BuildWise
                    </h2>
                    <p className="text-xl text-gray-600">
                        Measurable results that impact your bottom line
                    </p>
                </motion.div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group relative"
                        >
                            <div className="h-full p-8 rounded-2xl border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                {/* Icon and Stat */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`w-14 h-14 ${benefit.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <benefit.icon className={`w-7 h-7 ${benefit.iconColor}`} />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-gray-900">{benefit.stat}</div>
                                        <div className="text-sm text-gray-500">{benefit.statLabel}</div>
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {benefit.description}
                                </p>

                                {/* Hover indicator */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
