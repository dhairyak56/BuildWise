import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 py-12">
            <div className="section-container">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="mb-4">
                            <Logo variant="dark" />
                        </div>
                        <p className="text-sm">
                            AI-powered contract generation for Australian builders and contractors.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
                    <p>&copy; 2025 BuildWise. All rights reserved. Made in Australia 🇦🇺</p>
                </div>
            </div>
        </footer>
    )
}
