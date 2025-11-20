'use client'

import { X, AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react'

interface Risk {
    id: string
    category: 'Legal' | 'Financial' | 'Compliance' | 'Timeline'
    severity: 'High' | 'Medium' | 'Low'
    title: string
    description: string
    recommendation: string
    clauseReference?: string
}

interface RiskPanelProps {
    risks: Risk[]
    isOpen: boolean
    onClose: () => void
}

export function RiskPanel({ risks, isOpen, onClose }: RiskPanelProps) {
    if (!isOpen) return null

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'High':
                return 'bg-rose-50 text-rose-700 border-rose-200'
            case 'Medium':
                return 'bg-amber-50 text-amber-700 border-amber-200'
            case 'Low':
                return 'bg-blue-50 text-blue-700 border-blue-200'
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200'
        }
    }

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'High':
                return <AlertTriangle className="w-4 h-4" />
            case 'Medium':
                return <AlertCircle className="w-4 h-4" />
            case 'Low':
                return <Info className="w-4 h-4" />
            default:
                return <Info className="w-4 h-4" />
        }
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Legal':
                return 'bg-purple-100 text-purple-700'
            case 'Financial':
                return 'bg-emerald-100 text-emerald-700'
            case 'Compliance':
                return 'bg-blue-100 text-blue-700'
            case 'Timeline':
                return 'bg-orange-100 text-orange-700'
            default:
                return 'bg-slate-100 text-slate-700'
        }
    }

    const risksByCategory = risks.reduce((acc, risk) => {
        if (!acc[risk.category]) {
            acc[risk.category] = []
        }
        acc[risk.category].push(risk)
        return acc
    }, {} as Record<string, Risk[]>)

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Risk Analysis</h2>
                            <p className="text-sm text-slate-500">
                                {risks.length} {risks.length === 1 ? 'risk' : 'risks'} identified
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {risks.length === 0 ? (
                        <div className="text-center py-12">
                            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Risks Detected</h3>
                            <p className="text-slate-500">This contract appears to be well-structured with no major risks identified.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(risksByCategory).map(([category, categoryRisks]) => (
                                <div key={category}>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(category)} mr-2`}>
                                            {category}
                                        </span>
                                        {categoryRisks.length} {categoryRisks.length === 1 ? 'risk' : 'risks'}
                                    </h3>
                                    <div className="space-y-3">
                                        {categoryRisks.map((risk) => (
                                            <div
                                                key={risk.id}
                                                className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition-colors"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium border flex items-center space-x-1 ${getSeverityColor(risk.severity)}`}>
                                                            {getSeverityIcon(risk.severity)}
                                                            <span>{risk.severity}</span>
                                                        </span>
                                                    </div>
                                                    {risk.clauseReference && (
                                                        <span className="text-xs text-slate-500 italic">
                                                            {risk.clauseReference}
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="font-semibold text-slate-900 mb-2">{risk.title}</h4>
                                                <p className="text-sm text-slate-600 mb-3">{risk.description}</p>
                                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                                    <p className="text-xs font-medium text-blue-900 mb-1">Recommendation:</p>
                                                    <p className="text-sm text-blue-700">{risk.recommendation}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium text-sm transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
