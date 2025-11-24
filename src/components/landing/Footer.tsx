import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 font-poppins">
            <div className="section-container py-12">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div>
                        <h4 className="font-bold text-lg mb-4">BuildWise</h4>
                        <p className="mt-2 text-sm text-gray-500">
                            Smart contracts for Australian builders.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="#features" className="hover:text-[#4A90E2] transition-colors">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-[#4A90E2] transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-[#4A90E2] transition-colors">Security</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-[#4A90E2] transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-[#4A90E2] transition-colors">Contact</Link></li>
                            <li><Link href="#" className="hover:text-[#4A90E2] transition-colors">Careers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/privacy" className="hover:text-[#4A90E2] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-[#4A90E2] transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
                    <p>© 2025 BuildWise. All rights reserved.</p>
                    <div className="flex items-center gap-2 mt-4 sm:mt-0">
                        <span>Made in Australia</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
