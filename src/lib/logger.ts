import { SupabaseClient } from '@supabase/supabase-js'

interface LogActionParams {
    action: string
    projectId?: string
    details?: Record<string, any>
    ipAddress?: string
}

export async function logAction(supabase: SupabaseClient, params: LogActionParams) {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            console.warn('Attempted to log action without authenticated user:', params.action)
            return
        }

        const { error } = await supabase.from('audit_logs').insert({
            user_id: user.id,
            project_id: params.projectId || null,
            action: params.action,
            details: params.details || {},
            ip_address: params.ipAddress || null
        })

        if (error) {
            console.error('Failed to write audit log:', error)
        }
    } catch (err) {
        console.error('Error in logAction:', err)
    }
}
