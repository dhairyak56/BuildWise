'use client'

import { useState, useMemo } from 'react'
import { ContractVersion } from '@/types/version'
import { X, ArrowLeftRight, FileText } from 'lucide-react'
import { diffLines, Change } from 'diff'

interface VersionCompareProps {
    version1: ContractVersion
    version2: ContractVersion
    isOpen: boolean
    onClose: () => void
}

export function VersionCompare({ version1, version2, isOpen, onClose }: VersionCompareProps) {
    const [viewMode, setViewMode] = useState<'split' | 'unified'>('split')

    const diff = useMemo(() => {
        if (!isOpen || !version1 || !version2) return []
        const text1 = version1.content.text || ''
        const text2 = version2.content.text || ''
        return diffLines(text1, text2)
    }, [isOpen, version1, version2])

    if (!isOpen) return null

    const olderVersion = version1.version_number < version2.version_number ? version1 : version2
    const newerVersion = version1.version_number > version2.version_number ? version1 : version2

    const renderDiffLine = (change: Change, index: number) => {
        if (change.added) {
            return (
                <div key={index} className="bg-green-50 border-l-4 border-green-500 px-4 py-1">
                    <span className="text-green-700 font-mono text-sm whitespace-pre-wrap">
                        + {change.value}
                    </span>
                </div>
            )
        }
        if (change.removed) {
            return (
                <div key={index} className="bg-red-50 border-l-4 border-red-500 px-4 py-1">
                    <span className="text-red-700 font-mono text-sm whitespace-pre-wrap line-through">
                        - {change.value}
                    </span>
                </div>
            )
        }
        return (
            <div key={index} className="px-4 py-1">
                <span className="text-slate-600 font-mono text-sm whitespace-pre-wrap">
                    {change.value}
                </span>
            </div>
        )
    }

    const addedLines = diff.filter(c => c.added).reduce((sum, c) => sum + (c.count || 0), 0)
    const removedLines = diff.filter(c => c.removed).reduce((sum, c) => sum + (c.count || 0), 0)

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Compare Versions</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Version {olderVersion.version_number} → Version {newerVersion.version_number}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Stats */}
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">
                            <span className="font-semibold">{addedLines}</span> additions
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">
                            <span className="font-semibold">{removedLines}</span> deletions
                        </span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('split')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${viewMode === 'split'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            Split View
                        </button>
                        <button
                            onClick={() => setViewMode('unified')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${viewMode === 'unified'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            Unified View
                        </button>
                    </div>
                </div>

                {/* Comparison Content */}
                <div className="flex-1 overflow-hidden">
                    {viewMode === 'split' ? (
                        <div className="grid grid-cols-2 h-full">
                            {/* Older Version */}
                            <div className="border-r border-slate-200 flex flex-col">
                                <div className="px-4 py-3 bg-slate-100 border-b border-slate-200">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-slate-500" />
                                        <span className="text-sm font-semibold text-slate-900">
                                            Version {olderVersion.version_number}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            ({new Date(olderVersion.created_at).toLocaleDateString()})
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">
                                        {olderVersion.content.text}
                                    </pre>
                                </div>
                            </div>

                            {/* Newer Version */}
                            <div className="flex flex-col">
                                <div className="px-4 py-3 bg-slate-100 border-b border-slate-200">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-slate-500" />
                                        <span className="text-sm font-semibold text-slate-900">
                                            Version {newerVersion.version_number}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            ({new Date(newerVersion.created_at).toLocaleDateString()})
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">
                                        {newerVersion.content.text}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full overflow-y-auto">
                            <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 sticky top-0">
                                <div className="flex items-center gap-2">
                                    <ArrowLeftRight className="w-4 h-4 text-slate-500" />
                                    <span className="text-sm font-semibold text-slate-900">
                                        Changes from Version {olderVersion.version_number} to {newerVersion.version_number}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-white">
                                {diff.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500">
                                        <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                        <p>No differences found</p>
                                    </div>
                                ) : (
                                    diff.map((change, index) => renderDiffLine(change, index))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
                    <p className="text-xs text-slate-500">
                        Green highlights show additions • Red highlights show deletions
                    </p>
                </div>
            </div>
        </div>
    )
}
