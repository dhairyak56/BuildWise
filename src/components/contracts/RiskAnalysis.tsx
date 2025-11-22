'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle, Shield, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Risk {
    id: string
    category: 'Legal' | 'Financial' | 'Compliance' | 'Timeline'
    severity: 'High' | 'Medium' | 'Low'
    title: string
    description: string
    recommendation: string
}

interface RiskAnalysisProps {
    contractText: string
}

export function RiskAnalysis({ contractText }: RiskAnalysisProps) {
    const [risks, setRisks] = useState<Risk[]>([])
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [hasAnalyzed, setHasAnalyzed] = useState(false)

    const handleAnalyze = async () => {
        setIsAnalyzing(true)
        try {
            const response = await fetch('/api/analyze-risks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contractText })
            })
            const data = await response.json()
            if (data.success) {
                setRisks(data.risks)
                setHasAnalyzed(true)
            }
        } catch (error) {
            console.error('Error analyzing risks:', error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'High': return 'bg-red-50 text-red-700 border-red-200'
            case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200'
            case 'Low': return 'bg-blue-50 text-blue-700 border-blue-200'
            default: return 'bg-slate-50 text-slate-700 border-slate-200'
        }
    }

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'High': return <AlertTriangle className="w-5 h-5 text-red-600" />
            case 'Medium': return <AlertCircle className="w-5 h-5 text-amber-600" />
            case 'Low': return <Shield className="w-5 h-5 text-blue-600" />
            default: return <Shield className="w-5 h-5 text-slate-600" />
        }
    }

    if (!hasAnalyzed) {
        return (
            <div className="text-center py-8">
                <div className="mb-4">
                    <Shield className="w-12 h-12 text-slate-300 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">AI Risk Analysis</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    Scan your contract for potential legal, financial, and compliance risks using our advanced AI.
                </p>
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Analyzing Contract...
                        </>
                    ) : (
                        <>
                            <Shield className="w-5 h-5 mr-2" />
                            Analyze Risks
                        </>
                    )}
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Risk Analysis Report
                </h3>
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    Re-analyze
                </button>
            </div>

            <div className="grid gap-4">
                {risks.length === 0 ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-emerald-900">No significant risks detected</h4>
                            <p className="text-sm text-emerald-700 mt-1">The contract appears to be standard and low risk.</p>
                        </div>
                    </div>
                ) : (
                    risks.map((risk) => (
                        <div key={risk.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start gap-4">
                                <div className={cn("p-2 rounded-lg", getSeverityColor(risk.severity).split(' ')[0])}>
                                    {getSeverityIcon(risk.severity)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-slate-900">{risk.title}</h4>
                                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", getSeverityColor(risk.severity))}>
                                            {risk.severity} Risk
                                        </span>
                                    </div>
                                    <p className="text-slate-600 text-sm mb-3">{risk.description}</p>
                                    <div className="bg-slate-50 rounded-lg p-3 text-sm">
                                        <span className="font-medium text-slate-700 block mb-1">Recommendation:</span>
                                        <p className="text-slate-600">{risk.recommendation}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
