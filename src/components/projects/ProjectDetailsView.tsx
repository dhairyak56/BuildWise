'use client'

import { useState } from 'react'
import { ArrowLeft, Calendar, DollarSign, MapPin, User, FileText, Edit } from 'lucide-react'
import Link from 'next/link'
import { EditProjectModal } from '@/components/projects/EditProjectModal'

interface Project {
    id: string
    name: string
    client_name: string
    address: string
    job_type: string
    scope: string
    contract_value: number
    start_date: string | null
    end_date: string | null
    status: string
    progress: number
    payment_type?: string
}

interface Contract {
    status: string
}

interface ProjectDetailsViewProps {
    initialProject: Project
    contract: Contract | null
}

export function ProjectDetailsView({ initialProject, contract }: ProjectDetailsViewProps) {
    const [project, setProject] = useState(initialProject)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/dashboard/projects"
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {project.name}
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Project Details
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${project.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : project.status === 'On Hold'
                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                        {project.status}
                    </span>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors shadow-sm flex items-center"
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Project
                    </button>
                </div>
            </div>

            {/* Project Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-500">Client</h3>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{project.client_name}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-500">Contract Value</h3>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">${project.contract_value?.toLocaleString()}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-500">Timeline</h3>
                    </div>
                    <p className="text-sm text-slate-700">
                        {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'} - {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'TBD'}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <FileText className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-500">Contract</h3>
                    </div>
                    <p className="text-sm font-medium text-slate-900">{contract?.status || 'Not Generated'}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Project Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Project Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-500">Site Address</label>
                                <div className="flex items-center mt-1 text-slate-900">
                                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                    {project.address}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-500">Job Type</label>
                                <p className="mt-1 text-slate-900">{project.job_type}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-500">Scope of Work</label>
                                <p className="mt-1 text-slate-700">{project.scope || 'No scope defined'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-500">Payment Type</label>
                                <p className="mt-1 text-slate-900">{project.payment_type || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Progress</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                                    <span className="text-sm font-semibold text-slate-900">{project.progress || 0}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3">
                                    <div
                                        className="bg-blue-600 h-3 rounded-full transition-all"
                                        style={{ width: `${project.progress || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link href={`/dashboard/projects/${project.id}/contract`}>
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                                        View Contract
                                    </span>
                                    <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                                </button>
                            </Link>
                            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                                    Generate Variation
                                </span>
                                <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg">
                        <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
                        <p className="text-slate-300 text-sm mb-4">
                            Contact support for assistance with your project.
                        </p>
                        <button className="w-full py-2 bg-white text-slate-900 rounded-lg font-medium text-sm hover:bg-slate-100 transition-colors">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>

            <EditProjectModal
                project={project}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={setProject}
            />
        </div>
    )
}
