import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// GET: Fetch all tasks for a project
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: projectId } = await params
    const supabase = createClient()

    const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('position', { ascending: true })
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(tasks)
}

// POST: Create a new task
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: projectId } = await params
    const body = await request.json()
    const supabase = createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user owns the project
    const { data: project } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single()

    if (!project) {
        return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 })
    }

    // Create task
    const { data: task, error } = await supabase
        .from('tasks')
        .insert({
            project_id: projectId,
            title: body.title,
            description: body.description || null,
            status: body.status || 'todo',
            priority: body.priority || 'medium',
            assigned_to: body.assigned_to || null,
            created_by: user.id,
            due_date: body.due_date || null,
            position: body.position || 0
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(task)
}
