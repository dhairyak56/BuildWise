

import {
    Search,
    Filter,
    MoreVertical,
    Plus,
    Calendar,
    Building2
} from 'lucide-react'
import { createClient } from '@/lib/supabase-server'

import Link from 'next/link'

async function getProjects() {
    const supabase = createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    // Middleware will handle redirect if no user
    if (!user || userError) {
        return []
    }

    const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching projects:', error)
        return []
    }

    return projects || []
}

export default async function ProjectsPage() {
    const projects = await getProjects()

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Projects
                    </h1>
                    <p className="text-slate-500">
                        Manage and monitor all your ongoing construction projects
                    </p>
                </div>
                <button className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium text-sm transition-colors shadow-lg shadow-slate-900/20">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-slate-50 focus:bg-white"
                    />
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors">
                        <Filter className="w-4 h-4 mr-2 text-slate-500" />
                        Filter
                    </button>
                    <select className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white hover:bg-slate-50 font-medium text-sm transition-colors outline-none focus:border-blue-500">
                        <option>All Statuses</option>
                        <option>Active</option>
                        <option>On Hold</option>
                        <option>Completed</option>
                    </select>
                </div>
            </div>

            {/* Projects Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Project Name
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Progress
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Due Date
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Budget
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Building2 className="w-12 h-12 text-slate-300 mb-4" />
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects yet</h3>
                                            <p className="text-slate-500 mb-6">Get started by creating your first project</p>
                                            <Link href="/dashboard/projects/new">
                                                <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium text-sm transition-colors shadow-lg shadow-slate-900/20 flex items-center">
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    New Project
                                                </button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mr-3">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <Link href={`/dashboard/projects/${project.id}`}>
                                                        <div className="font-medium text-slate-900 hover:text-blue-600 transition-colors cursor-pointer">
                                                            {project.name}
                                                        </div>
                                                    </Link>
                                                    <div className="text-xs text-slate-500">
                                                        {project.client_name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'Active'
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : project.status === 'On Hold'
                                                        ? 'bg-amber-50 text-amber-700'
                                                        : 'bg-slate-100 text-slate-700'
                                                    }`}
                                            >
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-full max-w-xs">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-medium text-slate-700">
                                                        {project.progress}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${project.progress === 100
                                                            ? 'bg-emerald-500'
                                                            : 'bg-blue-600'
                                                            }`}
                                                        style={{ width: `${project.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm text-slate-600">
                                                <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                                {project.end_date || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-900">
                                                ${project.contract_value}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/dashboard/projects/${project.id}/contract`}>
                                                <button className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                                                    View Contract
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Simple) */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        Showing <span className="font-medium text-slate-900">1</span> to{' '}
                        <span className="font-medium text-slate-900">5</span> of{' '}
                        <span className="font-medium text-slate-900">12</span> results
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>
                            Previous
                        </button>
                        <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
