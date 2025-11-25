import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// GET: Fetch a single task
export async function GET(
    request: Request,
    { params }: { params: Promise<{ taskId: string }> }
) {
    const { taskId } = await params
    const supabase = createClient()

    const { data: task, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(task)
}

// PATCH: Update a task
export async function PATCH(
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

    // Update task
    const { data: task, error } = await supabase
        .from('tasks')
        .update({
            title: body.title,
            description: body.description,
            status: body.status,
            priority: body.priority,
            assigned_to: body.assigned_to,
            due_date: body.due_date,
            position: body.position
        })
        .eq('id', taskId)
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(task)
}

// DELETE: Delete a task
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ taskId: string }> }
) {
    const { taskId } = await params
    const supabase = createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
