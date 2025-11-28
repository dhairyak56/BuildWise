"use client"

import Link from 'next/link'
import { Plus, FileText, Upload, Bell, ArrowRight } from 'lucide-react'

export function QuickActionsWidget() {
    const actions = [
        {
            title: "New Project",
            description: "Start a new construction project",
            icon: Plus,
            href: "/dashboard/projects/new",
            color: "bg-blue-500",
            textColor: "text-white"
        },
        {
            title: "Draft Contract",
            description: "Create a contract from template",
            icon: FileText,
            href: "/dashboard/contracts/new",
            color: "bg-purple-500",
            textColor: "text-white"
        },
        {
            title: "Upload File",
            description: "Add documents to a project",
            icon: Upload,
            href: "/dashboard/documents",
            color: "bg-emerald-500",
            textColor: "text-white"
        },
        {
            title: "Send Reminder",
            description: "Notify clients about payments",
            icon: Bell,
            href: "/dashboard/payments",
            color: "bg-amber-500",
            textColor: "text-white"
        }
    ]

    return (
        <div className="grid grid-cols-1 gap-3 h-full overflow-y-auto pr-1">
            {actions.map((action, index) => (
                <Link
                    key={index}
                    href={action.href}
                    className="flex items-center p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm bg-white transition-all group"
                >
                    <div className={`p-3 rounded-lg ${action.color} ${action.textColor} shadow-sm group-hover:scale-105 transition-transform`}>
                        <action.icon className="h-5 w-5" />
                    </div>
                    <div className="ml-4 flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{action.title}</h3>
                        <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </Link>
            ))}
        </div>
    )
}
