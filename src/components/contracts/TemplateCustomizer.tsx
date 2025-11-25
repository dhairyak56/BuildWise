'use client'

import { useState } from 'react'
import { ContractTemplate, TemplateVariables } from '@/types/template'
import { FileText, Sparkles } from 'lucide-react'

interface TemplateCustomizerProps {
    template: ContractTemplate
    projectData?: {
        projectName?: string
        clientName?: string
        siteAddress?: string
        jobType?: string
        scopeOfWork?: string
        contractValue?: string
        startDate?: string
        endDate?: string
    }
    onGenerate: (variables: TemplateVariables) => void
    isGenerating?: boolean
}

export function TemplateCustomizer({ template, projectData, onGenerate, isGenerating }: TemplateCustomizerProps) {
    const [variables, setVariables] = useState<TemplateVariables>(() => {
        // Pre-fill with project data if available
        const initial: TemplateVariables = {}

        if (projectData) {
            initial['{{PROJECT_NAME}}'] = projectData.projectName || ''
            initial['{{CLIENT_NAME}}'] = projectData.clientName || ''
            initial['{{SITE_ADDRESS}}'] = projectData.siteAddress || ''
            initial['{{SCOPE_OF_WORK}}'] = projectData.scopeOfWork || ''
            initial['{{CONTRACT_VALUE}}'] = projectData.contractValue || ''
            initial['{{START_DATE}}'] = projectData.startDate || ''
            initial['{{END_DATE}}'] = projectData.endDate || ''
        }

        // Initialize all template variables
        template.template_variables.forEach(variable => {
            if (!initial[variable]) {
                initial[variable] = ''
            }
        })

        return initial
    })

    const handleVariableChange = (variable: string, value: string) => {
        setVariables(prev => ({ ...prev, [variable]: value }))
    }

    const getVariableLabel = (variable: string) => {
        // Convert {{VARIABLE_NAME}} to "Variable Name"
        return variable
            .replace(/{{|}}/g, '')
            .split('_')
            .map(word => word.charAt(0) + word.slice(1).toLowerCase())
            .join(' ')
    }

    const getVariableType = (variable: string): 'text' | 'number' | 'date' => {
        const varName = variable.toLowerCase()
        if (varName.includes('date')) return 'date'
        if (varName.includes('value') || varName.includes('amount') || varName.includes('percent')) return 'number'
        return 'text'
    }

    const isFormValid = () => {
        // Check if all required variables are filled
        return template.template_variables.every(variable => {
            const value = variables[variable]
            return value && value.trim().length > 0
        })
    }

    return (
        <div className="space-y-6">
            {/* Template Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-blue-900">{template.name}</h3>
                        <p className="text-sm text-blue-700 mt-1">{template.description}</p>
                        <p className="text-xs text-blue-600 mt-2">
                            {template.template_content.sections.length} sections • {template.template_variables.length} variables to customize
                        </p>
                    </div>
                </div>
            </div>

            {/* Variable Inputs */}
            <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-4">Customize Contract Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {template.template_variables.map(variable => (
                        <div key={variable}>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {getVariableLabel(variable)}
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type={getVariableType(variable)}
                                value={variables[variable] || ''}
                                onChange={(e) => handleVariableChange(variable, e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder={`Enter ${getVariableLabel(variable).toLowerCase()}`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Preview Sections */}
            <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Contract Sections Preview</h4>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                        {template.template_content.sections.map((section, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
                                <h5 className="font-semibold text-slate-900 mb-2">{section.title}</h5>
                                <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                    {section.content.substring(0, 200)}
                                    {section.content.length > 200 && '...'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                    onClick={() => onGenerate(variables)}
                    disabled={!isFormValid() || isGenerating}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {isGenerating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating Contract...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            Generate Contract from Template
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
