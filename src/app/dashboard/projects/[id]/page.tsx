import { createClient } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'


interface PageProps {
    params: Promise<{
        id: string
    }>
}

async function getProject(id: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (error || !project) {
        return null
    }

    // Get contract for this project
    const { data: contract } = await supabase
        .from('contracts')
        .select('*')
        .eq('project_id', id)
        .single()

    return { project, contract }
}

import { ProjectDetailsView } from '@/components/projects/ProjectDetailsView'

export default async function ProjectDetailsPage({ params }: PageProps) {
    const { id } = await params
    const data = await getProject(id)

    if (!data) {
        notFound()
    }

    const { project, contract } = data

    return <ProjectDetailsView initialProject={project} contract={contract} />
}
