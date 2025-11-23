import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { sendEmail } from '@/lib/email'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: projectId } = await params
        const { email, role } = await request.json()
        const supabase = createClient()

        // 1. Verify permissions (Owner only)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { data: project } = await supabase
            .from('projects')
            .select('name')
            .eq('id', projectId)
            .eq('user_id', user.id)
            .single()

        if (!project) {
            return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 })
        }

        // 2. Create member record
        const { error: dbError } = await supabase
            .from('project_members')
            .insert({
                project_id: projectId,
                email,
                role,
                status: 'pending'
            })

        if (dbError) {
            if (dbError.code === '23505') { // Unique violation
                return NextResponse.json({ error: 'User already invited' }, { status: 400 })
            }
            throw dbError
        }

        // 3. Send email
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/login?invite=${projectId}`

        await sendEmail({
            to: email,
            subject: `Invitation to join ${project.name} on BuildWise`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>You've been invited!</h2>
                    <p>You have been invited to join the project <strong>${project.name}</strong> as an <strong>${role}</strong>.</p>
                    <p>Click the button below to accept the invitation:</p>
                    <a href="${inviteLink}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                        Accept Invitation
                    </a>
                    <p style="color: #666; font-size: 14px;">If you don't have an account, you'll be asked to create one.</p>
                </div>
            `
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Invite error:', error)
        return NextResponse.json({ error: 'Failed to send invite' }, { status: 500 })
    }
}
