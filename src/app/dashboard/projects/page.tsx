'use client'

import { useState, useEffect } from 'react'
import {
    Search,
    Filter,
    Plus,
    Calendar,
    Building2,
    ArrowRight,
    DollarSign,
    Trash2
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

interface Project {
    id: string
    name: string
    client_name: string
    status: string
    progress: number
    end_date: string
    contract_value: number
    job_type: string
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('All Statuses')

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const fetchProjects = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setProjects(data || [])
        } catch (error) {
            console.error('Error fetching projects:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.client_name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'All Statuses' || project.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
            case 'On Hold': return 'bg-amber-100 text-amber-700 border-amber-200'
            case 'Completed': return 'bg-blue-100 text-blue-700 border-blue-200'
            default: return 'bg-slate-100 text-slate-700 border-slate-200'
        }
    }

    const handleDeleteProject = async (projectId: string) => {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return

        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId)

            if (error) throw error

            setProjects(projects.filter(p => p.id !== projectId))
        } catch (error) {
            console.error('Error deleting project:', error)
            alert('Failed to delete project')
        }
    }

    return (
        <div className="space-y-8">
            {/* ... (Header and Filters remain the same) ... */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Projects
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Manage your ongoing construction jobs and contracts
                    </p>
                </div>
                <Link href="/dashboard/projects/new">
                    <button className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transform hover:-translate-y-0.5">
                        <Plus className="w-5 h-5 mr-2" />
                        New Project
                    </button>
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by project or client..."
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
                        <option>All Statuses</option>
                        <option>Active</option>
                        <option>On Hold</option>
                        <option>Completed</option>
                    </select>
                </div>
            </div>

            {/* Projects Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-64 animate-pulse">
                            <div className="h-6 bg-slate-100 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-slate-100 rounded w-1/2 mb-8"></div>
                            <div className="space-y-3">
                                <div className="h-2 bg-slate-100 rounded w-full"></div>
                                <div className="h-2 bg-slate-100 rounded w-5/6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Building2 className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No projects found</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                        {projects.length === 0
                            ? "Get started by creating your first project to track contracts, risks, and progress."
                            : "We couldn't find any projects matching your search. Try adjusting your filters."}
                    </p>
                    {projects.length === 0 && (
                        <Link href="/dashboard/projects/new">
                            <button className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium transition-all shadow-lg shadow-slate-900/20">
                                <Plus className="w-5 h-5 mr-2" />
                                Create Project
                            </button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col relative"
                        >
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleDeleteProject(project.id)
                                }}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-10"
                                title="Delete Project"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                                    {project.status}
                                </span>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                                    {project.name}
                                </h3>
                                <p className="text-slate-500 text-sm font-medium">
                                    {project.client_name}
                                </p>
                            </div>

                            <div className="space-y-4 mb-6 flex-1">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium text-slate-500">
                                        <span>Progress</span>
                                        <span>{project.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${project.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                                                }`}
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="flex items-center text-sm text-slate-600">
                                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                        <span className="truncate">{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No date'}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-slate-600">
                                        <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                                        <span className="truncate">{project.contract_value ? `$${project.contract_value.toLocaleString()}` : '-'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs text-slate-400 font-medium">
                                    {project.job_type || 'Construction'}
                                </span>
                                <Link href={`/dashboard/projects/${project.id}`}>
                                    <button className="text-sm font-semibold text-slate-900 hover:text-blue-600 flex items-center transition-colors">
                                        Manage Project
                                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
