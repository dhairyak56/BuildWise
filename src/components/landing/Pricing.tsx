'use client'

import { Check } from 'lucide-react'

const tiers = [
    {
        name: 'Starter',
        price: 'Free',
        description: 'Perfect for small contractors just getting started.',
        features: [
            'Up to 3 projects',
            'Basic contract templates',
            'Standard risk analysis',
            'PDF export',
        ],
        cta: 'Start for Free',
        popular: false,
    },
    {
        name: 'Pro',
        price: '$49',
        period: '/month',
        description: 'For growing construction businesses needing more power.',
        features: [
            'Unlimited projects',
            'Advanced AI contract generation',
            'Deep risk analysis & mitigation',
            'Priority email support',
            'Custom branding',
        ],
        cta: 'Start Free Trial',
        popular: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'Tailored solutions for large construction firms.',
        features: [
            'Unlimited team members',
            'API access',
            'Dedicated account manager',
            'Custom legal frameworks',
            'SLA & uptime guarantees',
        ],
        cta: 'Contact Sales',
        popular: false,
    },
]

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />

            <div className="section-container relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-lg text-slate-600">
                        Choose the plan that fits your business size and needs. No hidden fees.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative rounded-2xl p-8 transition-all duration-300 ${tier.popular
                                    ? 'bg-white shadow-xl border-2 border-blue-600 scale-105 z-10'
                                    : 'bg-white border border-slate-200 hover:border-blue-200 hover:shadow-lg'
                                }`}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                                <p className="text-slate-500 text-sm mb-6">{tier.description}</p>
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                                    {tier.period && (
                                        <span className="text-slate-500 ml-1">{tier.period}</span>
                                    )}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start text-sm text-slate-600">
                                        <Check className="w-5 h-5 text-blue-600 mr-3 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-3 rounded-lg font-semibold transition-colors ${tier.popular
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                                    }`}
                            >
                                {tier.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
