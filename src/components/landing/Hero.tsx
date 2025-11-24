'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-white font-poppins">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-white"></div>

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

            {/* Radial gradient overlay */}
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[#4A90E2] opacity-20 blur-[100px]"></div>

            <div className="section-container relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4A90E2] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4A90E2]"></span>
                        </span>
                        <span className="text-sm font-medium text-blue-900">
                            Trusted by 500+ Australian builders
                        </span>
                    </motion.div>

                    {/* Main heading */}
                    <motion.h1
                        className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Professional Contracts
                        <br />
                        <span className="bg-gradient-to-r from-[#4A90E2] to-[#357ABD] bg-clip-text text-transparent">
                            Generated in Minutes
                        </span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        AI-powered contract generation for Australian builders. Create compliant construction contracts without lawyers or delays.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Link href="/signup">
                            <button className="group inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white bg-[#4A90E2] rounded-lg hover:bg-[#357ABD] transition-all duration-200 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-0.5">
                                Start Free Trial
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <Link href="/dashboard">
                            <button className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-gray-700 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                                View Demo
                            </button>
                        </Link>
                    </motion.div>

                    {/* Trust indicators */}
                    <motion.div
                        className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span>14-day free trial</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span>Cancel anytime</span>
                        </div>
                    </motion.div>
                </div>

                {/* Dashboard preview */}
                <motion.div
                    className="mt-16 max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                >
                    <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
                        {/* Browser chrome */}
                        <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="px-3 py-1 rounded-md bg-white border border-gray-200 text-xs text-gray-500 font-medium">
                                    buildwise.ai/dashboard
                                </div>
                            </div>
                        </div>

                        {/* Dashboard content */}
                        <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
                            <div className="grid grid-cols-3 gap-6 mb-6">
                                {[
                                    { label: 'Active Projects', value: '24', color: 'blue' },
                                    { label: 'Contracts Generated', value: '156', color: 'green' },
                                    { label: 'Time Saved', value: '89h', color: 'purple' },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.7 + (i * 0.1), duration: 0.4 }}
                                    >
                                        <div className={`text-2xl font-bold text-${stat.color}-600 mb-1`}>{stat.value}</div>
                                        <div className="text-xs text-gray-500">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Contract list */}
                            <div className="space-y-3">
                                {[
                                    { name: 'Kitchen Renovation Contract', status: 'Active', progress: 75 },
                                    { name: 'Bathroom Extension Agreement', status: 'Review', progress: 45 },
                                    { name: 'Deck Construction Scope', status: 'Signed', progress: 100 },
                                ].map((contract, i) => (
                                    <motion.div
                                        key={i}
                                        className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1 + (i * 0.1), duration: 0.4 }}
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 mb-1">{contract.name}</div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                <motion.div
                                                    className="bg-[#4A90E2] h-1.5 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${contract.progress}%` }}
                                                    transition={{ delay: 1.2 + (i * 0.1), duration: 0.8 }}
                                                />
                                            </div>
                                        </div>
                                        <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${contract.status === 'Active' ? 'bg-blue-50 text-blue-700' :
                                            contract.status === 'Review' ? 'bg-amber-50 text-amber-700' :
                                                'bg-green-50 text-green-700'
                                            }`}>
                                            {contract.status}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
