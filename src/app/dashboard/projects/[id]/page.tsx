'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import {
    Building2,
    Calendar,
    DollarSign,
    FileText,
    Upload,
    CreditCard,
    ArrowLeft,
    ExternalLink,
    CheckSquare
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { DocumentUpload } from '@/components/documents/DocumentUpload'
import { DocumentReviewModal } from '@/components/documents/DocumentReviewModal'
import { TaskBoard } from '@/components/tasks/TaskBoard'

interface Project {
    id: string
    name: string
    status: string
    client_name: string
    job_type: string
    progress: number
    start_date: string
    end_date: string
    contract_value: number
    address: string
    contracts: Record<string, unknown>[]
    documents: Record<string, unknown>[]
    payments: Record<string, unknown>[]
}

export default function ProjectDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const [activeTab, setActiveTab] = useState('overview')
    const [project, setProject] = useState<Project | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [reviewModalOpen, setReviewModalOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [extractedData, setExtractedData] = useState<any>(null)

    const supabase = createBrowserClient()

    const fetchProject = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select(`
                    *,
                    contracts (*),
                    documents (*),
                    payments (*)
                `)
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

    const handleAnalysisComplete = (data: any, file: File) => {
        setExtractedData(data)
        setSelectedFile(file)
        setReviewModalOpen(true)
    }

    const handleDocumentSuccess = () => {
        fetchProject() // Refresh project data to show new document and payment
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
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
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
                    <Link href={`/dashboard/projects/${id}/settings`}>
                        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors">
                            Settings
                        </button>
                    </Link>
                    <Link href={`/dashboard/contracts/new?projectId=${id}`}>
                        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium text-sm transition-colors">
                            Generate Contract
                        </button>
                    </Link>
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
                                <div className="space-y-6">
                                    {/* Completion Progress */}
                                    <div className="space-y-2">
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

                                    {/* Financial Progress */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium text-slate-600">
                                            <span>Budget Used</span>
                                            <span>
                                                {Math.round((project.payments?.reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0) / (project.contract_value || 1) * 100)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-1000",
                                                    (project.payments?.reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0) > (project.contract_value || 0)
                                                        ? "bg-red-500"
                                                        : "bg-emerald-500"
                                                )}
                                                style={{
                                                    width: `${Math.min(100, ((project.payments?.reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0) / (project.contract_value || 1) * 100))}%`
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                                            <span>Paid: ${project.payments?.reduce((sum, p) => sum + Number(p.amount || 0), 0).toLocaleString()}</span>
                                            <span>Total: ${project.contract_value?.toLocaleString()}</span>
                                        </div>
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
                                    <button
                                        onClick={() => router.push(`/dashboard/contracts/new?projectId=${id}`)}
                                        className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-sm font-medium text-slate-700"
                                    >
                                        <span className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-blue-600" />
                                            Create Contract
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('documents')}
                                        className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-sm transition-all text-sm font-medium text-slate-700"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Upload className="w-4 h-4 text-purple-600" />
                                            Upload Document
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('payments')}
                                        className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all text-sm font-medium text-slate-700"
                                    >
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
                    <div className="space-y-4">
                        {project.contracts && project.contracts.length > 0 ? (
                            <div className="grid gap-4">
                                {project.contracts.map((contract) => (
                                    <div key={String(contract.id)} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-slate-900">Contract {new Date(String(contract.created_at)).toLocaleDateString()}</h4>
                                                <p className="text-sm text-slate-500">{String(contract.status)}</p>
                                            </div>
                                        </div>
                                        <Link href={`/dashboard/contracts/${contract.id}`}>
                                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                                <ExternalLink className="w-4 h-4 text-slate-400" />
                                            </button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-900">No contracts yet</h3>
                                <p className="text-slate-500 mb-6">Generate a contract to get started.</p>
                                <Link href={`/dashboard/contracts/new?projectId=${id}`}>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors">
                                        Create Contract
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="space-y-6">
                        {/* Upload Section */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Upload New Document</h3>
                            <DocumentUpload
                                projectId={id}
                                onAnalysisComplete={handleAnalysisComplete}
                            />
                        </div>

                        {/* Documents List */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900">Uploaded Documents</h3>
                            {project.documents && project.documents.length > 0 ? (
                                <div className="grid gap-4">
                                    {project.documents.map((doc) => (
                                        <div key={String(doc.id)} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:shadow-sm transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                                    <Upload className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">
                                                        {String(doc.name || 'Untitled Document')}
                                                    </div>
                                                    <div className="text-xs text-slate-500 capitalize">
                                                        {String(doc.status || 'completed')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-slate-500">
                                                    {(Number(doc.size || 0) / 1024).toFixed(1)} KB
                                                </span>
                                                <span className="text-sm text-slate-500">
                                                    {new Date(String(doc.created_at)).toLocaleDateString()}
                                                </span>
                                                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                    <p className="text-slate-500">No documents uploaded yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'payments' && (
                    <div className="space-y-4">
                        {project.payments && project.payments.length > 0 ? (
                            <div className="grid gap-4">
                                {project.payments.map((payment) => (
                                    <div key={String(payment.id)} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                                <DollarSign className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-slate-900">${Number(payment.amount || 0).toLocaleString()}</h4>
                                                <p className="text-sm text-slate-500">{String(payment.status)} • {new Date(String(payment.payment_date)).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
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
                )}

                {activeTab === 'tasks' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <TaskBoard projectId={id} />
                    </div>
                )}
            </div>

            <DocumentReviewModal
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                projectId={id}
                file={selectedFile}
                extractedData={extractedData}
                onSuccess={handleDocumentSuccess}
            />
        </div>
    )
}
