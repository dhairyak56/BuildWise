'use client'

import { useState } from 'react'
import { DashboardGrid } from '@/components/dashboard/DashboardGrid'
import { WidgetLibrary } from '@/components/dashboard/WidgetLibrary'
import { OverviewCharts } from '@/components/dashboard/OverviewCharts'
import { DollarSign, FolderIcon, FileText, Plus, Settings2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Layout } from 'react-grid-layout'

interface DashboardContentProps {
    data: {
        activeProjects: number
        pendingContracts: number
        totalRevenue: number
        monthlyRevenue: any[]
        revenueChange: number
        newProjectsThisWeek: number
        recentActivity: any[]
        user: any
    }
}

const AVAILABLE_WIDGETS = [
    { id: 'stat_revenue', title: 'Total Revenue', description: 'Total revenue from paid invoices', defaultW: 4, defaultH: 2 },
    { id: 'stat_projects', title: 'Active Projects', description: 'Number of projects currently in progress', defaultW: 4, defaultH: 2 },
    { id: 'stat_contracts', title: 'Pending Contracts', description: 'Contracts waiting for signature', defaultW: 4, defaultH: 2 },
    { id: 'chart_revenue', title: 'Revenue Overview', description: 'Monthly revenue chart', defaultW: 8, defaultH: 6 },
    { id: 'list_activity', title: 'Recent Activity', description: 'Latest project and document updates', defaultW: 4, defaultH: 6 },
]

