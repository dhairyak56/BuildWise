'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

import { Logo } from '@/components/ui/Logo'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
            ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm'
            : 'bg-transparent'
            }`}>
            <div className="section-container">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="group">
                        <Logo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        <Link href="#features" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all font-medium text-sm">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all font-medium text-sm">
                            How It Works
                        </Link>
                        <Link href="#testimonials" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all font-medium text-sm">
                            Testimonials
                        </Link>
                        <Link href="#pricing" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all font-medium text-sm">
                            Pricing
                        </Link>
                    </div>

                    <div className="hidden lg:flex items-center space-x-3">
                        <Link href="/login">
                            <button className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium text-sm transition-colors">
                                Log In
                            </button>
                        </Link>
                        <Link href="/signup">
                            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all duration-300 hover:-translate-y-0.5">
                                Start Free Trial
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-50 transition"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden py-6 space-y-3 border-t border-slate-100 animate-in slide-in-from-top bg-white/95 backdrop-blur-lg absolute left-0 right-0 px-6 shadow-xl">
                        <Link href="#features" className="block px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="block px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">
                            How It Works
                        </Link>
                        <Link href="#testimonials" className="block px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">
                            Testimonials
                        </Link>
                        <Link href="#pricing" className="block px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">
                            Pricing
                        </Link>
                        <div className="pt-4 space-y-3 border-t border-slate-100 mt-4">
                            <Link href="/login" className="block">
                                <Button variant="ghost" size="md" className="w-full font-semibold text-slate-600">Sign In</Button>
                            </Link>
                            <Link href="/signup" className="block">
                                <button className="w-full px-6 py-3 font-semibold text-white rounded-lg bg-slate-900 hover:bg-slate-800 shadow-lg">
                                    Start Free Trial
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
