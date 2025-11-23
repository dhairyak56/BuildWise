import { createClient, createAdminClient } from '@/lib/supabase-server'
import { UserTable } from '@/components/admin/UserTable'

async function getUsers() {
    const supabase = createClient()
    const adminClient = createAdminClient()

    // Fetch stats from the view
    const { data: statsData, error: statsError } = await supabase
        .from('admin_users_list')
        .select('*')

    if (statsError) {
        console.error('Error fetching user stats:', statsError)
    }

    // Fetch all users from Auth to get admin status and ensure we have everyone
    const { data: { users: authUsers }, error: authError } = await adminClient.auth.admin.listUsers()

    if (authError) {
        console.error('Error fetching auth users:', authError)
        return []
    }

    // Merge data
    const mergedUsers = authUsers.map(authUser => {
        const stats = statsData?.find(s => s.id === authUser.id) || {}
        return {
            id: authUser.id,
            email: authUser.email || '',
            created_at: authUser.created_at,
            last_sign_in_at: authUser.last_sign_in_at || null,
            project_count: stats.project_count || 0,
            contract_count: stats.contract_count || 0,
            total_revenue: stats.total_revenue || 0,
            is_admin: authUser.user_metadata?.is_admin || false
        }
    })

    // Sort by created_at desc
    return mergedUsers.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
}

export default async function AdminUsersPage() {
    const users = await getUsers()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h1>
                <p className="text-slate-500 mt-1">View and manage all platform users</p>
            </div>

            {/* User Table */}
            <UserTable initialUsers={users} />
        </div>
    )
}
