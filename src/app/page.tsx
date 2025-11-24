'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Star, Check, ArrowRight, Shield, Clock, FileText, Zap } from 'lucide-react'
import { LogoCarousel } from '@/components/landing/LogoCarousel'
import { Logo } from '@/components/ui/Logo'

// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
}

export default function Home() {
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index)
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-poppins bg-[#F4F6F8] text-[#333333]">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-[#F4F6F8]/80 backdrop-blur-md">
                <div className="container mx-auto flex items-center justify-between whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-4">
                        <Logo />
                    </div>
                    <nav className="hidden items-center gap-8 md:flex">
                        <a className="text-sm font-medium text-gray-600 hover:text-[#4A90E2] transition-colors" href="#features">Features</a>
                        <a className="text-sm font-medium text-gray-600 hover:text-[#4A90E2] transition-colors" href="#pricing">Pricing</a>
                        <a className="text-sm font-medium text-gray-600 hover:text-[#4A90E2] transition-colors" href="#testimonials">Testimonials</a>
                        <a className="text-sm font-medium text-gray-600 hover:text-[#4A90E2] transition-colors" href="#faq">FAQ</a>
                    </nav>
                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <button className="hidden sm:flex px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                                Log In
                            </button>
                        </Link>
                        <Link href="/signup">
                            <button className="px-5 py-2 rounded-lg bg-[#4A90E2] text-white text-sm font-bold hover:bg-[#357ABD] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                Start Free Trial
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative py-20 md:py-32 overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#4A90E2]/10 blur-3xl animate-blob"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#D4A06A]/10 blur-3xl animate-blob animation-delay-2000"></div>
                    </div>

                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeIn}
                                className="flex flex-col gap-8 text-center lg:text-left"
                            >
                                <div className="inline-flex items-center gap-2 self-center lg:self-start rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-[#4A90E2] border border-blue-100">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4A90E2] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4A90E2]"></span>
                                    </span>
                                    New: AI Contract Analysis
                                </div>
                                <h1 className="text-5xl font-black leading-[1.1] tracking-tight md:text-6xl lg:text-7xl text-gray-900">
                                    Build smarter, <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#357ABD]">contract faster.</span>
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    The all-in-one platform for Australian builders. Create compliant contracts, track projects, and manage risk in minutes, not hours.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Link href="/signup">
                                        <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#4A90E2] text-white text-lg font-bold hover:bg-[#357ABD] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                            Start Free Trial <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </Link>
                                    <Link href="#features">
                                        <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-gray-700 text-lg font-bold border border-gray-200 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md">
                                            View Demo
                                        </button>
                                    </Link>
                                </div>
                                <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Check className="w-4 h-4 text-green-500" /> No credit card required
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Check className="w-4 h-4 text-green-500" /> 14-day free trial
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative"
                            >
                                <div className="relative z-10 rounded-2xl bg-white p-2 shadow-2xl border border-gray-200 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                                    <Image
                                        src="/dashboard-screenshot.png"
                                        alt="BuildWise Dashboard"
                                        width={800}
                                        height={600}
                                        className="rounded-xl w-full h-auto"
                                        priority
                                    />
                                    {/* Floating Badge 1 */}
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -right-6 top-10 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3"
                                    >
                                        <div className="bg-green-100 p-2 rounded-lg">
                                            <Check className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Contract Status</p>
                                            <p className="font-bold text-gray-900">Signed & Secure</p>
                                        </div>
                                    </motion.div>
                                    {/* Floating Badge 2 */}
                                    <motion.div
                                        animate={{ y: [0, 10, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                        className="absolute -left-6 bottom-20 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3"
                                    >
                                        <div className="bg-orange-100 p-2 rounded-lg">
                                            <Shield className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Risk Analysis</p>
                                            <p className="font-bold text-gray-900">Low Risk Detected</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Trusted By - Logo Carousel */}
                <section className="py-10 border-y border-gray-200 bg-white">
                    <div className="container mx-auto px-4">
                        <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">Trusted by leading builders across Australia</p>
                        <LogoCarousel
                            logos={[
                                { name: 'Apex Builders', src: '/logos/apex-builders.svg' },
                                { name: 'Summit Construction', src: '/logos/summit-construction.svg' },
                                { name: 'Foundation Group', src: '/logos/foundation-group.svg' },
                                { name: 'Skyline Projects', src: '/logos/skyline-projects.svg' },
                                { name: 'Cornerstone Build', src: '/logos/cornerstone-build.svg' }
                            ]}
                        />
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 bg-[#F4F6F8]">
                    <div className="container mx-auto px-4">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            {[
                                { number: "10k+", label: "Contracts Generated", icon: FileText },
                                { number: "$500m+", label: "Project Value Managed", icon: Zap },
                                { number: "20k+", label: "Hours Saved", icon: Clock },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeIn}
                                    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
                                >
                                    <div className="mx-auto w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-[#4A90E2]">
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                                    <p className="text-gray-600 font-medium">{stat.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to build better</h2>
                            <p className="mt-4 text-lg text-[#333333]/80">BuildWise offers a suite of powerful tools designed for the modern Australian builder. From initial draft to final sign-off, we&apos;ve got you covered.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[
                                {
                                    title: "Smart Contracts",
                                    desc: "Generate compliant contracts in seconds with our intelligent template engine.",
                                    icon: FileText,
                                    color: "bg-blue-50 text-blue-600"
                                },
                                {
                                    title: "Risk Analytics",
                                    desc: "Identify potential issues before they become expensive problems.",
                                    icon: Shield,
                                    color: "bg-orange-50 text-orange-600"
                                },
                                {
                                    title: "Workflow Tracking",
                                    desc: "Keep all your projects on track with visual timelines and automated alerts.",
                                    icon: Zap,
                                    color: "bg-purple-50 text-purple-600"
                                }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group p-8 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-24 bg-[#F4F6F8]">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Loved by Aussie Builders</h2>
                            <p className="text-xl text-gray-600">Don&apos;t just take our word for it.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    quote: "BuildWise has completely transformed how we manage our construction projects. The AI contract analysis alone has saved us thousands in legal fees.",
                                    author: "Sarah Jenkins",
                                    role: "Director, Jenkins Constructions",
                                    avatar: "SJ"
                                },
                                {
                                    quote: "The risk analysis tool saved us from a potentially disastrous contract clause. It pays for itself 100x over.",
                                    author: "Mike Thompson",
                                    role: "Project Manager, Urban Build",
                                    avatar: "MT"
                                },
                                {
                                    quote: "Finally, software that actually understands how Australian construction works. Simple, fast, and compliant.",
                                    author: "David Chen",
                                    role: "Owner, Chen & Co Builders",
                                    avatar: "DC"
                                }
                            ].map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                                >
                                    <div className="flex gap-1 text-yellow-400 mb-6">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                                    </div>
                                    <p className="text-gray-700 text-lg mb-6 italic">&quot;{testimonial.quote}&quot;</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{testimonial.author}</p>
                                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
                            <p className="text-xl text-gray-600">Choose the plan that fits your business size.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                            {/* Starter */}
                            <div className="p-8 rounded-2xl border border-gray-200 hover:border-blue-200 transition-colors">
                                <h3 className="text-xl font-bold text-gray-900">Starter</h3>
                                <p className="text-gray-500 mt-2">For sole traders</p>
                                <div className="my-6">
                                    <span className="text-4xl font-bold text-gray-900">$0</span>
                                    <span className="text-gray-500">/mo</span>
                                </div>
                                <Link href="/signup">
                                    <button className="w-full py-3 rounded-xl bg-blue-50 text-[#4A90E2] font-bold hover:bg-blue-100 transition-colors">
                                        Get Started
                                    </button>
                                </Link>
                                <ul className="mt-8 space-y-4">
                                    {["1 Project", "Basic Templates", "Email Support"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-600">
                                            <Check className="w-5 h-5 text-green-500" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Pro */}
                            <motion.div
                                whileHover={{ y: -10 }}
                                className="relative p-8 rounded-2xl border-2 border-[#D4A06A] bg-white shadow-xl z-10"
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D4A06A] text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                                    Most Popular
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Pro</h3>
                                <p className="text-gray-500 mt-2">For growing teams</p>
                                <div className="my-6">
                                    <span className="text-4xl font-bold text-gray-900">$49</span>
                                    <span className="text-gray-500">/mo</span>
                                </div>
                                <Link href="/signup">
                                    <button className="w-full py-3 rounded-xl bg-[#D4A06A] text-white font-bold hover:bg-[#b88650] transition-colors shadow-lg">
                                        Start Free Trial
                                    </button>
                                </Link>
                                <ul className="mt-8 space-y-4">
                                    {["Unlimited Projects", "All Templates", "Risk Analytics", "Priority Support"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-600">
                                            <Check className="w-5 h-5 text-[#D4A06A]" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            {/* Enterprise */}
                            <div className="p-8 rounded-2xl border border-gray-200 hover:border-blue-200 transition-colors">
                                <h3 className="text-xl font-bold text-gray-900">Enterprise</h3>
                                <p className="text-gray-500 mt-2">For large operations</p>
                                <div className="my-6">
                                    <span className="text-4xl font-bold text-gray-900">Custom</span>
                                </div>
                                <button className="w-full py-3 rounded-xl bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 transition-colors">
                                    Contact Sales
                                </button>
                                <ul className="mt-8 space-y-4">
                                    {["Everything in Pro", "Custom Integrations", "Dedicated Manager", "SLA Support"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-600">
                                            <Check className="w-5 h-5 text-green-500" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="py-24 bg-[#F4F6F8]">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                            <p className="text-xl text-gray-600">Got questions? We&apos;ve got answers.</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { q: "Is BuildWise suitable for small contractors?", a: "Absolutely! Our Starter plan is designed specifically for sole traders and small teams, giving you professional tools without the enterprise price tag." },
                                { q: "Can I use my own contract templates?", a: "Yes, on the Pro plan and above, you can upload and digitize your existing contract templates to use within the platform." },
                                { q: "Is my data secure?", a: "Security is our top priority. We use bank-level encryption and host data in secure Australian data centers to ensure full compliance and protection." },
                                { q: "Do you offer a free trial?", a: "Yes, we offer a 14-day free trial on our Pro plan so you can experience the full power of BuildWise risk-free." }
                            ].map((item, index) => (
                                <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex items-center justify-between p-6 text-left font-bold text-gray-900 hover:bg-gray-50 transition-colors"
                                    >
                                        {item.q}
                                        {openFaq === index ? <ChevronUp className="w-5 h-5 text-[#4A90E2]" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                    </button>
                                    {openFaq === index && (
                                        <div className="p-6 pt-0 text-gray-600 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                                            {item.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-[#4A90E2] text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                    </div>
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to build better?</h2>
                        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Join thousands of Australian builders who trust BuildWise to manage their contracts and risk.</p>
                        <Link href="/signup">
                            <button className="px-10 py-4 rounded-xl bg-white text-[#4A90E2] text-lg font-bold hover:bg-gray-100 transition-all shadow-xl transform hover:-translate-y-1">
                                Start Your Free Trial
                            </button>
                        </Link>
                        <p className="mt-6 text-sm text-blue-200">No credit card required • Cancel anytime</p>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-[#E5E7EB] pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="size-6 text-[#4A90E2]">
                                    <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"></path>
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-gray-900">BuildWise</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                The smartest way for Australian builders to manage contracts, risk, and compliance.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="#features">Features</a></li>
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="#pricing">Pricing</a></li>
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="#testimonials">Testimonials</a></li>
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="#faq">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="#">About Us</a></li>
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="#">Careers</a></li>
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="#">Blog</a></li>
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="#">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="/privacy">Privacy Policy</a></li>
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="/terms">Terms of Service</a></li>
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="#">Security</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
                        <p>© 2024 BuildWise. All rights reserved.</p>
                        <div className="flex items-center gap-2 mt-4 sm:mt-0">
                            <span>Proudly made in Australia</span>
                            <span>🇦🇺</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}