'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import { WizardSteps } from '@/components/contracts/WizardSteps'
import { ProjectBasicsForm } from '@/components/contracts/forms/ProjectBasicsForm'
import { JobDetailsForm } from '@/components/contracts/forms/JobDetailsForm'
import { CommercialsForm } from '@/components/contracts/forms/CommercialsForm'
import { ArrowRight, ArrowLeft, Loader2, FileText } from 'lucide-react'
import { ProjectFormData } from '@/types/project'

const steps = [
    { id: 1, name: 'Project Basics' },
    { id: 2, name: 'Job Details' },
    { id: 3, name: 'Commercials' },
    { id: 4, name: 'Review' },
]

export default function NewProjectPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [isGenerating, setIsGenerating] = useState(false)
    const [formData, setFormData] = useState<ProjectFormData>({
        projectName: '',
        clientName: '',
        siteAddress: '',
        jobType: '',
        scopeOfWork: '',
        contractValue: '',
        startDate: '',
        endDate: '',
        paymentType: 'milestone',
    })

    const updateFormData = (newData: Partial<ProjectFormData>) => {
        setFormData((prev) => ({ ...prev, ...newData }))
    }

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep((prev) => prev + 1)
        } else {
            handleGenerate()
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1)
        }
    }

    const handleGenerate = async () => {
        setIsGenerating(true)

        const supabase = createBrowserClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            alert('You must be logged in to save a project.')
            setIsGenerating(false)
            return
        }

        // Get the project ID from the response (we need to modify the insert to return data)
        const { data: newProject, error: insertError } = await supabase.from('projects').insert({
            user_id: user.id,
            name: formData.projectName,
            client_name: formData.clientName,
            address: formData.siteAddress,
            job_type: formData.jobType,
            contract_value: parseFloat(formData.contractValue) || 0,
            start_date: formData.startDate || null,
            end_date: formData.endDate || null,
            status: 'Active',
            progress: 0
        }).select().single()

        if (insertError) {
            console.error('Error saving project:', insertError)
            alert(`Failed to save project: ${insertError.message || insertError.details || JSON.stringify(insertError)}`)
            setIsGenerating(false)
            return
        }

        // Call AI to generate contract
        setIsGenerating(true)

        try {
            const response = await fetch('/api/generate-contract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectName: formData.projectName,
                    clientName: formData.clientName,
                    siteAddress: formData.siteAddress,
                    jobType: formData.jobType,
                    scopeOfWork: formData.scopeOfWork,
                    contractValue: formData.contractValue,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    projectId: newProject.id
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.details || errorData.error || 'Failed to generate contract')
            }

            const { contract } = await response.json()

            // Create contract in database
            await supabase.from('contracts').insert({
                project_id: newProject.id,
                content: { text: contract },
                status: 'Draft'
            })

            setIsGenerating(false)
            router.push(`/dashboard/projects/${newProject.id}/contract`)
            router.refresh()
        } catch (error) {
            console.error('Error generating contract:', error)
            alert(`Failed to generate contract: ${error instanceof Error ? error.message : 'Unknown error'}`)
            setIsGenerating(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto font-poppins">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    New Contract
                </h1>
                <p className="text-gray-500">
                    Create a new construction contract in minutes with AI.
                </p>
            </div>

            <WizardSteps steps={steps} currentStep={currentStep} />

            <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 min-h-[400px] flex flex-col">
                <div className="flex-1">
                    {currentStep === 1 && (
                        <ProjectBasicsForm data={formData} updateData={updateFormData} />
                    )}
                    {currentStep === 2 && (
                        <JobDetailsForm data={formData} updateData={updateFormData} />
                    )}
                    {currentStep === 3 && (
                        <CommercialsForm data={formData} updateData={updateFormData} />
                    )}
                    {currentStep === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-[#4A90E2]">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-blue-900">Ready to Generate</h3>
                                    <p className="text-sm text-blue-700 mt-1">
                                        AI will now draft a contract based on the details provided. You can edit the result in the next step.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 border-t border-gray-100 pt-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="block text-gray-500">Project</span>
                                        <span className="font-medium text-gray-900">{formData.projectName || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Client</span>
                                        <span className="font-medium text-gray-900">{formData.clientName || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Job Type</span>
                                        <span className="font-medium text-gray-900">{formData.jobType || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Value</span>
                                        <span className="font-medium text-gray-900">${formData.contractValue || '0.00'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1 || isGenerating}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentStep === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={isGenerating}
                        className="flex items-center px-6 py-2.5 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] font-medium text-sm transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : currentStep === steps.length ? (
                            <>
                                Generate Contract
                                <SparklesIcon className="w-4 h-4 ml-2" />
                            </>
                        ) : (
                            <>
                                Next Step
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M9 3v4" />
            <path d="M3 5h4" />
            <path d="M3 9h4" />
        </svg>
    )
}
