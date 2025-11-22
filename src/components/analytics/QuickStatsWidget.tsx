'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, DollarSign, Briefcase, AlertCircle } from 'lucide-react'

interface AnalyticsOverview {
    total_revenue: number
    outstanding: number
    overdue: number
    active_projects: number
    total_projects: number
    overdue_count: number
}

interface StatCardProps {
    title: string
    value: string
    icon: React.ReactNode
    trend?: string
    trendUp?: boolean
    color: string
}

function StatCard({ title, value, icon, trend, trendUp, color }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'
                        }`}>
                        <TrendingUp className={`w-4 h-4 mr-1 ${!trendUp && 'rotate-180'}`} />
                        {trend}
                    </div>
                )}
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">{title}</h3>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    )
}

export function QuickStatsWidget() {
    const [stats, setStats] = useState<AnalyticsOverview | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            const response = await fetch('/api/analytics/overview')
            if (!response.ok) throw new Error('Failed to fetch stats')
            const data = await response.json()
            setStats(data)
        } catch (error) {
            console.error('Error loading stats:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                        <div className="h-12 w-12 bg-slate-200 rounded-lg mb-4" />
                        <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
                        <div className="h-8 bg-slate-200 rounded w-32" />
                    </div>
                ))}
            </div>
        )
    }

    if (!stats) {
        return (
            <div className="text-center py-12 text-slate-500">
                Failed to load analytics
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Total Revenue"
                value={formatCurrency(stats.total_revenue)}
                icon={<DollarSign className="w-6 h-6 text-green-600" />}
                color="bg-green-50"
            />
            <StatCard
                title="Outstanding"
                value={formatCurrency(stats.outstanding)}
                icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
                color="bg-blue-50"
            />
            <StatCard
                title="Active Projects"
                value={`${stats.active_projects} / ${stats.total_projects}`}
                icon={<Briefcase className="w-6 h-6 text-purple-600" />}
                color="bg-purple-50"
            />
            <StatCard
                title="Overdue Payments"
                value={`${stats.overdue_count} (${formatCurrency(stats.overdue)})`}
                icon={<AlertCircle className="w-6 h-6 text-red-600" />}
                color="bg-red-50"
            />
        </div>
    )
}
