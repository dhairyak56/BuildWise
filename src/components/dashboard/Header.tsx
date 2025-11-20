'use client'

import { Bell, Search, Menu } from 'lucide-react'

export function Header() {
    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center flex-1">
                <button className="md:hidden p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100">
                    <Menu className="w-6 h-6" />
                </button>

                <div className="max-w-md w-full hidden sm:block">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search projects, contracts..."
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    <Bell className="w-5 h-5" />
                </button>
                <div className="h-8 w-px bg-slate-200 mx-2"></div>
                <span className="text-sm font-medium text-slate-600 hidden sm:block">
                    Apex Construction
                </span>
            </div>
        </header>
    )
}
