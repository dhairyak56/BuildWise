'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
    DollarSign,
    Plus,
    Search,
    Filter,
    ArrowDownLeft,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function PaymentsPage() {
    const [payments, setPayments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const fetchPayments = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('payments')
                .select(`
                    *,
                    projects (name, client_name)
                `)
                .eq('projects.user_id', user.id)
                .order('payment_date', { ascending: false })

            if (error) throw error

            // Filter out payments where project is null (RLS or deleted project)
            const validPayments = data?.filter(p => p.projects) || []
            setPayments(validPayments)
        } catch (error) {
            console.error('Error fetching payments:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPayments()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
            case 'Scheduled': return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'Overdue': return 'bg-red-100 text-red-700 border-red-200'
            default: return 'bg-slate-100 text-slate-700 border-slate-200'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Paid': return <CheckCircle2 className="w-4 h-4 mr-1" />
            case 'Scheduled': return <Clock className="w-4 h-4 mr-1" />
            case 'Overdue': return <AlertCircle className="w-4 h-4 mr-1" />
            default: return null
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Payments
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Track project finances and payment schedules
                    </p>
                </div>
                <button className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transform hover:-translate-y-0.5">
                    <Plus className="w-5 h-5 mr-2" />
                    Record Payment
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <ArrowDownLeft className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Total Received</p>
                    <h3 className="text-2xl font-bold text-slate-900">$45,231.89</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Upcoming</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Scheduled</p>
                    <h3 className="text-2xl font-bold text-slate-900">$12,500.00</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">Action Needed</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Overdue</p>
                    <h3 className="text-2xl font-bold text-slate-900">$0.00</h3>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search payments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-none focus:ring-0 bg-transparent text-slate-900 placeholder-slate-400"
                    />
                </div>
                <div className="h-px sm:h-auto sm:w-px bg-slate-200 mx-2" />
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select className="w-full pl-10 pr-8 py-3 rounded-xl border-none focus:ring-0 bg-transparent text-slate-700 font-medium cursor-pointer hover:bg-slate-50 transition-colors appearance-none">
                        <option>All Statuses</option>
                        <option>Paid</option>
                        <option>Scheduled</option>
                        <option>Overdue</option>
                    </select>
                </div>
            </div>

            {/* Payments List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : payments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <DollarSign className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No payments recorded</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                        Start tracking your project income by recording your first payment.
                    </p>
                    <button className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium transition-all shadow-lg shadow-slate-900/20">
                        <Plus className="w-5 h-5 mr-2" />
                        Record Payment
                    </button>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{payment.description || 'Payment'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-900 font-medium">{payment.projects?.name}</div>
                                        <div className="text-xs text-slate-500">{payment.projects?.client_name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-900">${payment.amount.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border", getStatusColor(payment.status))}>
                                            {getStatusIcon(payment.status)}
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        <div className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-1.5 text-slate-400" />
                                            {new Date(payment.payment_date).toLocaleDateString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
