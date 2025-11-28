"use client"

import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle, FileText, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPIMetricsProps {
    data: {
        avgCompletionTime: number // in days
        paymentCollectionRate: number // percentage
        contractApprovalRate: number // percentage
        outstandingInvoices: number // amount
    }
}

export function KPIMetrics({ data }: KPIMetricsProps) {
    const metrics = [
        {
            title: "Avg Completion Time",
            value: `${data.avgCompletionTime} days`,
            icon: Clock,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            trend: "-2 days",
            trendUp: true, // good trend (lower is better for time, but let's assume context) - actually let's say faster is better
            description: "vs last month"
        },
        {
            title: "Collection Rate",
            value: `${data.paymentCollectionRate}%`,
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-50",
            trend: "+5%",
            trendUp: true,
            description: "vs last month"
        },
        {
            title: "Contract Approval",
            value: `${data.contractApprovalRate}%`,
            icon: FileText,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            trend: "+12%",
            trendUp: true,
            description: "vs last month"
        },
        {
            title: "Outstanding",
            value: `$${data.outstandingInvoices.toLocaleString()}`,
            icon: CheckCircle,
            color: "text-amber-600",
            bgColor: "bg-amber-50",
            trend: "-$1.2k",
            trendUp: true, // lower is better for outstanding
            description: "vs last month"
        }
    ]

    return (
        <div className="grid grid-cols-2 gap-4 h-full">
            {metrics.map((metric, index) => (
                <div key={index} className="flex flex-col justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className={cn("p-2 rounded-lg", metric.bgColor)}>
                            <metric.icon className={cn("h-4 w-4", metric.color)} />
                        </div>
                        <div className={cn(
                            "flex items-center text-xs font-medium",
                            metric.trendUp ? "text-green-600" : "text-red-600"
                        )}>
                            {metric.trendUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                            {metric.trend}
                        </div>
                    </div>
                    <div className="mt-3">
                        <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                        <p className="text-xs text-gray-500 mt-1">{metric.title}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
