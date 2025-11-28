'use client'

import { OverviewCharts } from '@/components/dashboard/OverviewCharts'
import { TasksWidget } from '@/components/dashboard/TasksWidget'
import { ProjectStatusChart } from '@/components/dashboard/ProjectStatusChart'
import { DollarSign, FolderIcon, FileText, Plus, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface DashboardContentProps {
    data: {
        activeProjects: number
        pendingContracts: number
        totalRevenue: number
        monthlyRevenue: { name: string; total: number }[]
        revenueChange: number
        newProjectsThisWeek: number
        upcomingDeadlinesCount: number
        recentActivity: any[]
        projectStatusData: { name: string; value: number; color: string }[]
        paymentStatusData: any[]
        kpiData: {
            avgCompletionTime: number
            paymentCollectionRate: number
            contractApprovalRate: number
            outstandingInvoices: number
        }
    }
}

export function DashboardContent({ data }: DashboardContentProps) {
    // Defensive checks to ensure all arrays are defined
    const safeData = {
        ...data,
        monthlyRevenue: data.monthlyRevenue || [],
        recentActivity: data.recentActivity || [],
        projectStatusData: data.projectStatusData || [],
        paymentStatusData: data.paymentStatusData || []
    }

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview of your construction projects and performance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/projects/new">
                        <button className="inline-flex items-center justify-center rounded-lg text-sm font-bold transition-colors bg-[#4A90E2] text-white hover:bg-[#4A90E2]/90 h-10 px-4 py-2 shadow-md">
                            <Plus className="mr-2 h-4 w-4" />
                            New Project
                        </button>
                    </Link>
                </div>
            </div>

            {/* Row 1: Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="rounded-xl p-6 shadow-sm bg-gradient-to-br from-[#4A90E2] to-[#357ABD] text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center justify-between z-10">
                        <p className="text-sm font-medium text-blue-50">Total Revenue</p>
                        <div className="p-2 rounded-full text-blue-100 bg-white/10">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4 z-10">
                        <div className="text-3xl font-bold">${safeData.totalRevenue.toLocaleString()}</div>
                        <p className="text-sm mt-1 text-blue-50">
                            {safeData.revenueChange >= 0 ? '+' : ''}{safeData.revenueChange.toFixed(1)}% from last month
                        </p>
                    </div>
                </div>

                <div className="rounded-xl p-6 shadow-sm bg-white border border-gray-200 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500">Active Projects</p>
                        <div className="p-2 rounded-full text-[#4A90E2] bg-blue-50">
                            <FolderIcon className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-bold text-gray-900">{safeData.activeProjects}</div>
                        <p className="text-sm mt-1 text-gray-500">+{safeData.newProjectsThisWeek} new this week</p>
                    </div>
                </div>

                <div className="rounded-xl p-6 shadow-sm bg-white border border-gray-200 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500">Pending Contracts</p>
                        <div className="p-2 rounded-full text-amber-600 bg-amber-50">
                            <FileText className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-bold text-gray-900">{safeData.pendingContracts}</div>
                        <p className="text-sm mt-1 text-gray-500">{safeData.pendingContracts} require attention</p>
                    </div>
                </div>

                <div className="rounded-xl p-6 shadow-sm bg-white border border-gray-200 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500">Upcoming Deadlines</p>
                        <div className="p-2 rounded-full text-red-600 bg-red-50">
                            <Calendar className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-bold text-gray-900">{safeData.upcomingDeadlinesCount}</div>
                        <p className="text-sm mt-1 text-gray-500">Due in next 7 days</p>
                    </div>
                </div>
            </div>

            {/* Row 2: Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="h-[350px] rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-semibold text-gray-900">Revenue Overview</h3>
                        </div>
                        <div className="p-4 flex-1">
                            <OverviewCharts data={safeData.monthlyRevenue} />
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="h-[350px] rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-semibold text-gray-900">Project Status</h3>
                        </div>
                        <div className="p-4 flex-1">
                            <ProjectStatusChart data={safeData.projectStatusData} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3: Activity & Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[320px] rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                    </div>
                    <div className="p-0 flex-1 overflow-y-auto">
                        <div className="divide-y divide-gray-100">
                            {safeData.recentActivity.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 text-sm">No recent activity</div>
                            ) : (
                                safeData.recentActivity.map((item: any) => (
                                    <div key={item.id} className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors">
                                        <div className={cn(
                                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                                            item.type === 'project' ? "bg-blue-50 border-blue-100" : "bg-purple-50 border-purple-100"
                                        )}>
                                            {item.type === 'project' ? <FolderIcon className="h-4 w-4 text-[#4A90E2]" /> : <FileText className="h-4 w-4 text-purple-600" />}
                                        </div>
                                        <div className="ml-3 space-y-1 min-w-0 flex-1">
                                            <p className="text-sm font-medium leading-none truncate text-gray-900">{item.name}</p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {item.type === 'project' ? 'Project Created' : 'Document Uploaded'} • {new Date(item.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="h-[320px] rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-semibold text-gray-900">Recent Tasks</h3>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <TasksWidget />
                    </div>
                </div>
            </div>
        </div>
    )
}
