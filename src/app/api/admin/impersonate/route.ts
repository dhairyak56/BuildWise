import { createAdminClient, createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = createClient()

        // 1. Verify the caller is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Verify the caller is an admin
        const { data: _adminUser, error: _adminError } = await supabase.auth.admin.getUserById(user.id)
        // Note: The above check is insufficient because getUserById works for any user if called by service role.
        // We need to check the user's metadata or a specific admin table.
        // However, since we are using the standard client for the initial check, we can rely on RLS or metadata.
        // Let's check the is_admin flag in user_metadata.

        if (!user.user_metadata?.is_admin) {
            return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
        }

        const { userId } = await request.json()
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        // 3. Generate a magic link for the target user
        const adminClient = createAdminClient()
        const { data: targetUser, error: targetUserError } = await adminClient.auth.admin.getUserById(userId)

        if (targetUserError || !targetUser.user) {
            return NextResponse.json({ error: 'Target user not found' }, { status: 404 })
        }

        const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
            type: 'magiclink',
            email: targetUser.user.email!,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
            }
        })

        if (linkError) {
            console.error('Error generating magic link:', linkError)
            return NextResponse.json({ error: 'Failed to generate login link' }, { status: 500 })
        }

        return NextResponse.json({
            url: linkData.properties.action_link
        })

    } catch (error) {
        console.error('Error in impersonation:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
