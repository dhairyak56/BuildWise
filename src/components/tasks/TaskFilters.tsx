'use client'

import { Search, Filter, X } from 'lucide-react'
import { Task } from '@/types/task'
import { useState } from 'react'

interface TaskFiltersProps {
    onFilterChange: (filters: TaskFilterState) => void
    onSearchChange: (search: string) => void
}

export interface TaskFilterState {
    priority: string[]
    status: string[]
}

export function TaskFilters({ onFilterChange, onSearchChange }: TaskFiltersProps) {
    const [search, setSearch] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState<TaskFilterState>({
        priority: [],
        status: []
    })

    const handleSearchChange = (value: string) => {
        setSearch(value)
        onSearchChange(value)
    }

    const togglePriority = (priority: string) => {
        const newPriorities = filters.priority.includes(priority)
            ? filters.priority.filter(p => p !== priority)
            : [...filters.priority, priority]

        const newFilters = { ...filters, priority: newPriorities }
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    const clearFilters = () => {
        const emptyFilters = { priority: [], status: [] }
        setFilters(emptyFilters)
        onFilterChange(emptyFilters)
    }

    const activeFilterCount = filters.priority.length + filters.status.length

    return (
        <div className="space-y-3">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full pl-10 pr-4 py-2 text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${showFilters || activeFilterCount > 0
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {activeFilterCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
                    >
                        <X className="w-3 h-3" />
                        Clear
                    </button>
                )}
            </div>

            {/* Filter Options */}
            {showFilters && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div>
                        <label className="text-xs font-medium text-slate-700 uppercase tracking-wider mb-2 block">
                            Priority
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {['low', 'medium', 'high', 'urgent'].map((priority) => (
                                <button
                                    key={priority}
                                    onClick={() => togglePriority(priority)}
                                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${filters.priority.includes(priority)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                                        }`}
                                >
                                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
