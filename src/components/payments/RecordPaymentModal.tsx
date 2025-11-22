'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import { X, DollarSign, Loader2, AlertCircle } from 'lucide-react'

interface Project {
    id: string
    name: string
    client_name: string
}

interface RecordPaymentModalProps {
    isOpen: boolean
    onClose: () => void
    onPaymentRecorded: () => void
}

export default function RecordPaymentModal({ isOpen, onClose, onPaymentRecorded }: RecordPaymentModalProps) {
    const [projects, setProjects] = useState<Project[]>([])
    const [loadingProjects, setLoadingProjects] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        projectId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Paid',
        description: ''
    })

    const supabase = createBrowserClient()

    const fetchProjects = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('projects')
                .select('id, name, client_name')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setProjects(data || [])
        } catch (error) {
            console.error('Error fetching projects:', error)
            setError('Failed to load projects')
        } finally {
            setLoadingProjects(false)
        }
    }, [supabase])

    useEffect(() => {
        if (isOpen) {
            fetchProjects()
        }
    }, [isOpen, fetchProjects])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.projectId || !formData.amount) {
            setError('Please fill in all required fields')
            return
        }

        setSubmitting(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('User not authenticated')

            const { error: insertError } = await supabase
                .from('payments')
                .insert({
                    user_id: user.id,
                    project_id: formData.projectId,
                    amount: parseFloat(formData.amount),
                    payment_date: formData.date,
                    status: formData.status,
                    name: formData.description || 'Payment',
                    client_name: projects.find(p => p.id === formData.projectId)?.client_name || 'Unknown Client'
                })

            if (insertError) throw insertError

            onPaymentRecorded()
            onClose()

            // Reset form
            setFormData({
                projectId: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                status: 'Paid',
                description: ''
            })

        } catch (error) {
            console.error('Error recording payment:', error)
            setError('Failed to record payment. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Record Payment</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Project Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Project</label>
                        <select
                            value={formData.projectId}
                            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            disabled={loadingProjects}
                        >
                            <option value="">Select a project...</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name} ({project.client_name})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Amount</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Date & Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            >
                                <option value="Paid">Paid</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Pending">Pending</option>
                                <option value="Overdue">Overdue</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Description</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. Initial Deposit"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Recording...
                            </>
                        ) : (
                            'Record Payment'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
