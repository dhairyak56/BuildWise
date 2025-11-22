'use client'

import { useEffect, useState } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'

interface CashFlowData {
    month: string
    expected_income: number
    actual_income: number
    overdue_count: number
}

export function CashFlowWidget() {
    const [data, setData] = useState<CashFlowData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const response = await fetch('/api/analytics/cash-flow')
            if (!response.ok) throw new Error('Failed to fetch cash flow data')
            const result = await response.json()
            setData(result)
        } catch (error) {
            console.error('Error loading cash flow data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    const formatDate = (dateStr: string) => {
        return format(new Date(dateStr), 'MMM yyyy')
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-6 h-[400px] animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-32 mb-6" />
                <div className="h-full bg-slate-100 rounded" />
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 h-[400px]">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Cash Flow Projection</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis
                            dataKey="month"
                            tickFormatter={formatDate}
                            stroke="#64748B"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tickFormatter={(value) => `$${value / 1000}k`}
                            stroke="#64748B"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            labelFormatter={(label) => formatDate(label as string)}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="actual_income"
                            name="Actual Income"
                            stroke="#16A34A"
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#16A34A' }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="expected_income"
                            name="Expected Income"
                            stroke="#2563EB"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ r: 4, fill: '#2563EB' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
