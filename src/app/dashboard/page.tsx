import { createClient, createAdminClient } from '@/lib/supabase-server'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

import { unstable_cache } from 'next/cache'

const getCachedDashboardData = async (userId: string) => {
    const supabase = createAdminClient()

    // Fetch all projects for status distribution and KPIs
    const { data: allProjects } = await supabase
        .from('projects')
        .select('status, created_at, updated_at')
        .eq('user_id', userId)

    // Calculate project status distribution
    const projectStatusCounts = allProjects?.reduce((acc, project) => {
        const status = project.status || 'Active'
        acc[status] = (acc[status] || 0) + 1
        return acc
    }, {} as Record<string, number>) || {}

    const projectStatusData = [
        { name: 'Active', value: projectStatusCounts['Active'] || 0, color: '#4A90E2' },
        { name: 'Completed', value: projectStatusCounts['Completed'] || 0, color: '#10b981' },
        { name: 'On Hold', value: projectStatusCounts['On Hold'] || 0, color: '#f59e0b' },
        { name: 'Planning', value: projectStatusCounts['Planning'] || 0, color: '#8b5cf6' },
    ].filter(item => item.value > 0)

    // Fetch pending contracts count (Draft status)
    const { count: pendingContracts } = await supabase
        .from('contracts')
        .select('project_id, projects!inner(user_id)', { count: 'exact', head: true })
        .eq('status', 'Draft')
        .eq('projects.user_id', userId)

    // Fetch all payments for revenue and status breakdown
    const { data: allPayments } = await supabase
        .from('payments')
        .select('amount, status, payment_date, due_date, project_id, projects!inner(user_id)')
        .eq('projects.user_id', userId)

    // Calculate total revenue (Paid only)
    const totalRevenue = allPayments
        ?.filter(p => p.status === 'Paid')
        .reduce((sum, payment) => sum + Number(payment.amount), 0) || 0

    // Calculate payment status breakdown (last 6 months)
    const paymentStatusData = new Array(6).fill(0).map((_, i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - 5 + i)
        return {
            name: d.toLocaleString('default', { month: 'short' }),
            month: d.getMonth(),
            year: d.getFullYear(),
            paid: 0,
            pending: 0,
            overdue: 0
        }
    })

    allPayments?.forEach(payment => {
        const date = new Date(payment.payment_date || payment.due_date)
        const month = date.getMonth()
        const year = date.getFullYear()

        const monthData = paymentStatusData.find(d => d.month === month && d.year === year)
        if (monthData) {
            if (payment.status === 'Paid') monthData.paid += Number(payment.amount)
            else if (payment.status === 'Overdue') monthData.overdue += Number(payment.amount)
            else monthData.pending += Number(payment.amount)
        }
    })

    // Calculate KPIs
    const totalInvoices = allPayments?.length || 0
    const paidInvoices = allPayments?.filter(p => p.status === 'Paid').length || 0
    const paymentCollectionRate = totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0

    const outstandingInvoices = allPayments
        ?.filter(p => p.status !== 'Paid')
        .reduce((sum, p) => sum + Number(p.amount), 0) || 0

    // Fetch contracts for approval rate
    const { data: allContracts } = await supabase
        .from('contracts')
        .select('status, project_id, projects!inner(user_id)')
        .eq('projects.user_id', userId)

    const totalContracts = allContracts?.length || 0
    const signedContracts = allContracts?.filter(c => c.status === 'Signed').length || 0
    const contractApprovalRate = totalContracts > 0 ? Math.round((signedContracts / totalContracts) * 100) : 0

    // Calculate avg completion time
    const completedProjects = allProjects?.filter(p => p.status === 'Completed') || []
    let avgCompletionTime = 0

    if (completedProjects.length > 0) {
        const totalDays = completedProjects.reduce((sum, project) => {
            const start = new Date(project.created_at).getTime()
            const end = new Date(project.updated_at).getTime()
            const days = (end - start) / (1000 * 60 * 60 * 24)
            return sum + days
        }, 0)
        avgCompletionTime = Math.round(totalDays / completedProjects.length)
    }

    // Calculate revenue stats (reusing existing logic but with allPayments)
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    let currentMonthRevenue = 0
    let lastMonthRevenue = 0

    const monthlyRevenue = new Array(12).fill(0).map((_, i) => ({
        name: new Date(0, i).toLocaleString('default', { month: 'short' }),
        total: 0
    }))

    allPayments?.filter(p => p.status === 'Paid').forEach(payment => {
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

    // Fetch upcoming deadlines count (next 7 days)
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)

    const { count: upcomingDeadlinesCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('end_date', new Date().toISOString())
        .lte('end_date', nextWeek.toISOString())
        .in('status', ['Active', 'Planning'])

    // Merge and sort activity
    const activity = [
        ...(recentProjects?.map(p => ({ ...p, type: 'project' })) || []),
        ...(recentDocuments?.map(d => ({ ...d, type: 'document' })) || [])
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(5)

    return {
        activeProjects: projectStatusCounts['Active'] || 0,
        pendingContracts: pendingContracts || 0,
        totalRevenue,
        monthlyRevenue,
        revenueChange,
        newProjectsThisWeek: newProjectsThisWeek || 0,
        upcomingDeadlinesCount: upcomingDeadlinesCount || 0,
        recentActivity: activity,
        projectStatusData,
        paymentStatusData,
        kpiData: {
            avgCompletionTime,
            paymentCollectionRate,
            contractApprovalRate,
            outstandingInvoices
        }
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
            upcomingDeadlinesCount: 0,
            recentActivity: [],
            projectStatusData: [],
            paymentStatusData: [],
            kpiData: {
                avgCompletionTime: 0,
                paymentCollectionRate: 0,
                contractApprovalRate: 0,
                outstandingInvoices: 0
            },
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
