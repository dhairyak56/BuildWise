'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar, dateFnsLocalizer, View, SlotInfo } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar.css'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Filter, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { AddMilestoneModal } from './AddMilestoneModal'

const locales = {
    'en-US': enUS,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

interface CalendarEvent {
    id: string
    title: string
    start: Date
    end: Date
    type: 'project' | 'milestone' | 'payment'
    status: string
    description?: string
    projectId?: string
}

interface CalendarViewProps {
    initialView?: View
}

export function CalendarView({ initialView = 'month' }: CalendarViewProps) {
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [view, setView] = useState<View>(initialView)
    const [date, setDate] = useState(new Date())
    const [isLoading, setIsLoading] = useState(true)
    const [typeFilter, setTypeFilter] = useState<string>('all')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>()

    const fetchEvents = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/calendar/events')
            const data = await response.json()

            if (data.events) {
                const parsedEvents = data.events.map((event: any) => ({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end)
                }))
                setEvents(parsedEvents)
            }
        } catch (error) {
            console.error('Error fetching calendar events:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    const filteredEvents = typeFilter === 'all'
        ? events
        : events.filter(e => e.type === typeFilter)

    const eventStyleGetter = (event: CalendarEvent) => {
        let className = 'rbc-event '

        // Add type-specific class
        className += `event-${event.type} `

        // Add status-specific class
        if (event.status === 'Overdue' || event.status === 'cancelled') {
            className += 'event-overdue'
        } else if (event.status === 'completed' || event.status === 'Paid') {
            className += 'event-completed'
        }

        return {
            className,
            style: {}
        }
    }

    const handleNavigate = (newDate: Date) => {
        setDate(newDate)
    }

    const handleViewChange = (newView: View) => {
        setView(newView)
    }

    const handleSelectSlot = (slotInfo: SlotInfo) => {
        setSelectedDate(slotInfo.start)
        setIsModalOpen(true)
    }

    const CustomToolbar = ({ label, onNavigate, onView }: any) => {
        return (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-900">{label}</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onNavigate('PREV')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => onNavigate('TODAY')}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Today
                        </button>
                        <button
                            onClick={() => onNavigate('NEXT')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Add Milestone Button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        <Plus className="h-4 w-4" />
                        Add Milestone
                    </button>

                    {/* Type Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Events</option>
                            <option value="project">Projects</option>
                            <option value="milestone">Milestones</option>
                            <option value="payment">Payments</option>
                        </select>
                    </div>

                    {/* View Switcher */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => onView('month')}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                view === 'month'
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => onView('week')}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                view === 'week'
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => onView('day')}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                view === 'day'
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            Day
                        </button>
                        <button
                            onClick={() => onView('agenda')}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                view === 'agenda'
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            Agenda
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
                <Calendar
                    localizer={localizer}
                    events={filteredEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 750, minHeight: 600 }}
                    view={view}
                    onView={handleViewChange}
                    date={date}
                    onNavigate={handleNavigate}
                    eventPropGetter={eventStyleGetter}
                    selectable
                    onSelectSlot={handleSelectSlot}
                    components={{
                        toolbar: CustomToolbar
                    }}
                    onSelectEvent={(event) => {
                        if (event.projectId) {
                            window.location.href = `/dashboard/projects/${event.projectId}`
                        }
                    }}
                    popup
                />

                {/* Legend */}
                <div className="mt-8 flex flex-wrap items-center gap-6 pt-6 border-t border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">Event Types:</span>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#4A90E2] to-[#357ABD] shadow-sm"></div>
                        <span className="text-sm text-gray-600 font-medium">Projects</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] shadow-sm"></div>
                        <span className="text-sm text-gray-600 font-medium">Milestones</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#10b981] to-[#059669] shadow-sm"></div>
                        <span className="text-sm text-gray-600 font-medium">Payments</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#ef4444] to-[#dc2626] shadow-sm animate-pulse"></div>
                        <span className="text-sm text-gray-600 font-medium">Overdue</span>
                    </div>
                </div>
            </div>

            {/* Add Milestone Modal */}
            <AddMilestoneModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedDate(undefined)
                }}
                selectedDate={selectedDate}
                onMilestoneAdded={fetchEvents}
            />
        </>
    )
}
