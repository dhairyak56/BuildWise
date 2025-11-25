import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// GET: Fetch all contract clauses
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const applicableTo = searchParams.get('applicableTo')
    const search = searchParams.get('search')

    const supabase = createClient()

    let query = supabase
        .from('contract_clauses')
        .select('*')
        .order('category', { ascending: true })
        .order('title', { ascending: true })

    if (category) {
        query = query.eq('category', category)
    }

    if (applicableTo) {
        query = query.contains('applicable_to', [applicableTo])
    }

    if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,content.ilike.%${search}%`)
    }

    const { data: clauses, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(clauses)
}
