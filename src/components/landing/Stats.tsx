'use client'

import { Users, Clock, TrendingUp, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const stats = [
    {
        icon: Users,
        value: '500+',
        label: 'Active Builders',
        description: 'Trust BuildWise daily',
        color: 'bg-blue-600',
    },
    {
        icon: Clock,
        value: '15k+',
        label: 'Hours Saved',
        description: 'By our customers',
        color: 'bg-blue-600',
    },
    {
        icon: TrendingUp,
        value: '40%',
        label: 'Growth Rate',
        description: 'Average capacity increase',
        color: 'bg-blue-600',
    },
    {
        icon: Award,
        value: '99.8%',
        label: 'Satisfaction',
        description: 'Customer approval rating',
        color: 'bg-orange-500',
    },
]

export default function Stats() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    return (
        <section ref={ref} className="py-20 bg-slate-900 relative overflow-hidden">
            <div className="section-container relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <motion.div
                                key={index}
                                className="flex flex-col items-center text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {/* Icon with rounded square background */}
                                <div className={`${stat.color} p-4 rounded-2xl mb-4 shadow-lg`}>
                                    <Icon className="h-7 w-7 text-white" strokeWidth={2} />
                                </div>

                                {/* Value */}
                                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                                    {stat.value}
                                </div>

                                {/* Label */}
                                <div className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-1">
                                    {stat.label}
                                </div>

                                {/* Description */}
                                <div className="text-xs text-slate-400">
                                    {stat.description}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
