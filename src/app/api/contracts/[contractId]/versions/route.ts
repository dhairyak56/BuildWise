import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// GET: Fetch all versions for a contract
export async function GET(
    request: NextRequest,
    { params }: { params: { contractId: string } }
) {
    const contractId = params.contractId
    const supabase = createClient()

    const { data: versions, error } = await supabase
        .from('contract_versions')
        .select(`
            *,
            created_by_user:created_by(email)
        `)
        .eq('contract_id', contractId)
        .order('version_number', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(versions)
}

// POST: Create a manual version
export async function POST(
    request: NextRequest,
    { params }: { params: { contractId: string } }
) {
    const contractId = params.contractId
    const body = await request.json()
    const { content, summary } = body

    const supabase = createClient()

    // Get next version number
    const { data: versions } = await supabase
        .from('contract_versions')
        .select('version_number')
        .eq('contract_id', contractId)
        .order('version_number', { ascending: false })
        .limit(1)

    const nextVersion = (versions?.[0]?.version_number || 0) + 1

    // Create new version
    const { data: newVersion, error } = await supabase
        .from('contract_versions')
        .insert({
            contract_id: contractId,
            version_number: nextVersion,
            content: { text: content },
            changes_summary: summary || 'Manual save'
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(newVersion)
}
