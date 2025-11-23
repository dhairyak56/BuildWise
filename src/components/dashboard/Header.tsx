'use client'

import { useState, useEffect } from 'react'
import { Search, Menu } from 'lucide-react'
import { NotificationBell } from './NotificationBell'
import { GlobalSearch } from './GlobalSearch'

export function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsSearchOpen(true)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <>
            <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center flex-1">
                    <button className="md:hidden p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100">
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="max-w-md w-full hidden sm:block">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-full flex items-center px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-white hover:ring-2 hover:ring-blue-500/20 hover:border-blue-500 transition-all group"
                        >
                            <Search className="h-4 w-4 text-slate-400 mr-2" />
                            <span className="text-sm text-slate-400 flex-1 text-left">Search projects, contracts...</span>
                            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded">
                                ⌘K
                            </kbd>
                        </button>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <NotificationBell />
                    </div>
                    <div className="h-8 w-px bg-slate-200 mx-2"></div>
                    <span className="text-sm font-medium text-slate-600 hidden sm:block">
                        BuildWise
                    </span>
                </div>
            </header>

            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    )
}
