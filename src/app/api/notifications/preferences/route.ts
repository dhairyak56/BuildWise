import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: preferences, error } = await supabase
            .from('notification_preferences')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            throw error
        }

        // Return default preferences if none exist
        if (!preferences) {
            return NextResponse.json({
                preferences: {
                    email_enabled: true,
                    push_enabled: true,
                    deadline_alerts: true,
                    contract_alerts: true,
                    payment_alerts: true,
                    task_alerts: true,
                    daily_digest: false
                }
            })
        }

        return NextResponse.json({ preferences })
    } catch (error) {
        console.error('Error fetching notification preferences:', error)
        return NextResponse.json(
            { error: 'Failed to fetch preferences' },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const {
            email_enabled,
            push_enabled,
            deadline_alerts,
            contract_alerts,
            payment_alerts,
            task_alerts,
            daily_digest
        } = body

        const { data: preferences, error } = await supabase
            .from('notification_preferences')
            .upsert({
                user_id: user.id,
                email_enabled,
                push_enabled,
                deadline_alerts,
                contract_alerts,
                payment_alerts,
                task_alerts,
                daily_digest,
                updated_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ preferences })
    } catch (error) {
        console.error('Error updating notification preferences:', error)
        return NextResponse.json(
            { error: 'Failed to update preferences' },
            { status: 500 }
        )
    }
}
