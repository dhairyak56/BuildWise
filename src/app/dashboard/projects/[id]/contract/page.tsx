import { createClient } from '@/lib/supabase-server'
import { ContractEditor } from '@/components/contracts/ContractEditor'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
    params: Promise<{
        id: string
    }>
}

async function getProjectAndContract(id: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch project
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (projectError || !project) {
        return null
    }

    // Fetch contract
    const { data: contract } = await supabase
        .from('contracts')
        .select('*')
        .eq('project_id', id)
        .single()

    return { project, contract }
}

function generateDefaultContract(project: { client_name: string; name: string; address: string; job_type: string; contract_value: number; start_date: string; end_date: string }) {
    return `CONSTRUCTION CONTRACT

DATE: ${new Date().toLocaleDateString()}

BETWEEN:
Builder: [Your Company Name]
Client: ${project.client_name}

PROJECT:
Name: ${project.name}
Address: ${project.address}

1. SCOPE OF WORK
The Builder shall perform the following work:
${project.job_type} - [Detailed scope to be inserted]

2. CONTRACT PRICE
The Client agrees to pay the Builder the sum of $${project.contract_value} for the work.

3. TIMELINE
Start Date: ${project.start_date || '[TBD]'}
Completion Date: ${project.end_date || '[TBD]'}

4. PAYMENT TERMS
[Payment terms to be inserted]

Signed:
________________________
Builder

________________________
Client
`
}

export default async function ContractPage({ params }: PageProps) {
    const { id } = await params
    const data = await getProjectAndContract(id)

    if (!data) {
        notFound()
    }

    const { project, contract } = data

    // Extract contract text from the content field
    let initialContent = ''
    if (contract?.content) {
        // Handle JSONB content field
        if (typeof contract.content === 'object' && contract.content.text) {
            initialContent = contract.content.text
        } else if (typeof contract.content === 'string') {
            initialContent = contract.content
        }
    }

    // If no contract content, use default template
    if (!initialContent) {
        initialContent = generateDefaultContract(project)
    }

    return (
        <div className="space-y-6 h-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/dashboard/projects"
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {project.name}
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Contract Editor
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${contract?.status === 'Signed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                        {contract?.status || 'Draft'}
                    </span>
                </div>
            </div>

            <ContractEditor
                projectId={project.id}
                initialContent={initialContent}
            />
        </div>
    )
}
