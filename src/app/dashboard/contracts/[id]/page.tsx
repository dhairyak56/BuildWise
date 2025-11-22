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

async function getContract(id: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch contract
    const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .select('*, projects(*)')
        .eq('id', id)
        .single()

    if (contractError || !contract) {
        return null
    }

    return contract
}

export default async function ContractDetailsPage({ params }: PageProps) {
    const { id } = await params
    const contract = await getContract(id)

    if (!contract) {
        notFound()
    }

    const project = Array.isArray(contract.projects) ? contract.projects[0] : contract.projects

    // Extract contract text from the content field
    let initialContent = ''
    if (contract.content) {
        // Handle JSONB content field
        if (typeof contract.content === 'object' && contract.content.text) {
            initialContent = contract.content.text
        } else if (typeof contract.content === 'string') {
            initialContent = contract.content
        }
    }

    return (
        <div className="space-y-6 h-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/dashboard/contracts"
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Contract Details
                        </h1>
                        <p className="text-slate-500 text-sm">
                            {project?.name || 'Unknown Project'} • {project?.client_name || 'Unknown Client'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${contract.status === 'Signed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                        {contract.status || 'Draft'}
                    </span>
                </div>
            </div>

            <ContractEditor
                projectId={contract.project_id}
                contractId={contract.id}
                initialContent={initialContent}
            />
        </div>
    )
}
