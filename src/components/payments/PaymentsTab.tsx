'use client'

import { useState, useEffect, useCallback } from 'react'
import { DollarSign, Calendar, Plus, Trash2, CheckCircle, Clock, AlertCircle, ArrowUpRight } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import AddPaymentModal from './AddPaymentModal'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Payment {
    id: string
    amount: number
    payment_date: string
    status: string
    description: string
    created_at: string
}

interface PaymentsTabProps {
    projectId: string
    contractValue: number
}

export default function PaymentsTab({ projectId, contractValue }: PaymentsTabProps) {
    const [payments, setPayments] = useState<Payment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const fetchPayments = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('payments')
                .select('*')
                .eq('project_id', projectId)
                .order('payment_date', { ascending: false })

            if (error) throw error
            setPayments(data || [])
        } catch (error) {
            console.error('Error fetching payments:', error)
        } finally {
            setIsLoading(false)
        }
    }, [projectId, supabase])

    useEffect(() => {
        fetchPayments()
    }, [fetchPayments, projectId])

    const handleDeletePayment = async (paymentId: string) => {
        if (!confirm('Are you sure you want to delete this payment?')) return

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

    const totalPaid = payments
        .filter(p => p.status === 'Paid')
        .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0)

    const totalScheduled = payments
        .filter(p => p.status === 'Scheduled')
        .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0)

    const percentagePaid = contractValue > 0 ? (totalPaid / contractValue) * 100 : 0

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Paid':
                return <CheckCircle className="w-5 h-5 text-emerald-600" />
            case 'Scheduled':
                return <Clock className="w-5 h-5 text-blue-600" />
            case 'Overdue':
                return <AlertCircle className="w-5 h-5 text-red-600" />
            default:
                return null
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200'
            case 'Scheduled':
                return 'bg-blue-50 text-blue-700 border-blue-200'
            case 'Overdue':
                return 'bg-red-50 text-red-700 border-red-200'
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200'
        }
    }

    return (
        <div className="space-y-6 font-poppins">
            {/* Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contract Value</span>
                        <div className="p-2 bg-slate-50 rounded-lg">
                            <DollarSign className="w-5 h-5 text-slate-400" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">
                        ${contractValue?.toLocaleString() || '0'}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Paid</span>
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-emerald-600">
                        ${totalPaid.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 font-medium">
                        {percentagePaid.toFixed(1)}% of contract
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remaining</span>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Clock className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">
                        ${(contractValue - totalPaid).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 font-medium">
                        ${totalScheduled.toLocaleString()} scheduled
                    </p>
                </motion.div>
            </div>

            {/* Progress Bar */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
            >
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Payment Progress</h3>
                        <p className="text-sm text-slate-500 mt-1">Track payments against total contract value</p>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{percentagePaid.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentagePaid, 100)}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    />
                </div>
            </motion.div>

            {/* Payments List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Payment Schedule</h3>
                        <p className="text-sm text-slate-500 mt-1">Manage all project payments</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center px-5 py-2.5 bg-[#4A90E2] text-white rounded-xl hover:bg-[#357ABD] font-semibold text-sm transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Payment
                    </button>
                </div>

                <div className="p-6">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-slate-500">Loading payments...</p>
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="text-center py-16 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                                <DollarSign className="w-8 h-8 text-slate-300" />
                            </div>
                            <h4 className="text-slate-900 font-medium mb-1">No payments yet</h4>
                            <p className="text-slate-500 mb-6 text-sm">Add your first payment to start tracking progress</p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-all shadow-sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Payment
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {payments.map((payment, index) => (
                                <motion.div
                                    key={payment.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group flex items-center justify-between p-5 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                                >
                                    <div className="flex items-center space-x-5 flex-1">
                                        <div className={cn("p-3 rounded-xl transition-colors",
                                            payment.status === 'Paid' ? "bg-emerald-50" :
                                                payment.status === 'Overdue' ? "bg-red-50" : "bg-blue-50"
                                        )}>
                                            {getStatusIcon(payment.status)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-1">
                                                <p className="text-lg font-bold text-slate-900">
                                                    ${parseFloat(payment.amount.toString()).toLocaleString()}
                                                </p>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(payment.status)}`}>
                                                    {payment.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                                                <span className="flex items-center font-medium">
                                                    <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
                                                    {new Date(payment.payment_date).toLocaleDateString()}
                                                </span>
                                                {payment.description && (
                                                    <span className="flex items-center border-l border-slate-200 pl-4">
                                                        {payment.description}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeletePayment(payment.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>

            <AddPaymentModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                projectId={projectId}
                onPaymentAdded={fetchPayments}
            />
        </div>
    )
}
