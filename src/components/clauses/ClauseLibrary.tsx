'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Search, Plus, DollarSign, Shield, AlertTriangle, XCircle, Edit, Scale, FileText, CheckCircle, Lock, Eye, Zap, Sparkles } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase'

interface ClauseCategory {
    id: string
    name: string
    description: string
    icon: string
    sort_order: number
}

interface ClauseTemplate {
    id: string
    category_id: string
    title: string
    content: string
    description: string
    tags: string[]
    is_public: boolean
    usage_count: number
}

interface ClauseLibraryProps {
    isOpen: boolean
    onClose: () => void
    onInsertClause: (content: string, title: string, useSmartInsert: boolean) => void
}

export function ClauseLibrary({ isOpen, onClose, onInsertClause }: ClauseLibraryProps) {
    const [categories, setCategories] = useState<ClauseCategory[]>([])
    const [clauses, setClauses] = useState<ClauseTemplate[]>([])
    const [filteredClauses, setFilteredClauses] = useState<ClauseTemplate[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [selectedClause, setSelectedClause] = useState<ClauseTemplate | null>(null)
    const [useSmartInsert, setUseSmartInsert] = useState(false)

    const supabase = createBrowserClient()

    const loadData = useCallback(async () => {
        setIsLoading(true)
        try {
            // Load categories
            const { data: categoriesData, error: categoriesError } = await supabase
                .from('clause_categories')
                .select('*')
                .order('sort_order')

            if (categoriesError) throw categoriesError
            setCategories(categoriesData || [])

            // Load clauses
            const { data: clausesData, error: clausesError } = await supabase
                .from('clause_templates')
                .select('*')
                .eq('is_public', true)
                .order('usage_count', { ascending: false })

            if (clausesError) throw clausesError
            setClauses(clausesData || [])
        } catch (error) {
            console.error('Error loading clause library:', error)
        } finally {
            setIsLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        if (isOpen) {
            loadData()
        }
    }, [isOpen, loadData])

    const filterClauses = useCallback(() => {
        let filtered = clauses

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(c => c.category_id === selectedCategory)
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(c =>
                c.title.toLowerCase().includes(query) ||
                c.description?.toLowerCase().includes(query) ||
                c.content.toLowerCase().includes(query) ||
                c.tags?.some(tag => tag.toLowerCase().includes(query))
            )
        }

        setFilteredClauses(filtered)
    }, [clauses, selectedCategory, searchQuery])

    useEffect(() => {
        filterClauses()
    }, [searchQuery, selectedCategory, clauses, filterClauses])

    const handleInsertClause = async (clause: ClauseTemplate) => {
        // Track usage FIRST (before modal closes)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {


                // Insert usage record
                const { error: usageError } = await supabase.from('clause_usage').insert({
                    clause_id: clause.id,
                    user_id: user.id
                })

                if (usageError) {
                    console.error('Error inserting usage:', usageError)
                }

                // Increment usage count using SQL increment
                const { error: updateError } = await supabase.rpc('increment_clause_usage', {
                    clause_id: clause.id
                })

                if (updateError) {
                    console.error('Error incrementing count:', updateError)
                    // Fallback to manual increment
                    await supabase
                        .from('clause_templates')
                        .update({ usage_count: (clause.usage_count || 0) + 1 })
                        .eq('id', clause.id)
                }

                console.log('Usage tracked, reloading data...')
                // Reload data to show updated usage count
                await loadData()
                console.log('Data reloaded')
            }
        } catch (error) {
            console.error('Error tracking clause usage:', error)
        }

        // Insert the clause (this may close the modal)
        onInsertClause(clause.content, clause.title, useSmartInsert)

        // Close modal
        onClose()
    }

    const getCategoryIcon = (iconName: string) => {
        const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
            DollarSign: DollarSign,
            Shield: Shield,
            AlertTriangle: AlertTriangle,
            XCircle: XCircle,
            Edit: Edit,
            Scale: Scale,
            FileText: FileText,
            CheckCircle: CheckCircle,
            Lock: Lock,
            Eye: Eye
        }
        const IconComponent = iconMap[iconName] || FileText
        return <IconComponent className="w-4 h-4" />
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Contract Clause Library</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Browse and insert pre-built clauses into your contract
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Smart Insert Toggle */}
                    <div className="flex items-center space-x-2 bg-slate-50 p-1 rounded-lg w-fit">
                        <button
                            onClick={() => setUseSmartInsert(false)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${!useSmartInsert
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <Zap className="w-4 h-4 mr-1.5" />
                            Quick Insert
                        </button>
                        <button
                            onClick={() => setUseSmartInsert(true)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${useSmartInsert
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <Sparkles className="w-4 h-4 mr-1.5" />
                            Smart Insert (AI)
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar - Categories */}
                    <div className="w-64 border-r border-slate-200 bg-slate-50 p-4 overflow-y-auto">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Categories</h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === null
                                    ? 'bg-white text-slate-900 font-medium shadow-sm'
                                    : 'text-slate-600 hover:bg-white/50'
                                    }`}
                            >
                                All Clauses
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center ${selectedCategory === category.id
                                        ? 'bg-white text-slate-900 font-medium shadow-sm'
                                        : 'text-slate-600 hover:bg-white/50'
                                        }`}
                                >
                                    <span className="mr-2">{getCategoryIcon(category.icon)}</span>
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Search */}
                        <div className="p-4 border-b border-slate-200">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search clauses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Clause List */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-slate-400">Loading clauses...</div>
                                </div>
                            ) : filteredClauses.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                    <Search className="w-12 h-12 mb-3 opacity-50" />
                                    <p>No clauses found</p>
                                    <p className="text-sm">Try adjusting your search or category filter</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {filteredClauses.map(clause => (
                                        <div
                                            key={clause.id}
                                            className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => setSelectedClause(clause)}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-slate-900">{clause.title}</h4>
                                                <span className="text-xs text-slate-400 ml-2">
                                                    {clause.usage_count} uses
                                                </span>
                                            </div>
                                            {clause.description && (
                                                <p className="text-sm text-slate-600 mb-3">{clause.description}</p>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-wrap gap-1">
                                                    {clause.tags?.slice(0, 3).map(tag => (
                                                        <span
                                                            key={tag}
                                                            className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleInsertClause(clause)
                                                    }}
                                                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                                >
                                                    <Plus className="w-3 h-3 mr-1" />
                                                    Insert
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Preview Modal */}
                {selectedClause && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
                            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-slate-900">{selectedClause.title}</h3>
                                <button
                                    onClick={() => setSelectedClause(null)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="prose prose-sm max-w-none">
                                    <div className="whitespace-pre-wrap text-slate-700">
                                        {selectedClause.content}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
                                <button
                                    onClick={() => setSelectedClause(null)}
                                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        handleInsertClause(selectedClause)
                                        setSelectedClause(null)
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Insert Clause
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
