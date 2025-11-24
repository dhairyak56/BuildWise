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
    Trash2,
    CheckSquare,
    Square
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
    const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())

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

            fetchProjects()
        } catch (error) {
            console.error('Error deleting project:', error)
            alert('Failed to delete project')
        }
    }

    const toggleProjectSelection = (projectId: string) => {
        const newSelected = new Set(selectedProjects)
        if (newSelected.has(projectId)) {
            newSelected.delete(projectId)
        } else {
            newSelected.add(projectId)
        }
        setSelectedProjects(newSelected)
    }

    const handleBulkDelete = async () => {
        if (selectedProjects.size === 0) return
        if (!confirm(`Are you sure you want to delete ${selectedProjects.size} project(s)? This action cannot be undone.`)) return

        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .in('id', Array.from(selectedProjects))

            if (error) throw error

            setSelectedProjects(new Set())
            fetchProjects()
        } catch (error) {
            console.error('Error deleting projects:', error)
            alert('Failed to delete projects')
        }
    }

    const handleBulkStatusUpdate = async (newStatus: string) => {
        if (selectedProjects.size === 0) return

        try {
            const { error } = await supabase
                .from('projects')
                .update({ status: newStatus })
                .in('id', Array.from(selectedProjects))

            if (error) throw error

            setSelectedProjects(new Set())
            fetchProjects()
        } catch (error) {
            console.error('Error updating projects:', error)
            alert('Failed to update projects')
        }
    }

    return (
        <div className="space-y-8 font-poppins">
            {/* ... (Header and Filters remain the same) ... */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Projects
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage your ongoing construction jobs and contracts
                    </p>
                </div>
                <Link href="/dashboard/projects/new">
                    <button className="inline-flex items-center justify-center px-5 py-2.5 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 font-bold transition-all shadow-md transform hover:-translate-y-0.5">
                        <Plus className="w-5 h-5 mr-2" />
                        New Project
                    </button>
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border-none focus:ring-0 bg-transparent text-gray-900 placeholder-gray-400"
                    />
                </div>
                <div className="h-px sm:h-auto sm:w-px bg-gray-200 mx-2" />
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-10 pr-8 py-3 rounded-lg border-none focus:ring-0 bg-transparent text-gray-700 font-medium cursor-pointer hover:bg-gray-50 transition-colors appearance-none"
                    >
                        <option>All Statuses</option>
                        <option>Active</option>
                        <option>On Hold</option>
                        <option>Completed</option>
                        <option>Planning</option>
                    </select>
                </div>
            </div>

            {/* Bulk Actions Toolbar */}
            {selectedProjects.size > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between animate-in slide-in-from-top duration-200">
                    <div className="flex items-center gap-3">
                        <CheckSquare className="w-5 h-5 text-[#4A90E2]" />
                        <span className="font-medium text-blue-900">
                            {selectedProjects.size} project{selectedProjects.size > 1 ? 's' : ''} selected
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            onChange={(e) => {
                                if (e.target.value) {
                                    handleBulkStatusUpdate(e.target.value)
                                    e.target.value = ''
                                }
                            }}
                            className="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm font-medium text-blue-900 hover:bg-blue-50 transition-colors"
                        >
                            <option value="">Change Status...</option>
                            <option value="Active">Active</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Completed">Completed</option>
                            <option value="Planning">Planning</option>
                        </select>
                        <button
                            onClick={handleBulkDelete}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Selected
                        </button>
                        <button
                            onClick={() => setSelectedProjects(new Set())}
                            className="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm font-medium text-blue-900 hover:bg-blue-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            {/* Projects Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm h-64 animate-pulse">
                            <div className="h-6 bg-gray-100 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/2 mb-8"></div>
                            <div className="space-y-3">
                                <div className="h-2 bg-gray-100 rounded w-full"></div>
                                <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Building2 className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        {projects.length === 0
                            ? "Get started by creating your first project to track contracts, risks, and progress."
                            : "We couldn't find any projects matching your search. Try adjusting your filters."}
                    </p>
                    {projects.length === 0 && (
                        <Link href="/dashboard/projects/new">
                            <button className="inline-flex items-center px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 font-bold transition-all shadow-md">
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
                            className={`group bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col relative ${selectedProjects.has(project.id) ? 'border-[#4A90E2] ring-2 ring-blue-100' : 'border-gray-200 hover:border-[#4A90E2]/30'
                                }`}
                        >
                            {/* Checkbox for bulk selection - Top Right */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    toggleProjectSelection(project.id)
                                }}
                                className="absolute top-3 right-3 z-10 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                {selectedProjects.has(project.id) ? (
                                    <CheckSquare className="w-5 h-5 text-[#4A90E2]" />
                                ) : (
                                    <Square className="w-5 h-5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </button>

                            {/* Delete button - moved down slightly */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleDeleteProject(project.id)
                                }}
                                className="absolute top-12 right-3 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-10"
                                title="Delete Project"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className={`flex justify-between items-start mb-4 transition-all ${selectedProjects.has(project.id) ? 'pr-10' : 'group-hover:pr-10'}`}>
                                <div className="p-3 bg-blue-50 text-[#4A90E2] rounded-xl group-hover:bg-[#4A90E2] group-hover:text-white transition-colors duration-300">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                                    {project.status}
                                </span>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#4A90E2] transition-colors">
                                    {project.name}
                                </h3>
                                <p className="text-gray-500 text-sm font-medium">
                                    {project.client_name}
                                </p>
                            </div>

                            <div className="space-y-4 mb-6 flex-1">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium text-gray-500">
                                        <span>Progress</span>
                                        <span>{project.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${project.progress === 100 ? 'bg-emerald-500' : 'bg-[#4A90E2]'
                                                }`}
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="truncate">{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No date'}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="truncate">{project.contract_value ? `$${project.contract_value.toLocaleString()}` : '-'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-xs text-gray-400 font-medium">
                                    {project.job_type || 'Construction'}
                                </span>
                                <Link href={`/dashboard/projects/${project.id}`}>
                                    <button className="text-sm font-semibold text-gray-900 hover:text-[#4A90E2] flex items-center transition-colors">
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
