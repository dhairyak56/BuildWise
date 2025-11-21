'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Calendar, Plus, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import AddPaymentModal from './AddPaymentModal'

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

    const fetchPayments = async () => {
        try {
            const { data, error } = await supabase
                .from('payments')
                .select('*')
                .eq('project_id', projectId)
                .order('payment_date', { ascending: true })

            if (error) throw error
            setPayments(data || [])
        } catch (error) {
            console.error('Error fetching payments:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPayments()
    }, [projectId])

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
                return <CheckCircle className="w-5 h-5 text-green-600" />
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
                return 'bg-green-100 text-green-700 border-green-200'
            case 'Scheduled':
                return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'Overdue':
                return 'bg-red-100 text-red-700 border-red-200'
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200'
        }
    }

    return (
        <div className="space-y-6">
            {/* Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-500">Contract Value</span>
                        <DollarSign className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                        ${contractValue?.toLocaleString() || '0'}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-500">Total Paid</span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                        ${totalPaid.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        {percentagePaid.toFixed(1)}% of contract
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-500">Remaining</span>
                        <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                        ${(contractValue - totalPaid).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        ${totalScheduled.toLocaleString()} scheduled
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Payment Progress</span>
                    <span className="text-sm font-semibold text-slate-900">{percentagePaid.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                        style={{ width: `${Math.min(percentagePaid, 100)}%` }}
                    />
                </div>
            </div>

            {/* Payments List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Payment Schedule</h3>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium text-sm transition-all shadow-lg shadow-slate-900/20"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Payment
                    </button>
                </div>

                <div className="p-6">
                    {isLoading ? (
                        <div className="text-center py-8 text-slate-500">Loading payments...</div>
                    ) : payments.length === 0 ? (
                        <div className="text-center py-12">
                            <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 mb-4">No payments added yet</p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium text-sm transition-all"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Payment
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {payments.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                                >
                                    <div className="flex items-center space-x-4 flex-1">
                                        {getStatusIcon(payment.status)}
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-1">
                                                <p className="font-semibold text-slate-900">
                                                    ${parseFloat(payment.amount.toString()).toLocaleString()}
                                                </p>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(payment.status)}`}>
                                                    {payment.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                                                <span className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    {new Date(payment.payment_date).toLocaleDateString()}
                                                </span>
                                                {payment.description && (
                                                    <span>{payment.description}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeletePayment(payment.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AddPaymentModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                projectId={projectId}
                onPaymentAdded={fetchPayments}
            />
        </div>
    )
}
