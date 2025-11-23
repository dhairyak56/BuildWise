import { createClient, createAdminClient } from '@/lib/supabase-server'
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

        const adminClient = createAdminClient()

        // Delete user from Auth (this will cascade to public tables if set up, 
        // but we should also manually clean up if needed or rely on ON DELETE CASCADE)
        const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId)

        if (deleteError) {
            console.error('Error deleting user from Auth:', deleteError)
            return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in delete user API:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const { userId, action } = await request.json()

        if (!userId || !action) {
            return NextResponse.json({ error: 'User ID and action required' }, { status: 400 })
        }

        const supabase = createClient()

        // Check if current user is admin
        const { data: { user } } = await supabase.auth.getUser()
        if (!user?.user_metadata?.is_admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const adminClient = createAdminClient()
        let updateData = {}

        if (action === 'make_admin') {
            updateData = { user_metadata: { is_admin: true } }
        } else if (action === 'remove_admin') {
            updateData = { user_metadata: { is_admin: false } }
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
        }

        const { error: updateError } = await adminClient.auth.admin.updateUserById(
            userId,
            updateData
        )

        if (updateError) {
            console.error('Error updating user role:', updateError)
            return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in update user API:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
