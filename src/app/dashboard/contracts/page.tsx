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
    Trash2,
    MoreVertical,
    Edit,
    Eye,
    Home,
    Hammer,
    HardHat
} from 'lucide-react'
import jsPDF from 'jspdf'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { EmailContractModal } from '@/components/contracts/EmailContractModal'
import { useRouter } from 'next/navigation'

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
    const router = useRouter()

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
            case 'Draft': return '#ADB5BD' // Gray
            case 'Pending': return '#F5A623' // Orange/Yellow
            case 'Signed': return '#28A745' // Green
            case 'Needs Attention': return '#DC3545' // Red
            default: return '#4A90E2' // Blue
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
        doc.setFontSize(14)
        doc.text('Project Details', 20, 65)
        doc.setFontSize(10)
        doc.text(`Project: ${project?.name || 'N/A'}`, 20, 75)
        doc.text(`Client: ${project?.client_name || 'N/A'}`, 20, 80)

        doc.save(`contract-${contract.id.slice(0, 8)}.pdf`)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this contract?')) return

        try {
            const { error } = await supabase
                .from('contracts')
                .delete()
                .eq('id', id)

            if (error) throw error
            fetchContracts()
        } catch (error) {
            console.error('Error deleting contract:', error)
        }
    }

    const filteredContracts = contracts.filter(contract => {
        const project = Array.isArray(contract.projects) ? contract.projects[0] : contract.projects
        const matchesSearch =
            project?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project?.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contract.id.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'All' || contract.status === statusFilter
        return matchesSearch && matchesStatus
    })

    // Calculate stats
    const stats = {
        drafts: contracts.filter(c => c.status === 'Draft').length,
        pending: contracts.filter(c => c.status === 'Pending').length,
        signed: contracts.filter(c => c.status === 'Signed').length,
        total: contracts.length
    }

    return (
        <div className="w-full font-poppins">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Page Heading */}
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <h1 className="text-gray-900 text-3xl font-bold tracking-tight">Contracts</h1>
                        <Link href="/dashboard/contracts/new" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#4A90E2] text-white text-base font-semibold shadow-md hover:bg-[#4A90E2]/90 transition-colors gap-2">
                            <Plus className="w-5 h-5" />
                            <span className="truncate">Create New Contract</span>
                        </Link>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-grow">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-12 bg-white border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-[#4A90E2]/20 focus-within:border-[#4A90E2]">
                                <div className="text-gray-400 flex items-center justify-center pl-4">
                                    <Search className="w-5 h-5" />
                                </div>
                                <input
                                    className="flex w-full min-w-0 flex-1 border-none bg-transparent h-full placeholder:text-gray-400 px-4 pl-2 text-base focus:ring-0 focus:outline-none"
                                    placeholder="Search by contract name or client..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {['All', 'Draft', 'Pending', 'Signed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 border transition-colors ${statusFilter === status
                                        ? 'bg-[#4A90E2]/10 text-[#4A90E2] border-transparent'
                                        : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    <p className="text-sm font-medium">{status === 'All' ? 'All' : status}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Section Header */}
                    <h2 className="text-gray-800 text-xl font-semibold tracking-tight pt-2">Recent Contracts</h2>

                    {/* Contract List */}
                    <div className="flex flex-col gap-4">
                        {loading ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90E2] mx-auto"></div>
                                <p className="mt-4 text-gray-500">Loading contracts...</p>
                            </div>
                        ) : filteredContracts.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                                <FileText className="mx-auto h-12 w-12 text-gray-300" />
                                <h3 className="mt-2 text-sm font-semibold text-gray-900">No contracts found</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by creating a new contract.</p>
                            </div>
                        ) : (
                            filteredContracts.map((contract) => {
                                const project = Array.isArray(contract.projects) ? contract.projects[0] : contract.projects
                                const statusColor = getStatusColor(contract.status)

                                return (
                                    <div key={contract.id} className="cursor-pointer group flex flex-col md:flex-row items-start md:items-center gap-4 p-5 rounded-xl bg-white border border-gray-200 hover:shadow-md hover:border-[#4A90E2]/30 transition-all">
                                        <div className="flex-grow" onClick={() => router.push(`/dashboard/contracts/${contract.id}`)}>
                                            <h3 className="font-semibold text-base text-gray-900 group-hover:text-[#4A90E2] transition-colors">
                                                {project?.name || 'Untitled Contract'}
                                            </h3>
                                            <p className="text-sm text-gray-500">Client: {project?.client_name || 'Unknown Client'}</p>
                                        </div>
                                        <div className="flex items-center gap-2 min-w-[140px]">
                                            <div className="size-2.5 rounded-full" style={{ backgroundColor: statusColor }}></div>
                                            <span className="text-sm font-medium" style={{ color: statusColor }}>{contract.status}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 w-full md:w-auto text-left min-w-[160px]">
                                            {new Date(contract.created_at).toLocaleDateString()}
                                        </p>
                                        <div className="flex items-center gap-1 self-end md:self-center">
                                            <button onClick={() => router.push(`/dashboard/contracts/${contract.id}`)} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDownload(contract)} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                                                <Download className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(contract.id)} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="flex flex-col gap-6">
                    {/* Templates Module */}
                    <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start from a Template</h3>
                        <div className="flex flex-col gap-2">
                            <Link href="/dashboard/contracts/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                                <div className="flex items-center justify-center size-10 rounded-lg bg-[#4A90E2]/10 text-[#4A90E2] group-hover:bg-[#4A90E2] group-hover:text-white transition-colors">
                                    <Home className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-sm text-gray-700">Standard Residential Contract</span>
                            </Link>
                            <Link href="/dashboard/contracts/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                                <div className="flex items-center justify-center size-10 rounded-lg bg-[#F5A623]/10 text-[#F5A623] group-hover:bg-[#F5A623] group-hover:text-white transition-colors">
                                    <Hammer className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-sm text-gray-700">Renovation Agreement</span>
                            </Link>
                            <Link href="/dashboard/contracts/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                                <div className="flex items-center justify-center size-10 rounded-lg bg-gray-500/10 text-gray-600 group-hover:bg-gray-600 group-hover:text-white transition-colors">
                                    <HardHat className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-sm text-gray-700">Subcontractor Agreement</span>
                            </Link>
                        </div>
                    </div>

                    {/* Status Overview Module */}
                    <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-5">Contracts at a Glance</h3>
                        <div className="flex flex-col gap-5">
                            <div>
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="font-medium text-gray-600">Drafts</span>
                                    <span className="font-bold text-gray-900">{stats.drafts}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-[#ADB5BD] h-2 rounded-full" style={{ width: `${stats.total ? (stats.drafts / stats.total) * 100 : 0}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="font-medium text-gray-600">Pending</span>
                                    <span className="font-bold text-gray-900">{stats.pending}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-[#F5A623] h-2 rounded-full" style={{ width: `${stats.total ? (stats.pending / stats.total) * 100 : 0}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="font-medium text-gray-600">Signed</span>
                                    <span className="font-bold text-gray-900">{stats.signed}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-[#28A745] h-2 rounded-full" style={{ width: `${stats.total ? (stats.signed / stats.total) * 100 : 0}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedContract && (
                <EmailContractModal
                    isOpen={isEmailModalOpen}
                    onClose={() => setIsEmailModalOpen(false)}
                    contractId={selectedContract.id}
                    contractText={JSON.stringify(selectedContract.content || '')}
                />
            )}
        </div>
    )
}
