'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, FileText, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const templates = [
    {
        id: 'residential',
        name: 'Residential Construction Agreement',
        description: 'Standard contract for home building and major renovations.',
        category: 'Residential'
    },
    {
        id: 'subcontractor',
        name: 'Subcontractor Agreement',
        description: 'Agreement between general contractor and subcontractor.',
        category: 'Subcontractor'
    },
    {
        id: 'renovation',
        name: 'Home Renovation Contract',
        description: 'Specific for remodeling and renovation projects.',
        category: 'Residential'
    }
]

export function ContractGenerator({ onGenerate }: { onGenerate: (contractText: string) => void }) {
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [formData, setFormData] = useState({
        projectName: '',
        clientName: '',
        contractValue: '',
        startDate: '',
        endDate: ''
    })

    const handleGenerate = async () => {
        if (!selectedTemplate) return
        setIsGenerating(true)

        try {
            const response = await fetch('/api/generate-contract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    jobType: templates.find((t: { id: string; name: string }) => t.id === selectedTemplate)?.name
                })
            })

            const data = await response.json()

            if (data.success && data.contract) {
                onGenerate(data.contract)
            } else {
                alert('Failed to generate contract: ' + (data.error || 'Unknown error'))
            }
        } catch (error) {
            console.error('Error generating contract:', error)
            alert('An error occurred while generating the contract.')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* Template Selection */}
            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">1. Select Template</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={cn(
                                "cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md",
                                selectedTemplate === template.id
                                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                                    : "border-slate-200 bg-white hover:border-blue-300"
                            )}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    selectedTemplate === template.id ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                                )}>
                                    <FileText className="w-5 h-5" />
                                </div>
                                {selectedTemplate === template.id && (
                                    <div className="bg-blue-600 text-white p-1 rounded-full">
                                        <Check className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
                            <p className="text-sm text-slate-500">{template.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Project Details Form */}
            {selectedTemplate && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">2. Project Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="projectName" className="text-sm font-medium text-slate-700">Project Name</label>
                            <input
                                id="projectName"
                                type="text"
                                value={formData.projectName}
                                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g. Smith Residence Renovation"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="clientName" className="text-sm font-medium text-slate-700">Client Name</label>
                            <input
                                id="clientName"
                                type="text"
                                value={formData.clientName}
                                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g. John Smith"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="contractValue" className="text-sm font-medium text-slate-700">Contract Value</label>
                            <input
                                id="contractValue"
                                type="text"
                                value={formData.contractValue}
                                onChange={(e) => setFormData({ ...formData, contractValue: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g. 50000"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Start Date</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">End Date</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-8">
                        <button
                            onClick={handleGenerate}
                            disabled={!selectedTemplate || isGenerating || !formData.projectName || !formData.clientName}
                            className={cn(
                                "inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all shadow-lg",
                                !selectedTemplate || isGenerating || !formData.projectName || !formData.clientName
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/25 hover:-translate-y-0.5"
                            )}
                        >
                            {isGenerating ? (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                                    Generating with AI...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Generate Contract
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
