'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
    FileText,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Download,
    Eye,
    Calendar,
    CheckCircle2,
    Clock,
    Mail
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { EmailContractModal } from '@/components/contracts/EmailContractModal'

export default function ContractsPage() {
    const [contracts, setContracts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedContract, setSelectedContract] = useState<any>(null)
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const fetchContracts = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('contracts')
                .select(`
                    *,
                    projects (name, client_name)
                `)
                .eq('projects.user_id', user.id)
                .order('created_at', { ascending: false })

            if (data) setContracts(data)
            setLoading(false)
        }

        fetchContracts()
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Signed': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
            case 'Sent': return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'Draft': return 'bg-amber-100 text-amber-700 border-amber-200'
            default: return 'bg-slate-100 text-slate-700 border-slate-200'
        }
    }

    const handleEmailClick = (contract: any) => {
        setSelectedContract(contract)
        setIsEmailModalOpen(true)
    }

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
                    <select className="w-full pl-10 pr-8 py-3 rounded-xl border-none focus:ring-0 bg-transparent text-slate-700 font-medium cursor-pointer hover:bg-slate-50 transition-colors appearance-none">
                        <option>All Statuses</option>
                        <option>Draft</option>
                        <option>Sent</option>
                        <option>Signed</option>
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
                            {contracts.map((contract) => (
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
                                        <div className="text-sm text-slate-900 font-medium">{contract.projects?.name}</div>
                                        <div className="text-xs text-slate-500">{contract.projects?.client_name}</div>
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
                                            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all" title="Download">
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <EmailContractModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                contractId={selectedContract?.id}
                contractText={selectedContract?.content} // Assuming content is available
            />
        </div>
    )
}
