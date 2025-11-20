'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
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

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            alert('You must be logged in to save a project.')
            setIsGenerating(false)
            return
        }

        const { error } = await supabase.from('projects').insert({
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
        })

        if (error) {
            console.error('Error saving project:', error)
            alert('Failed to save project. Please try again.')
            setIsGenerating(false)
            return
        }

        // Simulate AI generation delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        setIsGenerating(false)
        router.push('/dashboard/projects')
        router.refresh()
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    New Contract
                </h1>
                <p className="text-slate-500">
                    Create a new construction contract in minutes with AI.
                </p>
            </div>

            <WizardSteps steps={steps} currentStep={currentStep} />

            <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 min-h-[400px] flex flex-col">
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
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-blue-900">Ready to Generate</h3>
                                    <p className="text-sm text-blue-700 mt-1">
                                        AI will now draft a contract based on the details provided. You can edit the result in the next step.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 border-t border-slate-100 pt-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="block text-slate-500">Project</span>
                                        <span className="font-medium text-slate-900">{formData.projectName || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="block text-slate-500">Client</span>
                                        <span className="font-medium text-slate-900">{formData.clientName || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="block text-slate-500">Job Type</span>
                                        <span className="font-medium text-slate-900">{formData.jobType || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="block text-slate-500">Value</span>
                                        <span className="font-medium text-slate-900">${formData.contractValue || '0.00'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1 || isGenerating}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentStep === 1
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={isGenerating}
                        className="flex items-center px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium text-sm transition-colors shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
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
