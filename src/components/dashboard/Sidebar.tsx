'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    FolderKanban,
    FileText,
    Settings,
    LogOut,
    PlusCircle
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
    { name: 'Documents', href: '/dashboard/documents', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()
    const [user, setUser] = useState<{ email?: string, user_metadata?: { full_name?: string } } | null>(null)
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            const supabase = createBrowserClient()
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [])

    const handleLogout = async () => {
        const supabase = createBrowserClient()
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-col hidden md:flex h-screen fixed left-0 top-0 z-30">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <Link href="/dashboard" className="flex items-center space-x-2 group">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-900/20 group-hover:bg-blue-500 transition-colors">
                        <span className="font-bold text-lg">B</span>
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight">
                        BuildWise
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <item.icon
                                className={`mr-3 h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'
                                    }`}
                            />
                            {item.name}
                        </Link>
                    )
                })}

                <div className="pt-6 mt-6 border-t border-slate-800">
                    <Link href="/dashboard/projects/new" className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-colors group">
                        <PlusCircle className="mr-3 h-5 w-5" />
                        New Project
                    </Link>
                </div>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center w-full p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer group">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                        {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="ml-3 flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">
                            {user?.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <button onClick={handleLogout} className="p-1 hover:bg-slate-700 rounded-full transition-colors">
                        <LogOut className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                    </button>
                </div>
            </div>
        </aside>
    )
}
