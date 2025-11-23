'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import { Search, X, FileText, Building2, DollarSign, File, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchResult {
    id: string
    type: 'project' | 'contract' | 'payment' | 'document'
    title: string
    subtitle: string
    url: string
}

interface GlobalSearchProps {
    isOpen: boolean
    onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const router = useRouter()
    const supabase = createBrowserClient()

    const performSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([])
            return
        }

        setIsLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const searchTerm = searchQuery.toLowerCase()

            // Search projects
            const { data: projects } = await supabase
                .from('projects')
                .select('id, name, client_name')
                .eq('user_id', user.id)
                .or(`name.ilike.%${searchTerm}%,client_name.ilike.%${searchTerm}%`)
                .limit(5)

            // Search contracts
            const { data: contracts } = await supabase
                .from('contracts')
                .select('id, projects(name, client_name)')
                .limit(5)

            // Search payments
            const { data: payments } = await supabase
                .from('payments')
                .select('id, name, client_name, amount')
                .eq('user_id', user.id)
                .or(`name.ilike.%${searchTerm}%,client_name.ilike.%${searchTerm}%`)
                .limit(5)

            // Search documents
            const { data: documents } = await supabase
                .from('documents')
                .select('id, name, project_id')
                .eq('user_id', user.id)
                .ilike('name', `%${searchTerm}%`)
                .limit(5)

            const searchResults: SearchResult[] = []

            // Add projects
            projects?.forEach(project => {
                searchResults.push({
                    id: project.id,
                    type: 'project',
                    title: project.name,
                    subtitle: project.client_name || 'No client',
                    url: `/dashboard/projects/${project.id}`
                })
            })

            // Add contracts
            contracts?.forEach(contract => {
                const project = Array.isArray(contract.projects) ? contract.projects[0] : contract.projects
                searchResults.push({
                    id: contract.id,
                    type: 'contract',
                    title: `Contract #${contract.id.slice(0, 8)}`,
                    subtitle: project?.name || 'Unknown project',
                    url: `/dashboard/contracts/${contract.id}`
                })
            })

            // Add payments
            payments?.forEach(payment => {
                searchResults.push({
                    id: payment.id,
                    type: 'payment',
                    title: payment.name || 'Untitled Payment',
                    subtitle: `${payment.client_name} - $${Number(payment.amount).toLocaleString()}`,
                    url: `/dashboard/payments`
                })
            })

            // Add documents
            documents?.forEach(doc => {
                searchResults.push({
                    id: doc.id,
                    type: 'document',
                    title: doc.name,
                    subtitle: 'Document',
                    url: `/dashboard/documents`
                })
            })

            setResults(searchResults)
            setSelectedIndex(0)
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setIsLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        const debounce = setTimeout(() => {
            performSearch(query)
        }, 300)

        return () => clearTimeout(debounce)
    }, [query, performSearch])

    useEffect(() => {
        if (!isOpen) {
            setQuery('')
            setResults([])
            setSelectedIndex(0)
        }
    }, [isOpen])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(prev => (prev + 1) % results.length)
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            e.preventDefault()
            handleNavigate(results[selectedIndex])
        } else if (e.key === 'Escape') {
            onClose()
        }
    }

    const handleNavigate = (result: SearchResult) => {
        router.push(result.url)
        onClose()
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'project': return <Building2 className="w-4 h-4" />
            case 'contract': return <FileText className="w-4 h-4" />
            case 'payment': return <DollarSign className="w-4 h-4" />
            case 'document': return <File className="w-4 h-4" />
            default: return <Search className="w-4 h-4" />
        }
    }

    const getIconColor = (type: string) => {
        switch (type) {
            case 'project': return 'bg-blue-50 text-blue-600'
            case 'contract': return 'bg-purple-50 text-purple-600'
            case 'payment': return 'bg-emerald-50 text-emerald-600'
            case 'document': return 'bg-amber-50 text-amber-600'
            default: return 'bg-slate-50 text-slate-600'
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search projects, contracts, payments, documents..."
                        className="flex-1 outline-none text-slate-900 placeholder-slate-400"
                        autoFocus
                    />
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                    >
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            {query ? 'No results found' : 'Start typing to search...'}
                        </div>
                    ) : (
                        <div className="py-2">
                            {results.map((result, index) => (
                                <button
                                    key={`${result.type}-${result.id}`}
                                    onClick={() => handleNavigate(result)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${index === selectedIndex ? 'bg-slate-50' : ''
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${getIconColor(result.type)}`}>
                                        {getIcon(result.type)}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="font-medium text-slate-900">{result.title}</div>
                                        <div className="text-sm text-slate-500">{result.subtitle}</div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-xs">↑</kbd>
                            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-xs">↓</kbd>
                            to navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-xs">↵</kbd>
                            to select
                        </span>
                    </div>
                    <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-xs">esc</kbd>
                        to close
                    </span>
                </div>
            </div>
        </div>
    )
}
