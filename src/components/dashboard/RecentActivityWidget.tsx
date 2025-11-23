'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import { FileText, DollarSign, Upload, CheckCircle, Clock } from 'lucide-react'

interface Activity {
    id: string
    type: 'contract' | 'payment' | 'document' | 'project'
    title: string
    description: string
    timestamp: string
    icon: 'contract' | 'payment' | 'document' | 'project'
}

export function RecentActivityWidget() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createBrowserClient()

    useEffect(() => {
        fetchRecentActivity()
    }, [])

    const fetchRecentActivity = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const activities: Activity[] = []

            // Fetch recent contracts
            const { data: contracts } = await supabase
                .from('contracts')
                .select('id, created_at, status, projects(name)')
                .order('created_at', { ascending: false })
                .limit(3)

            contracts?.forEach(contract => {
                const project = Array.isArray(contract.projects) ? contract.projects[0] : contract.projects
                activities.push({
                    id: contract.id,
                    type: 'contract',
                    title: contract.status === 'Signed' ? 'Contract Signed' : 'Contract Created',
                    description: project?.name || 'Unknown Project',
                    timestamp: contract.created_at,
                    icon: 'contract'
                })
            })

            // Fetch recent payments
            const { data: payments } = await supabase
                .from('payments')
                .select('id, created_at, amount, name, status')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(3)

            payments?.forEach(payment => {
                activities.push({
                    id: payment.id,
                    type: 'payment',
                    title: payment.status === 'Paid' ? 'Payment Received' : 'Payment Scheduled',
                    description: `${payment.name || 'Payment'} - $${Number(payment.amount).toLocaleString()}`,
                    timestamp: payment.created_at,
                    icon: 'payment'
                })
            })

            // Fetch recent documents
            const { data: documents } = await supabase
                .from('documents')
                .select('id, created_at, name')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(3)

            documents?.forEach(doc => {
                activities.push({
                    id: doc.id,
                    type: 'document',
                    title: 'Document Uploaded',
                    description: doc.name,
                    timestamp: doc.created_at,
                    icon: 'document'
                })
            })

            // Fetch recent projects
            const { data: projects } = await supabase
                .from('projects')
                .select('id, created_at, name, status')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(2)

            projects?.forEach(project => {
                activities.push({
                    id: project.id,
                    type: 'project',
                    title: 'Project Created',
                    description: project.name,
                    timestamp: project.created_at,
                    icon: 'project'
                })
            })

            // Sort by timestamp and take top 8
            activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            setActivities(activities.slice(0, 8))
        } catch (error) {
            console.error('Error fetching recent activity:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getIcon = (icon: string) => {
        switch (icon) {
            case 'contract': return <FileText className="w-4 h-4" />
            case 'payment': return <DollarSign className="w-4 h-4" />
            case 'document': return <Upload className="w-4 h-4" />
            case 'project': return <CheckCircle className="w-4 h-4" />
            default: return <Clock className="w-4 h-4" />
        }
    }

    const getIconColor = (icon: string) => {
        switch (icon) {
            case 'contract': return 'bg-purple-50 text-purple-600'
            case 'payment': return 'bg-emerald-50 text-emerald-600'
            case 'document': return 'bg-amber-50 text-amber-600'
            case 'project': return 'bg-blue-50 text-blue-600'
            default: return 'bg-slate-50 text-slate-600'
        }
    }

    const getTimeAgo = (timestamp: string) => {
        const now = new Date()
        const then = new Date(timestamp)
        const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

        if (diffInSeconds < 60) return 'Just now'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
        return then.toLocaleDateString()
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                <Clock className="w-5 h-5 text-slate-400" />
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-start gap-3 animate-pulse">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                            <div className="flex-1">
                                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-slate-100 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : activities.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No recent activity</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {activities.map((activity, index) => (
                        <div key={`${activity.type}-${activity.id}`} className="flex items-start gap-3 group">
                            <div className={`p-2 rounded-lg ${getIconColor(activity.icon)} group-hover:scale-110 transition-transform`}>
                                {getIcon(activity.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 text-sm">{activity.title}</p>
                                <p className="text-sm text-slate-500 truncate">{activity.description}</p>
                            </div>
                            <span className="text-xs text-slate-400 whitespace-nowrap">
                                {getTimeAgo(activity.timestamp)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
