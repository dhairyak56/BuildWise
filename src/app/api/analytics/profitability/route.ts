import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('project_profitability')
            .select('*')
            .order('budget', { ascending: false })
            .limit(10) // Top 10 projects by budget

        if (error) throw error

        return NextResponse.json(data || [])
    } catch (error) {
        console.error('Error fetching profitability data:', error)
        return NextResponse.json(
            { error: 'Failed to fetch profitability data' },
            { status: 500 }
        )
    }
}
