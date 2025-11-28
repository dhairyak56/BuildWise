import { createClient, createAdminClient } from '@/lib/supabase-server'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

import { unstable_cache } from 'next/cache'

const getCachedDashboardData = async (userId: string) => {
    const supabase = createAdminClient()

    // Fetch all projects for status distribution and KPIs
    const { data: allProjects } = await supabase
        .from('projects')
        .select('status, created_at')
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
        .select('amount, status, payment_date, project_id, projects!inner(user_id)')
        .eq('projects.user_id', userId)

    // Calculate total revenue (Paid only)
    const totalRevenue = allPayments
        ?.filter(p => p.status === 'Paid')
        .reduce((sum, payment) => sum + Number(payment.amount), 0) || 0

    // Calculate payment status breakdown (last 6 months)
    const paymentStatusData = new Array(6).fill(0).map((_, i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - 5 + i)
        const monthName = d.toLocaleString('default', { month: 'short' })

        const monthlyPayments = allPayments?.filter(p => {
            if (!p.payment_date) return false
            const pDate = new Date(p.payment_date)
            return pDate.getMonth() === d.getMonth() && pDate.getFullYear() === d.getFullYear()
        }) || []

        const paid = monthlyPayments
            .filter(p => p.status === 'Paid')
            .reduce((sum, p) => sum + Number(p.amount), 0)

        const pending = monthlyPayments
            .filter(p => p.status === 'Pending')
            .reduce((sum, p) => sum + Number(p.amount), 0)

        return {
            name: monthName,
            Paid: paid,
            Pending: pending
        }
    })

    // Calculate monthly revenue for the chart
    const monthlyRevenue = new Array(6).fill(0).map((_, i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - 5 + i)
        const monthName = d.toLocaleString('default', { month: 'short' })

        const total = allPayments
            ?.filter(p => p.status === 'Paid' && p.payment_date)
            .filter(p => {
                const pDate = new Date(p.payment_date!)
                return pDate.getMonth() === d.getMonth() && pDate.getFullYear() === d.getFullYear()
            })
            .reduce((sum, p) => sum + Number(p.amount), 0) || 0

        return { name: monthName, total }
    })

    // Fetch recent activity (limit 5)
    // We'll combine latest projects and contracts
    const { data: recentProjects } = await supabase
        .from('projects')
        .select('id, name, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

    const recentActivity = [
        ...(recentProjects || []).map(p => ({ ...p, type: 'project' })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)

    // Calculate KPIs
    // 1. Avg Completion Time (mock calculation for now as we need completed projects with start/end dates)
    const avgCompletionTime = 45 // days

    // 2. Payment Collection Rate
    const totalInvoiced = allPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
    const paymentCollectionRate = totalInvoiced > 0 ? Math.round((totalRevenue / totalInvoiced) * 100) : 0

    // 3. Contract Approval Rate (Signed / Total)
    const { count: totalContracts } = await supabase
        .from('contracts')
        .select('project_id, projects!inner(user_id)', { count: 'exact', head: true })
        .eq('projects.user_id', userId)

    const { count: signedContracts } = await supabase
        .from('contracts')
        .select('project_id, projects!inner(user_id)', { count: 'exact', head: true })
        .eq('status', 'Signed')
        .eq('projects.user_id', userId)

    const contractApprovalRate = totalContracts ? Math.round(((signedContracts || 0) / totalContracts) * 100) : 0

    // 4. Outstanding Invoices
    const outstandingInvoices = allPayments
        ?.filter(p => p.status === 'Pending' || p.status === 'Overdue')
        .reduce((sum, p) => sum + Number(p.amount), 0) || 0

    // Calculate new projects this week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const newProjectsThisWeek = allProjects?.filter(p => new Date(p.created_at) > oneWeekAgo).length || 0

    // Calculate upcoming deadlines (next 7 days)
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    const upcomingDeadlinesCount = allPayments?.filter(p => {
        // Use payment_date as due_date for now since due_date column is missing
        if (!p.payment_date) return false
        const dueDate = new Date(p.payment_date)
        return dueDate > new Date() && dueDate <= nextWeek && p.status !== 'Paid'
    }).length || 0

    // Calculate revenue change (vs last month)
    // This is a simplified calculation
    const revenueChange = 0

    return {
        activeProjects: projectStatusCounts['Active'] || 0,
        pendingContracts: pendingContracts || 0,
        totalRevenue,
        monthlyRevenue,
        revenueChange,
        newProjectsThisWeek,
        upcomingDeadlinesCount,
        recentActivity,
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
        ['dashboard-v3', user.id],
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
