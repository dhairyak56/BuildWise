import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
    try {
        const { projectId } = await request.json()

        if (!projectId) {
            return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
        }

        const supabase = createClient()

        // Check if current user is admin
        const { data: { user } } = await supabase.auth.getUser()
        if (!user?.user_metadata?.is_admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Delete project (cascade will handle contracts, payments, etc.)
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId)

        if (error) {
            console.error('Error deleting project:', error)
            return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in delete project API:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
