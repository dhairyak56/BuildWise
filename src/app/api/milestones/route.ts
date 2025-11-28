import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const projectId = searchParams.get('project_id')

        let query = supabase
            .from('milestones')
            .select(`
                *,
                projects (
                    id,
                    name
                )
            `)

        if (projectId) {
            query = query.eq('project_id', projectId)
        } else {
            // Get milestones for all user's projects
            const { data: userProjects } = await supabase
                .from('projects')
                .select('id')
                .eq('user_id', user.id)

            const projectIds = userProjects?.map(p => p.id) || []

            if (projectIds.length > 0) {
                query = query.in('project_id', projectIds)
            } else {
                // User has no projects, return empty array
                return NextResponse.json({ milestones: [] })
            }
        }

        const { data: milestones, error } = await query.order('due_date', { ascending: true })

        if (error) throw error

        return NextResponse.json({ milestones: milestones || [] })
    } catch (error) {
        console.error('Error fetching milestones:', error)
        return NextResponse.json(
            { error: 'Failed to fetch milestones' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { project_id, title, description, due_date, status } = body

        if (!project_id || !title || !due_date) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Verify user owns the project
        const { data: project } = await supabase
            .from('projects')
            .select('id')
            .eq('id', project_id)
            .eq('user_id', user.id)
            .single()

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            )
        }

        const { data: milestone, error } = await supabase
            .from('milestones')
            .insert({
                project_id,
                title,
                description,
                due_date,
                status: status || 'pending'
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ milestone }, { status: 201 })
    } catch (error) {
        console.error('Error creating milestone:', error)
        return NextResponse.json(
            { error: 'Failed to create milestone' },
            { status: 500 }
        )
    }
}
