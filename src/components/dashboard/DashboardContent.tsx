'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { DashboardGrid } from '@/components/dashboard/DashboardGrid'
import { WidgetLibrary } from '@/components/dashboard/WidgetLibrary'
import { OverviewCharts } from '@/components/dashboard/OverviewCharts'
import { TasksWidget } from '@/components/dashboard/TasksWidget'
import RecentActivityWidget from '@/components/dashboard/RecentActivityWidget'
import { UpcomingDeadlinesWidget } from '@/components/dashboard/UpcomingDeadlinesWidget'
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
    { id: 'tasks_widget', title: 'Recent Tasks', description: 'Tasks from all your projects', defaultW: 4, defaultH: 6 },
    { id: 'recent_activity_widget', title: 'Activity Timeline', description: 'Timeline of recent actions across all entities', defaultW: 4, defaultH: 6 },
    { id: 'upcoming_deadlines', title: 'Upcoming Deadlines', description: 'Projects with approaching deadlines', defaultW: 4, defaultH: 6 },
]

const DEFAULT_LAYOUT = [
    { i: 'stat_revenue', x: 0, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
    { i: 'stat_projects', x: 4, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
    { i: 'stat_contracts', x: 8, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
    { i: 'chart_revenue', x: 0, y: 2, w: 8, h: 6, minW: 6, minH: 4 },
    { i: 'list_activity', x: 8, y: 2, w: 4, h: 6, minW: 3, minH: 4 },
    { i: 'tasks_widget', x: 0, y: 8, w: 4, h: 6, minW: 3, minH: 4 },
]

export function DashboardContent({ data }: DashboardContentProps) {
    const [isLibraryOpen, setIsLibraryOpen] = useState(false)
    const [activeWidgets, setActiveWidgets] = useState<string[]>(AVAILABLE_WIDGETS.map(w => w.id))
    const [layout, setLayout] = useState<Layout[]>(DEFAULT_LAYOUT)
    const [isLoadingSettings, setIsLoadingSettings] = useState(true)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Fetch user settings on mount
    useEffect(() => {
        async function fetchSettings() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data: settings } = await supabase
                    .from('user_settings')
                    .select('dashboard_layout, active_widgets')
                    .eq('user_id', user.id)
                    .single()

                if (settings) {
                    if (settings.dashboard_layout && Array.isArray(settings.dashboard_layout) && settings.dashboard_layout.length > 0) {
                        setLayout(settings.dashboard_layout)
                    }
                    if (settings.active_widgets && Array.isArray(settings.active_widgets) && settings.active_widgets.length > 0) {
                        setActiveWidgets(settings.active_widgets)
                    }
                }
            } catch (error) {
                console.error('Error fetching user settings:', error)
            } finally {
                setIsLoadingSettings(false)
            }
        }

        fetchSettings()
    }, [supabase])

    // Save settings when layout or active widgets change
    const saveSettings = useCallback(async (newLayout: Layout[], newActiveWidgets: string[]) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { error } = await supabase
                .from('user_settings')
                .upsert({
                    user_id: user.id,
                    dashboard_layout: newLayout,
                    active_widgets: newActiveWidgets,
                    updated_at: new Date().toISOString()
                })

            if (error) throw error
        } catch (error) {
            console.error('Error saving user settings:', error)
        }
    }, [supabase])


    const handleAddWidget = (widgetId: string) => {
        if (!activeWidgets.includes(widgetId)) {
            const newActiveWidgets = [...activeWidgets, widgetId]
            setActiveWidgets(newActiveWidgets)

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
                const newLayout = [...layout, newLayoutItem]
                setLayout(newLayout)
                saveSettings(newLayout, newActiveWidgets)
            }

            // Close the library drawer
            setIsLibraryOpen(false)
        }
    }

    const handleRemoveWidget = (widgetId: string) => {
        const newActiveWidgets = activeWidgets.filter(id => id !== widgetId)
        const newLayout = layout.filter(l => l.i !== widgetId)

        setActiveWidgets(newActiveWidgets)
        setLayout(newLayout)
        saveSettings(newLayout, newActiveWidgets)
    }

    const renderWidget = (id: string) => {
        switch (id) {
            case 'stat_revenue':
                return (
                    <div className="h-full rounded-xl p-4 shadow-sm bg-gradient-to-br from-[#4A90E2] to-[#357ABD] text-white flex flex-col justify-between relative group overflow-hidden">
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
                    <div className="h-full rounded-xl p-4 shadow-sm bg-white border border-gray-200 flex flex-col justify-between relative group overflow-hidden">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleRemoveWidget(id)
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute top-2 right-2 p-1 rounded-md bg-gray-100 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-50"
                        >
                            <X className="h-3 w-3 text-gray-600 pointer-events-none" />
                        </button>
                        <div className="flex items-center justify-between min-h-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Active Projects</p>
                            <div className="p-1.5 sm:p-2 rounded-full text-[#4A90E2] bg-blue-50 shrink-0">
                                <FolderIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                        </div>
                        <div className="min-h-0">
                            <div className="text-lg sm:text-2xl font-bold text-gray-900">{data.activeProjects}</div>
                            <p className="text-xs mt-1 text-gray-500 truncate">+{data.newProjectsThisWeek} new this week</p>
                        </div>
                    </div>
                )
            case 'stat_contracts':
                return (
                    <div className="h-full rounded-xl p-4 shadow-sm bg-white border border-gray-200 flex flex-col justify-between relative group overflow-hidden">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleRemoveWidget(id)
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute top-2 right-2 p-1 rounded-md bg-gray-100 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-50"
                        >
                            <X className="h-3 w-3 text-gray-600 pointer-events-none" />
                        </button>
                        <div className="flex items-center justify-between min-h-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Pending Contracts</p>
                            <div className="p-1.5 sm:p-2 rounded-full text-amber-600 bg-amber-50 shrink-0">
                                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                        </div>
                        <div className="min-h-0">
                            <div className="text-lg sm:text-2xl font-bold text-gray-900">{data.pendingContracts}</div>
                            <p className="text-xs mt-1 text-gray-500 truncate">{data.pendingContracts} require attention</p>
                        </div>
                    </div>
                )
            case 'chart_revenue':
                return (
                    <div className="h-full rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col relative group overflow-hidden">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleRemoveWidget(id)
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute top-2 right-2 p-1 rounded-md bg-gray-100 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-50"
                        >
                            <X className="h-3 w-3 text-gray-600 pointer-events-none" />
                        </button>
                        <div className="p-3 sm:p-4 flex flex-col space-y-1 pb-2 shrink-0">
                            <h3 className="text-sm sm:text-base font-semibold leading-none tracking-tight text-gray-900 truncate">Overview</h3>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">Monthly revenue breakdown</p>
                        </div>
                        <div className="flex-1 p-3 sm:p-4 pt-0 pl-2 min-h-0 overflow-hidden">
                            <OverviewCharts data={data.monthlyRevenue} />
                        </div>
                    </div>
                )
            case 'list_activity':
                return (
                    <div className="h-full rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col relative group overflow-hidden">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleRemoveWidget(id)
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute top-2 right-2 p-1 rounded-md bg-gray-100 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-50"
                        >
                            <X className="h-3 w-3 text-gray-600 pointer-events-none" />
                        </button>
                        <div className="p-3 sm:p-4 flex flex-col space-y-1 pb-3 shrink-0">
                            <h3 className="text-sm sm:text-base font-semibold leading-none tracking-tight text-gray-900 truncate">Recent Activity</h3>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">Latest updates</p>
                        </div>
                        <div className="flex-1 p-3 sm:p-4 pt-0 overflow-y-auto min-h-0">
                            <div className="space-y-6">
                                {data.recentActivity.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 text-sm">No recent activity</div>
                                ) : (
                                    data.recentActivity.map((item: any) => (
                                        <div key={item.id} className="flex items-center group">
                                            <div className={cn(
                                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                                                item.type === 'project' ? "bg-blue-50 border-blue-100" : "bg-purple-50 border-purple-100"
                                            )}>
                                                {item.type === 'project' ? <FolderIcon className="h-3 w-3 text-[#4A90E2]" /> : <FileText className="h-3 w-3 text-purple-600" />}
                                            </div>
                                            <div className="ml-3 space-y-1 min-w-0">
                                                <p className="text-sm font-medium leading-none truncate group-hover:text-[#4A90E2] transition-colors text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-500 truncate">
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
            case 'tasks_widget':
                return (
                    <div className="h-full rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col relative group overflow-hidden">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleRemoveWidget(id)
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute top-2 right-2 p-1 rounded-md bg-gray-100 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-50"
                        >
                            <X className="h-3 w-3 text-gray-600 pointer-events-none" />
                        </button>
                        <div className="flex-1 overflow-hidden">
                            <TasksWidget />
                        </div>
                    </div>
                )
            case 'recent_activity_widget':
                return (
                    <div className="h-full rounded-xl relative group overflow-hidden">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleRemoveWidget(id)
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute top-2 right-2 p-1 rounded-md bg-gray-100 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-50"
                        >
                            <X className="h-3 w-3 text-gray-600 pointer-events-none" />
                        </button>
                        <RecentActivityWidget />
                    </div>
                )
            case 'upcoming_deadlines':
                return (
                    <div className="h-full rounded-xl relative group overflow-hidden">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleRemoveWidget(id)
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute top-2 right-2 p-1 rounded-md bg-gray-100 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-50"
                        >
                            <X className="h-3 w-3 text-gray-600 pointer-events-none" />
                        </button>
                        <UpcomingDeadlinesWidget />
                    </div>
                )
            default:
                return null
        }
    }

    if (isLoadingSettings) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-poppins">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview of your construction projects and performance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsLibraryOpen(true)}
                        className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors border border-gray-200 bg-white hover:bg-gray-50 h-10 px-4 py-2 text-gray-700"
                    >
                        <Settings2 className="mr-2 h-4 w-4 text-gray-500" />
                        Customize
                    </button>
                    <Link href="/dashboard/projects/new">
                        <button className="inline-flex items-center justify-center rounded-lg text-sm font-bold transition-colors bg-[#4A90E2] text-white hover:bg-[#4A90E2]/90 h-10 px-4 py-2 shadow-md">
                            <Plus className="mr-2 h-4 w-4" />
                            New Project
                        </button>
                    </Link>
                </div>
            </div>

            {/* Grid Layout */}
            <DashboardGrid
                defaultLayout={layout}
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