const DEFAULT_LAYOUT = [
    { i: 'stat_revenue', x: 0, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
    { i: 'stat_projects', x: 4, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
    { i: 'stat_contracts', x: 8, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
    { i: 'chart_revenue', x: 0, y: 2, w: 8, h: 6, minW: 6, minH: 4 },
    { i: 'list_activity', x: 8, y: 2, w: 4, h: 6, minW: 3, minH: 4 },
]

export function DashboardContent({ data }: DashboardContentProps) {
    const [isLibraryOpen, setIsLibraryOpen] = useState(false)
    const [activeWidgets, setActiveWidgets] = useState<string[]>(AVAILABLE_WIDGETS.map(w => w.id))
    const [layout, setLayout] = useState<Layout[]>(DEFAULT_LAYOUT)

    const handleAddWidget = (widgetId: string) => {
        if (!activeWidgets.includes(widgetId)) {
            setActiveWidgets([...activeWidgets, widgetId])

            // Find widget config
            const widget = AVAILABLE_WIDGETS.find(w => w.id === widgetId)
            if (widget) {
                // Find the best position for the new widget
                const maxY = layout.length > 0 ? Math.max(...layout.map(l => l.y + l.h)) : 0

                // Try to fit in the first row if there's space
                let x = 0
                let y = maxY

                if (layout.length > 0) {
                    // Check if we can fit in the current bottom row
                    const bottomRowY = Math.min(...layout.map(l => l.y)) === 0 ? Math.max(...layout.map(l => l.y)) : Math.max(...layout.map(l => l.y))
                    const bottomRowItems = layout.filter(l => l.y === bottomRowY)
                    const usedWidth = bottomRowItems.reduce((sum, l) => sum + l.w, 0)

                    if (usedWidth + widget.defaultW <= 12) {
                        x = usedWidth
                        y = bottomRowY
                    }
                }

                const newLayoutItem: Layout = {
                    i: widgetId,
                    x,
                    y,
                    w: widget.defaultW,
                    h: widget.defaultH
                }
                setLayout([...layout, newLayoutItem])
            }

            // Close the library drawer
            setIsLibraryOpen(false)
        }
    }

    const handleRemoveWidget = (widgetId: string) => {
        setActiveWidgets(activeWidgets.filter(id => id !== widgetId))
        setLayout(layout.filter(l => l.i !== widgetId))
    }

    const renderWidget = (id: string) => {
        switch (id) {
            case 'stat_revenue':
                return (
                    <div className="h-full rounded-xl p-4 shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white flex flex-col justify-between relative group overflow-hidden">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleRemoveWidget(id)
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute top-2 right-2 p-1 rounded-md bg-white/10 hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-50"
                        >
                            <X className="h-3 w-3 pointer-events-none" />
                        </button>
                        <div className="flex items-center justify-between min-h-0">
                            <p className="text-xs sm:text-sm font-medium text-blue-50 truncate">Total Revenue</p>
                            <div className="p-1.5 sm:p-2 rounded-full text-blue-100 bg-white/10 shrink-0">
                                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                        </div>
                        <div className="min-h-0">
                            <div className="text-lg sm:text-2xl font-bold truncate">${data.totalRevenue.toLocaleString()}</div>
                            <p className="text-xs mt-1 text-blue-50 truncate">
                                {data.revenueChange >= 0 ? '+' : ''}{data.revenueChange.toFixed(1)}% from last month
                            </p>
                        </div>
                    </div>
                )
            case 'stat_projects':
                return (
                    <div className="h-full rounded-xl p-4 shadow-sm bg-white border border-slate-200 flex flex-col justify-between relative group overflow-hidden">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleRemoveWidget(id)
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute top-2 right-2 p-1 rounded-md bg-slate-100 hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-50"
                        >
                            <X className="h-3 w-3 text-slate-600 pointer-events-none" />
                        </button>
                        <div className="flex items-center justify-between min-h-0">
                            <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">Active Projects</p>
                            <div className="p-1.5 sm:p-2 rounded-full text-blue-600 bg-blue-50 shrink-0">
                                <FolderIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                        </div>
                        <div className="min-h-0">
                            <div className="text-lg sm:text-2xl font-bold text-slate-900">{data.activeProjects}</div>
                            <p className="text-xs mt-1 text-slate-500 truncate">+{data.newProjectsThisWeek} new this week</p>
                        </div>
                    </div>
                )
            case 'stat_contracts':
                return (
                    <div className="h-full rounded-xl p-4 shadow-sm bg-white border border-slate-200 flex flex-col justify-between relative group overflow-hidden">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleRemoveWidget(id)
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute top-2 right-2 p-1 rounded-md bg-slate-100 hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-50"
                        >
                            <X className="h-3 w-3 text-slate-600 pointer-events-none" />
                        </button>
                        <div className="flex items-center justify-between min-h-0">
                            <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">Pending Contracts</p>
                            <div className="p-1.5 sm:p-2 rounded-full text-amber-600 bg-amber-50 shrink-0">
                                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                        </div>
                        <div className="min-h-0">
                            <div className="text-lg sm:text-2xl font-bold text-slate-900">{data.pendingContracts}</div>
                            <p className="text-xs mt-1 text-slate-500 truncate">{data.pendingContracts} require attention</p>
                        </div>
                    </div>
                )
            case 'chart_revenue':
                return (
                    <div className="h-full rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col relative group overflow-hidden">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleRemoveWidget(id)
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute top-2 right-2 p-1 rounded-md bg-slate-100 hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-50"
                        >
                            <X className="h-3 w-3 text-slate-600 pointer-events-none" />
                        </button>
                        <div className="p-3 sm:p-4 flex flex-col space-y-1 pb-2 shrink-0">
                            <h3 className="text-sm sm:text-base font-semibold leading-none tracking-tight truncate">Overview</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">Monthly revenue breakdown</p>
                        </div>
                        <div className="flex-1 p-3 sm:p-4 pt-0 pl-2 min-h-0 overflow-hidden">
                            <OverviewCharts data={data.monthlyRevenue} />
                        </div>
                    </div>
                )
            case 'list_activity':
                return (
                    <div className="h-full rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col relative group overflow-hidden">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleRemoveWidget(id)
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute top-2 right-2 p-1 rounded-md bg-slate-100 hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-50"
                        >
                            <X className="h-3 w-3 text-slate-600 pointer-events-none" />
                        </button>
                        <div className="p-3 sm:p-4 flex flex-col space-y-1 pb-3 shrink-0">
                            <h3 className="text-sm sm:text-base font-semibold leading-none tracking-tight truncate">Recent Activity</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">Latest updates</p>
                        </div>
                        <div className="flex-1 p-3 sm:p-4 pt-0 overflow-y-auto min-h-0">
                            <div className="space-y-6">
                                {data.recentActivity.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground text-sm">No recent activity</div>
                                ) : (
                                    data.recentActivity.map((item: any) => (
                                        <div key={item.id} className="flex items-center group">
                                            <div className={cn(
                                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                                                item.type === 'project' ? "bg-blue-50 border-blue-100" : "bg-purple-50 border-purple-100"
                                            )}>
                                                {item.type === 'project' ? <FolderIcon className="h-3 w-3 text-blue-600" /> : <FileText className="h-3 w-3 text-purple-600" />}
                                            </div>
                                            <div className="ml-3 space-y-1 min-w-0">
                                                <p className="text-sm font-medium leading-none truncate group-hover:text-primary transition-colors">{item.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {item.type === 'project' ? 'Project Created' : 'Document Uploaded'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Overview of your construction projects and performance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsLibraryOpen(true)}
                        className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors border border-slate-200 bg-white hover:bg-slate-50 h-10 px-4 py-2"
                    >
                        <Settings2 className="mr-2 h-4 w-4 text-slate-500" />
                        Customize
                    </button>
                    <Link href="/dashboard/projects/new">
                        <button className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-slate-900 text-white hover:bg-slate-800 h-10 px-4 py-2 shadow-lg">
                            <Plus className="mr-2 h-4 w-4" />
                            New Project
                        </button>
                    </Link>
                </div>
            </div>

            {/* Grid Layout */}
            <DashboardGrid
                defaultLayout={layout}
                onLayoutChange={(newLayout) => setLayout(newLayout)}
            >
                {activeWidgets.map(widgetId => (
                    <div key={widgetId} className="h-full">
                        {renderWidget(widgetId)}
                    </div>
                ))}
            </DashboardGrid>

            {/* Widget Library Drawer */}
            <WidgetLibrary
                isOpen={isLibraryOpen}
                onClose={() => setIsLibraryOpen(false)}
                availableWidgets={AVAILABLE_WIDGETS}
                activeWidgetIds={activeWidgets}
                onAddWidget={handleAddWidget}
            />
        </div>
    )
}
