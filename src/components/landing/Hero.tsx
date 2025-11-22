'use client'

import Link from 'next/link'
import { ArrowRight, Shield, Zap, Play, FileText } from 'lucide-react'

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
            {/* Technical Grid Background */}
            <div className="absolute inset-0 grid-bg opacity-[0.4]"></div>

            {/* Radial Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-50 pointer-events-none"></div>

            <div className="section-container relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Social Proof Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-in">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                                    {i}
                                </div>
                            ))}
                        </div>
                        <span className="text-sm font-medium text-slate-600 pl-1">
                            Trusted by 500+ Builders
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight animate-fade-in-up">
                        Generate Legal Contracts in{' '}
                        <span className="relative inline-block text-blue-600">
                            Minutes
                            <svg className="absolute -bottom-2 left-0 w-full text-blue-200" height="8" viewBox="0 0 100 8" fill="none">
                                <path d="M0 4C30 4, 70 4, 100 4" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                            </svg>
                        </span>
                        <br />
                        Not Days
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
                        AI-powered contract generation for Australian builders. Create professional construction contracts, variations, and scopes without lawyers or delays.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up delay-200">
                        <Link href="/signup">
                            <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white rounded-xl bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all duration-300 hover:-translate-y-1">
                                <span className="relative flex items-center gap-2">
                                    Start Free Trial
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </Link>
                        <button className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-700 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300">
                            <Play size={20} className="mr-2 fill-slate-700" />
                            Watch Demo
                        </button>
                    </div>

                    {/* Dashboard Mockup */}
                    <div className="relative max-w-6xl mx-auto animate-fade-in-up delay-300 animate-float">
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-20"></div>

                        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                            {/* Browser Header */}
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-4">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                                </div>
                                <div className="flex-1 text-center">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-500 font-medium">
                                        <Shield size={10} />
                                        buildwise.ai/dashboard
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="p-8 bg-slate-50/50">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    {[
                                        { label: 'Contracts Generated', value: '247', icon: FileText, color: 'text-blue-600' },
                                        { label: 'Time Saved', value: '156h', icon: Zap, color: 'text-amber-500' },
                                        { label: 'Risk Alerts', value: '12', icon: Shield, color: 'text-emerald-500' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}>
                                                    <stat.icon size={20} />
                                                </div>
                                                <span className="text-xs font-medium text-slate-400">Last 30 days</span>
                                            </div>
                                            <div className="text-3xl font-bold text-slate-900 mb-1">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                                        <h3 className="font-semibold text-slate-900">Recent Contracts</h3>
                                        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {[
                                            {
                                                title: 'Residential Build Contract',
                                                client: 'Smith Residence',
                                                date: '2 hours ago',
                                                status: 'Signed',
                                                statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                                                icon: FileText
                                            },
                                            {
                                                title: 'Electrical Subcontract',
                                                client: 'Apex Towers L3',
                                                date: '5 hours ago',
                                                status: 'Pending',
                                                statusColor: 'bg-amber-50 text-amber-700 border-amber-100',
                                                icon: Zap
                                            },
                                            {
                                                title: 'Variation Order #04',
                                                client: 'Miller Renovation',
                                                date: '1 day ago',
                                                status: 'Draft',
                                                statusColor: 'bg-slate-100 text-slate-600 border-slate-200',
                                                icon: FileText
                                            }
                                        ].map((contract, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-blue-50 text-blue-600' : i === 1 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                                        <contract.icon size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900">{contract.title}</div>
                                                        <div className="text-xs text-slate-500 flex items-center gap-2">
                                                            <span>{contract.client}</span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                            <span>{contract.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${contract.statusColor}`}>
                                                    {contract.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
