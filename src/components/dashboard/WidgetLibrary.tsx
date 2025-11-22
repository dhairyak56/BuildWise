'use client'

import { Plus, X, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Widget {
    id: string
    title: string
    description: string
    defaultW: number
    defaultH: number
}

interface WidgetLibraryProps {
    isOpen: boolean
    onClose: () => void
    availableWidgets: Widget[]
    activeWidgetIds: string[]
    onAddWidget: (widgetId: string) => void
}

export function WidgetLibrary({
    isOpen,
    onClose,
    availableWidgets,
    activeWidgetIds,
    onAddWidget
}: WidgetLibraryProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 animate-in slide-in-from-right duration-300 border-l border-slate-200">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <LayoutDashboard className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Widget Library</h2>
                            <p className="text-sm text-slate-500">Customize your dashboard</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="space-y-4">
                    {availableWidgets.map((widget) => {
                        const isActive = activeWidgetIds.includes(widget.id)
                        return (
                            <div
                                key={widget.id}
                                className={cn(
                                    "p-4 rounded-xl border transition-all",
                                    isActive
                                        ? "bg-slate-50 border-slate-200 opacity-60"
                                        : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer group"
                                )}
                                onClick={() => !isActive && onAddWidget(widget.id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">{widget.title}</h3>
                                        <p className="text-sm text-slate-500">{widget.description}</p>
                                    </div>
                                    <button
                                        disabled={isActive}
                                        className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            isActive
                                                ? "text-slate-400"
                                                : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                                        )}
                                    >
                                        {isActive ? <CheckIcon /> : <Plus className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

function CheckIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
