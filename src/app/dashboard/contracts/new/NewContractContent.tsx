'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import { ContractTemplate, TemplateVariables } from '@/types/template'
import { TemplateSelector } from '@/components/contracts/TemplateSelector'
import { TemplateCustomizer } from '@/components/contracts/TemplateCustomizer'
import { Sparkles, FileText, ArrowLeft } from 'lucide-react'

type GenerationMode = 'select' | 'template' | 'ai'

export function NewContractContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const projectId = searchParams.get('projectId')

    const [mode, setMode] = useState<GenerationMode>('select')
    const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null)
    const [projectData, setProjectData] = useState<any>(null)
    const [isGenerating, setIsGenerating] = useState(false)

    useEffect(() => {
        if (projectId) {
            fetchProjectData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId])

    const fetchProjectData = async () => {
        const supabase = createBrowserClient()
        const { data } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single()

        if (data) {
            setProjectData(data)
        }
    }

    const handleTemplateSelect = (template: ContractTemplate) => {
        setSelectedTemplate(template)
        setMode('template')
    }

    const handleGenerateFromTemplate = async (variables: TemplateVariables) => {
        if (!selectedTemplate) return

        setIsGenerating(true)
        try {
            const response = await fetch('/api/generate-contract-from-template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    templateId: selectedTemplate.id,
                    variables,
                    projectId
                })
            })

            if (!response.ok) throw new Error('Failed to generate contract')

            const { contract } = await response.json()

            // Save contract to database
            const supabase = createBrowserClient()
            await supabase.from('contracts').insert({
                project_id: projectId,
                content: { text: contract },
                status: 'Draft'
            })

            // Redirect to project contracts tab
            if (projectId) {
                router.push(`/dashboard/projects/${projectId}?tab=contracts`)
            } else {
                router.push('/dashboard/contracts')
            }
        } catch (error) {
            console.error('Error generating contract:', error)
            alert('Failed to generate contract from template')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleGenerateWithAI = async () => {
        if (!projectData) return

        setIsGenerating(true)
        try {
            const response = await fetch('/api/generate-contract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectName: projectData.name,
                    clientName: projectData.client_name,
                    siteAddress: projectData.address,
                    jobType: projectData.job_type,
                    scopeOfWork: projectData.scope_of_work || '',
                    contractValue: projectData.contract_value?.toString() || '',
                    startDate: projectData.start_date || '',
                    endDate: projectData.end_date || '',
                    projectId
                })
            })

            if (!response.ok) throw new Error('Failed to generate contract')

            const { contract } = await response.json()

            // Save contract to database
            const supabase = createBrowserClient()
            await supabase.from('contracts').insert({
                project_id: projectId,
                content: { text: contract },
                status: 'Draft'
            })

            // Redirect to project contracts tab
            if (projectId) {
                router.push(`/dashboard/projects/${projectId}?tab=contracts`)
            } else {
                router.push('/dashboard/contracts')
            }
        } catch (error) {
            console.error('Error generating contract:', error)
            alert('Failed to generate contract with AI')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => {
                        if (mode !== 'select') {
                            setMode('select')
                            setSelectedTemplate(null)
                        } else {
                            router.back()
                        }
                    }}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {mode !== 'select' ? 'Back to selection' : 'Back'}
                </button>

                <h1 className="text-3xl font-bold text-slate-900">Generate Contract</h1>
                <p className="text-slate-500 mt-2">
                    {mode === 'select' && 'Choose how you want to create your contract'}
                    {mode === 'template' && 'Customize your contract template'}
                    {mode === 'ai' && 'AI will generate a custom contract for you'}
                </p>
            </div>

            {/* Mode Selection */}
            {mode === 'select' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Template Option */}
                    <button
                        onClick={() => setMode('template')}
                        className="p-8 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left group"
                    >
                        <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4 group-hover:bg-blue-100 transition-colors">
                            <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Use a Template</h3>
                        <p className="text-slate-600 mb-4">
                            Choose from professionally crafted contract templates and customize them for your project
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                                Fast
                            </span>
                            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                                Proven
                            </span>
                            <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                                Customizable
                            </span>
                        </div>
                    </button>

                    {/* AI Option */}
                    <button
                        onClick={() => setMode('ai')}
                        className="p-8 bg-white border-2 border-slate-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all text-left group"
                    >
                        <div className="p-3 bg-purple-50 rounded-lg w-fit mb-4 group-hover:bg-purple-100 transition-colors">
                            <Sparkles className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Generate with AI</h3>
                        <p className="text-slate-600 mb-4">
                            Let AI create a custom contract tailored specifically to your project requirements
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                                Smart
                            </span>
                            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                                Custom
                            </span>
                            <span className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded-full border border-orange-200">
                                Flexible
                            </span>
                        </div>
                    </button>
                </div>
            )}

            {/* Template Flow */}
            {mode === 'template' && !selectedTemplate && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <TemplateSelector
                        onSelect={handleTemplateSelect}
                    />
                </div>
            )}

            {mode === 'template' && selectedTemplate && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <TemplateCustomizer
                        template={selectedTemplate}
                        projectData={projectData ? {
                            projectName: projectData.name,
                            clientName: projectData.client_name,
                            siteAddress: projectData.address,
                            jobType: projectData.job_type,
                            scopeOfWork: projectData.scope_of_work,
                            contractValue: projectData.contract_value?.toString(),
                            startDate: projectData.start_date,
                            endDate: projectData.end_date
                        } : undefined}
                        onGenerate={handleGenerateFromTemplate}
                        isGenerating={isGenerating}
                    />
                </div>
            )}

            {/* AI Flow */}
            {mode === 'ai' && (
                <div className="bg-white rounded-xl border border-slate-200 p-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="p-4 bg-purple-50 rounded-full w-fit mx-auto mb-6">
                            <Sparkles className="w-12 h-12 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-semibold text-slate-900 mb-4">AI Contract Generation</h3>
                        <p className="text-slate-600 mb-8">
                            Our AI will analyze your project details and generate a comprehensive, legally sound construction contract tailored to your specific needs.
                        </p>

                        {projectData && (
                            <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left">
                                <h4 className="font-semibold text-slate-900 mb-4">Project Details</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-500">Project:</span>
                                        <p className="font-medium text-slate-900">{projectData.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Client:</span>
                                        <p className="font-medium text-slate-900">{projectData.client_name}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Job Type:</span>
                                        <p className="font-medium text-slate-900">{projectData.job_type}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Value:</span>
                                        <p className="font-medium text-slate-900">${projectData.contract_value}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleGenerateWithAI}
                            disabled={isGenerating}
                            className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg flex items-center gap-3 mx-auto"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Generating Contract...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Generate with AI
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
