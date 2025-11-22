import { createClient } from '@/lib/supabase-server'
import { StatsCard } from '@/components/admin/StatsCard'

async function getAdminStats() {
    const supabase = createClient()

    // Fetch all admin stats
    const [userStats, projectStats, revenueStats] = await Promise.all([
        supabase.from('admin_user_stats').select('*').single(),
        supabase.from('admin_project_stats').select('*').single(),
        supabase.from('admin_revenue_stats').select('*').single(),
    ])

    return {
        users: userStats.data || {
            total_users: 0,
            new_users_30d: 0,
            new_users_7d: 0,
            active_users_30d: 0,
            active_users_7d: 0,
        },
        projects: projectStats.data || {
            total_projects: 0,
            active_projects: 0,
            completed_projects: 0,
            on_hold_projects: 0,
            new_projects_30d: 0,
            total_contract_value: 0,
            avg_contract_value: 0,
        },
        revenue: revenueStats.data || {
            total_payments: 0,
            total_revenue: 0,
            paid_revenue: 0,
            pending_revenue: 0,
            revenue_30d: 0,
            revenue_7d: 0,
            avg_payment_amount: 0,
        },
    }
}

export default async function AdminPage() {
    const stats = await getAdminStats()

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Overview</h1>
                <p className="text-slate-500 mt-1">Platform-wide metrics and system health</p>
            </div>

            {/* User Stats */}
            <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">User Metrics</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Users"
                        value={stats.users.total_users}
                        icon="users"
                    />
                    <StatsCard
                        title="New Users (30d)"
                        value={stats.users.new_users_30d}
                        icon="users"
                    />
                    <StatsCard
                        title="Active Users (30d)"
                        value={stats.users.active_users_30d}
                        icon="users"
                    />
                    <StatsCard
                        title="Active Users (7d)"
                        value={stats.users.active_users_7d}
                        icon="users"
                    />
                </div>
            </div>

            {/* Project Stats */}
            <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Project Metrics</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Projects"
                        value={stats.projects.total_projects}
                        icon="folder"
                    />
                    <StatsCard
                        title="Active Projects"
                        value={stats.projects.active_projects}
                        icon="folder"
                    />
                    <StatsCard
                        title="Completed Projects"
                        value={stats.projects.completed_projects}
                        icon="folder"
                    />
                    <StatsCard
                        title="New Projects (30d)"
                        value={stats.projects.new_projects_30d}
                        icon="folder"
                    />
                </div>
            </div>

            {/* Revenue Stats */}
            <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Revenue Metrics</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Revenue"
                        value={`$${Number(stats.revenue.total_revenue || 0).toLocaleString()}`}
                        icon="dollar"
                        className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none"
                    />
                    <StatsCard
                        title="Paid Revenue"
                        value={`$${Number(stats.revenue.paid_revenue || 0).toLocaleString()}`}
                        icon="dollar"
                    />
                    <StatsCard
                        title="Revenue (30d)"
                        value={`$${Number(stats.revenue.revenue_30d || 0).toLocaleString()}`}
                        icon="dollar"
                    />
                    <StatsCard
                        title="Avg Payment"
                        value={`$${Number(stats.revenue.avg_payment_amount || 0).toLocaleString()}`}
                        icon="dollar"
                    />
                </div>
            </div>

            {/* Contract Value */}
            <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Contract Metrics</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <StatsCard
                        title="Total Contract Value"
                        value={`$${Number(stats.projects.total_contract_value || 0).toLocaleString()}`}
                        icon="file"
                    />
                    <StatsCard
                        title="Avg Contract Value"
                        value={`$${Number(stats.projects.avg_contract_value || 0).toLocaleString()}`}
                        icon="file"
                    />
                </div>
            </div>
        </div>
    )
}
