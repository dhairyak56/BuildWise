import { createClient } from '@/lib/supabase-server'
import { ProjectTable } from '@/components/admin/ProjectTable'

async function getProjects() {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('admin_projects_list')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching projects:', error)
        return []
    }

    return data || []
}

export default async function AdminProjectsPage() {
    const projects = await getProjects()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">All Projects</h1>
                <p className="text-slate-500 mt-1">Monitor and manage all projects across the platform</p>
            </div>

            {/* Project Table */}
            <ProjectTable initialProjects={projects} />
        </div>
    )
}
