import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                },
            }
        )

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Create test notifications
        const testNotifications = [
            {
                user_id: user.id,
                type: 'deadline',
                title: 'Project deadline approaching',
                message: 'Your project "Downtown Office Building" is due in 3 days',
                link: '/dashboard/projects'
            },
            {
                user_id: user.id,
                type: 'contract',
                title: 'Contract ready for review',
                message: 'The contract for "Residential Complex Phase 2" is ready for your signature',
                link: '/dashboard/contracts'
            },
            {
                user_id: user.id,
                type: 'payment',
                title: 'Payment overdue',
                message: 'Payment of $15,000 is 2 days overdue',
                link: '/dashboard/payments'
            },
            {
                user_id: user.id,
                type: 'task',
                title: 'New task assigned',
                message: 'You\'ve been assigned: Complete foundation inspection',
                link: '/dashboard/projects'
            },
            {
                user_id: user.id,
                type: 'project',
                title: 'Project status updated',
                message: 'Project "City Park Renovation" has been marked as Active',
                link: '/dashboard/projects'
            }
        ]

        const { data, error } = await supabase
            .from('notifications')
            .insert(testNotifications)
            .select()

        if (error) throw error

        return NextResponse.json({
            success: true,
            message: `Created ${data.length} test notifications`,
            notifications: data
        })
    } catch (error) {
        console.error('Error creating test notifications:', error)
        return NextResponse.json(
            { error: 'Failed to create test notifications' },
            { status: 500 }
        )
    }
}
