import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// GET: List members
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: projectId } = await params
    const supabase = createClient()

    const { data: members, error } = await supabase
        .from('project_members')
        .select('*')
        .eq('project_id', projectId)
        .order('invited_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(members)
}

// DELETE: Remove member
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: projectId } = await params
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')

    if (!memberId) return NextResponse.json({ error: 'Member ID required' }, { status: 400 })

    const supabase = createClient()

    // Verify owner
    const { data: { user } } = await supabase.auth.getUser()
    const { data: project } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .eq('user_id', user?.id)
        .single()

    if (!project) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId)
        .eq('project_id', projectId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
}

// PATCH: Update role
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: projectId } = await params
    const { memberId, role } = await request.json()

    const supabase = createClient()

    // Verify owner
    const { data: { user } } = await supabase.auth.getUser()
    const { data: project } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .eq('user_id', user?.id)
        .single()

    if (!project) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase
        .from('project_members')
        .update({ role })
        .eq('id', memberId)
        .eq('project_id', projectId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
}
