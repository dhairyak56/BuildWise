'use client'

import { useState } from 'react'
import { QuickStatsWidget } from '@/components/analytics/QuickStatsWidget'
import { CashFlowWidget } from '@/components/analytics/CashFlowWidget'
import { ProjectProfitWidget } from '@/components/analytics/ProjectProfitWidget'
import { PaymentTrendsWidget } from '@/components/analytics/PaymentTrendsWidget'
import { Download, Calendar } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase'

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState<'7' | '30' | '90' | '365'>('30')
    const [isExporting, setIsExporting] = useState(false)

    const supabase = createBrowserClient()

    const handleExport = async () => {
        setIsExporting(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Fetch all analytics data
            const [paymentsRes, projectsRes] = await Promise.all([
                supabase.from('payments').select('*').eq('user_id', user.id),
                supabase.from('projects').select('*').eq('user_id', user.id)
            ])

            // Create CSV content
            let csv = 'Analytics Report\n\n'

            // Payments section
            csv += 'PAYMENTS\n'
            csv += 'Name,Amount,Status,Date,Client\n'
            paymentsRes.data?.forEach(payment => {
                csv += `"${payment.name}",${payment.amount},"${payment.status}","${new Date(payment.payment_date).toLocaleDateString()}","${payment.client_name}"\n`
            })

            csv += '\n\nPROJECTS\n'
            csv += 'Name,Client,Status,Progress,Contract Value,Start Date,End Date\n'
            projectsRes.data?.forEach(project => {
                csv += `"${project.name}","${project.client_name}","${project.status}",${project.progress}%,${project.contract_value},"${new Date(project.start_date).toLocaleDateString()}","${new Date(project.end_date).toLocaleDateString()}"\n`
            })

            // Download CSV
            const blob = new Blob([csv], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(a)
            a.click()
            URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('Error exporting report:', error)
            alert('Failed to export report')
        } finally {
            setIsExporting(false)
        }
    }
    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
                    <p className="text-slate-500 mt-1">
                        Track your business performance, cash flow, and project profitability
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value as '7' | '30' | '90' | '365')}
                            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors shadow-sm appearance-none pr-10 cursor-pointer"
                        >
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="90">Last 90 Days</option>
                            <option value="365">Last Year</option>
                        </select>
                        <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {isExporting ? 'Exporting...' : 'Export Report'}
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="mb-8">
                <QuickStatsWidget />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <CashFlowWidget />
                <ProjectProfitWidget />
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 gap-8">
                <PaymentTrendsWidget />
            </div>
        </div>
    )
}
