import { CalendarView } from '@/components/calendar/CalendarView'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function CalendarPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
                    <p className="text-gray-500 mt-1">View all your projects, milestones, and deadlines</p>
                </div>
                <Link
                    href="/dashboard/projects/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <Plus className="h-4 w-4" />
                    New Project
                </Link>
            </div>

            {/* Calendar */}
            <CalendarView />
        </div>
    )
}
