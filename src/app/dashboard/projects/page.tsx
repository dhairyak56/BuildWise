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
    Square,
    MoreVertical
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

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
            case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
            case 'On Hold': return 'bg-amber-50 text-amber-700 border-amber-200'
            case 'Completed': return 'bg-blue-50 text-blue-700 border-blue-200'
            case 'Planning': return 'bg-purple-50 text-purple-700 border-purple-200'
            default: return 'bg-slate-50 text-slate-700 border-slate-200'
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

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="space-y-8 font-poppins max-w-[1600px] mx-auto p-6">
            {/* Header Section */}
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
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-[#4A90E2] text-white rounded-xl hover:bg-[#357ABD] font-semibold transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        New Project
                    </motion.button>
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search projects by name or client..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-none focus:ring-0 bg-transparent text-gray-900 placeholder-gray-400 text-sm"
                    />
                </div>
                <div className="h-px sm:h-auto sm:w-px bg-gray-100 mx-2" />
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-10 pr-8 py-3 rounded-xl border-none focus:ring-0 bg-transparent text-gray-700 font-medium cursor-pointer hover:bg-gray-50 transition-colors appearance-none text-sm"
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
            <AnimatePresence>
                {selectedProjects.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <CheckSquare className="w-5 h-5 text-[#4A90E2]" />
                            </div>
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
                                className="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm font-medium text-blue-900 hover:bg-blue-50 transition-colors focus:ring-2 focus:ring-blue-200 outline-none"
                            >
                                <option value="">Change Status...</option>
                                <option value="Active">Active</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Completed">Completed</option>
                                <option value="Planning">Planning</option>
                            </select>
                            <button
                                onClick={handleBulkDelete}
                                className="px-3 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                            <button
                                onClick={() => setSelectedProjects(new Set())}
                                className="px-3 py-2 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Projects Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-[280px] animate-pulse">
                            <div className="flex justify-between mb-6">
                                <div className="h-10 w-10 bg-gray-100 rounded-xl"></div>
                                <div className="h-6 w-20 bg-gray-100 rounded-full"></div>
                            </div>
                            <div className="h-6 bg-gray-100 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/2 mb-8"></div>
                            <div className="space-y-3 mt-auto">
                                <div className="h-2 bg-gray-100 rounded w-full"></div>
                                <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredProjects.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center"
                >
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Building2 className="w-10 h-10 text-[#4A90E2]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        {projects.length === 0
                            ? "Get started by creating your first project to track contracts, risks, and progress."
                            : "We couldn't find any projects matching your search. Try adjusting your filters."}
                    </p>
                    {projects.length === 0 && (
                        <Link href="/dashboard/projects/new">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center px-6 py-3 bg-[#4A90E2] text-white rounded-xl hover:bg-[#357ABD] font-bold transition-all shadow-lg shadow-blue-500/20"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create Project
                            </motion.button>
                        </Link>
                    )}
                </motion.div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            variants={item}
                            className={`group bg-white rounded-2xl border p-6 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col relative ${selectedProjects.has(project.id)
                                    ? 'border-[#4A90E2] ring-1 ring-[#4A90E2]'
                                    : 'border-gray-100 hover:border-blue-100'
                                }`}
                        >
                            {/* Checkbox for bulk selection */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    toggleProjectSelection(project.id)
                                }}
                                className="absolute top-4 right-4 z-10 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {selectedProjects.has(project.id) ? (
                                    <CheckSquare className="w-5 h-5 text-[#4A90E2]" />
                                ) : (
                                    <Square className="w-5 h-5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </button>

                            {/* Delete button */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleDeleteProject(project.id)
                                }}
                                className="absolute top-14 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-10"
                                title="Delete Project"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3.5 bg-blue-50 text-[#4A90E2] rounded-2xl group-hover:bg-[#4A90E2] group-hover:text-white transition-colors duration-300 shadow-sm">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                                    {project.status}
                                </span>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#4A90E2] transition-colors line-clamp-1">
                                    {project.name}
                                </h3>
                                <p className="text-gray-500 text-sm font-medium line-clamp-1">
                                    {project.client_name}
                                </p>
                            </div>

                            <div className="space-y-5 mb-6 flex-1">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium text-gray-500">
                                        <span>Progress</span>
                                        <span>{project.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${project.progress}%` }}
                                            transition={{ duration: 1, delay: 0.2 }}
                                            className={`h-full rounded-full ${project.progress === 100 ? 'bg-emerald-500' : 'bg-[#4A90E2]'
                                                }`}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                                    <div className="flex items-center text-sm text-gray-600 mt-3">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="truncate font-medium">
                                            {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No date'}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 mt-3">
                                        <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="truncate font-medium">
                                            {project.contract_value ? `$${project.contract_value.toLocaleString()}` : '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Link href={`/dashboard/projects/${project.id}`} className="mt-auto">
                                <button className="w-full py-2.5 rounded-xl bg-gray-50 text-gray-900 font-semibold text-sm hover:bg-[#4A90E2] hover:text-white transition-all duration-300 flex items-center justify-center group/btn">
                                    Manage Project
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    )
}
