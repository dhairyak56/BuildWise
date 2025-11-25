import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// GET: Fetch all contract templates
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const supabase = createClient()

    let query = supabase
        .from('contract_templates')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true })

    if (category) {
        query = query.eq('category', category)
    }

    const { data: templates, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(templates)
}
