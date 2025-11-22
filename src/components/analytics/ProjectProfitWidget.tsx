'use client'

import { useEffect, useState } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'

interface ProjectProfitData {
    id: string
    name: string
    budget: number
    revenue: number
    remaining: number
    completion_percentage: number
}

export function ProjectProfitWidget() {
    const [data, setData] = useState<ProjectProfitData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const response = await fetch('/api/analytics/profitability')
            if (!response.ok) throw new Error('Failed to fetch profitability data')
            const result = await response.json()
            setData(result)
        } catch (error) {
            console.error('Error loading profitability data:', error)
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
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Project Profitability</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={100}
                            tick={{ fontSize: 12, fill: '#64748B' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            cursor={{ fill: '#F1F5F9' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend />
                        <Bar dataKey="revenue" name="Revenue" stackId="a" fill="#16A34A" radius={[0, 4, 4, 0]} barSize={20} />
                        <Bar dataKey="remaining" name="Remaining Budget" stackId="a" fill="#E2E8F0" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
