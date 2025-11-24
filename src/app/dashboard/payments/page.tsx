'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import {
    DollarSign,
    Plus,
    Search,
    Filter,
    ArrowDownLeft,
    Calendar,
    Clock,
    AlertCircle,
    FileText,
    Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import RecordPaymentModal from '@/components/payments/RecordPaymentModal'
import jsPDF from 'jspdf'

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Record<string, unknown>[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)

    const supabase = createBrowserClient()

    const generateInvoice = (payment: any) => {
        const doc = new jsPDF()

        // Header
        doc.setFontSize(20)
        doc.text('INVOICE', 105, 20, { align: 'center' })

        doc.setFontSize(10)
        doc.text('BuildWise Construction', 20, 30)
        doc.text('123 Builder Way', 20, 35)
        doc.text('Sydney, NSW 2000', 20, 40)

        // Invoice Details
        doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 140, 30)
        doc.text(`Invoice #: INV-${payment.id.slice(0, 8).toUpperCase()}`, 140, 35)

        // Bill To
        doc.text('Bill To:', 20, 55)
        doc.setFontSize(12)
        doc.text(payment.client_name || 'Valued Client', 20, 62)
        doc.setFontSize(10)

        // Table Header
        doc.setFillColor(240, 240, 240)
        doc.rect(20, 75, 170, 10, 'F')
        doc.setFont('helvetica', 'bold')
        doc.text('Description', 25, 81)
        doc.text('Amount', 160, 81)

        // Table Content
        doc.setFont('helvetica', 'normal')
        doc.text(payment.name || 'Payment', 25, 95)
        doc.text(`$${Number(payment.amount).toLocaleString()}`, 160, 95)

        // Total
        doc.line(20, 110, 190, 110)
        doc.setFont('helvetica', 'bold')
        doc.text('Total:', 130, 120)
        doc.text(`$${Number(payment.amount).toLocaleString()}`, 160, 120)

        // Footer
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.text('Thank you for your business!', 105, 140, { align: 'center' })

        doc.save(`invoice-${payment.id.slice(0, 8)}.pdf`)
    }

    const fetchPayments = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('payments')
                .select(`
                    *,
                    projects (
                        name,
                        client_name
                    )
                `)
                .order('payment_date', { ascending: false })

            if (error) throw error
            setPayments(data || [])
        } catch (error) {
            console.error('Error fetching payments:', error)
        } finally {
            setLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        fetchPayments()
    }, [fetchPayments])

    const handleDelete = async (paymentId: string) => {
        if (!confirm('Are you sure you want to delete this payment? This action cannot be undone.')) return

        try {
            const { error } = await supabase
                .from('payments')
                .delete()
                .eq('id', paymentId)

            if (error) throw error

            fetchPayments()
        } catch (error) {
            console.error('Error deleting payment:', error)
            alert('Failed to delete payment')
        }
    }

    const filteredPayments = payments.filter((payment) => {
        const matchesSearch = searchQuery === '' ||
            String(payment.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(payment.client_name || '').toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'All' || payment.status === statusFilter

        return matchesSearch && matchesStatus
    })



    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-poppins">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Payments
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Track project finances and payment schedules
                    </p>
                </div>
                <button
                    onClick={() => setIsRecordModalOpen(true)}
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-[#4A90E2] text-white rounded-xl hover:bg-[#357ABD] font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Record Payment
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <ArrowDownLeft className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Total Received</p>
                    <h3 className="text-2xl font-bold text-gray-900">$45,231.89</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 text-[#4A90E2] rounded-lg">
                            <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-[#4A90E2] bg-blue-50 px-2 py-1 rounded-full">Upcoming</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Scheduled</p>
                    <h3 className="text-2xl font-bold text-gray-900">$12,500.00</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">Action Needed</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Overdue</p>
                    <h3 className="text-2xl font-bold text-gray-900">$0.00</h3>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-1 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search payments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-none focus:ring-0 bg-transparent text-gray-900 placeholder-gray-400"
                    />
                </div>
                <div className="h-px sm:h-auto sm:w-px bg-gray-200 mx-2" />
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-10 pr-8 py-3 rounded-xl border-none focus:ring-0 bg-transparent text-gray-700 font-medium cursor-pointer hover:bg-gray-50 transition-colors appearance-none"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Paid">Paid</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>
            </div>

            {/* Payments List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : filteredPayments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <DollarSign className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No payments recorded</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        Start tracking your project income by recording your first payment.
                    </p>
                    <button
                        onClick={() => setIsRecordModalOpen(true)}
                        className="inline-flex items-center px-6 py-3 bg-[#4A90E2] text-white rounded-xl hover:bg-[#357ABD] font-medium transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Record Payment
                    </button>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payments.map((payment) => (
                                <tr key={String(payment.id)} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-emerald-50 rounded-lg mr-3 group-hover:bg-emerald-100 transition-colors">
                                                <DollarSign className="w-4 h-4 text-emerald-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{String(payment.name || 'Untitled Payment')}</div>
                                                <div className="text-xs text-gray-500">{String(payment.client_name || 'Unknown Client')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">${Number(payment.amount || 0).toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border",
                                            String(payment.status) === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                String(payment.status) === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    'bg-gray-100 text-gray-700 border-gray-200'
                                        )}>
                                            {String(payment.status || 'Pending')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-1.5 text-gray-400" />
                                            {new Date(String(payment.created_at)).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => generateInvoice(payment)}
                                                className="p-2 text-gray-400 hover:text-[#4A90E2] hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Generate Invoice"
                                            >
                                                <FileText className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(String(payment.id))}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Payment"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <RecordPaymentModal
                isOpen={isRecordModalOpen}
                onClose={() => setIsRecordModalOpen(false)}
                onPaymentRecorded={fetchPayments}
            />
        </div>
    )
}
