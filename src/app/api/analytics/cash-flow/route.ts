import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('cash_flow_projection')
            .select('*')
            .order('month', { ascending: true })
            .limit(6) // Last 6 months + future

        if (error) throw error

        return NextResponse.json(data || [])
    } catch (error) {
        console.error('Error fetching cash flow data:', error)
        return NextResponse.json(
            { error: 'Failed to fetch cash flow data' },
            { status: 500 }
        )
    }
}
