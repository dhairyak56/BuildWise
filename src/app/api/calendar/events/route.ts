import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const start = searchParams.get('start')
        const end = searchParams.get('end')

        let query = supabase
            .from('calendar_events')
            .select('*')
            .eq('user_id', user.id)

        if (start) {
            query = query.gte('start_date', start)
        }

        if (end) {
            query = query.lte('end_date', end)
        }

        const { data: events, error } = await query.order('start_date', { ascending: true })

        if (error) throw error

        // Transform events to calendar format
        const calendarEvents = events?.map(event => ({
            id: event.event_id,
            title: event.title,
            start: new Date(event.start_date),
            end: new Date(event.end_date),
            type: event.event_type,
            status: event.status,
            description: event.description,
            projectId: event.project_id
        })) || []

        return NextResponse.json({ events: calendarEvents })
    } catch (error) {
        console.error('Error fetching calendar events:', error)
        return NextResponse.json(
            { error: 'Failed to fetch calendar events' },
            { status: 500 }
        )
    }
}
