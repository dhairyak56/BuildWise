

import {
    FileText,
    Clock,
    FolderIcon,
    ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'

async function getDashboardData() {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return {
            activeProjects: 0,
            pendingContracts: 0,
            recentProjects: [],
            user: null
        }
    }

    // Fetch active projects count
    const { count: activeProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Active')
        .eq('user_id', user.id)

    // Fetch pending contracts count (Draft status)
    const { count: pendingContracts } = await supabase
        .from('contracts')
        .select('project_id, projects!inner(user_id)', { count: 'exact', head: true })
        .eq('status', 'Draft')
        .eq('projects.user_id', user.id)

    // Fetch recent projects for activity feed
    const { data: recentProjects } = await supabase
        .from('projects')
        .select('id, name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

    return {
        activeProjects: activeProjects || 0,
        pendingContracts: pendingContracts || 0,
        recentProjects: recentProjects || [],
        user
    }
}





export default async function DashboardPage() {
    const { activeProjects, pendingContracts, recentProjects, user } = await getDashboardData()

    const stats = [
        {
            name: 'Active Projects',
            value: activeProjects.toString(),
            icon: FolderIcon,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            name: 'Pending Contracts',
            value: pendingContracts.toString(),
            icon: FileText,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
        },
    ]

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-slate-500">
                        Welcome back, {user?.user_metadata?.full_name || 'Builder'}. Here&apos;s what&apos;s happening today.
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors shadow-sm">
                        Download Report
                    </button>
                    <Link href="/dashboard/projects/new">
                        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium text-sm transition-colors shadow-lg shadow-slate-900/20">
                            New Project
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium">
                            {stat.name}
                        </h3>
                        <p className="text-2xl font-bold text-slate-900 mt-1">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Recent Activity
                        </h2>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View All
                        </button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentProjects.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-slate-500 text-sm">No recent activity yet. Create your first project to get started!</p>
                            </div>
                        ) : (
                            recentProjects.map((project) => (
                                <div key={project.id} className="p-6 flex items-start space-x-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                                        <FolderIcon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-900">
                                            <span className="font-medium">You</span>{' '}
                                            created project{' '}
                                            <span className="font-medium text-slate-900">
                                                {project.name}
                                            </span>
                                        </p>
                                        <div className="flex items-center mt-1 text-xs text-slate-500">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/projects/${project.id}/contract`}>
                                        <button className="text-slate-400 hover:text-slate-600">
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions / Promo */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -mr-10 -mt-10"></div>
                        <h3 className="text-lg font-semibold mb-2 relative z-10">
                            Upgrade to Pro
                        </h3>
                        <p className="text-slate-300 text-sm mb-6 relative z-10">
                            Unlock advanced AI analysis and unlimited projects.
                        </p>
                        <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-colors shadow-lg shadow-blue-900/20 relative z-10">
                            Upgrade Now
                        </button>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                                    Upload Contract
                                </span>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                                    Invite Team Member
                                </span>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
