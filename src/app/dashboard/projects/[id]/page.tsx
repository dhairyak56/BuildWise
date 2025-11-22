'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import {
    Building2,
    Calendar,
    DollarSign,
    FileText,
    Upload,
    CreditCard,
    ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function ProjectDetailsPage() {
    const params = useParams()
    const id = params.id as string
    const [activeTab, setActiveTab] = useState('overview')
    const [project, setProject] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isLoading, setIsLoading] = useState(true)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const fetchProject = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', params.id)
                .single()

            if (error) throw error
            setProject(data)
        } catch (error) {
            console.error('Error fetching project:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProject()
    }, [params.id]) // eslint-disable-line react-hooks/exhaustive-deps

    if (isLoading) return <div className="p-8 text-center">Loading project details...</div>
    if (!project) return <div className="p-8 text-center">Project not found</div>

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Building2 },
        { id: 'contracts', label: 'Contracts', icon: FileText },
        { id: 'documents', label: 'Documents', icon: Upload },
        { id: 'payments', label: 'Payments', icon: CreditCard },
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/projects">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-500" />
                        </button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
                            <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                project.status === 'Active' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                    project.status === 'Completed' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                        "bg-slate-50 text-slate-700 border-slate-200"
                            )}>
                                {project.status}
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {project.client_name} • {project.job_type || 'Construction'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors">
                        Edit Project
                    </button>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium text-sm transition-colors">
                        Generate Contract
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all",
                                activeTab === tab.id
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            )}
                        >
                            <tab.icon className={cn(
                                "mr-2 h-5 w-5",
                                activeTab === tab.id ? "text-blue-600" : "text-slate-400 group-hover:text-slate-500"
                            )} />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Progress</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm font-medium text-slate-600">
                                        <span>Completion</span>
                                        <span>{project.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Details</h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500">Start Date</dt>
                                        <dd className="mt-1 text-sm text-slate-900 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500">End Date</dt>
                                        <dd className="mt-1 text-sm text-slate-900 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500">Contract Value</dt>
                                        <dd className="mt-1 text-sm text-slate-900 flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-slate-400" />
                                            {project.contract_value ? `$${project.contract_value.toLocaleString()}` : 'Not set'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500">Location</dt>
                                        <dd className="mt-1 text-sm text-slate-900 flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-slate-400" />
                                            {project.address || 'No address provided'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-sm font-medium text-slate-700">
                                        <span className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-blue-600" />
                                            Create Contract
                                        </span>
                                    </button>
                                    <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-sm transition-all text-sm font-medium text-slate-700">
                                        <span className="flex items-center gap-2">
                                            <Upload className="w-4 h-4 text-purple-600" />
                                            Upload Document
                                        </span>
                                    </button>
                                    <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all text-sm font-medium text-slate-700">
                                        <span className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-emerald-600" />
                                            Record Payment
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'contracts' && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No contracts yet</h3>
                        <p className="text-slate-500 mb-6">Generate a contract to get started.</p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors">
                            Create Contract
                        </button>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No documents uploaded</h3>
                        <p className="text-slate-500 mb-6">Upload plans, permits, or other files.</p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors">
                            Upload File
                        </button>
                    </div>
                )}

                {activeTab === 'payments' && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No payments recorded</h3>
                        <p className="text-slate-500 mb-6">Track payments and invoices here.</p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors">
                            Add Payment
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
