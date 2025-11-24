import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-poppins bg-[#F4F6F8] text-[#333333]">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-[#F4F6F8]/80 backdrop-blur-sm">
                <div className="container mx-auto flex items-center justify-between whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-4">
                        <div className="size-6 text-[#4A90E2]">
                            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"></path>
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold tracking-tight">BuildWise</h2>
                    </div>
                    <nav className="hidden items-center gap-9 md:flex">
                        <a className="text-sm font-medium hover:text-[#4A90E2] transition-colors" href="#features">Features</a>
                        <a className="text-sm font-medium hover:text-[#4A90E2] transition-colors" href="#pricing">Pricing</a>
                        <a className="text-sm font-medium hover:text-[#4A90E2] transition-colors" href="#contact">Contact</a>
                    </nav>
                    <div className="flex items-center gap-2">
                        <Link href="/signup">
                            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#4A90E2] text-white text-sm font-bold leading-normal tracking-wide hover:bg-[#357ABD] transition-colors shadow-sm">
                                <span className="truncate">Start Free Trial</span>
                            </button>
                        </Link>
                        <Link href="/login">
                            <button className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#4A90E2]/20 text-[#333333] text-sm font-bold leading-normal tracking-wide hover:bg-[#4A90E2]/30 transition-colors">
                                <span className="truncate">Log In</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
                            <div className="flex flex-col gap-6 text-center lg:text-left">
                                <div className="flex flex-col gap-4">
                                    <h1 className="text-4xl font-black leading-tight tracking-tighter md:text-5xl lg:text-6xl text-gray-900">
                                        Generate professional construction contracts in minutes
                                    </h1>
                                    <p className="text-lg text-[#333333]/80">
                                        BuildWise helps Australian builders and contractors create contracts, analyze risk, and track workflows with ease.
                                    </p>
                                </div>
                                <Link href="/signup">
                                    <button className="mx-auto lg:mx-0 flex w-fit cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#4A90E2] text-white text-base font-bold leading-normal tracking-wide hover:bg-[#357ABD] transition-colors shadow-lg">
                                        <span className="truncate">Start Free Trial</span>
                                    </button>
                                </Link>
                            </div>
                            <div className="relative flex h-80 items-center justify-center rounded-xl bg-white/50 p-6 backdrop-blur-xl border border-[#E5E7EB] lg:h-96">
                                <div className="absolute -top-8 -left-8 h-full w-full rounded-xl bg-[#4A90E2]/10 transform -rotate-6"></div>
                                <div className="absolute -bottom-8 -right-8 h-full w-full rounded-xl bg-[#D4A06A]/10 transform rotate-6"></div>
                                <div className="relative z-10 h-full w-full rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-2xl">
                                    <p className="text-gray-400 text-sm">Dashboard Preview</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Social Proof */}
                <section className="py-16 md:py-20 bg-white border-y border-[#E5E7EB]">
                    <div className="container mx-auto px-4">
                        <h2 className="text-center text-lg font-semibold text-[#333333]/70 mb-8">Trusted by Builders Across Australia</h2>

                        <div className="mt-12 grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
                            <div className="flex flex-col gap-1 rounded-lg p-6">
                                <p className="text-4xl font-bold tracking-tight text-[#4A90E2]">10,000+</p>
                                <p className="text-base font-medium text-[#333333]/80">Contracts Generated</p>
                            </div>
                            <div className="flex flex-col gap-1 rounded-lg p-6">
                                <p className="text-4xl font-bold tracking-tight text-[#4A90E2]">5,000+</p>
                                <p className="text-base font-medium text-[#333333]/80">Risk Alerts Issued</p>
                            </div>
                            <div className="flex flex-col gap-1 rounded-lg p-6">
                                <p className="text-4xl font-bold tracking-tight text-[#4A90E2]">20,000+</p>
                                <p className="text-base font-medium text-[#333333]/80">Hours Saved</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section id="features" className="py-16 md:py-24 bg-[#F4F6F8]">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-gray-900">Streamline Your Workflow, Minimize Your Risk</h2>
                            <p className="mt-4 text-lg text-[#333333]/80">BuildWise offers a suite of powerful tools designed for the modern Australian builder. From initial draft to final sign-off, we've got you covered.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col items-center text-center gap-4 bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4A90E2]/20 text-[#4A90E2]">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Automate Contract Creation</h3>
                                    <p className="mt-2 text-[#333333]/80">Generate compliant, professional contracts in minutes using our smart templates.</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-center gap-4 bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4A90E2]/20 text-[#4A90E2]">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Analyze Project Risk</h3>
                                    <p className="mt-2 text-[#333333]/80">Identify potential risks before they become problems with our advanced analytics.</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-center gap-4 bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4A90E2]/20 text-[#4A90E2]">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Track Workflow Progress</h3>
                                    <p className="mt-2 text-[#333333]/80">Stay on top of every project with a clear, visual timeline of all your contracts.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dashboard Preview Section */}
                <section className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-gray-900">Your Command Center</h2>
                            <p className="mt-4 text-lg text-[#333333]/80">Get a bird's-eye view of all your projects. Track recent contracts, monitor risk analytics, and stay ahead of deadlines, all from one dashboard.</p>
                        </div>
                        <div className="mx-auto max-w-5xl rounded-xl border border-[#E5E7EB] bg-[#F4F6F8] p-2 shadow-2xl overflow-hidden">
                            <Image
                                src="/dashboard-screenshot.png"
                                alt="BuildWise Dashboard Interface"
                                width={1200}
                                height={800}
                                className="rounded-lg w-full h-auto"
                                priority
                            />
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section id="pricing" className="py-16 md:py-24 bg-[#F4F6F8]">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-gray-900">Find the Right Plan</h2>
                            <p className="mt-4 text-lg text-[#333333]/80">Simple, transparent pricing. No hidden fees.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start max-w-5xl mx-auto">
                            {/* Starter */}
                            <div className="flex flex-col rounded-xl border border-[#E5E7EB] bg-white p-6 h-full hover:shadow-lg transition-all">
                                <h3 className="text-xl font-bold">Starter</h3>
                                <p className="mt-2 text-[#333333]/70">For sole traders.</p>
                                <p className="my-6 text-4xl font-bold tracking-tight">$0<span className="text-lg font-medium text-[#333333]/70">/mo</span></p>
                                <button className="w-full flex cursor-pointer items-center justify-center rounded-lg h-11 bg-[#4A90E2]/10 text-[#4A90E2] font-bold hover:bg-[#4A90E2]/20 transition-colors">Get Started</button>
                                <ul className="mt-8 space-y-3 text-[#333333]/90">
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-[#4A90E2]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        1 Project
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-[#4A90E2]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Basic Templates
                                    </li>
                                </ul>
                            </div>
                            {/* Pro */}
                            <div className="relative flex flex-col rounded-xl border-2 border-[#D4A06A] bg-white p-6 h-full shadow-xl scale-105 z-10">
                                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                    <span className="rounded-full bg-[#D4A06A] px-4 py-1 text-sm font-semibold text-white uppercase tracking-wider">Popular</span>
                                </div>
                                <h3 className="text-xl font-bold">Pro</h3>
                                <p className="mt-2 text-[#333333]/70">For growing teams.</p>
                                <p className="my-6 text-4xl font-bold tracking-tight">$49<span className="text-lg font-medium text-[#333333]/70">/mo</span></p>
                                <button className="w-full flex cursor-pointer items-center justify-center rounded-lg h-11 bg-[#D4A06A] text-white font-bold hover:bg-[#D4A06A]/90 transition-colors">Start Free Trial</button>
                                <ul className="mt-8 space-y-3 text-[#333333]/90">
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-[#D4A06A]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Unlimited Projects
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-[#D4A06A]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        All Contract Templates
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-[#D4A06A]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Advanced Risk Analysis
                                    </li>
                                </ul>
                            </div>
                            {/* Enterprise */}
                            <div className="flex flex-col rounded-xl border border-[#E5E7EB] bg-white p-6 h-full hover:shadow-lg transition-all">
                                <h3 className="text-xl font-bold">Enterprise</h3>
                                <p className="mt-2 text-[#333333]/70">For large operations.</p>
                                <p className="my-6 text-4xl font-bold tracking-tight">Custom</p>
                                <button className="w-full flex cursor-pointer items-center justify-center rounded-lg h-11 bg-[#4A90E2]/10 text-[#4A90E2] font-bold hover:bg-[#4A90E2]/20 transition-colors">Contact Us</button>
                                <ul className="mt-8 space-y-3 text-[#333333]/90">
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-[#4A90E2]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Everything in Pro
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-[#4A90E2]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Custom Integrations
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-[#4A90E2]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Dedicated Manager
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-[#E5E7EB]">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        <div>
                            <h4 className="font-bold text-lg">BuildWise</h4>
                            <p className="mt-2 text-sm text-[#333333]/70">Smart contracts for Australian builders.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-[#333333]/70">
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="#features">Features</a></li>
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="#pricing">Pricing</a></li>
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="#">Security</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-[#333333]/70">
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="#">About Us</a></li>
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="#">Contact</a></li>
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="#">Careers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-[#333333]/70">
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="/privacy">Privacy Policy</a></li>
                                <li><a className="hover:text-[#4A90E2] transition-colors" href="/terms">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-[#E5E7EB] pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-[#333333]/60">
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