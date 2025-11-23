import { createClient, createAdminClient } from '@/lib/supabase-server'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

import { unstable_cache } from 'next/cache'

const getCachedDashboardData = async (userId: string) => {
    const supabase = createAdminClient()

    // Fetch active projects count
    const { count: activeProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Active')
        .eq('user_id', userId)

    // Fetch pending contracts count (Draft status)
    const { count: pendingContracts } = await supabase
        .from('contracts')
        .select('project_id, projects!inner(user_id)', { count: 'exact', head: true })
        .eq('status', 'Draft')
        .eq('projects.user_id', userId)

    // Fetch payments for revenue calculation
    const { data: payments } = await supabase
        .from('payments')
        .select('amount, payment_date, project_id, projects!inner(user_id)')
        .eq('status', 'Paid')
        .eq('projects.user_id', userId)

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
        .eq('user_id', userId)
        .gte('created_at', oneWeekAgo.toISOString())

    // Fetch recent projects
    const { data: recentProjects } = await supabase
        .from('projects')
        .select('id, name, created_at, status')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3)

    // Fetch recent documents
    const { data: recentDocuments } = await supabase
        .from('documents')
        .select('id, name, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3)

    // Merge and sort activity
    const activity = [
        ...(recentProjects?.map(p => ({ ...p, type: 'project' })) || []),
        ...(recentDocuments?.map(d => ({ ...d, type: 'document' })) || [])
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(5)

    return {
        activeProjects: activeProjects || 0,
        pendingContracts: pendingContracts || 0,
        totalRevenue,
        monthlyRevenue,
        revenueChange,
        newProjectsThisWeek: newProjectsThisWeek || 0,
        recentActivity: activity,
    }
}

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

    const getCachedData = unstable_cache(
        async () => getCachedDashboardData(user.id),
        ['dashboard', user.id],
        {
            revalidate: 60, // Cache for 60 seconds
            tags: [`dashboard:${user.id}`]
        }
    )

    const data = await getCachedData()

    return {
        ...data,
        user
    }
}

export default async function DashboardPage() {
    const data = await getDashboardData()

    return <DashboardContent data={data} />
}
