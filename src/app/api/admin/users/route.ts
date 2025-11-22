import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
    try {
        const { userId } = await request.json()

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        const supabase = createClient()

        // Check if current user is admin
        const { data: { user } } = await supabase.auth.getUser()
        if (!user?.user_metadata?.is_admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Delete user's projects (cascade will handle contracts, payments, etc.)
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('user_id', userId)

        if (error) {
            console.error('Error deleting user data:', error)
            return NextResponse.json({ error: 'Failed to delete user data' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in delete user API:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
