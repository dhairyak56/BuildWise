import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// GET: Fetch all comments for a task
export async function GET(
    request: Request,
    { params }: { params: Promise<{ taskId: string }> }
) {
    const { taskId } = await params
    const supabase = createClient()

    const { data: comments, error } = await supabase
        .from('task_comments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(comments)
}

// POST: Create a new comment
export async function POST(
    request: Request,
    { params }: { params: Promise<{ taskId: string }> }
) {
    const { taskId } = await params
    const body = await request.json()
    const supabase = createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create comment
    const { data: comment, error } = await supabase
        .from('task_comments')
        .insert({
            task_id: taskId,
            user_id: user.id,
            comment: body.comment
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(comment)
}
