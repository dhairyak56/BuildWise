'use client'

import { QuickStatsWidget } from '@/components/analytics/QuickStatsWidget'
import { CashFlowWidget } from '@/components/analytics/CashFlowWidget'
import { ProjectProfitWidget } from '@/components/analytics/ProjectProfitWidget'
import { PaymentTrendsWidget } from '@/components/analytics/PaymentTrendsWidget'
import { Download, Calendar } from 'lucide-react'

export default function AnalyticsPage() {
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
                    <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors shadow-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Last 30 Days
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
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
