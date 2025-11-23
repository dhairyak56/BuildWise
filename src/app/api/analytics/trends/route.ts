import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('payment_trends')
            .select('*')
            .order('month', { ascending: true })
            .limit(12) // Last 12 months

        if (error) throw error

        return NextResponse.json(data || [])
    } catch (error) {
        console.error('Error fetching payment trends:', error)
        return NextResponse.json(
            { error: 'Failed to fetch payment trends' },
            { status: 500 }
        )
    }
}
