'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import {
    FileText,
    Plus,
    Search,
    Filter,
    Download,
    Calendar,
    Mail,
    Trash2
} from 'lucide-react'
import jsPDF from 'jspdf'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { EmailContractModal } from '@/components/contracts/EmailContractModal'

interface Contract {
    id: string
    created_at: string
    status: string
    content: Record<string, unknown>
    projects: {
        name: string
        client_name: string
    } | {
        name: string
        client_name: string
    }[]
}

export default function ContractsPage() {
    const [contracts, setContracts] = useState<Contract[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

    const supabase = createBrowserClient()

    const fetchContracts = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('contracts')
                .select(`
                    id,
                    created_at,
                    status,
                    content,
                    projects (
                        name,
                        client_name
                    )
                `)
                .order('created_at', { ascending: false })

            if (error) throw error
            setContracts(data || [])
        } catch (error) {
            console.error('Error fetching contracts:', error)
        } finally {
            setLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        fetchContracts()
    }, [fetchContracts])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Draft': return 'bg-slate-100 text-slate-700'
            case 'Pending': return 'bg-amber-50 text-amber-700'
            case 'Signed': return 'bg-emerald-50 text-emerald-700'
            default: return 'bg-slate-100 text-slate-700'
        }
    }

    const handleEmailClick = (contract: Contract) => {
        setSelectedContract(contract)
        setIsEmailModalOpen(true)
    }

    const handleDownload = (contract: Contract) => {
        const doc = new jsPDF()
        const project = Array.isArray(contract.projects) ? contract.projects[0] : contract.projects

        // Header
        doc.setFontSize(20)
        doc.text('CONTRACT', 105, 20, { align: 'center' })

        doc.setFontSize(10)
        doc.text('BuildWise Construction', 20, 35)
        doc.text(`Contract ID: ${contract.id.slice(0, 8).toUpperCase()}`, 20, 40)
        doc.text(`Date: ${new Date(contract.created_at).toLocaleDateString()}`, 20, 45)
        doc.text(`Status: ${contract.status}`, 20, 50)

        // Project Details
        doc.setFontSize(12)
        doc.text('Project Details:', 20, 65)
        doc.setFontSize(10)
        doc.text(`Project: ${project?.name || 'N/A'}`, 20, 72)
        doc.text(`Client: ${project?.client_name || 'N/A'}`, 20, 77)

        // Contract Content
        doc.setFontSize(12)
        doc.text('Contract Terms:', 20, 92)
        doc.setFontSize(10)

        const content = (typeof contract.content === 'object' && contract.content && 'text' in contract.content && typeof contract.content.text === 'string')
            ? contract.content.text
            : typeof contract.content === 'string'
                ? contract.content
                : 'No content available'

        const lines = doc.splitTextToSize(content, 170)
        doc.text(lines, 20, 100)

        doc.save(`contract-${contract.id.slice(0, 8)}.pdf`)
    }

    const handleDelete = async (contractId: string) => {
        if (!confirm('Are you sure you want to delete this contract? This action cannot be undone.')) return

        try {
            const { error } = await supabase
                .from('contracts')
                .delete()
                .eq('id', contractId)

            if (error) throw error

            fetchContracts()
        } catch (error) {
            console.error('Error deleting contract:', error)
            alert('Failed to delete contract')
        }
    }

    const filteredContracts = contracts.filter((contract) => {
        const project = Array.isArray(contract.projects) ? contract.projects[0] : contract.projects
        const matchesSearch = searchQuery === '' ||
            project?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project?.client_name?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'All' || contract.status === statusFilter

        return matchesSearch && matchesStatus
    })

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Contracts
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Manage and track your legal agreements
                    </p>
                </div>
                <Link href="/dashboard/contracts/new">
                    <button className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transform hover:-translate-y-0.5">
                        <Plus className="w-5 h-5 mr-2" />
                        New Contract
                    </button>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search contracts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-none focus:ring-0 bg-transparent text-slate-900 placeholder-slate-400"
                    />
                </div>
                <div className="h-px sm:h-auto sm:w-px bg-slate-200 mx-2" />
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-10 pr-8 py-3 rounded-xl border-none focus:ring-0 bg-transparent text-slate-700 font-medium cursor-pointer hover:bg-slate-50 transition-colors appearance-none"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Draft">Draft</option>
                        <option value="Pending">Pending</option>
                        <option value="Signed">Signed</option>
                    </select>
                </div>
            </div>

            {/* Contracts List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : contracts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No contracts yet</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                        Create your first contract to start tracking agreements with your clients.
                    </p>
                    <Link href="/dashboard/contracts/new">
                        <button className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium transition-all shadow-lg shadow-slate-900/20">
                            <Plus className="w-5 h-5 mr-2" />
                            Create Contract
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contract Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Created</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredContracts.map((contract) => {
                                const project = Array.isArray(contract.projects) ? contract.projects[0] : contract.projects
                                return (
                                    <tr key={contract.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-blue-50 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors">
                                                    <FileText className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <span className="font-medium text-slate-900">Contract #{contract.id.slice(0, 8)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-900 font-medium">{project?.name || 'Untitled Project'}</div>
                                            <div className="text-xs text-slate-500">{project?.client_name || 'Unknown Client'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", getStatusColor(contract.status))}>
                                                {contract.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            <div className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1.5 text-slate-400" />
                                                {new Date(contract.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEmailClick(contract)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Email"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(contract)}
                                                    className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                    title="Download"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(contract.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <EmailContractModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                contractId={selectedContract?.id}
                contractText={JSON.stringify(selectedContract?.content || '')}
            />
        </div>
    )
}
