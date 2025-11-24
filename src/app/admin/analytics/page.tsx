import { createClient } from '@/lib/supabase-server'
import { StatsCard } from '@/components/admin/StatsCard'
import { OverviewCharts } from '@/components/dashboard/OverviewCharts'

async function getAnalyticsData() {
    const supabase = createClient()

    // Get monthly revenue data
    const { data: payments } = await supabase
        .from('payments')
        .select('amount, payment_date, status')
        .eq('status', 'Paid')
        .order('payment_date', { ascending: true })

    // Get user growth data
    const { data: users } = await supabase
        .from('admin_users_list')
        .select('created_at')
        .order('created_at', { ascending: true })

    // Get project growth data
    const { data: projects } = await supabase
        .from('admin_projects_list')
        .select('created_at, status')
        .order('created_at', { ascending: true })

    // Process monthly revenue
    const monthlyRevenue: { name: string; total: number }[] = []
    const revenueByMonth = new Map<string, number>()

    payments?.forEach((payment) => {
        const date = new Date(payment.payment_date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

        revenueByMonth.set(monthKey, (revenueByMonth.get(monthKey) || 0) + Number(payment.amount))
    })

    // Get last 12 months
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const monthName = date.toLocaleDateString('en-US', { month: 'short' })

        monthlyRevenue.push({
            name: monthName,
            total: revenueByMonth.get(monthKey) || 0
        })
    }

    // Process user growth
    const userGrowth: { name: string; total: number }[] = []
    const usersByMonth = new Map<string, number>()

    users?.forEach((user) => {
        const date = new Date(user.created_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        usersByMonth.set(monthKey, (usersByMonth.get(monthKey) || 0) + 1)
    })

    let cumulativeUsers = 0
    for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const monthName = date.toLocaleDateString('en-US', { month: 'short' })

        cumulativeUsers += usersByMonth.get(monthKey) || 0
        userGrowth.push({
            name: monthName,
            total: cumulativeUsers
        })
    }

    return {
        monthlyRevenue,
        userGrowth,
        totalRevenue: payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0,
        totalUsers: users?.length || 0,
        totalProjects: projects?.length || 0,
        activeProjects: projects?.filter(p => p.status === 'Active').length || 0,
    }
}

export default async function AdminAnalyticsPage() {
    const data = await getAnalyticsData()

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Platform Analytics</h1>
                <p className="text-slate-500 mt-1">Detailed analytics and growth trends</p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={`$${data.totalRevenue.toLocaleString()}`}
                    icon="dollar"
                />
                <StatsCard
                    title="Total Users"
                    value={data.totalUsers}
                    icon="users"
                />
                <StatsCard
                    title="Total Projects"
                    value={data.totalProjects}
                    icon="folder"
                />
                <StatsCard
                    title="Active Projects"
                    value={data.activeProjects}
                    icon="folder"
                />
            </div>

            {/* Revenue Trends */}
            <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Revenue Trends</h2>
                    <p className="text-sm text-slate-500">Monthly revenue over the last 12 months</p>
                </div>
                <div className="h-80">
                    <OverviewCharts data={data.monthlyRevenue} />
                </div>
            </div>

            {/* User Growth */}
            <div className="rounded-xl border bg-white shadow-sm p-6">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">User Growth</h2>
                    <p className="text-sm text-slate-500">Cumulative user growth over the last 12 months</p>
                </div>
                <div className="h-80">
                    <OverviewCharts data={data.userGrowth} />
                </div>
            </div>
        </div>
    )
}
