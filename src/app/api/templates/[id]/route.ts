import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// GET: Fetch a specific template
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = createClient()

    const { data: template, error } = await supabase
        .from('contract_templates')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(template)
}
