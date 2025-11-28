import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { notificationIds, markAll } = body

        if (markAll) {
            // Mark all notifications as read
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', user.id)
                .eq('read', false)

            if (error) throw error

            return NextResponse.json({ success: true, message: 'All notifications marked as read' })
        }

        if (!notificationIds || !Array.isArray(notificationIds)) {
            return NextResponse.json(
                { error: 'Invalid notification IDs' },
                { status: 400 }
            )
        }

        // Mark specific notifications as read
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .in('id', notificationIds)
            .eq('user_id', user.id)

        if (error) throw error

        return NextResponse.json({ success: true, message: 'Notifications marked as read' })
    } catch (error) {
        console.error('Error marking notifications as read:', error)
        return NextResponse.json(
            { error: 'Failed to mark notifications as read' },
            { status: 500 }
        )
    }
}
