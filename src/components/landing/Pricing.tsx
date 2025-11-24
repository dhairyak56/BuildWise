'use client'

import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const plans = [
    {
        name: 'Starter',
        price: '49',
        description: 'Perfect for small builders and solo contractors',
        features: [
            '10 contracts per month',
            'AI contract generation',
            'Basic risk analysis',
            'Email support',
            'Australian law compliance',
        ],
        cta: 'Start Free Trial',
        popular: false,
    },
    {
        name: 'Professional',
        price: '99',
        description: 'For growing construction businesses',
        features: [
            'Unlimited contracts',
            'Advanced AI generation',
            'Smart risk analysis',
            'E-signature integration',
            'Document OCR & auto-import',
            'Priority support',
            'Custom clause library',
            'Analytics dashboard',
        ],
        cta: 'Start Free Trial',
        popular: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For large construction firms',
        features: [
            'Everything in Professional',
            'Unlimited team members',
            'Custom integrations',
            'Dedicated account manager',
            'Advanced analytics',
            'SLA guarantee',
            'Custom training',
        ],
        cta: 'Contact Sales',
        popular: false,
    },
]

export default function Pricing() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section id="pricing" className="py-24 bg-white relative overflow-hidden font-poppins">
            {/* Subtle background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>

            <div className="section-container relative z-10">
                {/* Section Header */}
                <motion.div
                    ref={ref}
                    className="text-center max-w-3xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Simple, Transparent{' '}
                        <span className="bg-gradient-to-r from-[#4A90E2] to-[#357ABD] bg-clip-text text-transparent">
                            Pricing
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600">
                        Choose the perfect plan for your business. All plans include a 14-day free trial.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            className={`relative rounded-2xl p-8 transition-all duration-300 ${plan.popular
                                ? 'bg-white border-2 border-[#4A90E2] shadow-xl shadow-blue-500/10 scale-105'
                                : 'bg-white border border-gray-200 hover:border-blue-200 hover:shadow-lg'
                                }`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -4 }}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#4A90E2] text-white text-sm font-semibold shadow-lg">
                                        <Sparkles className="h-4 w-4" />
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            {/* Plan Name */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {plan.name}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 mb-6">
                                {plan.description}
                            </p>

                            {/* Price */}
                            <div className="mb-6">
                                {plan.price === 'Custom' ? (
                                    <div className="text-4xl font-bold text-gray-900">
                                        Custom
                                    </div>
                                ) : (
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-bold text-gray-900">
                                            ${plan.price}
                                        </span>
                                        <span className="text-lg text-gray-600">
                                            /month
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* CTA Button */}
                            <Link href={plan.cta === 'Contact Sales' ? '/contact' : '/signup'}>
                                <button
                                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 mb-8 ${plan.popular
                                        ? 'bg-[#4A90E2] text-white hover:bg-[#357ABD] shadow-lg shadow-blue-500/50'
                                        : 'bg-gray-900 text-white hover:bg-gray-800'
                                        }`}
                                >
                                    {plan.cta}
                                </button>
                            </Link>

                            {/* Features */}
                            <ul className="space-y-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-600">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Badge */}
                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <p className="text-gray-600">
                        All plans include a 14-day free trial. No credit card required.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
