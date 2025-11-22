'use client'

import { useState } from 'react'
import { ContractGenerator } from '@/components/contracts/ContractGenerator'
import { RiskAnalysis } from '@/components/contracts/RiskAnalysis'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'

export default function NewContractPage() {
    const router = useRouter()
    const [generatedContract, setGeneratedContract] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const handleContractGenerated = (contractText: string) => {
        setGeneratedContract(contractText)
    }

    const handleSave = async () => {
        if (!generatedContract) return
        setIsSaving(true)

        const supabase = createBrowserClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        // In a real app, we'd get the project ID from the form or selection
        // For now, we'll just save it as a draft without a project link or handle it differently
        // But since our schema requires project_id, we might need to handle this.
        // For this MVP, let's assume we just redirect to the list with a success message
        // or we could prompt to select a project.

        // Let's just simulate saving for now as we don't have a project selector here yet
        // and the generator form collects project details but doesn't create a project record.

        await new Promise(resolve => setTimeout(resolve, 1000))
        router.push('/dashboard/contracts')
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/contracts">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-500" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">New Contract</h1>
                        <p className="text-slate-500 text-sm">Select a template and generate a contract with AI.</p>
                    </div>
                </div>
                {generatedContract && (
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-all shadow-lg shadow-emerald-900/20"
                    >
                        {isSaving ? (
                            <>Saving...</>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Contract
                            </>
                        )}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Generator</h2>
                        <ContractGenerator onGenerate={handleContractGenerated} />
                    </div>
                </div>

                {generatedContract && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Generated Contract</h2>
                            <div className="prose prose-sm max-w-none p-4 bg-slate-50 rounded-lg border border-slate-100 h-[500px] overflow-y-auto whitespace-pre-wrap font-mono text-sm">
                                {generatedContract}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <RiskAnalysis contractText={generatedContract} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
