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
            <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between font-poppins">
                <div className="flex items-center flex-1">
                    <button className="md:hidden p-2 -ml-2 mr-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="max-w-md w-full hidden sm:block">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-full flex items-center px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white hover:ring-2 hover:ring-[#4A90E2]/20 hover:border-[#4A90E2] transition-all group"
                        >
                            <Search className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-400 flex-1 text-left">Search projects, contracts...</span>
                            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded">
                                ⌘K
                            </kbd>
                        </button>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <NotificationBell />
                    </div>
                </div>
            </header>

            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    )
}
