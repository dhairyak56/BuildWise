'use client'

import { useState } from 'react'
import { ArrowLeft, Calendar, DollarSign, MapPin, User, FileText, Edit, CreditCard, ChevronRight, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { EditProjectModal } from '@/components/projects/EditProjectModal'
import PaymentsTab from '@/components/payments/PaymentsTab'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

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
    const [activeTab, setActiveTab] = useState<'overview' | 'payments'>('overview')

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FileText },
        { id: 'payments', label: 'Payments', icon: CreditCard },
    ]

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto font-poppins">
            {/* Refined Header */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-start space-x-5">
                        <Link
                            href="/dashboard/projects"
                            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-slate-900 border border-slate-100"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                    {project.name}
                                </h1>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-xs font-semibold border",
                                    project.status === 'Active' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                    project.status === 'On Hold' && "bg-amber-50 text-amber-700 border-amber-200",
                                    project.status === 'Completed' && "bg-blue-50 text-blue-700 border-blue-200",
                                    project.status === 'Planning' && "bg-purple-50 text-purple-700 border-purple-200"
                                )}>
                                    {project.status}
                                </span>
                            </div>
                            <div className="flex items-center text-slate-500 text-sm space-x-4">
                                <span className="flex items-center">
                                    <User className="w-4 h-4 mr-1.5 text-slate-400" />
                                    {project.client_name}
                                </span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                                    {project.address}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium text-sm transition-colors flex items-center shadow-sm"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Details
                        </button>
                        <button className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Refined Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300 group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Budget</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">${project.contract_value?.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">Total contract value</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300 group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                            <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Timeline</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                        {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        to {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'TBD'}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300 group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                            <FileText className="w-6 h-6 text-amber-600" />
                        </div>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Contract</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{contract?.status || 'Not Generated'}</p>
                    <Link href={`/dashboard/projects/${project.id}/contract`} className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1 inline-flex items-center">
                        View Contract <ChevronRight className="w-3 h-3 ml-1" />
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300 group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                            <div className="w-6 h-6 flex items-center justify-center font-bold text-emerald-600 text-sm">
                                {project.progress}%
                            </div>
                        </div>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Progress</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                        <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${project.progress || 0}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-slate-500">Overall completion</p>
                </motion.div>
            </div>

            {/* Animated Tabs */}
            <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-xl w-fit border border-slate-200/50">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "relative px-6 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200",
                            activeTab === tab.id ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/50"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center">
                            <tab.icon className="w-4 h-4 mr-2" />
                            {tab.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'overview' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Project Details */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                                    <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                                        <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                                        Project Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Site Address</label>
                                                <div className="flex items-start mt-2 text-slate-900 font-medium">
                                                    <MapPin className="w-5 h-5 mr-2 text-slate-400 shrink-0 mt-0.5" />
                                                    {project.address}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Type</label>
                                                <p className="mt-2 text-slate-900 font-medium">{project.job_type}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Payment Type</label>
                                                <p className="mt-2 text-slate-900 font-medium">{project.payment_type || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scope of Work</label>
                                                <p className="mt-2 text-slate-700 leading-relaxed text-sm">{project.scope || 'No scope defined'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                    <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
                                    <div className="space-y-3">
                                        <Link href={`/dashboard/projects/${project.id}/contract`}>
                                            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-all group">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-white rounded-lg border border-slate-100 group-hover:border-blue-100 mr-3">
                                                        <FileText className="w-4 h-4 text-slate-500 group-hover:text-blue-500" />
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">
                                                        View Contract
                                                    </span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </Link>
                                        <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-all group">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-white rounded-lg border border-slate-100 group-hover:border-blue-100 mr-3">
                                                    <Edit className="w-4 h-4 text-slate-500 group-hover:text-blue-500" />
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">
                                                    Generate Variation
                                                </span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-[#4A90E2] to-[#357ABD] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                    <h3 className="text-lg font-bold mb-2 relative z-10">Need Help?</h3>
                                    <p className="text-blue-50 text-sm mb-6 relative z-10">
                                        Contact support for assistance with your project setup or contract details.
                                    </p>
                                    <button className="w-full py-2.5 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm relative z-10">
                                        Contact Support
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <PaymentsTab projectId={project.id} contractValue={project.contract_value} />
                    )}
                </motion.div>
            </AnimatePresence>

            <EditProjectModal
                project={project}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={setProject}
            />
        </div>
    )
}
