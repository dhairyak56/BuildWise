'use client'

import { useState, useEffect } from 'react'
import { ContractTemplate } from '@/types/template'
import { FileText, Check, Loader2 } from 'lucide-react'

interface TemplateSelectorProps {
    onSelect: (template: ContractTemplate) => void
    selectedTemplateId?: string
}

const CATEGORY_LABELS = {
    residential: 'Residential',
    commercial: 'Commercial',
    renovation: 'Renovation & Extension',
    subcontractor: 'Subcontractor'
}

const CATEGORY_COLORS = {
    residential: 'bg-blue-50 border-blue-200 text-blue-700',
    commercial: 'bg-purple-50 border-purple-200 text-purple-700',
    renovation: 'bg-green-50 border-green-200 text-green-700',
    subcontractor: 'bg-orange-50 border-orange-200 text-orange-700'
}

export function TemplateSelector({ onSelect, selectedTemplateId }: TemplateSelectorProps) {
    const [templates, setTemplates] = useState<ContractTemplate[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    useEffect(() => {
        fetchTemplates()
    }, [])

    const fetchTemplates = async () => {
        try {
            const response = await fetch('/api/templates')
            if (!response.ok) throw new Error('Failed to fetch templates')
            const data = await response.json()
            setTemplates(data)
        } catch (error) {
            console.error('Error fetching templates:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredTemplates = selectedCategory
        ? templates.filter(t => t.category === selectedCategory)
        : templates

    const categories = Array.from(new Set(templates.map(t => t.category)))

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Choose a Template</h3>
                <p className="text-sm text-slate-500">Select a pre-built contract template to customize for your project</p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${selectedCategory === null
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    All Templates
                </button>
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${selectedCategory === category
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                    </button>
                ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map(template => (
                    <button
                        key={template.id}
                        onClick={() => onSelect(template)}
                        className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${selectedTemplateId === template.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200 hover:border-blue-300'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="p-2 bg-white rounded-lg border border-slate-200">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            {selectedTemplateId === template.id && (
                                <div className="p-1 bg-blue-600 rounded-full">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>

                        <h4 className="font-semibold text-slate-900 mb-2">{template.name}</h4>
                        <p className="text-sm text-slate-500 mb-3">{template.description}</p>

                        <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full border ${CATEGORY_COLORS[template.category as keyof typeof CATEGORY_COLORS]
                                }`}>
                                {CATEGORY_LABELS[template.category as keyof typeof CATEGORY_LABELS]}
                            </span>
                            <span className="text-xs text-slate-400">
                                {template.template_content.sections.length} sections
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {filteredTemplates.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No templates found in this category</p>
                </div>
            )}
        </div>
    )
}
