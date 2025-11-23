'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import { Calendar, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Deadline {
    id: string
    projectName: string
    endDate: string
    daysRemaining: number
    status: 'overdue' | 'urgent' | 'upcoming' | 'on-track'
    progress: number
}

export function UpcomingDeadlinesWidget() {
    const [deadlines, setDeadlines] = useState<Deadline[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createBrowserClient()

    useEffect(() => {
        fetchDeadlines()
    }, [])

    const fetchDeadlines = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: projects } = await supabase
                .from('projects')
                .select('id, name, end_date, progress, status')
                .eq('user_id', user.id)
                .in('status', ['Active', 'Planning'])
                .order('end_date', { ascending: true })
                .limit(6)

            const now = new Date()
            const deadlinesList: Deadline[] = []

            projects?.forEach(project => {
                const endDate = new Date(project.end_date)
                const diffTime = endDate.getTime() - now.getTime()
                const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                let status: 'overdue' | 'urgent' | 'upcoming' | 'on-track' = 'on-track'
                if (daysRemaining < 0) status = 'overdue'
                else if (daysRemaining <= 7) status = 'urgent'
                else if (daysRemaining <= 30) status = 'upcoming'

                deadlinesList.push({
                    id: project.id,
                    projectName: project.name,
                    endDate: project.end_date,
                    daysRemaining,
                    status,
                    progress: project.progress || 0
                })
            })

            setDeadlines(deadlinesList)
        } catch (error) {
            console.error('Error fetching deadlines:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'overdue': return 'bg-red-50 text-red-700 border-red-200'
            case 'urgent': return 'bg-amber-50 text-amber-700 border-amber-200'
            case 'upcoming': return 'bg-blue-50 text-blue-700 border-blue-200'
            default: return 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'overdue': return <AlertCircle className="w-4 h-4" />
            case 'urgent': return <Clock className="w-4 h-4" />
            case 'upcoming': return <Calendar className="w-4 h-4" />
            default: return <CheckCircle className="w-4 h-4" />
        }
    }

    const getStatusLabel = (daysRemaining: number) => {
        if (daysRemaining < 0) return `${Math.abs(daysRemaining)} days overdue`
        if (daysRemaining === 0) return 'Due today'
        if (daysRemaining === 1) return 'Due tomorrow'
        return `${daysRemaining} days left`
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Upcoming Deadlines</h3>
                <Calendar className="w-5 h-5 text-slate-400" />
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                            <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-slate-100 rounded w-1/2 mb-2" />
                            <div className="h-2 bg-slate-100 rounded w-full" />
                        </div>
                    ))}
                </div>
            ) : deadlines.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No upcoming deadlines</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {deadlines.map(deadline => (
                        <Link
                            key={deadline.id}
                            href={`/dashboard/projects/${deadline.id}`}
                            className="block group"
                        >
                            <div className="space-y-2">
                                <div className="flex items-start justify-between">
                                    <h4 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {deadline.projectName}
                                    </h4>
                                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(deadline.status)}`}>
                                        {getStatusIcon(deadline.status)}
                                        {getStatusLabel(deadline.daysRemaining)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(deadline.endDate).toLocaleDateString()}</span>
                                    <span className="text-slate-300">•</span>
                                    <span>{deadline.progress}% complete</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-full transition-all ${deadline.status === 'overdue' ? 'bg-red-500' :
                                                deadline.status === 'urgent' ? 'bg-amber-500' :
                                                    'bg-blue-500'
                                            }`}
                                        style={{ width: `${deadline.progress}%` }}
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
