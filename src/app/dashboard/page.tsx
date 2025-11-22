import {
    FileText,
    FolderIcon,
    Plus,
    DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { OverviewCharts } from '@/components/dashboard/OverviewCharts'
import { cn } from '@/lib/utils'

async function getDashboardData() {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return {
            activeProjects: 0,
            pendingContracts: 0,
            totalRevenue: 0,
            monthlyRevenue: [],
            revenueChange: 0,
            newProjectsThisWeek: 0,
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

    // Fetch payments for revenue calculation
    const { data: payments } = await supabase
        .from('payments')
        .select('amount, payment_date, project_id, projects!inner(user_id)')
        .eq('status', 'Paid')
        .eq('projects.user_id', user.id)

    // Calculate total revenue
    const totalRevenue = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0

    // Calculate revenue stats
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    let currentMonthRevenue = 0
    let lastMonthRevenue = 0

    // Calculate monthly revenue for chart & stats
    const monthlyRevenue = new Array(12).fill(0).map((_, i) => ({
        name: new Date(0, i).toLocaleString('default', { month: 'short' }),
        total: 0
    }))

    payments?.forEach(payment => {
        const date = new Date(payment.payment_date)
        const month = date.getMonth()
        const year = date.getFullYear()

        monthlyRevenue[month].total += Number(payment.amount)

        if (month === currentMonth && year === currentYear) {
            currentMonthRevenue += Number(payment.amount)
        } else if (month === lastMonth && year === lastMonthYear) {
            lastMonthRevenue += Number(payment.amount)
        }
    })

    // Calculate revenue change percentage
    let revenueChange = 0
    if (lastMonthRevenue > 0) {
        revenueChange = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    } else if (currentMonthRevenue > 0) {
        revenueChange = 100
    }

    // Fetch new projects this week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const { count: newProjectsThisWeek } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', oneWeekAgo.toISOString())

    // Fetch recent projects
    const { data: recentProjects } = await supabase
        .from('projects')
        .select('id, name, created_at, status')
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
        totalRevenue,
        monthlyRevenue,
        revenueChange,
        newProjectsThisWeek: newProjectsThisWeek || 0,
        recentActivity: activity,
        user
    }
}

export default async function DashboardPage() {
    const {
        activeProjects,
        pendingContracts,
        totalRevenue,
        monthlyRevenue,
        revenueChange,
        newProjectsThisWeek,
        recentActivity
    } = await getDashboardData()

    const stats = [
        {
            name: 'Total Revenue',
            value: `$${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            change: `${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(1)}% from last month`,
            trend: revenueChange >= 0 ? 'up' : 'down',
            className: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
            iconClassName: 'text-blue-100',
            textClassName: 'text-blue-50'
        },
        {
            name: 'Active Projects',
            value: activeProjects.toString(),
            icon: FolderIcon,
            change: `+${newProjectsThisWeek} new this week`,
            trend: 'up',
            className: 'bg-white border-slate-200',
            iconClassName: 'text-blue-600 bg-blue-50',
            textClassName: 'text-slate-500'
        },
        {
            name: 'Pending Contracts',
            value: pendingContracts.toString(),
            icon: FileText,
            change: `${pendingContracts} require attention`,
            trend: 'neutral',
            className: 'bg-white border-slate-200',
            iconClassName: 'text-amber-600 bg-amber-50',
            textClassName: 'text-slate-500'
        },
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Overview of your construction projects and performance.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/projects/new">
                        <button className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-lg shadow-primary/25">
                            <Plus className="mr-2 h-4 w-4" />
                            New Project
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className={cn(
                            "rounded-xl p-6 shadow-sm transition-all hover:shadow-md",
                            stat.className,
                            stat.name === 'Total Revenue' ? 'border-none' : 'border'
                        )}
                    >
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className={cn("text-sm font-medium", stat.textClassName)}>
                                {stat.name}
                            </p>
                            <div className={cn("p-2 rounded-full", stat.iconClassName)}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className={cn("text-2xl font-bold", stat.name === 'Total Revenue' ? 'text-white' : 'text-slate-900')}>
                                {stat.value}
                            </div>
                            <p className={cn("text-xs mt-1", stat.textClassName)}>
                                {stat.change}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Charts Section */}
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-col space-y-1.5">
                        <h3 className="font-semibold leading-none tracking-tight">Overview</h3>
                        <p className="text-sm text-muted-foreground">Monthly revenue breakdown</p>
                    </div>
                    <div className="p-6 pt-0 pl-2">
                        <OverviewCharts data={monthlyRevenue} />
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-col space-y-1.5">
                        <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
                        <p className="text-sm text-muted-foreground">Latest updates from your projects</p>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="space-y-8">
                            {recentActivity.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No recent activity
                                </div>
                            ) : (
                                recentActivity.map((item: { id: string; type: string; name: string; created_at: string }) => (
                                    <div key={item.id} className="flex items-center group">
                                        <div className={cn(
                                            "flex h-9 w-9 items-center justify-center rounded-full border",
                                            item.type === 'project' ? "bg-blue-50 border-blue-100" : "bg-purple-50 border-purple-100"
                                        )}>
                                            {item.type === 'project' ? (
                                                <FolderIcon className="h-4 w-4 text-blue-600" />
                                            ) : (
                                                <FileText className="h-4 w-4 text-purple-600" />
                                            )}
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.type === 'project' ? 'Project Created' : 'Document Uploaded'}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium text-xs text-muted-foreground">
                                            {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
