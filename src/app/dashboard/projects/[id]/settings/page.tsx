import { createClient } from '@/lib/supabase-server'
import { TeamManagement } from '@/components/projects/TeamManagement'
import { AuditLogViewer } from '@/components/projects/AuditLogViewer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function ProjectSettingsPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return notFound()

    const { data: project } = await supabase
        .from('projects')
        .select('name, user_id')
        .eq('id', id)
        .single()

    if (!project) return notFound()

    // Only owner can access settings
    if (project.user_id !== user.id) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
                <p className="text-slate-500 mt-2">Only the project owner can access settings.</p>
                <Link href={`/dashboard/projects/${id}`} className="text-blue-600 hover:underline mt-4 block">
                    Back to Project
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto p-8 space-y-8">
            <div>
                <Link
                    href={`/dashboard/projects/${id}`}
                    className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Project
                </Link>
                <h1 className="text-3xl font-bold text-slate-900">Project Settings</h1>
                <p className="text-slate-500 mt-1">Manage settings for {project.name}</p>
            </div>

            <div className="grid gap-8">
                <section>
                    <TeamManagement projectId={id} />
                </section>

                <section>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-slate-900">Audit Logs</h2>
                        <p className="text-slate-500 text-sm">History of important actions in this project.</p>
                    </div>
                    <AuditLogViewer projectId={id} />
                </section>
            </div>
        </div>
    )
}
