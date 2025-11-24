'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    FolderKanban,
    FileText,
    LogOut,
    Users,
    BarChart3,
    HelpCircle,
    FileSignature,
    DollarSign
} from 'lucide-react'
import { useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase'

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            const supabase = createBrowserClient()
            await supabase.auth.getSession()
        }
        getUser()
    }, [])

    const handleLogout = async () => {
        const supabase = createBrowserClient()
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`)

    return (
        <aside className="flex flex-col w-64 p-4 border-r border-gray-200 bg-white h-screen sticky top-0 hidden md:flex font-poppins">
            <div className="flex flex-col gap-4 h-full">
                {/* Logo Area */}
                <div className="flex gap-3 items-center mb-6 px-2 cursor-pointer" onClick={() => router.push('/dashboard')}>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shadow-sm bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                        B
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-gray-900 text-base font-bold leading-normal">Buildwise</h1>
                        <p className="text-gray-500 text-xs font-normal leading-normal">SaaS for Builders</p>
                    </div>
                </div>

                <nav className="flex flex-col gap-1 overflow-y-auto flex-1">
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${pathname === '/dashboard' ? 'bg-[#4A90E2]/10 text-[#4A90E2]' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <LayoutDashboard className={`w-5 h-5 ${pathname === '/dashboard' ? 'fill-current' : ''}`} />
                        <p className="text-sm font-medium">Dashboard</p>
                    </Link>

                    <div className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Project Tools</div>

                    <Link
                        href="/dashboard/projects"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${isActive('/dashboard/projects') ? 'bg-[#4A90E2]/10 text-[#4A90E2]' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FolderKanban className={`w-5 h-5 ${isActive('/dashboard/projects') ? 'fill-current' : ''}`} />
                        <p className="text-sm font-medium">Projects</p>
                    </Link>

                    <Link
                        href="/dashboard/contracts"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${isActive('/dashboard/contracts') ? 'bg-[#4A90E2]/10 text-[#4A90E2]' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FileSignature className={`w-5 h-5 ${isActive('/dashboard/contracts') ? 'fill-current' : ''}`} />
                        <p className="text-sm font-medium">Contracts</p>
                    </Link>

                    <Link
                        href="/dashboard/documents"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${isActive('/dashboard/documents') ? 'bg-[#4A90E2]/10 text-[#4A90E2]' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FileText className={`w-5 h-5 ${isActive('/dashboard/documents') ? 'fill-current' : ''}`} />
                        <p className="text-sm font-medium">Documents</p>
                    </Link>

                    <Link
                        href="/dashboard/payments"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${isActive('/dashboard/payments') ? 'bg-[#4A90E2]/10 text-[#4A90E2]' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <DollarSign className={`w-5 h-5 ${isActive('/dashboard/payments') ? 'fill-current' : ''}`} />
                        <p className="text-sm font-medium">Payments</p>
                    </Link>

                    <div className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Organization</div>

                    <Link
                        href="/dashboard/settings"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${isActive('/dashboard/settings') ? 'bg-[#4A90E2]/10 text-[#4A90E2]' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Users className={`w-5 h-5 ${isActive('/dashboard/settings') ? 'fill-current' : ''}`} />
                        <p className="text-sm font-medium">Team Members</p>
                    </Link>
                    <Link
                        href="/dashboard/analytics"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${isActive('/dashboard/analytics') ? 'bg-[#4A90E2]/10 text-[#4A90E2]' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <BarChart3 className={`w-5 h-5 ${isActive('/dashboard/analytics') ? 'fill-current' : ''}`} />
                        <p className="text-sm font-medium">Analytics</p>
                    </Link>
                </nav>

                <div className="mt-auto flex flex-col gap-4">
                    <Link href="/dashboard/projects/new" className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#4A90E2] text-white text-sm font-bold shadow-md hover:bg-[#4A90E2]/90 transition-colors">
                        <span className="truncate">New Project</span>
                    </Link>
                    <div className="flex flex-col gap-1">
                        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-left">
                            <HelpCircle className="w-5 h-5" />
                            <p className="text-sm font-medium">Help Center</p>
                        </button>
                        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-left">
                            <LogOut className="w-5 h-5" />
                            <p className="text-sm font-medium">Log out</p>
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    )
}
