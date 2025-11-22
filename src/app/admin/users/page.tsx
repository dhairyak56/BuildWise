import { createClient } from '@/lib/supabase-server'
import { UserTable } from '@/components/admin/UserTable'

async function getUsers() {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('admin_users_list')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching users:', error)
        return []
    }

    return data || []
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
