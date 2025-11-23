import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
    try {
        const supabase = await createClient()

        // Get analytics overview
        const { data, error } = await supabase.rpc('get_analytics_overview')

        if (error) throw error

        return NextResponse.json(data || {})
    } catch (error) {
        console.error('Error fetching analytics overview:', error)
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        )
    }
}
