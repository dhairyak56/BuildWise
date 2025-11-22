'use client'

import { useEffect, useState } from 'react'
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'

interface PaymentTrendData {
    month: string
    total_payments: number
    total_amount: number
    avg_payment: number
    paid_count: number
    overdue_count: number
}

export function PaymentTrendsWidget() {
    const [data, setData] = useState<PaymentTrendData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const response = await fetch('/api/analytics/trends')
            if (!response.ok) throw new Error('Failed to fetch payment trends')
            const result = await response.json()
            // Reverse to show oldest to newest
            setData(result.reverse())
        } catch (error) {
            console.error('Error loading payment trends:', error)
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
        return format(new Date(dateStr), 'MMM')
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
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Payment Trends</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                            yAxisId="left"
                            tickFormatter={(value) => `$${value / 1000}k`}
                            stroke="#64748B"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#64748B"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                name === 'Total Amount' ? formatCurrency(value) : value,
                                name
                            ]}
                            labelFormatter={(label) => formatDate(label as string)}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend />
                        <Bar
                            yAxisId="left"
                            dataKey="total_amount"
                            name="Total Amount"
                            fill="#3B82F6"
                            radius={[4, 4, 0, 0]}
                            barSize={20}
                            fillOpacity={0.8}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="total_payments"
                            name="Payment Count"
                            stroke="#F59E0B"
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#F59E0B' }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
