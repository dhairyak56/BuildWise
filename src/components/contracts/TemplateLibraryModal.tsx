'use client'

import { useState } from 'react'
import { X, FileText, Search, Check } from 'lucide-react'
import { DEFAULT_TEMPLATES, populateTemplate } from '@/lib/contract-templates'

interface TemplateLibraryModalProps {
    isOpen: boolean
    onClose: () => void
    onSelectTemplate: (content: string) => void
    projectData?: Record<string, any>
}

export function TemplateLibraryModal({ isOpen, onClose, onSelectTemplate, projectData }: TemplateLibraryModalProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
    const [showPreview, setShowPreview] = useState(false)

    if (!isOpen) return null

    const categories = ['All', ...Array.from(new Set(DEFAULT_TEMPLATES.map(t => t.category)))]

    const filteredTemplates = DEFAULT_TEMPLATES.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const handleSelectTemplate = () => {
        if (selectedTemplate !== null) {
            const template = DEFAULT_TEMPLATES[selectedTemplate]
            const populatedContent = projectData
                ? populateTemplate(template.template_content, projectData)
                : template.template_content
            onSelectTemplate(populatedContent)
            onClose()
        }
    }

    const previewTemplate = selectedTemplate !== null ? DEFAULT_TEMPLATES[selectedTemplate] : null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">Contract Templates</h2>
                            <p className="text-sm text-slate-500 mt-1">Choose a template to get started quickly</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search templates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Template List */}
                    <div className="w-1/2 border-r border-slate-200 overflow-y-auto p-6">
                        <div className="space-y-3">
                            {filteredTemplates.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 text-sm">No templates found</p>
                                </div>
                            ) : (
                                filteredTemplates.map((template, index) => {
                                    const actualIndex = DEFAULT_TEMPLATES.indexOf(template)
                                    const isSelected = selectedTemplate === actualIndex

                                    return (
                                        <button
                                            key={actualIndex}
                                            onClick={() => {
                                                setSelectedTemplate(actualIndex)
                                                setShowPreview(true)
                                            }}
                                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSelected
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <FileText className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                                                        <h3 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                                                            {template.name}
                                                        </h3>
                                                    </div>
                                                    <p className="text-sm text-slate-600 mb-2">{template.description}</p>
                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${isSelected
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {template.category}
                                                    </span>
                                                </div>
                                                {isSelected && (
                                                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                                                )}
                                            </div>
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="w-1/2 overflow-y-auto p-6 bg-slate-50">
                        {showPreview && previewTemplate ? (
                            <div>
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                        {previewTemplate.name}
                                    </h3>
                                    <p className="text-sm text-slate-600">{previewTemplate.description}</p>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-lg p-6 prose prose-sm max-w-none">
                                    <pre className="whitespace-pre-wrap font-sans text-xs text-slate-700 leading-relaxed">
                                        {previewTemplate.template_content.substring(0, 1000)}...
                                    </pre>
                                </div>
                                <p className="text-xs text-slate-500 mt-3">
                                    Preview shows first 1000 characters. Full template will be loaded in editor.
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500 text-sm">Select a template to preview</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600">
                            {selectedTemplate !== null && (
                                <>Selected: <span className="font-medium">{DEFAULT_TEMPLATES[selectedTemplate].name}</span></>
                            )}
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white font-medium text-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSelectTemplate}
                                disabled={selectedTemplate === null}
                                className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Use Template
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
