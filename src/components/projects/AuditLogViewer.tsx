'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import { format } from 'date-fns'
import { Loader2, History } from 'lucide-react'

interface AuditLog {
    id: string
    action: string
    details: any
    created_at: string
    user_id: string
}

interface AuditLogViewerProps {
    projectId: string
}

function formatDetails(details: any): string {
    if (!details || typeof details !== 'object') return '-'

    const parts: string[] = []

    if (details.projectName) parts.push(`Project: ${details.projectName}`)
    if (details.clientName) parts.push(`Client: ${details.clientName}`)
    if (details.value) parts.push(`Value: $${details.value}`)
    if (details.memberEmail) parts.push(`Member: ${details.memberEmail}`)
    if (details.role) parts.push(`Role: ${details.role}`)

    return parts.length > 0 ? parts.join(' • ') : '-'
}

export function AuditLogViewer({ projectId }: AuditLogViewerProps) {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createBrowserClient()

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const { data, error } = await supabase
                    .from('audit_logs')
                    .select('*')
                    .eq('project_id', projectId)
                    .order('created_at', { ascending: false })
                    .limit(50)

                if (error) throw error
                setLogs(data || [])
            } catch (error) {
                console.error('Error fetching audit logs:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchLogs()
    }, [projectId, supabase])

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
        )
    }

    if (logs.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                    <History className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-sm font-medium text-slate-900">No activity recorded</h3>
                <p className="text-sm text-slate-500 mt-1">
                    Important actions will appear here.
                </p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Action</th>
                            <th className="px-6 py-3">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                    {format(new Date(log.created_at), 'MMM d, yyyy HH:mm')}
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {log.action}
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {formatDetails(log.details)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
