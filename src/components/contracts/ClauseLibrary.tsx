'use client'

import { useState, useEffect } from 'react'
import { ContractClause, ClauseCategory } from '@/types/clause'
import { Search, FileText, Plus, Loader2, Check } from 'lucide-react'

interface ClauseLibraryProps {
    onSelectClause?: (clause: ContractClause) => void
    selectedClauses?: string[]
    applicableTo?: string
}

const CATEGORY_LABELS: Record<ClauseCategory, string> = {
    payment: 'Payment Terms',
    warranty: 'Warranties',
    insurance: 'Insurance',
    termination: 'Termination',
    variation: 'Variations',
    dispute: 'Dispute Resolution',
    time: 'Time & Extensions',
    safety: 'Safety & Compliance',
    general: 'General'
}

const CATEGORY_COLORS: Record<ClauseCategory, string> = {
    payment: 'bg-green-50 border-green-200 text-green-700',
    warranty: 'bg-blue-50 border-blue-200 text-blue-700',
    insurance: 'bg-purple-50 border-purple-200 text-purple-700',
    termination: 'bg-red-50 border-red-200 text-red-700',
    variation: 'bg-orange-50 border-orange-200 text-orange-700',
    dispute: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    time: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    safety: 'bg-pink-50 border-pink-200 text-pink-700',
    general: 'bg-slate-50 border-slate-200 text-slate-700'
}

export function ClauseLibrary({ onSelectClause, selectedClauses = [], applicableTo }: ClauseLibraryProps) {
    const [clauses, setClauses] = useState<ContractClause[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [expandedClause, setExpandedClause] = useState<string | null>(null)

    useEffect(() => {
        fetchClauses()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory, applicableTo])

    const fetchClauses = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (selectedCategory) params.append('category', selectedCategory)
            if (applicableTo) params.append('applicableTo', applicableTo)

            const response = await fetch(`/api/clauses?${params}`)
            if (!response.ok) throw new Error('Failed to fetch clauses')
            const data = await response.json()
            setClauses(data)
        } catch (error) {
            console.error('Error fetching clauses:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredClauses = clauses.filter(clause => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            clause.title.toLowerCase().includes(query) ||
            clause.description?.toLowerCase().includes(query) ||
            clause.content.toLowerCase().includes(query)
        )
    })

    const categories = Array.from(new Set(clauses.map(c => c.category))) as ClauseCategory[]

    const isSelected = (clauseId: string) => selectedClauses.includes(clauseId)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Clause Library</h3>
                <p className="text-sm text-slate-500">
                    Browse and add professional legal clauses to your contract
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search clauses..."
                    className="w-full pl-10 pr-4 py-2 text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${selectedCategory === null
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    All Categories
                </button>
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${selectedCategory === category
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {CATEGORY_LABELS[category]}
                    </button>
                ))}
            </div>

            {/* Clauses List */}
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredClauses.map(clause => (
                        <div
                            key={clause.id}
                            className={`border-2 rounded-lg transition-all ${isSelected(clause.id)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 bg-white hover:border-blue-300'
                                }`}
                        >
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-semibold text-slate-900">{clause.title}</h4>
                                            {clause.is_required && (
                                                <span className="text-xs px-2 py-0.5 bg-red-50 text-red-700 rounded-full border border-red-200">
                                                    Required
                                                </span>
                                            )}
                                        </div>
                                        {clause.description && (
                                            <p className="text-sm text-slate-600 mb-2">{clause.description}</p>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-1 rounded-full border ${CATEGORY_COLORS[clause.category as ClauseCategory]
                                                }`}>
                                                {CATEGORY_LABELS[clause.category as ClauseCategory]}
                                            </span>
                                            <button
                                                onClick={() => setExpandedClause(
                                                    expandedClause === clause.id ? null : clause.id
                                                )}
                                                className="text-xs text-blue-600 hover:text-blue-700"
                                            >
                                                {expandedClause === clause.id ? 'Hide' : 'Preview'}
                                            </button>
                                        </div>
                                    </div>

                                    {onSelectClause && (
                                        <button
                                            onClick={() => onSelectClause(clause)}
                                            className={`p-2 rounded-lg transition-colors ${isSelected(clause.id)
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            {isSelected(clause.id) ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                <Plus className="w-4 h-4" />
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* Expanded Content */}
                                {expandedClause === clause.id && (
                                    <div className="mt-4 pt-4 border-t border-slate-200">
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
                                                {clause.content}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {filteredClauses.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p>No clauses found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
