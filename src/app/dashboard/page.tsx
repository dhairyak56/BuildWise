import {
    FileText,
    Clock,
    FolderIcon,
    ArrowRight,
    Upload,
    TrendingUp,
    Sparkles
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
            recentActivity: [],
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

    // Fetch recent projects
    const { data: recentProjects } = await supabase
        .from('projects')
        .select('id, name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

    // Fetch recent documents
    const { data: recentDocuments } = await supabase
        .from('documents')
        .select('id, name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

    // Merge and sort activity
    const activity = [
        ...(recentProjects?.map(p => ({ ...p, type: 'project' })) || []),
        ...(recentDocuments?.map(d => ({ ...d, type: 'document' })) || [])
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)

    return {
        activeProjects: activeProjects || 0,
        pendingContracts: pendingContracts || 0,
        recentActivity: activity,
        user
    }
}

export default async function DashboardPage() {
    const { activeProjects, pendingContracts, recentActivity, user } = await getDashboardData()

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
            {/* Refined Welcome Section */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span className="text-slate-600 text-sm font-medium">Dashboard</span>
                        </div>
                        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">
                            Welcome back, {user?.user_metadata?.full_name || 'Builder'}
                        </h1>
                        <p className="text-slate-500">
                            Here's an overview of your projects and activity.
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors">
                            Export Report
                        </button>
                        <Link href="/dashboard/projects/new">
                            <button className="px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium text-sm transition-colors">
                                New Project
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Refined Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={stat.name}
                        className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-all"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <h3 className="text-sm font-medium text-slate-600">
                                        {stat.name}
                                    </h3>
                                </div>
                                <p className="text-3xl font-semibold text-slate-900 mb-1">
                                    {stat.value}
                                </p>
                                {/* <div className="flex items-center space-x-1.5 text-emerald-600">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    <span className="text-xs font-medium">+12% from last month</span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Refined Activity Feed */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                                    Recent Activity
                                </h2>
                                <p className="text-sm text-slate-500">Your latest project updates</p>
                            </div>
                            <button className="text-sm text-slate-600 hover:text-slate-900 font-medium">
                                View all
                            </button>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentActivity.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <Clock className="w-6 h-6 text-slate-400" />
                                </div>
                                <p className="text-slate-600 text-sm font-medium mb-1">No recent activity</p>
                                <p className="text-slate-400 text-xs">Create your first project to get started</p>
                            </div>
                        ) : (
                            recentActivity.map((item: any) => (
                                <div key={item.id} className="p-5 flex items-start space-x-4 hover:bg-slate-50/50 transition-colors group">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${item.type === 'project'
                                        ? 'bg-blue-50'
                                        : 'bg-purple-50'
                                        }`}>
                                        {item.type === 'project' ? (
                                            <FolderIcon className="w-5 h-5 text-blue-600" />
                                        ) : (
                                            <Upload className="w-5 h-5 text-purple-600" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-900 mb-1">
                                            <span className="font-medium">You</span>{' '}
                                            <span className="text-slate-600">
                                                {item.type === 'project' ? 'created project' : 'uploaded document'}
                                            </span>{' '}
                                            <span className="font-medium text-slate-900">
                                                {item.name}
                                            </span>
                                        </p>
                                        <div className="flex items-center text-xs text-slate-400">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {new Date(item.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>

                                    {item.type === 'project' && (
                                        <Link href={`/dashboard/projects/${item.id}/contract`}>
                                            <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-slate-600 transition-all">
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Refined Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                            Quick Actions
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Common tasks and shortcuts
                        </p>
                        <div className="space-y-3">
                            <Link href="/dashboard/documents" className="block">
                                <button className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group">
                                    <div className="flex items-center space-x-3">
                                        <Upload className="w-4 h-4 text-slate-600" />
                                        <span className="text-sm font-medium text-slate-700">Upload Document</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                </button>
                            </Link>
                            <Link href="/dashboard/projects/new" className="block">
                                <button className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group">
                                    <div className="flex items-center space-x-3">
                                        <FolderIcon className="w-4 h-4 text-slate-600" />
                                        <span className="text-sm font-medium text-slate-700">Create Project</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Help Card */}
                    <div className="bg-slate-900 rounded-xl p-6 text-white">
                        <h3 className="text-lg font-semibold mb-2">
                            Need Assistance?
                        </h3>
                        <p className="text-slate-300 text-sm mb-4">
                            Our support team is ready to help with any questions.
                        </p>
                        <button className="w-full py-2.5 bg-white text-slate-900 rounded-lg hover:bg-slate-100 font-medium text-sm transition-colors">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
