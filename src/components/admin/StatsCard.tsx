'use client'

import { LucideIcon, TrendingUp, TrendingDown, Users, FolderKanban, DollarSign, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
    title: string
    value: string | number
    icon: 'users' | 'folder' | 'dollar' | 'file'
    trend?: {
        value: number
        label: string
    }
    className?: string
}

const iconMap = {
    users: Users,
    folder: FolderKanban,
    dollar: DollarSign,
    file: FileText,
}

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
    const isPositive = trend && trend.value >= 0
    const Icon = iconMap[icon]

    return (
        <div className={cn('rounded-xl border bg-white p-6 shadow-sm', className)}>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <div className="rounded-full bg-blue-50 p-2">
                    <Icon className="h-5 w-5 text-blue-600" />
                </div>
            </div>
            <div className="mt-4">
                <p className="text-3xl font-bold text-slate-900">{value}</p>
                {trend && (
                    <div className="mt-2 flex items-center gap-1">
                        {isPositive ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span
                            className={cn(
                                'text-sm font-medium',
                                isPositive ? 'text-green-600' : 'text-red-600'
                            )}
                        >
                            {isPositive ? '+' : ''}{trend.value}%
                        </span>
                        <span className="text-sm text-slate-500">{trend.label}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
