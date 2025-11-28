import { createAdminClient } from '@/lib/supabase-server'

interface CreateNotificationParams {
    userId: string
    type: 'deadline' | 'contract' | 'payment' | 'project' | 'task' | 'document'
    title: string
    message: string
    link?: string
}

export async function createNotification(params: CreateNotificationParams) {
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('notifications')
        .insert({
            user_id: params.userId,
            type: params.type,
            title: params.title,
            message: params.message,
            link: params.link
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating notification:', error)
        return null
    }

    return data
}

export async function checkUpcomingDeadlines() {
    const supabase = createAdminClient()

    // Get projects with deadlines in the next 7 days
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

    const { data: projects } = await supabase
        .from('projects')
        .select('id, name, end_date, user_id')
        .gte('end_date', new Date().toISOString())
        .lte('end_date', sevenDaysFromNow.toISOString())
        .in('status', ['Active', 'Planning'])

    if (!projects) return

    for (const project of projects) {
        const daysUntilDeadline = Math.ceil(
            (new Date(project.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        )

        await createNotification({
            userId: project.user_id,
            type: 'deadline',
            title: `Project deadline approaching: ${project.name}`,
            message: `This project is due in ${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''}`,
            link: `/dashboard/projects/${project.id}`
        })
    }
}

export async function checkOverduePayments() {
    const supabase = createAdminClient()

    // Get overdue payments
    const { data: payments } = await supabase
        .from('payments')
        .select('id, amount, due_date, project_id, projects!inner(user_id, name)')
        .eq('status', 'Pending')
        .lt('due_date', new Date().toISOString())

    if (!payments) return

    for (const payment of payments) {
        const daysOverdue = Math.ceil(
            (new Date().getTime() - new Date(payment.due_date).getTime()) / (1000 * 60 * 60 * 24)
        )

        // Type assertion: projects is a single object due to !inner join, not an array
        const project = payment.projects as unknown as { user_id: string; name: string }

        await createNotification({
            userId: project.user_id,
            type: 'payment',
            title: `Payment overdue: ${project.name}`,
            message: `Payment of $${payment.amount} is ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`,
            link: `/dashboard/payments`
        })
    }
}

export async function notifyContractReady(contractId: string, projectName: string, userId: string) {
    await createNotification({
        userId,
        type: 'contract',
        title: 'Contract ready for review',
        message: `The contract for ${projectName} is ready for your review and signature`,
        link: `/dashboard/contracts/${contractId}`
    })
}

export async function notifyTaskAssigned(taskId: string, taskTitle: string, projectId: string, userId: string) {
    await createNotification({
        userId,
        type: 'task',
        title: 'New task assigned',
        message: `You've been assigned: ${taskTitle}`,
        link: `/dashboard/projects/${projectId}?tab=tasks`
    })
}
